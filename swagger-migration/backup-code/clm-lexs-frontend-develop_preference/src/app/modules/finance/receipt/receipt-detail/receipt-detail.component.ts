import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MODE } from '@app/modules/user/user-form.constant';
import { RejectDialogComponent } from '@app/shared/components/common-dialogs/reject-dialog/reject-dialog.component';
import { ActionBar, TMode, statusCode, taskCode } from '@app/shared/models';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  CourtReceiveOrderDto,
  MeLexsUserDto,
  ReceiveAccountCode,
  ReceiveKcorpInquiryInfoResponse,
  ReceiveKcorpPaymentInfoResponse,
  ReceiveOrderDto,
} from '@lexs/lexs-client';
import { ReceiptService } from '../../services/receipt.service';

@Component({
  selector: 'app-receipt-detail',
  templateUrl: './receipt-detail.component.html',
  styleUrls: ['./receipt-detail.component.scss'],
})
export class ReceiptDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,
    private notificationService: NotificationService,
    public receiptService: ReceiptService,
    private sessionService: SessionService,
    private masterData: MasterDataService
  ) {
    this.receiptService.receiptLandingTab.next(0);
  }

  public isKcorp: boolean = false;
  public actionBar: ActionBar = { hasSave: false, hasCancel: false, hasReject: false, hasPrimary: false };
  public title = 'FINANCE.TITIL_RECEIPT_DETAIL';
  public taskCode!: taskCode;
  private taskId!: number;
  public statusCode!: statusCode;
  public receiveStatus!: ReceiveOrderDto.ReceiveStatusEnum;
  public receiveType!: string;

  public receiveOrdersData!: ReceiveOrderDto;
  public courtReceiveOrder!: CourtReceiveOrderDto;
  public refundInfoForm!: UntypedFormGroup;
  public refundInfoFormKcorp!: UntypedFormGroup;
  public currentUser: MeLexsUserDto | undefined = {};
  public isViewMode: boolean = false;
  public mode: any = '';
  public MODE = MODE;
  public kcorpView: string = '';
  public accessPermissions = this.sessionService.accessPermissions();
  public taskUnprocess: boolean = false;
  public isViewCreditNote!: boolean;
  editModeStatus = [
    ReceiveOrderDto.ReceiveStatusEnum.Draft,
    ReceiveOrderDto.ReceiveStatusEnum.PendingEdit,
    ReceiveOrderDto.ReceiveStatusEnum.PendingNoSuccess,
    ReceiveOrderDto.ReceiveStatusEnum.RecordNoSuccess,
    MODE.ADD,
  ];
  public isDownLoad!: boolean;
  public isPendingNoSuccess: boolean = false;
  public payer!: string;

  public showDetailAsKcorp!: boolean;

  async ngOnInit(): Promise<void> {
    this.currentUser = this.sessionService.currentUser;
    this.isKcorp = this.route.snapshot.queryParams['type'] === 'KCORP';
    this.kcorpView = this.route.snapshot.queryParams['kcorpView'];
    this.taskCode = this.route.snapshot.queryParams['taskCode'] as taskCode;
    this.taskId = this.route.snapshot.queryParams['taskId'];
    this.mode = this.route.snapshot.queryParams['mode'];
    this.statusCode = this.route.snapshot.queryParams['statusCode'] as statusCode;
    this.payer = this.route.snapshot.queryParams['payer'];
    this.receiveStatus = this.receiptService.receiveStatus;
    this.receiveOrdersData = this.receiptService.receiveOrders;
    this.courtReceiveOrder = this.receiptService.receiveOrdersKcorp;
    this.receiveType = this.receiptService.receiveType;
    // Set isViewMode as true if statusCode = PENDING_APPROVAL

    this.taskUnprocess = this.courtReceiveOrder?.taskUnprocess || false;
    this.isViewMode =
      (this.receiptService.currentAssigneeId !== this.currentUser?.userId ||
        this.route.snapshot.queryParams['currentAssigneeId'] !== this.currentUser?.userId ||
        this.accessPermissions.subRoleCode === 'APPROVER' ||
        (this.taskCode === 'RECEIVE_NORMAL_PAYMENT' && this.receiptService.hasSuccessStatus) ||
        this.receiveStatus === 'PENDING_NO_SUCCESS' ||
        this.receiveStatus === 'COMPLETED_SYSTEM') &&
      this.mode !== MODE.ADD &&
      this.kcorpView !== 'REFUND_ADD';
    if (this.taskCode === 'RECEIVE_CREDIT_NOTE_PAYMENT') {
      this.isViewCreditNote = this.receiptService.currentAssigneeId !== this.currentUser?.userId ? true : false;
      if (this.receiptService.receiveType !== 'SUSPENSE_COURT') {
        this.isViewMode = true;
      }
    }
    this.isPendingNoSuccess =
      (this.taskCode === 'RECEIVE_NORMAL_PAYMENT' ||
        (this.taskCode === 'RECEIVE_CREDIT_NOTE_PAYMENT' && this.receiptService.receiveType !== 'SUSPENSE_COURT')) &&
      this.receiveStatus === 'PENDING_NO_SUCCESS' &&
      !this.receiptService.hasSuccessStatus;
    this.initActionBar();
    await this.initForm();
    this.isDownLoad = this.taskCode === 'RECEIVE_CREDIT_NOTE_PAYMENT' ? true : false;
  }

  async initForm() {
    if (
      this.mode === MODE.ADD ||
      ((this.taskCode === 'RECEIVE_NORMAL_PAYMENT' ||
        (this.taskCode === 'RECEIVE_CREDIT_NOTE_PAYMENT' && this.receiveType !== 'SUSPENSE_COURT') ||
        (this.receiveStatus === 'COMPLETED_SYSTEM' && this.payer !== 'COURT') ||
        this.receiveType === 'SUSPENSE' ||
        this.receiveType === 'INTER_OFFICE') &&
        !this.isKcorp)
    ) {
      if (this.mode === MODE.ADD) this.title = 'FINANCE.CREATE_RECEIPT';
      this.refundInfoForm = this.receiptService.genRefundInfoForm(this.receiveOrdersData);
      this.showDetailAsKcorp = false;
    } else if (
      this.taskCode === 'RECEIVE_COURT_PAYMENT' ||
      (this.taskCode === 'RECEIVE_CREDIT_NOTE_PAYMENT' && this.receiveType === 'SUSPENSE_COURT') ||
      (this.receiveStatus === 'COMPLETED_SYSTEM' && this.payer === 'COURT') ||
      this.receiveType === 'SUSPENSE_COURT' ||
      this.receiveType === 'AUTO_CLEARING' ||
      this.isKcorp
    ) {
      let receiveAccountCode = await this.masterData.receiveAccountCode();
      let receiveAccount = receiveAccountCode.receiveAccountCode?.find(
        (f: any) => f.receiveType === 'SUSPENSE_COURT'
      ) as ReceiveAccountCode;
      if (this.kcorpView == 'REFUND_ADD') {
        this.title = 'FINANCE.CREATE_RECEIPT';
        const referenceNoDetail = this.receiptService.referenceNoDetail?.content
          ? (this.receiptService.referenceNoDetail.content[0] as ReceiveKcorpPaymentInfoResponse)
          : {};
        const receiveDetailKcorp = this.receiptService.receiveDetailKcorp?.content
          ? (this.receiptService.receiveDetailKcorp.content[0] as ReceiveKcorpInquiryInfoResponse)
          : {};

        let obj: CourtReceiveOrderDto = {
          suspenseAccountDate: referenceNoDetail?.suspenseAccountDate,
          courtName: referenceNoDetail?.courtName,
          washAccountNo: receiveDetailKcorp?.washAccountNo,
          payAmount: referenceNoDetail?.payAmount,
          receiveTypeName: receiveDetailKcorp?.paidType,
          receiveType: 'SUSPENSE_COURT',
          ref1: referenceNoDetail?.ref1,
          ref2: referenceNoDetail?.ref2,
          referenceNo: referenceNoDetail?.referenceNo,
        };
        this.refundInfoFormKcorp = this.receiptService.genRefundInfoKcorpForm(obj, receiveAccount);
      } else {
        this.refundInfoFormKcorp = this.receiptService.genRefundInfoKcorpForm(this.courtReceiveOrder, receiveAccount);
      }
      this.showDetailAsKcorp = true;
    }
  }

  initActionBar() {
    if (this.mode === MODE.ADD || this.kcorpView == 'REFUND_ADD') {
      this.actionBar = {
        hasSave: true,
        saveText: 'COMMON.BUTTON_SAVE_DARFT',
        hasCancel: false,
        hasReject: false,
        hasPrimary: true,
        primaryText: 'FINANCE.BUTTON_SUBMIT',
      };
    } else if (this.kcorpView === 'REFUND_INFO') {
      this.actionBar = {
        hasSave: this.receiptService.currentAssigneeId === this.currentUser?.userId,
        hasCancel: false,
        hasReject:
          this.receiptService.currentAssigneeId === this.currentUser?.userId
            ? this.receiveStatus === 'PENDING_NO_SUCCESS'
              ? this.receiptService.hasSuccessStatus
              : true
            : false,
        rejectText: 'ยกเลิกรายการ',
        rejectIcon: 'icon-Dismiss-Square',
        hasPrimary: this.receiptService.currentAssigneeId === this.currentUser?.userId,
        primaryText: this.statusCode === 'PENDING_APPROVAL' ? 'COMMON.LABEL_APPROVE' : 'FINANCE.BUTTON_SUBMIT',
        saveText: 'COMMON.BUTTON_SAVE_DARFT',
      };
    } else {
      switch (this.taskCode) {
        case 'RECEIVE_ADVANCE_PAYMENT':
          this.actionBar = {
            hasSave: false,
            hasCancel: true,
            hasReject: true,
            rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
            rejectIcon: 'icon-Arrow-Revert',
            hasPrimary: true,
            primaryText: 'COMMON.LABEL_APPROVE',
          };
          break;
        case 'RECEIVE_COURT_PAYMENT':
          if (this.editModeStatus.includes(this.receiveStatus) || this.taskUnprocess) {
            this.actionBar = {
              hasSave: this.receiptService.currentAssigneeId === this.currentUser?.userId,
              hasCancel: false,
              hasReject:
                this.receiptService.currentAssigneeId === this.currentUser?.userId
                  ? this.receiveStatus === 'PENDING_NO_SUCCESS'
                    ? this.receiptService.hasSuccessStatus
                    : true
                  : false,
              rejectText: 'ยกเลิกรายการ',
              rejectIcon: 'icon-Dismiss-Square',
              hasPrimary: this.receiptService.currentAssigneeId === this.currentUser?.userId,
              primaryText: this.statusCode === 'PENDING_APPROVAL' ? 'COMMON.LABEL_APPROVE' : 'FINANCE.BUTTON_SUBMIT',
              saveText: 'COMMON.BUTTON_SAVE_DARFT',
            };
          }
          if (this.accessPermissions.subRoleCode === 'APPROVER' && !this.taskUnprocess) {
            this.actionBar = {
              hasSave: false,
              hasCancel: false,
              hasReject: this.receiptService.currentAssigneeId === this.currentUser?.userId,
              rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
              rejectIcon: 'icon-Arrow-Revert',
              hasPrimary: this.receiptService.currentAssigneeId === this.currentUser?.userId,
              primaryText: 'COMMON.LABEL_APPROVE',
            };
          }

          break;
        case 'RECEIVE_NORMAL_PAYMENT':
          if (this.editModeStatus.includes(this.receiveStatus)) {
            this.actionBar = {
              hasSave: this.receiptService.currentAssigneeId === this.currentUser?.userId,
              hasCancel: false,
              hasReject:
                this.receiveStatus === 'PENDING_EDIT' ||
                (this.receiveStatus === 'PENDING_NO_SUCCESS' && !this.receiptService.hasSuccessStatus),
              rejectIcon: this.currentUser?.subRoleCode === 'MAKER' ? 'icon-Dismiss-Square' : 'icon-Arrow-Revert',
              rejectText: this.currentUser?.subRoleCode === 'MAKER' ? 'ยกเลิกรายการ' : 'COMMON.BUTTON_SEND_BACK_EDIT',
              hasPrimary: this.receiptService.currentAssigneeId === this.currentUser?.userId,
              primaryText: 'FINANCE.BUTTON_SUBMIT',
            };
          }
          if (this.accessPermissions.subRoleCode === 'APPROVER') {
            this.actionBar = {
              hasSave: false,
              hasCancel: false,
              hasReject: this.receiptService.currentAssigneeId === this.currentUser?.userId,
              rejectText: 'COMMON.BUTTON_SEND_BACK_EDIT',
              rejectIcon: 'icon-Arrow-Revert',
              hasPrimary: this.receiptService.currentAssigneeId === this.currentUser?.userId,
              primaryText: 'COMMON.LABEL_APPROVE',
            };
          }
          break;
        case 'RECEIVE_CREDIT_NOTE_PAYMENT':
          if (!this.isViewCreditNote) {
            this.actionBar = {
              hasSave: false,
              hasCancel: false,
              hasReject: false,
              hasPrimary: true,
              primaryText: 'COMMON.BUTTON_FINISH',
            };
          }

          break;
        default:
          this.actionBar = { hasSave: false, hasCancel: false, hasReject: false, hasPrimary: false };
          break;
      }
    }
  }

  async onReject() {
    let context: any = {
      taskId: this.taskId,
      taskCode: this.taskCode,
      mode: 'FINANCE_RECEIPT',
      action: 'REJECT',
    };
    let receiveNo = this.receiveOrdersData?.receiveNo || this.refundInfoForm?.get('receiveNo')?.value;
    console.log('this.taskCode', this.taskCode);
    switch (this.taskCode) {
      case 'RECEIVE_NORMAL_PAYMENT':
        context.dataForm = this.refundInfoForm;
        context.maxTextArea = 500;
        const respons = await this.notificationService.showCustomDialog({
          component: RejectDialogComponent,
          iconName: 'icon-Arrow-Revert',
          title: this.currentUser?.subRoleCode === 'MAKER' ? 'ยกเลิกรายการ' : 'COMMON.BUTTON_SEND_BACK_EDIT',
          leftButtonLabel: 'COMMON.BUTTON_CANCEL',
          rightButtonLabel: this.currentUser?.subRoleCode === 'MAKER' ? 'ยกเลิกรายการ' : 'COMMON.BUTTON_SEND_BACK_EDIT',
          buttonIconName: this.currentUser?.subRoleCode === 'MAKER' ? 'icon-Dismiss-Square' : 'icon-Arrow-Revert',
          rightButtonClass: 'long-button mat-warn',
          context: context,
        });
        if (respons) {
          let req = await this.receiptService.getReceiveOrderRequest(
            this.currentUser?.subRoleCode === 'MAKER'
              ? ReceiveOrderDto.HeaderFlagEnum.Cancel
              : ReceiveOrderDto.HeaderFlagEnum.Reject,
            this.refundInfoForm
          );
          let res = await this.receiptService.saveReceiveOrder(req, this.taskId);
          if (this.mode === MODE.ADD) receiveNo = res.receiveNo;
          this.notificationService.openSnackbarSuccess(
            this.currentUser?.subRoleCode === 'MAKER'
              ? `เลขที่หนังสือ ${receiveNo} ยกเลิกรายการสำเร็จแล้ว`
              : `เลขที่หนังสือ ${receiveNo} ส่งกลับแก้ไขสำเร็จแล้ว`
          );
          this.refundInfoForm.markAsPristine();
          this.refundInfoForm.updateValueAndValidity();
          this.onBack();
        }
        break;
      case 'RECEIVE_COURT_PAYMENT':
        context.dataForm = this.refundInfoFormKcorp;
        const response = await this.notificationService.showCustomDialog({
          component: RejectDialogComponent,
          iconName: this.currentUser?.subRoleCode === 'MAKER' ? 'icon-Dismiss-Square' : 'icon-Arrow-Revert',
          title:
            this.currentUser?.subRoleCode === 'MAKER' ? 'FINANCE.BUTTON_CANCEL_LIST' : 'COMMON.BUTTON_SEND_BACK_EDIT',
          leftButtonLabel: 'COMMON.BUTTON_CANCEL',
          rightButtonLabel:
            this.currentUser?.subRoleCode === 'MAKER'
              ? 'FINANCE.BUTTON_CANCEL_LIST_CONFIRM'
              : 'COMMON.CONFIRM_SEND_BACK_EDIT',
          buttonIconName: this.currentUser?.subRoleCode === 'MAKER' ? 'icon-Dismiss-Square' : 'icon-Arrow-Revert',
          rightButtonClass: 'long-button mat-warn',
          context: context,
        });
        if (response) {
          let req = this.receiptService.getCourtReceiveOrderRequest(
            this.currentUser?.subRoleCode === 'MAKER'
              ? ReceiveOrderDto.HeaderFlagEnum.Cancel
              : ReceiveOrderDto.HeaderFlagEnum.Reject,
            this.refundInfoFormKcorp
          );
          await this.receiptService.saveCourtReceiveOrder(this.taskId, req);
          this.notificationService.openSnackbarSuccess(
            this.currentUser?.subRoleCode === 'MAKER'
              ? `เลขที่หนังสือ ${req.receiveNo} ยกเลิกรายการสำเร็จแล้ว`
              : `เลขที่หนังสือ ${req.receiveNo} ส่งกลับแก้ไขสำเร็จแล้ว`
          );
          this.refundInfoFormKcorp.markAsPristine();
          this.refundInfoFormKcorp.updateValueAndValidity();
          this.onBack();
          this.receiptService.receiptLandingTab.next(3);
        }
        break;
      case 'RECEIVE_CREDIT_NOTE_PAYMENT':
        if (this.receiptService.receiveType !== 'SUSPENSE_COURT') {
          context.dataForm = this.refundInfoForm;
          const respon = await this.notificationService.showCustomDialog({
            component: RejectDialogComponent,
            iconName: 'icon-Arrow-Revert',
            title: 'COMMON.BUTTON_SEND_BACK_EDIT',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            rightButtonLabel: 'ยืนยันส่งกลับแก้ไข',
            buttonIconName: 'icon-Arrow-Revert',
            rightButtonClass: 'long-button mat-warn',
            context: context,
          });
          if (respon) {
            let req = await this.receiptService.getReceiveOrderRequest(
              ReceiveOrderDto.HeaderFlagEnum.Reject,
              this.refundInfoForm
            );
            let res = await this.receiptService.saveReceiveOrder(req, this.taskId);
            if (this.mode === MODE.ADD) receiveNo = res.receiveNo;
            this.notificationService.openSnackbarSuccess(`เลขที่หนังสือ ${receiveNo} ส่งกลับแก้ไขสำเร็จแล้ว`);
            this.refundInfoForm.markAsPristine();
            this.refundInfoForm.updateValueAndValidity();
            this.onBack();
          }
        }
        break;
      default:
        break;
    }
  }

  async onSubmit() {
    const arr = this.receiptService.isDownLoadList;
    const checkAllDownloaded = (arr: boolean[]) => arr.every((v: boolean) => v === true);
    let headerFlag = ReceiveOrderDto.HeaderFlagEnum.Submit;
    let msg = 'นำเสนอสำเร็จแล้ว';
    if (this.accessPermissions.subRoleCode === 'APPROVER') {
      headerFlag = ReceiveOrderDto.HeaderFlagEnum.Approve;
      msg = 'อนุมัติสำเร็จแล้ว';
    }
    let receiveNo = this.receiveOrdersData?.receiveNo || this.refundInfoForm?.get('receiveNo')?.value;
    if (this.taskCode === 'RECEIVE_NORMAL_PAYMENT' || this.mode === MODE.ADD) {
      this.refundInfoForm.markAllAsTouched();
      this.refundInfoForm.updateValueAndValidity();
      if (
        (await this.receiptService.checkReceiveOrderIsValid(this.refundInfoForm, this.mode)) &&
        this.refundInfoForm.valid
      ) {
        const isContinue = await this.notificationService.warningDialog(
          'DIALOG_ALERT.TITLE_CONFIRM_SEND_INFO',
          'DIALOG_ALERT.MESSAGE_CONFIRM_SEND_INFO',
          'DIALOG.CONFIRM_BUTTON_CONFIRM',
          'icon-Selected'
        );
        if (isContinue) {
          let req = await this.receiptService.getReceiveOrderRequest(headerFlag, this.refundInfoForm);
          let res = await this.receiptService.saveReceiveOrder(req, this.taskId);
          if (this.mode === MODE.ADD) receiveNo = res.receiveNo;
          this.notificationService.openSnackbarSuccess(`เลขที่หนังสือ ${receiveNo}  ${msg}`);
          this.refundInfoForm.markAsPristine();
          this.refundInfoForm.updateValueAndValidity();
          this.onBack();
        }
      }
    } else if (
      this.taskCode === 'RECEIVE_COURT_PAYMENT' ||
      this.kcorpView == 'REFUND_ADD' ||
      this.kcorpView == 'REFUND_INFO'
    ) {
      if (this.taskUnprocess) {
        this.refundInfoFormKcorp.get('unprocessReason')?.setValidators(Validators.required);
        this.refundInfoFormKcorp.get('unprocessReason')?.updateValueAndValidity();
      }

      this.refundInfoFormKcorp.markAllAsTouched();
      this.refundInfoFormKcorp.updateValueAndValidity();
      if (
        (await this.receiptService.checkReceiveOrderIsValid(this.refundInfoFormKcorp, this.kcorpView)) &&
        this.refundInfoFormKcorp.valid
      ) {
        const isContinue = await this.notificationService.warningDialog(
          'DIALOG_ALERT.TITLE_CONFIRM_SEND_INFO',
          'DIALOG_ALERT.MESSAGE_CONFIRM_SEND_INFO',
          'DIALOG.CONFIRM_BUTTON_CONFIRM',
          'icon-Selected'
        );
        if (isContinue) {
          let req = this.receiptService.getCourtReceiveOrderRequest(headerFlag, this.refundInfoFormKcorp);
          if (this.kcorpView == 'REFUND_ADD' && !this.taskId) this.taskId = 0;
          const res = await this.receiptService.saveCourtReceiveOrder(this.taskId, req);
          this.notificationService.openSnackbarSuccess(`เลขที่หนังสือ ${res.receiveNo} ${msg}`);
          this.refundInfoFormKcorp.markAsPristine();
          this.refundInfoFormKcorp.updateValueAndValidity();
          this.onBack();
        }
      }
    } else if (this.taskCode === 'RECEIVE_CREDIT_NOTE_PAYMENT' && checkAllDownloaded(arr)) {
      const isContinue = await this.notificationService.warningDialog(
        'DIALOG_ALERT.TITLE_CONFIRM_SEND_INFO',
        'DIALOG_ALERT.MESSAGE_CONFIRM_SEND_INFO',
        'DIALOG.CONFIRM_BUTTON_CONFIRM',
        'icon-Selected'
      );
      if (isContinue) {
        const response = await this.receiptService.approve(this.taskId);
        console.log('response', response);
        if (response.success) {
          this.onBack();
          this.notificationService.openSnackbarSuccess(
            `เลขที่หนังสือ ${this.receiveOrdersData.receiveNo} ดาวน์โหลด Credit Note สำเร็จแล้ว`
          );
        }
      }
    }
  }

  async fetchData() {
    if (!this.kcorpView && this.mode === TMode.ADD) {
      await this.receiptService.setReceiveOrder(this.refundInfoForm.get('receiveNo')?.value);
    } else if (this.kcorpView === 'REFUND_ADD') {
      const _receiveNo =
        this.receiveOrdersData?.receiveNo ||
        this.refundInfoForm?.get('receiveNo')?.value ||
        this.refundInfoFormKcorp.get('receiveNo')?.value;
      const res = await this.receiptService.getCourtReceiveOrder(_receiveNo);
      this.receiptService.receiveOrdersKcorp = res;
      this.receiptService.receiveStatus = res.receiveStatus;
    }
  }
  async onSave() {
    if (
      this.taskCode === 'RECEIVE_NORMAL_PAYMENT' ||
      this.mode === MODE.ADD ||
      (this.taskCode === 'RECEIVE_CREDIT_NOTE_PAYMENT' && this.receiptService.receiveType !== 'SUSPENSE_COURT')
    ) {
      let receiveNo = this.receiveOrdersData?.receiveNo || this.refundInfoForm.get('receiveNo')?.value;
      let req = await this.receiptService.getReceiveOrderRequest('DRAFT', this.refundInfoForm);
      let res = await this.receiptService.saveReceiveOrder(req, this.taskId);
      if (this.mode === MODE.ADD) {
        receiveNo = res.receiveNo;
        this.taskId = res.taskId || 0;
        this.refundInfoForm.get('receiveNo')?.setValue(receiveNo);
      }
      this.notificationService.openSnackbarSuccess(`เลขที่หนังสือ ${receiveNo} บันทึกร่างสำเร็จแล้ว`);
      this.refundInfoForm.markAsPristine();
      this.refundInfoForm.updateValueAndValidity();
    } else if (
      this.taskCode === 'RECEIVE_COURT_PAYMENT' ||
      this.kcorpView == 'REFUND_ADD' ||
      this.kcorpView == 'REFUND_INFO'
    ) {
      let aFormArray = this.refundInfoFormKcorp.get('transferOrders') as UntypedFormArray;
      for (let c of aFormArray.controls) {
        let bFormArray = c.get('receiveTransactions') as UntypedFormArray;
        for (let b of bFormArray.controls) {
          if (b.get('receiveTypeCode')?.value === 'R00') {
            b.get('receiveTypeCode')?.setValue(null);
            b.get('receiveTypeName')?.setValue(null);
          }
        }
      }
      let reqCourt = this.receiptService.getCourtReceiveOrderRequest('DRAFT', this.refundInfoFormKcorp);
      let receiveNoCourt = this.courtReceiveOrder?.receiveNo || this.refundInfoFormKcorp.get('receiveNo')?.value;

      if (this.kcorpView == 'REFUND_ADD') this.taskId = 0;
      let resCourt = await this.receiptService.saveCourtReceiveOrder(this.taskId, reqCourt);

      if (this.kcorpView == 'REFUND_ADD') {
        receiveNoCourt = resCourt.receiveNo;
        this.taskId = resCourt.taskId || 0;
        this.refundInfoFormKcorp.get('receiveNo')?.setValue(receiveNoCourt);
      }
      this.notificationService.openSnackbarSuccess(`เลขที่หนังสือ ${receiveNoCourt} บันทึกร่างสำเร็จแล้ว`);
      this.refundInfoFormKcorp.markAsPristine();
      this.refundInfoFormKcorp.updateValueAndValidity();
    }
    await this.fetchData();
  }

  onCancel() {
    this.onBack();
  }

  async onBack() {
    if (
      this.mode === TMode.ADD ||
      this.taskCode === 'RECEIVE_NORMAL_PAYMENT' ||
      (this.taskCode === 'RECEIVE_CREDIT_NOTE_PAYMENT' && this.receiptService.receiveType !== 'SUSPENSE_COURT')
    ) {
      if (!this.refundInfoForm?.dirty) {
        this.receiptService.clearData();
        this.routerService.back();
      } else {
        const _confirm = await this.sessionService.confirmExitWithoutSave();
        if (_confirm) {
          this.receiptService.clearData();
          this.routerService.back();
        }
      }
    } else {
      if (!this.refundInfoFormKcorp?.dirty) {
        this.receiptService.clearData();
        this.routerService.back();
      } else {
        const _confirm = await this.sessionService.confirmExitWithoutSave();
        if (_confirm) {
          this.receiptService.clearData();
          this.routerService.back();
        }
      }
    }
  }
}
