import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import {
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { ILexsUserOption } from '@app/modules/configuration/config.model';
import { ConfigurationService } from '@app/modules/configuration/configuration.service';
import { LOCAL_STORAGE } from '@app/shared/constant/localstorage.constant';
import { IUploadMultiFile, TMode, acceptFile_PDF_JPG, statusCode } from '@app/shared/models';
import { DataService } from '@app/shared/services/data.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  AddressDto,
  AuctionBiddingsAnnouncesResponse,
  AuctionExpenseInfo,
  ExpenseApprovalRequest,
  ExpenseDetailDto,
  ExpenseRateDto,
  ExpenseRefundDto,
  ExpenseStepSubType,
  ExpenseStepType,
  ExpenseTransactionDto,
  ExpenseTransactionRequest,
  MeLexsUserDto,
  NameValuePair,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DialogOptions } from '@spig/core';
import { ExpenseService } from '../../services/expense.service';
import { AddPaymentListDialogComponent } from '../add-payment-list-dialog/add-payment-list-dialog.component';
import {
  CHECK_BOX,
  ExpenseMsgMapper,
  KbmReasonMapper,
  approverOptionConfig,
  assigneeOptionConfig,
  expenseStepSubTypeConfig,
  expenseStepTypeConfig,
  expenseSubTypeConfig,
  expenseTypeConfig,
} from '../expense.constant';
import { RemarksPaymentDialogComponent } from '../remarks-payment-dialog/remarks-payment-dialog.component';
import { AuctionPaymentService } from '@app/modules/auction/auction-advance-payment/service/auction-payment.service';
import { AuctionService } from '@app/modules/auction/auction.service';
import { SeizureSupportTypeEnum } from '@app/modules/seizure-property/models';
import { Subscription } from 'rxjs';

export interface IWithholdingTaxInfo extends AddressDto {
  receiverName?: string;
  expenseTaxname?: string;
  expenseAccountno?: string;
  expenseType?: string;
  expenseBusinessType?: string;
  expenseTaxno?: string;
  expenseTel?: string;
}

export interface IOldControlValue {
  stepCode?: string;
  stepSubCode?: string;
  expenseTypeCode?: string;
  expenseSubTypeCode?: string;
}

export interface IExpenseType extends ExpenseRateDto {
  expenseTypeFullName?: string;
}

export type TActionBarEventName = 'CANCEL' | 'REJECT' | 'SUBMIT' | 'SAVE' | 'CANCELCASE' | 'SENT';
@Component({
  selector: 'app-create-payment-book',
  templateUrl: './create-payment-book.component.html',
  styleUrls: ['./create-payment-book.component.scss'],
})
export class CreatePaymentBookComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChildren(MatTable) table!: QueryList<any>;

  @Input() dataForm!: UntypedFormGroup;
  @Input() mode!: TMode;
  @Input() statusCode!: statusCode;
  @Input() statusName!: string;
  @Input() taskCode!: string;
  @Input() actionBarEventName!: TActionBarEventName;
  @Input() currentAssigneeId!: string;
  @Input() currentAssigneeName!: string;
  public MODE = TMode;
  public currentDate: Date = new Date();
  // table document ใบเสร็จรับเงิน
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  public acceptFile: Array<string> = acceptFile_PDF_JPG;
  public readonly: boolean = false;
  public receiptDocs: IUploadMultiFile[] = [];
  public receiptDocsColumns: string[] = ['documentName', 'uploadBy', 'uploadDate', 'command'];
  public receiptDocsViewColumns: string[] = ['documentName', 'receiptDate', 'uploadBy', 'uploadDate'];
  public receiptDocsViewColumnsE62: string[] = ['documentName', 'uploadBy', 'uploadDate'];
  public receiptDocsColumnsE62: string[] = ['documentName', 'uploadBy', 'uploadDate', 'action'];

  // ขั้นตอนดำเนินคดีที่ขอเบิก
  public expenseStepTypeConfig = expenseStepTypeConfig;
  public expenseStepType: Array<ExpenseStepType> = [];
  // ขั้นตอนการดำเนินคดีย่อยที่ขอเบิก
  public expenseStepSubTypeConfig = expenseStepSubTypeConfig;
  public expenseStepSubType: Array<ExpenseStepSubType> = [];
  // ประเภทค่าใช้จ่าย
  public expenseTypeConfig = expenseTypeConfig;
  public expenseType: Array<IExpenseType> = [];
  // ประเภทค่าใช้จ่ายย่อย
  public expenseSubTypeConfig = expenseSubTypeConfig;
  public expenseSubType: Array<ExpenseRateDto> = [];
  // การขออนุมัติ
  public assigneeOptionConfig = assigneeOptionConfig;
  public assigneeOption: Array<NameValuePair> = [];
  // เลือกผู้อนุมัติ
  public approverOptionConfig = approverOptionConfig;
  public approverOption: Array<ILexsUserOption> = [];
  // accordion
  public isOpened0 = true; // เหตุผลการพิจารณา
  public isOpened1 = true; // ข้อมูลหนังสือเบิกจ่ายเงิน
  public isOpened2 = false; // ข้อมูลการหักภาษี ณ ที่จ่าย
  // checkbox ตรวจสอบความถูกต้อง
  public checkbox: typeof CHECK_BOX = this.expenseService.checkbox;
  // table รายการเบิก
  public paymentList = new MatTableDataSource<ExpenseTransactionDto>([]);
  public paymentColumns: string[] = [
    'no',
    'lgId',
    'customerId',
    'blackCaseNo',
    'court',
    'expense',
    'wt',
    'vat',
    'totalAmount',
    'action',
    'remark',
  ];
  public prosecutionPaymentColumns: string[] = [
    'no',
    'lgId',
    'customerId',
    'blackCaseNo',
    'court',
    'expense',
    'wt',
    'vat',
    'totalAmount',
    'action',
    'remark',
  ];
  // table การคืนเงินค่าใช้จ่าย
  public expenseRefundList: ExpenseRefundDto[] = [];
  public expenseRefundColumns: string[] = ['no', 'userRoleName', 'userId', 'timeStamp', 'action'];
  public trackBy = (_index: number, item: any) => {
    return `${_index}-${item.no}`;
  };

  public detail!: ExpenseDetailDto;
  private seizureType: string | undefined;
  private seizureObjectType: string | undefined;
  public withholdingTaxInfo: IWithholdingTaxInfo = {};
  // temp value
  private oldControlValue!: IOldControlValue;
  // check action
  public isClickAddPaymentList: boolean = false;

  public objectTypeBidding = ['AUC_BIDDING_ID', 'CONVY_ACC_DOC_FOLLOWUP_ID'];
  public objectTypeAuction = ['AUCTION_EXPENSE'];

  public expenseStatusCode!: string;
  public expenseMsgMapper = ExpenseMsgMapper;
  public kbmReasonMapper = KbmReasonMapper;

  public isNoShowRadioCols = false;
  public isCaseExecutionSeizure: boolean = false;
  public isFromTask = this.routerService.previousUrl === '/main/task';

  // for display content on screen
  public exStatusBannerAddPayment: boolean = false;
  public exStatusBannerPayment: boolean = false;
  public exStatusTableReceiptDocs: boolean = false;
  public exStatusPaymentViewDetail: boolean = false;
  public exStatusPaymentColGreen: boolean = false;
  public exStatusPaymentColRed: boolean = false;
  public exStatusAccordionReason: boolean = false;
  public exStatusReecieveDoc: boolean = false;

  private subscription!: Subscription;
  public isView: boolean = false;
  constructor(
    private translate: TranslateService,
    private routerService: RouterService,
    private masterDataService: MasterDataService,
    private notificationService: NotificationService,
    private configurationService: ConfigurationService,
    private sessionService: SessionService,
    public expenseService: ExpenseService,
    private dataService: DataService,
    private cdf: ChangeDetectorRef,
    private auctionService: AuctionService,
    private auctionPaymentService: AuctionPaymentService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initData();
    this.initTable();
    this.initForm();

    this.subscription = this.expenseService.expenseTransactionDtoSubject.subscribe(value => {
      if (value.length !== 0) this.paymentList.data = value;
    });
    this.isView = this.mode === TMode.VIEW;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
        this.cdf.detectChanges();
      });
    }
  }

  get isViewDetailByStatus() {
    if (this.statusCode === 'PENDING') {
      return (
        this.mode === TMode.APPROVE &&
        ['PENDING_ACCEPT_ORIGINAL_DOCUMENT', 'PENDING_EXPENSE_CLAIM_VERIFICATION'].includes(this.expenseStatusCode)
      );
    }
    if (this.statusCode === 'PENDING_APPROVAL') {
      return this.mode === TMode.APPROVE && this.expenseStatusCode === 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION';
    }
    if (this.statusCode === 'FAILED') {
      return this.mode === TMode.APPROVE && this.expenseStatusCode === 'PAYMENT_FAILED';
    }
    return false;
  }

  checkMode() {
    const currentUser = this.sessionService.currentUser as MeLexsUserDto;
    const userId = currentUser?.userId;
    if (userId !== this.currentAssigneeId) {
      this.mode = TMode.VIEW;
      return;
    }
    switch (this.expenseService.expenseDetail?.expenseStatusCode) {
      case 'DRAFT':
      case 'PENDING_EXPENSE_CLAIM_CORRECTION':
        this.mode = TMode.EDIT;
        break;
      case 'PENDING_ACCEPT_ORIGINAL_DOCUMENT':
      case 'PENDING_EXPENSE_CLAIM_VERIFICATION':
      case 'PAYMENT_FAILED':
      case 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION':
      case 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL':
      case 'PENDING_AUTO_REVERSE_EXPENSE_CLAIM':
      case 'PENDING_DECIDE_REVERSE_EXPENSE_CLAIM':
        this.mode = TMode.APPROVE;
        break;
      default:
        break;
    }
  }

  async initData() {
    this.mode !== TMode.ADD && this.checkMode();
    // process expense detail from ExpenseResolver
    await this.getMasterData();
    if (this.mode !== TMode.ADD && this.expenseService.expenseDetail) {
      this.detail = {
        ...this.expenseService.expenseDetail,
        ...this.dataForm.getRawValue() /** Retain any edited data */,
      };
      let klawReceipt: any = [{ ...this.detail?.klawReceipt }];
      this.receiptDocs = klawReceipt;
      this.expenseStatusCode = this.detail?.expenseStatusCode || '';
      this.initDisplayFlag();
      this.withholdingTaxInfo = await this.expenseService.genWithholdingTaxInfo(
        this.detail?.expenseTypeCode || '',
        this.withholdingTaxInfo,
        this.mode
      );
      this.checkbox.forEach(element => {
        element.checked = true;
      });
      // LEX2-247
      this.expenseRefundList = this.detail?.expenseRefundDto || [];
    }

    if (this.mode === TMode.ADD || this.mode === TMode.EDIT) {
      this.detail = {
        ...this.expenseService.expenseDetail,
        ...this.dataForm.getRawValue() /** Retain any edited data */,
      };
      if (this.mode === TMode.ADD) {
        // FIX LEX2-41831: dataForm (from 'generatePaymentBookForm') always undefined for any fields
        this.detail = {
          ...this.dataForm.getRawValue() /** Retain any edited data */,
          ...this.expenseService.expenseDetail,
        };
      }

      // get user finance approver
      const expenseStatus: ExpenseApprovalRequest.ExpenseStatusEnum =
        (this.expenseService.expenseDetail?.expenseStatusCode as ExpenseApprovalRequest.ExpenseStatusEnum) || 'DRAFT';
      await this.getApproverList(expenseStatus, this.detail?.stepCode);

      // set data then back from expense detail view
      if (this.expenseService.paymentBookForm && this.expenseService.isFromDetail === true) {
        this.dataForm?.markAsDirty();
        this.withholdingTaxInfo = await this.expenseService.genWithholdingTaxInfo(
          this.expenseService.paymentBookForm?.expenseTypeCode || '',
          this.withholdingTaxInfo,
          this.mode
        );
        this.withholdingTaxInfo.receiverName = this.expenseSubType[0].receiverName;
        // set seizureObjectType
        const currentExpenseSubType = this.expenseSubType.find(
          et => et.id === this.expenseService.paymentBookForm?.expenseRateId
        );
        this.seizureObjectType = currentExpenseSubType?.objectType;
        this.seizureType = currentExpenseSubType?.seizureType;
      }
      if (this.mode === TMode.ADD) {
        if (this.expenseService.paymentBookForm && this.expenseService.isFromDetail === true) {
          this.dataForm?.markAsDirty();
          this.dataForm.patchValue({ ...this.expenseService.paymentBookForm });
          const expenseSubType = this.expenseSubType.find(
            e => e.expenseSubTypeCode === this.expenseService.paymentBookForm?.expenseSubTypeCode
          );
          this.getControl('expenseRateId')?.patchValue(expenseSubType?.id || '');
          this.detail = {
            ...this.detail,
            accountCode: expenseSubType?.accountCode,
            paymentMethodName: expenseSubType?.paymentMethodName,
            whtRate: expenseSubType?.whtRate,
            vatRate: this.expenseService.expenseTransactionList
              ? this.expenseService.expenseTransactionList[0]?.vatRate
              : 0,
          };
          this.paymentList.data = this.expenseService.expenseTransactionList || [];
        } else {
          this.checkbox.forEach(element => {
            element.checked = false;
          });
          // fix undefined
          this.detail = {};
        }
      } else {
        this.dataForm.patchValue({ ...this.expenseService.paymentBookForm });
        let paymentList = this.dataForm.get('expenseTransactionDto')?.value;
        if (this.expenseService.isFromDetail === true) {
          paymentList = this.expenseService.expenseTransactionList;
        } else if (this.detail.expenseTransactionDto) {
          this.expenseService.expenseTransactionList = [...this.detail.expenseTransactionDto];
          paymentList = this.expenseService.expenseTransactionList;
        }
        this.paymentList.data = paymentList;
        // set seizureObjectType
        const currentExpenseSubType = this.expenseSubType.find(
          et => et.id === this.expenseService.paymentBookForm?.expenseRateId
        );
        this.seizureObjectType = currentExpenseSubType?.objectType;
        this.seizureType = currentExpenseSubType?.seizureType;
      }
    } else {
      this.detail = this.expenseService.expenseDetail;
      if (this.detail?.expenseGroup !== 1) {
        // use the updated one if exists
        this.paymentList.data =
          this.expenseService.paymentBookForm?.expenseTransactionDto || this.detail?.expenseTransactionDto || [];
      } else {
        if (!!this.detail?.mergedExpenseTransaction) {
          this.paymentList.data = [this.detail.mergedExpenseTransaction];
        }
      }
      this.expenseService.expenseTransactionList = this.paymentList.data;
    }
    this.expenseService.isFromDetail = false;
  }

  initDisplayFlag() {
    this.exStatusBannerAddPayment = [
      'DRAFT',
      'PENDING_EXPENSE_CLAIM_CORRECTION',
      'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION',
      'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL',
    ].includes(this.expenseStatusCode);
    this.exStatusBannerPayment = [
      'PENDING_EXPENSE_CLAIM_VERIFICATION',
      'PENDING_PAYMENT_CONSIDERATION',
      'PENDING_PAYMENT_APPROVAL_CONSIDERATION',
      'PENDING_EXPENSE_CLAIM_CORRECTION',
      'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION',
    ].includes(this.expenseStatusCode);
    this.exStatusTableReceiptDocs = [
      'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION',
      'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL',
    ].includes(this.expenseStatusCode);
    this.exStatusPaymentViewDetail = [
      'PENDING_EXPENSE_CLAIM_CORRECTION',
      'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL',
      'PENDING_AUTO_REVERSE_EXPENSE_CLAIM',
      'PENDING_DECIDE_REVERSE_EXPENSE_CLAIM',
    ].includes(this.expenseStatusCode);
    this.exStatusPaymentColGreen = [
      'PENDING_EXPENSE_CLAIM_CORRECTION',
      'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION',
      'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL',
    ].includes(this.expenseStatusCode);
    this.exStatusPaymentColRed = [
      'PENDING_EXPENSE_CLAIM_CORRECTION',
      'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION',
      'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL',
    ].includes(this.expenseStatusCode);
    this.exStatusAccordionReason = [
      'PENDING_PAYMENT_CONFIRMATION',
      'PENDING_EXPENSE_CLAIM_CORRECTION',
      'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION',
      'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL',
      'PAYMENT_FAILED',
      'PENDING_AUTO_REVERSE_EXPENSE_CLAIM',
      'PENDING_DECIDE_REVERSE_EXPENSE_CLAIM',
      'CANCELLED_EXPENSE_CLAIM',
    ].includes(this.expenseStatusCode);
    this.exStatusReecieveDoc = ![
      'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION',
      'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL',
    ].includes(this.expenseStatusCode);
  }

  async getMasterData() {
    if (this.mode === TMode.VIEW || this.mode === TMode.APPROVE) {
      return;
    }
    // call APIs directly for data, DO NOT USE DATA FROM LOCAL STORAGE
    this.expenseStepType = await this.masterDataService.expenseStepType();
    this.expenseStepSubType = await this.masterDataService.getExpenseStepSubType(
      [3],
      this.expenseService.paymentBookForm?.stepCode
    );
    this.expenseType = await this.masterDataService.getExpenseTypeCode(
      [3],
      undefined,
      this.expenseService.paymentBookForm?.stepCode,
      this.expenseService.paymentBookForm?.stepSubCode
    );
    this.mapOptionExpenseType();
    this.expenseSubType = await this.masterDataService.getExpenseRate(
      [3],
      undefined,
      this.expenseService.paymentBookForm?.expenseTypeCode,
      undefined,
      this.expenseService.paymentBookForm?.stepCode,
      this.expenseService.paymentBookForm?.stepSubCode
    );
  }

  async getApproverList(expenseStatus: ExpenseApprovalRequest.ExpenseStatusEnum, stepCode?: string) {
    const approverList = await this.expenseService.getApproverList(expenseStatus, stepCode);
    let tempArray: NameValuePair[] = [];
    approverList.forEach(e => {
      tempArray.push({
        name: e.userId + ' - ' + e.name + ' ' + e.surname,
        value: e.userId,
      });
    });
    this.assigneeOption = tempArray;
  }

  initTable() {
    // show pass/fail column
    const taskList = [
      'EXPENSE_CLAIM_VERIFICATION',
      'EXPENSE_CLAIM_CORRECTION',
      'EXPENSE_CLAIM_SYSTEM_PAYMENT',
      'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT',
      'REVERSE_EXPENSE_CLAIM_OTHER',
      'DECIDE_REVERSE_EXPENSE_CLAIM',
    ];

    this.isNoShowRadioCols = this.taskCode === 'EXPENSE_CLAIM_SYSTEM_PAYMENT' && this.statusCode === 'FAILED';
    if (
      this.taskCode &&
      taskList.includes(this.taskCode) &&
      this.expenseService.expenseDetail?.expenseStatusCode !== 'DRAFT' &&
      this.statusCode !== 'FINISHED' &&
      !this.isNoShowRadioCols
    ) {
      this.paymentColumns = [...this.paymentColumns, 'pass', 'fail'];
    }

    this.prosecutionPaymentColumns = [...this.paymentColumns];

    // LEX2-739 [MVP2 SP 3]
    if (
      !!this.detail &&
      this.detail.stepCode == 'EXECUTION' &&
      (this.detail.stepSubCode == 'SEIZURE' || this.detail.stepSubCode == 'SEIZURE_NON_PLEDGE_ASSET')
    ) {
      this.paymentColumns = this.paymentColumns.filter(obj => obj !== 'court');
      this.paymentColumns.splice(4, 0, 'objectType', 'mainLed', 'paymentDate');
      this.isCaseExecutionSeizure = true;
    }
    // LEX2-741 [MVP2 SP 3]
    if (!!this.detail && this.detail.stepCode == 'EXECUTION' && this.detail.stepSubCode == 'WITHDRAW_SEIZURE') {
      this.paymentColumns = this.paymentColumns.filter(obj => obj !== 'court');
      this.paymentColumns.splice(4, 0, 'objectType', 'withdrawSeizureDate', 'lawyer');
      this.isCaseExecutionSeizure = true;
    }

    // LEX2-742-22822 [MVP2.1.2 SP 6]
    // isObjectTypeAuctionExpense = ค่าใช้จ่ายเพิ่มเติมประกาศขายทอดตลาด
    const isObjectTypeAuctionAndBidding = this.detail?.expenseTransactionDto?.every(obj =>
      [...this.objectTypeBidding, ...this.objectTypeAuction].includes(obj.objectType || '')
    );
    if (
      this.detail.stepCode == 'EXECUTION' &&
      ['AUCTION'].includes(this.detail.stepSubCode || '') &&
      isObjectTypeAuctionAndBidding
    ) {
      // Init data by ObjectType
      this.detail?.expenseTransactionDto?.forEach(obj => {
        this.fetchNewMainLed(obj);
      });

      this.paymentColumns = this.paymentColumns.filter(obj => obj != 'court');
      this.paymentColumns.splice(4, 0, 'ktbStatus', 'mainLedAuction', 'documentNo', 'paymentAmount');
      const colRemark = this.paymentColumns.find(obj => obj === 'remark');
      if (!colRemark) this.paymentColumns.push('remark');
    }
  }

  reInitTable() {
    /** For ADD mode, re-init table when different stepCode and stepSubCode are selected */
    if (
      this.getControl('stepCode')?.value === 'EXECUTION' &&
      (this.getControl('stepSubCode')?.value === 'SEIZURE' ||
        this.getControl('stepSubCode')?.value === 'SEIZURE_NON_PLEDGE_ASSET')
    ) {
      this.paymentColumns = this.paymentColumns.filter(obj => obj != 'court');
      this.paymentColumns.splice(4, 0, 'objectType', 'mainLed', 'paymentDate');
      this.isCaseExecutionSeizure = true;
    } else {
      this.paymentColumns = this.prosecutionPaymentColumns;
      this.isCaseExecutionSeizure = false;
    }
  }

  initForm() {
    // set old value
    this.oldControlValue = {
      stepCode: this.detail.stepCode || undefined,
      stepSubCode: this.detail.stepSubCode || undefined,
      expenseTypeCode: this.detail.expenseTypeCode || undefined,
      expenseSubTypeCode: this.detail.expenseSubTypeCode || undefined,
    };
    this.dropdownCheckMode();
  }

  mapOptionExpenseType() {
    this.expenseType.forEach(e => {
      e.expenseTypeFullName = e.expenseTypeCode + ' ' + e.expenseTypeName;
    });
  }

  checkTaskCode(name: string[]) {
    /*
    console.log('🚀 ~ file: create-payment-book.component.ts:570 ~ name:', name);
    */
    return name.includes(this.taskCode);
  }

  hasIsApproved(element: any) {
    return typeof element === 'boolean';
  }

  dropdownCheckMode() {
    if (this.statusCode !== statusCode.PENDING_APPROVAL) {
      this.approverOptionConfig.disableSelect = true;
    }
  }

  get responsiblePerson() {
    if (this.detail?.expenseNo) {
      return `${this.currentAssigneeId || ''}-${this.currentAssigneeName || ''}`;
    }
    const currentUser = this.sessionService.currentUser;
    return `${currentUser?.userId}-${currentUser?.title}${currentUser?.name} ${currentUser?.surname}`;
  }

  getControl(name: string) {
    return this.dataForm.get(name);
  }

  onBlurMainRemarks() {
    this.expenseService.paymentBookForm.note = this.dataForm.controls['note'].value;
  }

  async onSelectedExpenseStepType(event: string) {
    // check value has change
    if (this.paymentList?.data?.length > 0) {
      // confirm to change value
      const confirmRes = await this.confirmChangeSelected();
      if (!confirmRes) {
        // if not change value, use old value
        this.oldControlValue.stepCode && this.getControl('stepCode')?.patchValue(this.oldControlValue.stepCode);
        return;
      }
    }
    this.dataForm?.markAsDirty();
    if (event) {
      this.expenseStepSubType = await this.masterDataService.getExpenseStepSubType([3], event);
      if (this.expenseStepSubType) {
        this.dataService.set(LOCAL_STORAGE.MASTER.EXPENSE_STEP_SUB_TYPE, this.expenseStepSubType);
      }
      // clear data
      ['stepSubCode', 'expenseTypeCode', 'expenseSubTypeCode'].forEach(e => {
        this.getControl(e)?.reset();
      });
      this.confirmRemovePaymentList();
      // set old value
      this.oldControlValue = {
        stepCode: event,
        stepSubCode: undefined,
        expenseTypeCode: undefined,
        expenseSubTypeCode: undefined,
      };
      this.expenseService.expenseDetail.stepCode = event;
      this.detail.stepCode = event;
      this.reInitTable();
    }
  }

  async onSelectedExpenseStepSubType(event: string) {
    // check value has change
    if (this.paymentList?.data?.length > 0) {
      // confirm to change value
      const confirmRes = await this.confirmChangeSelected();
      if (!confirmRes) {
        // if not change value, use old value
        this.oldControlValue.stepSubCode &&
          this.getControl('stepSubCode')?.patchValue(this.oldControlValue.stepSubCode);
        return;
      }
    }
    this.dataForm?.markAsDirty();
    if (event) {
      const value = this.dataForm.getRawValue();
      this.expenseType = await this.masterDataService.getExpenseTypeCode(
        [3],
        undefined,
        value?.stepCode,
        value?.stepSubCode
      );
      this.mapOptionExpenseType();
      if (this.expenseType) {
        this.dataService.set(LOCAL_STORAGE.MASTER.EXPENSE_TYPE_CODE, this.expenseType);
      }
      // clear data
      ['expenseTypeCode', 'expenseSubTypeCode'].forEach(e => {
        this.getControl(e)?.reset();
      });
      this.confirmRemovePaymentList();
      // set old value
      this.oldControlValue.stepSubCode = event;
      this.oldControlValue.expenseTypeCode = undefined;
      this.oldControlValue.expenseSubTypeCode = undefined;
      this.expenseService.expenseDetail.stepSubCode = event;
      this.detail.stepSubCode = event;
      this.reInitTable();
    }
  }

  async onSelectedExpenseType(event: string) {
    // check value has change
    if (this.paymentList?.data?.length > 0) {
      // confirm to change value
      const confirmRes = await this.confirmChangeSelected();
      if (!confirmRes) {
        // if not change value, use old value
        this.oldControlValue.expenseTypeCode &&
          this.getControl('expenseTypeCode')?.patchValue(this.oldControlValue.expenseTypeCode);
        return;
      }
    }
    this.dataForm?.markAsDirty();
    if (event) {
      const value = this.dataForm.getRawValue();
      let response = await this.configurationService.getExpenseTypeCode(value?.expenseTypeCode);
      if (response) {
        this.dataService.set(LOCAL_STORAGE.CONFIGURATION.EXPENSE_TYPE_CODE, response);
      }
      this.withholdingTaxInfo = await this.expenseService.genWithholdingTaxInfo(
        value?.expenseTypeCod,
        this.withholdingTaxInfo,
        this.mode
      );
      this.expenseSubType = await this.masterDataService.getExpenseRate(
        [3],
        undefined,
        value?.expenseTypeCode,
        undefined,
        value?.stepCode,
        value?.stepSubCode
      );
      if (this.expenseSubType) {
        this.dataService.set(LOCAL_STORAGE.MASTER.EXPENSE_RATE, this.expenseSubType);
      }
      // clear data
      this.getControl('expenseSubTypeCode')?.reset();
      this.confirmRemovePaymentList();
      // set old value
      this.oldControlValue.expenseTypeCode = event;
      this.oldControlValue.expenseSubTypeCode = undefined;
      this.expenseService.expenseDetail.expenseTypeCode = event;
      this.detail.expenseTypeCode = event;
    }
  }

  async onSelectedExpenseSubType(event: string) {
    // check value has change
    if (this.paymentList?.data?.length > 0) {
      // confirm to change value
      const confirmRes = await this.confirmChangeSelected();
      if (!confirmRes) {
        // if not change value, use old value
        this.oldControlValue.expenseSubTypeCode &&
          this.getControl('expenseSubTypeCode')?.patchValue(this.oldControlValue.expenseSubTypeCode);
        return;
      }
    }
    this.dataForm?.markAsDirty();
    if (event) {
      const expenseSubType = this.expenseSubType.find(e => e.expenseSubTypeCode === event);
      this.getControl('expenseRateId')?.patchValue(expenseSubType?.id || '');
      this.detail = {
        ...this.detail,
        accountCode: expenseSubType?.accountCode,
        paymentMethodName: expenseSubType?.paymentMethodName,
        whtRate: expenseSubType?.whtRate,
      };
      this.seizureType = expenseSubType?.seizureType;
      this.seizureObjectType = expenseSubType?.objectType;
      this.withholdingTaxInfo.receiverName = expenseSubType?.receiverName;
      // clear data
      this.confirmRemovePaymentList();
      // set old value
      this.oldControlValue.expenseSubTypeCode = event;
      this.expenseService.expenseDetail.expenseSubTypeCode = event;
      this.detail.expenseSubTypeCode = event;
    }
  }

  confirmRemovePaymentList() {
    if (this.mode === TMode.ADD) {
      this.expenseService.expenseTransactionRequest = [];
    } else {
      const expenseTransactionDto = this.expenseService.expenseDetail.expenseTransactionDto || [];
      const paymentListReq: ExpenseTransactionRequest[] = [];
      expenseTransactionDto?.forEach(e => {
        paymentListReq.push(this.expenseService.mapExpenseTransaction(e, 'D'));
      });
      this.expenseService.expenseTransactionRequest = paymentListReq;
      this.dataForm.get('expenseTransactionDto')?.patchValue([]);
    }
    this.getControl('note')?.patchValue(null);
    this.getControl('assigneeId')?.patchValue(null);
    this.checkbox.forEach(element => {
      element.checked = false;
    });
    this.paymentList.data! = [];
    this.expenseService.expenseTransactionList = [];

    this.isCaseExecutionSeizure = this.expenseService.isCaseExecutionSeizureAsset(
      this.getControl('stepCode')?.value || '',
      this.getControl('stepSubCode')?.value || ''
    );
  }

  get reason() {
    switch (this.expenseStatusCode) {
      case 'PENDING_EXPENSE_CLAIM_CORRECTION':
      case 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION':
      case 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL':
        if (this.detail?.rejectReason) {
          return this.detail?.rejectReason;
        } else {
          // case cancel
          if (this.detail?.cancelReason) {
            return this.detail?.cancelReason;
          } else {
            return null;
          }
        }
      case 'PAYMENT_FAILED':
        return this.detail?.cbsErrorReason;
      case 'PENDING_AUTO_REVERSE_EXPENSE_CLAIM':
      case 'PENDING_DECIDE_REVERSE_EXPENSE_CLAIM':
      case 'CANCELLED_EXPENSE_CLAIM':
        return this.detail?.cancelReason;
      default:
        return null;
    }
  }

  get reasonNote() {
    switch (this.expenseStatusCode) {
      case 'PENDING_EXPENSE_CLAIM_CORRECTION':
      case 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION':
      case 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL':
        if (this.detail?.rejectReasonNote) {
          return this.detail?.rejectReasonNote;
        } else {
          // case cancel
          if (this.detail?.cancelReasonNote) {
            return this.detail?.cancelReasonNote;
          } else {
            return null;
          }
        }
      case 'PAYMENT_FAILED':
        return this.detail?.cbsErrorReason;
      case 'PENDING_AUTO_REVERSE_EXPENSE_CLAIM':
      case 'PENDING_DECIDE_REVERSE_EXPENSE_CLAIM':
      case 'CANCELLED_EXPENSE_CLAIM':
        return this.detail?.cancelReasonNote;
      default:
        return this.detail?.requestKbmReason;
    }
  }

  async confirmChangeSelected(): Promise<any> {
    const result: Promise<any> = await this.notificationService.warningDialog(
      'FINANCE.CONFIRM_CHANGE_DIALOG_TITLE',
      'FINANCE.CONFIRM_CHANGE_DIALOG_MESSAGE',
      'FINANCE.CONFIRM_CHANGE_DIALOG_TITLE',
      'icon-Check-Square-Free-Fill'
    );
    return result;
  }

  onCheckboxChange(event: any, i: number) {
    this.checkbox[i].checked = event.target.checked;
    this.expenseService.checkbox = this.checkbox;
    this.dataForm?.markAsDirty();
  }

  get isCheckboxAll(): boolean {
    return this.checkbox.every(e => e.checked === true);
  }

  async navigateToLitigation(lgId: string, debtSaleStatus?: string) {
    // LEX2-96 routing
    this.routerService.navigateTo('/main/finance/expense/detail/reimbursement', {
      litigationId: lgId,
      debtSaleStatus: debtSaleStatus,
      isShowActionBar: true,
    });
  }

  async navigateToCustomer(customerId: string) {
    this.routerService.navigateTo('/main/customer/detail', { customerId: customerId });
  }

  async addPaymentList(isOnRequest: boolean = true) {
    this.isClickAddPaymentList = true;
    const formValue = this.dataForm.getRawValue();

    if (!formValue.stepCode || !formValue.stepSubCode || !formValue.expenseTypeCode || !formValue.expenseSubTypeCode) {
      return;
    }

    /* Enhance sprint3: LEX2-38469 */
    if ((this.paymentList?.data?.length || 0) >= 5) {
      this.notificationService.alertDialog('FINANCE.MAX_5_PAYMENT_BOOK.TITLE', 'FINANCE.MAX_5_PAYMENT_BOOK.DETAIL');
      return;
    }

    const result = await this.notificationService.showCustomDialog({
      component: AddPaymentListDialogComponent,
      type: 'small',
      iconName: 'icon-Plus',
      title: 'FINANCE.ADD_PAYMENT_LIST_DIALOG.TITLE',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'COMMON.BUTTON_CONTINUE2',
      buttonIconName: 'icon-Arrow-Right',
      context: {
        expenseRateId: this.getControl('expenseRateId')?.value,
        isCaseExecutionSeizureAsset: this.expenseService.isCaseExecutionSeizureAsset(
          this.getControl('stepCode')?.value || '',
          this.getControl('stepSubCode')?.value || ''
        ),
      },
    });
    if (result) {
      this.dataForm?.markAsDirty();
      this.expenseService.paymentBookForm = { ...this.expenseService.paymentBookForm, ...this.dataForm.getRawValue() };
      if (this.mode === TMode.EDIT) {
        this.expenseService.expenseTransactionList = this.paymentList?.data;
      }
      this.routerService.navigateTo('/main/finance/expense/detail/expense-detail-view', {
        expenseRateId: this.getControl('expenseRateId')?.value,
        litigationId: result?.litigationId,
        litigationCaseId: result?.litigationCaseId,
        taskCode: this.taskCode,
        expenseNo: this.detail?.expenseNo,
        mode: TMode.ADD,
        stepCode: this.detail.stepCode || this.expenseService.expenseDetail?.stepCode,
        isOnRequest: isOnRequest ? isOnRequest : undefined,
        seizureType: this.seizureType,
        seizureObjectType: this.seizureObjectType,
        orderId: (this.expenseService.expenseTransactionList?.length || 0) + 1,
      });
    }
  }

  editPaymentList(index: number, transaction: ExpenseTransactionDto) {
    this.dataForm?.markAsDirty();
    if (this.mode === TMode.EDIT) {
      if (this.expenseService.expenseTransactionList == null) {
        this.expenseService.expenseTransactionList = this.dataForm.get('expenseTransactionDto')?.value;
      }
    }
    if (this.isCaseExecutionSeizure) {
      this.expenseService.paymentBookForm = {
        ...this.expenseService.paymentBookForm,
        expenseTransactionDto: this.expenseService.expenseTransactionList,
      };
    } else {
      this.expenseService.paymentBookForm = { ...this.expenseService.paymentBookForm, ...this.dataForm.getRawValue() };
    }
    this.routerService.navigateTo('/main/finance/expense/detail/expense-detail-view', {
      mode: TMode.EDIT,
      litigationId: transaction.lgId,
      litigationCaseId: transaction.litigationCaseId,
      transactionIndex: index,
      transactionId: transaction.id,
      expenseRateId: this.getControl('expenseRateId')?.value,
      taskCode: this.taskCode,
      expenseNo: this.detail?.expenseNo,
      isAutoPay: this.expenseStatusCode === 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION',
      expenseGroup: this.detail?.expenseGroup,
      transactionIdList: this.detail?.expenseTransactionDto?.map(e => e.id).join(','),
      seizureObjectType: this.seizureObjectType,
      seizureType: this.seizureType,
      stepCode:
        this.detail.stepCode ||
        this.expenseService.expenseDetail?.stepCode ||
        this.expenseService.paymentBookForm?.stepCode,
      orderId: transaction.orderId,
    });
  }

  detailPaymentList(index: number, transaction: ExpenseTransactionDto) {
    this.expenseService.expenseTransactionList = this.dataForm.get('expenseTransactionDto')?.value;
    /** Retain any edited data */
    this.expenseService.paymentBookForm = { ...this.expenseService.paymentBookForm, ...this.dataForm.getRawValue() };
    this.expenseService.navigateToExpenseDetailViewModeView(
      index,
      transaction,
      this.expenseStatusCode,
      this.detail,
      this.seizureType
    );
  }

  async removePaymentList(index: number, data: ExpenseTransactionDto) {
    const messageDetail = this.translate.instant('FINANCE.REMOVE_EXPENSE_LIST_DIALOG.MESSAGE_DETAIL', {
      LG_ID: data.lgId || '-',
      BLACK_CASE_NO: data.blackCaseNo || '-',
      RED_CASE_NO: data.redCaseNo || '-',
    });
    const result = await this.notificationService.confirmRemoveLeftAlignedDialog(
      'FINANCE.REMOVE_EXPENSE_LIST_DIALOG.TITLE',
      messageDetail,
      {
        rightButtonLabel: 'FINANCE.REMOVE_EXPENSE_LIST_DIALOG.BUTTON_REMOVE_CONFIRM',
        rightIconButtonClass: 'mb-4',
      } as DialogOptions
    );
    if (result) {
      this.dataForm?.markAsDirty();
      const paymentList = this.paymentList?.data;
      paymentList.splice(index, 1);
      this.paymentList.data = paymentList;
      this.expenseService.expenseTransactionList = this.paymentList?.data;
      if (this.mode !== TMode.ADD) {
        if (data.id == null) {
          const paymentList = this.expenseService.expenseTransactionRequest || [];
          paymentList.splice(index, 1);
          this.expenseService.expenseTransactionRequest = paymentList;
        }
        this.deleteTransaction(data);
      } else {
        if (this.actionBarEventName === 'SAVE') {
          this.deleteTransaction(data);
        } else {
          const paymentList = this.expenseService.expenseTransactionRequest || [];
          paymentList.splice(index, 1);
          this.expenseService.expenseTransactionRequest = paymentList;
        }
      }

      this.notificationService.openSnackbarSuccess(`ลบรายการเบิก LG ID ${data.lgId} แล้ว`);
    }
  }

  deleteTransaction(data: ExpenseTransactionDto) {
    this.dataForm?.markAsDirty();
    let expenseTransactionDto = this.expenseService.expenseDetail?.expenseTransactionDto as ExpenseTransactionDto[];
    if (expenseTransactionDto == null) {
      return;
    }
    let expenseTransaction = expenseTransactionDto.find(e => e.id === data.id);
    if (this.actionBarEventName === 'SAVE') {
      expenseTransaction = data || [];
    }
    if (expenseTransaction) {
      let paymentReq: ExpenseTransactionRequest = this.expenseService.mapExpenseTransaction(expenseTransaction, 'D');
      if (this.expenseService.expenseTransactionRequest == null) {
        this.expenseService.expenseTransactionRequest = [];
      }
      this.expenseService.expenseTransactionRequest?.push(paymentReq);
    }
  }

  async remarkPaymentList(index: number, element: ExpenseTransactionDto) {
    const context = {
      id: element.id,
      note: element.note,
      isViewMode: this.mode === this.MODE.VIEW,
    };

    //Enh LEX2-25188 LEX2-22822 remark view-mode only
    if (['E32092', 'E32121', 'E32122'].includes(element?.expenseRateId || '')) {
      context.isViewMode = true;
    }

    const result = await this.notificationService.showCustomDialog({
      component: RemarksPaymentDialogComponent,
      type: 'large',
      autoWidth: false,
      iconName: 'icon-Notepad',
      title: 'COMMON.LABEL_REMARKS',
      leftButtonLabel: this.mode === this.MODE.VIEW ? '' : 'COMMON.BUTTON_CANCEL',
      rightButtonLabel:
        this.mode === this.MODE.VIEW
          ? 'EXECUTION_WARRANT.LIST_ACCOUNT_DOCUMENT.BUTTON_CLOSE'
          : 'FINANCE.REMARKS_PAYMENT_DIALOG.BUTTON_REMARKS_CONFIRM',
      buttonIconName: this.mode === this.MODE.VIEW ? 'icon-Dismiss-Square' : 'icon-save-primary',
      context: context,
    });
    if (result && result?.note) {
      this.dataForm?.markAsDirty();
      this.paymentList.data[index].note = result.note;
      if (this.detail.expenseTransactionDto && this.detail.expenseTransactionDto[index])
        this.detail.expenseTransactionDto[index].note = result.note;
      if (this.expenseService.expenseTransactionList)
        this.expenseService.expenseTransactionList[index].note = result.note;

      if (this.expenseService.paymentBookForm) {
        this.expenseService.paymentBookForm.expenseTransactionDto[index].note = result.note;
      }

      // update request/add to request if not added
      this.expenseService.updateExpenseTransactionRequest(
        index,
        element,
        { note: result.note },
        this.isCaseExecutionSeizure
      );

      this.mode !== this.MODE.VIEW &&
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('COMMON.LABEL_REMARKS')} ${this.translate.instant('TASK.LABEL_SAVED')}`
        );
    }
  }

  onChangeRadio(event: MatRadioChange, index: number) {
    this.paymentList.data[index]['isApproved'] = event.value;
    (this.dataForm.get('expenseTransactionDto') as UntypedFormArray)
      ?.at(index)
      ?.get('isApproved')
      ?.patchValue(event.value);
    this.dataForm?.markAsDirty();
    this.expenseService.hasVerify = false;
    if (this.expenseService.paymentBookForm) {
      this.expenseService.paymentBookForm.expenseTransactionDto[index].isApproved = event.value;
    }
    this.expenseService.updateExpenseTransactionRequest(
      index,
      this.paymentList.data[index],
      { isApproved: event.value },
      this.isCaseExecutionSeizure
    );
  }

  // table document ใบเสร็จรับเงิน
  onViewDocument(_index: number) {
    console.log('CreatePaymentBookComponent -- onViewDocument');
  }

  onRemoveDocument(_index: number) {
    console.log('CreatePaymentBookComponent -- onRemoveDocument');
  }

  onUploadDocument(_index: number, documentTemplateId: string = '') {
    console.log('CreatePaymentBookComponent -- onUploadDocument');
  }

  async navigateToExecutionDetail(element: ExpenseTransactionDto) {
    const seizureType = this.seizureType || element.propertyType;
    this.routerService.navigateTo('/main/lawsuit/seizure-property/execution-detail', {
      seizureId: element.seizureId || 0,
      seizureLedId: element.seizureLedId || 0,
      supportType: seizureType === 'NCOL' ? SeizureSupportTypeEnum.NON_MORTGAGE : '',
      mode: TMode.VIEW,
    });
  }

  async navigateToWithdrawnDetail(
    withdrawSeizureId: string,
    withdrawSeizuresLedId: string,
    litigationId: string,
    litigationCaseId: string
  ) {
    this.routerService.navigateTo('/main/lawsuit/withdrawn-seizure-property', {
      mode: 'VIEW',
      withdrawSeizureId: withdrawSeizureId || 0,
      withdrawSeizuresLedId: withdrawSeizuresLedId || 0,
      litigationId: litigationId,
      litigationCaseId: litigationCaseId,
      isFromPageExpenses: true,
    });
  }

  async navigateByObjectType(expenseTransactionDto: ExpenseTransactionDto, actionFrom: string) {
    if (this.objectTypeAuction.includes(expenseTransactionDto?.objectType || '')) {
      //Enh LEX2-22822
      if (actionFrom === 'mainLedAuction') {
        //<!-- สบค./วันประกาศขายนัดเเรก Column mainLedAuction -->
        this.routerService.navigateTo('/main/lawsuit/auction', {
          mode: 'VIEW',
          requestMenu: 'VIEW_PAYMENT',
          litigationCaseId: expenseTransactionDto?.litigationCaseId,
          litigationId: expenseTransactionDto?.lgId,
          auctionExpenseId: expenseTransactionDto.objectId,
        });
      }
    } else if (this.objectTypeBidding.includes(expenseTransactionDto?.objectType || '')) {
      //Enh LEX2-742
      /* Fix LEX2-30689: commend this code, can remove after bug has been FIXED
      let isConfirm = false;
      if(this.sessionService.currentUser?.userId === this.currentAssigneeId){
        isConfirm = await this.notificationService.warningDialog(
          'COMMON.EXIT_WITHOUT_SAVE',
          'COMMON.MESSAGE_EXIT',
          'COMMON.EXIT_WITHOUT_SAVE',
          'icon-Reset'
        );
      }else{
        isConfirm = true
      }

      if(actionFrom === 'mainLedAuction' && isConfirm){//<!-- สบค./วันประกาศขายนัดเเรก Column mainLedAuction -->
        this.routerService.navigateTo('/main/lawsuit/auction/auction-detail', {
          mode: 'VIEW',
          auctionMenu: 'VIEW_CASHIER',
          litigationCaseId: expenseTransactionDto?.litigationCaseId,
          litigationId: expenseTransactionDto?.lgId,
          aucRef: expenseTransactionDto?.aucRef,
          auctionExpenseId: expenseTransactionDto.objectId,
        });
      }
      */
      if (actionFrom === 'mainLedAuction') {
        //<!-- สบค./วันประกาศขายนัดเเรก Column mainLedAuction -->
        this.routerService.navigateTo('/main/lawsuit/auction/auction-detail', {
          mode: 'VIEW',
          auctionMenu: 'VIEW_CASHIER',
          litigationCaseId: expenseTransactionDto?.litigationCaseId,
          litigationId: expenseTransactionDto?.lgId,
          aucRef: expenseTransactionDto?.aucRef,
          auctionExpenseId: expenseTransactionDto.objectId,
        });
      }
    }
  }

  async fetchNewMainLed(obj: ExpenseTransactionDto) {
    if (obj.objectType === 'AUCTION_EXPENSE') {
      //mainLed = link to /ktb/rest/lexs/v1/auction/expense/info?auctionExpenseId={expenseTransactionDto.objectId}
      const auctionExpenseInfoObj: AuctionExpenseInfo = await this.auctionPaymentService.inquiryAuctionExpenseInfo(
        Number(obj?.objectId) || 0
      );
      obj.mainLed = auctionExpenseInfoObj?.ledName;
    } else if (obj.objectType === 'AUC_BIDDING_ID' || obj.objectType === 'CONVY_ACC_DOC_FOLLOWUP_ID') {
      //mainLed = link to /ktb/rest/lexs/v1/auction/biddings/announces/{expenseTransactionDto.aucRef}/bidding-announce
      const auctionBiddingAnnounceResultObj: AuctionBiddingsAnnouncesResponse =
        await this.auctionService.getAuctionBiddingAnnounceResult(Number(obj?.aucRef) || 0);
      obj.mainLed = auctionBiddingAnnounceResultObj?.ledName;
    }
  }

  //LEX2-38449 check case display data migration from app eplg
  isCaseDataMigration(obj: ExpenseTransactionDto): boolean {
    return obj.litigationExist == false;
  }
}
