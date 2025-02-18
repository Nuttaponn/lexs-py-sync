import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordDocsService } from '@app/modules/execution-warrant/execution-document-info/record-docs/record-docs.service';
import { MAIN_ROUTES } from '@app/shared/constant';
import { ActionBar, ITabNav, TMode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { DocumentDto, ExecutionTaskSubmitRequest } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { TaskService } from '../task/services/task.service';
import { EXECUTION_WARRANT_TABS } from './execution-warrant.constant';
import { ExecutionWarrantService } from './execution-warrant.service';

@Component({
  selector: 'app-execution-warrant',
  templateUrl: './execution-warrant.component.html',
  styleUrls: ['./execution-warrant.component.scss'],
})
export class ExecutionWarrantComponent implements OnInit {
  public tabsInfo: ITabNav[] = this.executionWarrantService.executionWarrantTabs;
  public tabIndex = 0;
  public actionBar: ActionBar = { hasCancel: false, hasReject: false, hasPrimary: false, hasSave: false };
  public mode!: TMode;
  public statusName!: string;
  public writOfExecDebtType!: string;

  public msgBanner!: string | undefined;
  private msgBannerMapper = new Map<taskCode, string>([
    [taskCode.R2E04_02_2A, 'EXECUTION_WARRANT.MSG_BANNER_DEBT_CALCULATE'],
    [taskCode.R2E04_01_2B, 'EXECUTION_WARRANT.MSG_BANNER_ASSIGN_LAWYER'],
    [taskCode.R2E04_03_3A, 'EXECUTION_WARRANT.MSG_BANNER_PROCEED_EXECUTION'],
  ]);
  public title!: string;
  private titleMapper = new Map<taskCode, string>([
    [taskCode.R2E04_02_2A, 'EXECUTION_WARRANT.TITLE'],
    [taskCode.R2E04_01_2B, 'EXECUTION_WARRANT.TITLE_ASSING_LAWYER'],
    [taskCode.R2E04_03_3A, 'EXECUTION_WARRANT.TITLE_PROCEED_EXECUTION'],
  ]);

  // IDs varlable
  private taskCode!: taskCode;
  private taskId!: number | undefined;
  private litigationId!: string;
  private litigationCaseId!: string;
  private isSaved: boolean = false;

  public accessPermissions = this.sessionService.accessPermissions();
  public hasSubmitPermission = false;

  constructor(
    private routerService: RouterService,
    private executionWarrantService: ExecutionWarrantService,
    private taskService: TaskService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private sessionService: SessionService,
    private litigationCaseService: LitigationCaseService,
    private route: ActivatedRoute,
    private recordDocsService: RecordDocsService
  ) {}

  ngOnInit(): void {
    // set mode VIEW / EDIT with condition routing from which menu
    if (this.routerService.navigateFormTaskMenu) {
      // form task menu
      this.mode = 'EDIT';
      this.litigationCaseId = this.taskService.taskDetail.litigationCaseId || '';
      this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
      this.taskId = this.taskService.taskDetail.id;
      this.statusName = this.taskService.taskDetail.statusName || '';
      this.litigationId = this.taskService.taskDetail.litigationId || '';
      this.msgBanner = this.msgBannerMapper.get(this.taskCode);
      this.title = this.titleMapper.get(this.taskCode) || 'EXECUTION_WARRANT.TITLE';
    } else {
      // form litigation menu or other conditions
      this.mode = 'VIEW';
      this.litigationCaseId = this.route.snapshot.queryParams['litigationCaseId'] || '';
      this.writOfExecDebtType = this.route.snapshot.queryParams['writOfExecDebtType'] || '';
      if (this.routerService.previousUrl.includes('prepare-info-tab')) {
        this.title = 'EXECUTION_WARRANT.TITLE_CALCULATE_DEBT_DETAIL';
      } else {
        this.title = 'EXECUTION_WARRANT.TITLE_EXECUTION_DETAIL';
      }
    }
    this.initPermission();
    this.initActionBar();
    this.setUpTabRoutering();
    if (this.tabIndex === 0) this.onRouterLink(this.tabsInfo[0]);
  }

  initPermission() {
    this.accessPermissions = this.sessionService.accessPermissions();
    this.hasSubmitPermission = this.sessionService.hasPermissionByTaskCode(this.taskCode);
  }

  initActionBar() {
    const isOwnerTask = this.sessionService.isOwnerTask(
      this.taskService.taskOwner,
      this.taskService.taskDetail.enableTaskSupportRole
    );
    const isEditor = ['APPROVER', 'MAKER'].includes(this.accessPermissions.subRoleCode);
    if (this.mode === 'EDIT' && isOwnerTask && isEditor && this.hasSubmitPermission) {
      if (this.taskCode === taskCode.R2E04_02_2A) {
        this.actionBar.hasPrimary = true;
        this.actionBar.primaryText = 'COMMON.BUTTON_COMPLETE';
      } else if (this.taskCode === taskCode.R2E04_01_2B) {
        this.actionBar.hasSave = true;
        this.actionBar.saveText = 'COMMON.BUTTON_SAVE';
        this.actionBar.hasPrimary = true;
        this.actionBar.primaryText = 'COMMON.BUTTON_COMPLETE';
      } else if (this.taskCode === taskCode.R2E04_03_3A) {
        this.actionBar.hasPrimary = true;
        this.actionBar.primaryText = 'COMMON.BUTTON_COMPLETE';
      } else {
        this.actionBar = { hasCancel: false, hasReject: false, hasPrimary: false, hasSave: false };
      }
    } else {
      // mode as VIEW or other conditions
      this.actionBar = { hasCancel: false, hasReject: false, hasPrimary: false, hasSave: false };
    }
  }

  setUpTabRoutering() {
    this.executionWarrantService.executionWarrantTabs = (EXECUTION_WARRANT_TABS as ITabNav[]).map(item => {
      const _prefix = this.routerService.currentRoute.split('/');
      const _prefixPath = `/${_prefix[1]}/${_prefix[2]}/execution-warrant`;
      item.prefix = _prefixPath;
      item.fullPath = _prefixPath + '/' + item.path;
      return item;
    });
    this.tabsInfo = this.executionWarrantService.executionWarrantTabs;
  }

  onRouterLink(item: ITabNav) {
    this.tabIndex = item.index;
    this.routerService.navigateTo(item.fullPath, {
      mode: this.mode,
      litigationCaseId: this.litigationCaseId,
      writOfExecDebtType: this.writOfExecDebtType,
      isPreparingTab: this.route.snapshot.queryParams['isPreparingTab'],
      isWarrantTab: this.route.snapshot.queryParams['isWarrantTab'],
    });
  }

  validateLawyerForm() {
    const ctrl = this.executionWarrantService.lawyerForm;
    const legalExecutionLawyerId = this.litigationCaseService.litigationCaseShortDetail.legalExecutionLawyerId || '';
    const ctrlLegalExecutionLawyerId = ctrl.get('legalExecutionLawyerId')?.value || '';
    if (ctrl.invalid || ctrl.touched) {
      if (ctrlLegalExecutionLawyerId !== '' && this.isSaved) {
        return false;
      }
      return ctrlLegalExecutionLawyerId !== legalExecutionLawyerId;
    }
    return false;
  }

  async canDeactivate() {
    const isValidateLawyerForm = this.validateLawyerForm();
    if (isValidateLawyerForm) {
      if (await this.sessionService.confirmExitWithoutSave()) {
        return true;
      } else {
        // reverse url stack
        this.routerService.currentStack.push(this.routerService.nextUrl);
        return false;
      }
    } else {
      return true;
    }
  }

  async onBack() {
    this.routerService.back();
  }

  async onSave() {
    if (this.taskCode === taskCode.R2E04_01_2B) {
      const rawValue = this.executionWarrantService.lawyerForm.getRawValue();
      const request: ExecutionTaskSubmitRequest = {
        headerFlag: 'DRAFT',
        legalExecutionLawyerId: rawValue.legalExecutionLawyerId,
      };
      await this.executionWarrantService.postExecutionTaskSubmit(
        Number(this.litigationCaseId),
        Number(this.taskId),
        request
      );
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('EXECUTION_WARRANT.SNACKBAR_SAVE_SUCCESS', { LG_ID: this.litigationId })
      );
      this.isSaved = true;
    } else {
      console.log('-- onSave : else condition --');
    }
  }

  async onSubmit() {
    if (this.taskCode === taskCode.R2E04_02_2A) {
      const legalExecutionLawyerId = this.litigationCaseService.litigationCaseShortDetail.legalExecutionLawyerId;
      const request: ExecutionTaskSubmitRequest = {
        headerFlag: 'SUBMIT',
        legalExecutionLawyerId: legalExecutionLawyerId,
      };
      // Filter by imageId is not null
      const debtCal =
        this.executionWarrantService.litigationCaseDebtCalculation.documentInfo?.debtCalculationDocuments?.filter(
          (value: DocumentDto) => value.imageId
        );
      if (debtCal?.length && debtCal?.length === 0) {
        this.notificationService.alertDialog(
          'EXCEPTION_CONFIG.TITLE_ERROR_SUBMIT_TASK',
          'EXCEPTION_CONFIG.MESSAGE_ERROR_E04_DOCUMENT_NOT_COMPLETED'
        );
      } else if (!debtCal?.length) {
        this.notificationService.alertDialog(
          'EXCEPTION_CONFIG.TITLE_ERROR_SUBMIT_TASK',
          'EXCEPTION_CONFIG.MESSAGE_ERROR_APPROVE_DOCUMENT_ONLY'
        );
      } else {
        await this.executionWarrantService.postExecutionTaskSubmit(
          Number(this.litigationCaseId),
          Number(this.taskId),
          request
        );
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('EXECUTION_WARRANT.SNACKBAR_SUBMIT_DEBT_CALCULATE_SUCCESS', {
            LG_ID: this.litigationId,
          })
        );
        this.routerService.navigateTo(MAIN_ROUTES.TASK);
      }
    } else if (this.taskCode === taskCode.R2E04_01_2B) {
      const rawValue = this.executionWarrantService.lawyerForm.getRawValue();
      if (!!!rawValue.legalExecutionLawyerId) {
        return await this.notificationService.alertDialog(
          'EXCEPTION_CONFIG.TITLE_ERROR_SUBMIT_TASK',
          'EXCEPTION_CONFIG.MESSAGE_ERROR_NO_ASSIGNED_LAWYER'
        );
      }
      const request: ExecutionTaskSubmitRequest = {
        headerFlag: 'SUBMIT',
        legalExecutionLawyerId: rawValue.legalExecutionLawyerId,
      };
      await this.executionWarrantService.postExecutionTaskSubmit(
        Number(this.litigationCaseId),
        Number(this.taskId),
        request
      );
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('EXECUTION_WARRANT.SNACKBAR_SUBMIT_SUCCESS', { LG_ID: this.litigationId })
      );
      this.isSaved = true;
      this.routerService.navigateTo(MAIN_ROUTES.TASK);
    } else if (this.taskCode === taskCode.R2E04_03_3A) {
      // validate user uploaded หนังสือมอบอํานาจของทนายความ
      // validate user uploaded คำขอออกหมายบังคับคดี
      const _findSubmitRespondDate = this.recordDocsService.uplaodedDocuments.findIndex(
        item => !item.submitDate || !item.respondDate
      );
      const _everyRejectCase = this.recordDocsService.uplaodedDocuments.every(item => item.respondCode === 'R');
      if (_findSubmitRespondDate !== -1 || _everyRejectCase) {
        this.notificationService.alertDialog(
          'EXCEPTION_CONFIG.TITLE_ERROR_SUBMIT_TASK',
          _findSubmitRespondDate === 0
            ? 'EXCEPTION_CONFIG.MESSAGE_ERROR_E04_DOCUMENT_NOT_COMPLETED'
            : 'EXCEPTION_CONFIG.MESSAGE_ERROR_APPROVE_DOCUMENT_ONLY'
        );
      } else {
        const legalExecutionLawyerId = this.litigationCaseService.litigationCaseShortDetail.legalExecutionLawyerId;
        const request: ExecutionTaskSubmitRequest = {
          headerFlag: 'SUBMIT',
          legalExecutionLawyerId: legalExecutionLawyerId,
        };
        await this.executionWarrantService.postExecutionTaskSubmit(
          Number(this.litigationCaseId),
          Number(this.taskId),
          request
        );
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('EXECUTION_WARRANT.SNACKBAR_SUBMIT_PROCEED_EXECUTION_SUCCESS', {
            LG_ID: this.litigationId,
          })
        );
        this.routerService.navigateTo(MAIN_ROUTES.TASK);
      }
    } else {
      console.log('-- onSubmit : else condition --');
    }
  }
}
