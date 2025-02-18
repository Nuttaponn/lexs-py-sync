import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ExecutionWarrantService } from '@app/modules/execution-warrant/execution-warrant.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { DOC_TEMPLATE } from '@app/shared/constant';
import { acceptFile_PDF_JPG } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils/util';
import {
  DocumentDto,
  ExecutionDocAttorneyResultRequest,
  ExecutionDocIssuanceRequest,
  ExecutionDocIssuanceResultRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-record-dialog',
  templateUrl: './record-dialog.component.html',
  styleUrls: ['./record-dialog.component.scss'],
})
export class RecordDialogComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;

  public acceptFile: Array<string> = acceptFile_PDF_JPG;
  public docColumns: string[] = ['no', 'documentName', 'command'];
  public form!: UntypedFormGroup;
  public dataSource: any[] = [];
  public uploadFiles: Array<any> = [];
  public litigationCaseId?: string;
  public litigationId?: string;
  public uploaded: any = {
    imageName: '',
    imageId: '',
    documentTemplateId: '',
  };
  public documentTemplateId!: string;

  private selectedDocumentTemplate!: any;
  private cifNo!: string;
  public submitDate!: string;
  private _returnData: any = false;
  public minSubmitDate = new Date();
  public minResponseDate = new Date();
  public isReqUpload: boolean = false;
  public docTemplate = DOC_TEMPLATE;

  constructor(
    private notificationService: NotificationService,
    private documentService: DocumentService,
    private translate: TranslateService,
    private fb: UntypedFormBuilder,
    private executionWarrantService: ExecutionWarrantService,
    private lawsuitService: LawsuitService,
    private taskService: TaskService
  ) {
    this.litigationId =
      this.lawsuitService.currentLitigation.litigationId || this.taskService.taskDetail.litigationId || '';
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      date: '',
      approve: '',
      reason: '',
    });
    if (!this.submitDate) {
      this.form.get('date')?.setValidators(Validators.required);
      this.form.get('date')?.updateValueAndValidity();
    } else {
      this.docColumns = this.docColumns.filter(i => i !== 'command');
      this.minResponseDate = new Date(this.submitDate);
      if (this.documentTemplateId === DOC_TEMPLATE.LEXSF103) {
        this.form.get('date')?.setValidators(Validators.required);
        this.form.get('date')?.updateValueAndValidity();
      } else if (this.documentTemplateId === DOC_TEMPLATE.LEXSF104) {
        this.form.get('approve')?.setValidators(Validators.required);
        this.form.get('approve')?.updateValueAndValidity();
      } else {
        this.form.clearValidators();
        this.form.updateValueAndValidity();
      }
    }
    this.dataSource = [
      {
        documentName: this.selectedDocumentTemplate?.documentTemplate?.documentName,
        submitDate: this.submitDate,
        effectiveDate: '',
        status: '',
        active: true,
        docOwnerType: '',
        docRefId: '',
        imageId: this.selectedDocumentTemplate.imageId,
        imageName: this.selectedDocumentTemplate.imageName,
        imageSource: DocumentDto.ImageSourceEnum.Lexs,
        storeOrganization: '',
        storeOrganizationName: '',
      },
    ];
  }

  get someImageId() {
    return this.dataSource.some((e: any) => !!e.imageId) || false;
  }

  dataContext(data: any) {
    this.selectedDocumentTemplate = data.selectedDocumentTemplate;
    this.documentTemplateId = data.selectedDocumentTemplate.documentTemplate.documentTemplateId;
    this.cifNo = data.cifNo;
    this.litigationCaseId = data.litigationCaseId;
    this.submitDate = data.submitDate;
    this.minSubmitDate = data.minSubmitDate;
  }

  onRemoveDocument() {
    this.dataSource[0].imageId = '';
  }

  selectDocument(_index: number) {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = async (event: Event) => {
      const element = event.target as HTMLInputElement;
      for (let index = 0; index < fileInput.files.length; index++) {
        const file = this.documentService.validateFileType(fileInput.files[index]);
        this.uploadDocument(file);
      }
      element.value = '';
    };
    fileInput.click();
  }

  async onDownloadDocument(ele: any) {
    const response: any = await this.documentService.getDocument(ele.imageId || '', DocumentDto.ImageSourceEnum.Lexs);
    const { type } = response;
    Utils.saveAsStrToBlobFile(response, ele.documentName, type);
  }

  async uploadDocument(file: any) {
    if (!this.acceptFile.includes(file.type)) {
      this.notificationService.openSnackbarError(`${this.translate.instant('DOC_PREP.UPLOAD_FAIL')}`);
      return;
    }

    let res = await this.documentService.uploadDocument(this.cifNo, this.documentTemplateId, file, this.litigationId);
    if (res) {
      this.uploaded.imageName = file.name;
      this.uploaded.imageId = res.uploadSessionId;
      this.dataSource[0].imageId = res.uploadSessionId;
      this.notificationService.openSnackbarSuccess(`${this.translate.instant('DOC_PREP.UPLOAD_SUCCESS')}`);
    } else {
      this.notificationService.openSnackbarError(`${this.translate.instant('DOC_PREP.UPLOAD_FAIL')}`);
    }
  }

  getControl(name: string): any {
    return this.form.get(name);
  }

  onSelectApprove(e: any) {
    if (this.form.get('approve')?.value === '0') {
      this.form.get('reason')?.clearValidators();
      this.form.get('reason')?.updateValueAndValidity();
    } else {
      this.form.get('reason')?.setValidators(Validators.required);
      this.form.get('reason')?.updateValueAndValidity();
    }
  }

  get returnData() {
    return this._returnData;
  }

  async onClose() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return false;
    } else {
      if (!this.submitDate) {
        let request: ExecutionDocIssuanceRequest = {
          submitDate: this.form.get('date')?.value,
          uploadSessionId: this.dataSource[0].imageId,
        };
        const result = await this.executionWarrantService
          .saveDocumentIssuanceOfExecution(Number(this.litigationCaseId), request)
          .then(response => {
            this.isReqUpload = false;
            this._returnData = {
              uploadSessionId: this.dataSource[0].imageId,
              submitDate: request.submitDate,
              respondDate: '',
              status: 'COMPLETED',
            };
            this.notificationService.openSnackbarSuccess(`บันทึกแล้ว`);
            return this.returnData;
          })
          .catch(err => {
            this.isReqUpload = true;
            return false;
          });
        return result;
      } else {
        if (this.documentTemplateId === DOC_TEMPLATE.LEXSF103) {
          let request: ExecutionDocAttorneyResultRequest = {
            resultDate: this.form.get('date')?.value,
          };
          const result = await this.executionWarrantService
            .postDocumentPowerOfAttorneyResult(Number(this.litigationCaseId), request)
            .then(response => {
              this.isReqUpload = false;
              this._returnData = {
                uploadSessionId: this.dataSource[0].imageId,
                submitDate: this.submitDate,
                respondDate: request.resultDate,
                status: 'COMPLETED',
              };
              this.notificationService.openSnackbarSuccess(`บันทึกแล้ว`);
              return this.returnData;
            })
            .catch(err => {
              this.isReqUpload = true;
              return false;
            });
          return result;
        } else {
          let request: ExecutionDocIssuanceResultRequest = {};
          const isApproved = this.form.get('approve')?.value === '0';
          if (isApproved) {
            request = {
              isApproved: isApproved,
              resultDate: this.form.get('date')?.value,
            };
          } else {
            request = {
              isApproved: isApproved,
              reason: this.form.get('reason')?.value,
              resultDate: this.form.get('date')?.value,
            };
          }
          const result = await this.executionWarrantService
            .postDocumentIssuanceOfExecutionResult(Number(this.litigationCaseId), request)
            .then(response => {
              this.isReqUpload = false;
              this._returnData = {
                uploadSessionId: this.dataSource[0].imageId,
                submitDate: this.submitDate,
                respondDate: request.resultDate,
                respondCode: isApproved ? 'A' : 'R',
                respondReason: !isApproved ? request.reason : undefined,
              };
              this.notificationService.openSnackbarSuccess(`บันทึกแล้ว`);
              return this.returnData;
            })
            .catch(err => {
              this.isReqUpload = true;
              return false;
            });
          return result;
        }
      }
    }
  }
}
