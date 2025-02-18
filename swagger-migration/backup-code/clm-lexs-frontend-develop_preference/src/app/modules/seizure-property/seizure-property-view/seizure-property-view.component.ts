import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { ActionBar, FileType, ITabNav, TMode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  CompletedTitleDeedDocumentApprovalRequest,
  NonPledgePropSubmitRequest,
  PostExecutionLawyerSubmitRequest,
  PostSubmitDocumentValidationRequest,
  PostTaskSubmitRequest,
  SubmitTitleDeedDocumentApprovalRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { TitleDeedDocumentExtend } from '../seizure-document-info/seizure-document-info.constant';
import { SEIZURE_PROPERTY_TABS, NON_PLEDGE_PROPERTY_TABS } from '../seizure-property.constant';
import { SeizurePropertyService } from '../seizure-property.service';
import { SEIZURE_PROPERTY_INFO_TAB_ROUTES, SeizureCollateralTypes } from '@app/shared/constant';

@Component({
  selector: 'app-seizure-property-view',
  templateUrl: './seizure-property-view.component.html',
  styleUrls: ['./seizure-property-view.component.scss'],
})
export class SeizurePropertyViewComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  public title!: string;
  public pageIcon: string = 'icon-Task-List';
  public messageBanner!: string | undefined;
  public tabIndex = 0;
  public tabsInfo: ITabNav[] = this.seizurePropertyService.seizurePropertyTabs;
  public taskCode!: taskCode;
  public litigationCaseShortDetail!: any;
  public statusName!: string;
  public dataLawyerForm!: UntypedFormGroup;
  private litigationId!: string;
  private litigationCaseId!: string;
  private seizureId!: string;
  private isSaved: boolean = false;
  private titleMapper = new Map<taskCode, string>([
    [taskCode.R2E05_01_2D, 'SEIZURE_PROPERTY.TITLE_E05_01_2D'],
    [taskCode.R2E05_02_3C, 'SEIZURE_PROPERTY.TITLE_E05_02_3C'],
    [taskCode.R2E05_03_3D, 'SEIZURE_PROPERTY.TITLE_E05_03_3D'],
    [taskCode.R2E05_06_3F, 'SEIZURE_PROPERTY.TITLE_E05_06_3F'],
    [taskCode.R2E05_09_4, 'SEIZURE_PROPERTY.TITLE_E05_09_4'],
    [taskCode.R2E05_08_3A, 'SEIZURE_PROPERTY.TITLE_E05_08_3A'],
    [taskCode.R2E05_07_2A, 'SEIZURE_PROPERTY.TITLE_E05_07_2A'],
  ]);
  private msgBannerMapper = new Map<taskCode, string>([
    [taskCode.R2E05_01_2D, 'SEIZURE_PROPERTY.MSG_BANNER_E05_01_2D'],
    [taskCode.R2E05_02_3C, 'SEIZURE_PROPERTY.MSG_BANNER_E05_02_3C'],
    [taskCode.R2E05_03_3D, 'SEIZURE_PROPERTY.MSG_BANNER_E05_03_3D'],
    [taskCode.R2E05_06_3F, 'SEIZURE_PROPERTY.MSG_BANNER_E05_06_3F'],
    [taskCode.R2E05_09_4, 'SEIZURE_PROPERTY.MSG_BANNER_E05_09_4'],
    [taskCode.R2E05_08_3A, 'SEIZURE_PROPERTY.MSG_BANNER_E05_08_3A'],
    [taskCode.R2E05_07_2A, 'SEIZURE_PROPERTY.MSG_BANNER_E05_07_2A'],
  ]);

  public localStates = {
    legalExecutionSection: true,
    noneLegalExecutionSection: true,
    taskCode: '',
    taskStatus: '',
  };

  public actionBar: ActionBar = {
    hasSave: false,
    hasPrimary: false,
    hasCancel: false,
    hasReject: false,
  };

  get responsibleLawyerTask() {
    return [taskCode.R2E05_06_3F, taskCode.R2E05_09_4, taskCode.R2E05_08_3A].includes(
      this.localStates.taskCode as taskCode
    );
  }
  get isDimCoverPageDownload() {
    return this.seizurePropertyService.isDimCoverPageDownload;
  }

  get caseDetailsTitle() {
    return this.taskCode === taskCode.R2E05_04_4 ? 'TITLE_MSG.SEIZURE_PROPERTY_DETAIL' : 'TITLE_MSG.CASE_DETAIL';
  }

  get isNonPledProperties() {
    return (
      [taskCode.R2E05_08_3A, taskCode.R2E05_07_2A, taskCode.R2E05_09_4].includes(this.taskCode) ||
      this.router.snapshot.data['seizureProperty']['seizurePageType'] === SeizureCollateralTypes.NON_PLEDGE
    );
  }

  get mode() {
    // set mode VIEW / EDIT with condition routing from which menu
    if (this.routerService.navigateFormTaskMenu) {
      // form task menu
      if (this.router.snapshot.data['seizureProperty']['mode'] === 'VIEW') {
        // form task menu >> not assignee
        return 'VIEW';
      }
      return 'EDIT';
    } else {
      // form litigation menu or other conditions
      if (this.seizurePropertyService.mode === 'EDIT') {
        return 'EDIT';
      }
      return 'VIEW';
    }
  }

  get caseDetailHidelawyer() {
    if (this.mode === 'VIEW') {
      return this.seizurePropertyService.hasHidelawyer;
    } else {
      return [
        taskCode.R2E05_01_2D,
        taskCode.R2E05_02_3C,
        taskCode.R2E05_03_3D,
        taskCode.R2E05_06_3F,
        taskCode.R2E05_09_4,
        taskCode.R2E05_07_2A,
        taskCode.R2E05_08_3A,
      ].includes(this.taskCode);
    }
  }

  taskId!: number;

  responsibleLawyerMode: TMode = '' as TMode;

  constructor(
    private routerService: RouterService,
    private translate: TranslateService,
    private taskService: TaskService,
    private router: ActivatedRoute,
    private sessionService: SessionService,
    private notificationService: NotificationService,
    private litigationCaseService: LitigationCaseService,
    private seizurePropertyService: SeizurePropertyService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.responsibleLawyerMode = this.mode;
    this.getStates();
    if (this.mode === 'EDIT') this.initActionBar();
    this.initIconBar();
    this.initTitleMsgBar();
    this.setUpTabRoutering();
    this.getLitigationShortCase();
    this.handleTabIndex();
    this.responsibleLawyerTask && this.getDataLawyerForm();
  }

  initIconBar() {
    if (this.mode !== 'VIEW' || (this.mode === 'VIEW' && this.taskCode)) {
      this.pageIcon = 'icon-Task-List';
    } else {
      this.pageIcon = 'icon-Asset-nobg';
    }
  }

  getDataLawyerForm() {
    this.dataLawyerForm = this.seizurePropertyService.lawyerForm;
    if (this.taskCode === taskCode.R2E05_08_3A) {
      this.dataLawyerForm.get('legalExecutionLawyerId')?.clearValidators();
      if (this.seizurePropertyService?.seizureDTO?.isFirstTimeSeizureFlag) {
        this.responsibleLawyerMode = 'VIEW';
      } else {
        this.responsibleLawyerMode = this.mode;
      }
    } else if (this.taskCode === taskCode.R2E05_09_4) {
      this.dataLawyerForm.get('legalExecutionLawyerId')?.clearValidators();
      this.dataLawyerForm
        .get('legalExecutionLawyerId')
        ?.setValue(this.seizurePropertyService?.seizureDTO?.recommendLawyerId || '');
    } else {
      this.dataLawyerForm.get('legalExecutionLawyerId')?.setValidators(Validators.required);
    }
    this.dataLawyerForm.get('legalExecutionLawyerId')?.updateValueAndValidity();
  }

  get seizurePropertyMode() {
    return this.seizurePropertyService.mode;
  }

  setUpTabRoutering() {
    if (this.isNonPledProperties) {
      this.tabsInfo = this.seizurePropertyService.seizurePropertyTabs = <ITabNav[]>NON_PLEDGE_PROPERTY_TABS.map(
        item => {
          item.prefix = this.routerService.navigateFormTaskMenu
            ? `/main/task/seizure-property/non-pledge`
            : `/main/lawsuit/seizure-property/non-pledge`;
          item.fullPath = item.prefix + '/' + item.path;
          return item;
        }
      );
    } else {
      this.tabsInfo = this.seizurePropertyService.seizurePropertyTabs = <ITabNav[]>SEIZURE_PROPERTY_TABS.map(item => {
        item.prefix = this.routerService.navigateFormTaskMenu
          ? `/main/task/seizure-property/command`
          : `/main/lawsuit/seizure-property/command`;
        item.fullPath = item.prefix + '/' + item.path;
        return item;
      });
    }
  }

  initTitleMsgBar() {
    if (this.mode === 'EDIT' && !this.taskCode) {
      this.title = this.isNonPledProperties ? 'SEIZURE_PROPERTY.TITLE_NON_PLEDGE' : 'SEIZURE_PROPERTY.TITLE';
      this.messageBanner = 'SEIZURE_PROPERTY.MSG_BANNER_E05_07_2A';
    } else {
      this.title = this.titleMapper.get(this.taskCode) || '';
      if (!this.title) {
        this.title = this.isNonPledProperties ? 'SEIZURE_PROPERTY.TITLE_NON_PLEDGE' : 'SEIZURE_PROPERTY.TITLE';
      }
      this.messageBanner = this.msgBannerMapper.get(this.taskCode);
    }
  }

  handleTabIndex() {
    this.subs.add(
      this.router.queryParams.subscribe(value => {
        this.tabIndex = value['_underSubIndex'] >= 0 ? value['_underSubIndex'] : 0;
        this.onRouterLink(this.tabsInfo[this.tabIndex]);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getStates() {
    const { statusCode, taskCode } = this.taskService.taskDetail;
    this.localStates.taskStatus = statusCode || '';
    this.localStates.taskCode = taskCode || '';
    this.taskCode = taskCode as taskCode;
    this.statusName = this.taskService.taskDetail.statusName || '';
    this.litigationId =
      this.taskService.taskDetail.litigationId || this.router.snapshot.queryParams['litigationId'] || '';
    this.litigationCaseId =
      this.taskService.taskDetail.litigationCaseId || this.router.snapshot.queryParams['litigationCaseId'] || '';
    this.seizureId = this.taskService.taskDetail.objectId || '';
    this.taskId = this.taskService.taskDetail?.id || -1;
  }

  clearData() {
    if (this.routerService.nextUrl.indexOf('/seizure-property/') > -1) return;
    this.litigationCaseService.listCollaterals = [];
    this.seizurePropertyService.documentsTitleDeed = [];
    this.seizurePropertyService.seizureDocumentsTitleDeed = [];
    this.seizurePropertyService.hasEdit = false;
    this.seizurePropertyService.hasTaskSubmit = false;
    this.seizurePropertyService.mode = '';
    this.documentService.clearData();
    this.seizurePropertyService.excessDocuments = [];
    this.taskService.clearData();
    this.seizurePropertyService.selection.clear();
  }

  async canDeactivate() {
    const isValidateLawyerForm = this.validateLawyerForm();
    if (isValidateLawyerForm || this.seizurePropertyService.hasEdit) {
      const res = await this.sessionService.confirmExitWithoutSave();
      if (res) {
        this.clearData();
        return true;
      } else {
        this.routerService.currentStack.push(this.routerService.nextUrl);
        return false;
      }
    } else {
      this.clearData();
      return true;
    }
  }

  validateLawyerForm() {
    const ctrl = this.seizurePropertyService.lawyerForm;
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

  getLitigationShortCase() {
    this.litigationCaseShortDetail = this.litigationCaseService.litigationCaseShortDetail;
  }

  onRouterLink(item: ITabNav) {
    const mainPath = this.isNonPledProperties
      ? `/${this.routerService.findRootMenu(this.routerService.currentRoute)}/seizure-property/non-pledge`
      : `/${this.routerService.findRootMenu(this.routerService.currentRoute)}/seizure-property/command`;
    const params = this.routerService.paramMapp.get(mainPath);
    this.tabIndex = item.index;
    this.routerService.navigateTo(item.fullPath, { ...params });
  }

  async onBack(event?: any) {
    switch (this.taskCode) {
      case taskCode.R2E05_08_3A:
        if (this.dataLawyerForm.touched) {
          const _confirm = await this.sessionService.confirmExitWithoutSave();
          _confirm && this.back();
        } else {
          this.back();
        }
        break;

      default:
        this.back();
        break;
    }
  }

  back() {
    const fromCaseDetailScreen = this.routerService.previousUrl.indexOf('lawsuit') > -1;
    if (fromCaseDetailScreen) {
      // Navigate with full path to make tabs working.
      // There's issue with routerService.back() to work with tab.
      return this.routerService.navigateTo(SEIZURE_PROPERTY_INFO_TAB_ROUTES.ORDER_INFO_TAB, {
        litigationId: this.litigationId,
      });
    }

    return this.routerService.back();
  }

  async onSave() {
    if (!this.taskCode && !this.isNonPledProperties) {
      if (this.seizurePropertyService.mode === 'EDIT') {
        await this.callSaveR2E05_01_2D();
      }
    } else if (!this.taskCode && this.isNonPledProperties) {
      if (this.seizurePropertyService.mode === 'EDIT') {
        await this.callSaveDraftR2E05_01_2D();
      }
    } else {
      switch (this.taskCode) {
        case taskCode.R2E05_01_2D:
          await this.callSaveR2E05_01_2D();
          break;
        case taskCode.R2E05_02_3C:
          let HeaderFlagEnum = SubmitTitleDeedDocumentApprovalRequest.HeaderFlagEnum;
          let headerFlag = HeaderFlagEnum.Draft;
          let ret = await this.seizurePropertyService.validateTitleDeedApprove(
            this.seizurePropertyService.seizureDocumentsTitleDeed,
            headerFlag
          );
          if (ret?.sucesss) {
            let flag = ret.type === 'DRAFT_PARTIAL' ? HeaderFlagEnum.Submit : HeaderFlagEnum.Draft;
            let docRequest = this.seizurePropertyService.getSubmitTitleDeedDocumentApprovalRequest(
              this.seizurePropertyService.seizureDocumentsTitleDeed,
              flag
            );
            await this.seizurePropertyService.submitTitleDeedDocumentApproval(this.seizureId, docRequest);

            if (ret?.type === 'DRAFT') {
              this.notificationService.openSnackbarSuccess(
                this.translate.instant('SEIZURE_PROPERTY.SNACKBAR_SAVE_DRAFT_SUCCESS', { LG_ID: this.litigationId })
              );
            } else {
              this.notificationService.openSnackbarSuccess(
                this.translate.instant('SEIZURE_PROPERTY.SNACKBAR_SAVE_SUCCESS_PARTIAL', { LG_ID: this.litigationId })
              );
              let list = this.seizurePropertyService.seizureDocumentsTitleDeed?.filter(
                (f: TitleDeedDocumentExtend) => f?.sendMethod === 'AMD_MANUAL' || f?.sendMethod === 'TRIGGER_DIMS'
              );
              let allDims = list.every(f => f?.approvedStatus === false && f?.sendMethod === 'TRIGGER_DIMS');
              if (allDims) {
                const acknow = await this.notificationService.alertDialog(
                  'ระบบจะเริ่มดำเนินการนับ SLA ใหม่',
                  'เนื่องจากเอกสารที่ปฏิเสธทั้งหมดอยู่ที่ระบบ DIMs'
                );
                if (acknow) {
                  this.notificationService.openSnackbarSuccess(
                    this.translate.instant('SEIZURE_PROPERTY.SNACKBAR_SAVE_SUCCESS', { LG_ID: this.litigationId })
                  );
                }
              }
              await this.seizurePropertyService.setSeizureDocumentsTitleDeed(true);
              this.seizurePropertyService.setTimeStamp();
            }
            this.seizurePropertyService.hasEdit = false;
          }

          break;
        case taskCode.R2E05_03_3D:
          let docRequest = this.seizurePropertyService.getSubmitTitleDeedDocumentApprovalRequest(
            this.seizurePropertyService.seizureDocumentsTitleDeed,
            SubmitTitleDeedDocumentApprovalRequest.HeaderFlagEnum.Draft
          );
          await this.seizurePropertyService.amdResubmit(Number(this.seizureId), docRequest);
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('SEIZURE_PROPERTY.SNACKBAR_SAVE_DRAFT_SUCCESS', { LG_ID: this.litigationId })
          );
          this.seizurePropertyService.hasEdit = false;
          break;
        case taskCode.R2E05_06_3F:
          const rawValue = this.dataLawyerForm.getRawValue();
          const request: PostExecutionLawyerSubmitRequest = {
            headerFlag: 'DRAFT',
            lawyerId: rawValue.legalExecutionLawyerId,
          };
          await this.seizurePropertyService.postExecutionLawyerSubmit(Number(this.seizureId), request);
          this.notificationService.openSnackbarSuccess(
            this.translate.instant(`เลขที่กฎหมาย: ${this.litigationId} บันทึกสำเร็จแล้ว`)
          );
          this.seizurePropertyService.hasEdit = false;
          this.isSaved = true;
          this.onBack();
          break;
        case taskCode.R2E05_07_2A:
          await this.callSaveR2E05_07_2A('DRAFT');
          break;
        default:
          console.log('-- onSave : else condition --');
          break;
      }
    }
  }

  async onSubmit() {
    // TODO: pallop currentStack problem
    if (!this.taskCode && !this.isNonPledProperties) {
      if (this.seizurePropertyService.mode === 'EDIT') {
        await this.callSubmitR2E05_01_2D();
      }
    } else if (!this.taskCode && this.isNonPledProperties) {
      if (this.seizurePropertyService.mode === 'EDIT') {
        await this.callSubmitNonPledgeProperty();
      }
    } else {
      switch (this.taskCode) {
        case taskCode.R2E05_01_2D:
          await this.callSubmitR2E05_01_2D();
          break;
        case taskCode.R2E05_02_3C:
          let res = await this.seizurePropertyService.validateTitleDeedApprove(
            this.seizurePropertyService.seizureDocumentsTitleDeed,
            SubmitTitleDeedDocumentApprovalRequest.HeaderFlagEnum.Submit
          );
          if (res.sucesss) {
            let doc = this.seizurePropertyService.getSubmitTitleDeedDocumentApprovalRequest(
              this.seizurePropertyService.seizureDocumentsTitleDeed,
              SubmitTitleDeedDocumentApprovalRequest.HeaderFlagEnum.Submit
            );
            const requestA: CompletedTitleDeedDocumentApprovalRequest = {
              documents: doc.documents,
            };
            await this.seizurePropertyService.completedTitleDeedDocumentApproval(this.seizureId, requestA);
            this.notificationService.openSnackbarSuccess(
              this.translate.instant('SEIZURE_PROPERTY.SNACKBAR_SAVE_SUCCESS', {
                LG_ID: this.litigationId,
              })
            );
            this.seizurePropertyService.hasEdit = false;
            this.onBack();
          }

          break;
        case taskCode.R2E05_06_3F:
          const rawValue = this.dataLawyerForm.getRawValue();
          if (!!!rawValue.legalExecutionLawyerId) {
            return await this.notificationService.alertDialog(
              'EXCEPTION_CONFIG.TITLE_ERROR_SUBMIT_TASK',
              'EXCEPTION_CONFIG.MESSAGE_ERROR_NO_ASSIGNED_LAWYER'
            );
          }
          const request: PostExecutionLawyerSubmitRequest = {
            headerFlag: 'SUBMIT',
            lawyerId: rawValue.legalExecutionLawyerId,
          };
          await this.seizurePropertyService.postExecutionLawyerSubmit(Number(this.seizureId), request);
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('EXECUTION_WARRANT.SNACKBAR_ASSIGN_LAWYER_EW_SUCCESS', {
              LG_ID: this.litigationId,
            })
          );
          this.seizurePropertyService.hasEdit = false;
          this.isSaved = true;
          this.onBack();
          break;
        case taskCode.R2E05_03_3D:
          let valid = await this.seizurePropertyService.validateTitleDeed(
            this.seizurePropertyService.seizureDocumentsTitleDeed,
            true
          );
          if (valid) {
            let docRequest = this.seizurePropertyService.getSubmitTitleDeedDocumentApprovalRequest(
              this.seizurePropertyService.seizureDocumentsTitleDeed,
              SubmitTitleDeedDocumentApprovalRequest.HeaderFlagEnum.Submit
            );
            await this.seizurePropertyService.amdResubmit(Number(this.seizureId), docRequest);
            this.notificationService.openSnackbarSuccess(
              this.translate.instant('SEIZURE_PROPERTY.SNACKBAR_AMD_RESUBMIT_SUCCESS', { LG_ID: this.litigationId })
            );
            this.seizurePropertyService.hasEdit = false;
            this.isSaved = true;
            this.onBack();
          }
          break;
        case taskCode.R2E05_09_4:
          const dataLawyer = this.dataLawyerForm.getRawValue();
          if (!!!dataLawyer.legalExecutionLawyerId) {
            return await this.notificationService.alertDialog(
              'EXCEPTION_CONFIG.TITLE_ERROR_SUBMIT_TASK',
              'EXCEPTION_CONFIG.MESSAGE_ERROR_NO_ASSIGNED_LAWYER'
            );
          }
          const reqLawyerSubmit: PostExecutionLawyerSubmitRequest = {
            headerFlag: 'SUBMIT',
            lawyerId: dataLawyer.legalExecutionLawyerId,
          };
          await this.seizurePropertyService.postExecutionLawyerSubmit(Number(this.seizureId), reqLawyerSubmit);
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('EXECUTION_WARRANT.SNACKBAR_ASSIGN_LAWYER_EW_SUCCESS', {
              LG_ID: this.litigationId,
            })
          );
          this.seizurePropertyService.hasEdit = false;
          this.isSaved = true;
          this.onBack();
          break;
        case taskCode.R2E05_07_2A:
          await this.callSaveR2E05_07_2A('SUBMIT');

          break;
        case taskCode.R2E05_08_3A:
          this.submitNonPledgeAssignLawyer();
          break;
        default:
          console.log('-- onSubmit : else condition --');
          break;
      }
    }
  }

  private async callSaveR2E05_07_2A(header: 'DRAFT' | 'SUBMIT') {
    if (header === 'SUBMIT' && this.litigationCaseService.listCollaterals?.length <= 0) {
      // TODO: pallop check draft also validate min > 0 or not.
      return await this.notificationService.alertDialog(
        'ไม่สามารถเสร็จสิ้นงานได้',
        'กรุณาเลือกทรัพย์เพื่อสั่งการยึดทรัพย์ อย่างน้อย 1 รายการ'
      );
    }

    let nonPledgeRequest: NonPledgePropSubmitRequest = {
      headerFlag: header,
      assetIdList: this.litigationCaseService.listCollaterals || [],
    };
    if (this.taskId > 0) {
      nonPledgeRequest = { ...nonPledgeRequest, taskId: this.taskId };
    }
    await this.seizurePropertyService.submitNonPledgeProperties(Number(this.litigationCaseId), nonPledgeRequest);
    this.seizurePropertyService.hasEdit = false;
    this.notificationService.openSnackbarSuccess(
      this.translate.instant(
        header === 'DRAFT' ? 'SEIZURE_PROPERTY.SNACKBAR_SAVE_DRAFT_SUCCESS' : 'SEIZURE_PROPERTY.SNACKBAR_SAVE_SUCCESS',
        {
          LG_ID: this.litigationId,
        }
      )
    );
    this.seizurePropertyService.hasEdit = false;
    if (header === 'SUBMIT') {
      this.onBack();
    }
  }

  async callSubmitR2E05_01_2D() {
    if (await this.seizurePropertyService.validateTitleDeed(this.seizurePropertyService.documentsTitleDeed, false)) {
      let realReq = this.seizurePropertyService.getPostTaskSubmitRequest(
        this.seizurePropertyService.documentsTitleDeed
      );
      const request: PostTaskSubmitRequest = {
        documents: realReq?.documents,
        collateralIdList: this.litigationCaseService.listCollaterals,
        header: 'SUBMIT',
      };
      await this.seizurePropertyService.postTaskSubmit(Number(this.litigationCaseId), request);
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('SEIZURE_PROPERTY.SNACKBAR_AMD_SUBMIT_SUCCESS', { LG_ID: this.litigationId })
      );
      this.seizurePropertyService.hasEdit = false;
      this.onBack();
    }
  }

  async callSubmitNonPledgeProperty() {
    if (await this.seizurePropertyService.validateTitleDeed(this.seizurePropertyService.documentsTitleDeed, false)) {
      if (this.seizurePropertyService.seizureDTO && this.seizurePropertyService.seizureDTO.assets) {
        const request: NonPledgePropSubmitRequest = {
          assetIdList: this.litigationCaseService.listCollaterals,
          taskId: this.taskService.taskDetail.id || 0,
          headerFlag: 'SUBMIT',
        };
        await this.seizurePropertyService.submitNonPledgeProperties(Number(this.litigationCaseId), request);
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('SEIZURE_PROPERTY.SNACKBAR_AMD_SUBMIT_SUCCESS', { LG_ID: this.litigationId })
        );
        this.seizurePropertyService.hasEdit = false;
        this.onBack();
      } else {
        console.error('callSubmitR2E05_01_2D error');
      }
    }
  }

  async callSaveDraftR2E05_01_2D() {
    const request: NonPledgePropSubmitRequest = {
      assetIdList: this.litigationCaseService.listCollaterals,
      taskId: this.taskService.taskDetail.id || 0,
      headerFlag: 'DRAFT',
    };
    await this.seizurePropertyService.submitNonPledgeProperties(Number(this.litigationCaseId), request);
    this.notificationService.openSnackbarSuccess(
      this.translate.instant('SEIZURE_PROPERTY.SNACKBAR_SAVE_DRAFT_SUCCESS', { LG_ID: this.litigationId })
    );
    this.seizurePropertyService.hasEdit = false;
  }

  async callSaveR2E05_01_2D() {
    let realReq = this.seizurePropertyService.getPostTaskSubmitRequest(this.seizurePropertyService.documentsTitleDeed);
    const request: PostTaskSubmitRequest = {
      documents: realReq?.documents,
      collateralIdList: this.litigationCaseService.listCollaterals,
      header: 'DRAFT',
    };
    await this.seizurePropertyService.postTaskSubmit(Number(this.litigationCaseId), request);
    this.notificationService.openSnackbarSuccess(
      this.translate.instant('SEIZURE_PROPERTY.SNACKBAR_SAVE_DRAFT_SUCCESS', { LG_ID: this.litigationId })
    );
    this.seizurePropertyService.hasEdit = false;
  }

  initActionBar() {
    switch (this.taskCode) {
      case taskCode.R2E05_06_3F:
        this.actionBar = {
          ...this.actionBar,
          ...{
            hasSave: true,
            saveText: 'COMMON.BUTTON_SAVE',
            hasPrimary: true,
            primaryText: 'COMMON.BUTTON_FINISH',
          },
        };
        break;
      case taskCode.R2E05_01_2D:
        this.actionBar = {
          ...this.actionBar,
          hasSave: true,
          saveText: 'COMMON.BUTTON_SAVE',
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_FINISH',
        };
        break;
      case taskCode.R2E05_09_4:
        this.actionBar = {
          ...this.actionBar,
          hasSave: false,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_FINISH',
        };
        break;
      case taskCode.R2E05_08_3A:
        this.actionBar = {
          ...this.actionBar,
          hasSave: false,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_FINISH',
        };
        break;
      default:
        if (this.mode === 'EDIT' || this.seizurePropertyService.mode === 'EDIT') {
          this.actionBar = {
            ...this.actionBar,
            ...{
              hasSave: true,
              saveText: 'COMMON.BUTTON_SAVE',
              hasPrimary: true,
              primaryText: 'COMMON.BUTTON_FINISH',
            },
          };
        }

        break;
    }
  }

  async onClickDownloadCopy() {
    let fileName = 'ใบนำส่งเอกสารคืนธนาคาร';
    const response: any = await this.seizurePropertyService.downloadKtbLogisticDoc(Number(this.seizureId));
    if (!response) return;
    this.documentService.downloadDocumentFromByteArray(response, fileName, FileType.PDF);
  }

  private async submitNonPledgeAssignLawyer() {
    this.dataLawyerForm.markAllAsTouched();
    if (this.dataLawyerForm.valid) {
      const request: PostSubmitDocumentValidationRequest = {
        recommendLawyerId: this.dataLawyerForm?.value?.legalExecutionLawyerId,
      };
      await this.seizurePropertyService.seizureDocumentValidationSubmit(Number(this.seizureId), request);
      this.notificationService.openSnackbarSuccess(
        `เลขที่กฎหมาย: ${this.litigationId} ตรวจสอบเอกสารและแนะนำทนายความ สำเร็จแล้ว`
      );
      this.dataLawyerForm.markAsUntouched();
      this.seizurePropertyService.hasEdit = false;
      this.onBack();
    }
  }
}
