import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { IUploadMultiFile, IUploadMultiInfo, acceptFile_PDF_JPG, maxFileSize } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils/util';
import { DocumentDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';

export interface AmountFormDto {
  amount?: string;
  imageId?: string;
  fileName?: string;
}

@Component({
  selector: 'app-upload-file-amount-table-v2',
  templateUrl: './upload-file-amount-table-v2.component.html',
  styleUrls: ['./upload-file-amount-table-v2.component.scss'],
})
export class UploadFileAmountTableV2Component implements OnInit {
  @ViewChild('uploadTable') uploadTable!: MatTable<any>;
  // ########### copied from UploadMultiFileContentComponent ##################
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;

  @Input() uploadMultiInfo!: IUploadMultiInfo;
  @Input() list!: IUploadMultiFile[];
  @Input() isViewMode!: boolean;

  @Output() documentChange = new EventEmitter<Array<AmountFormDto>>();

  /* form */
  public uploadForm: UntypedFormGroup = this.initNodataForm();
  public fileUploadColumns: string[] = ['order', 'amount', 'file'];
  public fileUploadViewColumns: string[] = ['order', 'amount'];
  public acceptFile: Array<string> = acceptFile_PDF_JPG;

  private mainDocumentTemplateId: string = '';
  private maxFileSize: number = maxFileSize; // MB Size

  get documents() {
    return this.uploadForm.controls['documents'] as UntypedFormArray;
  }

  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService,
    private fb: UntypedFormBuilder,
    private documentService: DocumentService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    try {
      if (!this.list || (this.list?.length || 0) === 0) {
        this.logger.error('throw List must have length');
        throw new Error('List must have length');
      }
      this.uploadForm = this.initForm();
      this.mainDocumentTemplateId = this.list[0]?.documentTemplateId ?? '';
    } catch (error) {
      this.logger.catchError('Init UploadFileAmountTableV2 :: ', error);
    }
  }

  private onCheckRemoveDupEmptyRow(): void {
    const index = (this.documents.value as Array<AmountFormDto>).findIndex(dto => !dto.imageId && !dto.amount);
    if (index < 0) return;
    if (index >= 0 && index === (this.documents.value?.length ?? 0) - 1) return;
    this.removeDocumentAtIndex(index);
  }

  getImageIdAtIndex(index: number) {
    const fg = this.documents.at(index) as UntypedFormGroup;
    return fg.controls['imageId'];
  }

  getFileNameAtIndex(index: number) {
    const fg = this.documents.at(index) as UntypedFormGroup;
    return fg.controls['fileName'];
  }

  getAmountAtIndex(index: number) {
    const fg = this.documents.at(index) as UntypedFormGroup;
    return fg.controls['amount'];
  }

  private removeDocumentAtIndex(index: number) {
    this.documents.removeAt(index);
    this.uploadTable?.renderRows();
  }

  onAmountChange() {
    this.onCheckRemoveDupEmptyRow();
    this.documentChange.emit(this.documents.value as AmountFormDto[]);
    this.onCheckAddNewTableRow();
  }

  private onCheckAddNewTableRow() {
    const lastIndex = this.documents.length - 1;
    if (!!this.getImageIdAtIndex(lastIndex).value && !!this.getAmountAtIndex(lastIndex).value) {
      this.generateNewTableRow();
    }
  }

  private initNodataForm() {
    return this.fb.group({
      documents: this.fb.array([
        this.fb.group({
          amount: [null, [Validators.required]],
          imageId: [null, [Validators.required]],
          fileName: [null],
        }),
      ]),
    });
  }
  private initForm() {
    // initial form using 'list'
    let formArray = [];
    for (let i in this.list) {
      formArray.push(
        this.fb.group({
          amount: [this.list[i].coupleDeliveryFee || null, [Validators.required]],
          imageId: [this.list[i].imageId || null, [Validators.required]],
          fileName: [this.list[i].documentTemplate?.documentName || null],
        })
      );
    }

    if (
      !this.isViewMode &&
      !!this.list[this.list?.length - 1] &&
      !!this.list[this.list?.length - 1].imageId &&
      !!this.list[this.list?.length - 1].coupleDeliveryFee
    ) {
      formArray.push(
        this.fb.group({
          amount: [null, [Validators.required]],
          imageId: [null, [Validators.required]],
          fileName: [null],
        })
      );
    }

    return this.fb.group({
      documents: this.fb.array(formArray),
    });
  }

  private generateNewTableRow() {
    this.documents.push(
      this.fb.group({
        amount: [null, [Validators.required]],
        imageId: [null, [Validators.required]],
        fileName: [null],
      })
    );
    this.uploadTable?.renderRows();
  }

  isValidForm(): boolean {
    if (this.list.length === 0) return true;

    // each one must contains values of imageId and coupleDeliveryFee.
    // ** coupleDeliveryFee value can be zero.
    for (let i in this.documents.value) {
      // index last ไม่เช็คถ้าว่างหมด true, เช็คถ้ามีการกรอกค่าอย่างใดอย่างหนึ่ง false
      if (Number(i) !== 0 && Number(i) === this.documents?.value?.length - 1) {
        if (!this.getImageIdAtIndex(Number(i)).value && !this.getAmountAtIndex(Number(i)).value) {
          this.documents.markAsPristine();
          return true;
        } else {
          this.documents.markAllAsTouched();
          return false;
        }
      } else {
        if (!this.getImageIdAtIndex(Number(i)).value || !this.getAmountAtIndex(Number(i)).value) {
          this.documents.markAllAsTouched();
          return false;
        }
      }
    }
    return true;
  }

  onUploadDocument(_index: number, documentTemplateId: string = this.mainDocumentTemplateId) {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = async (event: Event) => {
      const element = event.target as HTMLInputElement;
      const fileList = element?.files || [];
      for (let index = 0; index < fileList.length; index++) {
        const file = this.documentService.validateFileType(fileList[index]);
        if (Utils.validateFileSize(file.size)) {
          this.getImageIdAtIndex(_index).setValue((await this.uploadDocument(file, documentTemplateId)) ?? '');
          this.getFileNameAtIndex(_index).setValue(file.name);
          this.documentChange.emit(this.documents.value);
          this.onCheckAddNewTableRow();
        } else {
          this.getImageIdAtIndex(_index).setValue('');
          this.getFileNameAtIndex(_index).setValue('');
          this.notificationService.openSnackbarError(
            this.translate.instant('UPLOAD_FILE.ERROR_FILE_SIZE_EXCEED', { SIZE_EXCEED: this.maxFileSize.toString() })
          );
        }
      }
      element.value = '';
    };
    fileInput.click();
  }

  onRemoveDocument(_index: number) {
    this.getImageIdAtIndex(_index).setValue('');
    this.getFileNameAtIndex(_index).setValue('');
    this.onCheckRemoveDupEmptyRow();
    this.documentChange.emit(this.documents.value);
  }

  private async uploadDocument(_file: File, documentTemplateId: string) {
    try {
      const response = await this.documentService.uploadDocument(
        this.uploadMultiInfo.cif || '',
        documentTemplateId,
        _file,
        this.uploadMultiInfo.litigationId || ''
      );
      return response ? response.uploadSessionId : null;
    } catch (error) {
      return null;
    }
  }

  async onDownloadDocument(_index: number) {
    const response: any = await this.documentService.getDocument(
      this.getImageIdAtIndex(_index).value || '',
      DocumentDto.ImageSourceEnum.Lexs
    );
    const { type } = response;
    Utils.saveAsStrToBlobFile(response, this.getFileNameAtIndex(_index).value || 'file' + type, type);
  }

  async onViewDocument(_index: number) {
    const response: any = await this.documentService.getDocument(
      this.getImageIdAtIndex(_index).value || '',
      DocumentDto.ImageSourceEnum.Lexs
    );
    if (!response) return;
    const fileName = this.getImageIdAtIndex(_index).value ?? 'doc';
    this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
  }
}
