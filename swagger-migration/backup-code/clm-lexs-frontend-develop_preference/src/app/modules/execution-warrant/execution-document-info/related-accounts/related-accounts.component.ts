import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AccountDocuments } from '@app/modules/execution-warrant/execution-warrant.constant';
import { ExecutionWarrantService } from '@app/modules/execution-warrant/execution-warrant.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { DocumentAccountService } from '@app/shared/components/document-preparation/document-account.service';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { TMode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils/util';
import {
  CommitmentAccountDto,
  DocumentDto,
  ExecutionAccountInfoDto,
  LitigationCaseDebtCalculationDto,
} from '@lexs/lexs-client';
import { ListAccountDocumentComponent } from './list-account-document/list-account-document.component';
import { SessionService } from '@app/shared/services/session.service';
import { DOC_TEMPLATE } from '@app/shared/constant';
import { ConcludeCalculateDebtComponent } from './conclude-calculate-debt/conclude-calculate-debt.component';

//Extends CommitmentAccountDto
interface ExtendCommitmentDto extends CommitmentAccountDto {
  accountTypeDesc?: string;
  bills?: BillDocument[];
  dpd?: string;
  subAccounts?: SubAccountDocument[];
  documents?: DocumentDto[];
  billSubAccount?: any[];
  expanded?: boolean;
}

interface BillDocument extends ExecutionAccountInfoDto {
  documents?: DocumentDto[];
  name?: string;
  accountTypeDesc?: string;
}

interface SubAccountDocument extends ExecutionAccountInfoDto {
  documents?: DocumentDto[];
  name?: string;
  accountTypeDesc?: string;
}

interface PeriodicElement {
  order: number;
  accountNo: any;
  tdrInfo: any;
  timeStamp: any;
  action: any;
}

@Component({
  selector: 'app-related-accounts',
  templateUrl: './related-accounts.component.html',
  styleUrls: ['./related-accounts.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RelatedAccountsComponent implements OnInit {
  @ViewChild(ConcludeCalculateDebtComponent) concludeCalculateDebtComponent!: ConcludeCalculateDebtComponent;
  @Input() mode!: TMode;
  @Input() writOfExecType: string = '';
  @Input() documents: Array<DocumentDto> = [];
  @Input() litigationCaseId?: string;

  //Checked ExceedFileSize
  exceedFileSizeChecked: boolean = false;

  handleExceedFileSize(event: boolean) {
    this.exceedFileSizeChecked = event;
  }

  public accountPrefix: string = 'บัญชี';
  public billNumberPrefix: string = 'Bill number';
  public subAccountNumberPrefix: string = 'Sub Account';
  public columnsToDisplay = ['order', 'accountNo', 'tdrInfo', 'timeStamp', 'action'];
  expandedElement: PeriodicElement | null | undefined;

  isOpened1 = true;
  isOpened2 = true;

  //OpenedBill
  isOpenedBill = false;
  isOpenedBillExpanded = false;

  //integration with BE API
  //Keep response of API Get Litigation Case Documents as ExecutionWarrantService.litigationCaseDocuments[]
  public litigationCaseDocuments: Array<DocumentDto> = [];
  public debtCalculationDocuments: Array<AccountDocuments> = [];
  public accountDocuments: Array<LitigationCaseDebtCalculationDto> = [];
  public accountsSet: any = this.litigationCaseService.accountDocumentsFormatted;

  public allExtendCommitments: Array<ExtendCommitmentDto> = [];

  //Setup commitments for ExecutionWarrantService.commitments[]
  public commitmentsSet: any = this.executionWarrantService.litigationCaseDebtCalculation.commitmentAccounts;

  public account: Array<ExecutionAccountInfoDto> = [];

  //Setup map value
  public accountNumber: Array<any> = [];

  //Filter account
  public filtered_accounts: Array<any> = [];

  //Title Doc
  public title_doc_prefix: string = 'เอกสาร';

  public title_acc_prefix: string = 'บัญชี';

  public taskCode: string = '';

  public dataSource = new MatTableDataSource<ExtendCommitmentDto>([]);
  public pageSize = 10;
  @ViewChild('paginator') paginator!: Component;

  public fromWarrantTab = false;
  public summaryTotalDebt!: number;

  constructor(
    private executionWarrantService: ExecutionWarrantService,
    private litigationCaseService: LitigationCaseService,
    private notificationService: NotificationService,
    private documentAccountService: DocumentAccountService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private logger: LoggerService
  ) {
    this.route.queryParams.subscribe(params => {
      this.fromWarrantTab = !!params['isWarrantTab'];
    });
  }

  get nonEditableCalculateDebt() {
    const _currentUser = this.sessionService.currentUser;
    const _isSubRole = _currentUser?.subRoleCode ? ['MAKER', 'APPROVER'].includes(_currentUser?.subRoleCode) : false;
    if (this.fromWarrantTab) {
      return true;
    } else {
      return !!!(_isSubRole && _currentUser?.category === 'KLAW' && _currentUser?.factionCode === 'LAW004');
    }
  }

  get disableedUploadCalculateDebt() {
    const _isAttributes =
      this.concludeCalculateDebtComponent && this.concludeCalculateDebtComponent.documentSet[0].attributes;
    return _isAttributes && (_isAttributes as any)?.disabled;
  }

  ngOnInit(): void {
    /* Initiate Data */
    this.initData();

    /* Initate taskCode */
    this.taskCode = this.taskService.taskDetail.taskCode ?? '';

    /* Map value from field accountNumber, accountType, totalDebt per CommitmentAccountDto object
    Assign value for attribute accountTypeDesc in ExtendCommitmentDto */
    const extendCommitments: ExtendCommitmentDto[] = this.commitmentsSet.map((account: ExtendCommitmentDto) => {
      this.logger.info('Map commitmentsSet / account >> ', account);
      const _account = account.accountNumber;
      const extendCommitment: ExtendCommitmentDto = {
        ...account,
        accountTypeDesc: this.documentAccountService.getAccountTypeName(account.accountType) || '',
        billSubAccount: [],
      };

      const document =
        this.executionWarrantService.litigationCaseDebtCalculation.documentInfo?.accountDocuments?.filter(
          (value: DocumentDto) => {
            return (
              value.objectType === 'ACCOUNT_NO' && value.objectId === _account && extendCommitment.accountType !== 'PN'
            );
          }
        );

      if (document) {
        extendCommitment.documents = Utils.deepClone(document);
      }
      this.logger.info('Map commitmentsSet / account >> extendCommitment.documents :: ', extendCommitment.documents);

      /*Get list of Bill for assign attribute bills in ExtendCommitmentDto by
      Filter LitigationCaseDebtCalculationDto.accounts[] where ExecutionAccountInfoDto.accountNo = CommitmentAccountDto.accountNumber */
      let bill: any[] =
        this.executionWarrantService.litigationCaseDebtCalculation.accounts
          ?.map((value: ExecutionAccountInfoDto) => {
            if (!!!value.subAccount && _account === value.commitmentAccountNo) {
              return value;
            } else {
              return;
            }
          })
          .filter(i => i !== undefined) || [];

      //Push object Bill into ExtendCommitmentDto.bills[]
      if (bill) {
        extendCommitment.bills = Utils.deepClone(bill);
      }

      let subAccount: any[] =
        this.executionWarrantService.litigationCaseDebtCalculation.accounts
          ?.filter((value: ExecutionAccountInfoDto) => {
            if (!!value.subAccount && _account === value.commitmentAccountNo) {
              return value;
            } else {
              return;
            }
          })
          .filter(i => i !== undefined) || [];

      /* condition for check exist subAccount */
      if (subAccount) {
        extendCommitment.subAccounts = Utils.deepClone(subAccount);
      }

      bill = (bill as BillDocument[])
        .map((_bill, _index) => {
          const _isCommitmentAccountNo = _account === _bill.commitmentAccountNo;
          const _isBillNo = _bill.accountId === _bill.billNo;
          if (_isCommitmentAccountNo === _isBillNo) {
            _bill.name = 'BILL_NO';
            if (extendCommitment.bills && extendCommitment.bills.length > 0) {
              _bill.tdrTrackingHistory = extendCommitment.bills[_index].tdrTrackingHistory;
              _bill.accountTypeDesc = extendCommitment.bills[_index].accountTypeDesc;
            }
            const documentBill =
              this.executionWarrantService.litigationCaseDebtCalculation.documentInfo?.accountDocuments?.filter(
                (value: DocumentDto) => {
                  return _bill.accountId === value.objectId;
                }
              );
            _bill.documents = documentBill;
            return _bill;
          } else {
            return;
          }
        })
        .filter(i => i !== undefined);

      subAccount = (subAccount as SubAccountDocument[])
        .map((_subAccount, _index) => {
          if ((_account === _subAccount.commitmentAccountNo) === (_subAccount.accountId === _subAccount.billNo)) {
            _subAccount.name = 'SUB_ACCOUNT';
            if (extendCommitment.subAccounts && extendCommitment.subAccounts.length > 0) {
              _subAccount.tdrTrackingHistory = extendCommitment.subAccounts[_index].tdrTrackingHistory;
              _subAccount.accountTypeDesc = extendCommitment.subAccounts[_index].accountTypeDesc;
            }
            const documentSubAccount =
              this.executionWarrantService.litigationCaseDebtCalculation.documentInfo?.accountDocuments?.filter(
                (value: DocumentDto) => {
                  return _subAccount.accountId === value.objectId;
                }
              );
            _subAccount.documents = documentSubAccount;
            return _subAccount;
          } else {
            return;
          }
        })
        .filter(i => i !== undefined);

      this.logger.info('Map commitmentsSet / account >> bill :: ', bill);
      this.logger.info('Map commitmentsSet / account >> subAccount :: ', subAccount);
      const billSub = [...bill, ...subAccount];
      extendCommitment.billSubAccount = billSub;
      this.logger.info('Map commitmentsSet / account >> billSubAccount :: ', extendCommitment.billSubAccount);
      return extendCommitment;
    });

    this.logger.info('Map commitmentsSet / account >> extendCommitments :: ', extendCommitments);

    this.summaryTotalDebt = this.executionWarrantService.litigationCaseDebtCalculation.summaryTotalDebt || 0;

    this.allExtendCommitments = extendCommitments;
    this.dataSource.data = this.allExtendCommitments;
    this.dataSource.filteredData = this.dataSource.data.slice(0, 10);
  }

  initData() {
    this.litigationCaseDocuments = this.litigationCaseService.litigationCaseDocuments;
    this.writOfExecType =
      this.writOfExecType !== ''
        ? this.executionWarrantService.legalExecutionWritOfExecsByLgIdAngLgCaseId.writOfExecDebtType || ''
        : this.writOfExecType;
  }

  selectDoc(ele: any) {
    if (!ele.documents || ele.documents.length === 0) {
      const documentTemplateSet = {
        documentTemplate: {
          documentName: 'Statement',
          imageId: '',
        },
      };
      ele.documents.push(documentTemplateSet);
    }

    if (ele.accountNumber === undefined || ele.accountNumber === null) {
      if (ele.subAccount === true && ele.name === 'SUB_ACCOUNT') {
        ele.accountNumber = ele.accountNo;
      } else {
        ele.accountNumber = ele.billNo;
      }
    }

    /* Checking Payment Report */
    let isChecked = ele.documents.some((e: any) => e.documentTemplate.documentTemplateId == DOC_TEMPLATE.LEXSD190);

    let res = this.notificationService.showCustomDialog({
      component: ListAccountDocumentComponent,
      type: 'xsmall',
      iconName: 'icon-Document-Bullet-List',
      title:
        this.title_doc_prefix +
        ' ' +
        this.title_acc_prefix +
        ' ' +
        ele.accountNumber +
        ' ' +
        (!!ele.accountTypeDesc ? ele.accountTypeDesc : ''),
      rightButtonLabel: 'EXECUTION_WARRANT.LIST_ACCOUNT_DOCUMENT.BUTTON_CLOSE',
      context: { isAdvance: true, element: ele, isChecked: isChecked },
    });
  }

  onPaging(e: PageEvent) {
    this.dataSource.filteredData = this.dataSource.data.slice(e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);
  }
}
