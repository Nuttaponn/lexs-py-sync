import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { SuitConfirmBeforeDialogConfirmUploadComponent } from '@app/modules/lawsuit/lawsuit-detail/suit/suit-confirm-before-dialog-confirm-upload/suit-confirm-before-dialog-confirm-upload.component';
import { SuitConfirmDialogUploadComponent } from '@app/modules/lawsuit/lawsuit-detail/suit/suit-confirm-dialog-upload/suit-confirm-dialog-upload.component';
import { SuitDialogUploadComponent } from '@app/modules/lawsuit/lawsuit-detail/suit/suit-dialog-upload/suit-dialog-upload.component';
import { IExtendConfirmationFormDto } from '@app/modules/lawsuit/lawsuit-detail/suit/suit.model';
import { SuitService } from '@app/modules/lawsuit/lawsuit-detail/suit/suit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { eFiling3_COJ } from '@app/shared/constant';
import { COURT_FEE_STATUS } from '@app/shared/constant/litigation.constant';
import { taskCode } from '@app/shared/models';
import { SessionService } from '@app/shared/services/session.service';
import { LitigationCaseDto, PayCourtFeeResponse, PaymentConfirmRequest, TaskDetailDto } from '@lexs/lexs-client';
import { LawsuitService } from '@modules/lawsuit/lawsuit.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@shared/services/notification.service';
import { RouterService } from '@shared/services/router.service';
import { DialogOptions } from '@spig/core';

interface UploadCourtFeesReceiptDialogRes {
  blackCaseNo: string;
  redCaseNo: string;
  courtFee: string;
  shippingFee: string;
  docPrepFee: string;
  accuser: string;
  imageId: Array<UploadCourtFeesReceiptDocImg>;
}
interface UploadCourtFeesReceiptDocImg {
  documentTemplate: {
    documentName: string;
  };
  imageId: string;
}

@Component({
  selector: 'app-suit-efiling-civil',
  templateUrl: './suit-efiling-civil.component.html',
  styleUrls: ['./suit-efiling-civil.component.scss'],
})
export class SuitEfilingCivilComponent implements OnInit {
  @ViewChild('aEFilling') aEFilling!: ElementRef;
  static buttonActionEnum = LitigationCaseDto.ButtonActionEnum;
  get buttonActionEnum() {
    return SuitEfilingCivilComponent.buttonActionEnum;
  }

  private approverId: string = '';
  private taskId!: number | undefined;
  private litigationId!: string;
  private tempDialogConfirmData!: IExtendConfirmationFormDto | null;

  public isViewMode: boolean = false;
  public taskDetail: TaskDetailDto = {};
  public isShowButtonColumn: boolean = false;
  public isOpenedList: boolean[] = [];
  public doc2Column = ['documentName'];
  public COURT_FEE_STATUS = COURT_FEE_STATUS;
  public viewDisplayedColumns: string[] = [
    'no',
    'referenceNo',
    'caseDate',
    'blackCaseNo',
    'capitalAmount',
    'court',
    'sla',
    'paymentAuditingStatus',
  ];
  public displayedColumns: string[] = [...this.viewDisplayedColumns, 'button'];
  public isExistedConfirmImageId: boolean = false;
  public uploadCourtFeeReceipt: boolean = false;
  public disableBtnForm = this.fb.group({ isDisableBtn: ['NO', Validators.required] });
  public taskCodeFromTask!: taskCode | null;

  @Input() civilCases!: LitigationCaseDto[];
  @Input() groupIndex!: number;
  @Output() checkBannerUploadCourtFeesReceipt = new EventEmitter<void>();
  @Output() refreshTaskDetailWithoutRefresh = new EventEmitter<string>();
  @Output() triggerSetNewCaseGroups = new EventEmitter();

  constructor(
    private lawsuitService: LawsuitService,
    private taskService: TaskService,
    private routerService: RouterService,
    private suitService: SuitService,
    private sessionService: SessionService,
    private notificationService: NotificationService,
    public fb: UntypedFormBuilder,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    this.taskCodeFromTask = this.suitService.taskCodeFromTask;
    this.taskDetail = this.taskService?.taskDetail;
    this.approverId = this.taskDetail?.approverId ?? '';
    const _owner = this.taskService?.taskOwner;

    // viewMode is true when not owner task AND task not approved yet.
    this.isViewMode =
      this.sessionService.isOwnerTask(_owner, this.taskService.taskDetail.enableTaskSupportRole) && !this.approverId
        ? false
        : true;

    this.taskId = this.taskDetail?.id || undefined;
    this.litigationId = this.lawsuitService.currentLitigation?.litigationId || '';

    await this.setupPageData();

    this.uploadCourtFeeReceipt = !!this.suitService.payCourtFeeReceiptRequest;
    this.isExistedConfirmImageId = !!this.suitService.paymentConfirmRequest;
  }

  navigateToIndictment(element: any) {
    this.routerService.navigateTo('/main/task/detail/suit-indictment', {
      caseId: element.id,
      caseGroupNo: element.caseGroupNo,
      litigationId: this.litigationId,
      taskId: this.taskId,
    });
  }

  onClickId(litigationCaseDto: LitigationCaseDto) {
    if (this.routerService.previousUrl.includes('/main/lawsuit/detail')) {
      this.routerService.navigateTo('/main/lawsuit/detail/suit-indictment', {
        caseId: litigationCaseDto.id,
        litigationId: this.litigationId,
        forceViewMode: true,
      });
    } else {
      this.routerService.navigateTo('/main/task/detail/suit-indictment', {
        caseId: litigationCaseDto.id,
        litigationId: this.litigationId,
        forceViewMode: true,
      });
    }
  }

  openNewTabEFillWebsite() {
    window.open(eFiling3_COJ, '_blank');
  }

  private setUpdateDataForTaskDetail(
    dialogRes: IExtendConfirmationFormDto,
    buttonAction: LitigationCaseDto.ButtonActionEnum
  ) {
    switch (buttonAction) {
      case LitigationCaseDto.ButtonActionEnum.PayCourtFee:
        break;
      case LitigationCaseDto.ButtonActionEnum.ConfirmCourtFee:
        dialogRes = dialogRes as IExtendConfirmationFormDto;
        this.suitService.paymentConfirmRequest = {
          blackCaseNo: dialogRes.blackCaseNo,
          commentToAccounting: dialogRes.remark,
          confirmImageId: dialogRes.confirmImageId,
          confirmRefNo: dialogRes.confirmRefNo,
          courtFeeOriginal: dialogRes.courtFee,
          deliveryFeeForPleadingsOriginal: Number(dialogRes.deliveryFeeForPleadings),
          documentPreparationFeeOriginal: Number(dialogRes.documentPreparationFee),
          notification: !!dialogRes?.notification?.code ? dialogRes.notification : undefined,
          headerFlag: 'DRAFT', // ไปเซ็ตค่าจริงที่ task-detail
        };
        break;
      default:
        console.log('default case -- setUpdateDataForTaskDetail');
        break;
    }
  }

  setDraftDataLitigationCaseService(
    dialogRes: UploadCourtFeesReceiptDialogRes | IExtendConfirmationFormDto,
    groupIndex: number,
    caseIndex: number,
    buttonAction: LitigationCaseDto.ButtonActionEnum
  ) {
    switch (buttonAction) {
      case LitigationCaseDto.ButtonActionEnum.ConfirmCourtFee:
        dialogRes = dialogRes as IExtendConfirmationFormDto;
        let tempCases0 = this.suitService.litigationCase[groupIndex]?.cases ?? [];

        if (tempCases0.length === 0) return;
        tempCases0[caseIndex] = {
          ...tempCases0[caseIndex],
          confirmImageId: dialogRes.confirmImageId,
        };

        let tempLitigationCase0 = this.suitService.litigationCase;
        if (tempLitigationCase0.length === 0) return;
        tempLitigationCase0[groupIndex].cases = tempCases0;

        this.suitService.litigationCase = tempLitigationCase0;
        break;
      default:
        console.log('default case -- setDraftDataLitigationCaseService');
        break;
    }
  }

  async callUploadDoc(groupIndex: number, litigationCaseDto: LitigationCaseDto, caseIndex: number) {
    if (!litigationCaseDto) return;

    let isFinishedPayCourtFee = false;
    let isSuccess: boolean = false; // isSubmit dialog
    switch (litigationCaseDto.buttonAction) {
      case this.buttonActionEnum.PayCourtFee:
        const rowData = { ...litigationCaseDto, taskId: this.taskId };
        this.notificationService.dialogSetting = { canDismiss: false };

        const buttonSubmitDialog = !rowData?.financialId
          ? 'LAWSUIT.SUIT.BTN_CONFIRM_PAYMENT'
          : 'COMMON.BUTTON_CONTINUE';
        const dialogSetting: DialogOptions = {
          component: SuitDialogUploadComponent,
          title: 'LAWSUIT.SUIT.TITLE_PAY_FEE_COURT',
          iconName: 'icon-Check',
          rightButtonLabel: buttonSubmitDialog,
          buttonIconName: 'icon-Checkmark-Circle-Regular',
          leftButtonLabel: 'COMMON.BUTTON_CANCEL',
          context: rowData,
          contentCssClasses: ['no-padding'],
          autoFocus: false,
        };
        const dialogRes0: PayCourtFeeResponse | boolean =
          await this.notificationService.showCustomDialog(dialogSetting);
        if (!dialogRes0 || typeof dialogRes0 === 'boolean') return;
        if (!dialogRes0.taskId) {
          await this.setupPageData(true);
          return;
        }
        isSuccess = true;
        isFinishedPayCourtFee = true;

        this.refreshTaskDetailWithoutRefresh.emit((dialogRes0.taskId ?? '').toString());
        this.taskId = dialogRes0.taskId; /* set new-taskId */
        break;
      case this.buttonActionEnum.UploadCourtFeesReceipt:
        await this.uploadCourtFeesReceipt(litigationCaseDto);
        return;
      case this.buttonActionEnum.ConfirmCourtFee:
      default: // Default -> handle LEX2-7505
        const isTryConfirmCondition = this.taskCodeFromTask === 'TRY_CONFIRM_COURT_FEES_PAYMENT';
        const rowData1 = {
          ...litigationCaseDto,
          taskId: this.taskId,
          uploaded: this.tempDialogConfirmData,
          formControl: this.disableBtnForm,
          taskCodeFromTask: this.taskCodeFromTask,
        };
        const dialogSuitConfirm: DialogOptions = {
          component: SuitConfirmDialogUploadComponent,
          title: 'TASK_CODE_BUTTON.PENDING_CONFIRM_COURT_FEES_PAYMENT',
          iconName: 'icon-Check',
          rightButtonLabel: isTryConfirmCondition
            ? 'TASK_CODE_BUTTON.PENDING_TRY_CONFIRM_COURT_FEES_PAYMENT'
            : 'LAWSUIT.SUIT.BTN_UPLOAD_CF_PAYMENT_RECEIPT',
          buttonIconName: 'icon-Checkmark-Circle-Regular',
          leftButtonLabel: 'COMMON.BUTTON_CANCEL',
          context: rowData1,
          contentCssClasses: ['no-padding'],
          autoFocus: false,
        };
        const dialogRes1: IExtendConfirmationFormDto =
          await this.notificationService.showCustomDialog(dialogSuitConfirm);

        if (!dialogRes1 || typeof dialogRes1 === 'boolean') return;
        isSuccess = true;

        this.tempDialogConfirmData = dialogRes1;

        if (isTryConfirmCondition) {
          try {
            const tryReq: PaymentConfirmRequest | null = this.getPaymentConfirmRequest();
            if (!tryReq) return;
            await this.suitService.confirmPaymentManual(this.taskId || -1, tryReq);

            this.notificationService.openSnackbarSuccess(`
              ${this.translate.instant('COMMON.LABEL_LITIGATION_ID')}: ${this.litigationId} ${this.translate.instant(
                'LAWSUIT.SUIT.MANUAL_TRY_SUFFIX_SUCCESS'
              )}`);
            this.back();
            return;
          } catch (error) {
            return;
          }
        }

        this.setUpdateDataForTaskDetail(
          dialogRes1,
          litigationCaseDto.buttonAction || this.buttonActionEnum.ConfirmCourtFee
        );
        this.setDraftDataLitigationCaseService(
          dialogRes1,
          groupIndex,
          caseIndex,
          litigationCaseDto.buttonAction || this.buttonActionEnum.ConfirmCourtFee
        );

        this.isExistedConfirmImageId = true;
        this.checkBannerUploadCourtFeesReceipt.emit();
        break;
    }

    if (!isSuccess) return;
    if (!isFinishedPayCourtFee) this.suitService.hasEdit = true;

    await this.setupPageData(
      litigationCaseDto.buttonAction === this.buttonActionEnum.PayCourtFee
    ); /* refresh suit Data */

    if (litigationCaseDto.buttonAction !== this.buttonActionEnum.PayCourtFee) return;

    const countinueDialogData = { taskId: this.taskId }; /* taskId ใหม่ที่ถูกเปลี่ยนจากก่อนหน้า */
    const dialogSetting: DialogOptions = {
      component: SuitConfirmBeforeDialogConfirmUploadComponent,
      title: 'LAWSUIT.SUIT.TITLE_PAY_FEE_COURT_SUCCESS',
      iconName: 'icon-Product-Selected',
      rightButtonLabel: 'LAWSUIT.SUIT.BTN_UPLOAD_CONFIRMED_DOC_2',
      buttonIconName: 'icon-Arrow-Upload',
      context: countinueDialogData,
      backButtonLabel: 'COMMON.BUTTON_LATER',
      contentCssClasses: ['no-padding'],
      iconClass: 'icon-medium fill-krungthai-green',
      optionBtnLabel: 'LAWSUIT.SUIT.BTN_NVG_E_FILLING',
      optionBtnIcon: 'icon-Expand',
      optionBtnClass: 'option-btn-blue',
      autoFocus: false,
    };
    const isContinue = await this.notificationService.showCustomDialog(dialogSetting);
    if (isContinue?.isOption === true) {
      this.openNewTabEFillWebsite();
    }
    if (isContinue?.isBack === true) return;

    const tempCases = this.suitService.litigationCase[groupIndex]?.cases ?? [];
    if (tempCases.length === 0) return;
    await this.callUploadDoc(groupIndex, tempCases[caseIndex], caseIndex);
  }

  // LEX2-7505: get RequestDto to finish task.
  private getPaymentConfirmRequest(): PaymentConfirmRequest | null {
    if (!this.tempDialogConfirmData) return null;
    return {
      blackCaseNo: this.tempDialogConfirmData.blackCaseNo,
      commentToAccounting: this.tempDialogConfirmData.remark,
      confirmImageId: this.tempDialogConfirmData.confirmImageId,
      confirmRefNo: this.tempDialogConfirmData.confirmRefNo,
      courtFeeOriginal: this.tempDialogConfirmData.courtFee,
      deliveryFeeForPleadingsOriginal: this.tempDialogConfirmData.deliveryFeeForPleadings,
      documentPreparationFeeOriginal: this.tempDialogConfirmData.documentPreparationFee,
      headerFlag: PaymentConfirmRequest.HeaderFlagEnum.Submit,
      notification: this.tempDialogConfirmData.notification,
    };
  }

  async setupPageData(isRefreshLgCase: boolean = false) {
    if (isRefreshLgCase) {
      this.suitService.litigationCase =
        (await this.suitService.getLitigationCase(this.litigationId, Number(this.taskId))) ?? [];
      this.triggerSetNewCaseGroups.emit();
    }
    // this.groupByLitigationCaseList();
    this.isShowButtonColumn = !!this.civilCases.find(ele => !!ele.actionFlag) && !this.isViewMode;
  }

  async uploadCourtFeesReceipt(
    litigationCaseDto: LitigationCaseDto
  ): Promise<UploadCourtFeesReceiptDialogRes | boolean> {
    // ########################### LEX2-3276 ################################
    this.suitService.litigationCaseDetail = {
      ...litigationCaseDto,
    };

    this.navigateToReceiptForm();
    return false;
  }

  navigateToReceiptForm() {
    this.routerService.navigateTo('/main/task/detail/court-fee-form');
  }

  back() {
    this.routerService.back();
  }
}
