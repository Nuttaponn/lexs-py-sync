import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { acceptFile_PDF_JPG, maxFileSize, statusCode, taskCode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import {
  AuctionBiddingsAnnouncesResponse,
  AuctionExpenseInfo,
  DocumentDto,
  ExpenseApprovalRequest,
  ExpenseDetailDto,
  ExpenseTransactionDto,
  NameValuePair,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { ExpenseService } from '../../services/expense.service';
import { IWithholdingTaxInfo, TActionBarEventName } from '../create-payment-book/create-payment-book.component';
import { CHECK_BOX, ExpenseMsgMapper, ReceiptErrorMsgMapper, approverOptionConfig } from '../expense.constant';
import { RemarksPaymentDialogComponent } from '../remarks-payment-dialog/remarks-payment-dialog.component';
import { AuctionService } from '@app/modules/auction/auction.service';
import { AuctionPaymentService } from '@app/modules/auction/auction-advance-payment/service/auction-payment.service';
import { SeizureSupportTypeEnum } from '@app/modules/seizure-property/models';

@Component({
  selector: 'app-expense-payment-detail',
  templateUrl: './expense-payment-detail.component.html',
  styleUrls: ['./expense-payment-detail.component.scss'],
})
export class ExpensePaymentDetailComponent implements OnInit {
  @Input() dataForm!: UntypedFormGroup;
  @Input() statusCode!: statusCode;
  @Input() taskCode!: taskCode;
  @Input() currentAssigneeId!: string;
  @Input() currentAssigneeName!: string;
  @Input() actionBarEventName!: TActionBarEventName;

  public expenseStatusCode!: string;
  public expenseMsgMapper = ExpenseMsgMapper;
  public receiptErrorMsgMapper = ReceiptErrorMsgMapper;

  // accordion
  public isOpened0 = true; // เหตุผลการพิจารณา
  public isOpened1 = true; // ข้อมูลหนังสือเบิกจ่ายเงิน
  public isOpened2 = false; // ข้อมูลการหักภาษี ณ ที่จ่าย
  public isOpened3 = true; // isOpened0
  public canShowReceiptDoc = true;

  /** File upload */
  public acceptFile: Array<string> = acceptFile_PDF_JPG;
  public receiptDocs: any[] = [];
  public receiptDocsColumns: string[] = ['documentName', 'receiptDate', 'uploadBy', 'uploadDate', 'action'];
  public receiptDocsColumnsE62: string[] = ['documentName', 'uploadBy', 'uploadDate', 'action'];
  public receiptDocsViewColumnsE62: string[] = ['documentName', 'uploadBy', 'uploadDate'];
  public paymentList: ExpenseTransactionDto[] = [];
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
    'pass',
    'fail',
  ];

  public isCaseExecutionSeizure: boolean = false;
  public detail!: ExpenseDetailDto;
  public withholdingTaxInfo: IWithholdingTaxInfo = {};
  public checkbox: typeof CHECK_BOX = this.expenseService.checkbox.map(item => {
    item.checked = true;
    return item;
  });
  public objectTypeBidding = ['AUC_BIDDING_ID', 'CONVY_ACC_DOC_FOLLOWUP_ID'];
  public objectTypeAuction = ['AUCTION_EXPENSE'];

  /** dropdown */
  public approverOptionConfig = approverOptionConfig;
  public approverOption: Array<NameValuePair> = [];
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  public maxFileSize: number = maxFileSize; // MB Size
  public minDate = new Date();
  public receiptReadonly = false;

  public isView!: boolean;
  public currentUser = this.sessionService.currentUser;

  public isChildComponentVisible = true;

  public validateActionsError = ['REJECT', 'SUBMIT', 'SENT', 'CANCELCASE'];
  public validateExpenseStatusCode = [
    'PENDING_EXPENSE_CLAIM_VERIFICATION',
    'PENDING_PAYMENT_CONSIDERATION',
    'PENDING_PAYMENT_APPROVAL_CONSIDERATION',
    'PENDING_PAYMENT_APPROVAL',
    'PENDING_EXPENSE_CLAIM_CORRECTION',
    'PENDING_AUTO_PAYMENT_VERIFICATION',
    'PENDING_AUTO_PAYMENT_APPROVAL',
    'PENDING_PAYMENT_CONFIRMATION',
    'PENDING_CONSIDER_REFUND',
  ];

  public isNoShowRadioCols: boolean = false;
  public hideNote: boolean = false;

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private sessionService: SessionService,
    public expenseService: ExpenseService,
    private documentService: DocumentService,
    private routerService: RouterService,
    private auctionService: AuctionService,
    private auctionPaymentService: AuctionPaymentService
  ) {
    this.initMasterData();
  }

  get approverName() {
    return this.approverOption.find(i => i.value === this.dataForm.get('assigneeId')?.value)?.name || '-';
  }

  async ngOnInit() {
    this.minDate.setDate(this.minDate.getDate() + 1);

    // handle isView mode
    this.isView = this.sessionService.currentUser?.userId === this.currentAssigneeId ? false : true;
    if (this.isView) {
      this.approverOptionConfig.disableSelect = true;
    } else {
      this.approverOptionConfig.disableSelect = false;
    }

    this.detail = {
      ...this.expenseService.paymentBookForm /** Retain any edited data */,
      ...this.expenseService.expenseDetail,
    };
    if (this.expenseService.paymentBookForm?.assigneeId) {
      this.dataForm.get('assigneeId')?.setValue(this.expenseService.paymentBookForm?.assigneeId);
    }
    this.expenseStatusCode = this.detail.expenseStatusCode || '';
    this.withholdingTaxInfo = await this.expenseService.genWithholdingTaxInfo(
      this.detail.expenseTypeCode || '',
      this.withholdingTaxInfo
    );
    this.canShowReceiptDoc =
      this.detail.expenseGroup !== 1 &&
      this.taskCode !== 'CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION' &&
      this.taskCode !== 'EXPENSE_CLAIM_PAYMENT_APPROVAL';
    if (this.taskCode === 'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL') {
      let mergedArr = [];
      this.detail.mergedExpenseTransaction && mergedArr.push(this.detail.mergedExpenseTransaction);
      this.paymentList = mergedArr;
      this.dataForm.get('assigneeId')?.setValue(this.approverOption[0] ? this.approverOption[0].value : '');
      this.dataForm.get('assigneeId')?.updateValueAndValidity();
    } else {
      this.paymentList = this.detail.expenseTransactionDto || [];
    }

    // handle receipt document
    if (this.taskCode === 'EXPENSE_CLAIM_RECEIPT_UPLOAD' || this.taskCode === 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD') {
      this.receiptReadonly = this.isView || ['PENDING_APPROVAL', 'FINISHED'].includes(this.statusCode);
      this.paymentColumns = this.paymentColumns.filter(obj => obj !== 'pass' && obj !== 'fail');
      this.isNoShowRadioCols = true;
    } else {
      if (this.statusCode === 'FINISHED') {
        this.paymentColumns = this.paymentColumns.filter(obj => obj !== 'pass' && obj !== 'fail');
        this.isNoShowRadioCols = true;
      }
      this.receiptReadonly = true;
    }

    // LEX2-739 [MVP2 SP 3]
    if (
      this.detail.stepCode == 'EXECUTION' &&
      (this.detail.stepSubCode === 'SEIZURE' || this.detail.stepSubCode == 'SEIZURE_NON_PLEDGE_ASSET')
    ) {
      this.paymentColumns = this.paymentColumns.filter(obj => obj != 'court');
      this.paymentColumns.splice(4, 0, 'objectType', 'mainLed', 'paymentDate');
      this.isCaseExecutionSeizure = true;
    }
    // LEX2-741 [MVP2 SP 3]
    if (this.detail.stepCode == 'EXECUTION' && this.detail.stepSubCode === 'WITHDRAW_SEIZURE') {
      this.paymentColumns = this.paymentColumns.filter(obj => obj != 'court');
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

    // get document from detail object by task code
    if (this.taskCode === 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD') {
      const documentReceipt: any =
        this.detail.financialNewsReceipt || this.expenseService.expenseDetail.financialNewsReceipt;
      const receiptDate = documentReceipt?.attributes?.['receiptDate']
        ? new Date(documentReceipt?.attributes['receiptDate'])
        : '';
      const receiptObj = {
        removeDocument: true,
        ...this.detail.financialNewsReceipt,
        attributes: {
          receiptDate: receiptDate,
        },
        params: {
          name: documentReceipt?.imageName,
        },
      };
      if (this.receiptReadonly && this.statusCode !== 'PENDING_APPROVAL') {
        this.receiptDocsColumns = ['documentName', 'receiptDate', 'uploadBy', 'uploadDate'];
      } else {
        this.receiptDocsColumns = ['documentName', 'receiptDate', 'uploadBy', 'uploadDate', 'action'];
      }
      this.detail.financialNewsReceipt && this.receiptDocs.push(receiptObj);
      this.replaceWithUploadedDocuments();
    } else {
      // taskCode as 'EXPENSE_CLAIM_RECEIPT_UPLOAD' or other
      const documentReceipt: any = this.detail.klawReceipt || this.expenseService.expenseDetail.klawReceipt;
      const receiptDate = documentReceipt?.attributes?.['receiptDate']
        ? new Date(documentReceipt?.attributes['receiptDate'])
        : '';
      const receiptObj = {
        removeDocument: true,
        ...this.detail.klawReceipt,
        attributes: {
          receiptDate: receiptDate,
        },
        params: {
          name: documentReceipt?.imageName,
        },
      };
      if (this.receiptReadonly && this.statusCode !== 'PENDING_APPROVAL')
        this.receiptDocsColumns = this.receiptDocsColumns.slice(0, 4);
      this.detail.klawReceipt && this.receiptDocs.push(receiptObj);
      this.replaceWithUploadedDocuments();
    }

    // isn't task owner filter out column action
    if (this.currentUser?.userId != this.currentAssigneeId) {
      this.receiptDocsColumns = this.receiptDocsColumns.filter(item => item !== 'action');
    }

    // flag hideNote witg condition
    // 1. expenseRateId > ['E22101', 'E22102']
    this.hideNote = (this.detail?.expenseRateId && ['E22101', 'E22102'].includes(this.detail?.expenseRateId)) || false;
  }

  replaceWithUploadedDocuments() {
    if (this.expenseService.currentReceiptDocs) {
      this.receiptDocs.forEach(doc => {
        const index = this.expenseService.currentReceiptDocs?.findIndex(
          rdoc => rdoc.documentTemplateId === doc.documentTemplateId
        );
        if (index !== undefined && index >= 0) {
          doc.imageId = this.expenseService.currentReceiptDocs?.[index].imageId;
          doc.isUpload = this.expenseService.currentReceiptDocs?.[index].isUpload;
          doc.uploadDate = this.expenseService.currentReceiptDocs?.[index].uploadDate;
          doc.documentDate = this.expenseService.currentReceiptDocs?.[index].documentDate;
          doc.params = this.expenseService.currentReceiptDocs?.[index].params;
          doc.attributes = this.expenseService.currentReceiptDocs?.[index].attributes;
        }
        if (this.taskCode === 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD') {
          this.expenseService.expenseDetail.financialNewsReceipt = doc;
        } else {
          this.expenseService.expenseDetail.klawReceipt = doc;
        }
      });
      this.dataForm.markAsDirty();
    }
  }

  async initMasterData() {
    // get Approver List
    const approverList = await this.expenseService.getApproverList(
      this.expenseService.expenseDetail?.expenseStatusCode as ExpenseApprovalRequest.ExpenseStatusEnum,
      this.expenseService.expenseDetail?.stepCode
    );
    let tempArray: NameValuePair[] = [];
    approverList.forEach(e => {
      tempArray.push({
        name: e.userId + ' - ' + e.name + ' ' + e.surname,
        value: e.userId,
      });
    });
    this.approverOption = tempArray;
  }

  onCheckboxChange(event: any, i: number) {
    this.checkbox[i].checked = event.target.checked;
    this.expenseService.checkbox = this.checkbox;
    this.dataForm.markAsDirty();
  }

  get isCheckboxAll(): boolean {
    return this.checkbox.every(e => e.checked === true);
  }

  onChangeRadio(event: MatRadioChange, index: number) {
    (this.dataForm.get('expenseTransactionDto') as UntypedFormArray).at(index).get('isApproved')?.setValue(event.value);
    (this.dataForm.get('expenseTransactionDto') as UntypedFormArray)
      .at(index)
      .get('isApproved')
      ?.updateValueAndValidity();
    this.dataForm?.markAsDirty();
    this.paymentList[index].isApproved = event.value;
    this.expenseService.paymentBookForm.expenseTransactionDto[index].isApproved = event.value;
    this.expenseService.hasVerify = false;
    this.expenseService.updateExpenseTransactionRequest(
      index,
      this.expenseService.expenseTransactionRequest![index],
      { isApproved: event.value },
      this.isCaseExecutionSeizure
    );
  }

  detailPaymentList(index: number, transaction: ExpenseTransactionDto) {
    /** Retain any edited data */
    this.expenseService.paymentBookForm = { ...this.expenseService.paymentBookForm, ...this.dataForm.getRawValue() };
    this.expenseService.navigateToExpenseDetailViewModeView(
      index,
      transaction,
      this.expenseStatusCode,
      this.detail,
      transaction.propertyType
    );
  }

  async remarkPaymentList(index: number, element: ExpenseTransactionDto) {
    const context = {
      id: element?.id,
      note: element?.note,
      isViewMode: this.isView,
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
      leftButtonLabel: context.isViewMode ? '' : 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: context.isViewMode
        ? 'EXECUTION_WARRANT.LIST_ACCOUNT_DOCUMENT.BUTTON_CLOSE'
        : 'FINANCE.REMARKS_PAYMENT_DIALOG.BUTTON_REMARKS_CONFIRM',
      buttonIconName: context.isViewMode ? 'icon-Dismiss-Square' : 'icon-save-primary',
      context: context,
    });
    if (result && result?.note) {
      (this.dataForm.get('expenseTransactionDto') as UntypedFormArray)
        ?.at(index)
        ?.patchValue({ note: result.note, updateFlag: 'U' });
      const expenseTransactionDto = this.expenseService.expenseDetail.expenseTransactionDto || [];
      expenseTransactionDto[index].note = result?.note;
      this.expenseService.expenseDetail.expenseTransactionDto = expenseTransactionDto;
      !context.isViewMode &&
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('COMMON.LABEL_REMARKS')} ${this.translate.instant('TASK.LABEL_SAVED')}`
        );
      this.dataForm.markAsDirty();

      this.expenseService.paymentBookForm.expenseTransactionDto[index].note = result?.note;
      // update request
      this.expenseService.updateExpenseTransactionRequest(
        index,
        element,
        { note: result.note },
        this.isCaseExecutionSeizure
      );
    }
  }

  onUploadDocument(_index: number) {
    this.expenseService.receiptError = '';
    this.dataForm.markAsDirty();

    const documentTemplateId = this.receiptDocs[_index].documentTemplate?.documentTemplateId || '';
    const expenseNo = this.detail?.expenseNo;
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = async (event: Event) => {
      const element = event.target as HTMLInputElement;
      const fileList = element?.files || [];
      for (let index = 0; index < fileList.length; index++) {
        const file = this.documentService.validateFileType(fileList[index]);
        if (Utils.validateFileSize(file.size)) {
          const res = await this.documentService.uploadBasicDocument(documentTemplateId, file, expenseNo);
          this.receiptDocs[_index].imageId = res.uploadSessionId;
          this.receiptDocs[_index].isUpload = this.receiptDocs[_index].imageId ? true : false;
          this.receiptDocs[_index].uploadDate = this.receiptDocs[_index].imageId ? new Date().toDateString() : '';
          this.receiptDocs[_index].documentDate = this.receiptDocs[_index].imageId ? new Date().toISOString() : '';
          this.receiptDocs[_index].params = { name: file.name };
          if (this.taskCode === 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD') {
            this.expenseService.expenseDetail.financialNewsReceipt = { ...this.receiptDocs[_index] };
          } else {
            this.expenseService.expenseDetail.klawReceipt = {
              ...this.receiptDocs[_index],
              attributes: {
                ...this.expenseService?.expenseDetail?.klawReceipt?.attributes,
              },
            };
          }
          if (this.receiptDocs[_index].imageId && !this.receiptReadonly) {
            this.receiptDocs[_index].attributes.receiptDate = ''; // YYYY-MM-DD
            this.onReceiptDateChange('', _index); // this.minDate.toString()
            this.recreateChildComponent();
          }
          this.expenseService.currentReceiptDocs = this.receiptDocs;
        } else {
          this.receiptDocs[_index].imageId = '';
          this.receiptDocs[_index].isUpload = false;
          this.receiptDocs[_index].uploadDate = '';
          this.receiptDocs[_index].documentDate = '';
          this.receiptDocs[_index].params = null;
          this.receiptDocs[_index].attributes = {};
          if (this.taskCode === 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD') {
            this.expenseService.expenseDetail.financialNewsReceipt = { ...this.receiptDocs[_index] };
          } else {
            this.expenseService.expenseDetail.klawReceipt = {
              ...this.receiptDocs[_index],
              attributes: {
                ...this.expenseService?.expenseDetail?.klawReceipt?.attributes,
              },
            };
          }
          this.expenseService.currentReceiptDocs = this.receiptDocs;
          this.notificationService.openSnackbarError(
            this.translate.instant('UPLOAD_FILE.ERROR_FILE_SIZE_EXCEED', { SIZE_EXCEED: this.maxFileSize.toString() })
          );
        }
      }
      element.value = '';
    };
    fileInput.click();
  }

  recreateChildComponent(): void {
    this.isChildComponentVisible = false;
    setTimeout(() => {
      this.isChildComponentVisible = true;
    }, 0);
  }

  onReceiptDateChange(value: string, index: number) {
    this.dataForm.markAsDirty();
    if (this.taskCode === 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD') {
      if (
        this.expenseService &&
        this.expenseService.expenseDetail &&
        this.expenseService.expenseDetail.financialNewsReceipt
      ) {
        this.expenseService.expenseDetail.financialNewsReceipt.attributes = { receiptDate: value };
        this.receiptDocs[index].attributes = { receiptDate: value };
      }
    } else {
      if (this.expenseService && this.expenseService.expenseDetail && this.expenseService.expenseDetail.klawReceipt) {
        this.expenseService.expenseDetail.klawReceipt.attributes = { receiptDate: value };
        this.receiptDocs[index].attributes = { receiptDate: value };
      }
    }
    this.expenseService.currentReceiptDocs = this.receiptDocs;
  }
  verifyReceipt(_index: number) {
    this.expenseService.hasVerify = true;
    this.onViewDocument(_index);
  }

  onRemoveDocument(_index: number) {
    this.dataForm.markAsDirty();
    this.receiptDocs = this.receiptDocs.filter((m: any, key: number) => {
      if (m?.documentTemplate?.documentTemplateId == this.receiptDocs[_index]?.documentTemplateId) {
        m.imageId = '';
        m.isUpload = false;
        m.uploadDate = '';
        m.documentDate = '';
        m.total = 0;
        m.params = null;
        m.attributes = {};
      }
      return true;
    });
    this.expenseService.expenseDetail.klawReceipt = {
      ...this.receiptDocs[_index],
      attributes: {
        ...this.expenseService?.expenseDetail?.klawReceipt?.attributes,
      },
    };
    this.expenseService.currentReceiptDocs = this.receiptDocs;
  }

  async onViewDocument(_index: number) {
    const response: any = await this.documentService.getDocument(
      this.receiptDocs[_index].imageId || '',
      DocumentDto.ImageSourceEnum.Lexs
    );
    if (!response) return;
    const fileName = this.receiptDocs[_index].documentTemplate?.documentName ?? 'doc';
    this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
  }

  getControl(name: string): any {
    return this.dataForm.get(name);
  }

  async navigateToLitigation(lgId: string, debtSaleStatus?: string) {
    // this.routerService.navigateTo('/main/lawsuit/detail', { lgId: lgId });
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

  async navigateToExecutionDetail(element: ExpenseTransactionDto) {
    this.routerService.navigateTo('/main/lawsuit/seizure-property/execution-detail', {
      mode: 'VIEW',
      seizureId: element.seizureId || 0,
      seizureLedId: element.seizureLedId || 0,
      supportType: element.propertyType === 'NCOL' ? SeizureSupportTypeEnum.NON_MORTGAGE : '',
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
      if (this.sessionService.currentUser?.userId === this.currentAssigneeId) {
        isConfirm = await this.notificationService.warningDialog(
          'COMMON.EXIT_WITHOUT_SAVE',
          'COMMON.MESSAGE_EXIT',
          'COMMON.EXIT_WITHOUT_SAVE',
          'icon-Reset'
        );
      } else {
        isConfirm = true;
      }

      if (actionFrom === 'mainLedAuction' && isConfirm) {
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
