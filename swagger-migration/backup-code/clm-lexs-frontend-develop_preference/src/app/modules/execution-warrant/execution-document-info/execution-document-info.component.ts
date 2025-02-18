import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { DocumentAccountService } from '@app/shared/components/document-preparation/document-account.service';
import { DisplayCommitment } from '@app/shared/components/document-preparation/interface/document';
import { TMode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { SessionService } from '@app/shared/services/session.service';
import { DocumentDto } from '@lexs/lexs-client';
import { SimpleSelectOption } from '@spig/core';
import { AccountDocuments } from '../execution-warrant.constant';
import { ExecutionWarrantService } from '../execution-warrant.service';

@Component({
  selector: 'app-execution-document-info',
  templateUrl: './execution-document-info.component.html',
  styleUrls: ['./execution-document-info.component.scss'],
})
export class ExecutionDocumentInfoComponent implements OnInit {
  public isOpened: boolean = true;
  public showMainAccount: boolean = true;
  public accountDropdownOptions: SimpleSelectOption[] = [];
  public commitments: Array<any> = [];
  public allCommitments: Array<AccountDocuments> = [];
  public showAccounts: boolean[][] = [];
  public displayedColumnsAccount = ['id', 'documentName', 'storeOrganization', 'copy'];
  public litigationCaseDocuments: Array<DocumentDto> = [];
  public accountDocuments: Array<AccountDocuments> = [];
  public accountsSet: any = this.litigationCaseService.accountDocumentsFormatted || [];
  public currentValue: number = 0;
  public cifNo!: string;
  public mode!: TMode;
  public litigationCaseId!: string;
  public writOfExecType!: string;
  public taskCode!: taskCode;
  public isRecordDocs = false;
  public hasSubmitPermission = false;
  public fromWarrantTab = false;
  public fromPreparingTab = false;

  constructor(
    private documentAccountService: DocumentAccountService,
    private litigationCaseService: LitigationCaseService,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private executionWarrantService: ExecutionWarrantService,
    private logger: LoggerService,
    private sessionService: SessionService
  ) {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'];
      this.writOfExecType = params['writOfExecDebtType'];
      this.litigationCaseId =
        this.mode === 'EDIT' ? this.taskService.taskDetail.litigationCaseId : params['litigationCaseId'];
      this.fromWarrantTab = params['isWarrantTab'];
      this.fromPreparingTab = params['isPreparingTab'];
    });
  }

  ngOnInit(): void {
    this.cifNo = this.litigationCaseService.litigationCaseShortDetail.cifNo || '';
    this.allCommitments = this.formatHeaderData(this.commitments);
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    this.hasSubmitPermission = this.sessionService.hasPermissionByTaskCode(this.taskCode);
    this.isRecordDocs = this.isShowRecordDocs() && this.fromWarrantTab;
    this.initData();
  }

  isShowRecordDocs() {
    const isTask3A = ['R2E04-03-3A_CREATE', 'R2E04-03-3A_02', 'R2E04-03-3A_03', 'R2E04-03-3A_04', 'COMPLETE'].includes(
      this.executionWarrantService.legalExecutionWritOfExecsByLgIdAngLgCaseId?.writOfExecStatus || ''
    );
    return isTask3A || false;
  }

  initData() {
    let acc = this.formatHeaderData(this.litigationCaseService.accountDocuments) as DisplayCommitment[];
    this.accountsSet = this.documentAccountService.initAccountsSet(acc, 10);
    this.logger.info('Set Account From DocumentAccountService :: ', this.accountsSet);
    this.accountDropdownOptions = this.documentAccountService.initAccountDropdownOptions(this.accountsSet?.length);
    this.litigationCaseDocuments = this.prepareLitigation(this.litigationCaseService.litigationCaseDocuments);
    this.onDropdownSelected(0);
  }

  prepareLitigation(data: DocumentDto[]) {
    return data.map((m: any) => {
      m.readyForAsset = true;
      m.documentTemplate = {
        ...m.documentTemplate,
        forAsset: true,
      };
      return m;
    });
  }

  formatHeaderData(data: Array<any>) {
    return data.map((account: AccountDocuments, index: number) => {
      account.details = [
        {
          name: 'เลขที่บัญชี',
          value: account.accountNo,
        },
        {
          name: 'ประเภทสินเชื่อ',
          value: account.accountType,
        },
      ];

      account.documents = account.documents
        ?.filter(m => !!m)
        ?.map((m: any) => {
          if (m) {
            m.readyForAsset = true;
            m.documentTemplate = {
              ...m.documentTemplate,
              // for MVP 2.1
              forLitigation: false,
              forNoticeLetter: false,
              forAsset: true,
            };
          }
          return m;
        });
      account.config = {
        title: 'เอกสารบัญชี ' + (index + 1),
        isMain: false,
        requireMultipleRows: false,
        msgNotFound: 'ไม่มีรายการ',
        classInput: 'input-xsm  icon no-border bg-l-green',
        forAsset: true,
      };
      account.forAsset = true;
      account.readyFor = {
        readyForAsset: true,
        readyForDoc: true,
        readyForNotice: true,
        readyForLitigation: true,
      };
      return account;
    });
  }

  onDropdownSelected(event: any) {
    this.currentValue = event;
  }

  onExpansionPanelToggle() {
    this.showMainAccount = !this.showMainAccount;
  }
}
