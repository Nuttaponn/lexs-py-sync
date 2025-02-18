import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { CourtService } from '@app/modules/court/court.service';
import { IUploadMultiInfo, acceptFile_PDF_JPG, maxFileSize } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils/util';
import { DocumentDto, DocumentUploadResponse, ReceiptFormDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DocumentService } from '../document-preparation/document.service';
import { DOC_TEMPLATE } from '@app/shared/constant';

export interface UploadFileAmountOutput {
  amount: string | undefined;
  file: DocumentDto | undefined;
}

@Component({
  selector: 'app-upload-file-amount-table',
  templateUrl: './upload-file-amount-table.component.html',
  styleUrls: ['./upload-file-amount-table.component.scss'],
})
export class UploadFileAmountTableComponent implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService,
    private fb: UntypedFormBuilder,
    private documentService: DocumentService,
    private courtService: CourtService
  ) {}

  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  @ViewChild('uploadTable') uploadTable!: MatTable<any>;

  @Input() amountTableHeaderText: string = '';
  @Input() fileTableHeaderText: string = '';
  @Input() amountInputPlaceholder: string = 'ระบุ';
  @Input() uploadForm: UntypedFormGroup = this.fb.group({
    documents: this.fb.array([
      this.fb.group({
        amount: [null, [Validators.required]],
        file: [null, [Validators.required]],
      }),
    ]),
  });

  @Input() showTotal: boolean = false;
  @Input() documentTemplateId: string = DOC_TEMPLATE.LEXSF065;
  @Input() uploadMultiInfo: IUploadMultiInfo = { cif: '', litigationId: '' };
  @Input() mode: 'EXECUTION_FEE' | 'NORMAL' = 'NORMAL';
  @Input() taskId: number = 0;
  @Input() maxFileSize: number = maxFileSize;
  @Input() acceptFile: Array<string> = acceptFile_PDF_JPG;

  @Output()
  documentChange = new EventEmitter<Array<UploadFileAmountOutput>>();

  public tableData: any[] = [];
  public fileUploadColumns: string[] = ['order', 'amount', 'file'];
  public placeholder: string = '';

  ngOnInit() {
    this.tableData = this.getTableData();
  }

  get documents() {
    return this.uploadForm.controls['documents'] as UntypedFormArray;
  }
  getTableData() {
    if (this.showTotal) {
      let total = 0;
      for (let i = 0; i < this.documents.controls.length; i++) {
        total +=
          !this.getDocumentAtIndex(i, 'amount')?.value || this.getDocumentAtIndex(i, 'amount')?.value === ''
            ? 0
            : parseFloat(this.getDocumentAtIndex(i, 'amount')?.value);
      }
      const totalRow = [{ isTotal: true, amount: total }];
      return (this.documents.controls as any[]).concat(totalRow);
    } else {
      return this.documents.controls;
    }
  }

  selectDocument(fileIndex: number) {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = () => {
      for (let index = 0; index < fileInput.files.length; index++) {
        const file = fileInput.files[index];
        this.uploadDocument(file, fileIndex);
      }
    };
    fileInput.click();
  }

  onAmountChange(index: number, event: any) {
    // set validators
    const documentControl = this.getDocumentAtIndex(index, 'file');
    if (event.target.value !== '') {
      documentControl?.setValidators([Validators.required]);
    } else if (!documentControl?.value && this.documents.controls.length > 1) {
      documentControl?.setValidators(null);
    }
    documentControl?.updateValueAndValidity();

    this.tableData = this.getTableData();
    this.uploadTable.renderRows();
    this.documentChange.emit(this.documents.value);
  }

  async uploadDocument(file: any, index: number) {
    if (!this.acceptFile.includes(file.type)) {
      this.notificationService.openSnackbarError(` ${this.translate.instant('DOC_PREP.UPLOAD_FAIL')}`);
      return;
    }
    if (!Utils.validateFileSize(file.size, this.maxFileSize)) {
      this.notificationService.openSnackbarError(
        this.translate.instant('UPLOAD_FILE.ERROR_FILE_SIZE_EXCEED', { SIZE_EXCEED: this.maxFileSize.toString() })
      );
      return;
    }
    const isReupload = this.getDocumentAtIndex(index, 'file')?.value;

    let uploadRes;
    if (this.mode === 'NORMAL') {
      uploadRes = await this.documentService.uploadDocument(
        this.uploadMultiInfo.cif,
        this.documentTemplateId,
        file,
        this.uploadMultiInfo.litigationId
      );
    } else if (this.mode === 'EXECUTION_FEE') {
      uploadRes = await this.courtService.readReceiptFormExecutionFee(this.taskId, 'RECEIPT', file);
    }
    if (uploadRes) {
      if (this.mode === 'NORMAL') {
        this.getDocumentAtIndex(index, 'file')?.setValue({
          documentTemplateId: this.documentTemplateId,
          active: true,
          documentId: 0,
          imageId: (uploadRes as DocumentUploadResponse).uploadSessionId,
          documentDate: new Date().toISOString(),
          documentName: file.name,
        });
      } else if (this.mode === 'EXECUTION_FEE') {
        const uploadedDoc = (uploadRes as ReceiptFormDto).documentDetailList?.[0];
        this.getDocumentAtIndex(index, 'file')?.setValue({
          documentTemplateId: uploadedDoc?.documentTemplateId,
          active: true,
          documentId: uploadedDoc?.documentId,
          imageId: uploadedDoc?.imageId,
          documentDate: new Date().toISOString(),
          documentName: file.name,
        });
        // @ts-ignore: await swagger update
        this.getAmountAtIndex(index)?.setValue(uploadedDoc.amount);
      }
      // set validators
      this.getDocumentAtIndex(index, 'amount')?.addValidators(Validators.required);
      this.getDocumentAtIndex(index, 'amount')?.updateValueAndValidity();

      // add new row after upload
      if (index + 1 >= this.documents.controls.length && !isReupload) {
        this.documents.push(
          this.fb.group({
            amount: [undefined, []],
            file: [undefined, []],
          })
        );
        this.tableData = this.getTableData();
        this.uploadTable.renderRows();
      }

      this.documentChange.emit(this.documents.value);
    } else {
      this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
    }
  }

  getDocumentAtIndex(index: number, key: string) {
    const fg = this.documents.at(index) as UntypedFormGroup;
    return fg.controls ? fg.controls[key] : undefined;
  }

  removeDocumentAtIndex(index: number) {
    // remove entire row
    this.documents.removeAt(index);
    if (this.documents.controls.length === 1) {
      this.getDocumentAtIndex(0, 'file')?.setValidators([Validators.required]);
      this.getDocumentAtIndex(0, 'file')?.updateValueAndValidity();
      this.getDocumentAtIndex(0, 'amount')?.setValidators([Validators.required]);
      this.getDocumentAtIndex(0, 'amount')?.updateValueAndValidity();
    }
    this.tableData = this.getTableData();
    this.uploadTable.renderRows();
  }

  rowHasErrors(formRow: UntypedFormGroup) {
    return formRow.controls
      ? (formRow.controls['amount'].errors && formRow.controls['amount'].touched) ||
        (formRow.controls['file'].errors && formRow.controls['file'].touched)
        ? true
        : false
      : false;
  }
}
