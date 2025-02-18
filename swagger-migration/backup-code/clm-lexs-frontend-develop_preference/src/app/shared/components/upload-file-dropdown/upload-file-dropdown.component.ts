import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DOC_TEMPLATE } from '@app/shared/constant';
import {
  IERRORS_UPLOAD,
  IUploadMultiFile,
  IUploadMultiInfo,
  acceptFile_PDF_JPG,
  maxFileSize,
} from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils';
import { DocumentDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig } from '@spig/core';
import { DocumentService } from '../document-preparation/document.service';

@Component({
  selector: 'app-upload-file-dropdown',
  templateUrl: './upload-file-dropdown.component.html',
  styleUrls: ['./upload-file-dropdown.component.scss'],
})
export class UploadFileDropdownComponent implements OnInit {
  public _column: Array<string> = ['no', 'documentName', 'uploadDate', 'command'];
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;

  @Input() readonly: boolean = false;
  @Input() uploadMultiInfo!: IUploadMultiInfo;
  @Input() list: any[] = [];
  @Input() documentNameOptions: any[] = [];
  @Input() defaultDocumentName: string | undefined;
  @Input() btnUpload: Array<string> = ['COMMON.BUTTON_UPLOAD', 'COMMON.BUTTON_UPLOAD'];
  @Input() maxFileSize: number = maxFileSize; // MB Size
  @Input() acceptFile: Array<string> = acceptFile_PDF_JPG;
  @Input() labelAcceptFile: string = 'COMMON.UPLOAD_FILE_SUPPORT';
  @Output() uploadFileEvent = new EventEmitter<IUploadMultiFile[] | null>();

  @Output() uploadError = new EventEmitter<HttpErrorResponse | IERRORS_UPLOAD | unknown | null>(); // LEX2-3276 handle error code from BE
  public exceedFileSize: boolean = false;
  public isErrorFiletypeOrFileSize = false;
  public documentNameConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'documentTemplateId',
    searchPlaceHolder: '',
    labelPlaceHolder: '',
    disableFloatLabel: true,
  };

  public documentCtr = new UntypedFormControl();
  private ERROR_CODE_FILE_TYPE_F015 = 'F015';
  private ERROR_CODE_FILE_TYPE_D025 = 'D025';
  constructor(
    private documentService: DocumentService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.defaultDocumentName) this.documentCtr.setValue(this.defaultDocumentName);
  }

  isOptionalDocument(documentTemplateId: string) {
    return documentTemplateId && [DOC_TEMPLATE.LEXSF112].includes(documentTemplateId);
  }

  onUploadDocument(_index: number, documentTemplateId: string = '') {
    let fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = async (event: Event) => {
      const element = event.target as HTMLInputElement;
      const fileList = element?.files || [];
      for (let index = 0; index < fileList.length; index++) {
        const file = this.documentService.validateFileType(fileList[index]);
        if (Utils.validateFileSize(file.size)) {
          this.list[_index].imageId = await this.uploadDocument(file, this.documentCtr.value);
          this.list[_index].isUpload = this.list[_index].imageId ? true : false;
          this.list[_index].uploadTimestamp = this.list[_index].imageId ? new Date().toDateString() : '';
          this.list[_index].documentDate = this.list[_index].imageId ? new Date().toISOString() : '';
          this.uploadFileEvent.emit(this.list);
        } else {
          this.exceedFileSize = true;
          this.isErrorFiletypeOrFileSize = true;
          this.list[_index].imageId = '';
          this.list[_index].isUpload = false;
          this.list[_index].uploadTimestamp = '';
          this.list[_index].documentDate = '';
          this.uploadFileEvent.emit(this.list);
          this.notificationService.openSnackbarError(
            this.translate.instant('UPLOAD_FILE.ERROR_FILE_SIZE_EXCEED', {
              SIZE_EXCEED: this.maxFileSize.toString(),
            })
          );
        }
      }
      element.value = '';
    };
    fileInput.click();
  }

  async uploadDocument(_file: File, documentTemplateId: string) {
    try {
      let response;

      response = await this.documentService.uploadDocument(
        this.uploadMultiInfo.cif || '',
        documentTemplateId,
        _file,
        this.uploadMultiInfo.litigationId || ''
      );
      return response ? response.uploadSessionId : null;
    } catch (error: any) {
      const codes = error?.error?.errors?.map((it: any) => it.code);
      if (
        error?.error?.code === this.ERROR_CODE_FILE_TYPE_F015 ||
        (codes && (codes.includes(this.ERROR_CODE_FILE_TYPE_D025) || codes.includes(this.ERROR_CODE_FILE_TYPE_F015)))
      ) {
        this.isErrorFiletypeOrFileSize = true;
      }
      return null;
    }
  }

  onRemoveDocument(_index: number, isRemoveSub: boolean = true) {
    this.list[_index].imageId = '';
    this.list[_index].isUpload = false;
    this.list[_index].uploadTimestamp = '';
    this.list[_index].documentDate = '';

    this.uploadFileEvent.emit(this.list);
  }

  async onViewDocument(_index: number) {
    if (this.list[_index].imageId == undefined || this.list[_index].imageId == '') {
      return;
    }
    const response: any =
      !!this.list[_index].imageId &&
      (await this.documentService.getDocument(this.list[_index].imageId || '', DocumentDto.ImageSourceEnum.Lexs));
    if (!response) return;
    const fileName = this.list[_index].documentTemplate?.documentName ?? 'doc';
    this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
  }

  onCheck(element: any) {
    element.active = !element.active;
    element.imageId = '';
    element.isUpload = false;
    element.uploadTimestamp = '';
    element.documentDate = '';
  }

  onChangeDocumentName(value: any, _index: any) {
    let document = this.documentNameOptions.find(f => f?.documentTemplateId === value);
    if (document) {
      this.list[_index].documentTemplate.documentName = document.name;
    }
  }
}
