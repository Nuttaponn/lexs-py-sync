import { Component, Input, OnInit } from '@angular/core';
import { ExecutionWarrantService } from '@app/modules/execution-warrant/execution-warrant.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { DOC_TEMPLATE } from '@app/shared/constant';
import { TMode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { DocumentDto, LitigationWritOfExecDetailDto } from '@lexs/lexs-client';
import { RecordDialogComponent } from './record-dialog/record-dialog.component';
import { RecordDocsService } from './record-docs.service';

@Component({
  selector: 'app-record-docs',
  templateUrl: './record-docs.component.html',
  styleUrls: ['./record-docs.component.scss'],
})
export class RecordDocsComponent implements OnInit {
  @Input() cifNo: string = '';
  @Input() mode: TMode = 'VIEW';
  @Input() litigationCaseId?: string;

  private legalExecutionWritOfExecs: LitigationWritOfExecDetailDto =
    this.executionWarrantService.legalExecutionWritOfExecsByLgIdAngLgCaseId;

  public dataSource: any[] = [];
  public displayedColumns: string[] = ['no', 'documentName', 'createdDate', 'effectiveDate', 'action'];
  public readonly: boolean = false;
  public litigationId?: string;
  public docTemplate = DOC_TEMPLATE;

  constructor(
    private notificationService: NotificationService,
    private executionWarrantService: ExecutionWarrantService,
    private lawsuitService: LawsuitService,
    private taskService: TaskService,
    private documentService: DocumentService,
    private recordDocsService: RecordDocsService
  ) {}

  ngOnInit() {
    this.litigationId =
      this.taskService.taskDetail.litigationId || this.lawsuitService.currentLitigation.litigationId || '';
    this.legalExecutionWritOfExecs = this.executionWarrantService.legalExecutionWritOfExecsByLgIdAngLgCaseId;
    this.initData();
  }

  initData() {
    const powerOfAttorneyDocumentObj = {
      documentName: this.legalExecutionWritOfExecs?.powerOfAttorneyDocument?.documentTemplate?.documentName,
      documentTemplate: this.legalExecutionWritOfExecs?.powerOfAttorneyDocument?.documentTemplate,
      submitDate: this.legalExecutionWritOfExecs?.powerOfAttorneySubmitDate || '',
      respondDate: this.legalExecutionWritOfExecs?.powerOfAttorneyRespondDate || '',
      status: '',
      active: true,
      imageId: this.legalExecutionWritOfExecs.powerOfAttorneyDocument?.imageId,
      imageSource: this.legalExecutionWritOfExecs.powerOfAttorneyDocument?.imageSource,
      imageName: this.legalExecutionWritOfExecs.powerOfAttorneyDocument?.imageName,
    };
    if (powerOfAttorneyDocumentObj.respondDate != '' && powerOfAttorneyDocumentObj.submitDate != '') {
      powerOfAttorneyDocumentObj.status = 'COMPLETED';
    }
    let docwritOfExecSubmissions: any[] = [];
    this.legalExecutionWritOfExecs?.writOfExecSubmissions?.forEach(item => {
      docwritOfExecSubmissions.push({
        documentName: item.writOfExecDocument?.documentTemplate?.documentName,
        documentTemplate: item.writOfExecDocument?.documentTemplate,
        submitDate: item.submitDate || '',
        respondDate: item.respondDate || '',
        respondCode: item.respondCode,
        status: '',
        active: true,
        imageId: item.writOfExecDocument?.imageId,
        imageSource: item.writOfExecDocument?.imageSource,
        imageName: item.writOfExecDocument?.imageName,
        respondReason: item.respondReason,
      });
    });
    this.dataSource = [...[powerOfAttorneyDocumentObj], ...docwritOfExecSubmissions];
    this.recordDocsService.uplaodedDocuments = this.dataSource;
  }

  get isWarningMaxUpload() {
    return this.dataSource.some(e => e.respondCode === 'R');
  }

  async openDoc(ele: any) {
    const res = await this.documentService.getDocument(ele.imageId || '', ele.imageSource);
    res && this.documentService.openPdf(res, ele.imageName);
  }

  async selectDoc(ele: any, index: number) {
    let selectedDocumentTemplate!: any;
    let title!: string;
    if (ele.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF103) {
      selectedDocumentTemplate = this.legalExecutionWritOfExecs.powerOfAttorneyDocument;
      selectedDocumentTemplate.imageId = this.legalExecutionWritOfExecs.powerOfAttorneyDocument?.imageId || ele.imageId;
      title = 'บันทึกหนังสือมอบอำนาจ';
    } else {
      if (!!!this.legalExecutionWritOfExecs.powerOfAttorneyDocument?.imageId || !!!this.dataSource[0].imageId) {
        return await this.notificationService.alertDialog(
          'EXCEPTION_CONFIG.TITLE_ERROR_UPLOAD',
          'EXCEPTION_CONFIG.MESSAGE_ERROR_UPLOAD_EXECUTION_WARRANT'
        );
      } else {
        selectedDocumentTemplate =
          this.legalExecutionWritOfExecs?.writOfExecSubmissions &&
          this.legalExecutionWritOfExecs.writOfExecSubmissions[index - 1].writOfExecDocument;
        title = 'บันทึกคำขอออกหมายบังคับคดี';
      }
    }

    if (
      this.dataSource[0].imageId === '' &&
      selectedDocumentTemplate.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF104
    ) {
      return await this.notificationService.alertDialog(
        'EXCEPTION_CONFIG.TITLE_ERROR_UPLOAD',
        'EXCEPTION_CONFIG.MESSAGE_ERROR_UPLOAD_EXECUTION_WARRANT'
      );
    } else {
      const res = await this.notificationService.showCustomDialog({
        component: RecordDialogComponent,
        type: 'xsmall',
        iconName: 'icon-Plus',
        title: title,
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        rightButtonLabel: 'COMMON.BUTTON_CONFIRM_SAVE',
        buttonIconName: 'icon-save-primary',
        context: {
          selectedDocumentTemplate: selectedDocumentTemplate,
          cifNo: this.cifNo,
          litigationCaseId: this.litigationCaseId,
          minSubmitDate: index > 0 ? new Date(this.dataSource[index - 1].respondDate) : new Date(),
          submitDate:
            ele.documentTemplate.documentTemplateId !== DOC_TEMPLATE.LEXSF103
              ? ele.submitDate
              : this.legalExecutionWritOfExecs.powerOfAttorneySubmitDate || ele.submitDate,
          respondDate:
            ele.documentTemplate.documentTemplateId !== DOC_TEMPLATE.LEXSF103
              ? ele.respondDate
              : this.legalExecutionWritOfExecs.powerOfAttorneyRespondDate || ele.respondDate,
        },
      });
      if (res) {
        this.dataSource[index].imageId = res.uploadSessionId ? res.uploadSessionId : this.dataSource[index].imageId;
        this.dataSource[index].imageSource = DocumentDto.ImageSourceEnum.Lexs || this.dataSource[index].imageSource;
        this.dataSource[index].submitDate = res.submitDate ? res.submitDate : this.dataSource[index].submitDate;
        this.dataSource[index].respondDate = res.respondDate ? res.respondDate : this.dataSource[index].respondDate;
        this.dataSource[index].status = res.status ? res.status : this.dataSource[index].status;
        this.dataSource[index].respondCode = res.respondCode ? res.respondCode : this.dataSource[index].respondCode;
        this.dataSource[index].respondReason = res.respondReason
          ? res.respondReason
          : this.dataSource[index].respondReason;
        if (this.dataSource[index].respondCode === 'R') {
          this.executionWarrantService.legalExecutionWritOfExecsByLgIdAngLgCaseId =
            await this.executionWarrantService.getLegalExecutionWritOfExecsByLgIdAngLgCaseId(
              Number(this.litigationCaseId),
              this.litigationId || ''
            );
          this.legalExecutionWritOfExecs = this.executionWarrantService.legalExecutionWritOfExecsByLgIdAngLgCaseId;
          this.initData();
        }
      }
    }
  }
}
