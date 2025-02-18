import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { DefermentService } from '@app/modules/deferment/deferment.service';
import { SubButtonModel } from '@app/shared/components/action-bar/action-bar.component';
import { AuditLogService } from '@app/shared/components/common-tabs/audit-log/audit-log.service';
import { CommonTabsService } from '@app/shared/components/common-tabs/common-tabs.service';
import { DebtRelatedInfoTabService } from '@app/shared/components/debt-related-info-tab/debt-related-info-tab.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { LAWSUIT_TABS_INFO } from '@app/shared/constant';
import { ActionBar, ITabNav } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { ActionOnScreen, SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import { CollateralInfo, DefermentDto, DefermentInfo, DefermentItem, LitigationDetailDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { RouterService } from '@shared/services/router.service';
import { BuddhistEraPipe, LoaderService } from '@spig/core';
import { SubSink } from 'subsink';
import { defermentState } from '../../deferment/deferment.model';
import { LawsuitService } from '../lawsuit.service';
import { PrepareLawsuitService } from '@app/shared/components/common-tabs/prepare-lawsuit/prepare-lawsuit.service';
import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';

interface ActionBarMeta extends ActionBar {
  hasCreateCase?: boolean;
  hasCreateNotice?: boolean;
  hasDelayLitigation?: boolean;
  hasCancelDelayLitigation?: boolean;
  hasCloseLg?: boolean;
  hasCeaseLitigation?: boolean;
  hasDefermentExcution?: boolean;
}

@Component({
  selector: 'app-lawsuit-detail',
  templateUrl: './lawsuit-detail.component.html',
  styleUrls: ['./lawsuit-detail.component.scss'],
  providers: [BuddhistEraPipe],
})
export class LawsuitDetailComponent implements OnInit, OnDestroy {
  public accessPermissions = this.sessionService.accessPermissions();
  public actionOnScreen: ActionOnScreen = {
    canAdd: this.accessPermissions.mode.includes('ADD'),
    canEdit: this.accessPermissions.mode.includes('EDIT'),
    canDelete: this.accessPermissions.mode.includes('DELETE'),
  };
  public permissions = this.accessPermissions.permissions;
  public actionBar: ActionBarMeta = {
    hasCancel: false,
    hasSave: false,
    hasReject: false,
    hasPrimary: false,
  };
  public subButtonList: Array<SubButtonModel> = [];

  public litigationDetail: LitigationDetailDto = {};
  public lgId!: string;
  public collateralInfo!: CollateralInfo;
  public blackCaseNo!: string;
  tabIndex = 0;
  public auditTabLabel: string = '';
  public data!: DefermentDto;
  public isClickPrepareLawsuit: boolean = false;
  isAddsubAccountBannerSuccess: boolean = false;
  messageBannerMapper = '';

  public defermentMsgBanner = '';
  public defermentExcutionBanner = {
    type: '',
    message: '',
    actionButton: 'ดูรายละเอียด',
    size: 'medium',
    actionButtonClass: '',
    actionButtonIcon: '',
  };
  public defermentExecActiveBanner = {
    type: '',
    message: '',
    actionButton: 'ดูรายละเอียด',
    size: 'medium',
    actionButtonClass: '',
    actionButtonIcon: '',
  };
  public defermentTypeBanner = '';
  public defermentState!: defermentState;
  public cessationMsgBanner = '';
  public cessationTypeBanner = '';
  public cessationState!: defermentState;
  public responseUnitType: DefermentItem.ResponseUnitTypeEnum | null = null;
  public RESPONSE_UNIT_TYPE_ENUM = DefermentItem.ResponseUnitTypeEnum;
  public nextRouting: string = '';
  public closeStartedBannerMessage: string = '';
  private subs = new SubSink();
  public legalExecutionDefermentState: string = '';

  public tabsInfo: ITabNav[] = LAWSUIT_TABS_INFO;
  public defermentTaskStatusEnum = DefermentInfo.DefermentTaskStatusEnum;
  constructor(
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private lawsuitService: LawsuitService,
    private routerService: RouterService,
    private sessionService: SessionService,
    private translate: TranslateService,
    private auditLogService: AuditLogService,
    private notificationService: NotificationService,
    private documentService: DocumentService,
    private defermentService: DefermentService,
    private router: Router,
    private buddhistEraPipe: BuddhistEraPipe,
    private commonTabService: CommonTabsService,
    private debtRelatedInfoTabService: DebtRelatedInfoTabService,
    private prepareLawsuitService: PrepareLawsuitService
  ) {
    // init data queryParams / snapshot
    this.blackCaseNo = this.route?.snapshot?.queryParams['blackCaseNo'];
  }

  ngOnInit(): void {
    // init currentTab from lawsuitService
    this.subs.add(
      this.router.events.subscribe(val => {
        if (val instanceof NavigationStart) this.nextRouting = val.url;
      }),
      this.route.queryParams.subscribe(async value => {
        // Setting Tab Index
        const indexFromQueryParam = Number(value['_tabIndex']);
        const indextFromService = this.lawsuitService.currentTab;
        const tabIndex = indexFromQueryParam || indextFromService || 0;
        this.onRouterLink(this.tabsInfo[tabIndex], { ...value });
      }),
      this.route.queryParams.subscribe(async value => {
        const paramsLitigation = value['litigationId'] || value['lgId'];
        if (paramsLitigation) {
          await this.fetchLitigationDetail(paramsLitigation);
          this.fetchInitData();
        }
      }),
      this.commonTabService.accountDebtBanner.subscribe(msgBanner => {
        if (msgBanner) {
          this.isAddsubAccountBannerSuccess = true;
          this.messageBannerMapper = msgBanner;
        } else {
          this.isAddsubAccountBannerSuccess = false;
          this.messageBannerMapper = msgBanner;
        }
      })
    );
    this.fetchInitData();
  }

  fetchInitData() {
    // init messageBanner for deferment
    this.initDefermentMsgBanner();
    this.initCloseStartBannerMessage();
    this.initActionBar();
    this.collateralInfo = !!this.litigationDetail.collateralInfo
      ? (Utils.deepClone(this.litigationDetail.collateralInfo) as CollateralInfo)
      : {};

    this.auditTabLabel = this.translate.instant('LAWSUIT.INFO_LABE_TAB_AUDIT_LOG');
    this.responseUnitType = this.defermentService.validateUserDeferment(this.lawsuitService.currentLitigation);
  }

  async fetchLitigationDetail(lgId: string = '') {
    if (lgId !== this.lawsuitService.currentLitigation.litigationId) {
      const litigation = await this.lawsuitService.getLitigation(lgId);
      this.lawsuitService.currentLitigation = litigation;
    }
    this.litigationDetail = this.lawsuitService.currentLitigation;
    this.lgId = this.lawsuitService.currentLitigation.litigationId || '';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initDefermentMsgBanner() {
    const defermentExecInfo = this.litigationDetail?.defermentExecInfo;
    const isExecutionStatus = ['DEFERMENT_EXEC_SEIZURE_SALE', 'DEFERMENT_EXEC_SEIZURE', 'DEFERMENT_EXEC_SALE'].includes(
      this.litigationDetail.defermentStatus as any
    );
    const isSubmitter = this.litigationDetail.defermentInfo?.createdBy === this.sessionService.currentUser?.userId;
    const isSubmitterCessation =
      this.litigationDetail.cessationInfo?.createdBy === this.sessionService.currentUser?.userId;
    const _approved = this.lawsuitService.currentLitigation.defermentInfo?.approved
      ? this.lawsuitService.currentLitigation.defermentInfo.approved
      : false;
    const _approvedCessation = this.lawsuitService.currentLitigation.cessationInfo?.approved
      ? this.lawsuitService.currentLitigation.cessationInfo.approved
      : false;
    if (
      this.litigationDetail.defermentStatus === 'NORMAL' &&
      !!!this.litigationDetail.defermentInfo?.defermentId &&
      !!!this.litigationDetail.cessationInfo?.defermentId &&
      (!!!defermentExecInfo?.defermentId ||
        (defermentExecInfo.defermentId && defermentExecInfo.defermentTaskStatus === 'DRAFT'))
    ) {
      // first time for defermention
      this.defermentState = defermentState.NORMAL;
      this.defermentMsgBanner = '';
      this.defermentTypeBanner = '';
    } else {
      const defermentInfo = this.litigationDetail?.defermentInfo;
      const _createdByName = defermentInfo?.createdBy + '-' + defermentInfo?.createdByName || '';
      const _createdDate =
        this.buddhistEraPipe.transform(this.litigationDetail.defermentInfo?.createdDate, 'DD/MM/YYYY') || '';
      if (
        this.litigationDetail.defermentStatus === 'NORMAL' &&
        !!!this.litigationDetail.defermentInfo?.approved &&
        !!!this.litigationDetail.cessationInfo?.defermentId &&
        !['DEFERMENT_EXEC_SEIZURE_SALE', 'DEFERMENT_EXEC_SEIZURE', 'DEFERMENT_EXEC_SALE'].includes(
          this.litigationDetail.defermentExecInfo?.defermentType || ''
        ) &&
        this.lawsuitService.currentLitigation.defermentInfo?.defermentTaskStatus === 'WAITING_APPROVE_DEFERMENT'
      ) {
        // NORMAL or EXTEND && Pending approved
        this.defermentState =
          this.litigationDetail.defermentInfo?.approved === undefined
            ? defermentState.NORMAL_PENDING_APPROVED
            : defermentState.DEFERMENT_PENDING_APPROVED;
        const _message =
          this.litigationDetail.defermentInfo?.approved === undefined ||
          this.litigationDetail.defermentInfo?.approved === false
            ? this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.NORMAL_PENDING_APPROVED', {
                CREATEDBYNAME: _createdByName,
                CREATEDDATE: _createdDate,
              })
            : this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.EXTEND_PENDING_APPROVED', {
                CREATEDBYNAME: _createdByName,
                CREATEDDATE: _createdDate,
              });
        this.defermentMsgBanner = isSubmitter ? _message : '';
        this.defermentTypeBanner = isSubmitter ? 'warn-normal' : '';
      }
      if (
        this.lawsuitService.currentLitigation.defermentInfo?.defermentTaskStatus ===
          this.defermentTaskStatusEnum.Draft ||
        this.lawsuitService.currentLitigation.defermentInfo?.defermentTaskStatus === this.defermentTaskStatusEnum.Revise
      ) {
        // save DRAFT & Revise -  deferment
        this.defermentState = defermentState.NORMAL;
      }

      if (
        this.lawsuitService.currentLitigation.cessationInfo?.defermentTaskStatus ===
          this.defermentTaskStatusEnum.Draft ||
        this.lawsuitService.currentLitigation.cessationInfo?.defermentTaskStatus === this.defermentTaskStatusEnum.Revise
      ) {
        // save DRAFT & Revise -   cessation
        this.cessationState = defermentState.NORMAL;
      } else if (
        this.litigationDetail.defermentStatus === 'NORMAL' &&
        !!this.litigationDetail.defermentInfo?.approved &&
        !['DEFERMENT_EXEC_SEIZURE_SALE', 'DEFERMENT_EXEC_SEIZURE', 'DEFERMENT_EXEC_SALE'].includes(
          this.litigationDetail.defermentExecInfo?.defermentType || ''
        )
      ) {
        // NORMAL && Approved
        this.defermentState = defermentState.DEFERMENT;
        this.defermentMsgBanner = this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.EFFECTIVE_DATE_DEFERMENT', {
          ENDDATE: this.buddhistEraPipe.transform(this.litigationDetail.defermentInfo.endDate, 'DD/MM/YYYY'),
        });
        this.defermentTypeBanner = 'fail-highlight';

        if (
          this.lawsuitService.currentLitigation.cessationInfo?.defermentType === 'CESSATION' &&
          !!this.litigationDetail.cessationInfo?.defermentId &&
          !!!this.litigationDetail.cessationInfo?.approved
        ) {
          // CESSATION &&  Pending approved
          const _createdByNameCessation = this.litigationDetail.cessationInfo?.createdByName || '';
          const _createdDateCessation =
            this.buddhistEraPipe.transform(this.litigationDetail.cessationInfo?.createdDate, 'DD/MM/YYYY') || '';

          this.cessationState = defermentState.CESSATION_PENDING_APPROVED;
          this.cessationMsgBanner = isSubmitterCessation
            ? this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.CESSATION_PENDING_APPROVED', {
                CREATEDBYNAME: _createdByNameCessation,
                CREATEDDATE: _createdDateCessation,
              })
            : '';
          this.cessationTypeBanner = isSubmitterCessation ? 'warn-normal' : '';
        }
      } else if (
        this.litigationDetail.defermentStatus === 'DEFERMENT' &&
        !!!this.litigationDetail.defermentInfo?.approved &&
        !['DEFERMENT_EXEC_SEIZURE_SALE', 'DEFERMENT_EXEC_SEIZURE', 'DEFERMENT_EXEC_SALE'].includes(
          this.litigationDetail.defermentExecInfo?.defermentType || ''
        )
      ) {
        // EXTEND && Pending approved
        this.defermentState = defermentState.DEFERMENT_PENDING_APPROVED;
        this.defermentMsgBanner = isSubmitter
          ? this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.EXTEND_PENDING_APPROVED', {
              CREATEDBYNAME: _createdByName,
              CREATEDDATE: _createdDate,
            })
          : '';
        this.defermentTypeBanner = isSubmitter ? 'warn-normal' : '';
      } else if (
        this.litigationDetail.defermentStatus === 'DEFERMENT' &&
        !!this.litigationDetail.defermentInfo?.approved
      ) {
        // EXTEND && Approved
        this.defermentState = defermentState.DEFERMENT;
        this.defermentMsgBanner = this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.EFFECTIVE_DATE_DEFERMENT', {
          ENDDATE: this.buddhistEraPipe.transform(this.litigationDetail.defermentInfo?.endDate, 'DD/MM/YYYY'),
        });
        this.defermentTypeBanner = 'fail-highlight';
        if (
          this.lawsuitService.currentLitigation.cessationInfo?.defermentType === 'CESSATION' &&
          !!this.litigationDetail.cessationInfo?.defermentId &&
          !!!this.litigationDetail.cessationInfo?.approved
        ) {
          // CESSATION &&  Pending approved
          const _createdByNameCessation = this.litigationDetail.cessationInfo?.createdByName || '';
          const _createdDateCessation =
            this.buddhistEraPipe.transform(this.litigationDetail.cessationInfo?.createdDate, 'DD/MM/YYYY') || '';

          this.cessationState = defermentState.CESSATION_PENDING_APPROVED;
          this.cessationMsgBanner = isSubmitterCessation
            ? this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.CESSATION_PENDING_APPROVED', {
                CREATEDBYNAME: _createdByNameCessation,
                CREATEDDATE: _createdDateCessation,
              })
            : '';
          this.cessationTypeBanner = isSubmitterCessation ? 'warn-normal' : '';
        }
      } else if (
        this.lawsuitService.currentLitigation.defermentStatus === 'NORMAL' &&
        this.lawsuitService.currentLitigation.cessationInfo?.defermentType === 'CESSATION' &&
        !!!this.litigationDetail.cessationInfo?.approved &&
        this.lawsuitService.currentLitigation.cessationInfo.defermentTaskStatus === 'WAITING_APPROVE_CESSATION'
      ) {
        // CESSATION &&  Pending approved
        const _createdByNameCessation = this.litigationDetail.cessationInfo?.createdByName || '';
        const _createdDateCessation =
          this.buddhistEraPipe.transform(this.litigationDetail.cessationInfo?.createdDate, 'DD/MM/YYYY') || '';

        this.cessationState = defermentState.CESSATION_PENDING_APPROVED;
        this.cessationMsgBanner = isSubmitterCessation
          ? this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.CESSATION_PENDING_APPROVED', {
              CREATEDBYNAME: _createdByNameCessation,
              CREATEDDATE: _createdDateCessation,
            })
          : '';
        this.cessationTypeBanner = isSubmitterCessation ? 'warn-normal' : '';
      } else if (
        this.lawsuitService.currentLitigation.defermentStatus === 'CESSATION' &&
        this.lawsuitService.currentLitigation.cessationInfo?.defermentType === 'CESSATION' &&
        !!this.litigationDetail.cessationInfo?.approved
      ) {
        // CESSATION && Approved
        this.cessationState = defermentState.CESSATION;
        this.cessationMsgBanner = this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.CESSATION_APPROVED', {
          ENDDATE: this.buddhistEraPipe.transform(this.litigationDetail.cessationInfo.startDate, 'DD/MM/YYYY'),
        });
        this.cessationTypeBanner = 'fail-highlight';
      } else if (this.litigationDetail.defermentStatus === 'NORMAL' && (_approved || _approvedCessation)) {
        if (!!this.litigationDetail.defermentInfo?.defermentId) {
          // DEFERMENT && Approved && before efectiveDate - DEFERMENT
          this.defermentState = defermentState.DEFERMENT;
          this.defermentMsgBanner = this.translate.instant(
            'LAWSUIT.DEFERMENT.MESSAGE_BANNER.EFFECTIVE_DATE_DEFERMENT',
            {
              ENDDATE: this.buddhistEraPipe.transform(this.litigationDetail.defermentInfo.endDate, 'DD/MM/YYYY'),
            }
          );
          this.defermentTypeBanner = 'fail-highlight';
        }
        if (!!this.litigationDetail.cessationInfo?.defermentId) {
          // CESSATION && Approved && before efectiveDate - CESSATION
          this.cessationState = defermentState.CESSATION;
          this.cessationMsgBanner = this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.CESSATION_APPROVED', {
            ENDDATE: this.buddhistEraPipe.transform(this.litigationDetail.cessationInfo.startDate, 'DD/MM/YYYY'),
          });
          this.cessationTypeBanner = 'fail-highlight';
        }
      } else if (
        (this.litigationDetail.defermentStatus === 'NORMAL' || isExecutionStatus) &&
        defermentExecInfo &&
        (defermentExecInfo.defermentTaskStatus === 'WAITING_APPROVE_DEFERMENT_EXEC' ||
          defermentExecInfo.defermentTaskStatus === 'REVISE')
      ) {
        // NORMAL DEFERMENT EXECUTION
        if (this.sessionService.currentUser?.userId === defermentExecInfo.createdBy) {
          // show banner only if the current user === the user who created the deferment
          let user = `${this.sessionService.currentUser?.userId}-${defermentExecInfo.createdByName}`;
          let bannerMessage = '';
          if (
            defermentExecInfo.approved &&
            Utils.calculateDateDiff(defermentExecInfo.startDate || '', new Date()) > 0
          ) {
            // hide banner if startDate > today
            this.actionBar.hasDefermentExcution = false;
            this.defermentState = defermentState.NORMAL;
            this.defermentMsgBanner = '';
            this.defermentTypeBanner = '';
          } else {
            if (defermentExecInfo.approved) {
              this.legalExecutionDefermentState = defermentState.DEFERMENT;
            } else {
              this.legalExecutionDefermentState = defermentState.NORMAL_PENDING_APPROVED;
            }
            if (
              isExecutionStatus &&
              (defermentExecInfo.defermentTaskStatus === 'WAITING_APPROVE_DEFERMENT_EXEC' ||
                defermentExecInfo.defermentTaskStatus === 'REVISE') &&
              defermentExecInfo.extendDeferment
            ) {
              switch (this.litigationDetail.defermentExecInfo?.defermentType as string) {
                case 'DEFERMENT_EXEC_SEIZURE':
                  bannerMessage = this.translate.instant(
                    'LAWSUIT.DEFERMENT.MESSAGE_BANNER.WAITING_APPROVE_EXTEND_EXEC_SEIZURE',
                    {
                      USER: user,
                      CREATEDDATE: this.buddhistEraPipe.transform(defermentExecInfo.createdDate, 'DD/MM/YYYY'),
                    }
                  );
                  break;
                case 'DEFERMENT_EXEC_SALE':
                  bannerMessage = this.translate.instant(
                    'LAWSUIT.DEFERMENT.MESSAGE_BANNER.WAITING_APPROVE_EXTEND_EXEC_SALE',
                    {
                      USER: user,
                      CREATEDDATE: this.buddhistEraPipe.transform(defermentExecInfo.createdDate, 'DD/MM/YYYY'),
                    }
                  );
                  break;
                case 'DEFERMENT_EXEC_SEIZURE_SALE':
                  bannerMessage = this.translate.instant(
                    'LAWSUIT.DEFERMENT.MESSAGE_BANNER.WAITING_APPROVE_EXTEND_EXEC_SEIZURE_SALE',
                    {
                      USER: user,
                      CREATEDDATE: this.buddhistEraPipe.transform(defermentExecInfo.createdDate, 'DD/MM/YYYY'),
                    }
                  );
                  break;
              }
            } else {
              switch (this.litigationDetail.defermentExecInfo?.defermentType as string) {
                case 'DEFERMENT_EXEC_SEIZURE':
                  bannerMessage = this.translate.instant(
                    'LAWSUIT.DEFERMENT.MESSAGE_BANNER.WAITING_APPROVE_EXEC_SEIZURE',
                    {
                      USER: user,
                      CREATEDDATE: this.buddhistEraPipe.transform(defermentExecInfo.createdDate, 'DD/MM/YYYY'),
                    }
                  );
                  break;
                case 'DEFERMENT_EXEC_SALE':
                  bannerMessage = this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.WAITING_APPROVE_EXEC_SALE', {
                    USER: user,
                    CREATEDDATE: this.buddhistEraPipe.transform(defermentExecInfo.createdDate, 'DD/MM/YYYY'),
                  });
                  break;
                case 'DEFERMENT_EXEC_SEIZURE_SALE':
                  bannerMessage = this.translate.instant(
                    'LAWSUIT.DEFERMENT.MESSAGE_BANNER.WAITING_APPROVE_EXEC_SEIZURE_SALE',
                    {
                      USER: user,
                      CREATEDDATE: this.buddhistEraPipe.transform(defermentExecInfo.createdDate, 'DD/MM/YYYY'),
                    }
                  );
                  break;
              }
            }

            this.defermentExcutionBanner.message = bannerMessage;
            this.defermentExcutionBanner.type = 'warn-normal';
            this.defermentExcutionBanner.size = 'large';
            this.defermentExcutionBanner.actionButtonIcon = 'icon-Expand';
            this.defermentExcutionBanner.actionButtonClass = 'bold icon-black icon-small-xm full-width max-w-fit';
          }
        }
        this.actionBar.hasDefermentExcution = false;
      } else if (
        defermentExecInfo &&
        ((['DEFERMENT_EXEC_SEIZURE_SALE', 'DEFERMENT_EXEC_SEIZURE', 'DEFERMENT_EXEC_SALE'].includes(
          defermentExecInfo.defermentType || ''
        ) &&
          defermentExecInfo.defermentTaskStatus === 'APPROVED') ||
          (this.litigationDetail?.defermentStatus === 'DEFERMENT_EXEC_SEIZURE' &&
            defermentExecInfo?.defermentTaskStatus === 'DRAFT' &&
            defermentExecInfo.extendDeferment)) &&
        !defermentExecInfo.cancelled
      ) {
        // EXTEND DEFERMENT EXECUTION
        if (defermentExecInfo.approved) {
          this.legalExecutionDefermentState = defermentState.DEFERMENT;
        } else {
          this.legalExecutionDefermentState = defermentState.DEFERMENT_PENDING_APPROVED;
        }
        this.actionBar.hasDefermentExcution = false;
        this.defermentExcutionBanner.message = this.defermentService.getBannerMessageExecution(
          defermentExecInfo?.defermentType as DefermentInfo.DefermentTypeEnum,
          defermentExecInfo.endDate as string
        );
        this.defermentExcutionBanner.type = 'fail-highlight';
        this.defermentExcutionBanner.size = 'large';
        this.defermentExcutionBanner.actionButtonIcon = 'icon-Expand';
        this.defermentExcutionBanner.actionButtonClass = 'bold fail-highlight icon-small-xm full-width max-w-fit';
      }
      if (this.defermentExcutionBanner?.type !== 'fail-highlight') {
        const defermentExecActiveInfo = this.litigationDetail?.defermentExecActiveInfo;
        if (defermentExecActiveInfo?.defermentId) {
          this.actionBar.hasDefermentExcution = false;
          this.defermentExecActiveBanner.message = this.defermentService.getBannerMessageExecution(
            defermentExecActiveInfo?.defermentType as DefermentInfo.DefermentTypeEnum,
            defermentExecActiveInfo.endDate as string
          );
          this.defermentExecActiveBanner.type = 'fail-highlight';
          this.defermentExecActiveBanner.size = 'large';
          this.defermentExecActiveBanner.actionButtonIcon = 'icon-Expand';
          this.defermentExecActiveBanner.actionButtonClass = 'bold fail-highlight icon-small-xm full-width max-w-fit';
        }
      }
    }
  }

  onClickBanner(bannerType?: string) {
    const isExecution = ['DEFERMENT_EXEC_SEIZURE', 'DEFERMENT_EXEC_SALE', 'DEFERMENT_EXEC_SEIZURE_SALE'].includes(
      this.litigationDetail.defermentExecInfo?.defermentType || ''
    );
    this.gotoDeferment(true, isExecution, bannerType === 'EXEC_ACTIVE');
  }

  onClickBannerCessation() {
    this.gotoCessation(true);
  }

  // CLOSE LG
  initCloseStartBannerMessage() {
    const litigationCloseInfo = this.litigationDetail.litigationCloseInfo;
    if (!litigationCloseInfo?.litigationId) this.closeStartedBannerMessage = '';
    this.closeStartedBannerMessage = `เลขที่กฎหมายนี้อยู่ระหว่างขออนุมัติปิดเลขที่กฎหมายโดย startbold ${litigationCloseInfo?.createdBy}-${litigationCloseInfo?.createdByName} เมื่อ ${this.buddhistEraPipe.transform(
      litigationCloseInfo?.createdDate,
      'DD/MM/YYYY'
    )} endbold`;
  }

  // TODO: For R1.3 - verify permission/condition to show/enable button dpends on each user stories
  initActionBar() {
    const accessRole = ['APPROVER', 'MAKER', 'ADMIN'].includes(this.accessPermissions.subRoleCode);
    if (accessRole) {
      if (this.litigationDetail.litigationClosed) {
        // closed litigation
        this.actionBar = {
          hasCancel: false,
          hasPrimary: false,
          hasSave: false,
          hasReject: false,
        };
      } else {
        // normal edit
        // permission of LAWSUIT_CLOSE_LEGAL_ID
        let hasLgId = false;
        if (this.sessionService.hasPermission(PCode.LAWSUIT_CLOSE_LEGAL_ID)) {
          if (this.litigationDetail.litigationClosed) {
            hasLgId = false;
          } else {
            hasLgId = true;
          }
        } else {
          hasLgId = false;
        }
        this.actionBar = {
          hasCancel: false,
          hasPrimary: false,
          hasSave: false,
          hasReject: false,
          primaryIcon: 'icon-Archive',
          hasCreateCase: false,
          hasCreateNotice: this.permissions.includes('CREATE_NOTICE_EVENT'),
          hasDelayLitigation: this.defermentState === defermentState.NORMAL,
          hasDefermentExcution: true,
          hasCloseLg: hasLgId,
          hasCeaseLitigation:
            this.cessationState === undefined ||
            [
              defermentState.NORMAL,
              defermentState.CESSATION_PENDING_APPROVED,
              defermentState.SAVE_DRAFT_CESSATION,
            ].includes(this.cessationState), // fixed lex2-22750
        };
        this.subButtonList = this.initSubButtons();
      }
    } else {
      // cannot edit
      const isApprover = this.sessionService.currentUser?.subRoleCode === 'APPROVER';
      const isViewer = this.sessionService.currentUser?.subRoleCode === 'VIEWER';
      this.actionBar = {
        hasCancel: false,
        hasSave: false,
        hasReject: false,
        hasPrimary: false,
        hasDelayLitigation: isApprover && this.defermentState === defermentState.NORMAL,
        hasDefermentExcution: isApprover || isViewer,
        hasCeaseLitigation: isApprover,
      };
      this.subButtonList = this.initSubButtons();
    }
  }

  // Manage Sub-buttons
  initSubButtons() {
    let _subButtonList = [];
    if (this.actionBar.hasCreateCase) {
      _subButtonList.push({
        name: 'create_case',
        icon: 'icon-Stack',
        text: 'LAWSUIT.BTN_CREATE_CASE',
        disabled: false,
      });
    }
    if (this.actionBar.hasCreateNotice) {
      _subButtonList.push({
        name: 'create_notice',
        icon: 'icon-Email',
        text: 'LAWSUIT.BTN_CREATE_NOTICE',
        disabled: false,
      });
    }
    if (this.actionBar.hasDelayLitigation && this.defermentState !== defermentState.DEFERMENT) {
      _subButtonList.push({
        name: 'delay_litigation',
        icon: 'icon-Pause',
        text: 'LAWSUIT.BTN_DELAY_LITIGATION',
        disabled: false,
      });
    }
    if (this.actionBar.hasDefermentExcution && this.cessationState !== defermentState.CESSATION) {
      _subButtonList.push({
        name: 'deferment_excution',
        icon: 'icon-Pause',
        text: 'LAWSUIT.BTN_DEFERMANT_EXCUTION',
        disabled: false,
      });
    }
    if (this.actionBar.hasCancelDelayLitigation) {
      _subButtonList.push({
        name: 'cancel_delay_litigation',
        icon: '',
        text: 'BTN_DELAY_LITIGATION',
        disabled: false,
      });
    }
    if (this.actionBar.hasCeaseLitigation && this.cessationState !== defermentState.CESSATION) {
      _subButtonList.push({
        name: 'cease_litigation',
        icon: 'icon-Record-Stop',
        text: 'LAWSUIT.BTN_CEASE_LITIGATION',
        disabled: false,
      });
    }
    if (this.actionBar.hasCloseLg) {
      _subButtonList.push({
        name: 'close_case',
        icon: 'icon-Archive',
        text: 'LAWSUIT.BTN_CLOSE_LG_ID',
        disabled: false,
        class: this.cessationState !== defermentState.CESSATION ? 'negative' : '',
      });
    }
    return _subButtonList;
  }
  clearSubButtons() {
    this.subButtonList = [];
  }

  // Tabs
  private saveCurrentTab(tabIndex: number) {
    this.lawsuitService.currentTab = tabIndex;
  }

  private getCurrentTab() {
    this.tabIndex = this.lawsuitService.currentTab ?? 0;
    this.lawsuitService.currentTab = this.tabIndex;
  }

  onRouterLink(item: ITabNav, params?: any) {
    if (!!!item) {
      this.routerService.navigateTo(this.tabsInfo[0].fullPath, params);
      this.onTabNavChanged(this.tabsInfo[0]);
    } else {
      if (item.path === 'nav-tab-litigation-summary-info-tab') {
        this.routerService.navigateTo(item.fullPath, { blackCaseNo: this.blackCaseNo, params });
      } else if (item.path === 'nav-tab-litigation-process-info-tab') {
        this.debtRelatedInfoTabService.loadCustomerDetail.next(false);
        this.debtRelatedInfoTabService.loadLitigationDetail.next(true);
        this.routerService.navigateTo(`${item.fullPath}/nav-sub-tab-debt-related-info-tab`, params);
      } else if (item.path === 'nav-tab-civil-case-info-tab') {
        this.routerService.navigateTo(item.fullPath, params);
      } else if (item.path === 'nav-tab-preference-case-info-tab') {
        this.routerService.navigateTo(item.fullPath, params);
      } else if (item.path === 'nav-tab-audit-log-info-tab') {
        this.auditLogService.refreshLogType.next('LITIGATION');
        this.routerService.navigateTo(item.fullPath, params);
      } else if (item.path === 'nav-tab-investigate-property-info-tab') {
        // this.auditLogService.refreshLogType.next('LITIGATION');
        this.routerService.navigateTo(item.fullPath, params);
      } else {
        if (item.path === 'litigation-summary-info-tab') {
          this.routerService.navigateTo(item.fullPath, { blackCaseNo: this.blackCaseNo, params });
        } else if (item.path === 'litigation-process-info-tab') {
          this.debtRelatedInfoTabService.loadCustomerDetail.next(false);
          this.debtRelatedInfoTabService.loadLitigationDetail.next(true);
          this.routerService.navigateTo(`${item.fullPath}/debt-related-info-tab`, params);
        } else if (item.path === 'civil-case-info-tab') {
          this.routerService.navigateTo(item.fullPath, params);
        } else if (item.path === 'audit-log-tab') {
          this.auditLogService.refreshLogType.next('LITIGATION');
          this.routerService.navigateTo(item.fullPath, params);
        } else if (item.path === 'nav-tab-investigate-property-info-tab') {
          // this.auditLogService.refreshLogType.next('LITIGATION');
          this.routerService.navigateTo(item.fullPath, params);
        } else {
          this.routerService.navigateTo(item.fullPath, params);
        }
      }
      this.onTabNavChanged(item);
    }
  }

  onTabNavChanged(element: ITabNav) {
    this.tabIndex = element.index;
    this.saveCurrentTab(element.index);
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
    this.saveCurrentTab(event.index);
    if (event.tab.textLabel === this.auditTabLabel) {
      this.auditLogService.refreshLogType.next('LITIGATION');
    }
    if (event.index === 4) {
      if (!this.isClickPrepareLawsuit) this.loaderService.enterLoad();
      this.isClickPrepareLawsuit = true;
    }
  }
  setTabIndex(obj: any) {
    this.tabIndex = obj.tabIndex;
  }

  async onBack(event: any) {
    if (this.lawsuitService.hasEdit) {
      if (await this.sessionService.confirmExitWithoutSave()) {
        this.lawsuitService.clearData();
        this.documentService.clearData();
        this.routerService.back();
      }
    } else {
      this.lawsuitService.clearData();
      this.documentService.clearData();
      this.routerService.back();
    }
  }

  async createNotice() {
    const result = await this.lawsuitService.confirmCreateNoticeDialog(
      this.translate.instant('LAWSUIT.NOTI_CREATE_NOTICE_TITLE'),
      `${this.translate.instant('LAWSUIT.NOTI_CREATE_NOTICE_DETAIL1')}<br/>${this.translate.instant(
        'LAWSUIT.NOTI_CREATE_NOTICE_DETAIL2'
      )}<br/>${this.translate.instant('LAWSUIT.NOTI_CREATE_NOTICE_DETAIL3')}`,
      this.translate.instant('LAWSUIT.NOTI_CREATE_NOTICE_CONFIRM')
    );
    const litigationId = this.lawsuitService.currentLitigation?.litigationId
      ? this.lawsuitService.currentLitigation.litigationId
      : '';
    if (result) {
      const resultCreateNoticeManual = await this.lawsuitService.createNoticeManual(litigationId);
      this.notificationService.openSnackbarSuccess(
        `${this.translate.instant('LAWSUIT.NOTI_CREATE_NOTICE_MESSAGE_SUCCESS1')} ` +
          (resultCreateNoticeManual + 1).toString() +
          ` ${this.translate.instant('LAWSUIT.NOTI_CREATE_NOTICE_MESSAGE_SUCCESS2')}`
      );
      //refresh object LitigationNotice on screen
      this.lawsuitService.currentLitigation = await this.lawsuitService.getLitigation(litigationId);
      this.lawsuitService.litigationNotice = null;
      this.prepareLawsuitService.refreshInquiryNotices.next(true);
    }
  }

  // Sub Button Actions
  subButtonHandler(event: any) {
    if (event.name === 'create_case') this.createCase();
    else if (event.name === 'create_notice') this.createNotice();
    else if (event.name === 'delay_litigation') this.gotoDeferment();
    else if (event.name === 'deferment_excution') this.gotoDeferment(false, true);
    else if (event.name === 'cease_litigation') this.gotoCessation();
    else if (event.name === 'close_case') this.closeLg();
  }

  createCase() {}

  async gotoDeferment(goToMain: boolean = false, isExecution: boolean = false, isExecActive: boolean = false) {
    const litigationClosed = await this.alertAndNotProceedIfLgClosed('LAWSUIT.DEFERMENT.FAIL_HEADER');
    if (litigationClosed) {
      this.routerService.back();
      return;
    }
    let defermentExecInfo = this.litigationDetail.defermentExecInfo;
    if (isExecActive) {
      defermentExecInfo = this.litigationDetail.defermentExecActiveInfo;
    }
    let defermentType = isExecution
      ? defermentExecInfo?.defermentType
      : this.litigationDetail.defermentInfo?.defermentType;
    if (goToMain) {
      // this.fetchDataTable(false)
      this.routerService.navigateTo(`/main/lawsuit/deferment/defer/main`, {
        _btnAction: 'DEFERMENT',
        defermentCategory: isExecution ? 'EXECUTION' : 'PROSECUTE',
        litigationId: this.litigationDetail.litigationId || '',
        defermentId: isExecution ? defermentExecInfo?.defermentId : this.litigationDetail.defermentInfo?.defermentId,
        modeFromBtn: 'VIEW',
        customerId: this.litigationDetail.customerId,
        defermentType: defermentType,
        isExecActive: isExecActive,
      });
    } else {
      this.routerService.navigateTo(`/main/lawsuit/deferment/defer`, {
        _btnAction: 'DEFERMENT',
        defermentCategory: isExecution ? 'EXECUTION' : 'PROSECUTE',
        litigationId: this.litigationDetail.litigationId || '',
        litigationDetail: this.litigationDetail,
        customerId: this.litigationDetail.customerId,
        defermentType: defermentType,
      });
    }
  }

  async gotoCessation(goToMain?: boolean) {
    const litigationClosed = await this.alertAndNotProceedIfLgClosed('LAWSUIT.DEFERMENT.FAIL_HEADER_CESSATION');
    if (litigationClosed) {
      this.routerService.back();
      return;
    }
    if (goToMain) {
      this.fetchDataTable(true);
      this.routerService.navigateTo(`/main/lawsuit/deferment/defer/main`, {
        btnAction: 'CESSATION',
        hasCeased: true,
        litigationId: this.litigationDetail.litigationId || '',
        defermentId: this.litigationDetail.cessationInfo?.defermentId,
        modeFromBtn: 'VIEW',
        defermentCategory: 'PROSECUTE',
        customerId: this.litigationDetail.customerId,
      });
    } else {
      this.routerService.navigateTo(`/main/lawsuit/deferment/defer`, {
        btnAction: 'CESSATION',
        hasCeased: true,
        litigationId: this.litigationDetail.litigationId || '',
        litigationDetail: this.litigationDetail,
        defermentCategory: 'PROSECUTE',
        customerId: this.litigationDetail.customerId,
      });
    }
  }

  async closeLg() {
    const litigationClosed = await this.alertAndNotProceedIfLgClosed('LAWSUIT.CLOSE.FAIL_HEADER');
    if (litigationClosed) {
      this.routerService.back();
      return;
    }
    this.routerService.navigateTo('/main/lawsuit/close', {
      lgId: this.litigationDetail.litigationId || '',
    });
  }

  async alertAndNotProceedIfLgClosed(title: string): Promise<boolean> {
    await this.lawsuitService.getLitigation(this.lawsuitService.currentLitigation.litigationId!);
    const litigationClosed = this.lawsuitService.currentLitigation.litigationClosed ? true : false;
    if (litigationClosed) {
      const res = await this.notificationService.alertDialog(title, 'LAWSUIT.DEFERMENT.FAIL_MESSAGE_LITIGATION_CLOSED');
      if (res) return true;
    }
    return false;
  }

  async canDeactivate() {
    const routesWithDataRemain = [
      '/main/customer/profile-direct',
      '/main/lawsuit/deferment/defer',
      '/main/lawsuit/detail/account-detail',
      '/main/lawsuit/close',
      '/main/lawsuit/court/court-detail',
      '/main/lawsuit/detail/add-related-person-legal',
      '/main/lawsuit/execution-warrant',
      '/main/lawsuit/seizure-property',
      '/main/lawsuit/withdrawn-seizure-property',
      '/main/finance/expense/detail/expense-detail-view',
      '/main/finance/receipt/detail',
      '/main/finance/advance/detail',
      '/main/lawsuit/withdrawn-writ-execution',
      '/main/lawsuit',
      '/main/task/court/court-detail',
    ];
    if (routesWithDataRemain.some(path => this.nextRouting.includes(path))) {
      return true;
    }
    this.documentService.clearData();
    this.lawsuitService.clearData();
    return true;
  }

  getDefermentActionButtonClass() {
    return this.defermentState === defermentState.DEFERMENT || this.cessationState === defermentState.CESSATION
      ? 'bold fail-highlight icon-small-xm'
      : 'bold icon-black icon-small-xm';
  }

  async fetchDataTable(hasCeased: boolean) {
    //check  ----
    this.data = await this.defermentService.inquiryDeferment(
      this.lawsuitService.currentLitigation.customerId || '',
      '',
      hasCeased ? DefermentInfo.DefermentTypeEnum.Cessation : DefermentInfo.DefermentTypeEnum.Deferment,
      this.lawsuitService.currentLitigation?.litigationId as string,
      'DASHBOARD'
    );
    this.defermentService.dashboard = this.data;
  }

  async onClickDownloadCopy() {
    await this.documentService.downloadKtbLogisticDoc(this.lawsuitService.currentLitigation?.litigationId || '');
  }
}
