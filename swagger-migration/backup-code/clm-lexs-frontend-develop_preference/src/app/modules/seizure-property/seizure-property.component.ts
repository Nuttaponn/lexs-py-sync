import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import {
  EFilingCategory,
  EFilingPaymentMethod,
  EFilingPaymentMethodDesc,
  NoneEFilingCategory,
  SEIZURE_LED_TYPE,
  SEIZURE_PROPERTY_INFO_TAB_ROUTES,
  SeizureCollateralTypes,
  SeizureLedTypes,
  eFiling3_LED,
} from '@app/shared/constant';
import { ActionBar, ITabNav, IUploadMultiFile, Mode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { coerceString, compare, delay } from '@app/shared/utils';
import { SeizureCollateralInfo, SeizureCollateralsRequest, SeizureLedsInfo } from '@lexs/lexs-client';
import { SimpleSelectOption } from '@spig/core';
import { TaskService } from '../task/services/task.service';
import { AddLegalExecutionDepartmentComponent } from './dialogs';
import {
  AddLegalExecutionDepartmentContext,
  AddLegalExecutionDepartmentResult,
  ILegalExecution,
  INoneLegalExecution,
  LEGAL_EXECUTION_COLUMN,
  NONE_LEGAL_EXECUTION_COLUMN,
  NONE_LEGAL_EXECUTION_NON_PLEDGE_COLUMN,
  SeizureSupportTypeEnum,
} from './models';
import { SeizurePropertyService } from './seizure-property.service';
import { DocumentListDialogComponent } from '@app/shared/components/common-dialogs/document-list-dialog/document-list-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';

const sortLegalExecutionOffices = (legalExecutionMap: Array<ILegalExecution>) => {
  const _seizureLedTypes = SEIZURE_LED_TYPE as string[];
  const selectMain = (row: ILegalExecution) =>
    row.seizureLedType === SeizureLedTypes.MAIN || row.seizureLedType === SeizureLedTypes.MAIN_ADDITIONAL;
  const selectInter = (row: ILegalExecution) =>
    row.seizureLedType === SeizureLedTypes.INTER_REGION ||
    row.seizureLedType === SeizureLedTypes.INTER_REGION_ADDITIONAL;
  const sortByType = (a: ILegalExecution, b: ILegalExecution) =>
    _seizureLedTypes.indexOf(a.seizureLedType) - _seizureLedTypes.indexOf(b.seizureLedType);
  const multipleColumnSort = (a: ILegalExecution, b: ILegalExecution) => {
    // Sort By Name
    let compareResult = 0;
    const namea = a.legalExecutionName?.replace('สำนักงานบังคับคดี', '').replace('จังหวัด', '').replace('แพ่ง', '');
    const nameb = b.legalExecutionName?.replace('สำนักงานบังคับคดี', '').replace('จังหวัด', '').replace('แพ่ง', '');
    compareResult = namea.localeCompare(nameb, 'th');
    if (compareResult !== 0) return compareResult;

    // If Name is same, Sort by Type
    const typeA = a.seizureLedType;
    const typeB = b.seizureLedType;
    compareResult = _seizureLedTypes.indexOf(typeA) - _seizureLedTypes.indexOf(typeB);
    if (compareResult !== 0) return compareResult;

    // If Type is same, sort by e-filing
    const rowA = a.paymentMethod === EFilingPaymentMethodDesc.E_FILING ? 1 : 2;
    const rowB = b.paymentMethod === EFilingPaymentMethodDesc.E_FILING ? 1 : 2;
    compareResult = compare(rowA, rowB, true);
    if (compareResult !== 0) return compareResult;

    return compareResult;
  };

  const sortByLedType = legalExecutionMap.sort(sortByType);

  const sortMain = sortByLedType.filter(selectMain).sort(multipleColumnSort);

  const sortInter = sortByLedType.filter(selectInter).sort(multipleColumnSort);

  return [...sortMain, ...sortInter];
};

@Component({
  selector: 'app-seizure-property',
  templateUrl: './seizure-property.component.html',
  styleUrls: ['./seizure-property.component.scss'],
})
export class SeizurePropertyComponent implements OnInit {
  @ViewChild('paginator') paginator!: any;
  public title!: string;
  public pageIcon!: string;
  public messageBanner!: string | undefined;
  public tabsInfo: ITabNav[] = this.seizurePropertyService.seizurePropertyTabs;
  public legalExecutionSource = new MatTableDataSource<ILegalExecution>([]);
  public noneLegalExecutionSource = new MatTableDataSource<INoneLegalExecution>([]);
  public legalColumn = LEGAL_EXECUTION_COLUMN;
  public noneLegalColumn = NONE_LEGAL_EXECUTION_COLUMN;
  public tabIndex = 0;
  public statusName!: string;
  private taskCode!: taskCode;
  private litigationId!: string;
  private seizureId!: string;
  private isSaved: boolean = false;
  public litigationCaseShortDetail!: any;
  public proceedNextPage: boolean = false;
  public localStates = {
    legalExecutionSection: true,
    noneLegalExecutionSection: true,
    taskCode: '',
    taskStatus: '',
    showBanner: true,
  };

  public actionBar: ActionBar = {
    hasSave: false,
    hasPrimary: false,
    hasCancel: false,
    hasReject: false,
  };
  public pageIndex = 1;
  public pageSize = 10;

  private msgBannerMapper = new Map<taskCode, string>([
    [taskCode.R2E05_01_2D, 'SEIZURE_PROPERTY.MSG_BANNER_E05_01_2D'],
    [taskCode.R2E05_02_3C, 'SEIZURE_PROPERTY.MSG_BANNER_E05_02_3C'],
    [taskCode.R2E05_04_4, 'SEIZURE_PROPERTY.MSG_BANNER_E05_04_4'],
    [taskCode.R2E05_10_5, 'SEIZURE_PROPERTY.MSG_BANNER_E05_10_5'],
    [taskCode.R2E05_08_3A, 'SEIZURE_PROPERTY.MSG_BANNER_E05_08_3A'],
  ]);

  private titleMapper = new Map<taskCode, string>([
    [taskCode.R2E05_01_2D, 'SEIZURE_PROPERTY.TITLE_E05_01_2D'],
    [taskCode.R2E05_02_3C, 'SEIZURE_PROPERTY.TITLE_E05_02_3C'],
    [taskCode.R2E05_04_4, 'SEIZURE_PROPERTY.TITLE_E05_04_4'],
    [taskCode.R2E05_10_5, 'SEIZURE_PROPERTY.TITLE_E05_10_5'],
    [taskCode.R2E05_08_3A, 'SEIZURE_PROPERTY.TITLE_E05_08_3A'],
  ]);

  private iconMapper = new Map<taskCode, string>([
    [taskCode.R2E05_01_2D, 'icon-Task-List'],
    [taskCode.R2E05_02_3C, 'icon-Task-List'],
    [taskCode.R2E05_04_4, 'icon-Task-List'],
    [taskCode.R2E05_10_5, 'icon-Task-List'],
    [taskCode.R2E05_08_3A, 'icon-Task-List'],
  ]);

  get isNonMortgage() {
    return this.noneMortgageParams || [taskCode.R2E05_10_5].includes(this.taskService.taskDetail.taskCode as taskCode);
  }
  get noneMortgageParams() {
    return this.route.snapshot.queryParamMap.get('supportType') === SeizureSupportTypeEnum.NON_MORTGAGE;
  }

  constructor(
    private notificationService: NotificationService,
    private taskService: TaskService,
    private routerService: RouterService,
    private litigationCaseService: LitigationCaseService,
    private activeRoute: ActivatedRoute,
    private sessionService: SessionService,
    private seizurePropertyService: SeizurePropertyService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  private resetPageIndex() {
    if (this.paginator) {
      this.paginator['pageIndex'] = 1;
    }
    this.pageIndex = 1;
  }

  get caseDetailsTitle() {
    return this.taskCode === taskCode.R2E05_04_4 ? 'TITLE_MSG.SEIZURE_PROPERTY_DETAIL' : 'TITLE_MSG.CASE_DETAIL';
  }

  get mode() {
    // set mode VIEW / EDIT with condition routing from which menu
    // IF form task menu, ELSE form litigation menu or other conditions
    return this.routerService.navigateFormTaskMenu ? 'EDIT' : 'VIEW';
  }

  get caseDetailHidelawyer() {
    return [taskCode.R2E05_01_2D, taskCode.R2E05_02_3C, taskCode.R2E05_07_2A].includes(this.taskCode);
  }

  ngOnInit(): void {
    this.getStates();
    this.initTitleMsgBar();
    this.initIconBar();
    this.initActionBar();
    this.loadCase();
    this.loadInfo();
  }

  handleViewOnly() {
    if (this.mode === Mode.VIEW) {
      this.noneLegalColumn.pop();
      this.actionBar.hasPrimary = false;
      this.localStates.showBanner = false;
    } else {
      this.noneLegalColumn = [...NONE_LEGAL_EXECUTION_NON_PLEDGE_COLUMN];
    }
  }

  loadCase() {
    this.litigationCaseShortDetail = this.litigationCaseService.litigationCaseShortDetail;
  }

  getStates() {
    const { statusCode, taskCode } = this.taskService.taskDetail;
    this.localStates.taskStatus = statusCode || '';
    this.localStates.taskCode = taskCode || '';
    this.taskCode = taskCode as taskCode;
    this.statusName = this.taskService.taskDetail.statusName || '';
    this.litigationId =
      this.taskService.taskDetail.litigationId || this.activeRoute.snapshot.queryParamMap.get('litigationId') || '';
    this.seizureId =
      this.taskService?.taskDetail?.objectId || this.activeRoute.snapshot.queryParamMap.get('seizureId') || '';
  }

  initTitleMsgBar() {
    if (this.mode !== 'VIEW') {
      this.title = this.titleMapper.get(this.taskCode) || '';
      if (!this.title) {
        this.title = 'SEIZURE_PROPERTY.TITLE';
      }
    } else if (this.noneMortgageParams) {
      this.title =
        'รายละเอียดการยึดทรัพย์นอกจำนอง ครั้งที่ ' + this.activeRoute.snapshot.queryParamMap.get('index') || '';
    } else {
      this.title = 'รายละเอียดการยึดทรัพย์จำนอง ครั้งที่ ' + this.activeRoute.snapshot.queryParamMap.get('index') || '';
    }
    this.messageBanner = this.msgBannerMapper.get(this.taskCode);
  }

  initIconBar() {
    if (this.mode !== 'VIEW' || (this.mode === 'VIEW' && this.taskCode)) {
      this.pageIcon = this.iconMapper.get(this.taskCode) || '';
      if (!this.pageIcon) {
        this.title = 'icon-Box-Bag-Circle';
      }
    } else {
      this.pageIcon = 'icon-Box-Bag-Circle';
    }
  }

  initActionBar() {
    switch (this.taskCode) {
      case taskCode.R2E05_01_2D:
        this.actionBar = {
          ...this.actionBar,
          hasSave: true,
          saveText: 'COMMON.BUTTON_SAVE',
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_FINISH',
        };
        break;
      case taskCode.R2E05_04_4:
        this.actionBar = {
          ...this.actionBar,
          ...{
            hasSave: false,
            hasPrimary: true,
            primaryText: 'COMMON.BUTTON_FINISH',
          },
        };
        break;
      case taskCode.R2E05_10_5:
        this.actionBar = {
          ...this.actionBar,
          ...{
            hasSave: false,
            hasPrimary: true,
            primaryText: 'COMMON.BUTTON_FINISH',
          },
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

  onRouterLink(item: ITabNav) {
    this.tabIndex = item.index;
    this.routerService.navigateTo(item.fullPath);
  }

  onBack(event?: any) {
    const fromCaseDetailScreen = this.routerService.previousUrl.indexOf('lawsuit') > -1;
    if (fromCaseDetailScreen) {
      // Navigate with full path to make tabs working.
      // There's issue with routerService.back() to work with tab.
      return this.routerService.navigateTo(SEIZURE_PROPERTY_INFO_TAB_ROUTES.PROCESSING_INFO_TAB, {
        litigationId: this.litigationId,
      });
    }

    return this.routerService.back();
  }

  clearData() {
    this.litigationCaseService.listCollaterals = [];
    this.seizurePropertyService.documentsTitleDeed = [];
    this.seizurePropertyService.seizureDocumentsTitleDeed = [];
    this.taskService.taskDetail = {};
    this.seizurePropertyService.hasEdit = false;
    this.seizurePropertyService.seizurePageType = '' as SeizureCollateralTypes;
  }

  async canDeactivate() {
    const isValidateLawyerForm = this.validateLawyerForm();
    if (isValidateLawyerForm || this.seizurePropertyService.hasEdit) {
      if (await this.sessionService.confirmExitWithoutSave()) {
        this.clearData();
        return true;
      } else {
        // reverse url stack
        this.routerService.currentStack.push(this.routerService.nextUrl);
        return false;
      }
    } else {
      !this.proceedNextPage && this.clearData();
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

  loadInfo() {
    if (this.isNonMortgage) {
      this.noneLegalColumn = [...NONE_LEGAL_EXECUTION_NON_PLEDGE_COLUMN];
    }
    this.seizurePropertyService.getCollateralLEDById(this.seizureId).then(resp => {
      this.loadExecutionTable(resp.seizureLedsInfoList);
      this.loadUnmapCollateralTable(resp.unMappedCollaterals);
      this.handleViewOnly();
    });
  }

  loadExecutionTable(seizureLedsInfoList: SeizureLedsInfo[] = []) {
    const sortedOffices = seizureLedsInfoList.map((row, index) => {
      const deletable = row.seizureLedType !== SeizureLedTypes.MAIN;
      return <ILegalExecution>{
        seizureId: coerceString(row.seizureId),
        seizureLedId: coerceString(row.id),
        orderNo: index + 1,
        SLAClasses:
          !!row.daysSpent && (!!row.daysSla || row.daysSla === 0) && row.daysSpent > row.daysSla ? 'fill-red' : '',
        SLA: `${row.daysSpent ? row.daysSpent || 0 : row.daysSla ? 0 : '-'}/${row.daysSla ? row.daysSla || 0 : '-'}`,
        legalExecutionName: row.ledName || '',
        legalDepartment: 'SEIZURE_OFFICE_TYPE.' + row.seizureLedType,
        seizureLedType: row.seizureLedType,
        totalAsset: coerceNumberProperty(row.collaterals?.length, 0),
        keepDate: row.ledRefNoDate,
        seizureDate: row.seizureTimestamp,
        collectionNumber: coerceString(row.ledRefNo),
        reportStatus: row.status,
        paymentMethod: coerceString(row.paymentMethod, 'UNKNOWN'),
        isFeePaid: row.isFeePaid,
        action: {
          deletable:
            this.mode === 'EDIT' &&
            deletable &&
            row.status !== 'COMPLETED' &&
            !(
              row.paymentMethod === 'NON-E-FILING' &&
              row.status &&
              ['PENDING_RECEIPT_UPLOAD', 'RECEIPT_VERIFICATION_COMPLETED'].includes(row.status)
            ),
          actionable:
            this.mode === 'EDIT' &&
            row.status !== 'COMPLETED' &&
            !(
              row.paymentMethod === 'NON-E-FILING' &&
              row.status &&
              ['PENDING_RECEIPT_UPLOAD', 'RECEIPT_VERIFICATION_COMPLETED'].includes(row.status)
            ) &&
            true,
          view:
            this.mode === 'VIEW' ||
            row.status === 'COMPLETED' ||
            (row.paymentMethod === 'NON-E-FILING' &&
              row.status &&
              ['PENDING_RECEIPT_UPLOAD', 'RECEIPT_VERIFICATION_COMPLETED'].includes(row.status)),
        },
        documents: row.documents,
        collaterals: row.collaterals,
        createdTimestamp: row.createdTimestamp,
      };
    });

    this.legalExecutionSource.data = sortLegalExecutionOffices(sortedOffices);
    this.resetPageIndex();
  }

  loadUnmapCollateralTable(unMappedCollaterals: SeizureCollateralInfo[] = []) {
    const noneLegalExecutionSource = this.isNonMortgage
      ? this.mapAssets(unMappedCollaterals)
      : this.mapCollaterals(unMappedCollaterals);
    this.noneLegalExecutionSource.data = noneLegalExecutionSource;
    this.noneLegalExecutionSource.filteredData = this.noneLegalExecutionSource.data.slice(0, 10);
  }

  private mapCollaterals(unMappedCollaterals: SeizureCollateralInfo[]) {
    return unMappedCollaterals.map((value, index) => {
      return <INoneLegalExecution>{
        collateralId: coerceString(value?.collateralId),
        orderNo: index + 1,
        legalNumber: coerceString(value?.collateralId),
        legalType: coerceString(value?.collateralTypeDesc),
        legalSubType: coerceString(value?.collateralSubTypeDesc),
        owner: coerceString(value?.ownerFullName),
        documentNo: coerceString(value?.documentNo),
        propertieDesc: coerceString(value?.collateralDetails),
        totalAppraisalValue: coerceString(value?.totalAppraisalValue),
        collateralCmsStatus: coerceString(value?.collateralCmsStatus).toUpperCase(),
        collateralCaseLexsStatus: coerceString(value?.collateralCaseLexStatus),
        collateralType: coerceString(value.collateralType),
        action: {
          actionable: true,
        },
      };
    });
  }

  private mapAssets(unMappedCollaterals: SeizureCollateralInfo[]) {
    return unMappedCollaterals.map((value, index) => {
      return <INoneLegalExecution>{
        collateralId: coerceString(value?.assetId),
        orderNo: index + 1,
        legalNumber: coerceString(value?.documentNo),
        legalType: coerceString(value?.assetTypeDesc),
        legalSubType: coerceString(value?.assetSubTypeDesc),
        owner: coerceString(value?.ownerFullName),
        documentNo: coerceString(value?.documentNo),
        propertieDesc: coerceString(value?.collateralDetails),
        totalAppraisalValue: coerceString(value?.totalAppraisalValue),
        collateralCmsStatus: coerceString(value?.collateralCmsStatus).toUpperCase(),
        collateralCaseLexsStatus: coerceString(value?.collateralCaseLexStatus),
        collateralType: coerceString(value.assetType),
        assentRlsStatus: value.assentRlsStatus,
        obligationStatus: value.obligationStatus,
        assetDocuments: value.assetDocuments,
        action: {
          actionable: true,
        },
      };
    });
  }

  /**
   * Delete legal execution department (ลบสำนักงานบังคับคดี)
   * @param element
   * @returns
   */
  async onDeleteSeizureExecution(element: ILegalExecution) {
    if (element.isFeePaid) {
      const title = `ไม่สามารถลบ ${element.legalExecutionName}`;
      const msg = `เพราะมีการจ่ายเงินผ่านระบบ e-filling แล้ว`;
      return await this.notificationService.alertDialog(title, msg);
    }

    return await this.notificationService
      .confirmRemoveLeftAlignedDialog(
        `ต้องการลบ ${element.legalExecutionName}`,
        `หากลบ <strong>${element.legalExecutionName}</strong> จำเป็นต้องระบุสำนักงาน บังคับคดีของหลักประกันภายใต้สำนักงานบังคับคดีใหม่`,
        {
          rightButtonLabel: 'ยืนยันลบสำนักงานบังคับคดี',
        }
      )
      .then(ok => {
        if (ok) {
          this.seizurePropertyService.deleteSeizureLed(element.seizureId, element.seizureLedId);
          return Promise.resolve();
        }

        return Promise.reject('User cancel the action');
      })
      .then(() => this.toast('ลบสำนักงานบังคับคดีสำเร็จแล้ว'))
      .then(() => delay(500)) // TODO: Why do deley?
      .then(() => this.loadInfo());
  }

  /**
   * Go to SeizureResultDetailComponent screen
   * @param element
   */
  onProceedLegalExecution(element: ILegalExecution, mode: string = Mode.EDIT) {
    let path: string = '';
    if (mode === Mode.VIEW) {
      path = this.routerService.currentRoute.includes('/main/lawsuit')
        ? `/main/lawsuit/seizure-property/execution-detail`
        : `/main/task/seizure-property/execution-detail`;
    } else {
      path = `/main/task/seizure-property/execution-detail`;
    }
    this.proceedNextPage = true;
    this.routerService.navigateTo(path, {
      mode: mode,
      seizureId: element.seizureId,
      seizureLedId: element.seizureLedId,
      paymentMethod: element.paymentMethod,
      supportType:
        this.taskCode === taskCode.R2E05_10_5 || this.isNonMortgage ? SeizureSupportTypeEnum.NON_MORTGAGE : '',
    });
  }

  /**
   * Add new seizure execution office
   * @param element
   * @returns
   */
  async onSelectLegalExecution(element: INoneLegalExecution) {
    return await this.seizurePropertyService.getExecutionOffices(this.seizureId).then(async options => {
      const simpleOptions = <SimpleSelectOption[]>(
        options.map(option => ({ text: option.ledName, value: option.ledId }))
      );
      const isForceSelectEFiling =
        EFilingCategory.includes(element.collateralType) ||
        NoneEFilingCategory.includes(element.collateralType) ||
        false;
      const selectedEFiling = isForceSelectEFiling
        ? EFilingCategory.includes(element.collateralType)
          ? EFilingPaymentMethod.E_FILING
          : EFilingPaymentMethod.NONE_E_FILING
        : null;
      const context: AddLegalExecutionDepartmentContext = {
        offices: simpleOptions,
        forceSelectEFiling: isForceSelectEFiling,
        selectedEFiling: selectedEFiling,
      };

      return await this.notificationService
        .showCustomDialog({
          context: context,
          component: AddLegalExecutionDepartmentComponent,
          type: 'large',
          autoWidth: false,
          panelCssClasses: ['custom-dialog-large'],
          title: this.isNonMortgage
            ? `เพิ่มเลขที่เอกสารสิทธิ์ ${element.legalNumber} ไปที่สำนักงานบังคับคดี`
            : `เพิ่มเลขที่หลักประกัน ${element.legalNumber} ไปที่สำนักงานบังคับคดี`,
          iconName: 'icon-Plus',
          rightButtonLabel: this.isNonMortgage ? 'ยืนยันเพิ่มเลขที่เอกสารสิทธิ์' : 'COMMON.BUTTON_CONFIRM',
          buttonIconName: 'icon-Selected',
          leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        })
        .then(async ({ selectedOffice, selectedEFiling }: AddLegalExecutionDepartmentResult) => {
          if (selectedOffice && selectedEFiling) {
            // call API to add legal execution to table
            const ledId = coerceString(selectedOffice.value, '');
            const collateralId = coerceString(element.collateralId, '');
            const seizureId = coerceString(this.seizureId, '');
            let payload: SeizureCollateralsRequest = {};
            if (this.isNonMortgage) {
              payload = {
                collaterals: [{ assetId: Number(collateralId), paymentMethod: selectedEFiling }],
              };
            } else {
              payload = {
                collaterals: [{ collateralId: collateralId, paymentMethod: selectedEFiling }],
              };
            }

            await this.seizurePropertyService.mapNewSeizureExecution(seizureId, ledId, payload);
            return selectedOffice;
          }
          return Promise.reject('User unselelect legal execution office');
        })
        .then((selectedOffice: SimpleSelectOption) =>
          this.isNonMortgage
            ? this.toast(`เพิ่มเลขที่เอกสารสิทธิ์ ${element.legalNumber} ไปยัง${selectedOffice.text}แล้ว`)
            : this.toast(`เพิ่มหลักประกัน ${element.legalNumber} ไปยัง${selectedOffice.text}แล้ว`)
        )
        .then(() => this.loadInfo());
    });
  }

  onOpenEFillWebsite() {
    window.open(eFiling3_LED, '_blank');
  }

  toast(msg: string) {
    return this.notificationService.openSuccessBanner(msg, {
      buttonText: 'COMMON.BUTTON_ACKNOWLEDGE',
    });
  }

  async onSubmit() {
    switch (this.taskCode) {
      case taskCode.R2E05_04_4:
      case taskCode.R2E05_10_5:
        let document = false;
        let status = false;
        this.legalExecutionSource.data.forEach((leds: any) => {
          document = leds.documents?.every((doc: any) => {
            return (!doc.documentTemplate.optional && doc.imageId) || doc.documentTemplate.optional;
          });
          status = leds.collaterals?.every((s: any) => {
            return s.seizureStatus === 'COMPLETED' || s.seizureStatus === 'FAILED';
          });
        });
        if (
          ((this.noneLegalExecutionSource.data && this.noneLegalExecutionSource.data.length === 0) ||
            !this.noneLegalExecutionSource.data) && // unMappedCollaterals[] is empty or null
          document &&
          status // All required/selected documents has attribute imageId != null && All collaterals has attribute seizureStatus = 'COMPLETED' or 'FAILED'
        ) {
          try {
            await this.seizurePropertyService.submitSeizure(this.seizureId);
            let successMessage = `เลขที่กฎหมาย: ${this.litigationId} งานบันทึกผลการยึดทรัพย์จำนองเสร็จสิ้นแล้ว`;
            if (this.isNonMortgage) {
              successMessage = `เลขที่กฎหมาย: ${this.litigationId} งานบันทึกผลการยึดทรัพย์นอกจำนองเสร็จสิ้นแล้ว`;
            }
            this.notificationService.openSnackbarSuccess(successMessage);
            this.onBack();
          } catch (error) {
            this.seizurePropertyService.handleSaveError(error as HttpErrorResponse);
          }
        } else {
          await this.notificationService.alertDialog(
            'EXCEPTION_CONFIG.TITLE_ERROR_SUBMIT_TASK',
            'กรุณาเลือกสำนักงานบังคับคดีและบันทึกผลให้ครบถ้วนก่อน'
          );
        }
        break;
      default:
        console.log('-- onSubmit : else condition --');
        break;
    }
  }

  onPaging(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.noneLegalExecutionSource.filteredData = this.noneLegalExecutionSource.data.slice(
      e.startLabel ? e.startLabel - 1 : 0,
      e.fromLabel
    );
  }

  async onClickAssetDocuments(element: any) {
    const documentList: IUploadMultiFile[] = (element.assetDocuments ?? []).map((dto: any) => {
      return {
        ...dto,
        uploadDate: dto.uploadTimestamp,
      } as IUploadMultiFile;
    });

    const context = {
      documentList,
    };
    await this.notificationService.showCustomDialog({
      component: DocumentListDialogComponent,
      type: 'large',
      iconName: 'icon-Document-Text',
      title: 'AUCTION_DETAIL.AUCTION_PAYMENT.DOCUMENT_LIST',
      rightButtonLabel: 'COMMON.BUTTON_ACKNOWLEDGE',
      buttonIconName: 'icon-Selected',
      context: context,
      autoWidth: false,
    });
  }
}
