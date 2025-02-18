import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Pipe,
  PipeTransform,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { DOC_TEMPLATE } from '@app/shared/constant';
import {
  FileType,
  IMessageBanner,
  IUploadMultiFile,
  IUploadMultiInfo,
  TaskCodeDeferExecution,
  taskCode,
} from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import {
  DefermentApprovalHistoryInfo,
  DefermentCollateralInquiryDto,
  DefermentDto,
  DefermentExecDto,
  DefermentExecHeaderDetails,
  DefermentExecItem,
  DefermentHeaderDetails,
  DefermentInfo,
  DefermentItem,
  DefermentLitigationDebtInfo,
  DefermentLitigationInfo,
  DocumentDto,
  InquiryDefermentExecRequest,
  InquiryDefermentRequest,
  LitigationCaseDebtInfo,
  LitigationDetailDto,
  LitigationsCollateralsDto,
  SuspendAuctionCollateralDto,
  SuspendAuctionDocumentRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig, NameValuePair, SimpleSelectOption } from '@spig/core';
import { SubSink } from 'subsink';
import { IDocument, defermentState } from '../deferment.model';
import { IDeferment } from '../deferment.resolver';
import { DefermentService } from './../deferment.service';

@Pipe({
  name: 'totalDebtAmount',
})
export class TotalDebtAmountPipe implements PipeTransform {
  transform(value: LitigationCaseDebtInfo[]): number {
    if (value && value.length > 0) {
      let sum = 0;
      value.forEach(item => {
        sum = Number(sum) + Number(item.debtAmount || 0);
      });
      return sum;
    }
    return 0;
  }
}

@Component({
  selector: 'app-deferment-detail',
  templateUrl: './deferment-detail.component.html',
  styleUrls: ['./deferment-detail.component.scss'],
})
export class DefermentDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() documentUpload: Array<any> = [];
  @Input() readOnlyDocuments: Array<any> = [];
  @Input() documentUploadCancelCessation: Array<any> = [];
  @Input() dataForm!: UntypedFormGroup;
  @Input() approverId: string | undefined;
  @Input() hasCancelDeferment: boolean = false;
  @Input() _btnAction!: string;
  @Input() defermentCategory: 'EXECUTION' | 'PROSECUTE' = 'PROSECUTE';
  @Input()
  set extendDeferment(value: boolean) {
    this.hasExtendDeferment = value;

    this.deferment = this.defermentService.deferment;
    this.defermentApprovesList = this.deferment.defermentApproves || [];
    this.defermentApprovalHistoryInfos = this.deferment.deferment?.defermentApprovalHistoryInfos || [];
    this.getDefermentDuration();
    if (value && this.isExecution) {
      this.setExecutionDate();
      this.setDefaultDefermentExecApprover();
      this.setSeizureProperties();
      this.defermentService.selectedSeizureProperties = (
        this.defermentService.deferment as DefermentExecDto
      ).deferment?.collaterals?.concat(
        (this.defermentService.deferment as DefermentExecDto).deferment?.collateralNoAnnounceAuctions || []
      ) as LitigationsCollateralsDto[];
      this.defermentService.selectedCollateralSets = (
        this.defermentService.deferment as DefermentExecDto
      ).deferment?.collateralDeedGroups;
      this.getEmptySuspendAuctionDocument();
    }
  }
  @Input() viewModeExtendDeferment: boolean = false;
  @Input() defermentState?: defermentState;
  @Input() defermentMessageBanner!: IMessageBanner;
  @Input() hasCeased: boolean = false;
  @Input() hasSufficientDoc!: boolean;
  @Input() hasCancelCessation: boolean = false;
  @Input() cessationState?: defermentState;
  @Input() cessationMessageBanner!: IMessageBanner;
  @Input() hasAutoCreate!: string;
  @Input() taskId!: number;
  @Input()
  set currentLitigationObj(value: LitigationDetailDto) {
    this.currentLitigation = { ...value };
    this.isDisable =
      this.currentSubRoleCode === 'MAKER' &&
      ((!this.hasCeased &&
        !!!this.currentLitigation.defermentInfo?.approved &&
        this.defermentState !== defermentState.DEFERMENT) ||
        (this.hasCeased &&
          !!!this.currentLitigation.cessationInfo?.approved &&
          this.defermentState !== defermentState.CESSATION));
    this.uploadMultiInfo = {
      cif: this.currentLitigation.customerId || '',
      litigationId: this.currentLitigation.litigationId,
    };
  }
  @Output() detailView = new EventEmitter<DefermentItem>();
  @Input() isDetailView: boolean = false;
  @Input() state!: 'INITIAL' | 'MAIN';

  public currentLitigation: LitigationDetailDto = {};
  public customerName: string = '';
  public headerDetails: DefermentHeaderDetails | DefermentExecHeaderDetails = {};
  public hasExtendDeferment: boolean = false;
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public isViewMode: boolean = false;
  public currentSubRoleCode = this.sessionService.currentUser?.subRoleCode;

  // LEX2-108
  public totalPaymentColumn: string[] = ['no', 'lgId', 'blackNo', 'redNo', 'totalAmount'];
  public paymentList!: any[];
  public ARPPROVE_ACTOR_ENUM = DefermentApprovalHistoryInfo.ApproveActorEnum;
  public ARPPROVE_RESULT_ENUM = DefermentApprovalHistoryInfo.ApproveResultEnum;
  public defermentColumn: string[] = ['no', 'approver', 'level', 'result', 'date'];
  public cessationColumn: string[] = [
    'cessationDate',
    'cancelDate',
    'approvalDate',
    'cessationReason',
    'document',
    'cessationBy',
  ];
  public defermentReason: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'LAWSUIT.DEFERMENT.REASON',
  };
  public executionReasonConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'LAWSUIT.DEFERMENT.REASON_EXEC',
  };
  public defermentReasonOptions: NameValuePair[] = [];
  public approval: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'LAWSUIT.DEFERMENT.APPROVAL',
  };
  public approvalOptions: NameValuePair[] = [];
  public dlaConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'DLA',
  };
  public dlaOption: NameValuePair[] = [];
  public cessationReason: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'LAWSUIT.DEFERMENT.CESSATION_REASON',
  };
  public cessationReasonOptions: NameValuePair[] = [];
  public uploadMultiInfo: IUploadMultiInfo = { cif: '' };
  public data: IDeferment = {};
  public deferment: DefermentDto = {};
  public defermentInfo!: Array<DefermentLitigationInfo>;
  public defermentApprovesList!: Array<DefermentItem>;
  public defermentApprovalHistoryInfos!: Array<DefermentApprovalHistoryInfo>;
  public currentDate: Date = new Date();
  public defermentDuration: number = 0;
  public isPermitted!: boolean;
  public RESPONSE_UNIT_TYPE_ENUM = DefermentItem.ResponseUnitTypeEnum;
  public cumulativeDefermentDays!: number;
  public isResponseUnit!: boolean;
  public isAMDResponseUnit!: boolean;
  public isDefermentOver!: boolean;
  public defermentStateEnum = defermentState;
  public isMaker!: boolean;
  public isDisable!: boolean;
  public flagEdit!: boolean;
  public CIFColumn: string[] = ['check', 'lgid', 'status', 'date']; // ['check', 'lgid', 'status', 'date', 'prescriptionDate'];
  public dataTable: Array<DefermentItem> = [];
  public CIFTable!: DefermentLitigationInfo[];
  public CIFSubColumn: string[] = ['no', 'litigationId', 'principle', 'debt', 'estimate'];
  public cifSubTable: Array<DefermentLitigationDebtInfo> = [];
  public olddata: Array<any> = [];
  public isTextarea: boolean = true;
  public selection = new SelectionModel<any>(true, []);
  public litigationId!: string;
  public persons: any[] = [];
  public initialDataTable: Array<DefermentItem> = [];

  public collaterals: DefermentCollateralInquiryDto[] = [];
  public seizureCollaterals: DefermentCollateralInquiryDto[] = [];
  public saleCollaterals: DefermentCollateralInquiryDto[] = [];
  public collateralSets: any[] = [];
  public collateralColumns: string[] = [];
  public collateralSetsColumns: string[] = ['no', 'fsubbidnum', 'totalDeeds', 'blackCaseNo', 'saletypedesc', 'appoint'];
  public isReverse = false; // for sorting document execution

  private orderOptions = [
    { text: this.translateService.instant('FINANCE.ORDER_BY_ADVANCE_NO_ASC'), value: '0_ASC' },
    { text: this.translateService.instant('FINANCE.ORDER_BY_ADVANCE_NO_DESC'), value: '0_DESC' },
  ];
  private configDropdown: DropDownConfig = {
    iconName: 'icon-Filter',
    searchPlaceHolder: '',
    labelPlaceHolder: 'COMMON.LABEL_LITIGATION_ID',
  };

  public inProgressTaskSortingCtrl: UntypedFormControl = new UntypedFormControl('0_DESC');
  public inProgressTaskSortingConfig: DropDownConfig = this.configDropdown;
  public inProgressTaskSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  public tabIndex = 0;

  public defermentListColumn: string[] = [
    'no',
    'defermentDate',
    'defermentDeadline',
    'approveDate',
    'defermentDuration',
    'lgid',
    'defermentCancelDate',
    'defermentReason',
    'document',
    'defermentBy',
  ];
  public defermentHistoryColumn: string[] = [
    'no',
    'defermentDate',
    'defermentDeadline',
    'approveDate',
    'defermentDuration',
    'lgid',
    'defermentCancelDate',
    'defermentReason',
    'document',
    'defermentBy',
    'status',
  ];
  @Output() selectPersons = new EventEmitter<any>();
  public isExecution: boolean = false;
  public taskCode = this.taskService.taskDetail.taskCode;
  public statusCode = this.taskService.taskDetail.statusCode;
  public mode!: InquiryDefermentRequest.ModeEnum;
  private subs = new SubSink();
  public notFoundMsgCIF = `ไม่พบข้อมูลภาระหนี้และหลักประกัน \n กรุณาระบุทรัพย์จำนอง`;
  public defermentTaskStatus = this.defermentService?.deferment?.deferment?.defermentTaskStatus;
  public defermentRole = this.defermentService.dashboard?.defermentRole;
  public DefermentRoleEnum = DefermentDto.DefermentRoleEnum;
  public isBackFromHistory = false;
  public hideTabFlag = false; // for check tab approve, history on deferment detail
  public relatedDocumentUpload: IUploadMultiFile[] = [];

  private customerId = '';

  constructor(
    private translateService: TranslateService,
    private defermentService: DefermentService,
    private taskService: TaskService,
    private sessionService: SessionService,
    private documentService: DocumentService,
    private routerService: RouterService,
    private route: ActivatedRoute
  ) {
    this.data = this.defermentService.dataResolve;
    this.defermentReasonOptions = this.data?.defermentReason || [];
    this.approvalOptions = this.data?.approvalAuthority || [];
    this.cessationReasonOptions = this.data?.cessationReason || [];
    this.dlaOption = this.data?.approvalAuthorityDla || [];
    this.dataTable = this.defermentService?.dashboard?.defermentPresents as Array<DefermentItem>;
    this.litigationId = this.currentLitigation.litigationId || '';
    this.defermentCategory = this.data?.defermentCategory || 'PROSECUTE';

    if (this.taskService.taskDetail.taskCode === taskCode.R2E07_02_B) {
      this.collateralColumns = [
        'selection',
        'order',
        'collateralId',
        'collateralType',
        'collateralSubType',
        'collateralDetails',
        'totalAppraisalValue',
        'appraisalDate',
        'ownerName',
        'insurancePolicyNumber',
        'collateralCaseLexStatus',
      ];
    } else {
      this.collateralColumns = [
        'selection',
        'order',
        'collateralId',
        'collateralType',
        'collateralSubType',
        'collateralDetails',
        'totalAppraisalValue',
        'appraisalDate',
        'ownerName',
        'insurancePolicyNumber',
        'litigationId',
        'collateralCaseLexStatus',
      ];
    }

    if (!this.routerService.previousUrl.includes('/main/lawsuit/deferment/defer/debt-summary'))
      this.defermentService.paramTemp = this.route.snapshot.queryParams;
    this.subs.add(
      this.route.queryParams.subscribe(value => (this.cifSubTable = value['dataTable'])),
      this.route.queryParams.subscribe(value => (this.flagEdit = value['flagEdit'])),
      this.route.queryParams.subscribe(value => (this.mode = value['modeFromBtn'])),
      this.route.queryParams.subscribe(value => (this.isDetailView = value['isDetailView'] === 'true'))
    );
  }

  async ngOnInit(): Promise<void> {
    await this.initData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hasCancelDeferment'] && this.hasCancelDeferment && this.isExecution) {
      this.initDocumentCancelWithDebtChanges(this.dataForm.get('cancelWithDebtChanges')?.value);
    }
    if (changes['isDetailView']?.currentValue === false && changes['isDetailView']?.previousValue === true) {
      this.mode = this.defermentService.paramTemp?.modeFromBtn || this.mode;
      this.isBackFromHistory = true;
      this.hideTabFlag = false;
      this.initData();
    }
  }

  async initData() {
    this.isExecution = this.defermentCategory === 'EXECUTION';
    this.customerId = !!this.currentLitigation.customerId
      ? this.currentLitigation.customerId
      : this.deferment.deferment?.customerId || '';
    if (this.isExecution) {
      this.defermentReason.labelPlaceHolder = this.translateService.instant('LAWSUIT.DEFERMENT.REASON_EXEC');
      this.setDefaultDefermentExecApprover();
      this.setSeizureProperties();
      this.filterDebtInfoExecTable();
      if (this.mode !== 'ADD' && this.mode !== 'EDIT') {
        this.state = 'MAIN';
      } else {
        if (
          this.seizureCollaterals.length === 0 &&
          this.saleCollaterals.length === 0 &&
          this.collateralSets.length === 0
        ) {
          this.state = 'INITIAL';
        }
      }
      if (
        (this.defermentService?.selectedSeizureProperties &&
          this.defermentService?.selectedSeizureProperties?.length > 0) ||
        (this.defermentService?.selectedCollateralSets && this.defermentService?.selectedCollateralSets?.length > 0)
      ) {
        if (this.mode === 'ADD' || this.mode === 'EDIT') {
          this.setExecutionDate();
          this.setDefaultDefermentExecApprover();
        }
      }
      if (
        (this.mode === 'ADD' || this.mode === 'EDIT') &&
        (this.saleCollaterals.length > 0 || this.collateralSets.length > 0)
      ) {
        await this.getEmptySuspendAuctionDocument();
      } else if (this.saleCollaterals.length > 0 || this.collateralSets.length > 0) {
        let relatedDocumentUpload =
          ((this.defermentService.deferment.deferment as DefermentExecItem)
            ?.suspendAuctionDocuments as IUploadMultiFile[]) || [];
        relatedDocumentUpload.forEach(element => {
          element.uploadRequired = !element.documentTemplate?.optional;
          element.removeDocument = !element.documentTemplate?.optional;
        });
        this.relatedDocumentUpload = relatedDocumentUpload;
      }
    }

    this.tabIndex = 0;

    // check permission
    this.validatePermission();
    // init view mode
    this.initViewMode();
    if (!this.isExecution) {
      this.CIFTable = this.dataForm ? [...this.dataForm?.get('defermentLitigationInfos')?.value] : [];
      // from cutomer detail
      const paramsCustomer = this.routerService.paramMapp.get('/main/lawsuit/deferment/defer');
      if (this.mode === 'ADD' && paramsCustomer?.routeFrom === 'CUSTOMER') {
        this.filterDataSelectAll.forEach(e => (e.checked = true));
      }
      this.selection.select(...this.filterDataSelectAll.filter(e => e.checked));
      this.getDefaultApproverCode();
    }
    // deferment data
    this.deferment = this.defermentService.deferment;
    if (!this.isExecution) {
      this.cifSubTable = this.dataForm?.get('defermentLitigationDebtInfos')?.value || [];
    }

    if (!this.isViewMode && !this.isExecution) {
      this.filterDebtInfoTable(this.selection.selected);
    }

    if (!this.hasCeased && !this.hasCancelCessation && !this.isExecution && !this.isViewMode) {
      if (
        !this.isDefermentOver &&
        ((this.isAMDResponseUnit && this.deferment.firstTimeAmd) || (this.isResponseUnit && this.deferment.firstTimeRm))
      ) {
        this.dataForm?.get('defermentApproverCode')?.setValue('1');
        this.dataForm?.get('defermentApproverCode')?.updateValueAndValidity();
        this.dataForm
          ?.get('defermentApproverName')
          ?.setValue(this.translateService.instant('LAWSUIT.DEFERMENT.ARPPROVE_ACTOR_FACTION'));
        this.dataForm?.get('defermentApproverName')?.updateValueAndValidity();
        this.isTextarea = true;
      } else if (!this.isDefermentOver) {
        const isReponseUnit =
          this.defermentService.responseUnitType === this.RESPONSE_UNIT_TYPE_ENUM.ResponseUnit ? true : false;
        const defermentDuration = Utils.calculateDateDiff(
          this.dataForm?.get('startDate')?.value,
          this.dataForm?.get('endDate')?.value
        );
        const cumulativeDuration = isReponseUnit
          ? this.defermentService.deferment.totalDefermentDaysResponseUnit
          : this.defermentService.deferment.totalDefermentDaysAmdResponseUnit;
        const isLessThan180 = defermentDuration + (cumulativeDuration || 0) < 180;
        if (isLessThan180) {
          this.dataForm?.get('defermentApproverCode')?.setValue('2');
          this.dataForm?.get('defermentApproverCode')?.updateValueAndValidity();
          this.dataForm
            ?.get('defermentApproverName')
            ?.setValue(this.translateService.instant('LAWSUIT.DEFERMENT.ARPPROVE_ACTOR_ORGANIZATION'));
          this.dataForm?.get('defermentApproverName')?.updateValueAndValidity();
          this.isTextarea = true;
        } else {
          this.isTextarea = true;
        }
      } else if (this.isDefermentOver) {
        this.dataForm?.get('defermentApproverCode')?.setValue('4');
        this.dataForm?.get('defermentApproverCode')?.updateValueAndValidity();
        this.dataForm
          ?.get('defermentApproverName')
          ?.setValue(this.translateService.instant('LAWSUIT.DEFERMENT.ARPPROVE_ACTOR_DLA'));
        this.dataForm?.get('defermentApproverName')?.updateValueAndValidity();
        this.isTextarea = false;
      }
      this.setDocumentWithCondition(false, DOC_TEMPLATE.LEXSF079);
    }

    // init default defermentApprover for cessation (save Cessation)
    if (this.hasCeased && this.cessationState !== defermentState.CESSATION) {
      this.dataForm?.get('defermentApproverCode')?.setValue('1');
      this.dataForm
        ?.get('defermentApproverName')
        ?.setValue(this.translateService.instant('LAWSUIT.DEFERMENT.ARPPROVE_ACTOR_DLA'));
    }

    if (
      this.hasCeased ||
      (this.cessationState === 'CESSATION_PENDING_APPROVED' && !this.hasAutoCreate) ||
      this.hasAutoCreate === 'AUTO_CREATE_DRAFT_CESSATION'
    ) {
      this.dataForm?.get('defermentApproverCode')?.setValue('1');
      this.dataForm
        ?.get('defermentApproverName')
        ?.setValue(this.translateService.instant('LAWSUIT.DEFERMENT.ARPPROVE_ACTOR_DLA'));
    }

    // cessation data default DLAapprove
    if (((this.hasCeased && this.cessationState === undefined) || this.taskId) && !this.isExecution) {
      this.setDocMandatory();
    }

    this.defermentApprovesList = this.deferment.defermentHistories || [];
    this.uploadMultiInfo = {
      cif: this.customerId,
      litigationId: this.currentLitigation.litigationId,
    };
    this.getDefermentDuration();
    // deferment > 30 days => mandatory, deferemnt < 0 (tdrContractDate is in the future) => mandatory
    // deferment = 0 (same day or no tdrContractDate) => optional
    const isLEXSD016Mandatory = false;
    this.hasCeased
      ? this.setDocumentWithCondition(true, DOC_TEMPLATE.LEXSF080)
      : this.setDocumentWithCondition(false, DOC_TEMPLATE.LEXSF079);
    this.setDocumentWithCondition(isLEXSD016Mandatory, DOC_TEMPLATE.LEXSD016);
    // check back from debt summary page
    if (
      this.routerService.previousUrl.includes('/main/lawsuit/deferment/defer/debt-summary') ||
      this.isBackFromHistory
    ) {
      this.defermentService.documents = this.defermentService.oldDocs;
      this.documentUpload = this.defermentService.documents;
      this.isBackFromHistory = false;
    }
    if (this.isDefermentOver && !this.isExecution) this.getDefaultApproverCode();

    this.paymentList =
      this.dataForm?.get('litigationCaseDebtInfos')?.value?.length >= 0
        ? [...this.dataForm?.get('litigationCaseDebtInfos')?.value]
        : [];
    // init approve history
    this.defermentApprovalHistoryInfos = this.deferment?.deferment?.defermentApprovalHistoryInfos || [];
    this.defermentApprovalHistoryInfos.sort((a: DefermentApprovalHistoryInfo, b: DefermentApprovalHistoryInfo) => {
      if (new Date(b.approveDate || '').valueOf() - new Date(a.approveDate || '').valueOf() === 0) {
        return new Date(b.createdDate || '').valueOf() - new Date(a.createdDate || '').valueOf();
      }
      return new Date(b.approveDate || '').valueOf() - new Date(a.approveDate || '').valueOf();
    });
    if (this.hasCancelCessation) {
      this.setDocumentWithConditionCancelCessation(false, DOC_TEMPLATE.LEXSF069);
      this.setDocumentWithConditionCancelCessation(false, DOC_TEMPLATE.LEXSD016);
    }

    this.headerDetails = this.defermentService.deferment.headerDetails || {};

    this.onDateChange();
  }

  getChkDeferment() {
    let data1 = this.dataForm?.get('defermentLitigationInfos')?.value;
    let data2 = this.dataForm?.get('defermentLitigationDebtInfos')?.value;
    let array: Array<any> = [];
    data1.forEach((value: any) => {
      data2.forEach((val: any, inx: any) => {
        if (value.litigationId == val.litigationId && value.enabled == false) {
          data2.splice(inx, 1);
        }
        if (value.litigationId == val.litigationId && value.enabled == true && value.checked == true) {
          array.push(val);
        }
      });
    });
    this.CIFTable = this.dataForm ? [...data1] : [];
    this.cifSubTable = array;
  }

  setSeizureProperties() {
    if (this.mode === 'VIEW' || this.mode === 'APPROVE' || this.mode === 'EXTEND') {
      this.seizureCollaterals = (this.defermentService.deferment.deferment as DefermentExecItem).collaterals || [];
      this.saleCollaterals =
        (this.defermentService.deferment.deferment as DefermentExecItem).collateralNoAnnounceAuctions || [];
      this.collateralSets = (this.defermentService.deferment.deferment as DefermentExecItem).collateralDeedGroups || [];
      return;
    }
    let statusEnum = LitigationsCollateralsDto.LexsCollateralStatusEnum;
    let seizure =
      !this.hideTabFlag &&
      (this.defermentService.hasEdit ||
        (this.defermentService.selectedSeizureProperties &&
          this.defermentService.selectedSeizureProperties?.length > 0))
        ? this.defermentService.selectedSeizureProperties || []
        : ((this.defermentService.deferment.deferment as DefermentExecItem).collaterals || []).concat(
            (this.defermentService.deferment.deferment as DefermentExecItem).collateralNoAnnounceAuctions || []
          );
    let collateralDeedGroups =
      !this.hideTabFlag &&
      (this.defermentService.hasEdit ||
        (this.defermentService.selectedCollateralSets && this.defermentService.selectedCollateralSets?.length > 0))
        ? this.defermentService.selectedCollateralSets || []
        : (this.defermentService.deferment as DefermentExecDto).deferment?.collateralDeedGroups || [];
    if (seizure?.length > 0) {
      this.collaterals = seizure;
      this.defermentService.selectedSeizureProperties = this.collaterals as LitigationsCollateralsDto[];
    } else {
      if (!this.defermentService.hasEdit) {
        this.collaterals = ((this.defermentService.deferment.deferment as DefermentExecItem).collaterals || []).concat(
          (this.defermentService.deferment.deferment as DefermentExecItem).collateralNoAnnounceAuctions || []
        );
      }
      if (!this.hideTabFlag) {
        this.defermentService.selectedSeizureProperties = this.collaterals as LitigationsCollateralsDto[];
      }
    }
    this.seizureCollaterals = this.collaterals?.filter(
      (c: any) => c.defermentCollateralStatus === statusEnum.Pledge || c.lexsCollateralStatus === statusEnum.Pledge
    );
    this.saleCollaterals = this.collaterals.filter(
      (c: any) => c.defermentCollateralStatus === statusEnum.Seizured || c.lexsCollateralStatus === statusEnum.Seizured
    );
    if (collateralDeedGroups?.length > 0) {
      this.collateralSets = collateralDeedGroups;
      this.defermentService.selectedCollateralSets = this.collateralSets as LitigationsCollateralsDto[];
    } else {
      if (!this.defermentService.hasEdit) {
        this.collateralSets =
          (this.defermentService.deferment.deferment as DefermentExecItem).collateralDeedGroups || [];
      }
      if (!this.hideTabFlag) {
        this.defermentService.selectedCollateralSets = this.collateralSets as LitigationsCollateralsDto[];
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initViewMode() {
    if (this.routerService.previousUrl.includes('/task')) {
      // view only on tasks
      const taskList = ['R2E07-05-E'];
      if (taskList.includes(this.taskService.taskDetail.taskCode as string)) {
        this.isViewMode = true;
        return;
      }
      const _owner = this.taskService.taskOwner;
      // viewMode is true when not owner task AND task not approved yet.
      // viewMode does not cover extend deferment fields.
      const isOwnerTask =
        this.sessionService.isOwnerTask(_owner, this.taskService.taskDetail.enableTaskSupportRole) &&
        !TaskCodeDeferExecution.includes(this.taskService.taskDetail.taskCode as taskCode) &&
        !this.approverId;
      this.isViewMode = isOwnerTask ? false : true;
      // check extend from api
      if (isOwnerTask && this.defermentService.deferment?.deferment?.extendDeferment === true) {
        this.hasExtendDeferment = true;
        this.isViewMode = true;
      }
    } else {
      if (this.mode === InquiryDefermentRequest.ModeEnum.View) {
        this.isViewMode = true;
        return;
      }
      const params = this.routerService.paramMapp.get(this.routerService.nextUrl.split('?')[0]);
      if (
        (this.routerService.nextUrl.includes('/main/lawsuit/deferment/defer/main') &&
          params?.flagEdit === true &&
          params?.modeFromBtn === 'EDIT' &&
          params?.taskId &&
          params?.actionFlag === true) ||
        this.routerService.previousUrl.includes('/seizure-property') ||
        (this.isExecution && this.mode === 'ADD')
      ) {
        this.isViewMode = false;
        return;
      }
      // when submited deferment ViewMode is true
      let isViewModeDeferment =
        this.defermentMessageBanner?.message === '' && this.defermentMessageBanner?.type === '' ? false : true;
      let isViewModeCessation =
        this.cessationMessageBanner?.message === '' && this.cessationMessageBanner?.type === '' ? false : true;
      this.isViewMode = this.hasCeased || this.taskId ? isViewModeCessation : isViewModeDeferment;
    }
  }

  validatePermission() {
    this.updateResponseUnitType();
  }

  async goToDebtSummary(litigationId: string) {
    this.defermentService.olddata(this.dataForm.value, true);
    this.defermentService.oldDocs = Utils.deepClone(this.documentUpload as Array<DocumentDto>);
    this.routerService.navigateTo(`/main/lawsuit/deferment/defer/debt-summary`, { litigationId: litigationId });
  }

  onSelectDefermentReason(event: any) {
    const defermentObj = this.defermentReasonOptions.find(item => item.value === event);
    const defermentList = defermentObj?.name ? defermentObj?.name.split('-') : '';
    const defermentReasonName = defermentList.length > 0 ? defermentList[1] : '';
    this.dataForm?.get('defermentReasonName')?.setValue(defermentReasonName);
    this.dataForm?.get('defermentReasonName')?.updateValueAndValidity();
    // Mandatory กรณีเลือกเหตุผลการชะลอดำเนินคดีเป็น “ทําสัญญาปรับโครงสร้างหนี้แล้ว อยู่ระหว่างปฏิบัติตามสัญญา“
    const isLEXSD016Mandatory = this.dataForm?.get('defermentReasonCode')?.value === '1003';
    this.setDocumentWithCondition(isLEXSD016Mandatory, DOC_TEMPLATE.LEXSD016);
    if (!isLEXSD016Mandatory && !this.isReverse) {
      this.documentUpload.reverse();
      this.isReverse = true;
    } else {
      if (isLEXSD016Mandatory) {
        this.isReverse = false;
      } else {
        this.isReverse = true;
      }
    }
  }

  onSelectCessationReason(event: any) {
    const cessationObj = this.cessationReasonOptions.find(item => item.value === event);
    const cessationList = cessationObj?.name ? cessationObj?.name.split('-') : '';
    const cessationReasonName = cessationList.length > 0 ? cessationList[0] : '';
    this.dataForm?.get('defermentReasonName')?.setValue(cessationReasonName);
    this.dataForm?.get('defermentReasonName')?.updateValueAndValidity();
  }

  clearApprovalAuthority() {
    this.dataForm?.get('defermentApproverCode')?.setValue(null);
    this.dataForm?.get('defermentApproverCode')?.updateValueAndValidity();
    this.dataForm?.get('defermentApproverName')?.setValue(null);
    this.dataForm?.get('defermentApproverName')?.updateValueAndValidity();
    return true;
  }

  dlaChange(event: any) {
    const dlaValue = event.target.checked;
    this.setDocumentWithCondition(false, DOC_TEMPLATE.LEXSF079);
    const defermentDuration = this.getDefermentDuration();
    const isLEXSD016Mandatory = (defermentDuration > 30 || defermentDuration === -1) && dlaValue;
    this.setDocumentWithCondition(isLEXSD016Mandatory, DOC_TEMPLATE.LEXSD016);
    this.getDefaultApproverCode();
  }

  onCancelWithDebtChanges(event: any) {
    const checked = event.target.checked;
    this.dataForm.get('cancelWithDebtChanges')?.setValue(checked);
    this.dataForm.get('cancelWithDebtChanges')?.updateValueAndValidity();
    this.initDocumentCancelWithDebtChanges(checked);
  }

  initDocumentCancelWithDebtChanges(checked: boolean) {
    this.defermentService.documents = this.defermentService.documents.map((m: any) => {
      m.uploadRequired = !m.documentTemplate.optional;
      if (
        (m.documentTemplateId === DOC_TEMPLATE.LEXSD005 || m.documentTemplateId === DOC_TEMPLATE.LEXSD006) &&
        m.documentTemplate
      ) {
        m.documentTemplate.optional = !checked;
        m.uploadRequired = checked;
      }
      if (
        (m.documentTemplateId === DOC_TEMPLATE.LEXSD016 || m.documentTemplateId === DOC_TEMPLATE.LEXSF068) &&
        m.documentTemplate
      ) {
        m.documentTemplate.optional = checked;
        m.uploadRequired = !checked;
      }
      if (m.documentTemplateId == DOC_TEMPLATE.LEXSF115 && m.documentTemplate) {
        m.documentTemplate.optional = true;
        m.uploadRequired = false;
        if (this.isExecution && this.hasCancelDeferment)
          m.documentTemplate.documentName = this.translateService.instant(
            'LAWSUIT.DEFERMENT.DOCUMENT_CANCEL_DEFERMENT_EXECUTION'
          );
      }
      if (!m.imageId && !m.uploadRequired && m.commitmentAccounts.length === 0) m.active = false;
      else m.active = true;

      return m;
    });

    // sort so that required documents come first
    this.defermentService.documents.sort((x, y) => {
      return (x as IDocument).uploadRequired === (y as IDocument).uploadRequired
        ? 0
        : (x as IDocument).uploadRequired
          ? -1
          : 1;
    });
    this.defermentService.documents.sort((x, y) => {
      return (x as IDocument).documentTemplateId?.localeCompare((y as IDocument).documentTemplateId || '') ? 0 : 1;
    });
    this.documentUpload = this.defermentService.documents;
  }

  setDocumentWithCondition(isRequired: boolean, documentTemplateId: string) {
    let hasSub = this.defermentService.documents.filter(f => f.documentTemplateId === documentTemplateId)?.length > 1;
    this.defermentService.documents = this.defermentService.documents
      .map((m: any) => {
        if (m.documentTemplateId === documentTemplateId && m.documentTemplate) {
          m.documentTemplate.optional = !isRequired;
          m.uploadRequired = isRequired;
          m.active =
            m.uploadRequired ||
            hasSub ||
            this.deferment?.deferment?.documents?.find(f => f.documentTemplateId === documentTemplateId)?.active;
        }

        return m;
      })
      .sort((x, y) => {
        return (x as IDocument).uploadRequired === (y as IDocument).uploadRequired
          ? 0
          : (x as IDocument).uploadRequired
            ? -1
            : 1;
      });

    this.documentUpload = this.defermentService.documents;
  }

  setDocumentWithConditionCancelCessation(isRequired: boolean, documentTemplateId: string) {
    this.defermentService.documents = this.defermentService.documents.map((m: any) => {
      if (m.documentTemplateId === documentTemplateId && m.documentTemplate) {
        m.documentTemplate.optional = !isRequired;
        m.uploadRequired = isRequired;
        m.active = m.uploadRequired;
      }

      return m;
    });
    this.documentUploadCancelCessation = this.defermentService.documents;
  }

  onSelectApprovalAuthority(event: any) {
    const approvalObj = this.approvalOptions.find(item => item.value === event);
    const approvalList = approvalObj?.name ? approvalObj?.name.split('-') : '';
    const approvalName = approvalList.length > 0 ? approvalList[0] : '';
    this.dataForm?.get('defermentApproverName')?.setValue(approvalName);
    this.dataForm?.get('defermentApproverName')?.updateValueAndValidity();
  }

  uploadContract() {
    this.documentUpload = this.defermentService.documents;
  }
  uploadCommitment() {
    this.documentUpload = this.defermentService.documents;
  }

  uploadFileEvent(list: any) {
    this.documentUpload = list;
    this.defermentService.documents = list;
  }

  async onDownload() {
    if (this.deferment.deferment?.defermentId) {
      const response = await this.defermentService.download(this.deferment.deferment?.defermentId);
      this.documentService.downloadDocument(response);
    }
  }

  getDefermentDuration(numBidDate?: number): number {
    if (
      this.hasExtendDeferment &&
      this.defermentService.deferment.deferment?.endDate === undefined &&
      numBidDate === 0
    ) {
      this.defermentDuration = 0;
      return 0;
    }
    this.defermentDuration = Utils.calculateDateDiff(
      this.dataForm?.get('startDate')?.value,
      this.dataForm?.get('endDate')?.value
    );
    this.isDefermentOver =
      Utils.calculateDateDiff(this.dataForm?.get('startDate')?.value, this.dataForm?.get('endDate')?.value) > 30;
    if (this.deferment.tdrContractDate) {
      const diff = -Utils.calculateDateDiff(this.dataForm?.get('startDate')?.value, this.deferment.tdrContractDate);
      return diff;
    } else return -1;
  }

  setDefaultDefermentExecApprover() {
    let totalDefermentDaysAmdResponseUnit = this.defermentService.deferment.totalDefermentDaysAmdResponseUnit || 0;
    if (this.defermentDuration <= 30 && totalDefermentDaysAmdResponseUnit + this.defermentDuration <= 180) {
      this.dataForm?.get('defermentApproverCode')?.setValue('1');
      this.dataForm?.get('defermentApproverCode')?.updateValueAndValidity();
      this.dataForm
        ?.get('defermentApproverName')
        ?.setValue(this.translateService.instant('LAWSUIT.DEFERMENT.ARPPROVE_ACTOR_ORGANIZATION'));
      this.dataForm?.get('defermentApproverName')?.updateValueAndValidity();
      this.isTextarea = true;
    } else if (this.defermentDuration > 30 || totalDefermentDaysAmdResponseUnit + this.defermentDuration > 180) {
      this.dataForm?.get('defermentApproverCode')?.setValue('2');
      this.dataForm?.get('defermentApproverCode')?.updateValueAndValidity();
      this.dataForm
        ?.get('defermentApproverName')
        ?.setValue(this.translateService.instant('LAWSUIT.DEFERMENT.ARPPROVE_ACTOR_DLA'));
      this.dataForm?.get('defermentApproverName')?.updateValueAndValidity();
      this.clearAllTextArea();
      this.isTextarea = false;
    }
  }

  onDateChange() {
    this.getDefermentDuration();
    if (this.isExecution) {
      this.setExecutionDate();
      this.setDefaultDefermentExecApprover();
    } else {
      if (
        !this.isDefermentOver &&
        ((this.isAMDResponseUnit && this.deferment.firstTimeAmd) || (this.isResponseUnit && this.deferment.firstTimeRm))
      ) {
        this.dataForm?.get('defermentApproverCode')?.setValue('1');
        this.dataForm?.get('defermentApproverCode')?.updateValueAndValidity();
        this.dataForm
          ?.get('defermentApproverName')
          ?.setValue(this.translateService.instant('LAWSUIT.DEFERMENT.ARPPROVE_ACTOR_FACTION'));
        this.dataForm?.get('defermentApproverName')?.updateValueAndValidity();
        this.isTextarea = true;
      } else if (!this.isDefermentOver) {
        this.dataForm?.get('defermentApproverCode')?.setValue('2');
        this.dataForm?.get('defermentApproverCode')?.updateValueAndValidity();
        this.dataForm
          ?.get('defermentApproverName')
          ?.setValue(this.translateService.instant('LAWSUIT.DEFERMENT.ARPPROVE_ACTOR_ORGANIZATION'));
        this.dataForm?.get('defermentApproverName')?.updateValueAndValidity();
        this.isTextarea = true;
      } else if (this.isDefermentOver) {
        this.dataForm?.get('defermentApproverCode')?.setValue('4');
        this.dataForm?.get('defermentApproverCode')?.updateValueAndValidity();
        this.dataForm
          ?.get('defermentApproverName')
          ?.setValue(this.translateService.instant('LAWSUIT.DEFERMENT.ARPPROVE_ACTOR_DLA'));
        this.dataForm?.get('defermentApproverName')?.updateValueAndValidity();
        this.clearAllTextArea();
        this.isTextarea = false;
      }

      this.setDocMandatory();
    }
  }

  setDocMandatory() {
    if (this.isDefermentOver) this.getDefaultApproverCode();
    const isLEXSD016Mandatory = this.dataForm?.get('defermentReasonCode')?.value === '1003';
    this.setDocumentWithCondition(false, DOC_TEMPLATE.LEXSF079);
    this.setDocumentWithCondition(isLEXSD016Mandatory, DOC_TEMPLATE.LEXSD016);
    if ((this.hasCeased && this.cessationState === undefined) || this.taskId) {
      this.setDocumentWithCondition(this.dataForm?.get('dlaApprove')?.value, DOC_TEMPLATE.LEXSF080);
    }
  }

  updateResponseUnitType() {
    this.dataForm?.get('responseUnitType')?.setValue(this.defermentService.responseUnitType);
    this.dataForm?.get('responseUnitType')?.updateValueAndValidity();
    if (
      this.defermentService.responseUnitType === 'AMD_RESPONSE_UNIT' ||
      this.defermentService.deferment.deferment?.responseUnitType === 'AMD_RESPONSE_UNIT'
    ) {
      this.isAMDResponseUnit = true;
      this.isResponseUnit = false;
    } else if (
      this.defermentService.responseUnitType === 'RESPONSE_UNIT' ||
      this.defermentService.deferment.deferment?.responseUnitType === 'RESPONSE_UNIT'
    ) {
      this.isAMDResponseUnit = false;
      this.isResponseUnit = true;
    } else {
      this.isAMDResponseUnit = false;
      this.isResponseUnit = false;
    }
  }

  async openDoc(ele: DocumentDto) {
    let res = await this.documentService.getDocument(ele.imageId || '', ele.imageSource);

    if (res) {
      this.documentService.openPdf(res, ele.imageName);
    }
  }

  getControl(name: string) {
    return this.dataForm?.get(name);
  }

  getDefaultApproverCode() {
    if (this.isDefermentOver) {
      this.dataForm?.get('defermentApproverCode')?.setValue('4');
      this.dataForm?.get('defermentApproverCode')?.updateValueAndValidity();
      this.dataForm
        ?.get('defermentApproverName')
        ?.setValue(this.translateService.instant('LAWSUIT.DEFERMENT.ARPPROVE_ACTOR_DLA'));
      this.dataForm?.get('defermentApproverName')?.updateValueAndValidity();
    } else {
      if (!this.isViewMode && !this.hasCeased && !this.hasCancelCessation) {
        this.dataForm?.get('defermentApproverCode')?.setValue('1');
        this.dataForm?.get('defermentApproverCode')?.updateValueAndValidity();
        this.dataForm
          ?.get('defermentApproverName')
          ?.setValue(this.translateService.instant('LAWSUIT.DEFERMENT.ARPPROVE_ACTOR_FACTION'));
        this.dataForm?.get('defermentApproverName')?.updateValueAndValidity();
      }
    }
  }

  loadSelectedCheckBox() {
    let selectedRow = this.persons.filter(element => element.checked === true);
    this.selection.select(...selectedRow);
    this.selectPersons.emit(this.selection.selected);
  }

  checkData(row: DefermentLitigationInfo) {
    let defermentLitigationInfos = this.CIFTable;
    const idx = defermentLitigationInfos.findIndex(e => e.litigationId === row.litigationId);
    defermentLitigationInfos[idx] = {
      ...defermentLitigationInfos[idx],
      checked: !defermentLitigationInfos[idx].checked,
    };
    this.dataForm?.get('defermentLitigationInfos')?.patchValue(defermentLitigationInfos);
    this.updateDefermentLitigationDebtInfos();
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: DefermentLitigationInfo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    this.selectPersons.emit(this.selection.selected);
    return `${row.checked ? 'deselect' : 'select'} row ${row.litigationId ?? '' + 1}`;
  }

  isAllSelected() {
    const litigationEnable = this.filterDataSelectAll;
    const numSelected = litigationEnable.filter(e => e.checked).length;
    let numRows = litigationEnable.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.patchDefermentLitigationInfoAll(false);
    } else {
      const defermentLitigationInfos = this.dataForm?.get('defermentLitigationInfos')
        ?.value as DefermentLitigationInfo[];
      this.selection.select(...defermentLitigationInfos.filter(e => e.enabled));
      this.patchDefermentLitigationInfoAll(true);
    }
    this.updateDefermentLitigationDebtInfos();
  }

  get filterDataSelectAll() {
    return this.CIFTable.filter(e => e.enabled);
  }

  get indeterminate() {
    return this.filterDataSelectAll.some(e => e.checked);
  }

  updateDefermentLitigationDebtInfos() {
    const litigationSelected = this.filterDataSelectAll.filter(e => e.checked);
    this.filterDebtInfoTable(litigationSelected);
  }

  patchDefermentLitigationInfoAll(value: boolean) {
    let defermentLitigationInfo = this.CIFTable;
    defermentLitigationInfo.forEach(e => {
      if (e.enabled) e.checked = value;
    });
    this.dataForm?.get('defermentLitigationInfos')?.patchValue(defermentLitigationInfo);
  }

  onTabChanged(event: MatTabChangeEvent) {
    const deferment = this.defermentService.dashboard || this.defermentService.deferment;
    switch (Number(event.tab.textLabel)) {
      case 0:
        this.dataTable = deferment.defermentPresents as Array<DefermentItem>;
        this.initialDataTable = this.dataTable;
        break;
      case 1:
        this.dataTable = deferment.defermentApproves as Array<DefermentItem>;
        this.initialDataTable = this.dataTable;
        break;
      case 2:
        this.dataTable = deferment.defermentHistories as Array<DefermentItem>;
        this.initialDataTable = this.dataTable;
        break;
      default:
        this.dataTable = deferment.defermentPresents as Array<DefermentItem>;
        this.initialDataTable = this.dataTable;
        break;
    }
    this.tabIndex = Number(event.tab.textLabel);
  }

  getApprovalAuthority() {
    return this.dataForm?.get('defermentApproverName')?.value || '';
  }

  async selectSeizure(number: any) {
    let data = {
      ...this.dataForm.value,
      documents: this.defermentService.documents,
    };
    this.defermentService.olddata(data, true);
    let prefixPath = '/main';
    if (this.routerService.previousUrl.includes('/main/task')) {
      prefixPath = prefixPath + '/task';
    } else if (this.routerService.previousUrl.includes('/main/lawsuit')) {
      prefixPath = prefixPath + '/lawsuit';
    }
    if (number === 2) {
      this.routerService.navigateTo(`${prefixPath}/deferment/defer/seizure-property`, { hasAnnounceAuction: true });
    } else {
      this.routerService.navigateTo(`${prefixPath}/deferment/defer/seizure-property`);
    }
  }

  onSelectDLA(event: any) {
    const dlaObj = this.dlaOption.find(item => item.value === event);
    const dlaObjList = dlaObj?.name ? dlaObj?.name.split('-') : '';
    const dlaObjListName = dlaObjList.length > 0 ? dlaObjList[1] : '';
    this.dataForm?.get('dlaAuthorityName')?.setValue(dlaObjListName);
    this.dataForm?.get('dlaAuthorityName')?.updateValueAndValidity();
  }

  clearAllTextArea() {
    this.dataForm?.get('customerHistory')?.setValue(' ');
    this.dataForm?.get('customerHistory')?.updateValueAndValidity();
    this.dataForm?.get('originAndNecessity')?.setValue(' ');
    this.dataForm?.get('originAndNecessity')?.updateValueAndValidity();
    this.dataForm?.get('defermentReason')?.setValue(' ');
    this.dataForm?.get('defermentReason')?.updateValueAndValidity();
    this.dataForm?.get('conclusionDeferment')?.setValue(' ');
    this.dataForm?.get('conclusionDeferment')?.updateValueAndValidity();
    return true;
  }

  async checkDetailView(event: DefermentItem) {
    // set to view mode
    this.isDetailView = true;
    if (this.routerService.nextUrl.includes('/main/lawsuit/deferment/defer/main?')) {
      this.hideTabFlag = true;
    }
    this.mode = InquiryDefermentRequest.ModeEnum.View;
    this.isViewMode = true;
    this.tabIndex = 0;
    this.defermentService.oldDocs = Utils.deepClone(this.documentUpload);
    const params = this.route.snapshot.queryParams;
    this.litigationId = !!this.litigationId ? this.litigationId : params['litigationId'];
    const execReq: InquiryDefermentExecRequest = {
      customerId: this.customerId,
      defermentId: event.defermentId || '',
      defermentType: event.defermentType as DefermentInfo.DefermentTypeEnum,
      litigationId: this.litigationId,
      mode: InquiryDefermentRequest.ModeEnum.View,
      taskId: event.taskId ? event.taskId : undefined,
      isViewOnly: true,
    };
    const res = this.isExecution
      ? await this.defermentService.inquiryDefermentExec(execReq)
      : await this.defermentService.inquiryDeferment(
          this.customerId,
          event.defermentId || '',
          event.defermentType as DefermentInfo.DefermentTypeEnum,
          this.litigationId,
          InquiryDefermentRequest.ModeEnum.View,
          event.taskId ? event.taskId : undefined
        );
    this.defermentService.deferment = res;
    this.dataForm = this.defermentService.generateDefermentForm(res.deferment, event.defermentType === 'CESSATION');
    this.initData();
    this.documentUpload = this.defermentService.formatDocs(res.deferment?.documents || [], true);
    this.defermentApprovalHistoryInfos = res.deferment?.defermentApprovalHistoryInfos || [];
    this.detailView.emit(event);
  }

  filterDebtInfoTable(selected: DefermentLitigationInfo[]) {
    const lgIdUnderCIF = selected.map(f => f.litigationId);
    const defermentLitigationDebtInfos = this.defermentService.deferment.deferment?.defermentLitigationDebtInfos || [];
    this.cifSubTable = defermentLitigationDebtInfos.filter(e => lgIdUnderCIF.includes(e.litigationId));
  }

  filterDebtInfoExecTable() {
    let lgIdUnderCIF: string[] = [];
    let seizureProperties = this.defermentService?.selectedSeizureProperties || [];
    let collateralSets = this.defermentService?.selectedCollateralSets || [];
    if (this.mode !== 'ADD' && this.mode !== 'EDIT') {
      seizureProperties = (this.defermentService.deferment as DefermentExecDto).deferment?.collaterals?.concat(
        (this.defermentService.deferment as DefermentExecDto).deferment?.collateralNoAnnounceAuctions || []
      ) as LitigationsCollateralsDto[];
      collateralSets = (this.defermentService.deferment as DefermentExecDto).deferment?.collateralDeedGroups || [];
    }
    seizureProperties?.forEach(element => {
      let litigationId = element.litigations?.map(e => e.litigationId as string);
      lgIdUnderCIF = lgIdUnderCIF.concat(litigationId || []);
    });
    collateralSets?.forEach(e => {
      lgIdUnderCIF.push(e.litigationId as string);
    });

    const defermentLitigationDebtInfos = this.defermentService.deferment.deferment?.defermentLitigationDebtInfos || [];
    this.cifSubTable = defermentLitigationDebtInfos.filter((e: any) => lgIdUnderCIF.includes(e.litigationId));
  }

  async onEditSezure(number: number) {
    this.defermentService.hasEdit = false;
    this.defermentService.olddata(this.dataForm.value, true);
    const hasUpload = this.relateFileUploaded;
    if (this.routerService.previousUrl.includes('/main/task')) {
      if (number === 2) {
        this.routerService.navigateTo(`/main/task/deferment/defer/seizure-property`, {
          hasAnnounceAuction: true,
          hasUpload: hasUpload,
        });
      } else {
        this.routerService.navigateTo(`/main/task/deferment/defer/seizure-property`, { hasUpload: hasUpload });
      }
    } else if (this.routerService.previousUrl.includes('/main/lawsuit')) {
      if (number === 2) {
        this.routerService.navigateTo(`/main/lawsuit/deferment/defer/seizure-property`, {
          hasAnnounceAuction: true,
          hasUpload: hasUpload,
        });
      } else {
        this.routerService.navigateTo(`/main/lawsuit/deferment/defer/seizure-property`, { hasUpload: hasUpload });
      }
    }
  }

  get getSuspendAuctionDocumentsControls() {
    if (!this.dataForm) return new UntypedFormControl();
    return this.dataForm.get('suspendAuctionDocuments') as UntypedFormControl;
  }

  get suspendAuctionCollaterals(): SuspendAuctionCollateralDto[] {
    let suspendAuctionCollaterals: SuspendAuctionCollateralDto[] = [];
    this.defermentService.getSelectedCollaterals?.collateralDeedGroups?.forEach(e => {
      e.collaterals?.forEach(f => {
        suspendAuctionCollaterals.push({
          collateralId: f.collateralId,
          ledId: e.ledId,
        });
      });
    });
    this.defermentService.getSelectedCollaterals?.collateralNoAnnounceAuctions?.forEach(e => {
      suspendAuctionCollaterals.push({
        collateralId: e.collateralId,
        ledId: e.ledId,
      });
    });
    return suspendAuctionCollaterals;
  }

  uploadRelateFileEvent(list: any) {
    this.relatedDocumentUpload = list;
    this.dataForm.get('suspendAuctionDocuments')?.patchValue(list);
  }

  async getEmptySuspendAuctionDocument() {
    const request: SuspendAuctionDocumentRequest = {
      suspendAuctionCollateralDtos: this.suspendAuctionCollaterals,
      defermentId: this.deferment.deferment?.defermentId,
      documentDownloadState: SuspendAuctionDocumentRequest.DocumentDownloadStateEnum.Deferment,
      customerId: this.customerId,
    };
    let relatedDocumentUpload = (await this.defermentService.getEmptySuspendAuctionDocument(
      request
    )) as IUploadMultiFile[];
    this.relatedDocumentUpload = this.setRequiredDocuments(relatedDocumentUpload);
    this.dataForm.get('suspendAuctionDocuments')?.patchValue(this.relatedDocumentUpload);
    if (!this.defermentService.hasEdit && this.getSuspendAuctionDocumentsControls?.value) {
      this.relatedDocumentUpload = this.setRequiredDocuments(this.getSuspendAuctionDocumentsControls?.value);
      return;
    }
  }

  setRequiredDocuments(docs: IUploadMultiFile[]) {
    docs.forEach(element => {
      element.uploadRequired = !element.documentTemplate?.optional;
      element.removeDocument = !element.documentTemplate?.optional;
    });
    return docs;
  }

  async downLoadForm() {
    const request: SuspendAuctionDocumentRequest = {
      suspendAuctionCollateralDtos: this.suspendAuctionCollaterals,
      documentDownloadState: SuspendAuctionDocumentRequest.DocumentDownloadStateEnum.Deferment,
      customerId: this.customerId,
    };
    const response = await this.defermentService.downloadSuspendAuctionTemplate(request);
    this.documentService.downloadDocument(
      response,
      this.translateService.instant('WITHDRAWN_SEIZURE_PROPERTY.SUSPEND_AUCTION_DOCUMENT_DOWNLOAD') +
        FileType.DOCX_SHEET
    );
  }

  async checkExitWithoutSave() {
    if (this.dataForm?.dirty) {
      const _confirm = await this.sessionService.confirmExitWithoutSave();
      return _confirm;
    }
    return true;
  }

  setExecutionDate() {
    let listDate: number[] = [];
    if (
      this.defermentService.selectedSeizureProperties &&
      this.defermentService?.selectedSeizureProperties?.length > 0
    ) {
      listDate = [
        new Date(this.dataForm?.get('noAuctionDefermentStartDate')?.value).getTime(),
        new Date(this.dataForm?.get('noAuctionDefermentEndDate')?.value).getTime(),
      ];
    }
    if (this.defermentService.selectedCollateralSets && this.defermentService?.selectedCollateralSets?.length > 0) {
      this.defermentService.selectedCollateralSets.forEach(e => {
        let bidDate: number[] = [];
        e.auctionInfos
          ?.filter(f => f.enabled)
          ?.forEach(f => {
            if (f.checked && new Date(f.bidDate || '') > new Date()) bidDate.push(new Date(f.bidDate || '').getTime());
          });
        listDate = listDate.concat(bidDate);
      });
    }
    if (listDate.length !== 0) {
      this.dataForm?.get('startDate')?.patchValue(new Date(Math.min(...listDate)));
      this.dataForm?.get('endDate')?.patchValue(new Date(Math.max(...listDate)));
    }
    this.getDefermentDuration(listDate.length);
  }

  get relateFileUploaded() {
    return (this.getSuspendAuctionDocumentsControls.value as IUploadMultiFile[])?.some(doc => !!doc.imageId);
  }

  get showDefermentStatements() {
    const collateralNoAnnounceAuctions =
      (this.defermentService.deferment as DefermentExecDto)?.deferment?.collateralNoAnnounceAuctions || [];
    return (
      this.defermentService.deferment?.deferment?.defermentTaskStatus === 'APPROVED' &&
      collateralNoAnnounceAuctions.length > 0 &&
      this.mode === 'VIEW' &&
      this.isExecution &&
      !this.hasExtendDeferment &&
      !this.routerService.previousUrl.includes('/task')
    );
  }
}
