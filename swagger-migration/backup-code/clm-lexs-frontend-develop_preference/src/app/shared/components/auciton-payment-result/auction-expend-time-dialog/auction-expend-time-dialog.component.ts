import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { NotificationService } from '@shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { DocumentService } from '@shared/components/document-preparation/document.service';
import { Utils } from '@shared/utils';
import { DocumentDto, DocumentUploadResponse } from '@lexs/lexs-client';
import { TaskService } from '@app/modules/task/services/task.service';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { acceptFile_PDF_JPG, maxFileSize } from '@app/shared/models';
import { DOC_TEMPLATE } from '@app/shared/constant';

@Component({
  selector: 'app-auction-expend-time-dialog',
  templateUrl: './auction-expend-time-dialog.component.html',
  styleUrls: ['./auction-expend-time-dialog.component.scss'],
})
export class AuctionExpendTimeDialogComponent implements OnInit {
  public currentDate: Date = new Date();
  public extendExpiredTimestampControl: UntypedFormControl = new UntypedFormControl(null, Validators.required);
  private isSuccess = false;
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  private uploaded: any = {
    imageName: '',
    imageId: '',
    documentTemplateId: DOC_TEMPLATE.LEXSF141,
    uploadSessionId: '',
  };
  private acceptFile = acceptFile_PDF_JPG;
  public fileControl: UntypedFormControl = new UntypedFormControl(null, [Validators.required]);
  private maxFileSize: number = maxFileSize;
  private ERROR_CODE_FILE_TYPE_F015 = 'F015';
  private ERROR_CODE_FILE_TYPE_D025 = 'D025';
  public isErrorFiletypeOrFileSize = false;
  public isUploaded: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService,
    private documentService: DocumentService,
    private taskService: TaskService,
    private litigationCaseService: LitigationCaseService
  ) {}

  ngOnInit() {
    this.isSuccess = false;
    this.isErrorFiletypeOrFileSize = false;
  }

  dataContext(data: any) {
    this.extendExpiredTimestampControl.setValue(data.extendExpiredTimestamp);
    this.fileControl.setValue(data.file);
  }

  selectDocument() {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = () => {
      for (let index = 0; index < fileInput.files.length; index++) {
        const file = fileInput.files[index];
        this.uploadDocument(file);
      }
      this.isUploaded = fileInput.files.length > 0;
    };
    fileInput.click();
  }

  async uploadDocument(file: any) {
    try {
      if (!this.acceptFile.includes(file.type)) {
        this.notificationService.openSnackbarError(this.translate.instant('UPLOAD_FILE.ERROR_FILE_TYPE_INVALID'));
        this.isErrorFiletypeOrFileSize = true;
        return;
      }
      if (Utils.validateFileSize(file.size)) {
        const cif = this.taskService.taskDetail?.customerId
          ? this.taskService.taskDetail.customerId
          : this.litigationCaseService.litigationCaseShortDetail?.cifNo || '';
        const litigationId = this.taskService.taskDetail.litigationId;
        const res = (await this.documentService.uploadDocument(
          cif,
          this.uploaded.documentTemplateId,
          file,
          litigationId
        )) as DocumentUploadResponse;
        if (res) {
          this.fileControl.setValue(file);
          this.uploaded.imageName = file.name;
          this.uploaded.imageId = res.imageId;
          this.uploaded.uploadSessionId = res.uploadSessionId;
          this.notificationService.openSnackbarSuccess(` ${this.translate.instant('DOC_PREP.UPLOAD_SUCCESS')}`);
        } else {
          this.notificationService.openSnackbarError(` ${this.translate.instant('DOC_PREP.UPLOAD_FAIL')}`);
          this.uploaded.imageName = '';
          this.uploaded.imageId = '';
          this.fileControl.setValue(null);
        }
        this.fileControl.setErrors(null);
      } else {
        this.isErrorFiletypeOrFileSize = true;
        this.notificationService.openSnackbarError(
          this.translate.instant('UPLOAD_FILE.ERROR_FILE_SIZE_EXCEED', {
            SIZE_EXCEED: this.maxFileSize.toString(),
          })
        );
      }
    } catch (error: any) {
      this.notificationService.openSnackbarError(` ${this.translate.instant('DOC_PREP.UPLOAD_FAIL')}`);
      this.isErrorFiletypeOrFileSize = true;
      const codes = error?.error?.errors?.map((it: any) => it.code);
      if (
        error?.error?.code === this.ERROR_CODE_FILE_TYPE_F015 ||
        (codes && (codes.includes(this.ERROR_CODE_FILE_TYPE_D025) || codes.includes(this.ERROR_CODE_FILE_TYPE_F015)))
      ) {
        this.isErrorFiletypeOrFileSize = true;
      }
    }
  }
  public async onClose(): Promise<boolean> {
    this.extendExpiredTimestampControl.markAllAsTouched();
    this.fileControl.markAllAsTouched();
    if (this.extendExpiredTimestampControl.valid && this.fileControl.valid) {
      this.isSuccess = true;
      return true;
    }
    return false;
  }

  get returnData() {
    return {
      isSuccess: this.isSuccess,
      file: this.fileControl?.value,
      extendExpiredTimestamp: this.extendExpiredTimestampControl?.value,
      uploaded: this.uploaded,
    };
  }

  async onViewDocument() {
    const fileName = this.uploaded.imageName;
    let res: any = await this.documentService.getDocument(
      this.uploaded?.uploadSessionId,
      DocumentDto.ImageSourceEnum.Lexs
    );
    this.documentService.openPdf(res, `${fileName}.${res?.type.split('/')[1]}`);
  }
}
