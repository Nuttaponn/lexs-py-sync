import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute } from '@angular/router';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { DOC_TEMPLATE } from '@app/shared/constant';
import {
  BlobType,
  FileType,
  FileTypeMapper,
  IUploadMultiFile,
  IUploadMultiInfo,
  Mode,
  TaskCodeAppeal,
  TaskCodeMemorandumCourt,
  TaskCodeSupreme,
  statusCode,
  taskCode,
} from '@app/shared/models';
import { MasterDataService } from '@app/shared/services/master-data.service';
import {
  CiosCaseType,
  CourtAppealBundleDto,
  CourtAppealDto,
  CourtCollateralDto,
  CourtFeeSubTypes,
  CourtFeeTypes,
  CourtVerdict,
  CourtVerdictDto,
  CourtVerdictTypes,
  DisputeAppealBundleDto,
  DocumentDto,
  LitigationDocumentDto,
} from '@lexs/lexs-client';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import {
  ADDTIONAL_DOCS_TEMP,
  APPROVE_APPEAL_DOCS_TEMP,
  APPROVE_SUPREME_COURT_DOCS_TEMP,
  CONSIDER_APPEAL_DOCS_TEMP,
  CONSIDER_SUPREME_COURT_DOCS_TEMP,
  LEXSF052,
  caseEndConfig,
  caseEndOption,
  ciosCaseTypeConfig,
  courtFeeSubTypeConfig1,
  courtFeeSubTypeConfig2,
  courtFeeTypeConfig,
  courtSubVerdictConfig,
  courtVerdictConfig,
  courtVerdictConfig1,
  courtVerdictTypeConfig,
  redYearConfig,
} from '../court.constant';
import { CourtService } from '../court.service';
import { Utils } from '@app/shared/utils';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-court-result',
  templateUrl: './court-result.component.html',
  styleUrls: ['./court-result.component.scss'],
})
export class CourtResultComponent implements OnInit {
  public defendantColumns: string[] = ['fullName', 'relation', 'identificationNo'];
  public courtFeeColumns: string[] = [
    'no',
    'transactionName',
    'transactionDate',
    'courtLevel',
    'accountNo',
    'initialAmount',
    'netAmount',
    'courtRefundAmount',
    'status',
  ];
  public extendAppealColumns: string[] = ['no', 'extendDate', 'imageName'];
  public lawyerFeeColumns: string[] = ['no', 'courtName', 'initialAmount', 'paidAmount', 'remainingAmount'];
  public accountColumns: string[] = ['no', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7'];
  public collateralColumns: string[] = ['no', 'collateralId', 'collateralDetails', 'ownerFullName'];

  uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  hided = true;
  ciosCaseTypeConfig: DropDownConfig = ciosCaseTypeConfig;
  red1Option = [];
  redYearConfig: DropDownConfig = redYearConfig;
  public courtVerdictTypeConfig: DropDownConfig = courtVerdictTypeConfig;
  public courtVerdictConfig: DropDownConfig = courtVerdictConfig;
  public courtVerdictConfig1: DropDownConfig = courtVerdictConfig1;
  public courtFeeTypeConfig: DropDownConfig = courtFeeTypeConfig;
  public courtFeeSubTypeConfig1: DropDownConfig = courtFeeSubTypeConfig1;
  public courtFeeSubTypeConfig2: DropDownConfig = courtFeeSubTypeConfig2;
  public courtSubVerdictConfig: DropDownConfig = courtSubVerdictConfig;
  public caseEndConfig: DropDownConfig = caseEndConfig;
  public caseEndOption = caseEndOption;
  public redYearOption: any = [];

  @Input() consAppealCtrl!: UntypedFormGroup;
  courtVerdictForm!: UntypedFormGroup;

  public courtAppealDocsInfo: IUploadMultiInfo = { cif: '', litigationId: '' };
  public courtAppealDocs: IUploadMultiFile[] = [];
  public processDocs: IUploadMultiFile[] = [];
  public additionalDocs: IUploadMultiFile[] = [];
  public courtAppealDocsColumns: string[] = ['documentName', 'uploadDate'];

  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public courtVerdictDocuments: Array<any> = [];
  public displayCourtVerdictDocuments: Array<any> = [];
  public courtVerdictDisplayOptions: any = new Map<string, boolean>();
  public oldCourtVerdictTypecode: any = -1;
  public documentUpload: any = LEXSF052;

  public courtVDetail!: CourtVerdictDto;
  public MODE = Mode;
  public isViewMode: boolean = false;
  public ciosCaseTypeOptions: CiosCaseType[] = [];
  public courtVerdictTypeOptions: CourtVerdictTypes[] = [];
  public courtFeeTypeOptions: CourtFeeTypes[] = [];
  public courtFeeSubTypeOptions: CourtFeeSubTypes[] = [];
  public courtVerdictOptions: CourtVerdict[] = [];
  public courtSubVerdictOptions: CourtVerdict[] = [];

  public taskCode!: taskCode;
  public statusCode!: statusCode;
  private taskId!: number;

  public deductionForGuarantorConfig: DropDownConfig = { labelPlaceHolder: 'การตัดดอกเบี้ยผู้ค้ำประกันเหลือ 60 วัน' };
  public deductionForGuarantorOptions: SimpleSelectOption[] = [
    { text: 'มี', value: 0 },
    { text: 'ไม่มี', value: -1 },
  ];

  public appealTasks: taskCode[] = TaskCodeAppeal;
  public supremeTasks: taskCode[] = TaskCodeSupreme;

  public appealApproveTasks: taskCode[] = [taskCode.APPROVE_APPEAL];
  public supremeApproveTasks: taskCode[] = [taskCode.APPROVE_SUPREME_COURT];

  actionOnScreen = {
    canExtendAppeal: false,
    courtVerdict: true,
    courtSubVerdict: false,
    otherCourtFeeTypeCode: true,
    otherCourtFeeCode: true,
    courtDate: false,
    courtFee: true,
    blackCase: false,
    redCase: false,
    msgErroeRedCase: false,
  };
  total: any = {
    TotalDebtorInitialAmount: 0,
    TotalDebtorPaidAmount: 0,
    TotalDebtorRemainingAmount: 0,
  };
  blankOption = { name: '----โปรดเลือก----', value: '' };

  private courtAppealBundle!: CourtAppealBundleDto;
  private disputeAppealBundle!: DisputeAppealBundleDto;
  public courtAppeal!: CourtAppealDto;
  public taskCodeMemorandumCourt = TaskCodeMemorandumCourt;
  public isViewRedCase: boolean = false;

  public pageIndex: number = 1;
  public pageSize: number = 5;
  public courtCollateralSource = new MatTableDataSource<CourtCollateralDto>([]);
  public isCollateralOpened: boolean = true;

  public isSaveCaseEnd: boolean = JSON.parse(this.route.snapshot.queryParams['isSaveCaseEnd'] || false);

  constructor(
    private courtService: CourtService,
    private route: ActivatedRoute,
    private masterDataService: MasterDataService,
    private taskService: TaskService,
    private lawsuitService: LawsuitService,
    private decimal: DecimalPipe,
    private documentService: DocumentService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.taskCode =
      (this.taskService.taskDetail.taskCode as taskCode) || this.route.snapshot.queryParams['taskCode'] || '';
    this.taskId = this.taskService.taskDetail.id || this.route.snapshot.queryParams['id'] || 0;
    this.statusCode =
      this.taskService.taskDetail.statusCode || this.route.snapshot.queryParams['statusCode'] || ('' as statusCode);
    this.isViewMode =
      this.route.snapshot.queryParams['mode'] === this.MODE.VIEW ||
      (!['APPROVE_APPEAL', 'APPROVE_SUPREME_COURT'].includes(this.taskCode) &&
        this.statusCode === 'PENDING_APPROVAL') ||
      this.statusCode === 'AWAITING';
    this.isViewRedCase = this.taskCode === 'APPROVE_APPEAL' && this.statusCode === 'PENDING_APPROVAL';

    this.courtService.initVerdictForm();
    this.initData();
    this.initDataVerdict();
    this.initPermission();
    this.courtVerdictForm = this.courtService.courtVerdictForm;
    this.bindingData();
    this.sliceDataTable(this.courtCollateralSource.data);
  }

  bindingData() {
    this.courtVerdictForm.patchValue({
      caseEnd: this.courtVDetail?.caseEnd,
      caseEndCode: this.courtVDetail?.caseEndCode || '1',
      ciosRedCaseNo: this.courtVDetail?.ciosRedCaseNo,
      ciosVerdictDate: this.courtVDetail?.ciosVerdictDate,
      courtFee: this.courtVDetail?.courtFee,
      courtLevel: this.courtVDetail?.courtLevel,
      courtName: this.courtVDetail?.courtName,
      courtType: this.courtVDetail?.courtType,
      courtVerdictCode: this.courtVDetail?.courtVerdictCode,
      courtSubVerdictCode: this.courtVDetail?.courtSubVerdictCode,
      courtSubVerdictDesc: this.courtVDetail?.courtSubVerdictDesc,
      courtVerdictDate: this.courtVDetail?.courtVerdictDate,
      courtVerdictTypeCode: this.courtVDetail?.courtVerdictTypeCode,
      otherCourtFeeTypeCode: this.courtVDetail?.otherCourtFeeTypeCode,
      debtorLawyerFee: this.courtVDetail?.debtorLawyerFee,
      firstEnforcementDate: this.courtVDetail?.firstEnforcementDate,
      firstVerdictDate: this.courtVDetail?.firstVerdictDate,
      firstVerdictUserFirstName: this.courtVDetail?.firstVerdictUserFirstName,
      firstVerdictUserId: this.courtVDetail?.firstVerdictUserId,
      firstVerdictUserLastName: this.courtVDetail?.firstVerdictUserLastName,
      lastVerdictDate: this.courtVDetail?.lastVerdictDate,
      lastVerdictUserFirstName: this.courtVDetail?.lastVerdictUserFirstName,
      lastVerdictUserId: this.courtVDetail?.lastVerdictUserId,
      lastVerdictUserLastName: this.courtVDetail?.lastVerdictUserLastName,
      litigationCaseId: this.courtVDetail?.litigationCaseId,
      litigationId: this.courtVDetail?.litigationId,
      litigationStatus: this.courtVDetail?.litigationStatus,
      otherCourtFeeCode: this.courtVDetail?.otherCourtFeeCode,
      redCaseNo: this.courtVDetail?.redCaseNo,
      elementRedCaseCiosCode: this.courtVDetail?.elementRedCaseCiosCode,
      elementRedCaseRunning: this.courtVDetail?.elementRedCaseRunning,
      elementRedCaseYear: this.courtVDetail?.elementRedCaseYear,
      elementBlackCaseCiosCode: this.courtVDetail?.elementBlackCaseCiosCode,
      elementBlackCaseRunning: this.courtVDetail?.elementBlackCaseRunning,
      elementBlackCaseYear: this.courtVDetail?.elementBlackCaseYear,
      remark: this.courtVDetail?.remark,
      taskId: this.courtVDetail?.taskId,
      totalCourtRefundAmount: this.courtVDetail?.totalCourtRefundAmount,
      totalInitialAmount: this.courtVDetail?.totalInitialAmount,
      totalNetAmount: this.courtVDetail?.totalNetAmount,
      appealCourtBlackCaseNo: this.courtVDetail?.appealCourtBlackCaseNo,
      blackCaseNo: this.courtVDetail?.blackCaseNo,
      courtVerdictDesc: this.courtVDetail?.courtVerdictDesc,
      courtVerdictTypeDesc: this.courtVDetail?.courtVerdictTypeDesc,
      otherCourtFeeDesc: this.courtVDetail?.otherCourtFeeDesc,
      otherCourtFeeTypeDesc: this.courtVDetail?.otherCourtFeeTypeDesc,
      supremeCourtBlackCaseNo: this.courtVDetail?.supremeCourtBlackCaseNo,
      testimonyStatus: this.courtVDetail?.testimonyStatus,
      disposeCaseDate: this.courtVDetail?.disposeCaseDate,
      civilCourtBlackCaseNo: this.courtVDetail?.civilCourtBlackCaseNo,
      capitalAmount: this.courtVDetail?.capitalAmount,
    });

    const isReqVerdictDoc = this.courtVerdictDocuments
      ?.filter((s: any) => s.documentTemplate?.optional === false)
      .every((e: any) => e.imageId);
    this.getControl('requireVerdictDoc')?.setValue(isReqVerdictDoc);
    this.getControl('requireVerdictDoc')?.updateValueAndValidity();

    this.oldCourtVerdictTypecode = this.courtVDetail?.courtVerdictTypeCode;

    if (this.getControl('caseEnd')?.value) {
      this.setMandatoryLEXSF052();
      this.getControl(DOC_TEMPLATE.LEXSF052)?.setValue(this.documentUpload);
    }
    if (this.taskCode === 'MEMORANDUM_COURT_FIRST_INSTANCE' && this.statusCode === 'AWAITING') {
      this.getControl('acknowledgement')?.setValidators(Validators.required);
      this.getControl('acknowledgement')?.updateValueAndValidity();
    }
  }

  initData() {
    // for cosider appeal
    this.courtAppealBundle = this.courtService.courtAppealBundle;
    this.disputeAppealBundle = this.courtService.currentDisputeAppealBundle;
    if (this.courtAppealBundle && Object.values(this.courtAppealBundle)?.length > 0) {
      this.courtVDetail = this.courtAppealBundle.courtVerdicts
        ? this.courtAppealBundle.courtVerdicts
        : ({} as CourtVerdictDto);
      this.courtAppeal = this.courtAppealBundle.courtAppeal
        ? this.courtAppealBundle.courtAppeal
        : ({} as CourtAppealDto);
      this.courtCollateralSource.data = this.courtAppealBundle.collaterals ? this.courtAppealBundle.collaterals : [];
      this.courtAppealDocsInfo = {
        cif: this.taskService.taskDetail?.customerId
          ? this.taskService.taskDetail.customerId || this.route.snapshot.queryParams['customerId']
          : this.lawsuitService.currentLitigation?.customerId || '',
        litigationId: this.courtAppeal.litigationId || this.route.snapshot.queryParams['litigationId'] || '',
      };
      this.documentMapper(this.courtAppeal.courtAppealDocuments || [], this.courtAppeal.appealPurpose);
    } else if (this.disputeAppealBundle && Object.values(this.disputeAppealBundle)?.length > 0) {
      this.courtVDetail = this.disputeAppealBundle.courtVerdicts || ({} as CourtVerdictDto);
    } else {
      this.courtVDetail = this.courtService.courtVerdictDetail;
    }
    if (this.courtVDetail?.courtFee && this.courtVDetail?.courtFee?.length > 0) {
      this.courtVDetail.courtFee.push(this.courtVDetail?.courtFee[0]);
    }
    if (this.courtVDetail?.debtorLawyerFee && this.courtVDetail?.debtorLawyerFee?.length > 0) {
      this.courtVDetail.debtorLawyerFee.push(this.courtVDetail?.debtorLawyerFee[0]);
      this.total.TotalDebtorInitialAmount = this.courtVDetail?.debtorLawyerFee[0].initialAmount;
      this.total.TotalDebtorPaidAmount = this.courtVDetail?.debtorLawyerFee[0].paidAmount;
      this.total.TotalDebtorRemainingAmount = this.courtVDetail?.debtorLawyerFee[0].remainingAmount;
    }
  }

  async initDataVerdict() {
    let doc = this.formatDocsByCaseEnd(this.courtVDetail?.courtVerdictDocuments as DocumentDto[]) || [];
    let validateDocc = this.validateDoc(
      doc.verdictDocs,
      this.courtVDetail?.courtVerdictTypeCode,
      this.courtVDetail?.otherCourtFeeCode
    );
    this.courtVerdictDocuments = this.mappingDoc(validateDocc);
    this.updateDisplayDocuments();
    this.documentUpload = this.mappingDoc(doc.caseEndDocs) || [];
    let ciosCaseType = await this.masterDataService.ciosCaseType();
    this.ciosCaseTypeOptions = ciosCaseType?.ciosCaseTypeList || [];
    let courtVerdictType = await this.masterDataService.courtVerdictType();
    this.courtVerdictTypeOptions =
      courtVerdictType?.courtVerdictTypesList?.filter(f =>
        this.courtVDetail?.courtLevel === 'CIVIL' ? f.civilCourt : !f.civilCourt
      ) || [];
    let courtFeeType = await this.masterDataService.courtFeeType();
    let courtFeeTypesList: any = courtFeeType?.courtFeeTypesList;
    let option =
      [{ feeTypesName: this.blankOption.name, feeTypesCode: this.blankOption.value }].concat(courtFeeTypesList) || [];
    this.courtFeeTypeOptions = option;
    if (this.route.snapshot.queryParams['mode'] === Mode.EDIT || this.isViewMode) {
      this.setDropdown();
    } else if (this.route.snapshot.queryParams['mode'] === Mode.ADD) {
      let courtVerdict = await this.masterDataService.courtVerdict();
      this.courtVerdictOptions = courtVerdict?.courtVerdictList || [];
      let courtFeeSubType = await this.masterDataService.courtFeeSubType();
      let courtFeeSubTypesList: any = courtFeeSubType?.courtFeeSubTypesList;
      let _courtFeeSubTypeOptions = [
        {
          feeSubTypesName: this.blankOption.name,
          feeTypesCode: this.blankOption.value,
          feeSubTypesCode: this.blankOption.value,
        },
      ].concat(courtFeeSubTypesList);
      this.courtFeeSubTypeOptions = _courtFeeSubTypeOptions;
      let courtSubVerdict = await this.masterDataService.courtSubVerdict();
      this.courtSubVerdictOptions = courtSubVerdict?.courtSubVerdictList || [];
      this.getControl('otherCourtFeeTypeCode')?.setValue(this.blankOption.value);
      this.getControl('otherCourtFeeCode')?.setValue(this.blankOption.value);
    }

    this.redYearOption = this.get10YearFromNow();
    this.uploadMultiInfo = {
      cif:
        this.taskService.taskDetail.customerId ||
        this.lawsuitService.currentLitigation.customerId ||
        this.route.snapshot.queryParams['customerId'] ||
        '',
      litigationId: this.taskService.taskDetail.litigationId || this.route.snapshot.queryParams['litigationId'],
    };

    if (
      this.taskCode === 'MEMORANDUM_COURT_FIRST_INSTANCE' ||
      this.taskCode === 'MEMORANDUM_COURT_APPEAL' ||
      this.taskCode === 'MEMORANDUM_SUPREME_COURT'
    ) {
      this.getControl('elementRedCaseCiosCode')?.setValidators(Validators.required);
      this.getControl('elementRedCaseCiosCode')?.updateValueAndValidity();
      this.getControl('elementRedCaseRunning')?.setValidators(Validators.required);
      this.getControl('elementRedCaseRunning')?.updateValueAndValidity();
      this.getControl('elementRedCaseYear')?.setValidators(Validators.required);
      this.getControl('elementRedCaseYear')?.updateValueAndValidity();
    }
    if (this.taskCode === 'MEMORANDUM_COURT_APPEAL' || this.taskCode === 'MEMORANDUM_SUPREME_COURT') {
      this.getControl('elementBlackCaseCiosCode')?.setValidators(Validators.required);
      this.getControl('elementBlackCaseCiosCode')?.updateValueAndValidity();
      this.getControl('elementBlackCaseRunning')?.setValidators(Validators.required);
      this.getControl('elementBlackCaseRunning')?.updateValueAndValidity();
      this.getControl('elementBlackCaseYear')?.setValidators(Validators.required);
      this.getControl('elementBlackCaseYear')?.updateValueAndValidity();
    }
  }
  get10YearFromNow() {
    let years = [];
    let yearNow = new Date().getFullYear();
    for (let index = 0; index > -10; index--) {
      let yearString = yearNow + index + 543;
      let arr = {
        name: yearString.toString(),
        value: yearString.toString(),
      };
      years.push(arr);
    }
    return years;
  }

  getUploadMultiFileObj(doc: LitigationDocumentDto, uploadRequired: boolean, isActive?: boolean): IUploadMultiFile {
    return {
      documentTemplate: doc.documentTemplate,
      documentTemplateId: doc.documentTemplateId,
      imageId: doc.imageId,
      uploadDate: doc.documentDate,
      isUpload: this.isViewMode,
      viewOnly: true,
      uploadRequired: !this.isViewMode ? uploadRequired : false,
      active: isActive,
      removeDocument: true,
    };
  }

  documentMapper(_document: LitigationDocumentDto[], _appealPurpose?: CourtAppealDto.AppealPurposeEnum) {
    const courtAppealDocsTemp =
      this.taskCode === 'CONSIDER_SUPREME_COURT' ||
      this.taskCode === 'APPROVE_SUPREME_COURT' ||
      this.taskCode === 'CONDITIONAL_SUPREME_COURT'
        ? CONSIDER_SUPREME_COURT_DOCS_TEMP
        : CONSIDER_APPEAL_DOCS_TEMP;
    this.courtAppealDocs =
      _document
        ?.map(doc => {
          if (doc.documentTemplateId && courtAppealDocsTemp.includes(doc.documentTemplateId)) {
            if (
              this.taskCode === 'CONSIDER_SUPREME_COURT' ||
              this.taskCode === 'APPROVE_SUPREME_COURT' ||
              this.taskCode === 'CONDITIONAL_SUPREME_COURT'
            ) {
              switch (doc.documentTemplateId) {
                case DOC_TEMPLATE.LEXSF082:
                  return _appealPurpose === 'KTB_LAW_STOP_PETITION'
                    ? this.getUploadMultiFileObj(doc, true)
                    : ({} as IUploadMultiFile);
                case DOC_TEMPLATE.LEXSF084:
                  return _appealPurpose === 'REQUEST_PETITION' || _appealPurpose === 'STOP_PETITION'
                    ? this.getUploadMultiFileObj(doc, false)
                    : ({} as IUploadMultiFile);
                case DOC_TEMPLATE.LEXSF061:
                  return doc.objectType === 'SUPREME'
                    ? this.getUploadMultiFileObj(doc, false, false)
                    : ({} as IUploadMultiFile);
                default:
                  return {} as IUploadMultiFile;
              }
            } else {
              switch (doc.documentTemplateId) {
                case DOC_TEMPLATE.LEXSF081:
                  return _appealPurpose === 'KTB_LAW_STOP_APPEAL'
                    ? this.getUploadMultiFileObj(doc, true)
                    : ({} as IUploadMultiFile);
                case DOC_TEMPLATE.LEXSF083:
                  return _appealPurpose === 'REQUEST_APPEAL' || _appealPurpose === 'STOP_APPEAL'
                    ? this.getUploadMultiFileObj(doc, false)
                    : ({} as IUploadMultiFile);
                case DOC_TEMPLATE.LEXSF061:
                  return doc.objectType === 'APPEAL'
                    ? this.getUploadMultiFileObj(doc, false, false)
                    : ({} as IUploadMultiFile);
                default:
                  return {} as IUploadMultiFile;
              }
            }
          }
          return {} as IUploadMultiFile;
        })
        .filter(item => item.documentTemplate) || [];
    const processDocsTemp =
      this.taskCode === 'APPROVE_SUPREME_COURT' || this.taskCode === 'CONDITIONAL_SUPREME_COURT'
        ? APPROVE_SUPREME_COURT_DOCS_TEMP
        : APPROVE_APPEAL_DOCS_TEMP;
    this.processDocs =
      _document
        ?.map(doc => {
          if (doc.documentTemplateId && processDocsTemp.includes(doc.documentTemplateId)) {
            let _generateFile;
            if (doc.imageId) {
              _generateFile = {
                isAllow: false,
                isDownload: true,
              };
            } else {
              _generateFile =
                this.taskCode === 'APPROVE_SUPREME_COURT' || this.taskCode === 'CONDITIONAL_SUPREME_COURT'
                  ? {
                      isAllow: doc.documentTemplateId !== DOC_TEMPLATE.LEXSF055 ? false : true,
                      isDownload: doc.documentTemplateId !== DOC_TEMPLATE.LEXSF055 ? true : false,
                    }
                  : {
                      isAllow: doc.documentTemplateId !== DOC_TEMPLATE.LEXSF056 ? false : true,
                      isDownload: doc.documentTemplateId !== DOC_TEMPLATE.LEXSF056 ? true : false,
                    };
            }
            return {
              documentTemplate: doc.documentTemplate,
              documentTemplateId: doc.documentTemplateId,
              imageId: doc.imageId,
              uploadDate: doc.documentDate,
              isUpload: this.isViewMode,
              viewOnly: true,
              generateFile: _generateFile,
              uploadRequired: !this.isViewMode ? !!!doc.documentTemplate?.optional : false,
              params: { litigationCaseId: this.courtAppeal.litigationCaseId },
              removeDocument: false,
            } as IUploadMultiFile;
          }
          return {} as IUploadMultiFile;
        })
        .filter(item => item.documentTemplate) || [];
    this.additionalDocs =
      _document
        ?.map(doc => {
          if (doc.documentTemplateId && ADDTIONAL_DOCS_TEMP.includes(doc.documentTemplateId)) {
            if (this.taskCode === 'CONDITIONAL_APPEAL' && doc.objectType === 'CONDITION_APPEAL') {
              return {
                documentTemplate: doc.documentTemplate,
                documentTemplateId: doc.documentTemplateId,
                imageId: doc.imageId,
                uploadDate: doc.documentDate,
                isUpload: this.isViewMode,
                viewOnly: true,
                uploadRequired: false,
                removeDocument: true,
                active: true,
              } as IUploadMultiFile;
            } else if (this.taskCode === 'CONDITIONAL_SUPREME_COURT' && doc.objectType === 'CONDITION_SUPREME') {
              return {
                documentTemplate: doc.documentTemplate,
                documentTemplateId: doc.documentTemplateId,
                imageId: doc.imageId,
                uploadDate: doc.documentDate,
                isUpload: this.isViewMode,
                viewOnly: true,
                uploadRequired: false,
                removeDocument: true,
                active: true,
              } as IUploadMultiFile;
            } else {
              return {} as IUploadMultiFile;
            }
          }
          return {} as IUploadMultiFile;
        })
        .filter(item => item.documentTemplate) || [];
  }

  onSelectAppealPurpose($event: MatRadioChange) {
    const _consAppealRawData = this.consAppealCtrl.getRawValue() as CourtAppealDto;
    if ($event.value === 'KTB_LAW_STOP_APPEAL') {
      if (!!!this.courtAppealDocs.find(item => item.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF081)) {
        const documentTemplate: LitigationDocumentDto =
          this.courtAppeal.courtAppealDocuments?.find(
            item => item.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF081
          ) || ({} as LitigationDocumentDto);
        const documentUpload = this.getUploadMultiFileObj(documentTemplate, true);
        this.courtAppealDocs = [...this.courtAppealDocs, ...[documentUpload]].filter(
          item => item.documentTemplate?.documentTemplateId !== DOC_TEMPLATE.LEXSF083
        );
        this.courtAppealDocs = this.courtAppealDocs.sort(
          (a: any, b: any) => a.documentTemplate.optional - b.documentTemplate.optional
        );
        (this.consAppealCtrl.get('courtAppealDocuments') as UntypedFormArray).insert(
          0,
          this.courtService.documentCtrl(documentTemplate, true)
        );
        (this.consAppealCtrl.get('courtAppealDocuments') as UntypedFormArray).updateValueAndValidity();
        const _findIndex =
          _consAppealRawData.courtAppealDocuments?.findIndex(
            elem => elem.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF083
          ) || -1;
        if (_findIndex > -1) {
          (this.consAppealCtrl.get('courtAppealDocuments') as UntypedFormArray).removeAt(_findIndex);
        }
      }
    } else if ($event.value === 'REQUEST_APPEAL' || $event.value === 'STOP_APPEAL') {
      if (!!!this.courtAppealDocs.find(item => item.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF083)) {
        const documentTemplate: LitigationDocumentDto =
          this.courtAppeal.courtAppealDocuments?.find(
            item => item.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF083
          ) || ({} as LitigationDocumentDto);
        const documentUpload = this.getUploadMultiFileObj(documentTemplate, false);
        this.courtAppealDocs = [...this.courtAppealDocs, ...[documentUpload]].filter(
          item => item.documentTemplate?.documentTemplateId !== DOC_TEMPLATE.LEXSF081
        );
        (this.consAppealCtrl.get('courtAppealDocuments') as UntypedFormArray).push(
          this.courtService.documentCtrl(documentTemplate, false)
        );
        const _findIndex =
          _consAppealRawData.courtAppealDocuments?.findIndex(
            elem => elem.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF081
          ) || -1;
        if (_findIndex > -1) {
          (this.consAppealCtrl.get('courtAppealDocuments') as UntypedFormArray).removeAt(_findIndex);
        }
      }
    } else if ($event.value === 'KTB_LAW_STOP_PETITION') {
      if (!!!this.courtAppealDocs.find(item => item.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF082)) {
        const documentTemplate: LitigationDocumentDto =
          this.courtAppeal.courtAppealDocuments?.find(
            item => item.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF082
          ) || ({} as LitigationDocumentDto);
        const documentUpload = this.getUploadMultiFileObj(documentTemplate, true);
        this.courtAppealDocs = [...this.courtAppealDocs, ...[documentUpload]].filter(
          item => item.documentTemplate?.documentTemplateId !== DOC_TEMPLATE.LEXSF084
        );
        (this.consAppealCtrl.get('courtAppealDocuments') as UntypedFormArray).push(
          this.courtService.documentCtrl(documentTemplate, true)
        );
        const _findIndex =
          _consAppealRawData.courtAppealDocuments?.findIndex(
            elem => elem.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF084
          ) || -1;
        if (_findIndex > -1) {
          (this.consAppealCtrl.get('courtAppealDocuments') as UntypedFormArray).removeAt(_findIndex);
        }
      }
    } else if ($event.value === 'REQUEST_PETITION' || $event.value === 'STOP_PETITION') {
      if (!!!this.courtAppealDocs.find(item => item.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF084)) {
        const documentTemplate: LitigationDocumentDto =
          this.courtAppeal.courtAppealDocuments?.find(
            item => item.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF084
          ) || ({} as LitigationDocumentDto);
        const documentUpload = this.getUploadMultiFileObj(documentTemplate, false);
        this.courtAppealDocs = [...this.courtAppealDocs, ...[documentUpload]].filter(
          item => item.documentTemplate?.documentTemplateId !== DOC_TEMPLATE.LEXSF082
        );
        (this.consAppealCtrl.get('courtAppealDocuments') as UntypedFormArray).push(
          this.courtService.documentCtrl(documentTemplate, false)
        );
        const _findIndex =
          _consAppealRawData.courtAppealDocuments?.findIndex(
            elem => elem.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF082
          ) || -1;
        if (_findIndex > -1) {
          (this.consAppealCtrl.get('courtAppealDocuments') as UntypedFormArray).removeAt(_findIndex);
        }
      }
    }
    this.consAppealCtrl.get('courtAppealDocuments')?.updateValueAndValidity();
  }

  async initPermission() {
    if (
      !this.appealTasks.includes(this.taskCode) &&
      !this.supremeTasks.includes(this.taskCode) &&
      !this.route.snapshot.queryParams['action']
    ) {
      this.actionOnScreen.blackCase =
        this.courtVDetail?.courtLevel === CourtVerdictDto.CourtLevelEnum.Appeal ||
        this.courtVDetail?.courtLevel === CourtVerdictDto.CourtLevelEnum.Supreme;
      this.actionOnScreen.redCase = this.courtVDetail?.courtLevel === CourtVerdictDto.CourtLevelEnum.Appeal;
    } else {
      this.actionOnScreen.blackCase = false;
      this.actionOnScreen.redCase = false;
    }
    this.actionOnScreen.courtVerdict = this.courtVDetail?.courtLevel === CourtVerdictDto.CourtLevelEnum.Civil;
    this.actionOnScreen.canExtendAppeal =
      this.courtVDetail?.courtVerdictTypeCode !== '2' && this.courtVDetail?.courtVerdictTypeCode !== '4';
  }

  async filterVerdictTypeList(value: any) {
    this.actionOnScreen.courtVerdict = value === '1' || value === '2' || value === '3';
    this.actionOnScreen.otherCourtFeeCode = value === '1' || value === '2' || value === '3' || value === '4';
    this.actionOnScreen.courtDate = value === '4';
    this.actionOnScreen.canExtendAppeal = value !== '2' && value !== '4';
    let courtVerdict = await this.masterDataService.courtVerdict();
    this.courtVerdictOptions = courtVerdict.courtVerdictList?.filter(f => f.verdictTypesCode === value) || [];
    let validateDocc = this.validateDoc(this.courtVerdictDocuments, value);
    this.courtVerdictDocuments = this.mappingDoc(validateDocc);
    if (value === '4') {
      this.getControl('courtVerdictCode').clearValidators([]);
      this.getControl('disposeCaseDate')?.setValidators(Validators.required);
    } else {
      this.getControl('courtVerdictCode').clearValidators(Validators.required);
      this.getControl('disposeCaseDate')?.clearValidators();
    }

    this.getControl('courtVerdictCode')?.updateValueAndValidity();
    this.getControl('disposeCaseDate')?.updateValueAndValidity();
  }

  onChangeOtherCourtFeeType(value: string) {
    let courtVerdictTypeCode = this.getControl('courtVerdictTypeCode')?.value;
    let validateDocc = this.validateDoc(this.courtVerdictDocuments, courtVerdictTypeCode, value);
    this.courtVerdictDocuments = this.mappingDoc(validateDocc);
    this.updateDisplayDocuments();
  }

  setDocMandatory(list: Map<string, boolean>) {
    let doc = this.courtVerdictDocuments.map((f: DocumentDto) => {
      let templateId: string = f?.documentTemplate?.documentTemplateId || '';
      let value = list.get(templateId);
      if (value !== undefined) {
        f!.documentTemplate!.optional = value;
        if (value === false && !!!f.imageId) {
          f.active = false;
        }
      }
      return f;
    });
    this.courtVerdictDisplayOptions = new Map([...this.courtVerdictDisplayOptions, ...list]);
    this.courtVerdictDocuments = this.mappingDoc(doc);
    this.updateDisplayDocuments();
  }

  isDocUploaded() {
    return this.displayCourtVerdictDocuments.some((e: any) => e.imageId);
  }

  clearUploadedDocuments() {
    this.courtVerdictDocuments = this.courtVerdictDocuments
      .map((f: DocumentDto) => {
        if (this.courtVerdictDisplayOptions.has(f.documentTemplate?.documentTemplateId!)) {
          f.imageId = '';
          f.documentDate = '';
        }
        return f;
      })
      .sort((a: any, b: any) => a?.documentTemplate?.optional - b?.documentTemplate?.optional);
  }

  async onChangeCourtVerdictType(value: any) {
    if (this.isDocUploaded()) {
      const confirmChange = await this.notificationService.warningDialog(
        'COURT.DIALOG_CONFIRM_CHANGE_DIALOG_TITLE',
        'COURT.DIALOG_DATA_CHANGE_WARNING',
        'COURT.DIALOG_CONFIRM_CHANGE_DIALOG_TITLE',
        'icon-Check-Square-Free-Fill'
      );
      if (!confirmChange) {
        this.getControl('courtVerdictTypeCode')?.setValue(this.oldCourtVerdictTypecode);
        return;
      }
    }
    this.oldCourtVerdictTypecode = value;
    this.actionOnScreen.courtSubVerdict = false;
    this.getControl('otherCourtFeeTypeCode')?.setValue('');
    this.clearUploadedDocuments();
    await this.filterVerdictTypeList(value);
    if (value === '1') {
      this.getControl('courtVerdictCode')?.setValue('1');
      if (this.getControl('otherCourtFeeTypeCode')?.value === this.blankOption.value) {
        this.getControl('otherCourtFeeTypeCode')?.setValue('3');
        this.onChangeCourtFeeType('3');
      }
    } else if (value === '2') {
      this.getControl('courtVerdictCode')?.setValue('6');
    } else if (value === '3') {
      this.getControl('courtVerdictCode')?.setValue('9');
    }
    this.updateDisplayDocuments();
  }

  updateDisplayDocuments() {
    if (this.isViewMode) {
      const docs = this.courtVerdictDocuments.filter((f: DocumentDto) => f.imageId && f.imageId !== '');
      this.displayCourtVerdictDocuments = docs;
      return;
    }
    const displayTemplateIds = Array.from(this.courtVerdictDisplayOptions.keys());
    const docs = this.courtVerdictDocuments.filter((f: DocumentDto) =>
      displayTemplateIds.includes(f.documentTemplate?.documentTemplateId!)
    );
    this.displayCourtVerdictDocuments = docs;
  }

  getDocumentOptions(verdictTypeCode?: string, otherCourtFeeCode?: string) {
    if (verdictTypeCode === '') return new Map();
    let docOptions: Array<[string, boolean]> = [];
    if (this.taskCode === 'MEMORANDUM_COURT_FIRST_INSTANCE') {
      switch (verdictTypeCode) {
        case '1':
          docOptions.push([DOC_TEMPLATE.LEXSF010, false], [DOC_TEMPLATE.LEXSF009, false]);
          break;
        case '2':
          docOptions.push([DOC_TEMPLATE.LEXSF012, false], [DOC_TEMPLATE.LEXSF013, false]);
          break;
        case '3':
          docOptions.push([DOC_TEMPLATE.LEXSF010, false], [DOC_TEMPLATE.LEXSF009, true]);
          break;
        case '4':
          docOptions.push([DOC_TEMPLATE.LEXSF010, false]);
          break;
      }
    } else if (this.taskCode === 'MEMORANDUM_COURT_APPEAL') {
      docOptions.push([DOC_TEMPLATE.LEXSF007, false], [DOC_TEMPLATE.LEXSF009, false]);
    } else if (this.taskCode === 'MEMORANDUM_SUPREME_COURT') {
      docOptions.push([DOC_TEMPLATE.LEXSF008, false], [DOC_TEMPLATE.LEXSF009, false]);
    }
    if (otherCourtFeeCode === '1' || otherCourtFeeCode === '3' || otherCourtFeeCode === '5') {
      docOptions.push([DOC_TEMPLATE.LEXSF098, false]);
    }
    docOptions.push([DOC_TEMPLATE.LEXSF004, true]);
    return new Map<string, boolean>(docOptions);
  }

  validateDoc(courtVerdictDocuments: DocumentDto[], verdictTypeCode?: string, otherCourtFeeCode?: string) {
    this.courtVerdictDisplayOptions = this.getDocumentOptions(verdictTypeCode, otherCourtFeeCode);
    return courtVerdictDocuments
      .map((f: DocumentDto) => {
        if (this.courtVerdictDisplayOptions.has(f.documentTemplate?.documentTemplateId!)) {
          f.documentTemplate!.optional = this.courtVerdictDisplayOptions.get(f.documentTemplate?.documentTemplateId!);
        }
        return f;
      })
      .sort((a: any, b: any) => a?.documentTemplate?.optional - b?.documentTemplate?.optional);
  }

  async setDropdown() {
    await this.filterVerdictTypeList(this.getControl('courtVerdictTypeCode').value);
    await this.filterVerdictList(this.getControl('courtVerdictCode').value);
    await this.filterCourtFeeTypeList(this.getControl('otherCourtFeeTypeCode').value);
    if (this.actionOnScreen.otherCourtFeeCode) {
      let code = this.getControl('otherCourtFeeCode')?.value;
      let isRequired = code !== '3' && code !== '1';
      let list = new Map<string, boolean>([[DOC_TEMPLATE.LEXSF098, isRequired]]);
      this.setDocMandatory(list);
    }
    this.updateDisplayDocuments();
  }

  async filterVerdictList(value: any) {
    let courtSubVerdict = await this.masterDataService.courtSubVerdict();
    this.actionOnScreen.courtSubVerdict = this.getControl('courtVerdictTypeCode').value === '1' && value === '3';
    this.courtSubVerdictOptions =
      courtSubVerdict?.courtSubVerdictList?.filter(
        f => f.verdictCode === value && f.verdictTypesCode === this.getControl('courtVerdictTypeCode')?.value
      ) || [];
  }

  async onChangeCourtVerdict(value: any) {
    this.filterVerdictList(value);
    if (this.getControl('courtVerdictTypeCode').value === '1' && value === '3') {
      this.getControl('courtSubVerdictCode')?.setValue('5');
    }
  }

  async filterCourtFeeTypeList(value: any) {
    let courtFeeSubType = await this.masterDataService.courtFeeSubType();
    let blankOption = [
      {
        feeSubTypesName: this.blankOption.name,
        feeTypesCode: this.blankOption.value,
        feeSubTypesCode: this.blankOption.value,
      },
    ];
    let courtFeeSubTypesList: any = courtFeeSubType.courtFeeSubTypesList?.filter(f => f.feeTypesCode === value) || [];
    let _courtFeeSubTypeOptions = blankOption.concat(courtFeeSubTypesList);
    this.courtFeeSubTypeOptions = _courtFeeSubTypeOptions;

    this.actionOnScreen.otherCourtFeeCode = value === '2' || value === '3';
    this.actionOnScreen.courtFee = value !== '3';
  }

  async onChangeCourtFeeType(value: any) {
    await this.filterCourtFeeTypeList(value);
    this.courtVerdictDisplayOptions = this.getDocumentOptions(this.getControl('courtVerdictTypeCode')?.value);
    if (value === '1') {
      this.getControl('otherCourtFeeCode').clearValidators([]);
    } else {
      this.getControl('otherCourtFeeCode')?.setValue(this.blankOption.value);
      this.getControl('otherCourtFeeCode').clearValidators(Validators.required);
    }
    this.getControl('otherCourtFeeCode')?.updateValueAndValidity();
    this.updateDisplayDocuments();
  }

  formatDocsByCaseEnd(docs: DocumentDto[] = []): any {
    let caseEndDocs = [];
    let verdictDocs = [];
    for (let index = 0; index < docs.length; index++) {
      const f = docs[index];
      let isApprover = this.statusCode === 'PENDING_APPROVAL' || this.statusCode === 'AWAITING' ? f?.imageId : true;
      if (isApprover) {
        if (f?.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF052) {
          caseEndDocs.push(f);
        } else {
          if (f?.documentTemplate?.documentTemplateId !== DOC_TEMPLATE.LEXSF052) {
            verdictDocs.push(f);
          }
        }
      }
    }

    return { verdictDocs: verdictDocs, caseEndDocs: caseEndDocs };
  }

  mappingDoc(docs: DocumentDto[]) {
    return docs
      .map((f: DocumentDto) => {
        return {
          ...f,
          uploadDate: f.documentDate,
          documentTemplate: f.documentTemplate,
          documentTemplateId: f?.documentTemplate?.documentTemplateId,
          imageId: f.imageId,
          uploadRequired: f.documentTemplate?.optional === false,
          isUpload: !!f.imageId,
          removeDocument: true,
          active: f?.active === true,
        };
      })
      .sort((a, b) => (a.uploadRequired === b.uploadRequired ? 0 : a.uploadRequired ? -1 : 1));
  }

  async download() {
    let lg = this.courtVDetail?.litigationCaseId || 0;
    let response = await this.courtService.downloadReceiveRequestForm(lg, this.taskId, 'VERDICT');
    const _fileType = FileTypeMapper.get(response.contentType || '');
    this.documentService.downloadDocumentFromByteArray(
      response,
      'ใบประสงค์รับเงินค่าธรรมเนียมคืนจากศาลยุติธรรม',
      _fileType as FileType
    );
  }

  uploadFileEvent(list: any) {
    this.courtService?.courtVerdictForm?.markAsDirty();
    this.displayCourtVerdictDocuments = list;
    this.courtVerdictDocuments = this.courtVerdictDocuments.map((f: DocumentDto) => {
      const replaceDoc = list.find(
        (ff: DocumentDto) => f.documentTemplate?.documentTemplateId === ff.documentTemplate?.documentTemplateId
      );
      return replaceDoc ? { ...f, ...replaceDoc } : f;
    });
    this.courtService.courtVerdictDetail.courtVerdictDocuments = this.courtVerdictDocuments;
    let hasUploadAll: any = this.displayCourtVerdictDocuments
      ?.filter((s: any) => s.documentTemplate?.optional === false)
      .every((e: any) => e.imageId);
    this.getControl('requireVerdictDoc')?.setValue(hasUploadAll);
    this.getControl('requireVerdictDoc')?.updateValueAndValidity();
  }

  uploadFileEventLEXSF052(list: any) {
    this.courtService?.courtVerdictForm?.markAsDirty();
    this.courtService.courtVerdictForm.get(DOC_TEMPLATE.LEXSF052)?.setValue(list);
    this.courtService.courtVerdictForm.get(DOC_TEMPLATE.LEXSF052)?.updateValueAndValidity();
    if (list && list.length > 0) {
      this.getControl('requireRedCaseDoc')?.setValue(true);
      this.getControl('requireRedCaseDoc')?.updateValueAndValidity();
    }
  }

  async onViewDocument(element: any) {
    const response: any = await this.documentService.getDocument(
      element.attachment?.imageId || '',
      DocumentDto.ImageSourceEnum.Lexs
    );
    if (!response) return;
    const fileName = element.attachment?.documentTemplate?.documentName ?? 'doc';
    this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
  }

  uploadFileAppealEvent(list: any) {
    (this.consAppealCtrl.get('courtAppealDocuments') as UntypedFormArray).controls.map(
      (ctrl: AbstractControl, index: number) => {
        const docTempId = ctrl.get('documentTemplateId')?.value;
        const findDocTempId = list.find((i: any) => i.documentTemplateId === docTempId);
        ctrl.get('documentTemplateId')?.setValue(findDocTempId.documentTemplateId);
        ctrl.get('documentName')?.setValue(findDocTempId.documentTemplate?.documentName);
        ctrl.get('imageId')?.setValue(findDocTempId.imageId);
        ctrl.get('documentDate')?.setValue(findDocTempId.documentDate);
        ctrl.get('documentTemplateId')?.updateValueAndValidity();
        ctrl.get('documentName')?.updateValueAndValidity();
        ctrl.get('imageId')?.updateValueAndValidity();
        ctrl.get('documentDate')?.updateValueAndValidity();
      }
    );
  }

  expandPanel() {
    this.hided = !this.hided;
  }

  handleCollateralPanel() {
    this.isCollateralOpened = !this.isCollateralOpened;
  }

  onBankCommentChange(e: any) {
    this.courtService.updateBankRemark(this.courtVDetail?.litigationCaseId || -1, e.target.value);
  }

  getControl(name: string): any {
    return this.courtVerdictForm?.get(name);
  }

  getConsAppealCtrl(name: string): AbstractControl | null {
    return this.consAppealCtrl?.get(name);
  }

  getErrotCourtAppealDocuments(): boolean {
    return (this.consAppealCtrl.get('courtAppealDocuments') as UntypedFormArray).invalid;
  }

  onClickCaseEnd(e: any) {
    let caseEnd = !this.getControl('caseEnd')?.value;
    this.getControl('caseEnd').setValue(caseEnd);
    if (caseEnd) {
      this.setMandatoryLEXSF052();
    } else {
      this.getControl('requireRedCaseDoc').clearValidators();
      this.getControl('requireRedCaseDoc')?.updateValueAndValidity();
    }
  }
  setMandatoryLEXSF052() {
    this.getControl('requireRedCaseDoc')?.setValidators(Validators.required);
    this.getControl('requireRedCaseDoc')?.updateValueAndValidity();
  }

  onApproveDecisionChange(event: MatRadioChange) {
    if (event.value === 'CONDITIONAL_APPEAL') {
      this.consAppealCtrl.get('approverRemark')?.setValidators(Validators.required);
      this.consAppealCtrl.get('approverRemark')?.updateValueAndValidity();
    } else {
      this.consAppealCtrl.get('approverRemark')?.clearValidators();
      this.consAppealCtrl.get('approverRemark')?.updateValueAndValidity();
    }
  }

  onConditionalAppealChange(event: MatRadioChange) {
    if (!!event.value) {
      this.consAppealCtrl.get('conditionalRemark')?.setValidators(Validators.required);
      this.consAppealCtrl.get('conditionalRemark')?.updateValueAndValidity();
    } else {
      this.consAppealCtrl.get('conditionalRemark')?.clearValidators();
      this.consAppealCtrl.get('conditionalRemark')?.updateValueAndValidity();
    }
  }

  onCourtRefundChange(event: any, element: any) {
    if (!event?.target?.value?.startsWith('-')) {
      if (event?.target?.value) {
        element.courtRefundAmount = this.formatToDecimal(event.target.value);
      }
      this.courtVDetail.totalCourtRefundAmount = this.sumRows(this.courtVDetail?.courtFee, 'courtRefundAmount') as any;
    } else {
      element.courtRefundAmount = '';
      this.courtVDetail.totalCourtRefundAmount = 0;
    }
  }

  checkChanged(element: any) {
    element.hasEdit = true;
  }

  onInitialAmountChange(event: any, element: any) {
    this.courtService?.courtVerdictForm?.markAsDirty();
    if (!event?.target?.value?.startsWith('-')) {
      let calculate = event?.target?.value - (Utils.convertStringToNumber(element.paidAmount) || 0);
      element.remainingAmount = calculate > 0 ? calculate : 0;
      element.initialAmount = this.formatToDecimal(event.target.value);
      element.hasEdit = true;
      this.total.TotalDebtorInitialAmount = this.sumRows(this.courtVDetail?.debtorLawyerFee, 'initialAmount') as any;
      this.total.TotalDebtorRemainingAmount = this.sumRows(
        this.courtVDetail?.debtorLawyerFee,
        'remainingAmount'
      ) as any;
    } else {
      element.initialAmount = '';
      element.remainingAmount = '';
      this.total.TotalDebtorInitialAmount = 0;
    }
  }
  onDebtorPaidAmountChange(event: any, element: any) {
    this.courtService?.courtVerdictForm?.markAsDirty();
    if (!event?.target?.value?.startsWith('-')) {
      console.log(Utils.convertStringToNumber(element.initialAmount), element.initialAmount, event?.target?.value);
      let calculate = (Utils.convertStringToNumber(element.initialAmount) || 0) - event?.target?.value;
      element.remainingAmount = calculate > 0 ? calculate : 0;
      element.paidAmount = this.formatToDecimal(event.target.value);
      element.hasEdit = true;
      this.total.TotalDebtorPaidAmount = this.sumRows(this.courtVDetail?.debtorLawyerFee, 'paidAmount') as any;
      this.total.TotalDebtorRemainingAmount = this.sumRows(
        this.courtVDetail?.debtorLawyerFee,
        'remainingAmount'
      ) as any;
    } else {
      element.paidAmount = '';
      element.remainingAmount = '';
      this.total.TotalDebtorPaidAmount = 0;
    }
  }
  onRemainingAmountChange(event: any, element: any) {
    this.courtService?.courtVerdictForm?.markAsDirty();
    if (!event?.target?.value?.startsWith('-')) {
      element.remainingAmount = this.formatToDecimal(event.target.value);
      element.hasEdit = true;
      this.total.TotalDebtorRemainingAmount = this.sumRows(
        this.courtVDetail?.debtorLawyerFee,
        'remainingAmount'
      ) as any;
    } else {
      element.remainingAmount = '';
      this.total.TotalDebtorRemainingAmount = 0;
    }
  }

  sliceDataTable(allData: CourtCollateralDto[], start?: number, end?: number) {
    const data = [...allData];
    this.courtCollateralSource.filteredData = data.slice(start ? start : 0, end ? end : this.pageSize);
  }

  onPaging(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.courtCollateralSource.filteredData = this.courtCollateralSource.data.slice(
      event.startLabel ? event.startLabel - 1 : 0,
      event.fromLabel
    );
  }

  sumRows(data: any, field: any) {
    let sum = 0;
    for (let index = 0; index < data?.length; index++) {
      const element: any = data[index][field];
      if (index !== data.length - 1) {
        sum = sum + Number(element?.toString().replace(/,/g, ''));
      }
    }
    return sum;
  }

  formatToDecimal(inputValue: string) {
    const parts = inputValue
      .toString()
      .replace(/[^0-9\,\.]*/g, '')
      .replace(/,/g, '')
      .split('.');
    const decimalValue = `${parts[0]}.${parts[1] ? parts[1] : ''}`;
    let newValue = this.decimal.transform(decimalValue, '1.2-2');
    return newValue;
  }

  async onDownloadDocInstruction(isViewMode: boolean = false) {
    let litigationCaseId = this.isSaveCaseEnd? this.route.snapshot.queryParams['prevLitigationCaseId'] ?? -1 : this.courtAppeal.litigationCaseId;
    if (isViewMode) {
      const response: any = await this.courtService.downloadOrderLetter(
        litigationCaseId,
        this.taskService.taskDetail.id || -1
      );
      this.documentService.downloadDocument(response);
    } else {
      if (!this.consAppealCtrl.invalid) {
        const _courtAppeal = this.courtService.courtAppealBundle.courtAppeal;
        const _courtAppealRawValue = this.consAppealCtrl.getRawValue();
        this.courtService.courtAppealBundle.courtAppeal = { ..._courtAppeal, ..._courtAppealRawValue };
        if (this.courtService.courtAppealBundle.courtAppeal) {
          if (this.courtService.courtAppealBundle.courtAppeal.updateFlag) {
            this.courtService.courtAppealBundle.courtAppeal.updateFlag =
              this.courtService.courtAppealBundle.courtAppeal.updateFlag === 'U' ? 'U' : 'A';
          } else {
            this.courtService.courtAppealBundle.courtAppeal.updateFlag = 'A';
          }
        }
        let courtAppealReq: CourtAppealDto = {
          ...this.courtService.courtAppealBundle?.courtAppeal,
          headerFlag: CourtVerdictDto.HeaderFlagEnum.Draft,
        };
        courtAppealReq.deductionForGuarantor = Number(courtAppealReq.deductionForGuarantor) === 0 ? true : false;
        courtAppealReq.courtAppealDocuments = courtAppealReq?.courtAppealDocuments?.filter(
          el => el.imageId && el.imageId !== ''
        );
        this.courtService.courtAppealBundle.courtAppeal = courtAppealReq;
        const respone = await this.courtService.approveAppeal(
          this.taskService.taskDetail.id || -1,
          this.courtService.courtAppealBundle.courtAppeal
        );
        if (respone === null) {
          const response: any = await this.courtService.downloadOrderLetter(
            this.courtAppeal.litigationCaseId || 0,
            this.taskService.taskDetail.id || -1
          );
          this.documentService.downloadDocument(response);
        }
      }
      this.consAppealCtrl.markAllAsTouched();
    }
  }

  onSelectedCaseEndCode(event: any) {
    this.getControl('caseEndCode').setValue(event);
    this.getControl('caseEndCode')?.updateValueAndValidity();
  }
}
