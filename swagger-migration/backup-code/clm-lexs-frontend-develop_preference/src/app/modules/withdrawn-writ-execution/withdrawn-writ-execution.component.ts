import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RejectDialogComponent } from '@app/shared/components/common-dialogs/reject-dialog/reject-dialog.component';
import { ActionBar, TMode, statusCode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  LitigationCaseShortDto,
  PostApprovalRequest,
  PostCommandAcceptionSubmitRequest,
  PostSubmitRequest,
  WithdrawWritOfExecResponse,
  WritOfExecDocValidationRequest,
  WritOfExecResultSubmitRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DialogOptions } from '@spig/core';
import { TaskService } from '../task/services/task.service';
import { WithdrawnWritExecutionService } from './withdrawn-writ-execution.service';

interface ActionBarMeta extends ActionBar {
  hasEdit?: boolean;
  editButtonIcon?: string;
  editButtonText?: string;
}

@Component({
  selector: 'app-withdrawn-writ-execution',
  templateUrl: './withdrawn-writ-execution.component.html',
  styleUrls: ['./withdrawn-writ-execution.component.scss'],
})
export class WithdrawnWritExecutionComponent implements OnInit {
  public taskCode: taskCode | string = '';
  public statusCode: statusCode | string = '';
  public isFromTask: boolean = false;

  private taskId: number = 0;
  private litigationId: string = '0';
  private litigationCaseId: string = '0';
  private withdrawWritOfExecId: number = 0;
  private withdrawSeizuresLedId: number = 0;

  public litigationCaseShortDetail!: LitigationCaseShortDto;
  public withdrawWritOfExecResponse!: WithdrawWritOfExecResponse;
  public responsibleLawyerData!: LitigationCaseShortDto;
  public actionBar: ActionBarMeta = {
    hasCancel: false,
    hasReject: false,
    hasPrimary: false,
    hasSave: false,
  };

  public dataLawyerForm!: UntypedFormGroup;
  public withdrawExcutionResultComponentForm!: UntypedFormGroup;
  public withdrawExcutionDetailComponentForm!: UntypedFormGroup;

  public isOnRequest: boolean = false;
  public mode: TMode = 'VIEW';
  public iconName = '';
  public title = '';
  public titleStatus!: string;
  public messageBanner = '';

  public excutionDetailMode: TMode = 'VIEW';
  public excutionResultMode: TMode = 'VIEW';
  public responsibleLawyerMode: TMode = 'VIEW';

  get showWithdrawExcutionResult(): boolean {
    const taskCode = ['R2E06-15-E'].includes(this.taskCode);
    const withdrawWritOfExecDatetime = this.withdrawWritOfExecResponse?.withdrawWritOfExecDatetime ? true : false;
    const statusShowComponent = this.withdrawWritOfExecResponse?.status === 'R2E06-15-E_CREATE';
    return (
      taskCode || (!this.routerService.navigateFormTaskMenu && (withdrawWritOfExecDatetime || statusShowComponent))
    );
  }

  get showWithdrawWxcutionDetail(): boolean {
    const taskCode = ['R2E06-15-E', 'R2E06-11-A', 'R2E06-12-B', 'R2E06-13-C', 'R2E06-14-D'].includes(this.taskCode);
    return taskCode || this.isOnRequest || !this.routerService.navigateFormTaskMenu;
  }

  get showResponsibleLawyer() {
    if (this.mode === 'EDIT' || (this.mode === 'VIEW' && this.routerService.navigateFormTaskMenu)) {
      return this.taskCode === 'R2E06-13-C' || this.taskCode === 'R2E06-14-D' || this.taskCode === 'R2E06-15-E';
    } else if (this.mode === 'VIEW') {
      const { publicAuctionLawyerId } = this.withdrawWritOfExecResponse;
      return publicAuctionLawyerId ? true : false;
    } else {
      return false;
    }
  }

  get isOwnerTask(): boolean {
    const _owner = this.taskService.taskOwner;
    if (_owner && this.sessionService.isOwnerTask(_owner, this.taskService.taskDetail.enableTaskSupportRole)) {
      return true;
    } else {
      return false;
    }
  }

  constructor(
    private routerService: RouterService,
    private logger: LoggerService,
    private taskService: TaskService,
    private litigationCaseService: LitigationCaseService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private withdrawnWritExecutionService: WithdrawnWritExecutionService,
    private sessionService: SessionService,
    private route: ActivatedRoute
  ) {
    this.isOnRequest = this.route?.snapshot?.queryParams['isOnRequest'] || false;
    this.litigationCaseId = this.route?.snapshot?.queryParams['litigationCaseId'];
    this.litigationId = this.route?.snapshot?.queryParams['litigationId'];
    this.isFromTask = this.routerService.navigateFormTaskMenu;
  }

  ngOnInit(): void {
    if (this.isFromTask) {
      this.taskCode = this.taskService?.taskDetail?.taskCode || '';
      this.statusCode = this.taskService.taskDetail.statusCode || '';
      this.litigationCaseId = this.taskService.taskDetail.litigationCaseId || '0';
      this.taskId = this.taskService.taskDetail.id || 0;
      this.litigationId = this.taskService.taskDetail.litigationId || '';
      this.withdrawSeizuresLedId =
        JSON.parse(this.taskService.taskDetail.attributes || '{}')?.withdrawSeizureLedId || 0;
    }

    // initial action bar
    this.initActionBar();
    this.iconName = this.getIconNameActionBar();
    this.title = this.getTitleActionBar();
    this.titleStatus = this.getTitleStatus();

    // initial message banner
    this.messageBanner = this.getMessageBanner();

    // initial mode
    this.initModeComponent();

    this.dataLawyerForm = this.withdrawnWritExecutionService.lawyerForm;
    this.withdrawExcutionResultComponentForm = this.withdrawnWritExecutionService.withdrawExcutionResultComponentForm;
    this.withdrawExcutionDetailComponentForm = this.withdrawnWritExecutionService.withdrawExcutionDetailComponentForm;

    this.litigationCaseShortDetail = this.litigationCaseService.litigationCaseShortDetail;
    this.withdrawWritOfExecResponse = this.withdrawnWritExecutionService.withdrawWritOfExecResponse;
    this.withdrawWritOfExecId = this.withdrawWritOfExecResponse?.withdrawWritOfExecId || 0;

    this.transformResponsibleLawyer();
    this.initDataLawyerFormValidators();
  }

  initActionBar() {
    this.logger.info('initActionBar WithdrawnSeizurePropertyComponent ', this.taskCode);
    if (this.isOwnerTask || this.isOnRequest) {
      if (
        (this.taskCode === taskCode.R2E06_11_A &&
          (this.statusCode === 'PENDING' || this.statusCode === 'CORRECT_PENDING')) ||
        this.isOnRequest
      ) {
        this.actionBar = {
          hasCancel: true,
          hasSave: true,
          hasPrimary: true,
          hasReject: false,
          cancelText: 'COMMON.BUTTON_REJECT_ORDER',
          saveText: 'COMMON.BUTTON_SAVE_DRAFT',
          primaryText: 'COMMON.BUTTON_WITHDRAW_EXECUTION',
          primaryIcon: 'icon-Arrow-Revert',
        };
      } else if (this.taskCode === taskCode.R2E06_12_B) {
        this.actionBar = {
          hasEdit: true,
          editButtonText: 'COMMON.BUTTON_REJECT_FOR_EDIT',
          hasCancel: false,
          hasReject: true,
          rejectText: 'COMMON.LABEL_NOT_APPROVE',
          hasPrimary: true,
          primaryText: 'COMMON.LABEL_APPROVE',
          hasSave: false,
          primaryIcon: 'icon-Selected',
          rejectIcon: 'icon-Dismiss-Square',
        };
      } else if ([taskCode.R2E06_13_C, taskCode.R2E06_14_D].includes(this.taskCode as taskCode)) {
        this.actionBar = {
          hasCancel: false,
          hasReject: false,
          hasPrimary: true,
          hasSave: false,
          primaryIcon: 'icon-Selected',
        };
      } else if (this.taskCode === taskCode.R2E06_15_E) {
        this.actionBar = {
          hasCancel: false,
          hasReject: false,
          hasPrimary: true,
          hasSave: true,
          primaryIcon: 'icon-Selected',
        };
      } else {
        // For taskCode.R2E06_10 and else
        this.actionBar = {
          hasCancel: false,
          hasReject: false,
          hasPrimary: false,
          hasSave: false,
        };
      }
    } // end check owner task
  }

  initModeComponent() {
    if (this.isFromTask && this.isOwnerTask) {
      if (this.taskCode === taskCode.R2E06_11_A) {
        if (this.isOnRequest || this.statusCode === 'PENDING' || this.statusCode === 'CORRECT_PENDING') {
          this.excutionDetailMode = 'EDIT';
        }
      } else if (this.taskCode === taskCode.R2E06_13_C || this.taskCode === taskCode.R2E06_14_D) {
        this.responsibleLawyerMode = 'EDIT';
      } else if (this.taskCode === taskCode.R2E06_15_E) {
        this.excutionResultMode = 'EDIT';
      }
    } else {
      if (!this.taskCode && this.isOnRequest) {
        this.excutionDetailMode = 'EDIT';
        this.excutionResultMode = 'EDIT';
        this.responsibleLawyerMode = 'EDIT';
      }
    }
  }

  initDataLawyerFormValidators(): void {
    if (this.taskCode === taskCode.R2E06_14_D) {
      this.dataLawyerForm.controls['legalExecutionLawyerId'].addValidators(Validators.required);
    }
  }

  getIconNameActionBar() {
    if (this.isOnRequest) {
      return 'icon-Arrow-Revert';
    } else {
      switch (this.taskCode as taskCode) {
        case taskCode.R2E06_11_A:
          return 'icon-Arrow-Revert';
        case taskCode.R2E06_12_B:
        case taskCode.R2E06_13_C:
        case taskCode.R2E06_14_D:
        case taskCode.R2E06_15_E:
          return 'icon-Task-List';
        default:
          return 'icon-License';
      }
    }
  }

  getTitleActionBar() {
    if (this.taskCode === taskCode.R2E06_11_A || this.isOnRequest) {
      if (['PENDING', 'CORRECT_PENDING'].includes(this.statusCode) && this.isOwnerTask) {
        return 'LAWSUIT.WITHDRAW_EXECUTION.TITLE_TEXT.ORDER_EXECUTION';
      } else {
        return 'LAWSUIT.WITHDRAW_EXECUTION.TITLE_TEXT.DETAIL_OF_EXECUTION';
      }
    } else if (this.taskCode === taskCode.R2E06_12_B) {
      return 'LAWSUIT.WITHDRAW_EXECUTION.TITLE_TEXT.APPROVE_THE_EXECUTION';
    } else if (this.taskCode === taskCode.R2E06_13_C) {
      return 'LAWSUIT.WITHDRAW_EXECUTION.TITLE_TEXT.ASSIGN_ATTORNEY_TO_EXECUTE';
    } else if (this.taskCode === taskCode.R2E06_14_D) {
      return 'LAWSUIT.WITHDRAW_EXECUTION.TITLE_TEXT.TAKE_ORDER_OF_EXECUTION';
    } else if (this.taskCode === taskCode.R2E06_15_E) {
      return 'LAWSUIT.WITHDRAW_EXECUTION.TITLE_TEXT.PROCESS_OF_EXECUTION';
    } else {
      return 'LAWSUIT.WITHDRAW_EXECUTION.TITLE_TEXT.DETAIL_OF_EXECUTION';
    }
  }

  getTitleStatus() {
    if (this.isFromTask) {
      if (this.taskCode === 'R2E06-11-A' && this.statusCode === 'CORRECT_PENDING') {
        return 'LAWSUIT.WITHDRAW_EXECUTION.STATUS_TITLE.WAIT_FOR_EDITING_EXECUTION';
      } else if (this.taskCode === 'R2E06-12-B') {
        return 'LAWSUIT.WITHDRAW_EXECUTION.STATUS_TITLE.WAIT_FOR_APPROVING_EXECUTION';
      } else if (this.taskCode === 'R2E06-13-C') {
        return 'LAWSUIT.WITHDRAW_EXECUTION.STATUS_TITLE.WAIT_FOR_ASSIGNING_ATTORNEY_EXECUTION';
      } else if (this.taskCode === 'R2E06-14-D') {
        return 'LAWSUIT.WITHDRAW_EXECUTION.STATUS_TITLE.TAKING_AN_ORDER_AND_ASSIGNING_TO_ATTORNEY_EXECUTION';
      } else if (this.taskCode === 'R2E06-15-E') {
        return 'LAWSUIT.WITHDRAW_EXECUTION.STATUS_TITLE.WAIT_FOR_RECORDING_EXECUTION_RESULT';
      } else {
        return '';
      }
    } else {
      if (!this.isOnRequest && this.withdrawWritOfExecResponse.approval?.reviewResult === 'E') {
        return 'COMMON.LABEL_SEND_BACK_APPROVAL';
      } else {
        return '';
      }
    }
  }

  getMessageBanner() {
    const _infoMsg = 'LAWSUIT.WITHDRAW_EXECUTION.INFO_MSG';
    // Task Code Existed
    if (this.taskCode) {
      if (this.taskCode === taskCode.R2E06_11_A) {
        if (this.statusCode === 'PENDING') {
          return `${_infoMsg}.SELECTED_REASON_TO_WITHDRAW`;
        } else if (this.statusCode === 'CORRECT_PENDING') {
          return (
            this.translate.instant(`${_infoMsg}.CHECK_CONTENT_BEFORE_EXECUTION`, {
              REMARK: this.withdrawWritOfExecResponse?.approval?.rejectReason,
            }) || ''
          );
        }
      } else if (this.taskCode === taskCode.R2E06_12_B) {
        return `${_infoMsg}.CHECK_CONTENT_AND_APPROVE_EXECUTION`;
      } else if (this.taskCode === taskCode.R2E06_13_C) {
        return `${_infoMsg}.CHECK_CONTENT_AND_SUGGEST_LAWYER`;
      } else if (this.taskCode === taskCode.R2E06_14_D) {
        return `${_infoMsg}.CHECK_CONTENT_BEFORE_SEND_TO_LAWYER`;
      } else if (this.taskCode === taskCode.R2E06_15_E) {
        return `${_infoMsg}.SAVE_WITHDRAW_EXECUTION_RESULT`;
      }
    }

    // From Withdraw Execution Pressed Button
    if (this.isOnRequest) {
      return `${_infoMsg}.SELECTED_REASON_TO_WITHDRAW`;
    }
  }

  canDeactivate() {
    return true;
  }

  async onBack() {
    if (
      !this.dataLawyerForm?.dirty &&
      !this.withdrawExcutionResultComponentForm?.dirty &&
      !this.withdrawExcutionDetailComponentForm?.dirty
    ) {
      this.routerService.back();
    } else {
      const _confirm = await this.sessionService.confirmExitWithoutSave();
      if (_confirm) {
        this.withdrawnWritExecutionService.withdrawWritOfExecByLitigationResponse = {};
        this.routerService.back();
      }
    }
  }

  async onSubmit() {
    this.logger.info('onSubmit :: ', this.taskCode);
    if (this.taskCode === taskCode.R2E06_11_A || this.isOnRequest) {
      if (this.withdrawExcutionDetailComponentForm.valid) {
        const confirmDialog = await this.notificationService.warningDialog(
          'LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.CONFIRM_EXECUTION_TITLE',
          'LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.CONFIRM_EXECUTION_MESSAGE',
          'LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.CONFIRM_EXECUTION_TITLE',
          'icon-Arrow-Revert'
        );

        if (confirmDialog) {
          const request: PostSubmitRequest = {
            ...this.withdrawExcutionDetailComponentForm.getRawValue(),
            headerFlag: WritOfExecResultSubmitRequest.HeaderFlagEnum.Submit,
            litigationCaseId: Number(this.litigationCaseId),
            litigationId: this.litigationId,
            withdrawWritOfExecId: this.withdrawWritOfExecId ? this.withdrawWritOfExecId : undefined,
          };
          await this.withdrawnWritExecutionService.postWithdrawWritOfExecCaseSubmit(
            Number(this.litigationCaseId),
            this.taskId,
            request
          );

          this.notificationService.openSnackbarSuccess(
            this.translate.instant('LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.SUCCESS_EXECUTION', {
              LG_ID: this.litigationId,
            })
          );
          this.routerService.back();
        }
      } else {
        this.withdrawExcutionDetailComponentForm.markAllAsTouched();
        this.withdrawExcutionDetailComponentForm.updateValueAndValidity();
      }
    } else if (this.taskCode === taskCode.R2E06_12_B) {
      const request: PostApprovalRequest = {
        action: PostApprovalRequest.ActionEnum.Approve,
        litigationCaseId: Number(this.litigationCaseId) || 0,
        litigationId: this.litigationId,
      };
      await this.withdrawnWritExecutionService.postWithdrawWritOfExecApproval(
        this.taskId,
        this.withdrawWritOfExecId,
        request
      );
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.APPROVE_EXECUTION', {
          LG_ID: this.litigationId,
        })
      );
      this.routerService.back();
    } else if (this.taskCode === taskCode.R2E06_13_C) {
      const request: WritOfExecDocValidationRequest = {
        publicAuctionLawyerId: this.dataLawyerForm.get('legalExecutionLawyerId')?.value,
      };
      await this.withdrawnWritExecutionService.postWithdrawWritOfExecDocValidationSubmit(
        this.taskId,
        this.withdrawWritOfExecId,
        request
      );
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.ASSIGN_ATTORNEY_TO_EXECUTE', {
          LG_ID: this.litigationId,
        })
      );
      this.routerService.back();
    } else if (this.taskCode === taskCode.R2E06_14_D) {
      if (this.dataLawyerForm.valid) {
        const request: PostCommandAcceptionSubmitRequest = {
          publicAuctionLawyerId: this.dataLawyerForm.get('legalExecutionLawyerId')?.value,
          withdrawSeizureLedId: this.withdrawSeizuresLedId,
        };
        await this.withdrawnWritExecutionService.postWithdrawWritOfExecCommandAcceptionSubmit(
          this.taskId,
          this.withdrawWritOfExecId,
          request
        );
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.ASSIGN_ATTORNEY_TO_EXECUTE', {
            LG_ID: this.litigationId,
          })
        );
        this.routerService.back();
      } else {
        this.dataLawyerForm.markAllAsTouched();
        this.dataLawyerForm.updateValueAndValidity();
      }
    } else if (this.taskCode === taskCode.R2E06_15_E) {
      if (this.withdrawExcutionResultComponentForm.valid) {
        const objForm = this.withdrawExcutionResultComponentForm.getRawValue();
        const request: WritOfExecResultSubmitRequest = {
          headerFlag: WritOfExecResultSubmitRequest.HeaderFlagEnum.Submit,
          litigationCaseId: Number(this.litigationCaseId),
          ...objForm,
          withdrawWritOfExecDocument: { uploadSessionId: objForm.uploadSessionId },
          litigationId: this.litigationId,
          withdrawWritOfExecId: this.withdrawWritOfExecId || undefined,
        };
        await this.withdrawnWritExecutionService.postWithdrawWritOfExecResultSubmit(
          this.taskId,
          this.withdrawWritOfExecId,
          request
        );
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.SAVE_RESULT_EXECUTION', {
            LG_ID: this.litigationId,
          })
        );
        this.routerService.back();
      } else {
        this.withdrawExcutionResultComponentForm.markAllAsTouched();
        this.withdrawExcutionResultComponentForm.updateValueAndValidity();
      }
    }
  }

  async onSave() {
    this.logger.info('onSave :: ', this.taskCode);
    if (this.taskCode === taskCode.R2E06_11_A || this.isOnRequest) {
      if (this.withdrawExcutionDetailComponentForm.valid) {
        const confirmDialog = await this.notificationService.warningDialog(
          'LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.CONFIRM_SAVE_EXECUTION',
          'LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.CONFIRM_SAVE_DRAFT_MESSAGE',
          'LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.SAVE_DRAFT_LABEL',
          'icon-save-primary'
        );
        if (confirmDialog) {
          const request: PostSubmitRequest = {
            ...this.withdrawExcutionDetailComponentForm.getRawValue(),
            headerFlag: WritOfExecResultSubmitRequest.HeaderFlagEnum.Draft,
            litigationCaseId: Number(this.litigationCaseId),
            litigationId: this.litigationId,
            withdrawWritOfExecId: this.withdrawWritOfExecId ? this.withdrawWritOfExecId : undefined,
          };
          await this.withdrawnWritExecutionService.postWithdrawWritOfExecCaseSubmit(
            Number(this.litigationCaseId),
            this.taskId,
            request
          );

          this.notificationService.openSnackbarSuccess(
            this.translate.instant('LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.SAVE_DRAFT_OF_EXECUTION', {
              LG_ID: this.litigationId,
            })
          );
          this.withdrawExcutionDetailComponentForm.markAsPristine();
        }
      } else {
        this.withdrawExcutionDetailComponentForm.markAllAsTouched();
        this.withdrawExcutionDetailComponentForm.updateValueAndValidity();
      }
    } else if (this.taskCode === taskCode.R2E06_15_E) {
      const confirm = await this.notificationService.warningDialog(
        'LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.CONFIRM_SAVE_EXECUTION',
        'LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.CONFIRM_SAVE_DRAFT_MESSAGE',
        'COMMON.BUTTON_SAVE',
        'icon-save-primary'
      );
      if (confirm) {
        const objForm = this.withdrawExcutionResultComponentForm.getRawValue();
        const request: WritOfExecResultSubmitRequest = {
          headerFlag: WritOfExecResultSubmitRequest.HeaderFlagEnum.Draft,
          litigationCaseId: Number(this.litigationCaseId),
          ...objForm,
          withdrawWritOfExecDocument: { uploadSessionId: objForm.uploadSessionId },
          litigationId: this.litigationId,
          withdrawWritOfExecId: this.withdrawWritOfExecId || undefined,
        };

        await this.withdrawnWritExecutionService.postWithdrawWritOfExecResultSubmit(
          this.taskId,
          this.withdrawWritOfExecId,
          request
        );

        this.notificationService.openSnackbarSuccess(
          this.translate.instant('LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.SAVE_DRAFT_OF_EXECUTION', {
            LG_ID: this.litigationId,
          })
        );
      }
    }
  }

  async onCancel() {
    this.logger.info('WithdrawnSeizurePropertyComponent :: onCancel ', this.taskCode);
    if (this.taskCode === taskCode.R2E06_11_A || this.isOnRequest) {
      const optionsDialog: DialogOptions = {
        rightButtonLabel: 'LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.BUTTON_CONFIRM_ABORT_EXECUTION',
        buttonIconName: 'icon-Dismiss-Square',
      };
      const _dialog = await this.notificationService.confirmRemoveLeftAlignedDialog(
        'LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.CONFIRM_ABORT_EXECUTION',
        'LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.CONFIRM_ABORT_EXECUTION_MESSAGE',
        optionsDialog
      );

      if (_dialog) {
        await this.withdrawnWritExecutionService.postWithdrawWritOfExecCancel(this.withdrawWritOfExecId);
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.CANCEL_EXECUTION_SUCCESSFUL')
        );
        this.routerService.back();
      }
    }
  }

  async onReject() {
    this.logger.info('WithdrawnSeizurePropertyComponent :: onReject ', this.taskCode);
    if (this.taskCode === taskCode.R2E06_12_B) {
      const context = {
        mode: 'WITHDRAWN_WRIT_EXECUTION',
        action: 'REJECT',
        litigationCaseId: Number(this.litigationCaseId) || 0,
        litigationId: this.litigationId,
        withdrawWritOfExecId: this.withdrawWritOfExecId,
        taskId: this.taskId,
      };
      const response = await this.notificationService.showCustomDialog({
        component: RejectDialogComponent,
        iconName: 'icon-Dismiss-Square',
        title: 'COMMON.BUTTON_NOT_APPROVE',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        rightButtonLabel: 'COMMON.BUTTON_CONFIRM_NOT_APPROVE',
        buttonIconName: 'icon-Dismiss-Square',
        rightButtonClass: 'long-button mat-warn',
        context: context,
      });
      if (!!response) {
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.ABORTED_APPROVE_EXECUTION', {
            LG_ID: this.litigationId,
          })
        );
        this.routerService.back();
      }
    }
  }

  async onEdit() {
    this.logger.info('WithdrawnSeizurePropertyComponent :: onEdit ', this.taskCode);
    if (this.taskCode === taskCode.R2E06_12_B) {
      const context = {
        mode: 'WITHDRAWN_WRIT_EXECUTION',
        action: 'RETURN',
        litigationCaseId: Number(this.litigationCaseId) || 0,
        litigationId: this.litigationId,
        withdrawWritOfExecId: this.withdrawWritOfExecId,
        taskId: this.taskId,
      };
      const response = await this.notificationService.showCustomDialog({
        component: RejectDialogComponent,
        iconName: 'icon-Arrow-Revert',
        title: 'COMMON.BUTTON_SEND_BACK_EDIT',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        rightButtonLabel: 'COMMON.CONFIRM_SEND_BACK_EDIT',
        buttonIconName: 'icon-Arrow-Revert',
        rightButtonClass: 'long-button mat-warn',
        context: context,
      });
      if (!!response) {
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('LAWSUIT.WITHDRAW_EXECUTION.DIALOG_ALERT.SEND_BACK_TO_EDIT_EXECUTION', {
            LG_ID: this.litigationId,
          })
        );
        this.routerService.back();
      }
    }
  }

  transformResponsibleLawyer(): void {
    let transformData: LitigationCaseShortDto = {};
    const {
      publicAuctionLawyerId,
      publicAuctionLawyerName,
      publicAuctionLawyerSurname,
      publicAuctionLawyerTitle,
      initByTitle,
      initByName,
      initBySurname,
    } = this.withdrawWritOfExecResponse;
    transformData.legalExecutionLawyerId = publicAuctionLawyerId;
    const fullNameData = [publicAuctionLawyerTitle, publicAuctionLawyerName, publicAuctionLawyerSurname];
    transformData.legalExecutionLawyerFullName = fullNameData.some(val => !val) ? '' : fullNameData.join(' ');

    this.responsibleLawyerData = transformData;
  }
}
