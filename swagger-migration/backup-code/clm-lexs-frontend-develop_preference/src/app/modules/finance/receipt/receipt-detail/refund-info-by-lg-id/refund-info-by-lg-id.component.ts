import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { RemarksPaymentDialogComponent } from '@app/modules/finance/expense/remarks-payment-dialog/remarks-payment-dialog.component';
import { ReceiptService } from '@app/modules/finance/services/receipt.service';
import { statusCode, taskCode } from '@app/shared/models';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  ExpenseReceiveData,
  NameValuePair,
  ReceiveOrderDto,
  TransferOrderDto,
  TransferTransactionDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig } from '@spig/core';

@Component({
  selector: 'app-refund-info-by-lg-id',
  templateUrl: './refund-info-by-lg-id.component.html',
  styleUrls: ['./refund-info-by-lg-id.component.scss'],
})
export class RefundInfoByLgIdComponent implements OnInit {
  @Input() refundInfoForm!: UntypedFormGroup;
  @Input() isViewMode!: boolean;
  @Input() isDownLoad!: boolean;
  @Input() isViewCreditNote!: boolean;
  receiveTransactionsColumns: string[] = [
    'no',
    'advancePaymentAccountNo',
    'expenseType',
    'totalAmount',
    'remainingAmount',
    'advancePaymentDate',
    'receiveTypeCode',
    'clearingAmount',
    'remark',
  ];
  mainBorrowerColumns: string[] = ['mainBorrowerPersonName', 'courtName', 'responseUnit', 'branch', 'total'];
  creditNoteColums: string[] = ['creditNoteReceiverOrgCode', 'sendAmount', 'creditNoteDescription'];
  public creditNoteDownloadColums: string[] = [
    'creditNoteReceiverOrgCode',
    'sendAmount',
    'creditNoteDescription',
    'creditNote',
  ];
  public expenseReceiveConfig: DropDownConfig = {
    iconName: 'N/A',
    displayWith: 'receiveTypeDesc',
    valueField: 'receiveTypeCode',
    searchPlaceHolder: '',
    labelPlaceHolder: 'ประเภทรายรับ',
  };
  public expenseReceiveOptions: ExpenseReceiveData[] = [];
  public ktbOrgConfig: DropDownConfig = {
    iconName: 'N/A',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'หน่วยงานที่รับ Credit Note',
  };
  public ktbOrgOptions: NameValuePair[] = [];
  public creditNoteConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'code',
    searchPlaceHolder: '',
    labelPlaceHolder: 'รหัสบัญชี',
  };
  public creditNoteOptions: any[] = [];

  form!: UntypedFormGroup;
  tableReceiveTransactions!: any;
  public receiveStatus!: ReceiveOrderDto.ReceiveStatusEnum;
  public taskCode!: taskCode;
  public taskId?: number;
  public transferOrdersList!: Array<TransferOrderDto>;
  public statusCode?: statusCode;
  public outboundTransferT!: Array<TransferTransactionDto>;
  numberSum: number = 0;

  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService,
    private masterDataService: MasterDataService,
    public receiptService: ReceiptService,
    private routerService: RouterService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.receiveStatus = this.receiptService.receiveStatus;
    this.statusCode = this.receiptService.receiveStatus;
    this.taskId = this.receiptService.taskId;
    this.statusCode = this.receiptService.statusCode;

    this.initDropdown();
    this.intitData();

    this.transferOrdersList = this.receiptService?.receiveOrdersKcorp?.transferOrders || [];
    this.receiptService.isDownLoadList = new Array(this.transferOrdersList.length).fill(false);

    this.outboundTransferT = this.receiptService?.receiveOrdersKcorp?.outboundTransferTransaction || [];
    if (this.outboundTransferT.length === 0 && this.taskCode === 'RECEIVE_COURT_PAYMENT') {
      this.receiptService.receiveOrdersKcorp.outboundTransferTransaction = [];
    }

    this.transferOrdersList.map((element, index) => {
      element.transferTransactions?.map(item => {
        if (item && item.hitCreditNote && item.hitCreditNote > 0) {
          this.receiptService.isDownLoadList[index] = true;
        }
      });
    });
    if (this.isDownLoad && this.receiptService.receiveType !== 'SUSPENSE_COURT') {
      this.receiptService.isDownLoadList = new Array(this.refundInfoForm.get('transferOrders')?.value.length).fill(
        false
      );
      let list = this.refundInfoForm.get('transferOrders')?.value as TransferOrderDto[];
      list.map((element, index) => {
        element.transferTransactions?.map(item => {
          if (item && item.hitCreditNote && item.hitCreditNote > 0) {
            this.receiptService.isDownLoadList[index] = true;
          }
        });
      });
    }
  }

  async initDropdown() {
    let expenseReceive = (await this.masterDataService.expenseReceive()).expenseReceive || [];
    this.expenseReceiveOptions = expenseReceive.filter(
      f => f?.expenseTypeCode === this.refundInfoForm.get('receiveType')?.value
    );
    this.ktbOrgOptions = (await this.masterDataService.ktbOrg()).ktbOrg || [];
  }

  async intitData() {
    if (this.receiveStatus !== 'PENDING_NO_SUCCESS' && this.statusCode !== 'PENDING_APPROVAL') {
      this.receiveTransactionsColumns = this.receiveTransactionsColumns.slice(0, 8);
      this.receiveTransactionsColumns.push('remark');
    }
    if (this.receiveStatus === 'PENDING_NO_SUCCESS' || this.receiveStatus === 'RECORD_NO_SUCCESS') {
      this.receiveTransactionsColumns.splice(8, 0, 'status');
    }
    let sum: number = 0;
    let da = this.transferOrders;

    let list = da?.value || [];
    for (let index = 0; index < list.length; index++) {
      const trf: any = list[index];
      let receiveT = trf.receiveTransactions
        ?.map((t: any) => Number(t?.clearingAmount))
        .reduce((acc?: number, value?: number) => acc! + value!, 0);
      sum = sum + receiveT;
    }
    this.numberSum = sum;
  }

  getControl(ctrName: string, idx: number): any {
    return this.transferOrders.at(idx)?.get(ctrName);
  }

  async onClickRemark(element: any) {
    let id = element?.value?.id;
    let note = element?.value?.note;
    let financeType = 'RECEIPT';
    const context = {
      id,
      note,
      financeType,
      isViewMode: this.isViewMode,
    };
    const result = await this.notificationService.showCustomDialog({
      component: RemarksPaymentDialogComponent,
      type: 'xsmall',
      iconName: 'icon-Notepad',
      title: 'COMMON.LABEL_REMARKS',
      leftButtonLabel: this.isViewMode ? '' : 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: this.isViewMode
        ? 'EXECUTION_WARRANT.LIST_ACCOUNT_DOCUMENT.BUTTON_CLOSE'
        : 'FINANCE.REMARKS_PAYMENT_DIALOG.BUTTON_REMARKS_CONFIRM',
      buttonIconName: this.isViewMode ? 'icon-Dismiss-Square' : 'icon-save-primary',
      context: context,
    });
    if (result) {
      this.getArray(element, 'note').setValue(result?.note);
      !this.isViewMode &&
        this.notificationService.openSnackbarSuccess(
          `${this.translate.instant('COMMON.LABEL_REMARKS')} ${this.translate.instant('TASK.LABEL_SAVED')}`
        );
    }
  }

  async deleleLg(index: number) {
    let blackCaseNo = this.getControl('blackCaseNo', index)?.value || '-';
    let redCaseNo = this.getControl('redCaseNo', index)?.value || '-';
    let lg = this.getControl('litigationId', index)?.value || '-';
    let msg = `ลบรายการโอนเงินของ LG ID ${lg} คดีหมายเลขดำ ${blackCaseNo}, คดีหมายเลขแดง ${redCaseNo}`;
    const isContinue = await this.notificationService.warningDialog(
      'ลบรายการโอนเงิน',
      msg,
      'ยืนยันลบรายการโอนเงิน',
      'icon-Bin'
    );
    if (isContinue) {
      this.transferOrders.removeAt(index);
    }
  }

  async onClickLg(lgId: string) {
    const _confirm = await this.sessionService.confirmExitWithoutSave();
    if (_confirm) {
      this.receiptService.clearData();
      this.routerService.navigateTo('/main/finance/expense/detail/reimbursement', {
        litigationId: lgId,
        isShowActionBar: true,
      });
    }
  }

  get transferOrders(): UntypedFormArray {
    return this.refundInfoForm.get('transferOrders') as UntypedFormArray;
  }

  get outboundTransferTransaction(): UntypedFormArray {
    return this.refundInfoForm?.get('outboundTransferTransaction') as UntypedFormArray;
  }

  getArray(ctr: any, ctrName: string): any {
    return ctr.get(ctrName) as UntypedFormArray;
  }

  returnNumber(string: string) {
    return typeof string === 'string' ? Number(string) : string;
  }
  onClearingChange(element: any) {
    let clearingAmount = this.returnNumber(element?.value?.clearingAmount);
    let remainingAmount = this.returnNumber(element?.value?.remainingAmount);
    if (
      (['E11', 'E31'].includes(element?.value?.expenseTypeCode) && clearingAmount > remainingAmount) ||
      clearingAmount <= 0
    ) {
      this.getArray(element, 'clearingAmount')?.setValue('');
    } else {
      if (clearingAmount > 0) {
        this.getArray(element, 'receiveTypeCode')?.setValidators(Validators.required);
      } else {
        this.getArray(element, 'receiveTypeCode')?.setValidators([]);
      }
      this.getArray(element, 'receiveTypeCode')?.updateValueAndValidity();
    }

    let sum: number = 0;
    let da = this.transferOrders;

    let list = da?.value || [];
    for (let index = 0; index < list.length; index++) {
      const trf: any = list[index];
      let receiveT = trf.receiveTransactions
        ?.map((t: any) => Number(t?.clearingAmount))
        .reduce((acc?: number, value?: number) => acc! + value!, 0);
      sum = sum + receiveT;
    }
    this.numberSum = sum;
  }
  onChaneReceiveType(element: any) {
    this.getArray(element, 'clearingAmount')?.setValidators([]);
    this.getArray(element, 'clearingAmount')?.reset();
    this.getArray(element, 'clearingAmount')?.updateValueAndValidity();
  }

  async onDownLoad(index: number, element: any) {
    let res = await this.receiptService.downloadCreditNote(
      this.getArray(element, 'litigationCaseId')?.value,
      this.getArray(element, 'litigationId')?.value,
      this.refundInfoForm.get('receiveNo')?.value
    );
    this.receiptService.isDownLoadList[index] = true;
  }

  onChangeSendAmount(element: any) {
    if (element.value.sendAmount && element.value.sendAmount > 0) {
      this.getArray(element, 'creditNoteDescription').setValidators(Validators.required);
    } else {
      this.getArray(element, 'creditNoteDescription').clearValidators();
    }
    this.getArray(element, 'creditNoteDescription').updateValueAndValidity();
  }
}
