import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SubButtonModel } from '@app/shared/components/action-bar/action-bar.component';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { IMessageBanner } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils/util';
import {
  DefermentCancelRequest,
  DefermentCollateralInquiryDto,
  DefermentDto,
  DefermentExecCancelRequest,
  DefermentExecDto,
  DefermentExecItem,
  DefermentInfo,
  DefermentItem,
  DefermentLitigationInfo,
  DocumentDto,
  InquiryDefermentExecRequest,
  InquiryDefermentRequest,
  LitigationDetailDto,
  SaveDefermentExecRequest,
  SaveDefermentExecResponse,
  SaveDefermentRequest,
  SaveDefermentResponse,
} from '@lexs/lexs-client';
import { LawsuitService } from '@modules/lawsuit/lawsuit.service';
import { TranslateService } from '@ngx-translate/core';
import { RouterService } from '@shared/services/router.service';
import { SessionService } from '@shared/services/session.service';
import { BuddhistEraPipe } from '@spig/core';
import { SubSink } from 'subsink';
import { TaskService } from '../task/services/task.service';
import { defermentState } from './deferment.model';
import { DefermentService } from './deferment.service';
import { DOC_TEMPLATE } from '@app/shared/constant';
@Component({
  selector: 'app-deferment',
  templateUrl: './deferment.component.html',
  styleUrls: ['./deferment.component.scss'],
  providers: [BuddhistEraPipe],
})
export class DefermentComponent implements OnInit, OnDestroy {
  @Input() taskId!: number;

  constructor(
    private lawsuitService: LawsuitService,
    private sessionService: SessionService,
    private documentService: DocumentService,
    private routerService: RouterService,
    private defermentService: DefermentService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private buddhistEraPipe: BuddhistEraPipe,
    private taskService: TaskService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private logger: LoggerService
  ) {
    this.subs.add(
      this.route.queryParams.subscribe(value => (this._btnAction = value['_btnAction'] || value['btnAction'])),
      this.route.queryParams.subscribe(
        value => (this.hasCeased = value['hasCeased'] === true || value['hasCeased'] === 'true')
      ),
      this.route.queryParams.subscribe(value => (this.defermentCategory = value['defermentCategory'])),
      this.route.queryParams.subscribe(value => (this.hasDetail = value['hasDetail'] === 'true')),
      this.route.queryParams.subscribe(value => (this.hasLGID = value['hasLGID'])),
      this.route.queryParams.subscribe(value => (this.mode = value['modeFromBtn'])),
      this.route.queryParams.subscribe(value => (this.litigationId = value['litigationId'])),
      this.route.queryParams.subscribe(value => (this.isDetailView = value['isDetailView'] === 'true')),
      this.route.queryParams.subscribe(value => (this.state = value['state'] || 'MAIN')),
      this.route.queryParams.subscribe(value => {
        if (value['taskId']) this.taskId = value['taskId'];
        this.isExecActive = value['isExecActive'] === 'true';
      })
    );
    this.hasCeased = (this.hasCeased && this.hasCeased === 'true' ? true : this.hasCeased) || false;
  }

  private RESPONSE_UNIT_TYPE_ENUM = DefermentItem.ResponseUnitTypeEnum;
  private defermentType = DefermentInfo.DefermentTypeEnum;
  public dataForm!: UntypedFormGroup;
  public litigationId = '';
  public defermentMsgBanner = '';
  public defermentTypeBanner = '';
  public defermentState: defermentState = 'NORMAL';
  public defermentStateEnum = defermentState;
  public cessationMsgBanner = '';
  public cessationTypeBanner = '';
  public cessationMessageBanner: IMessageBanner = { type: '', message: '' };
  public cessationState: defermentState = 'NORMAL';
  public actionBar!: any;
  public hasCancelDeferment: boolean = false;
  public hasExtendDeferment: boolean = false;
  public hasCeased!: any;
  public hasDetail!: any;
  public hasLGID!: any;
  public isExecution: boolean = false;
  public defermentCategory: 'EXECUTION' | 'PROSECUTE' = 'PROSECUTE';
  public dataTable: Array<any> = [];
  public defermentMessageBanner: IMessageBanner = { type: '', message: '' };
  public isEditcancel!: boolean;
  public isViewMode: boolean = false;
  public documentUpload: Array<any> = [];
  public contractList = [DOC_TEMPLATE.LEXSD016];
  public subButtonList: Array<SubButtonModel> = [];
  public currentLitigation = this.lawsuitService?.currentLitigation;
  public hasSufficientDoc: boolean = true;
  public hasCancelCessation: boolean = false;
  public _btnAction!: string;
  public mode!: InquiryDefermentRequest.ModeEnum;
  private subs = new SubSink();
  public isDetailView: boolean = false;
  public defermentExecType = ['DEFERMENT_EXEC_SALE', 'DEFERMENT_EXEC_SEIZURE', 'DEFERMENT_EXEC_SEIZURE_SALE'];
  public defermentStatus!: LitigationDetailDto.DefermentStatusEnum | undefined;
  public defermentTaskStatusEnum = DefermentInfo.DefermentTaskStatusEnum;
  public canExtend: boolean = false;
  public defermentTaskStatus = this.defermentService?.deferment?.deferment?.defermentTaskStatus;
  title: string = '';
  public readOnlyDocuments = [];
  public hideTabFlag = false; // for check tab approve, history on deferment detail
  public isBackFromHistory = false;
  public state: 'INITIAL' | 'MAIN' = 'MAIN';
  public isExecActive = false;

  async ngOnInit(): Promise<void> {
    // init data
    this.documentService.customer = this.lawsuitService?.currentLitigation;
    const res = this.defermentService.olddata('', false);
    if (res != undefined && res != 'undefined' && res != '' && Object.keys(res).length > 0) {
      this.dataForm = this.defermentService.generateDefermentForm(res, this.hasCeased);
      this.documentUpload = this.defermentService.formatDocs(res?.documents as DocumentDto[], this.isViewMode);
      this.defermentService.olddata('', true);
    } else {
      this.dataForm = this.defermentService.generateDefermentForm(
        this.defermentService.deferment.deferment,
        this.hasCeased
      );
      this.documentUpload = this.defermentService.formatDocs(
        this.defermentService?.deferment?.deferment?.documents,
        this.isViewMode
      );
    }

    this.litigationId = this.lawsuitService.currentLitigation.litigationId || this.litigationId;
    this.isExecution = this.defermentCategory === 'EXECUTION';
    this.defermentStatus = this.lawsuitService.currentLitigation.defermentStatus;
    if (this.defermentService.selectedCollateralFlag) {
      this.state = 'MAIN';
    }
    // init deferment banner
    this.initDefermentMsgBanner();
    this.initActionBar();
    this.initViewMode();
    this.initTitle();
  }
  initDoc() {
    if (this.isExecution) {
      let item = this.defermentService?.deferment?.deferment as any;
      this.readOnlyDocuments = this.defermentService.formatDocs(item?.readOnlyDocuments, false, true) as any;
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initTitle() {
    if (this.isExecution && !this.hasCancelDeferment) {
      if (!this.hasExtendDeferment) {
        if (this.mode === 'ADD' || (this.mode == 'EDIT' && this.defermentTaskStatus)) {
          this.title = 'LAWSUIT.DEFERMENT.SAVE_EXECUTION_DEFERMENT';
        } else {
          this.title = 'LAWSUIT.DEFERMENT.EXECUTION_DEFERMENT_DETAIL';
        }
      } else {
        this.title = 'LAWSUIT.DEFERMENT.EXECUTION_DEFERMENT_CASE';
      }
    }
  }

  async onBack(event: any) {
    if (this.hasDetail) {
      this.routerService.back();
    } else {
      this.documentService.clearUploadedFiles();
      if (!this.dataForm.dirty) {
        this.defermentService.deferment = {};
        this.routerService.back();
      } else {
        const _confirm = await this.sessionService.confirmExitWithoutSave();
        if (!_confirm) return;
        this.defermentService.deferment = {};
        this.routerService.back();
      }
    }
    // restore deferment
    if (
      (this.routerService.currentRoute.includes('/main/lawsuit/deferment/defer/main') ||
        this.routerService.currentRoute.includes('/main/lawsuit/deferment/defer/debt-summary')) &&
      !this.routerService.nextUrl.includes('/main/lawsuit/deferment/defer?') &&
      !this.routerService.nextUrl.includes('/main/lawsuit/detail?')
    ) {
      const paramTemp = this.defermentService.paramTemp;
      this.litigationId = !!this.litigationId ? this.litigationId : paramTemp.litigationId;
      const mode = paramTemp?.modeFromBtn ? paramTemp?.modeFromBtn : InquiryDefermentRequest.ModeEnum.View;
      if (this.isExecution) {
        this.mode = mode;
        if (
          !this.defermentService.selectedCollateralFlag &&
          (!this.defermentService.selectedSeizureProperties ||
            this.defermentService.selectedSeizureProperties?.length === 0) &&
          (!this.defermentService.selectedCollateralSets || this.defermentService.selectedCollateralSets?.length === 0)
        ) {
          this.state = 'INITIAL';
        }
      }
      const execReq: InquiryDefermentExecRequest = {
        customerId: this.lawsuitService.currentLitigation.customerId || '',
        defermentId: paramTemp.defermentId || '',
        defermentType:
          paramTemp.defermentType === 'CESSATION'
            ? this.defermentType.Cessation
            : this.isExecution
              ? (paramTemp.defermentType as DefermentInfo.DefermentTypeEnum) ||
                this.defermentService.defaultDefermentExecType
              : this.defermentType.Deferment,
        litigationId: this.litigationId,
        mode: mode,
        taskId: paramTemp.taskId ? paramTemp.taskId : undefined,
      };
      const res = this.isExecution
        ? await this.defermentService.inquiryDefermentExec(execReq)
        : await this.defermentService.inquiryDeferment(
            this.lawsuitService.currentLitigation.customerId || '',
            paramTemp.defermentId || '',
            paramTemp.defermentType === 'CESSATION'
              ? this.defermentType.Cessation
              : this.isExecution
                ? (paramTemp.defermentType as DefermentInfo.DefermentTypeEnum)
                : this.defermentType.Deferment,
            this.litigationId,
            mode,
            paramTemp.taskId ? paramTemp.taskId : undefined
          );
      this.defermentService.deferment = res;
      this.dataForm = this.defermentService.generateDefermentForm(res.deferment, this.hasCeased);
      this.documentUpload = this.defermentService.formatDocs(res.deferment?.documents, this.isViewMode);
      this.isDetailView = false;
      this.hideTabFlag = false;
      if (this.routerService.previousUrl.includes('/main/lawsuit/deferment/defer/main')) {
        this.isBackFromHistory = true;
      }
      this.litigationId = this.lawsuitService.currentLitigation.litigationId || this.litigationId;
      this.initActionBar();
    } else {
      this.defermentService.clearDataExec();
    }
  }

  initViewMode() {
    if (this.routerService.previousUrl.includes('/task')) {
      const _owner = this.taskService.taskOwner;
      // viewMode is true when not owner task AND task not approved yet.
      this.isViewMode =
        this.sessionService.isOwnerTask(_owner, this.taskService.taskDetail.enableTaskSupportRole) && true
          ? false
          : true;
    } else {
      // when submited deferment ViewMode is true
      this.isViewMode =
        this.defermentMessageBanner.message === '' && this.defermentMessageBanner.type === '' ? false : true;
    }
  }

  setDocumentToForm(isClear: boolean = false) {
    let docForm = this.getFormDocuments();
    docForm.clear();
    for (let index = 0; index < this.defermentService.documents?.length; index++) {
      const element = this.defermentService.documents[index] as any;
      let isLEXSD016 = element.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSD016;
      let onlyFlagA = isLEXSD016 ? element?.updateFlag === 'A' : true;
      if (element.active && !isClear && onlyFlagA) {
        docForm.push(this.fb.control({ ...element }));
      }
      if (isClear && !element.isSubContract) {
        let clearE = {
          active: element.active,
          documentId: element.documentId,
          documentTemplateId: element.documentTemplateId,
          documentTemplate: {
            ...element.documentTemplate,
          },
          objectId: element.objectId,
          objectType: element.objectType,
        };
        docForm.push(this.fb.control({ ...clearE }));
      }
    }
  }

  getFormDocuments() {
    return this.dataForm.get('documents') as UntypedFormArray;
  }

  async submitDeferment(headerFlag: SaveDefermentRequest.HeaderFlagEnum) {
    this.setDocumentToForm();
    let request: SaveDefermentRequest = {
      customerId: this.dataForm.getRawValue().customerId || '',
      defermentItem: this.dataForm.getRawValue(),
      defermentType: this.hasCeased
        ? SaveDefermentRequest.DefermentTypeEnum.Cessation
        : SaveDefermentRequest.DefermentTypeEnum.Deferment,
      headerFlag: headerFlag,
      taskId: this.dataForm.getRawValue().taskId || '',
    };
    return await this.defermentService.saveCustomerDeferment(request);
  }

  isDocumentValid() {
    let contracts = this.defermentService.documents.filter((it: any) =>
      this.contractList.includes(it?.documentTemplateId)
    );
    let docs = this.defermentService.documents.filter((it: any) => {
      return (
        (contracts.length > 1 && this.contractList.includes(it?.documentTemplateId) ? it.isSubContract : true) &&
        it.documentTemplate &&
        it.documentTemplate.optional === false
      );
    });
    let isDocumentValid = docs.every((doc: DocumentDto) => !!doc.imageId);
    return isDocumentValid;
  }

  async onSubmitExecution(): Promise<boolean> {
    if (
      (!this.defermentService.selectedSeizureProperties ||
        this.defermentService.selectedSeizureProperties?.length === 0) &&
      (!this.defermentService.selectedCollateralSets || this.defermentService.selectedCollateralSets?.length === 0)
    ) {
      this.notificationService.alertDialog(
        'LAWSUIT.DEFERMENT.ALERT_MESSAGE_HEADER_SELECT_COLLATERAL_SUBMIT',
        'LAWSUIT.DEFERMENT.ALERT_MESSAGE_TITLE_SELECT_COLLATERAL_SUBMIT'
      );
      return false;
    }
    if (
      this.defermentService.getSelectedCollaterals.collateralDeedGroups.length > 0 ||
      this.defermentService.getSelectedCollaterals.collateralNoAnnounceAuctions.length > 0
    ) {
      const defermentDuration = Utils.calculateDateDiff(
        this.dataForm?.get('startDate')?.value,
        this.dataForm?.get('endDate')?.value
      );
      if (defermentDuration > 365) {
        const header = this.hasExtendDeferment
          ? this.translateService.instant('LAWSUIT.DEFERMENT.FAIL_HEADER_EXTEND_EXEC')
          : this.translateService.instant('LAWSUIT.DEFERMENT.FAIL_HEADER_EXEC');
        const msg = header + ' ' + this.translateService.instant('LAWSUIT.DEFERMENT.ALERT_MESSAGE_TITLE_OVER_YEAR');
        await this.notificationService.alertDialog(header, msg);
        return false;
      }
    }
    if (this.hasExtendDeferment) {
      this.dataForm.get('extendDeferment')?.setValue(true);
      this.dataForm.get('extendDeferment')?.updateValueAndValidity();
    }
    const isCommitmentAccount = this.defermentService.checkCommitmentAccount(defermentState.DEFERMENT_EXEC);
    if (!isCommitmentAccount) return false;
    let isDocumentValid = this.isDocumentValid();
    this.dataForm.markAllAsTouched();
    this.dataForm.updateValueAndValidity();
    let isValid = this.defermentService.documents.some((f: any) => f.uploadRequired) ? isDocumentValid : true;
    // check relate document execution
    const isValidRelateDocs = this.defermentService.isValidSuspendAuctionDocuments(
      this.dataForm?.get('suspendAuctionDocuments')?.value
    );
    if (
      (this.defermentService.getSelectedCollaterals.collateralDeedGroups.length > 0 ||
        this.defermentService.getSelectedCollaterals.collateralNoAnnounceAuctions.length > 0) &&
      !isValidRelateDocs
    ) {
      this.notificationService.alertDialog(
        'LAWSUIT.DEFERMENT.FAIL_HEADER_EXEC',
        'LAWSUIT.DEFERMENT.FAIL_MESSAGE_UPLOAD'
      );
      this.dataForm?.get('suspendAuctionDocuments')?.setErrors({ invalid: true });
      return false;
    }
    if (this.dataForm.valid && isValid) {
      let title = this.hasExtendDeferment
        ? this.translateService.instant('LAWSUIT.DEFERMENT.CONFIRM_EXTEND_DURATION_EXEC')
        : this.translateService.instant('LAWSUIT.DEFERMENT.CONFIRM_DURATION_EXEC');
      const confirm = await this.notificationService.warningDialog(
        title,
        `บันทึกแล้วแก้ไขไม่ได้ กรุณาตรวจสอบรายละเอียดให้ถูกต้อง \n
        ก่อนกดปุ่ม "${title}"`,
        title,
        'icon-Selected'
      );
      if (confirm) {
        await this.saveCustomerDefermentExec(SaveDefermentRequest.HeaderFlagEnum.Submit);
        const msg = this.hasExtendDeferment
          ? this.translateService.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_EXTEND_SUBMIT_SUCCESS')
          : this.translateService.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_SUBMIT_SUCCESS', {
              LG_ID: this.litigationId,
            });
        this.notificationService.openSnackbarSuccess(msg);
        if (this.hasExtendDeferment) {
          return true;
        } else {
          // reset for get new litigation detail
          this.lawsuitService.currentLitigation.litigationId = '';
          this.routerService.backOnIndex(2);
        }
      }
    } else if (!isValid) {
      this.notificationService.alertDialog(
        this.hasExtendDeferment ? 'LAWSUIT.DEFERMENT.FAIL_HEADER_EXTEND_EXEC' : 'LAWSUIT.DEFERMENT.FAIL_HEADER_EXEC',
        'LAWSUIT.DEFERMENT.FAIL_MESSAGE_UPLOAD'
      );
      return false;
    }

    return false;
  }

  async saveCustomerDefermentExec(headerFlag: SaveDefermentRequest.HeaderFlagEnum): Promise<SaveDefermentExecResponse> {
    const defermentExecInfo = this.getDefermentExecInfo;
    this.setDocumentToForm();
    let request: SaveDefermentExecRequest = this.defermentService.saveCustomerDefermentExecRequest(
      headerFlag,
      this.dataForm,
      this.taskId,
      defermentExecInfo?.defermentId,
      this.litigationId
    );

    return await this.defermentService.saveCustomerDefermentExec(request);
  }

  async onSave(
    headerFlag: SaveDefermentRequest.HeaderFlagEnum = SaveDefermentRequest.HeaderFlagEnum.Submit,
    isExtend?: boolean
  ): Promise<boolean> {
    if (this.isExecution) {
      return this.onSubmitExecution();
    }

    // validate select lgid
    const defermentLitigationInfos =
      (this.dataForm.get('defermentLitigationInfos')?.value as DefermentLitigationInfo[] | null) || [];
    const litigationInfosEnable = defermentLitigationInfos.filter(e => e.enabled);
    if (this.isViewMode === true && !['ADD', 'EDIT'].includes(this.mode)) {
      litigationInfosEnable.forEach((value: any) => {
        if (value.checked != true) {
          value.checked = true;
        }
      });
    } else {
      if (!litigationInfosEnable.some(e => e.checked === true)) {
        if (this.hasCeased) {
          this.notificationService.alertDialog(
            'LAWSUIT.DEFERMENT.CAN_NOT_SUBMIT_CESSATION_TITLE',
            'LAWSUIT.DEFERMENT.INVALID_LITIGATION_CESSATION_MSG'
          );
        } else {
          this.notificationService.alertDialog(
            'LAWSUIT.DEFERMENT.CAN_NOT_SUBMIT_DEFERMENT_TITLE',
            'LAWSUIT.DEFERMENT.INVALID_LITIGATION_DEFERMENT_MSG'
          );
        }
        return false;
      }
    }
    let isConfirm!: boolean;
    if (!(headerFlag === SaveDefermentRequest.HeaderFlagEnum.Draft)) {
      isConfirm = await this.notificationService.warningDialog(
        this.hasCeased
          ? 'LAWSUIT.DEFERMENT.CONFIRM_SAVE_CESSATION_TITLE'
          : 'LAWSUIT.DEFERMENT.CONFIRM_SAVE_DEFERMENT_TITLE',
        this.hasCeased
          ? 'LAWSUIT.DEFERMENT.CONFIRM_SAVE_CESSATION_MSG'
          : 'LAWSUIT.DEFERMENT.CONFIRM_SAVE_DEFERMENT_MSG',
        this.hasCeased
          ? 'LAWSUIT.DEFERMENT.CONFIRM_SAVE_CESSATION_TITLE'
          : 'LAWSUIT.DEFERMENT.CONFIRM_SAVE_DEFERMENT_TITLE',
        'icon-Selected'
      );
    }
    if (isConfirm || isExtend || headerFlag === SaveDefermentRequest.HeaderFlagEnum.Draft) {
      if (this.litigationId != '') {
        const litigationClosed = await this.alertAndNotProceedIfLgClosed('LAWSUIT.DEFERMENT.FAIL_HEADER');
        if (litigationClosed) {
          this.routerService.navigateTo('/main/lawsuit');
          return false;
        }
      }
      this.logger.info('onSave Deferment dataForm :: ', {
        rawValue: this.dataForm.getRawValue(),
        isValid: this.dataForm.valid,
      });
      let isCommitmentAccount = this.defermentService.checkCommitmentAccount(this.defermentState);
      if (!isCommitmentAccount) return false;
      let isDocumentValid = this.isDocumentValid();
      this.dataForm.markAllAsTouched();
      this.dataForm.updateValueAndValidity();
      if (this.dataForm.valid || headerFlag === SaveDefermentRequest.HeaderFlagEnum.Draft) {
        if (isDocumentValid || headerFlag === SaveDefermentRequest.HeaderFlagEnum.Draft) {
          this.dataForm.get('startDate')?.setValue(new Date(this.dataForm.get('startDate')?.value).toISOString());
          this.dataForm.get('startDate')?.updateValueAndValidity();
          this.dataForm.get('endDate')?.setValue(new Date(this.dataForm.get('endDate')?.value).toISOString());
          this.dataForm.get('endDate')?.updateValueAndValidity();
          this.dataForm.get('responseUnitType')?.setValue(this.defermentService.responseUnitType);
          this.dataForm.get('responseUnitType')?.updateValueAndValidity();
          if (this.hasExtendDeferment) {
            this.dataForm.get('extendDeferment')?.setValue(true);
            this.dataForm.get('extendDeferment')?.updateValueAndValidity();
          }
          this.litigationId = this.lawsuitService.currentLitigation.litigationId || '';
          // Deferment
          /* TODO: remove this if Enhnace develop_enh_LEX2-34934 has passed and no impact on other works
          if (isCommitmentAccount && !this.hasCeased) {
            if (
              this.validatePrescriptionDate(this.dataForm.get('endDate')?.value, '<', 180) &&
              headerFlag !== SaveDefermentRequest.HeaderFlagEnum.Draft
            ) {
              this.notificationService.alertDialog(
                'LAWSUIT.DEFERMENT.FAIL_HEADER',
                'LAWSUIT.DEFERMENT.FAIL_MESSAGE_LESS_THAN_6'
              );
              return false;
            } else {
              if (
                this.validatePrescriptionDate(this.dataForm.get('endDate')?.value, '>=', 180) &&
                this.validatePrescriptionDate(this.dataForm.get('endDate')?.value, '<', 270)
              ) {
                const isContinue = await this.notificationService.warningDialog(
                  'LAWSUIT.DEFERMENT.WARNING_DURATION',
                  'LAWSUIT.DEFERMENT.FAIL_MESSAGE_BETWEEM_6_9',
                  'COMMON.BUTTON_CONTINUE2'
                );
                if (isContinue) {
                  const res: SaveDefermentResponse = await this.submitDeferment(headerFlag);
                  if (this.hasExtendDeferment) return true;
                  if (!(headerFlag === SaveDefermentRequest.HeaderFlagEnum.Draft)) {
                    this.defermentService.deferment = {};
                    this.lawsuitService.currentLitigation = await this.lawsuitService.getLitigation(this.litigationId);
                    this.routerService.backOnIndex(2);
                  }
                  this.setDefermentId(res);
                  this.setTaskId(res);
                  await this.inquiryData(
                    this.dataForm.get('customerId')?.value,
                    res.defermentId,
                    this.hasCeased,
                    this.litigationId,
                    'EDIT',
                    res.taskId
                  );
                  return true;
                }
              } else {
                const res: SaveDefermentResponse = await this.submitDeferment(headerFlag);
                if (this.hasExtendDeferment) return true;
                if (!(headerFlag === SaveDefermentRequest.HeaderFlagEnum.Draft)) {
                  this.defermentService.deferment = {};
                  this.lawsuitService.currentLitigation = await this.lawsuitService.getLitigation(this.litigationId);
                  this.routerService.backOnIndex(2);
                }
                this.setDefermentId(res);
                this.setTaskId(res);
                await this.inquiryData(
                  this.dataForm.get('customerId')?.value,
                  res.defermentId,
                  this.hasCeased,
                  this.litigationId,
                  'EDIT',
                  res.taskId
                );
                return true;
              }
            }
          }
          */
          const defermentLitigationInfosValue = this.dataForm.get('defermentLitigationInfos')?.value as DefermentLitigationInfo[];

          if (isCommitmentAccount && !this.hasCeased) {
            const isDraft = headerFlag === SaveDefermentRequest.HeaderFlagEnum.Draft;
            const endDateValue = this.dataForm.get('endDate')?.value;
            let isContinue = await this.defermentService.isPrescriptionLessThanProperMonths(
              endDateValue,
              defermentLitigationInfosValue
            )

            if (isContinue) {
              const res: SaveDefermentResponse = await this.submitDeferment(headerFlag);

              if (this.hasExtendDeferment) return true;

              if (!isDraft) {
                this.defermentService.deferment = {};
                this.lawsuitService.currentLitigation = await this.lawsuitService.getLitigation(this.litigationId);
                this.routerService.backOnIndex(2);
              }

              this.setDefermentId(res);
              this.setTaskId(res);
              await this.inquiryData(
                this.dataForm.get('customerId')?.value,
                res.defermentId,
                this.hasCeased,
                this.litigationId,
                'EDIT',
                res.taskId
              );

              return true;
            }
          }

          // Cessation
          else if (isCommitmentAccount && this.hasCeased) {
            if (this.defermentState === defermentState.DEFERMENT) {
              let isCancelDeferment =
                headerFlag !== SaveDefermentRequest.HeaderFlagEnum.Draft &&
                (await this.notificationService.warningDialog(
                  'LAWSUIT.DEFERMENT.WARNING_CANCEL_DEFERMENT',
                  'LAWSUIT.DEFERMENT.CANCEL_DEFERMENT_MSG',
                  'LAWSUIT.DEFERMENT.ACTION_CANCEL_DEFERMENT_BTN',
                  'icon-Selected'
                ));
              if (isCancelDeferment || headerFlag === SaveDefermentRequest.HeaderFlagEnum.Draft) {
                if (
                  this.defermentService.validatePrescriptionDate(this.dataForm.get('startDate')?.value, '<', 180, defermentLitigationInfosValue) &&
                  headerFlag !== SaveDefermentRequest.HeaderFlagEnum.Draft
                ) {
                  let isContinue =
                    headerFlag !== SaveDefermentRequest.HeaderFlagEnum.Draft &&
                    (await this.notificationService.warningDialog(
                      'LAWSUIT.DEFERMENT.WARNING_DURATION',
                      'LAWSUIT.DEFERMENT.FAIL_MESSAGE_LESS_THAN_6_CONTINUE',
                      'COMMON.BUTTON_CONTINUE2'
                    ));
                  if (isContinue || headerFlag === SaveDefermentRequest.HeaderFlagEnum.Draft) {
                    const res: SaveDefermentResponse = await this.submitDeferment(headerFlag);
                    if (!(headerFlag === SaveDefermentRequest.HeaderFlagEnum.Draft)) {
                      this.defermentService.deferment = {};
                      this.lawsuitService.currentLitigation = await this.lawsuitService.getLitigation(
                        this.litigationId
                      );
                      this.routerService.backOnIndex(2);
                    }
                    this.setDefermentId(res);
                    this.setTaskId(res);
                    await this.inquiryData(
                      this.dataForm.get('customerId')?.value,
                      res.defermentId,
                      this.hasCeased,
                      this.litigationId,
                      'EDIT',
                      res.taskId
                    );
                    return true;
                  }
                  return false;
                } else {
                  const res: SaveDefermentResponse = await this.submitDeferment(headerFlag);
                  if (!(headerFlag === SaveDefermentRequest.HeaderFlagEnum.Draft)) {
                    this.defermentService.deferment = {};
                    this.lawsuitService.currentLitigation = await this.lawsuitService.getLitigation(this.litigationId);
                    this.routerService.backOnIndex(2);
                  }
                  this.setDefermentId(res);
                  this.setTaskId(res);
                  await this.inquiryData(
                    this.dataForm.get('customerId')?.value,
                    res.defermentId,
                    this.hasCeased,
                    this.litigationId,
                    'EDIT',
                    res.taskId
                  );
                  return true;
                }
              }
            } else {
              if (this.defermentService.validatePrescriptionDate(this.dataForm.get('startDate')?.value, '<', 180, defermentLitigationInfosValue)) {
                const isContinue = await this.notificationService.warningDialog(
                  'LAWSUIT.DEFERMENT.WARNING_DURATION',
                  'LAWSUIT.DEFERMENT.FAIL_MESSAGE_LESS_THAN_6_CONTINUE',
                  'COMMON.BUTTON_CONTINUE2'
                );
                if (isContinue) {
                  const res = await this.submitDeferment(headerFlag);
                  if (!(headerFlag === SaveDefermentRequest.HeaderFlagEnum.Draft)) {
                    this.defermentService.deferment = {};
                    this.lawsuitService.currentLitigation = await this.lawsuitService.getLitigation(this.litigationId);
                    this.routerService.backOnIndex(2);
                  }
                  this.setDefermentId(res);
                  this.setTaskId(res);
                  await this.inquiryData(
                    this.dataForm.get('customerId')?.value,
                    res.defermentId,
                    this.hasCeased,
                    this.litigationId,
                    'EDIT',
                    res.taskId
                  );
                  return true;
                }
                return false;
              } else {
                const res = await this.submitDeferment(headerFlag);
                if (!(headerFlag === SaveDefermentRequest.HeaderFlagEnum.Draft)) {
                  this.defermentService.deferment = {};
                  this.lawsuitService.currentLitigation = await this.lawsuitService.getLitigation(this.litigationId);
                  this.routerService.backOnIndex(2);
                }
                this.setDefermentId(res);
                this.setTaskId(res);
                await this.inquiryData(
                  this.dataForm.get('customerId')?.value,
                  res.defermentId,
                  this.hasCeased,
                  this.litigationId,
                  'EDIT',
                  res.taskId
                );
                return true;
              }
            }
          } else {
            return false;
          }
          return false;
        } else {
          this.notificationService.alertDialog(
            this.hasCeased ? 'LAWSUIT.DEFERMENT.CAN_NOT_SUBMIT_CESSATION_TITLE' : 'LAWSUIT.DEFERMENT.FAIL_HEADER',
            'LAWSUIT.DEFERMENT.FAIL_MESSAGE_UPLOAD'
          );
          return false;
        }
      }
      return false;
    }
    return false;
  }

  initDefermentMsgBanner() {
    const defermentExecInfo = this.getDefermentExecInfo;
    const defermentId = this.isExecution
      ? defermentExecInfo?.defermentId
      : this.lawsuitService.currentLitigation.defermentInfo?.defermentId;
    const isDeferred = [
      'DEFERMENT',
      'DEFERMENT_EXEC_SALE',
      'DEFERMENT_EXEC_SEIZURE',
      'DEFERMENT_EXEC_SEIZURE_SALE',
    ].includes(this.defermentStatus || '');
    const isExecStatus = [
      'NORMAL',
      'DEFERMENT_EXEC_SEIZURE',
      'DEFERMENT_EXEC_SALE',
      'DEFERMENT_EXEC_SEIZURE_SALE',
    ].includes(this.defermentStatus as LitigationDetailDto.DefermentStatusEnum);
    const isOwnerTask = this.sessionService.currentUser?.userId === defermentExecInfo?.createdBy;
    if (this.defermentStatus === 'NORMAL' && !!!defermentId && !!!this.currentLitigation.cessationInfo?.defermentId) {
      // first time for defermention
      this.defermentState = defermentState.NORMAL;
      this.defermentMessageBanner = {
        type: '',
        message: '',
      };
    } else {
      const _approved =
        this.lawsuitService.currentLitigation.defermentInfo?.approved || defermentExecInfo?.approved ? true : false;
      const _hasCeased = this.isExecution ? true : !this.hasCeased;
      const _approvedCessation = this.lawsuitService.currentLitigation.cessationInfo?.approved
        ? this.lawsuitService.currentLitigation.cessationInfo.approved
        : false;
      const taskNotPendingApproved: DefermentInfo.DefermentTaskStatusEnum[] = ['DRAFT', 'REVISE'];
      if (
        (!this.isExecution &&
          this.defermentStatus === 'NORMAL' &&
          !this.lawsuitService.currentLitigation.defermentInfo?.approved &&
          !this.lawsuitService.currentLitigation.cessationInfo?.defermentId &&
          !taskNotPendingApproved.includes(
            this.lawsuitService.currentLitigation.defermentInfo
              ?.defermentTaskStatus as DefermentInfo.DefermentTaskStatusEnum
          )) ||
        (this.isExecution &&
          this.defermentExecType.includes(defermentExecInfo?.defermentType || '') &&
          isExecStatus &&
          !_approved &&
          _hasCeased &&
          (this.lawsuitService.currentLitigation.defermentInfo?.defermentTaskStatus === 'WAITING_APPROVE_DEFERMENT' ||
            this.lawsuitService.currentLitigation.defermentInfo?.defermentTaskStatus ===
              'WAITING_APPROVE_DEFERMENT_EXEC' ||
            defermentExecInfo?.defermentTaskStatus === 'WAITING_APPROVE_DEFERMENT_EXEC' ||
            defermentExecInfo?.defermentTaskStatus === 'REVISE') &&
          isOwnerTask)
      ) {
        // NORMAL && Pending approved
        this.defermentState =
          this.defermentService?.deferment?.deferment?.defermentTaskStatus ===
          DefermentExecItem.DefermentTaskStatusEnum.Draft
            ? defermentState.NORMAL
            : defermentState.NORMAL_PENDING_APPROVED;
        const defermentInfo = this.lawsuitService.currentLitigation.defermentInfo;
        const _createdByName = defermentInfo?.createdBy + '-' + defermentInfo?.createdByName || '';
        const _createdDate =
          this.buddhistEraPipe.transform(
            this.isExecution
              ? defermentExecInfo?.createdDate
              : this.lawsuitService.currentLitigation.defermentInfo?.createdDate,
            'DD/MM/YYYY'
          ) || '';
        if (this.isExecution) {
          if (
            defermentExecInfo?.defermentTaskStatus === 'WAITING_APPROVE_DEFERMENT_EXEC' ||
            defermentExecInfo?.defermentTaskStatus === 'REVISE'
          ) {
            this.defermentMessageBanner.type = 'warn-normal';
            let typeText = '';
            switch (defermentExecInfo?.defermentType) {
              case 'DEFERMENT_EXEC_SALE':
                typeText = 'ขายทอดตลาด';
                break;
              case 'DEFERMENT_EXEC_SEIZURE':
                typeText = 'ยึดทรัพย์';
                break;
              case 'DEFERMENT_EXEC_SEIZURE_SALE':
                typeText = 'ยึดทรัพย์-ขายทอดตลาด';
                break;
              default:
                typeText = 'ยึดทรัพย์-ขายทอดตลาด';
                break;
            }
            let msgBanner =
              defermentExecInfo?.extendDeferment === false
                ? 'เลขที่กฎหมายนี้อยู่ระหว่างขออนุมัติชะลอบังคับคดี'
                : 'เลขที่กฎหมายนี้อยู่ระหว่างขออนุมัติขยายระยะเวลาชะลอบังคับคดี';
            this.defermentMessageBanner.message = `${msgBanner} (${typeText}) โดย startbold${defermentExecInfo?.createdBy}-${defermentExecInfo.createdByName} เมื่อวันที่ ${_createdDate}endbold`;
            let deferment = this.defermentService?.deferment?.deferment as any;
            let hasReason = deferment?.collaterals?.some(
              (f: DefermentCollateralInquiryDto) =>
                f.lexsCollateralStatus &&
                f.defermentCollateralStatus &&
                f.lexsCollateralStatus !== f.defermentCollateralStatus
            );
            if (hasReason) {
              this.defermentMessageBanner.message =
                this.defermentMessageBanner.message +
                ' หมายเหตุ: สถานะหลักประกันที่จะชะลอยึดและชะลอขายมีการเปลี่ยนแปลง';
            }
          }
        } else {
          this.defermentMessageBanner = {
            message:
              this.lawsuitService.currentLitigation.defermentInfo?.approved === undefined ||
              this.lawsuitService.currentLitigation.defermentInfo?.approved === false
                ? this.translateService.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.NORMAL_PENDING_APPROVED', {
                    CREATEDBYNAME: _createdByName,
                    CREATEDDATE: _createdDate,
                  })
                : this.translateService.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.EXTEND_PENDING_APPROVED', {
                    CREATEDBYNAME: _createdByName,
                    CREATEDDATE: _createdDate,
                  }),
            type: 'warn-normal',
          };
        }
      } else if (
        this.lawsuitService.currentLitigation.defermentInfo?.defermentTaskStatus ===
          this.defermentTaskStatusEnum.Draft ||
        this.lawsuitService.currentLitigation.cessationInfo?.defermentTaskStatus ===
          this.defermentTaskStatusEnum.Draft ||
        this.lawsuitService.currentLitigation.defermentInfo?.defermentTaskStatus ===
          this.defermentTaskStatusEnum.Revise ||
        this.lawsuitService.currentLitigation.cessationInfo?.defermentTaskStatus === this.defermentTaskStatusEnum.Revise
      ) {
        // save DRAFT & Revise - deferment and cessation

        this.defermentState = defermentState.NORMAL;
      } else if (this.defermentStatus === 'NORMAL' && _approved) {
        // NORMAL && Approved
        this.defermentState = defermentState.DEFERMENT;
        this.defermentMessageBanner = {
          message: '',
          type: 'fail',
        };

        if (
          this.lawsuitService.currentLitigation.cessationInfo?.defermentType === 'CESSATION' &&
          !!this.lawsuitService.currentLitigation.cessationInfo?.defermentId &&
          !!!this.lawsuitService.currentLitigation.cessationInfo?.approved
        ) {
          // CESSATION &&  Pending approved
          const _createdByNameCessation = this.lawsuitService.currentLitigation.cessationInfo?.createdByName || '';
          const _createdDateCessation =
            this.buddhistEraPipe.transform(
              this.lawsuitService.currentLitigation.cessationInfo?.createdDate,
              'DD/MM/YYYY'
            ) || '';
          this.cessationState = defermentState.CESSATION_PENDING_APPROVED;
          this.cessationMessageBanner = {
            message: this.translateService.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.CESSATION_PENDING_APPROVED', {
              CREATEDBYNAME: _createdByNameCessation,
              CREATEDDATE: _createdDateCessation,
            }),
            type: 'warn-normal',
          };
        }
      } else if (isDeferred && !_approved && !this.hasCeased && isOwnerTask) {
        // EXTEND && Pending approved
        this.defermentState = defermentState.DEFERMENT_PENDING_APPROVED;
        const _createdBy =
          (this.lawsuitService.currentLitigation.defermentInfo?.createdBy + '-' || '') +
          (this.lawsuitService.currentLitigation.defermentInfo?.createdByName || '');
        const _createDate =
          this.buddhistEraPipe.transform(
            this.lawsuitService.currentLitigation.defermentInfo?.createdDate,
            'DD/MM/YYYY'
          ) || '';
        const _createdByExec =
          (this.lawsuitService.currentLitigation.defermentExecInfo?.createdBy + '-' || '') +
          (this.lawsuitService.currentLitigation.defermentExecInfo?.createdByName || '');
        const _createDateExec =
          this.buddhistEraPipe.transform(
            this.lawsuitService.currentLitigation.defermentExecInfo?.createdDate,
            'DD/MM/YYYY'
          ) || '';
        if (this.isExecution) {
          if (defermentExecInfo?.defermentTaskStatus === 'WAITING_APPROVE_DEFERMENT_EXEC') {
            switch (defermentExecInfo?.defermentType as string) {
              case 'DEFERMENT_EXEC_SEIZURE':
                this.defermentMessageBanner = {
                  message: this.translateService.instant(
                    'LAWSUIT.DEFERMENT.MESSAGE_BANNER.WAITING_APPROVE_EXTEND_EXEC_SEIZURE',
                    {
                      USER: _createdByExec,
                      CREATEDDATE: _createDateExec,
                    }
                  ),
                  type: 'warn-normal',
                };
                break;
              case 'DEFERMENT_EXEC_SALE':
                this.defermentMessageBanner = {
                  message: this.translateService.instant(
                    'LAWSUIT.DEFERMENT.MESSAGE_BANNER.WAITING_APPROVE_EXTEND_EXEC_SALE',
                    {
                      USER: _createdByExec,
                      CREATEDDATE: _createDateExec,
                    }
                  ),
                  type: 'warn-normal',
                };
                break;
              case 'DEFERMENT_EXEC_SEIZURE_SALE':
                this.defermentMessageBanner = {
                  message: this.translateService.instant(
                    'LAWSUIT.DEFERMENT.MESSAGE_BANNER.WAITING_APPROVE_EXTEND_EXEC_SEIZURE_SALE',
                    {
                      USER: _createdByExec,
                      CREATEDDATE: _createDateExec,
                    }
                  ),
                  type: 'warn-normal',
                };
                break;
            }
          }
        } else {
          this.defermentMessageBanner = {
            message: this.translateService.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.EXTEND_PENDING_APPROVED', {
              CREATEDBYNAME: _createdBy,
              CREATEDDATE: _createDate,
            }),
            type: 'warn-normal',
          };
        }
      } else if (isDeferred && _approved) {
        // EXTEND && Approved
        this.defermentState = defermentState.DEFERMENT;
        this.defermentMessageBanner = {
          message: '',
          type: 'fail',
        };

        if (
          this.lawsuitService.currentLitigation.cessationInfo?.defermentType === 'CESSATION' &&
          !!this.lawsuitService.currentLitigation.cessationInfo?.defermentId &&
          !!!this.lawsuitService.currentLitigation.cessationInfo?.approved
        ) {
          // CESSATION &&  Pending approved
          const _createdByNameCessation = this.lawsuitService.currentLitigation.cessationInfo?.createdByName || '';
          const _createdDateCessation =
            this.buddhistEraPipe.transform(
              this.lawsuitService.currentLitigation.cessationInfo?.createdDate,
              'DD/MM/YYYY'
            ) || '';

          this.cessationState = defermentState.CESSATION_PENDING_APPROVED;
          this.cessationMessageBanner = {
            message: this.translateService.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.CESSATION_PENDING_APPROVED', {
              CREATEDBYNAME: _createdByNameCessation,
              CREATEDDATE: _createdDateCessation,
            }),
            type: 'warn-normal',
          };
        }
      } else if (
        this.defermentStatus === 'NORMAL' &&
        this.lawsuitService.currentLitigation.cessationInfo?.defermentType === 'CESSATION' &&
        !_approvedCessation &&
        this.lawsuitService.currentLitigation.cessationInfo.defermentTaskStatus === 'WAITING_APPROVE_CESSATION'
      ) {
        // CESSATION &&  Pending approved
        const _createdByNameCessation = this.lawsuitService.currentLitigation.cessationInfo?.createdByName || '';
        const _createdDateCessation =
          this.buddhistEraPipe.transform(
            this.lawsuitService.currentLitigation.cessationInfo?.createdDate,
            'DD/MM/YYYY'
          ) || '';
        this.cessationState =
          this.defermentService?.deferment?.deferment?.defermentTaskStatus ===
          DefermentExecItem.DefermentTaskStatusEnum.Draft
            ? defermentState.NORMAL
            : defermentState.CESSATION_PENDING_APPROVED;
        this.cessationMessageBanner = {
          message: this.translateService.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.CESSATION_PENDING_APPROVED', {
            CREATEDBYNAME: _createdByNameCessation,
            CREATEDDATE: _createdDateCessation,
          }),
          type: 'warn-normal',
        };
      } else if (
        this.defermentStatus === 'CESSATION' &&
        this.lawsuitService.currentLitigation.cessationInfo?.defermentType === 'CESSATION' &&
        _approvedCessation
      ) {
        // CESSATION && Approved
        this.cessationState = defermentState.CESSATION;
        this.cessationMessageBanner = {
          message: this.translateService.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.CESSATION_APPROVED', {
            ENDDATE: this.buddhistEraPipe.transform(
              this.lawsuitService.currentLitigation.cessationInfo.startDate,
              'DD/MM/YYYY'
            ),
          }),
          type: 'fail',
        };
      } else if (this.defermentStatus === 'NORMAL' && (_approved || _approvedCessation)) {
        if (!!this.lawsuitService.currentLitigation.defermentInfo?.defermentId) {
          // DEFERMENT && Approved && before efectiveDate - DEFERMENT
          this.defermentState = defermentState.DEFERMENT;
          this.defermentMsgBanner = this.translateService.instant(
            'LAWSUIT.DEFERMENT.MESSAGE_BANNER.EFFECTIVE_DATE_DEFERMENT',
            {
              ENDDATE: this.buddhistEraPipe.transform(
                this.lawsuitService.currentLitigation.defermentInfo.endDate,
                'DD/MM/YYYY'
              ),
            }
          );
          this.defermentMessageBanner = {
            message: '',
            type: 'fail',
          };
        }
        if (!!this.lawsuitService.currentLitigation.cessationInfo?.defermentId) {
          // CESSATION && Approved && before efectiveDate - CESSATION
          this.cessationState = defermentState.CESSATION;
          this.cessationMsgBanner = this.translateService.instant(
            'LAWSUIT.DEFERMENT.MESSAGE_BANNER.CESSATION_APPROVED',
            {
              ENDDATE: this.buddhistEraPipe.transform(
                this.lawsuitService.currentLitigation.cessationInfo.startDate,
                'DD/MM/YYYY'
              ),
            }
          );
          // this.cessationMessageBanner = 'fail';
          this.cessationMessageBanner = {
            message: '',
            type: 'fail',
          };
        }
      } else if (
        this.defermentStatus === 'NORMAL' &&
        !['WAITING_APPROVE_DEFERMENT', 'WAITING_APPROVE_CESSATION'].includes(
          this.defermentService.deferment.deferment?.defermentTaskStatus as DefermentExecItem.DefermentTaskStatusEnum
        )
      ) {
        // LEX2-22843 check case waiting approve

        this.defermentState = defermentState.NORMAL;
      }
    }
  }

  initActionBar() {
    const defermentExecInfo = this.getDefermentExecInfo;
    const pExecution = this.defermentService.hasPermissionExecution();
    const isPermitted =
      this.defermentService.responseUnitType === this.RESPONSE_UNIT_TYPE_ENUM.AmdResponseUnit ||
      this.defermentService.responseUnitType === this.RESPONSE_UNIT_TYPE_ENUM.ResponseUnit
        ? true
        : false;
    // LEX2-22843 check case waiting approve
    const defermentTaskStatus = this.defermentService.deferment.deferment
      ?.defermentTaskStatus as DefermentExecItem.DefermentTaskStatusEnum;
    const waitingApprove = ['WAITING_APPROVE_CESSATION', 'WAITING_APPROVE_DEFERMENT'].includes(defermentTaskStatus);
    if (isPermitted && this.dataForm.get('actionFlag')?.value && !this.isExecution && !this.isDetailView) {
      this.actionBar = {
        disabledBackButton: false,
        hasSave:
          (!this.hasCeased &&
            this.defermentState === defermentState.NORMAL &&
            (!this.lawsuitService.currentLitigation?.defermentInfo?.defermentTaskStatus ||
              this.lawsuitService.currentLitigation?.defermentInfo?.defermentTaskStatus !==
                this.defermentTaskStatusEnum.Approved)) ||
          (this.hasCeased &&
            this.cessationState === defermentState.NORMAL &&
            (!this.lawsuitService.currentLitigation?.cessationInfo?.defermentTaskStatus ||
              this.lawsuitService.currentLitigation?.cessationInfo?.defermentTaskStatus !==
                this.defermentTaskStatusEnum.Approved)) ||
          (this.defermentState === defermentState.DEFERMENT && this.hasExtendDeferment) ||
          (this.mode === 'EDIT' &&
            this.dataForm.get('defermentTaskStatus')?.value === DefermentExecItem.DefermentTaskStatusEnum.Revise &&
            !waitingApprove)
            ? true
            : false,
        saveText: 'COMMON.BUTTON_SAVE_DARFT',
        hasPrimaryButton:
          (this.defermentState === defermentState.NORMAL ||
            (this.mode === 'EDIT' &&
              this.dataForm.get('defermentTaskStatus')?.value === DefermentExecItem.DefermentTaskStatusEnum.Revise)) &&
          !this.hasCeased &&
          !waitingApprove
            ? true
            : false,
        disabledPrimaryButton: false,
        primaryButtonText:
          this.defermentCategory === 'PROSECUTE' ? 'LAWSUIT.DEFERMENT.CASE_BTN' : 'LAWSUIT.DEFERMENT.EXECUTION_BTN',
        primaryButtonIcon: 'icon-Pause',
        showNavBarInformation: true,
        hasRejectButton:
          (this.defermentState === defermentState.DEFERMENT &&
            this.cessationState !== defermentState.CESSATION_PENDING_APPROVED &&
            !this.isDetailView) ||
          (this.hasCeased &&
            (this.cessationState === undefined || this.cessationState === defermentState.NORMAL) &&
            !this.isDetailView) ||
          (this.hasCeased &&
            this.mode === 'EDIT' &&
            this.dataForm.get('defermentTaskStatus')?.value === DefermentExecItem.DefermentTaskStatusEnum.Revise)
            ? true
            : false,
        rejectButtonText: this.hasCeased
          ? this.translateService.instant('LAWSUIT.DEFERMENT.CESSATION')
          : this.hasExtendDeferment
            ? this.translateService.instant('LAWSUIT.DEFERMENT.CONFIRM_EXTEND_DURATION')
            : this.translateService.instant('LAWSUIT.DEFERMENT.EXTEND_DURATION'),
        rejectButtonIcon: this.hasCeased ? 'icon-Record-Stop' : 'icon-Pause',
        disabledRejectButton: false,
        hasEditButton:
          this.defermentState === defermentState.DEFERMENT && !this.hasCeased && !this.isDetailView ? true : false,
        editButtonText: 'LAWSUIT.DEFERMENT.CANCEL_DEFERMENT',
        disabledEditButton: false,
        editButtonIcon: 'icon-Dismiss-Circle',
        editButtonPrimary: this.defermentState === defermentState.DEFERMENT && this.hasCancelDeferment ? true : false,
        hasDeleteButton: this.hasCeased && this.cessationState === defermentState.CESSATION ? true : false,
        deleteButtonText: 'LAWSUIT.DEFERMENT.CANCEL_CESSATION',
        deleteButtonClasses: 'neutral',
        disabledDeleteButton: false,
        deleteButtonIcon: 'icon-Dismiss-Circle',
        deleteButtonPositive: this.hasCancelCessation ? true : false,
      };
    } else if (
      (pExecution.canDelay || pExecution.canExtendDelay || pExecution.canEditDelay || pExecution.canCancelDelay) &&
      this.isExecution &&
      isPermitted &&
      this.dataForm.get('actionFlag')?.value
    ) {
      if (this.isDetailView || this.isBackFromHistory) {
        const deferment = this.defermentService.deferment;
        this.canExtend =
          (defermentExecInfo &&
            this.defermentExecType.includes(defermentExecInfo.defermentType || '') &&
            defermentExecInfo.defermentTaskStatus === 'APPROVED' &&
            deferment?.deferment?.defermentTaskStatus === 'APPROVED' &&
            Utils.calculateDateDiff(new Date(), deferment?.deferment?.endDate || '') > 0 &&
            !defermentExecInfo.cancelled) ||
          false;
      } else {
        this.canExtend =
          (defermentExecInfo &&
            this.defermentExecType.includes(defermentExecInfo.defermentType || '') &&
            defermentExecInfo.defermentTaskStatus === 'APPROVED') ||
          false;
      }
      this.actionBar = {
        disabledBackButton: false,
        primaryButtonText: 'LAWSUIT.DEFERMENT.EXECUTION_BTN',
        primaryButtonIcon: 'icon-Pause',
        showNavBarInformation: true,
        hasSave: (this.mode === 'ADD' || this.mode === 'EDIT') && !this.isDetailView,
        hasPrimaryButton: (this.mode === 'ADD' || this.mode === 'EDIT') && !this.isDetailView,
        saveText: 'COMMON.BUTTON_SAVE_DARFT',
        hasRejectButton:
          ((this.canExtend &&
            this.mode !== 'ADD' &&
            this.dataForm.get('defermentTaskStatus')?.value !== DefermentExecItem.DefermentTaskStatusEnum.Revise) ||
            (this.mode === 'EDIT' &&
              this.dataForm.get('defermentTaskStatus')?.value === DefermentExecItem.DefermentTaskStatusEnum.Draft)) &&
          !this.hideTabFlag,
        rejectButtonText:
          pExecution.canExtendDelay &&
          (this.canExtend
            ? 'LAWSUIT.DEFERMENT.EXTEND_DEFERMENT_EXECUTION'
            : this.mode !== 'ADD' &&
                this.dataForm.get('defermentTaskStatus')?.value !== DefermentExecItem.DefermentTaskStatusEnum.Draft
              ? 'LAWSUIT.DEFERMENT.CONFIRM_EXTEND_DURATION_EXEC'
              : 'COMMON.BUTTON_DELTE'),
        rejectButtonIcon: this.mode !== 'ADD' ? 'icon-Pause' : 'icon-Bin',
        hasEditButton:
          pExecution.canCancelDelay &&
          this.canExtend &&
          this.mode !== 'ADD' &&
          this.mode !== 'EDIT' &&
          !this.hideTabFlag,
        editButtonText: 'LAWSUIT.DEFERMENT.CANCEL_DEFERMENT_EXECUTION',
        editButtonClasses: 'neutral',
        disabledEditButton: false,
        editButtonIcon: 'icon-Dismiss-Circle',
        editButtonPositive: this.hasCancelDeferment ? true : false,
      };
    } else {
      this.actionBar = {
        disabledBackButton: false,
        primaryButtonText: 'LAWSUIT.DEFERMENT.CASE',
        primaryButtonIcon: 'icon-Pause',
        showNavBarInformation: true,
      };
    }
  }

  async onCancelDefermentInitial() {
    const litigationClosed = await this.alertAndNotProceedIfLgClosed(
      'LAWSUIT.DEFERMENT.FAIL_HEADER_COMMITMENT_DEFERMENT'
    );
    if (litigationClosed) {
      this.routerService.navigateTo('/main/lawsuit');
      return;
    }
    this.dataForm.reset();
    this.litigationId = this.lawsuitService.currentLitigation.litigationId || '';
    if (this.defermentCategory === 'EXECUTION') {
      const defermentExecInfo = this.getDefermentExecInfo;
      const res = await this.defermentService.inquiryDefermentExec({
        customerId: this.lawsuitService.currentLitigation.customerId || '',
        defermentId: this.defermentService.deferment.deferment?.defermentId || '',
        defermentType: defermentExecInfo?.defermentType as any,
        litigationId: this.litigationId,
        mode: 'CANCEL',
        taskId: this.taskId,
      });
      this.defermentService.deferment = res;
    } else {
      const res = await this.defermentService.inquiryDeferment(
        this.lawsuitService.currentLitigation.customerId || '',
        this.defermentService.deferment.deferment?.defermentId || '',
        this.defermentType.Deferment,
        this.litigationId,
        'CANCEL',
        this.taskId
      );
      this.defermentService.deferment = res;
    }
    this.dataForm = this.defermentService.generateDefermentForm(
      this.defermentService.deferment.deferment,
      this.hasCeased
    );
    this.documentUpload = this.defermentService.formatDocs(
      this.defermentService?.deferment?.deferment?.documents,
      this.isViewMode
    );
    this.initDoc();
    this.hasCancelDeferment = true;
    this.actionBar.editButtonPrimary = !this.actionBar.editButtonPrimary;
    this.actionBar.hasRejectButton = !this.actionBar.hasRejectButton;
    this.actionBar.hasCancelButton = !this.actionBar.hasCancelButton;

    this.isEditcancel = true;
  }

  async onCancelDeferment() {
    let isConfirm;
    if (this.isExecution) {
      isConfirm = await this.notificationService.warningDialog(
        'LAWSUIT.DEFERMENT.CONFIRM_CANCEL_DEFERMENT_EXEC_TITLE',
        'LAWSUIT.DEFERMENT.CONFIRM_CANCEL_DEFERMENT_EXEC_MSG',
        'LAWSUIT.DEFERMENT.CONFIRM_CANCEL_DEFERMENT_EXEC_TITLE',
        'icon-Selected'
      );
    } else if (this.hasCancelCessation && !this.hasCancelDeferment) {
      // cacel cessation confirm message
      isConfirm = await this.notificationService.warningDialog(
        'LAWSUIT.DEFERMENT.CONFIRM_CANCEL_CESSATION_TITLE',
        'LAWSUIT.DEFERMENT.CONFIRM_CANCEL_CESSATION_MSG',
        'LAWSUIT.DEFERMENT.CONFIRM_CANCEL_CESSATION_TITLE',
        'icon-Selected'
      );
    } else {
      isConfirm = await this.notificationService.warningDialog(
        'LAWSUIT.DEFERMENT.CONFIRM_CANCEL_DEFERMENT_TITLE',
        'LAWSUIT.DEFERMENT.CONFIRM_CANCEL_DEFERMENT_MSG',
        'LAWSUIT.DEFERMENT.CONFIRM_CANCEL_DEFERMENT_TITLE',
        'icon-Selected'
      );
    }
    if (isConfirm) {
      // check litigation closed
      const litigationClosed = this.isExecution
        ? await this.alertAndNotProceedIfLgClosed('LAWSUIT.DEFERMENT.FAIL_HEADER_COMMITMENT_DEFERMENT_EXEC')
        : this.hasCancelCessation && !this.hasCancelDeferment
          ? await this.alertAndNotProceedIfLgClosed('LAWSUIT.DEFERMENT.FAIL_HEADER_COMMITMENT_CESSATION')
          : await this.alertAndNotProceedIfLgClosed('LAWSUIT.DEFERMENT.FAIL_HEADER_COMMITMENT_DEFERMENT');
      if (litigationClosed) {
        this.routerService.navigateTo('/main/lawsuit');
        return;
      }
      const isCommitmentAccount = this.defermentService.checkCommitmentAccount(this.defermentState);
      if (!isCommitmentAccount) return;
      const isCancelWithDebtChanges = this.dataForm.get('cancelWithDebtChanges')?.value;
      const isDocumentValid = !isCancelWithDebtChanges || this.isDocumentValid();
      const defermentExecInfo = this.getDefermentExecInfo;
      if (isDocumentValid) {
        if (isCommitmentAccount) {
          this.setDocumentToForm(this.dataForm.get('cancelWithDebtChanges')?.value);
          const formData = this.dataForm.getRawValue();
          const activeDocuments = this.defermentService.documents.filter(d => d.active);
          let res;
          if (this.isExecution) {
            const requestExec: DefermentExecCancelRequest = {
              cancelDate: formData.cancelDate,
              cancelReason: formData.cancelReason,
              cancelWithDebtChanges: isCancelWithDebtChanges,
              customerId: this.lawsuitService.currentLitigation.customerId!,
              defermentId: this.defermentService.deferment.deferment?.defermentId!,
              documents: isCancelWithDebtChanges ? activeDocuments : [],
            };
            res = await this.defermentService.cancelDefermentExec(requestExec);
          } else {
            const request: DefermentCancelRequest = {
              cancelDate: formData.cancelDate,
              cancelReason: formData.cancelReason,
              cancelWithDebtChanges: isCancelWithDebtChanges,
              customerId: this.lawsuitService.currentLitigation.customerId!,
              defermentId: this.defermentService.deferment.deferment?.defermentId!,
              defermentType: this.isExecution
                ? (defermentExecInfo?.defermentType as any)
                : this.hasCeased
                  ? SaveDefermentRequest.DefermentTypeEnum.Cessation
                  : SaveDefermentRequest.DefermentTypeEnum.Deferment,
              documents: isCancelWithDebtChanges ? activeDocuments : [],
            };
            res = await this.defermentService.cancelDeferment(request);
          }
          if (res.success) {
            let msgBanner;
            if (this.isExecution) {
              msgBanner = ' ได้ยกเลิกชะลอบังคับคดีแล้ว';
            } else {
              msgBanner =
                this.hasCancelCessation && !this.hasCancelDeferment
                  ? ' ได้ยกเลิกยุติการดำเนินคดีแล้ว'
                  : ' ได้ยกเลิกชะลอการดำเนินคดีแล้ว';
            }
            this.notificationService.openSnackbarSuccess('เลขที่กฎหมาย: ' + this.litigationId + msgBanner);
            this.defermentService.deferment = {};
            // reset for get new litigation detail
            this.lawsuitService.currentLitigation.litigationId = '';
            this.routerService.back();
            this.hasCancelDeferment = false;
            this.hasExtendDeferment = false;
          }
        }
      } else {
        this.notificationService.alertDialog(
          this.isExecution
            ? 'LAWSUIT.DEFERMENT.FAIL_CANCEL_HEADER_EXEC'
            : 'LAWSUIT.DEFERMENT.FAIL_CANCEL_DEFERMENT_HEADER',
          'LAWSUIT.DEFERMENT.FAIL_MESSAGE_UPLOAD'
        );
        this.hasSufficientDoc = false;
      }
    }
  }
  async onExtendExecution(mode: string) {
    const defermentExecInfo = this.getDefermentExecInfo;
    const res = await this.defermentService.inquiryDefermentExec({
      customerId: this.lawsuitService.currentLitigation.customerId || '',
      defermentId:
        this.defermentService.deferment.deferment?.defermentId ||
        this.lawsuitService?.currentLitigation?.defermentExecInfo?.defermentId ||
        '',
      defermentType: defermentExecInfo?.defermentType as any,
      litigationId: this.litigationId,
      mode: mode as InquiryDefermentExecRequest.ModeEnum,
      taskId: this.taskId,
    });
    this.defermentService.deferment = { ...res };
    let deferment = this.defermentService.deferment?.deferment as any;
    this.defermentService.selectedSeizureProperties = (deferment?.collaterals || [])?.concat(
      deferment?.collateralNoAnnounceAuctions
    );
    this.defermentService.selectedCollateralSets = deferment?.collateralDeedGroups || [];
  }
  async onExtendInitial() {
    // check litigation closed
    const litigationClosed = await this.alertAndNotProceedIfLgClosed('LAWSUIT.DEFERMENT.FAIL_HEADER');
    if (litigationClosed) {
      this.routerService.navigateTo('/main/lawsuit');
      return;
    }
    if (this.hasExtendDeferment && (await this.onSave(SaveDefermentRequest.HeaderFlagEnum.Submit, true))) {
      // await this.fetchCurrentLitigationDetail();
      this.lawsuitService.currentLitigation = await this.lawsuitService.getLitigation(this.litigationId);
      this.currentLitigation = this.lawsuitService.currentLitigation;
      this.litigationId = this.lawsuitService.currentLitigation.litigationId || '';
      this.actionBar.hasCancelButton = false;
      this.actionBar.hasRejectButton = false;
      this.actionBar.hasSave = false;
      this.initDefermentMsgBanner();
      if (this.isExecution) {
        this.title = 'LAWSUIT.DEFERMENT.EXECUTION';
        await this.onExtendExecution('VIEW');
      } else {
        const res = await this.defermentService.inquiryDeferment(
          this.lawsuitService.currentLitigation.customerId || '',
          this.defermentService.deferment.deferment?.defermentId ||
            this.lawsuitService?.currentLitigation?.defermentInfo?.defermentId ||
            '',
          this.defermentType.Deferment,
          this.litigationId,
          'VIEW',
          this.taskId
        );

        this.defermentService.deferment = { ...res };
      }

      this.dataForm.reset();
      this.dataForm = this.defermentService.generateDefermentForm(
        this.defermentService.deferment.deferment,
        this.hasCeased
      );
      this.hasExtendDeferment = false;
    } else if (!this.hasExtendDeferment) {
      const extendedDefermentId: string = this.defermentService.deferment.deferment?.defermentId || '';
      this.actionBar.rejectButtonText = this.isExecution
        ? 'LAWSUIT.DEFERMENT.CONFIRM_EXTEND_DURATION_EXEC'
        : 'LAWSUIT.DEFERMENT.CONFIRM_EXTEND_DURATION';
      this.actionBar.hasEditButton = !this.actionBar.hasEditButton;
      this.actionBar.hasCancelButton = !this.actionBar.hasCancelButton;
      this.litigationId = this.lawsuitService.currentLitigation.litigationId || '';
      this.title = 'LAWSUIT.DEFERMENT.EXTEND_DURATION_EXEC';
      if (this.isExecution) {
        await this.onExtendExecution('EXTEND');
      } else {
        const res = await this.defermentService.inquiryDeferment(
          this.lawsuitService.currentLitigation.customerId || '',
          this.defermentService.deferment.deferment?.defermentId || '',
          this.defermentType.Deferment,
          this.litigationId,
          'ADD',
          this.taskId
        );
        this.defermentService.deferment = { ...res };
      }
      this.documentUpload = this.defermentService.formatDocs(
        this.defermentService?.deferment?.deferment?.documents,
        this.isViewMode
      );

      this.dataForm.reset();
      this.dataForm = this.defermentService.generateDefermentForm(
        this.defermentService.deferment.deferment,
        this.hasCeased
      );
      this.dataForm.get('extendDefermentId')?.setValue(extendedDefermentId);
      this.dataForm.get('extendDefermentId')?.updateValueAndValidity();
      if (this.defermentService.deferment.deferment?.endDate === undefined)
        this.dataForm?.get('endDate')?.patchValue('-');
      if (!this.isExecution) {
        this.getDefaultApproverCode();
      }
      this.hasExtendDeferment = true;
      this.actionBar.hasSave = true;
      if (this.defermentService.deferment.tdrContractDate) {
        let isMandatory =
          Utils.calculateDateDiff(
            this.dataForm.get('startDate')?.value,
            this.defermentService.deferment.tdrContractDate
          ) > 30 || this.dataForm.get('dlaApprove')?.value;
        this.defermentService.setDocumentWithCondition(isMandatory, DOC_TEMPLATE.LEXSD016);
      }
    }
  }

  clearApprovalAuthority() {
    this.dataForm.get('defermentApproverCode')?.setValue(null);
    this.dataForm.get('defermentApproverCode')?.updateValueAndValidity();
    this.dataForm.get('defermentApproverName')?.setValue(null);
    this.dataForm.get('defermentApproverName')?.updateValueAndValidity();
    return true;
  }

  getDefaultApproverCode() {
    const isDefermentOver =
      Utils.calculateDateDiff(this.dataForm.get('startDate')?.value, this.dataForm.get('endDate')?.value) > 30;
    if (isDefermentOver) {
      this.clearApprovalAuthority();
    } else {
      const isReponseUnit =
        this.defermentService.responseUnitType === this.RESPONSE_UNIT_TYPE_ENUM.ResponseUnit ? true : false;
      const defermentDuration = Utils.calculateDateDiff(
        this.dataForm.get('startDate')?.value,
        this.dataForm.get('endDate')?.value
      );
      const cumulativeDuration = isReponseUnit
        ? this.defermentService.deferment.totalDefermentDaysResponseUnit
        : this.defermentService.deferment.totalDefermentDaysAmdResponseUnit;
      const isOverOneYear = defermentDuration + (cumulativeDuration || 0) > 365;
      if (isOverOneYear) {
        this.dataForm.get('defermentApproverCode')?.setValue('3');
        this.dataForm.get('defermentApproverCode')?.updateValueAndValidity();
        this.dataForm.get('defermentApproverName')?.setValue('ผู้บริหารสายงานกำกับ');
        this.dataForm.get('defermentApproverName')?.updateValueAndValidity();
      } else {
        this.dataForm.get('defermentApproverCode')?.setValue('2');
        this.dataForm.get('defermentApproverCode')?.updateValueAndValidity();
        this.dataForm.get('defermentApproverName')?.setValue('ผู้บริหารสายงาน');
        this.dataForm.get('defermentApproverName')?.updateValueAndValidity();
      }
    }
  }

  // TODO: function is not re-fetch data litigation detail
  // async fetchCurrentLitigationDetail() {
  //   await this.lawsuitService.getLitigation(this.litigationId);
  // }

  async alertAndNotProceedIfLgClosed(title: string): Promise<boolean> {
    // await this.fetchCurrentLitigationDetail();
    const litigationClosed = this.lawsuitService.currentLitigation.litigationClosed ? true : false;
    if (litigationClosed) {
      const res = await this.notificationService.alertDialog(title, 'LAWSUIT.DEFERMENT.FAIL_MESSAGE_LITIGATION_CLOSED');
      if (res) return true;
    }
    return false;
  }

  async onCancelCessationInitial() {
    // check litigation closed
    const litigationClosed = await this.alertAndNotProceedIfLgClosed('LAWSUIT.DEFERMENT.FAIL_HEADER_CESSATION');
    if (litigationClosed) {
      this.routerService.navigateTo('/main/lawsuit');
      return;
    }
    const res = await this.defermentService.inquiryDeferment(
      this.lawsuitService.currentLitigation.customerId || '',
      this.defermentService.deferment.deferment?.defermentId || '',
      this.defermentType.Cessation,
      this.litigationId,
      'CANCEL',
      this.taskId
    );
    this.defermentService.deferment = res;
    this.dataForm = this.defermentService.generateDefermentForm(
      this.defermentService.deferment.deferment,
      this.hasCeased
    );
    this.documentUpload = this.defermentService.formatDocs(
      this.defermentService?.deferment?.deferment?.documents,
      this.isViewMode
    );
    this.hasCancelCessation = true;
    this.actionBar.deleteButtonPositive = true;
    this.actionBar.hasCancelButton = true;
  }

  async onSaveExecution() {
    if (
      (!this.defermentService.selectedSeizureProperties ||
        this.defermentService.selectedSeizureProperties?.length === 0) &&
      (!this.defermentService.selectedCollateralSets || this.defermentService.selectedCollateralSets?.length === 0)
    ) {
      await this.notificationService.alertDialog(
        'LAWSUIT.DEFERMENT.ALERT_MESSAGE_HEADER_SELECT_COLLATERAL_DRAFT',
        'LAWSUIT.DEFERMENT.ALERT_MESSAGE_TITLE_SELECT_COLLATERAL'
      );
      return;
    }
    if (
      this.defermentService.getSelectedCollaterals.collateralDeedGroups.length > 0 ||
      this.defermentService.getSelectedCollaterals.collateralNoAnnounceAuctions.length > 0
    ) {
      const defermentDuration = Utils.calculateDateDiff(
        this.dataForm?.get('startDate')?.value,
        this.dataForm?.get('endDate')?.value
      );
      if (defermentDuration > 365) {
        const header = this.hasExtendDeferment
          ? this.translateService.instant('LAWSUIT.DEFERMENT.FAIL_HEADER_EXTEND_EXEC')
          : this.translateService.instant('LAWSUIT.DEFERMENT.FAIL_HEADER_EXEC');
        const msg = header + ' ' + this.translateService.instant('LAWSUIT.DEFERMENT.ALERT_MESSAGE_TITLE_OVER_YEAR');
        await this.notificationService.alertDialog(header, msg);
        return;
      }
    }
    let res = (await this.saveCustomerDefermentExec(
      SaveDefermentRequest.HeaderFlagEnum.Draft
    )) as SaveDefermentExecResponse;
    if (res) {
      this.dataForm.get('defermentId')?.setValue(res.defermentId);
      this.dataForm.get('defermentId')?.updateValueAndValidity();
      this.taskId = Number(res.taskId);
      this.dataForm.markAsPristine();
      if (this.hasExtendDeferment) {
        this.notificationService.openSnackbarSuccess(
          `เลขที่กฎหมาย: ${this.litigationId} บันทึกร่างขยายระยะเวลาชะลอบังคับคดีสำเร็จแล้ว`
        );
      } else {
        this.notificationService.openSnackbarSuccess(
          this.translateService.instant('LAWSUIT.DEFERMENT.DEFER_EXEC_SAVE_DRAFT_SUCCESS')
        );
      }
      const resInquiry = (await this.defermentService.inquiryDefermentExec({
        customerId: this.lawsuitService.currentLitigation.customerId || '',
        defermentId: res?.defermentId || '',
        defermentType: res?.defermentType as SaveDefermentExecResponse.DefermentTypeEnum,
        litigationId: this.litigationId,
        mode: 'EDIT',
        taskId: this.taskId,
      })) as DefermentExecDto;
      this.defermentService.deferment = resInquiry;
      this.defermentService.paramTemp = {
        flagEdit: true,
        flagdeferment: true,
        btnAction: this._btnAction,
        litigationId: this.litigationId,
        hasCeased: this.hasCeased,
        modeFromBtn: 'EDIT',
        defermentId: res?.defermentId || '',
        customerId: this.lawsuitService.currentLitigation.customerId || '',
        defermentCategory: this.defermentCategory,
        taskId: this.taskId,
        actionFlag: this.dataForm.get('actionFlag')?.value,
        defermentType: res?.defermentType as SaveDefermentExecResponse.DefermentTypeEnum,
        state: 'MAIN',
      };
      return true;
    }
    return false;
  }

  async onSaveDraft() {
    if (this.isExecution) {
      await this.onSaveExecution();
      let resDoc = this.defermentService.deferment.deferment?.documents;
      let docSevice = this.defermentService.documents;
      for (let index = 0; index < docSevice.length; index++) {
        const m = docSevice[index];
        let docIndex = resDoc?.find(f => f.imageId && f?.imageId === m.imageId);
        if (docIndex && resDoc) {
          docSevice[index].documentId = docIndex.documentId;
        }
      }
      return;
    }
    let isSaveDraft: boolean = await this.onSave(
      'DRAFT',
      this.defermentState === defermentState.DEFERMENT ? true : false
    );
    if (isSaveDraft) {
      this.notificationService.openSnackbarSuccess(
        `${this.translateService.instant('COMMON.LABEL_LITIGATION_ID')}: ${this.litigationId} ${
          this.defermentState === defermentState.DEFERMENT
            ? this.translateService.instant('TASK.REJECT_DIALOG.EXTEND_DRAFT_SAVED')
            : this.hasCeased
              ? this.translateService.instant('TASK.REJECT_DIALOG.CESSATION_DRAFT_SAVED')
              : this.translateService.instant('TASK.REJECT_DIALOG.DEFERMENT_DRAFT_SAVED')
        }`
      );
    }
  }
  checkDetailView() {
    this.isDetailView = true;
    if (this.routerService.nextUrl.includes('/main/lawsuit/deferment/defer/main?')) {
      this.hideTabFlag = true;
    }
    this.hasCancelCessation = false;
    this.hasCancelDeferment = false;
    this.hasExtendDeferment = false;
    this.initActionBar();
  }

  setDefermentId(res: SaveDefermentResponse) {
    this.dataForm.get('defermentId')?.setValue(res.defermentId);
    this.dataForm.get('defermentId')?.updateValueAndValidity();
  }
  setTaskId(res: SaveDefermentResponse) {
    this.dataForm.get('taskId')?.setValue(res.taskId);
    this.dataForm.get('taskId')?.updateValueAndValidity();
  }

  async inquiryData(
    customerId: string,
    defermentId: string | undefined,
    hasCeased: boolean,
    litigationId: string,
    mode: string,
    taskId: number | undefined
  ) {
    const res = await this.defermentService.inquiryDeferment(
      customerId || '',
      defermentId ? defermentId : '',
      hasCeased ? this.defermentType.Cessation : this.defermentType.Deferment,
      litigationId,
      mode,
      taskId ? taskId : undefined
    );
    this.defermentService.deferment = res;
    this.dataForm = this.defermentService.generateDefermentForm(this.defermentService.deferment.deferment, hasCeased);
  }

  async onDeleteExecution() {
    const isContinue = await this.notificationService.warningDialog(
      'LAWSUIT.DEFERMENT.DELETE_DEFERMENT_LIST_TITLE',
      'LAWSUIT.DEFERMENT.DELETE_DEFERMENT_LIST_MSG',
      'LAWSUIT.DEFERMENT.DELETE_DEFERMENT_LIST_BTN',
      'icon-Bin',
      'long-button mat-warn'
    );
    if (isContinue) {
      if (this.taskId) {
        await this.saveCustomerDefermentExec(SaveDefermentRequest.HeaderFlagEnum.Delete);
      }
      this.defermentService.deferment = {};
      this.defermentService.clearDataExec();
      this.notificationService.openSnackbarSuccess(
        `${this.translateService.instant('COMMON.LABEL_LITIGATION_ID')}: ${
          this.litigationId
        } ${this.translateService.instant('TASK.REJECT_DIALOG.DELETE_DEFERMENT_LIST_SUCCESS')}`
      );
      this.routerService.back();
    }
  }

  get getDefermentExecInfo() {
    return this.isExecActive
      ? this.lawsuitService.currentLitigation.defermentExecActiveInfo
      : this.lawsuitService.currentLitigation.defermentExecInfo;
  }
}
