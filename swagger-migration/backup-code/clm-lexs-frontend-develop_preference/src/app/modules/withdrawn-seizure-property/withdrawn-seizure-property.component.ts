import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { SubButtonModel } from '@app/shared/components/action-bar/action-bar.component';
import { RejectDialogComponent } from '@app/shared/components/common-dialogs/reject-dialog/reject-dialog.component';
import { CollateralCaseLexsStatus, ERROR_CODE } from '@app/shared/constant';
import { ActionBar, ITabNav, Mode, taskCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  PostApprovalRequest,
  PostCommandAcceptionSubmitRequest,
  PostDocValidationSubmitRequest,
  PostSubmitRequest,
  ResultRecordingTaskSubmitRequest,
  WithdrawSeizureLedDocumentDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DialogOptions } from '@spig/core';
import { TaskService } from '../task/services/task.service';
import {
  WITHDRAWN_SEIZURE_PROPERTY_STEPS,
  WITHDRAWN_SEIZURE_PROPERTY_TABS,
} from './withdrawn-seizure-property.constant';
import { WithdrawnSeizurePropertyService } from './withdrawn-seizure-property.service';

interface ActionBarMeta extends ActionBar {
  hasEditButton?: boolean;
  editButtonText?: string;
  editButtonIcon?: string;
}

@Component({
  selector: 'app-withdrawn-seizure-property',
  templateUrl: './withdrawn-seizure-property.component.html',
  styleUrls: ['./withdrawn-seizure-property.component.scss'],
})
export class WithdrawnSeizurePropertyComponent implements OnInit {
  @ViewChild('withdrawnStepper') withdrawnStepper!: MatStepper;

  public actionBar: ActionBarMeta = {
    hasSave: false,
    hasPrimary: false,
    hasCancel: false,
    hasReject: false,
  };
  public maxSubButton: number = 2;
  public subButtonList: Array<SubButtonModel> = [];
  private MENUS = {
    BACK: {
      name: 'cancel',
      class: 'secondary-button',
      icon: 'icon-Direction-Left',
      text: 'COMMON.BUTTON_TO_PREVIOUS_STEP',
      disabled: false,
    },
    SAVE: {
      name: 'save_case',
      class: 'secondary-button',
      icon: 'icon-save-primary',
      text: 'COMMON.BUTTON_SAVE',
      disabled: false,
    },
    REJECT: {
      name: 'revert_case',
      class: 'secondary-button',
      icon: '',
      text: 'WITHDRAWN_SEIZURE_PROPERTY.BUTTON_CANCEL_WITHDRAWN_ORDER',
      disabled: false,
    },
    APPROVE: {
      name: 'approve_case',
      class: 'primary-button positive',
      icon: 'icon-Direction-Right',
      text: 'COMMON.CONTINUE',
      disabled: false,
    },
    FINAL_APPROVE: {
      name: 'approve_case',
      class: 'primary-button positive',
      icon: 'icon-Arrow-Revert',
      text: 'WITHDRAWN_SEIZURE_PROPERTY.BUTTON_WITHDRAWN_ORDER',
      disabled: false,
    },
  };

  public tabsInfo: ITabNav[] = this.withdrawnSeizurePropertyService.withdrawnSeizurePropertyTabs;
  public tabIndex = 0;
  public statusName: string = '';
  public statusCode: string = '';
  public isSteperTask: boolean = true;

  public title: string = 'WITHDRAWN_SEIZURE_PROPERTY.TITLE_WITHDRAWN';
  private titleMapper = new Map<taskCode, string>([
    [taskCode.R2E06_01_A, 'WITHDRAWN_SEIZURE_PROPERTY.TITLE_WITHDRAWN_TASK'],
    [taskCode.R2E06_02_B, 'WITHDRAWN_SEIZURE_PROPERTY.TITLE_CONSIDER_WITHDRAWN_TASK'],
    [taskCode.R2E06_03_C, 'WITHDRAWN_SEIZURE_PROPERTY.TITLE_RECOMMENDED_LAWYER_TASK'],
    [taskCode.R2E06_04_D, 'WITHDRAWN_SEIZURE_PROPERTY.TITLE_ASSIGN_LAWYER_TASK'],
    [taskCode.R2E06_05_E, 'WITHDRAWN_SEIZURE_PROPERTY.TITLE_WITHDRAWN_LAWYER_OFFICE_TASK'],
  ]);
  public messageBanner!: string | undefined;
  private msgBannerMapper = new Map<taskCode, string>([
    [taskCode.R2E06_01_A, 'WITHDRAWN_SEIZURE_PROPERTY.MSG_BANNER_WITHDRAWN_1'],
    [taskCode.R2E06_02_B, 'WITHDRAWN_SEIZURE_PROPERTY.MSG_BANNER_CONSIDER_WITHDRAWN_TASK'],
    [taskCode.R2E06_03_C, 'WITHDRAWN_SEIZURE_PROPERTY.MSG_BANNER_RECOMMENDED_LAWYER_TASK'],
    [taskCode.R2E06_04_D, 'WITHDRAWN_SEIZURE_PROPERTY.MSG_BANNER_ASSIGN_LAWYER_TASK'],
    [taskCode.R2E06_05_E, 'WITHDRAWN_SEIZURE_PROPERTY.MSG_BANNER_WITHDRAWN_LAWYER_OFFICE_TASK'],
  ]);
  public steps: ITabNav[] = this.withdrawnSeizurePropertyService.withdrawnSeizurePropertySteps;

  private taskCode!: taskCode;
  private taskId!: number;
  private isSaveSuccess: boolean = false;

  public accessPermissions = this.sessionService.accessPermissions();
  public hasSubmitPermission = false;

  private withdrawSeizureId: number = 0;
  private withdrawSeizureLedId: string = '';

  constructor(
    private routerService: RouterService,
    private taskService: TaskService,
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService,
    private translate: TranslateService,
    private logger: LoggerService,
    private notificationService: NotificationService,
    private sessionService: SessionService
  ) {}

  get mode() {
    const mode = this.routerService.activeRoute.snapshot.queryParamMap.get('mode');
    // set mode VIEW / EDIT with condition routing from which menu
    if (this.routerService.navigateFormTaskMenu) {
      // form task menu
      return 'EDIT';
    } else if (!this.routerService.navigateFormTaskMenu && !['VIEW', 'VIEW_PENDING'].includes(mode || '')) {
      return 'ADD';
    } else if (mode === Mode.VIEW_PENDING) {
      return 'VIEW_PENDING';
    } else {
      // form litigation menu or other conditions
      return 'VIEW';
    }
  }

  get isMakerAwaitingTask() {
    return this.taskCode === taskCode.R2E06_01_A && 'AWAITING' === this.taskService?.taskDetail?.statusCode;
  }

  get isOwnerTask() {
    if (this.mode === 'ADD') return true;
    return this.sessionService.isOwnerTask(
      this.taskService.taskOwner,
      this.taskService.taskDetail.enableTaskSupportRole
    );
  }

  get isEditor() {
    return ['APPROVER', 'MAKER'].includes(this.accessPermissions.subRoleCode);
  }

  initPermission() {
    if (this.mode === 'ADD') {
      this.hasSubmitPermission = true;
    } else {
      this.hasSubmitPermission = this.sessionService.hasPermissionByTaskCode(this.taskCode);
    }
  }

  ngOnInit(): void {
    console.log('ngOnInit WithdrawnSeizurePropertyComponent :: ', this.mode);
    // prepare state
    this.initialSeizureId();

    if (this.routerService.navigateFormTaskMenu) {
      this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
      this.taskId = this.taskService.taskDetail.id || 0;
      this.statusName = this.taskService.taskDetail.statusName || '';
      this.statusCode = this.taskService.taskDetail.statusCode || '';
    }

    if (this.mode === 'EDIT') {
      this.messageBanner = this.msgBannerMapper.get(this.taskCode);
      if (
        this.taskCode === taskCode.R2E06_03_C ||
        this.taskCode === taskCode.R2E06_04_D ||
        this.taskCode === taskCode.R2E06_05_E
      ) {
        this.title = this.translate.instant(this.titleMapper.get(this.taskCode) || '', {
          OFFICE_LAWYER:
            this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllResponse?.withdrawSeizureLed?.ledName || '-',
        });
      } else {
        this.title = this.titleMapper.get(this.taskCode) || '';
      }
    } else if ([Mode.VIEW].includes(this.mode)) {
      if (this.routerService.navigateFormTaskMenu) {
        // view of task path
        if (
          this.taskCode === taskCode.R2E06_03_C ||
          this.taskCode === taskCode.R2E06_04_D ||
          this.taskCode === taskCode.R2E06_05_E
        ) {
          this.title = this.translate.instant(this.titleMapper.get(this.taskCode) || '', {
            OFFICE_LAWYER:
              this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllResponse?.withdrawSeizureLed?.ledName || '-',
          });
        } else {
          this.title = this.titleMapper.get(this.taskCode) || '';
        }
      } else {
        this.title = this.translate.instant('WITHDRAWN_SEIZURE_PROPERTY.TITLE_LITIGATION_EXCUTION_VIEW_MODE', {
          OFFICE_LAWYER:
            this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllResponse?.withdrawSeizureLed?.ledName || '-',
          COUNT: this.withdrawnSeizurePropertyService.withdrawSeizureLedAllResponse?.withdrawSeizureSeq || '0',
        });
      }
    } else if ([Mode.VIEW_PENDING].includes(this.mode)) {
      this.title = this.translate.instant('WITHDRAWN_SEIZURE_PROPERTY.TITLE_LITIGATION_COMMAND_VIEW_MODE', {
        COUNT: this.withdrawnSeizurePropertyService.withdrawSeizureResponse?.withdrawSeizureSeq || '0',
      });
      this.statusCode = this.withdrawnSeizurePropertyService.withdrawSeizureResponse.status || '';
      this.statusName = this.withdrawnSeizurePropertyService.withdrawSeizureResponse.statusName || '';
    }

    this.isSteperTask = (this.taskCode === taskCode.R2E06_01_A && !this.isMakerAwaitingTask) || this.mode === 'ADD';
    // initial state
    this.initPermission();
    // for action bar
    this.initActionBar();
    // for routing tab
    if (!this.isSteperTask) {
      this.setUpTabRoutering();
      this.mode === 'VIEW' ? this.onRouterLink(this.tabsInfo[1]) : this.onRouterLink(this.tabsInfo[0]);
    } else {
      this.handleRoutingFromCreatePage();
      this.initStepper();
    }
  }

  initActionBar() {
    if (this.mode === 'EDIT' && this.isOwnerTask && this.isEditor && this.hasSubmitPermission) {
      if (this.taskCode === taskCode.R2E06_01_A && !this.isMakerAwaitingTask) {
        this.setFirstStepActionBarMenu();
      } else if (this.taskCode === taskCode.R2E06_02_B) {
        this.actionBar = {
          hasEditButton: true,
          editButtonText: 'COMMON.BUTTON_SEND_BACK_EDIT',
          editButtonIcon: 'icon-Arrow-Revert',
          hasSave: false,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_APPROVE',
          hasCancel: false,
          hasReject: true,
          rejectIcon: 'icon-Dismiss-Square',
          rejectText: 'COMMON.BUTTON_NOT_APPROVE',
        };
      } else if (this.taskCode === taskCode.R2E06_03_C) {
        this.actionBar = {
          hasSave: false,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_FINISH',
          hasCancel: false,
          hasReject: false,
        };
      } else if (this.taskCode === taskCode.R2E06_04_D) {
        this.actionBar = {
          hasSave: false,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_FINISH',
          hasCancel: false,
          hasReject: false,
        };
      } else if (this.taskCode === taskCode.R2E06_05_E) {
        this.actionBar = {
          hasSave: true,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_FINISH',
          hasCancel: false,
          hasReject: false,
        };
      } else {
        this.actionBar = {
          hasSave: false,
          hasPrimary: false,
          hasCancel: false,
          hasReject: false,
        };
        this.maxSubButton = 0;
        this.subButtonList = [];
      }
    } else if (this.mode === 'ADD' && this.isEditor && this.hasSubmitPermission) {
      this.setFirstStepActionBarMenu();
    } else {
      this.actionBar = {
        hasSave: false,
        hasPrimary: false,
        hasCancel: false,
        hasReject: false,
      };
      this.maxSubButton = 0;
      this.subButtonList = [];
    }
  }

  setUpTabRoutering() {
    this.withdrawnSeizurePropertyService.withdrawnSeizurePropertyTabs = (
      WITHDRAWN_SEIZURE_PROPERTY_TABS as ITabNav[]
    ).map(item => {
      const _prefix = this.routerService.currentRoute.split('/');
      const _prefixPath = `/${_prefix[1]}/${_prefix[2]}/withdrawn-seizure-property`;
      item.prefix = _prefixPath;
      item.fullPath = _prefixPath + '/' + item.path;
      return item;
    });
    // this.tabsInfo = this.withdrawnSeizurePropertyService.withdrawnSeizurePropertyTabs.filter((i) =>
    //   !this.isSteperTask && this.taskCode !== taskCode.R2E06_02_B && !this.isMakerAwaitingTask
    //     ? i.index !== 1
    //     : i.index !== 2
    // );

    this.tabsInfo = this.getTabMenuCondition();
  }

  private getTabMenuCondition(): Array<ITabNav> {
    let tabs: ITabNav[] = [];
    if (
      !this.isSteperTask &&
      this.taskCode !== taskCode.R2E06_02_B &&
      !this.isMakerAwaitingTask &&
      !['VIEW_PENDING'].includes(this.mode)
    ) {
      tabs = this.withdrawnSeizurePropertyService.withdrawnSeizurePropertyTabs.filter(i => i.index !== 1);
    } else {
      tabs = this.withdrawnSeizurePropertyService.withdrawnSeizurePropertyTabs.filter(i => i.index !== 2);
    }
    return tabs;
  }

  onRouterLink(item: ITabNav) {
    this.tabIndex = item.index;
    this.routerService.navigateTo(item.fullPath, { mode: this.mode });
  }

  onBack() {
    if (
      (this.taskCode === taskCode.R2E06_01_A && !this.isMakerAwaitingTask && !this.isSaveSuccess) ||
      this.mode === 'ADD'
    ) {
      this.validateFormStateBeforeBack();
    } else if (this.taskCode === taskCode.R2E06_05_E) {
      this.validateStateBeforeLeaveTaskE();
    } else {
      this.routerService.back();
    }
  }

  private validateStateBeforeLeaveTaskE() {
    if (
      this.withdrawnSeizurePropertyService?.withdrawDateCtrl?.touched ||
      this.withdrawnSeizurePropertyService?.withdrawDateCtrl?.dirty
    ) {
      this.openConfirmBackToEdit(-1);
    } else {
      this.routerService.back();
    }
  }

  private validateFormStateBeforeBack() {
    const currentStep = this.withdrawnStepper._getFocusIndex() || 0;
    switch (currentStep) {
      case 0:
        if (this.withdrawnSeizurePropertyService.withdrawnSeizureDetailForm.touched) {
          this.openConfirmBackToEdit(-1);
        } else {
          this.routerService.back();
        }
        break;
      case 1:
        if (this.withdrawnSeizurePropertyService.propertyForm.touched) {
          this.openConfirmBackToEdit(-1);
        } else {
          this.routerService.back();
        }
        break;
      case 2:
        if (this.withdrawnSeizurePropertyService.withdrawnSeizureUploadForm.touched) {
          this.openConfirmBackToEdit(-1);
        } else {
          this.routerService.back();
        }
        break;
      default:
        this.routerService.back();
        break;
    }
  }

  async onSave() {
    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'COMMON.BUTTON_CONFIRM_SAVE',
      buttonIconName: 'icon-save-primary',
      rightButtonClass: 'primary',
    };
    const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
      'ยืนยันบันทึก',
      'ระบบจะบันทึกข้อมูลล่าสุดเพื่อให้คุณกลับมาดำเนินการต่อไป',
      optionsDialog
    );
    if (!res) return;
    if (this.taskCode === taskCode.R2E06_05_E) {
      this.onSubmitWithdrawSeizureLed('D');
    } else {
      try {
        this.saveWithoutValidation();
      } catch (error) {
        this.logger.info('onRemoveData Error ::', error);
      }
    }
  }

  async onSubmitWithdrawSeizureLed(keyResult: string): Promise<void> {
    // LE2565090051
    const lgId = this.taskService.taskDetail?.litigationId || '';
    const resultDate = this.withdrawnSeizurePropertyService.withdrawDateCtrl.value;
    const resultFee = this.withdrawnSeizurePropertyService.withdrawPaidFeeSource;
    const dataRequest = this.withdrawnSeizurePropertyService.withdrawSeizureLedAllResponse;
    const groupDocs =
      this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllPayload?.withdrawSeizureLedGroups || [];
    const withdrawSeizureLedGroups = dataRequest.withdrawSeizureLed?.withdrawSeizureLedGroups?.map(
      (group, groupIndex) => {
        return {
          ...group,
          contacts: (group.contacts || []).map((contact, contactIndex) => {
            let _resultFee = resultFee[groupIndex][contactIndex]?.paidFeeAmount || '0.00';
            if (typeof _resultFee === 'number') {
              _resultFee = _resultFee.toString();
            }
            const paidFeeAmount = parseFloat(_resultFee.replace(/,/g, ''));
            return {
              ...contact,
              paidFeeAmount: paidFeeAmount,
            };
          }),
          withdrawSeizureLedGroupDocuments: groupDocs
            ?.find(x => x.withdrawSeizuresGroupId === group.withdrawSeizuresGroupId)
            ?.withdrawSeizureLedGroupDocuments?.filter(it => it?.ledGroupDocument?.uploadSessionId),
        };
      }
    );
    withdrawSeizureLedGroups?.forEach(it => {
      if (it.withdrawSeizureLedGroupDocuments?.length === 0) {
        delete it.withdrawSeizureLedGroupDocuments;
      }
    });

    const request: ResultRecordingTaskSubmitRequest = {
      headerFlag: keyResult === 'D' ? 'DRAFT' : 'SUBMIT',
      resultDate: resultDate,
      withdrawSeizureLedDocuments:
        this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllPayload?.withdrawSeizureLedDocuments?.filter(
          it => it?.ledDocument?.uploadSessionId
        ) || [],
      withdrawSeizureLedGroups: withdrawSeizureLedGroups,
      withdrawSeizureLedId: Number(this.withdrawSeizureLedId),
    };
    await this.withdrawnSeizurePropertyService
      .resultRecordingTaskSubmit(this.taskId, Number(this.withdrawSeizureId), request)
      .then(() => {
        let toastMsg = '';
        if (keyResult === 'S') {
          toastMsg = this.translate.instant('WITHDRAWN_SEIZURE_PROPERTY.DIALOG.TOAST_SAVE_RESULT_SUCCESS', {
            LGID: lgId || '',
          });
        } else {
          toastMsg = this.translate.instant('WITHDRAWN_SEIZURE_PROPERTY.DIALOG.TOAST_SAVE_SUCCESS', {
            LGID: lgId || '',
          });
        }
        this.notificationService.openSnackbarSuccess(toastMsg);
        if (keyResult === 'S') {
          this.routerService.back();
        } else {
          const dateCtrlValue = this.withdrawnSeizurePropertyService?.withdrawDateCtrl.value;
          this.withdrawnSeizurePropertyService?.withdrawDateCtrl.reset(dateCtrlValue);
          this.isSaveSuccess = true;
        }
      })
      .catch((error: any) => {
        let errors = error?.error?.errors;
        if (errors && errors.length > 0) {
          const errorCode = errors[0].code;
          switch (errorCode) {
            case ERROR_CODE.EWS007:
            case ERROR_CODE.EWS008:
            case ERROR_CODE.EWS009:
              this.withdrawnSeizurePropertyService.isErrorLedDoc = true;
              this.withdrawnSeizurePropertyService.isErrorContactDoc = false;
              break;
            case ERROR_CODE.EWS011:
              this.withdrawnSeizurePropertyService.isErrorLedDoc = false;
              this.withdrawnSeizurePropertyService.isErrorContactDoc = true;
              break;
            default:
              this.withdrawnSeizurePropertyService.isErrorContactDoc = false;
              this.withdrawnSeizurePropertyService.isErrorLedDoc = false;
              break;
          }
        }
      });
  }

  private async openConfirmSubmitWithdrawSeizureLedWithWarning() {
    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'ยืนยันเสร็จสิ้น',
      buttonIconName: 'icon-Selected',
      rightButtonClass: 'primary',
    };

    const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
      'มีเอกสารบางรายการต้องกลับมาอัปโหลดในภายหลัง',
      'เนื่องจากการถอนยึดทรัพย์ไม่สำเร็จในผู้ติดต่อบางราย<br>กรุณากดปุ่ม ‘ยืนยันเสร็จสิ้น’ เพื่อเสร็จสิ้นงาน และ<br>กลับมาอัปโหลดเอกสารคำแถลงสวมสิทธิ์แทนโจทก์ในภายหลัง',
      optionsDialog
    );

    if (!res) return;
    try {
      this.onSubmitWithdrawSeizureLed('S');
    } catch (error) {
      this.logger.info('onRemoveData Error ::', error);
    }
  }

  async onEdit() {
    console.log('onEdit WithdrawnSeizurePropertyComponent');
    if (this.taskCode === taskCode.R2E06_02_B) {
      const context = {
        mode: 'WITHDRAWN_SEIZURE_PROPERTY',
        action: 'RETURN',
        withdrawSeizureId: Number(this.withdrawSeizureId),
      };
      const response = await this.notificationService.showCustomDialog({
        component: RejectDialogComponent,
        iconName: 'icon-Arrow-Revert',
        title: 'COMMON.LABEL_SEND_BACK_EDIT',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        rightButtonLabel: 'COMMON.CONFIRM_SEND_BACK_EDIT',
        buttonIconName: 'icon-Arrow-Revert',
        rightButtonClass: 'long-button mat-warn',
        context: context,
      });
      if (!!response) {
        this.notificationService.openSnackbarSuccess(
          `ส่งกลับแก้ไขถอนการยึดทรัพย์เลขที่กฎหมาย ${
            this.taskService.taskDetail.litigationId || this.withdrawnSeizurePropertyService.litigationId
          } แล้ว`
        );
        this.routerService.back();
      }
    }
  }

  async onSubmit() {
    console.log('onSubmit WithdrawnSeizurePropertyComponent');
    if (this.taskCode === taskCode.R2E06_02_B) {
      const request: PostApprovalRequest = {
        action: PostApprovalRequest.ActionEnum.Approve,
      };
      await this.withdrawnSeizurePropertyService.postWithdrawSeizuresApproval(Number(this.withdrawSeizureId), request);
      this.notificationService.openSnackbarSuccess(
        `เลขที่กฎหมาย: ${
          this.taskService.taskDetail.litigationId || this.withdrawnSeizurePropertyService.litigationId
        } อนุมัติสำเร็จแล้ว`
      );
      this.routerService.back();
    } else if (this.taskCode === taskCode.R2E06_03_C) {
      const rawValue = this.withdrawnSeizurePropertyService.lawyerForm.getRawValue();
      if (!this.withdrawnSeizurePropertyService.lawyerForm.invalid) {
        const request: PostDocValidationSubmitRequest = {
          publicAuctionLawyerId: rawValue.legalExecutionLawyerId,
          withdrawSeizureLedId: Number(this.withdrawSeizureLedId),
        };
        await this.withdrawnSeizurePropertyService.postDocumentValidationSubmit(
          this.taskId,
          this.withdrawSeizureId,
          request
        );
        this.notificationService.openSnackbarSuccess(
          `เลขที่กฎหมาย: ${
            this.taskService.taskDetail.litigationId || this.withdrawnSeizurePropertyService.litigationId
          } แนะนำทนายความสำเร็จแล้ว`
        );
        this.routerService.back();
      } else {
        this.withdrawnSeizurePropertyService.lawyerForm.markAllAsTouched();
        this.withdrawnSeizurePropertyService.lawyerForm.updateValueAndValidity();
      }
    } else if (this.taskCode === taskCode.R2E06_04_D) {
      const rawValue = this.withdrawnSeizurePropertyService.lawyerForm.getRawValue();
      if (!this.withdrawnSeizurePropertyService.lawyerForm.invalid) {
        const request: PostCommandAcceptionSubmitRequest = {
          publicAuctionLawyerId: rawValue.legalExecutionLawyerId,
          withdrawSeizureLedId: Number(this.withdrawSeizureLedId),
        };
        await this.withdrawnSeizurePropertyService.postCommandAcceptionSubmit(
          this.taskId,
          this.withdrawSeizureId,
          request
        );
        this.notificationService.openSnackbarSuccess(
          `เลขที่กฎหมาย: ${
            this.taskService.taskDetail.litigationId || this.withdrawnSeizurePropertyService.litigationId
          } มอบหมายทนายความสำเร็จแล้ว`
        );
        this.routerService.back();
      } else {
        this.withdrawnSeizurePropertyService.lawyerForm.markAllAsTouched();
        this.withdrawnSeizurePropertyService.lawyerForm.updateValueAndValidity();
        await this.notificationService.alertDialog('ไม่สามารถกดเสร็จสิ้นได้', 'กรุณาเลือกทนายความผู้รับผิดชอบ');
      }
    } else if (this.taskCode === taskCode.R2E06_05_E) {
      if (this.withdrawnSeizurePropertyService.withdrawDateCtrl.invalid) {
        this.withdrawnSeizurePropertyService.withdrawDateCtrl.markAllAsTouched();
        this.withdrawnSeizurePropertyService.withdrawDateCtrl.updateValueAndValidity();
        return;
      }

      let optionalLedDocFile: WithdrawSeizureLedDocumentDto = {};
      let totalRequireLedDocFile = 0;
      let isAllGroupFileUpload = false;
      let isHasSomeUnSuccessCollateral = false;
      let isHasAllUnSuccessCollateral = false;
      let isHasSomeUnSuccessAsset = false;
      let isHasAllUnSuccessAsset = false;
      const dataRequest = this.withdrawnSeizurePropertyService.withdrawSeizureLedAllResponse;
      if (dataRequest.withdrawSeizureLed?.withdrawSeizureLedGroups) {
        //TODO check more case
        const allCollaterals = dataRequest.withdrawSeizureLed.withdrawSeizureLedGroups.flatMap(it => it.collaterals);
        isHasSomeUnSuccessCollateral = allCollaterals.some(
          it => it?.withdrawSeizureResult === 'U' && it.withdrawSeizureReason === '01'
        );
        isHasAllUnSuccessCollateral = allCollaterals.every(
          it => it?.withdrawSeizureResult === 'U' && it.withdrawSeizureReason === '01'
        );
        const allAssets = dataRequest.withdrawSeizureLed.withdrawSeizureLedGroups.flatMap(it => it.assets);
        isHasSomeUnSuccessAsset = allAssets.some(
          it => it?.withdrawSeizureResult === 'U' && it.withdrawSeizureReason === '01'
        );
        isHasAllUnSuccessAsset = allAssets.every(
          it => it?.withdrawSeizureResult === 'U' && it.withdrawSeizureReason === '01'
        );
      }

      if (isHasSomeUnSuccessCollateral || isHasSomeUnSuccessAsset) {
        if (
          this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllPayload?.withdrawSeizureLedDocuments &&
          this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllPayload?.withdrawSeizureLedDocuments?.length > 0
        ) {
          optionalLedDocFile = this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllPayload
            ?.withdrawSeizureLedDocuments[1] as WithdrawSeizureLedDocumentDto;
          totalRequireLedDocFile =
            this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllPayload?.withdrawSeizureLedDocuments.filter(
              (it, i) => i !== 1 && it?.ledDocument?.uploadSessionId
            ).length;
          const allDocGroups =
            this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllPayload?.withdrawSeizureLedGroups?.flatMap(
              it => it.withdrawSeizureLedGroupDocuments
            ) || [];
          isAllGroupFileUpload =
            allDocGroups.length > 0 && allDocGroups.every(it => it?.ledGroupDocument?.uploadSessionId);
        }
      } else if (isHasAllUnSuccessCollateral || isHasAllUnSuccessAsset) {
        if (
          this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllPayload?.withdrawSeizureLedDocuments &&
          this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllPayload?.withdrawSeizureLedDocuments?.length > 0
        ) {
          optionalLedDocFile = this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllPayload
            ?.withdrawSeizureLedDocuments[1] as WithdrawSeizureLedDocumentDto;
          totalRequireLedDocFile =
            this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllPayload?.withdrawSeizureLedDocuments.filter(
              (it, i) => i > 1 && it?.ledDocument?.uploadSessionId
            ).length;
          const allDocGroups =
            this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllPayload?.withdrawSeizureLedGroups?.flatMap(
              it => it.withdrawSeizureLedGroupDocuments
            ) || [];
          isAllGroupFileUpload =
            allDocGroups.length > 0 && allDocGroups.every(it => it?.ledGroupDocument?.uploadSessionId);
        }
      }

      if (
        (isHasSomeUnSuccessCollateral || isHasSomeUnSuccessAsset) &&
        totalRequireLedDocFile === 5 &&
        isAllGroupFileUpload &&
        !optionalLedDocFile?.ledDocument?.uploadSessionId
      ) {
        this.openConfirmSubmitWithdrawSeizureLedWithWarning();
        return;
      } else if (
        (isHasAllUnSuccessCollateral || isHasAllUnSuccessAsset) &&
        totalRequireLedDocFile === 4 &&
        isAllGroupFileUpload &&
        !optionalLedDocFile?.ledDocument?.uploadSessionId
      ) {
        this.openConfirmSubmitWithdrawSeizureLedWithWarning();
        return;
      }

      this.onSubmitWithdrawSeizureLed('S');
    } else if (
      this.taskCode === taskCode.R2E06_01_A ||
      this.withdrawnSeizurePropertyService.withdrawSeizureMode === 'ADD'
    ) {
      const currentStep = this.withdrawnStepper._getFocusIndex() || 0;
      switch (currentStep) {
        case 0:
          this.withdrawnSeizurePropertyService.withdrawnSeizureDetailForm.markAllAsTouched();
          if (this.withdrawnSeizurePropertyService.withdrawnSeizureDetailForm.valid) {
            this.openConfirmSaveDraft(currentStep);
          }
          break;
        case 1:
          this.logger.info(this.withdrawnSeizurePropertyService.propertyForm);
          this.withdrawnSeizurePropertyService.propertyForm.markAllAsTouched();
          if (this.withdrawnSeizurePropertyService.propertyForm?.invalid) return;
          if (this.isDataHasSoldItems() || this.isDataHasSoldItemsAsset()) {
            this.openConfirmSaveDraftWithSoldItem(currentStep);
          } else {
            this.saveDraftPropertyGroup(currentStep);
          }
          break;
        case 2:
          this.logger.info(this.withdrawnSeizurePropertyService.withdrawnSeizureUploadForm);
          this.withdrawnSeizurePropertyService.withdrawnSeizureUploadForm.markAllAsTouched();
          const hasAllFiles = this.withdrawnSeizurePropertyService.withdrawSeizureResponse.withdrawSeizureGroups
            ?.flatMap(it => it.consentDocuments)
            .every(it => it?.uploadSessionId || it?.document?.imageId);
          if (hasAllFiles) {
            this.submitWithdrawnSeizure();
          } else {
            await this.notificationService.alertDialog(
              'ไม่สามารถยืนยันถอนยึดทรัพย์ได้',
              'กรุณาอัปโหลดเอกสารเพิ่มเติมให้ครบถ้วน'
            );
          }

          break;
        default:
          break;
      }
    }
  }

  private async openConfirmSaveDraft(currentStep: number) {
    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'COMMON.BUTTON_CONFIRM_SAVE',
      buttonIconName: 'icon-save-primary',
      rightButtonClass: 'primary',
    };

    console.log(
      'this.withdrawnSeizurePropertyService.withdrawSeizureResponse,',
      this.withdrawnSeizurePropertyService.withdrawSeizureResponse
    );
    const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
      'ยืนยันบันทึก',
      'กด ยืนยันบันทึก เพื่อบันทึกข้อมูลล่าสุดก่อนดำเนินการต่อ',
      optionsDialog
    );

    if (!res) return;
    try {
      if (currentStep === 0) {
        this.saveDraftReasonStep(currentStep);
      } else if (currentStep === 1) {
        this.saveDraftPropertyGroup(currentStep);
      }
    } catch (error) {
      this.logger.info('onRemoveData Error ::', error);
    }
  }

  private async openConfirmSaveDraftWithSoldItem(currentStep: number) {
    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'ยืนยันดำเนินการต่อ',
      buttonIconName: 'icon-Direction-Right',
      rightButtonClass: 'primary',
    };

    const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
      'ทรัพย์มีการเปลี่ยนแปลง',
      'เนื่องจากมีบางทรัพย์ที่สถานะเปลี่ยนแปลง จึงไม่สามารถทำการถอนยึดทรัพย์ได้ สามารถกด ยกเลิก เพื่อกลับไปตรวจสอบ หรือ ยืนยันดำเนินการต่อ',
      optionsDialog
    );

    if (!res) return;
    try {
      this.saveDraftPropertyGroup(currentStep);
    } catch (error) {
      this.logger.info('onRemoveData Error ::', error);
    }
  }

  onCancel() {
    console.log('onCancel WithdrawnSeizurePropertyComponent');
    const currentStep = this.withdrawnStepper._getFocusIndex() || 0;
    this.validateFormStateBeforeEdit(currentStep);
  }

  private validateFormStateBeforeEdit(currentStep: number) {
    switch (currentStep) {
      case 1:
        if (this.withdrawnSeizurePropertyService.propertyForm.touched) {
          this.openConfirmBackToEdit(currentStep);
        } else {
          this.navigateCorrectRoute(WITHDRAWN_SEIZURE_PROPERTY_STEPS[0].path);
          this.withdrawnStepper.selectedIndex = 0;
        }
        break;
      case 2:
        if (this.withdrawnSeizurePropertyService.withdrawnSeizureUploadForm.touched) {
          this.openConfirmBackToEdit(currentStep);
        } else {
          this.navigateCorrectRoute(WITHDRAWN_SEIZURE_PROPERTY_STEPS[1].path);
          this.withdrawnStepper.selectedIndex = 1;
        }
        break;
      default:
        this.routerService.back();
        break;
    }
  }

  async onReject() {
    console.log('onReject WithdrawnSeizurePropertyComponent');
    if (this.taskCode === taskCode.R2E06_02_B) {
      const context = {
        mode: 'WITHDRAWN_SEIZURE_PROPERTY',
        action: 'REJECT',
        withdrawSeizureId: this.withdrawSeizureId,
      };
      const response = await this.notificationService.showCustomDialog({
        component: RejectDialogComponent,
        iconName: 'icon-Dismiss-Square',
        title: 'ไม่อนุมัติ',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        rightButtonLabel: 'ยืนยันไม่อนุมัติ',
        buttonIconName: 'icon-Dismiss-Square',
        rightButtonClass: 'long-button mat-warn',
        context: context,
      });
      if (!!response) {
        this.notificationService.openSnackbarSuccess(
          `ไม่อนุมัติถอนการยึดทรัพย์ในเลขที่กฎหมาย ${
            this.taskService.taskDetail.litigationId || this.withdrawnSeizurePropertyService.litigationId
          } แล้ว`
        );
        this.routerService.back();
      }
    } else if (
      this.taskCode === taskCode.R2E06_01_A ||
      this.withdrawnSeizurePropertyService.withdrawSeizureMode === 'ADD'
    ) {
      this.openConfirmCancelWithdrawnSeizure();
    }
  }

  private async openConfirmBackToEdit(currentStep: number = 0) {
    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'COMMON.EXIT_WITHOUT_SAVE',
      buttonIconName: 'icon-Arrow-Revert',
      rightButtonClass: 'primary',
    };

    const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
      'COMMON.EXIT_WITHOUT_SAVE',
      'มีการแก้ไขข้อมูลที่ยังไม่ได้ถูกบันทึก<br>คุณต้องการที่จะออกโดยไม่มีการบันทึกใช่หรือไม่?',
      optionsDialog
    );

    if (!res) return;
    try {
      switch (currentStep) {
        case -1:
          this.routerService.back();
          break;
        case 1:
          this.withdrawnSeizurePropertyService.withdrawSeizureResponse.withdrawSeizureGroups = [];
          this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData = {};
          this.navigateCorrectRoute(WITHDRAWN_SEIZURE_PROPERTY_STEPS[0].path);
          this.withdrawnStepper.selectedIndex = 0;
          break;
        case 2:
          this.navigateCorrectRoute(WITHDRAWN_SEIZURE_PROPERTY_STEPS[1].path);
          this.withdrawnStepper.selectedIndex = currentStep - 1;
          break;
        default:
          break;
      }
    } catch (error) {
      this.logger.info('onRemoveData Error ::', error);
    }
  }

  // TODO: useless function
  private async stepperClick(targetStep: number, prevIndex: number) {
    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'COMMON.EXIT_WITHOUT_SAVE',
      buttonIconName: 'icon-Arrow-Revert',
      rightButtonClass: 'primary',
    };

    const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
      'COMMON.EXIT_WITHOUT_SAVE',
      'มีการแก้ไขข้อมูลที่ยังไม่ได้ถูกบันทึก<br>คุณต้องการที่จะออกโดยไม่มีการบันทึกใช่หรือไม่?',
      optionsDialog
    );

    if (!res) {
      this.delaySetStepper(prevIndex);
      return;
    }

    try {
      switch (targetStep) {
        case 0:
          this.withdrawnSeizurePropertyService.withdrawSeizureResponse.withdrawSeizureGroups = [];
          this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData = {};
          this.navigateCorrectRoute(WITHDRAWN_SEIZURE_PROPERTY_STEPS[0].path);
          this.delaySetStepper(targetStep);
          break;
        case 1:
          this.navigateCorrectRoute(WITHDRAWN_SEIZURE_PROPERTY_STEPS[1].path);
          this.delaySetStepper(targetStep);
          break;
        default:
          break;
      }
    } catch (error) {
      this.logger.info('onRemoveData Error ::', error);
    }
  }

  onStepChange(e: StepperSelectionEvent) {
    event?.preventDefault();
    this.isSaveSuccess = false;
    switch (e.selectedIndex) {
      case 0:
        this.setFirstStepActionBarMenu();
        break;
      case 1:
        this.setSecondStepActionBarMenu();
        break;
      case 2:
        this.setThirdStepActionBarMenu();
        break;
      default:
        break;
    }
  }

  private setThirdStepActionBarMenu() {
    this.actionBar = {
      hasBack: true,
      hasCancel: false,
      hasSave: false,
      hasReject: false,
      hasPrimary: false,
      backText: this.mode === 'ADD' ? 'กลับไปหน้าคดี' : 'กลับไปหน้างาน',
    };
    this.maxSubButton = 2;
    this.subButtonList = [this.MENUS.BACK, this.MENUS.FINAL_APPROVE, this.MENUS.SAVE, this.MENUS.REJECT];
  }

  private setSecondStepActionBarMenu() {
    this.actionBar = {
      hasBack: true,
      hasCancel: false,
      hasSave: false,
      hasReject: false,
      hasPrimary: false,
      backText: this.mode === 'ADD' ? 'กลับไปหน้าคดี' : 'กลับไปหน้างาน',
    };
    this.maxSubButton = 2;
    this.subButtonList = [this.MENUS.BACK, this.MENUS.APPROVE, this.MENUS.SAVE, this.MENUS.REJECT];
  }

  private setFirstStepActionBarMenu() {
    this.actionBar = {
      hasBack: true,
      hasCancel: false,
      hasSave: false,
      hasReject: false,
      hasPrimary: false,
      backText: this.mode === 'ADD' ? 'กลับไปหน้าคดี' : 'กลับไปหน้างาน',
    };
    this.maxSubButton = 3;
    this.subButtonList = [this.MENUS.REJECT, this.MENUS.SAVE, this.MENUS.APPROVE];
  }

  handleRoutingFromCreatePage() {
    if (this.routerService.previousUrl.indexOf('/create-property-group') === -1) {
      this.navigateCorrectRoute(WITHDRAWN_SEIZURE_PROPERTY_STEPS[0].path);
      this.delaySetStepper(0);
      if (this.isOwnerTask && this.isEditor && this.hasSubmitPermission) this.setFirstStepActionBarMenu();
    }
  }

  initStepper() {
    if (this.routerService.currentRoute.indexOf(WITHDRAWN_SEIZURE_PROPERTY_STEPS[0].path) > -1) {
      this.delaySetStepper(0);
    } else if (this.routerService.currentRoute.indexOf(WITHDRAWN_SEIZURE_PROPERTY_STEPS[1].path) > -1) {
      this.delaySetStepper(1);
    } else if (this.routerService.currentRoute.indexOf(WITHDRAWN_SEIZURE_PROPERTY_STEPS[2].path) > -1) {
      this.delaySetStepper(2);
    }
  }

  private delaySetStepper(index: number) {
    setTimeout(() => {
      this.withdrawnStepper.selectedIndex = index;
    });
  }

  subButtonHandler(event: any) {
    switch (event.name) {
      case 'cancel':
        this.onCancel();
        break;
      case 'revert_case':
        this.onReject();
        break;
      case 'approve_case':
        this.onSubmit();
        break;
      case 'save_case':
        this.onSave();
        break;
      default:
        break;
    }
  }

  private async saveDraftReasonStep(currentStep: number) {
    try {
      const request: PostSubmitRequest = {
        ...this.withdrawnSeizurePropertyService.withdrawSeizureResponse,
        headerFlag: PostSubmitRequest.HeaderFlagEnum.Draft,
        litigationCaseId:
          this.withdrawnSeizurePropertyService.withdrawSeizureMode === 'ADD'
            ? this.withdrawnSeizurePropertyService.litigationCaseId
            : Number(this.taskService.taskDetail.litigationCaseId),
        reasonWithdrawSeizures:
          this.withdrawnSeizurePropertyService.withdrawnSeizureDetailForm.get('reasonWithdrawSeizures')?.value,
        debtPaidAmount: Number(
          this.withdrawnSeizurePropertyService.withdrawnSeizureDetailForm.get('debtPaidAmount')?.value
        ),
        isContactResponseForExpense: true,
        withdrawSeizureType: 'COL',
      };
      const response = await this.withdrawnSeizurePropertyService.postWithdrawSeizuresSubmit(request);
      if (!response) return;
      this.withdrawnSeizurePropertyService.withdrawSeizureId = response.withdrawSeizureId || 0;
      this.withdrawSeizureId = response.withdrawSeizureId || 0;
      console.log(' this.withdrawSeizureId', this.withdrawSeizureId);
      console.log(' this.response.withdrawSeizureId', response.withdrawSeizureId);
      console.log(
        ' this.response.withdrawnSeizurePropertyService.withdrawSeizureId',
        this.withdrawnSeizurePropertyService.withdrawSeizureId
      );
      this.notificationService.openSnackbarSuccess(
        this.translate.instant(
          `เลขที่กฎหมาย: ${
            this.taskService.taskDetail.litigationId || this.withdrawnSeizurePropertyService.litigationId
          } บันทึกสำเร็จแล้ว`
        )
      );
      this.navigateCorrectRoute(WITHDRAWN_SEIZURE_PROPERTY_STEPS[1].path);
      this.withdrawnStepper.selectedIndex = currentStep + 1;
    } catch (error) {
      this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
    }
  }

  private async saveDraftPropertyGroup(currentStep: number) {
    try {
      if (this.isValidatePropertyGroupData()) {
        const request: PostSubmitRequest = {
          ...this.withdrawnSeizurePropertyService.withdrawSeizureResponse,
          headerFlag: PostSubmitRequest.HeaderFlagEnum.Draft,
          debtPaidAmount: Number(this.withdrawnSeizurePropertyService.withdrawSeizureResponse.debtPaidAmount),
          isContactResponseForExpense: true,
          withdrawSeizureType: 'COL',
          withdrawSeizureId:
            this.withdrawnSeizurePropertyService.withdrawSeizureResponse.withdrawSeizureId ||
            this.withdrawnSeizurePropertyService.withdrawSeizureId,
        };
        if (this.isDataHasSoldItems()) {
          request.withdrawSeizureGroups?.forEach(it => {
            it.collaterals = it.collaterals?.filter(col => col.status !== CollateralCaseLexsStatus.SOLD);
          });
          request.withdrawSeizureGroups = request.withdrawSeizureGroups?.filter(
            it => it.collaterals && it.collaterals?.length > 0
          );
        }
        if (this.isDataHasSoldItemsAsset()) {
          request.withdrawSeizureGroups?.forEach(it => {
            it.assets = it.assets?.filter(col => col.collateralCaseLexStatus !== CollateralCaseLexsStatus.SOLD);
          });
          request.withdrawSeizureGroups = request.withdrawSeizureGroups?.filter(
            it => it.assets && it.assets?.length > 0
          );
        }
        const response = await this.withdrawnSeizurePropertyService.postWithdrawSeizuresSubmit(request);
        if (!response) return;
        this.withdrawnSeizurePropertyService.withdrawSeizureId = response.withdrawSeizureId || 0;
        this.notificationService.openSnackbarSuccess(
          this.translate.instant(
            `เลขที่กฎหมาย: ${
              this.taskService.taskDetail.litigationId || this.withdrawnSeizurePropertyService.litigationId
            } บันทึกสำเร็จแล้ว`
          )
        );
        this.navigateCorrectRoute(WITHDRAWN_SEIZURE_PROPERTY_STEPS[2].path);
        this.withdrawnStepper.selectedIndex = currentStep + 1;
      } else {
        await this.notificationService.alertDialog(
          'ไม่สามารถดำเนินการต่อได้',
          'เนื่องจากทรัพย์แต่ละรายการจำเป็นต้องมีผู้ติดต่ออย่างน้อย 1 คน'
        );
      }
    } catch (error) {
      this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
    }
  }

  private async openConfirmCancelWithdrawnSeizure() {
    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'ยืนยันยกเลิก',
      buttonIconName: 'icon-Dismiss-Square',
    };

    const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
      'ยืนยันยกเลิกคำสั่งการ',
      'เมื่อยกเลิกคำสั่งการแล้ว ข้อมูลที่บันทึกไว้จะหายไป<br>และไม่สามารถกลับมาแก้ไขได้',
      optionsDialog
    );

    if (!res) return;
    try {
      if (this.mode !== 'ADD') {
        this.cancelWithdrawnSeizure();
      } else {
        this.routerService.back();
      }
    } catch (error) {
      this.logger.info('onRemoveData Error ::', error);
    }
  }

  private async cancelWithdrawnSeizure() {
    try {
      const withdrawnSeizureId = Number(this.withdrawnSeizurePropertyService.withdrawSeizureId);
      await this.withdrawnSeizurePropertyService.postWithdrawSeizuresCancel(withdrawnSeizureId);
      this.notificationService.openSnackbarSuccess(
        this.translate.instant(
          `เลขที่กฎหมาย: ${
            this.taskService.taskDetail.litigationId || this.withdrawnSeizurePropertyService.litigationId
          } ยกเลิกสำเร็จแล้ว`
        )
      );
      this.routerService.back();
    } catch (error) {
      this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
    }
  }

  private async saveWithoutValidation() {
    const currentStep = this.withdrawnStepper._getFocusIndex() || 0;
    let request: PostSubmitRequest = {
      headerFlag: PostSubmitRequest.HeaderFlagEnum.Draft,
      ...this.withdrawnSeizurePropertyService.withdrawSeizureResponse,
      litigationCaseId:
        this.withdrawnSeizurePropertyService.withdrawSeizureMode === 'ADD'
          ? this.withdrawnSeizurePropertyService.litigationCaseId
          : Number(this.taskService.taskDetail.litigationCaseId),
    };
    switch (currentStep) {
      case 0:
        request = {
          ...request,
          reasonWithdrawSeizures:
            this.withdrawnSeizurePropertyService.withdrawnSeizureDetailForm.get('reasonWithdrawSeizures')?.value,
          debtPaidAmount: Number(
            this.withdrawnSeizurePropertyService.withdrawnSeizureDetailForm.get('debtPaidAmount')?.value
          ),
          isContactResponseForExpense: true,
        };
        break;
      case 1:
        request = {
          ...this.withdrawnSeizurePropertyService.withdrawSeizureResponse,
          headerFlag: PostSubmitRequest.HeaderFlagEnum.Draft,
          withdrawSeizureId:
            this.withdrawnSeizurePropertyService.withdrawSeizureId ||
            this.withdrawnSeizurePropertyService.withdrawSeizureResponse.withdrawSeizureId,
        };
        this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData = {};
        break;
      default:
        break;
    }

    try {
      const response = await this.withdrawnSeizurePropertyService.postWithdrawSeizuresSubmit(request);
      if (!response) return;
      this.withdrawnSeizurePropertyService.withdrawSeizureId = response.withdrawSeizureId || 0;
      this.isSaveSuccess = true;
      this.withdrawnSeizurePropertyService?.withdrawnSeizureDetailForm?.markAsUntouched({
        onlySelf: false,
      });
      this.withdrawnSeizurePropertyService?.propertyForm?.markAsUntouched({
        onlySelf: false,
      });
      this.withdrawnSeizurePropertyService?.withdrawnSeizureUploadForm?.markAsUntouched({
        onlySelf: false,
      });
      this.notificationService.openSnackbarSuccess(
        this.translate.instant(
          `เลขที่กฎหมาย: ${
            this.taskService?.taskDetail?.litigationId || this.withdrawnSeizurePropertyService.litigationId
          } บันทึกสำเร็จแล้ว`
        )
      );
      const withdrawSeizureId = this.withdrawnSeizurePropertyService.withdrawSeizureId;
      this.withdrawnSeizurePropertyService.withdrawSeizureResponse =
        await this.withdrawnSeizurePropertyService.getWithdrawSeizures(withdrawSeizureId);
    } catch (error) {
      this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
    }
  }

  private async submitWithdrawnSeizure() {
    try {
      let request: PostSubmitRequest = {
        headerFlag: PostSubmitRequest.HeaderFlagEnum.Submit,
        ...this.withdrawnSeizurePropertyService.withdrawSeizureResponse,
        withdrawSeizureType: 'COL',
      };
      const response = await this.withdrawnSeizurePropertyService.postWithdrawSeizuresSubmit(request);
      if (!response) return;
      this.notificationService.openSnackbarSuccess(
        `เลขที่กฎหมาย ${
          this.taskService.taskDetail.litigationId || this.withdrawnSeizurePropertyService.litigationId
        }: สั่งการถอนยึดทรัพย์สำเร็จแล้ว`
      );
      this.routerService.back();
    } catch (error) {
      this.notificationService.openSnackbarError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
    }
  }

  private isValidatePropertyGroupData(): boolean {
    if (!this.withdrawnSeizurePropertyService.withdrawSeizureResponse) return false;
    if (
      !this.withdrawnSeizurePropertyService.withdrawSeizureResponse.withdrawSeizureGroups ||
      this.withdrawnSeizurePropertyService.withdrawSeizureResponse.withdrawSeizureGroups.length === 0
    )
      return false;

    // const emptyCollateral = this.withdrawnSeizurePropertyService.withdrawSeizureResponse.withdrawSeizureGroups.filter(
    //   d => d.collaterals?.length === 0
    // );
    // const emptyAsset = this.withdrawnSeizurePropertyService.withdrawSeizureResponse.withdrawSeizureGroups.filter(
    //   d => d.assets?.length === 0
    // );

    let IsnotChecked = true;
    this.withdrawnSeizurePropertyService.withdrawSeizureResponse.withdrawSeizureGroups.forEach(x => {
      if (
        ((x.assets ? x.assets.length > 0 : false) || (x.collaterals ? x.collaterals?.length > 0 : false)) &&
        (x.contacts ? x.contacts?.length > 0 : false)
      ) {
        return IsnotChecked;
      } else {
        return (IsnotChecked = false);
      }
    });

    return IsnotChecked;
    // const emptyContact = this.withdrawnSeizurePropertyService.withdrawSeizureResponse.withdrawSeizureGroups.filter(
    //   d => d.contacts?.length === 0
    // );
    // if (emptyContact.length > 0) return false;

    // return true;
  }

  private navigateCorrectRoute(path: string) {
    const destination = this.withdrawnSeizurePropertyService.routeCorrection(path);
    this.routerService.navigateTo(destination);
  }

  private initialSeizureId(): void {
    this.withdrawSeizureId =
      this.taskService.taskDetail.objectType === 'WITHDRAW_SEIZURE_ID'
        ? Number(this.taskService.taskDetail.objectId)
        : 0;

    // if(!this.withdrawSeizureId){
    //   this.withdrawnSeizurePropertyService.withdrawSeizureId;
    // }
    if (
      this.withdrawnSeizurePropertyService.withdrawSeizureId &&
      this.withdrawnSeizurePropertyService.withdrawSeizureId !== 0
    ) {
      if (this.withdrawSeizureId && this.withdrawSeizureId !== 0) {
      } else {
        this.withdrawSeizureId = this.withdrawnSeizurePropertyService.withdrawSeizureId;
      }
    }
    this.withdrawSeizureLedId = JSON.parse(this.taskService.taskDetail.attributes || '{}')?.withdrawSeizureLedId || 0;
  }

  private isDataHasSoldItems() {
    const soldItem =
      this.withdrawnSeizurePropertyService.withdrawSeizureResponse.withdrawSeizureGroups?.filter(
        it => (it.collaterals?.filter(col => col.status === CollateralCaseLexsStatus.SOLD) || []).length > 0
      ) || [];
    return soldItem?.length > 0;
  }

  private isDataHasSoldItemsAsset() {
    const soldItem =
      this.withdrawnSeizurePropertyService.withdrawSeizureResponse.withdrawSeizureGroups?.filter(
        it => (it.assets?.filter(col => col.collateralCaseLexStatus === CollateralCaseLexsStatus.SOLD) || []).length > 0
      ) || [];
    return soldItem?.length > 0;
  }

  onStepperClick(i: number) {
    this.logger.info('onStepperClick', i);
  }
}
