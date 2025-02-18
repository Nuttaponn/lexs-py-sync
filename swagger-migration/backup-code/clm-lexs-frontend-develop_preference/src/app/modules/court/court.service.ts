import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DOC_TEMPLATE } from '@app/shared/constant';
import { BlobType, FileType, LexsUserPermissionCodes, Mode, TMode, statusCode, taskCode } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils/util';
import {
  CourtAppealBundleDto,
  CourtAppealDto,
  CourtControllerService,
  CourtDecreeDto,
  CourtDecreePersonDto,
  CourtResultDto,
  CourtVerdictDto,
  DefendantDto,
  DisputeAppealBundleDto,
  DisputeAppealDto,
  DocumentDto,
  DownloadDocumentResponse,
  ExecutionFeeRequest,
  ExecutionReceiptDto,
  ExtendAppealDto,
  LitigationDetailDto,
  LitigationDocumentDto,
  MeLexsUserDto,
  PayCourtFeeControllerService,
  RejectRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { TaskService } from '../task/services/task.service';
import {
  APPROVE_APPEAL_DOCS_TEMP,
  APPROVE_SUPREME_COURT_DOCS_TEMP,
  CONDITIONAL_APPEAL_DOCS_TEMP,
  CONDITIONAL_SUPREME_COURT_DOCS_TEMP,
  CONSIDER_APPEAL_DOCS_TEMP,
  CONSIDER_SUPREME_COURT_DOCS_TEMP,
} from './court.constant';

@Injectable({
  providedIn: 'root',
})
export class CourtService {
  private _hasEdit!: boolean;
  private _courtResult!: CourtResultDto[];
  private _courtAppealBundle!: CourtAppealBundleDto;
  private _courtVerdictDetail!: CourtVerdictDto;
  private _currentDecree!: CourtDecreeDto;
  private _currentDecreePerson!: CourtDecreePersonDto;
  private _currentDisputeAppealBundle!: DisputeAppealBundleDto;
  private _courtVerdictForm!: UntypedFormGroup;
  private _savedDecree: CourtDecreeDto | null = null; // keeps which decrees were recorded
  private _currentExecutionReceipt!: ExecutionReceiptDto;

  courtResultSubject = new BehaviorSubject<Array<CourtResultDto> | undefined>(undefined);

  get hasEdit(): boolean {
    return this._hasEdit;
  }
  set hasEdit(value: boolean) {
    this._hasEdit = value;
  }

  get courtResult(): CourtResultDto[] {
    return this._courtResult;
  }
  set courtResult(value: CourtResultDto[]) {
    this._courtResult = value;
  }

  get courtAppealBundle(): CourtAppealBundleDto {
    return this._courtAppealBundle;
  }
  set courtAppealBundle(value: CourtAppealBundleDto) {
    this._courtAppealBundle = value;
  }

  get courtVerdictDetail() {
    return this._courtVerdictDetail;
  }
  set courtVerdictDetail(val) {
    this._courtVerdictDetail = val;
  }

  get currentDecree() {
    return this._currentDecree;
  }
  set currentDecree(val) {
    this._currentDecree = val;
  }

  get currentDecreePerson() {
    return this._currentDecreePerson;
  }
  set currentDecreePerson(val) {
    this._currentDecreePerson = val;
  }
  get courtVerdictForm() {
    return this._courtVerdictForm;
  }
  set courtVerdictForm(val) {
    this._courtVerdictForm = val;
  }

  get currentDisputeAppealBundle() {
    return this._currentDisputeAppealBundle;
  }
  set currentDisputeAppealBundle(val) {
    this._currentDisputeAppealBundle = val;
  }

  get savedDecree() {
    return this._savedDecree;
  }
  set savedDecree(val) {
    this._savedDecree = val;
  }

  get currentExecutionReceipt() {
    return this._currentExecutionReceipt;
  }
  set currentExecutionReceipt(val) {
    this._currentExecutionReceipt = val;
  }

  constructor(
    private courtControllerService: CourtControllerService,
    private payCourtFeeControllerService: PayCourtFeeControllerService,
    private errorHandlingService: ErrorHandlingService,
    private fb: UntypedFormBuilder,
    private taskService: TaskService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  async getCourtResults(lgId: string = '', taskId?: number): Promise<CourtResultDto[]> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.getCourtResults(lgId, taskId))
    );
  }

  async getCourtVerdictDetail(
    litigationCaseId: number,
    litigationId: string,
    taskId?: number
  ): Promise<CourtVerdictDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.getCourtVerdictDetail(litigationCaseId, litigationId, taskId))
    );
  }

  async getCourtAppeal(litigationCaseId: number, litigationId: string, taskId?: number): Promise<CourtAppealBundleDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.getCourtAppeal(litigationCaseId, litigationId, taskId))
    );
  }

  async getCourtDecreeDetail(
    courtDecreeId: number,
    litigationCaseId: number,
    litigationId: string
  ): Promise<CourtDecreeDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.getCourtDecreeDetail(courtDecreeId, litigationCaseId, litigationId))
    );
  }

  async getCourtDecreePersonDetail(courtDecreeId: number, personId: string): Promise<CourtDecreePersonDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.getCourtDecreePersonDetail(courtDecreeId, personId))
    );
  }

  async getCourtDocument(processType: string): Promise<DocumentDto[]> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.getCourtDocument(processType))
    );
  }

  async getDisputeAppealDetail(
    disputeAppealId: number,
    litigationCaseId: number,
    litigationId: string,
    taskId?: number
  ): Promise<DisputeAppealBundleDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.courtControllerService.getDisputeAppealDetail(disputeAppealId, litigationCaseId, litigationId, taskId)
      )
    );
  }

  async updateCourtAppeal(courtAppeal: CourtAppealDto, taskId?: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.courtControllerService.updateCourtAppeal(courtAppeal, taskId)),
      { notShowAsSnackBar: true }
    );
  }

  async updateCourtDecree(courtDecree: CourtDecreeDto): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.updateCourtDecree(courtDecree))
    );
  }

  async updateCourtDecreePerson(courtDecreePerson: CourtDecreePersonDto): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.updateCourtDecreePerson(courtDecreePerson))
    );
  }

  async updateDisputeAppeal(disputeAppeal: DisputeAppealDto): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.updateDisputeAppeal(disputeAppeal))
    );
  }

  async updateBankRemark(litigationCaseId: number, bankRemark: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.updateBankRemark(litigationCaseId, { bankRemark }))
    );
  }

  async reject(taskId: number, request: RejectRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.reject(taskId, request))
    );
  }

  async approve(taskId: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.approve(taskId))
    );
  }

  async approveAppeal(taskId: number, courtAppeal: CourtAppealDto): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.courtControllerService.approveAppeal(taskId, courtAppeal)),
      { notShowAsSnackBar: true }
    );
  }

  async updateCourtVerdict(courtVerdict: CourtVerdictDto): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.updateCourtVerdict(courtVerdict))
    );
  }

  async downloadOrderLetter(litigationCaseId: number, taskId?: number, disableError?: boolean) {
    if (disableError) {
      return await this.errorHandlingService.invokeNoRetry(
        () => lastValueFrom(this.courtControllerService.downloadOrderLetter(litigationCaseId, taskId)),
        {
          disableErrorDisplay: true,
        }
      );
    } else {
      return await this.errorHandlingService.invokeNoRetry(() =>
        lastValueFrom(this.courtControllerService.downloadOrderLetter(litigationCaseId, taskId))
      );
    }
  }

  async downloadConclusionDocument(litigationCaseId: number): Promise<DownloadDocumentResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.downloadConclusionDocument(litigationCaseId))
    );
  }

  async savePayExecutionFee(taskId: number, request: ExecutionFeeRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.payCourtFeeControllerService.savePayExecutionFee(taskId, request))
    );
  }

  async readPaymentForm(taskId: number, file: Blob) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.payCourtFeeControllerService.readPaymentForm(taskId, file))
    );
  }

  async getPayExecutionFee(taskId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.payCourtFeeControllerService.getPayExecutionFee(taskId))
    );
  }

  async getUploadExecutionReceipt(litigationCaseId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.payCourtFeeControllerService.getUploadExecutionReceipt(litigationCaseId))
    );
  }

  async saveUploadExecutionReceipt(taskId: number, request: ExecutionReceiptDto) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.payCourtFeeControllerService.saveUploadExecutionReceipt(taskId, request))
    );
  }

  async readReceiptFormExecutionFee(taskId: number, uploadFlag: 'RECEIPT' | 'PAYMENT', file: Blob) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.payCourtFeeControllerService.readReceiptFormExecutionFee(taskId, uploadFlag, file))
    );
  }

  async processNotDecree(taskId: number, request: ExecutionFeeRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.payCourtFeeControllerService.processNotDecree(taskId, request))
    );
  }

  spitComma(str: any) {
    return str?.toString().split(',').join('');
  }

  getCourtVerdictoRequest() {
    let form = this.courtVerdictForm?.value as any;
    let req: CourtVerdictDto;
    let verdictDocs: any = !!!this.courtVerdictDetail?.courtVerdictDocuments
      ? [].concat(form[DOC_TEMPLATE.LEXSF052])
      : this.courtVerdictDetail?.courtVerdictDocuments.concat(form[DOC_TEMPLATE.LEXSF052]);

    if (verdictDocs) {
      verdictDocs = verdictDocs
        ?.map((f: any) => {
          let date = f?.uploadDate ? new Date(f?.uploadDate) : f?.documentDate;

          return { ...f, documentDate: date, uploadDate: date, active: !!f?.imageId ? !!f?.imageId : f?.active };
        })
        .filter((s: any) => s);
    }
    delete form?.LEXSF052;
    let courtFee = this.courtVerdictDetail?.courtFee?.map(m => {
      let courtRefundAmount = this.spitComma(m.courtRefundAmount);
      return { ...m, courtRefundAmount: courtRefundAmount };
    });
    let debtorLawyerFee = this.courtVerdictDetail?.debtorLawyerFee?.map(m => {
      let initialAmount = this.spitComma(m.initialAmount);
      let paidAmount = this.spitComma(m.paidAmount);
      let remainingAmount = this.spitComma(m.remainingAmount);
      return { ...m, initialAmount: initialAmount, paidAmount: paidAmount, remainingAmount: remainingAmount };
    });

    if (form) {
      req = {
        ...form,
        courtVerdictCode:
          form?.courtVerdictTypeCode === '4' ||
          form?.courtVerdictTypeCode === '5' ||
          form?.courtVerdictTypeCode === '6' ||
          form?.courtVerdictTypeCode === '7'
            ? ''
            : form?.courtVerdictCode,
        redCaseNo: form?.elementRedCaseCiosCode + ' ' + form?.elementRedCaseRunning + '/' + form?.elementRedCaseYear,
        courtVerdictList: this.courtVerdictDetail?.courtVerdictList,
        courtVerdictDocuments: verdictDocs,
        courtFee: courtFee,
        extendAppeals: this.courtVerdictDetail?.extendAppeals,
        taskId: this.taskService.taskDetail?.id,
        ciosRedCaseNo: false,
        litigationId: this.taskService.taskDetail?.litigationId,
        debtorLawyerFee: debtorLawyerFee,
      };

      let blackCaseNo =
        form?.elementBlackCaseCiosCode + ' ' + form?.elementBlackCaseRunning + '/' + form?.elementBlackCaseYear;
      if (form.courtLevel === 'APPEAL') {
        req.appealCourtBlackCaseNo = blackCaseNo;
      }
      if (form.courtLevel === 'SUPREME') {
        req.supremeCourtBlackCaseNo = blackCaseNo;
      }

      return req;
    }
    return {};
  }

  async extendAppeal(extendAppeal: ExtendAppealDto): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.extendAppeal(extendAppeal))
    );
  }

  async getExtendAppealDetail(litigationCaseId: number): Promise<Array<ExtendAppealDto>> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.getExtendAppealDetail(litigationCaseId))
    );
  }

  initFormConsiderAppeal(_dataBundle: CourtAppealBundleDto, _taskCode: taskCode, _statusCode: statusCode) {
    if (_taskCode === 'CONSIDER_APPEAL' || _taskCode === 'CONSIDER_SUPREME_COURT') {
      return this.fb.group({
        appealPurpose: [_dataBundle.courtAppeal?.appealPurpose || '', Validators.required],
        appealDescription: [_dataBundle.courtAppeal?.appealDescription || '', Validators.required],
        courtAppealDocuments: this.initDocumentListCtrl(
          _taskCode,
          _dataBundle.courtAppeal,
          _taskCode === 'CONSIDER_APPEAL' ? CONSIDER_APPEAL_DOCS_TEMP : CONSIDER_SUPREME_COURT_DOCS_TEMP
        ),
      });
    } else if (
      (_taskCode === 'APPROVE_APPEAL' || _taskCode === 'APPROVE_SUPREME_COURT') &&
      _statusCode === 'PENDING_APPROVAL'
    ) {
      return this.fb.group({
        bankRemark: [_dataBundle.courtAppeal?.bankRemark || '', Validators.required],
        approverDecision: [_dataBundle.courtAppeal?.approverDecision || '', Validators.required],
        approverRemark: [_dataBundle.courtAppeal?.approverRemark || ''],
        deductionForGuarantor: [_dataBundle.courtAppeal?.deductionForGuarantor ? 0 : -1, Validators.required],
        courtAppealDocuments: this.initDocumentListCtrl(
          _taskCode,
          _dataBundle.courtAppeal,
          _taskCode === 'APPROVE_APPEAL' ? APPROVE_APPEAL_DOCS_TEMP : APPROVE_SUPREME_COURT_DOCS_TEMP
        ),
      });
    } else if (
      (_taskCode === 'CONDITIONAL_APPEAL' || _taskCode === 'CONDITIONAL_SUPREME_COURT') &&
      _statusCode === 'IN_PROGRESS'
    ) {
      return this.fb.group({
        conditionalAppeal: [_dataBundle.courtAppeal?.conditionalAppeal || '', Validators.required],
        conditionalRemark: [_dataBundle.courtAppeal?.conditionalRemark || ''],
        courtAppealDocuments: this.initDocumentListCtrl(
          _taskCode,
          _dataBundle.courtAppeal,
          _taskCode === 'CONDITIONAL_APPEAL' ? CONDITIONAL_APPEAL_DOCS_TEMP : CONDITIONAL_SUPREME_COURT_DOCS_TEMP
        ),
      });
    } else {
      return this.fb.group({});
    }
  }

  isDisputeVisible(
    _currentUser: MeLexsUserDto,
    _litigation: LitigationDetailDto,
    _courtResult: CourtResultDto
  ): boolean {
    const litigationNotValid: boolean = _litigation.defermentStatus !== 'NORMAL';
    const userHasPermission: boolean = (_currentUser.subRoleCode === 'MAKER' &&
      _currentUser.category === 'KLAW' &&
      _currentUser.permissions?.includes(LexsUserPermissionCodes.LAWSUIT_GIVE_OPINION_TO_LAWYER)) as boolean;
    if (!userHasPermission || litigationNotValid) return false;

    // enableDispute = not all defendants are selected in disputes
    if (!_courtResult.enableDispute) return false;
    if (_courtResult.courtLevel === CourtVerdictDto.CourtLevelEnum.Supreme) return false;
    if (!_courtResult.courtVerdicts?.some(verdict => verdict.testimonyStatus === 'FINISHED')) return false;
    if (_courtResult.courtVerdicts?.every(verdicts => verdicts.caseEnd)) return false;
    return true;
  }

  initDisputeAppealForm(_bundle: DisputeAppealBundleDto, _mode: TMode) {
    const appealDetails = _bundle?.disputeAppeal;

    return this.fb.group({
      defendantAppealDate: [appealDetails ? appealDetails.defendantAppealDate : null, Validators.required],
      requestDefer: [appealDetails ? appealDetails.requestDefer : null, Validators.required],
      disputeAppealDescription: [appealDetails ? appealDetails.disputeAppealDescription : null, Validators.required],
      lastDisputeAppealDate: [appealDetails ? appealDetails.lastDisputeAppealDate : null, Validators.required],
      disputeDefendants: [[], Validators.required],
      disputeAppealDocuments: [appealDetails ? appealDetails.disputeAppealDocuments : []],
    });
  }

  initDisputeDefendants(_bundle: DisputeAppealBundleDto, _mode: TMode): DefendantDto[] {
    const verdictDetails = _bundle?.courtVerdicts;
    const appealDetails = _bundle?.disputeAppeal;

    // remove used defendants
    let defendants = _mode === Mode.EDIT || _mode === Mode.VIEW ? appealDetails?.disputeDefendants || [] : [];
    if (_mode === Mode.ADD) {
      const otherDisputeAppeals = this.courtResult.find(
        res => res.litigationCaseId == _bundle.courtVerdicts?.litigationCaseId
      )?.disputeAppeals;
      const selectedDefendantsId =
        otherDisputeAppeals?.map(dispute => dispute.disputeDefendants?.map(def => def.personId)).flat() || [];
      const allDefendants = verdictDetails?.defendants || [];
      const remainingDefendants = allDefendants.filter(def => !selectedDefendantsId.includes(def.personId));
      defendants = remainingDefendants;
    }
    return defendants;
  }

  initVerdictForm() {
    this._courtVerdictForm = this.fb.group({
      elementBlackCaseCiosCode: '',
      elementBlackCaseRunning: '',
      elementBlackCaseYear: '',
      caseEnd: false,
      caseEndCode: '',
      ciosRedCaseNo: '',
      ciosVerdictDate: '',
      courtFee: '',
      courtLevel: '',
      courtName: '',
      courtType: '',
      courtVerdictCode: '',
      courtSubVerdictCode: '',
      courtVerdictDate: '',
      courtVerdictTypeCode: '',
      otherCourtFeeTypeCode: '',
      debtorLawyerFee: '',
      firstEnforcementDate: '',
      firstVerdictDate: '',
      firstVerdictUserFirstName: '',
      firstVerdictUserId: '',
      firstVerdictUserLastName: '',
      headerFlag: '',
      lastVerdictDate: '',
      lastVerdictUserFirstName: '',
      lastVerdictUserId: '',
      lastVerdictUserLastName: '',
      litigationCaseId: '',
      litigationId: '',
      litigationStatus: '',
      redCaseNo: '',
      elementRedCaseCiosCode: '',
      elementRedCaseRunning: '',
      elementRedCaseYear: '',
      remark: '',
      saveStatus: '',
      taskId: '',
      totalCourtRefundAmount: '',
      totalInitialAmount: '',
      totalNetAmount: '',
      disposeCaseDate: '',
      appealCourtBlackCaseNo: '',
      blackCaseNo: '',
      courtVerdictDesc: '',
      courtVerdictTypeDesc: '',
      otherCourtFeeCode: '',
      otherCourtFeeDesc: '',
      otherCourtFeeTypeDesc: '',
      reasonDismiss: '',
      reasonDismissCode: '',
      supremeCourtBlackCaseNo: '',
      testimonyStatus: '',
      acknowledgement: '',
      requireRedCaseDoc: '',
      requireVerdictDoc: [],
      LEXSF052: [],
      civilCourtBlackCaseNo: '',
    });
  }

  initDocumentListCtrl(_taskCode: taskCode, _courtAppeal?: CourtAppealDto, listTemplateId?: string[]) {
    const _appealPurpose = _courtAppeal?.appealPurpose;
    const _document = _courtAppeal?.courtAppealDocuments;
    if (_document) {
      let arrCtrl = this.fb.array([]);
      _document.forEach(element => {
        if (element.documentTemplateId && listTemplateId?.includes(element.documentTemplateId)) {
          if (_taskCode === 'CONSIDER_APPEAL' || _taskCode === 'CONSIDER_SUPREME_COURT') {
            switch (element.documentTemplateId) {
              case DOC_TEMPLATE.LEXSF081:
                if (_appealPurpose === 'KTB_LAW_STOP_APPEAL') arrCtrl.push(this.documentCtrl(element, true));
                break;
              case DOC_TEMPLATE.LEXSF083:
                if (_appealPurpose === 'REQUEST_APPEAL' || _appealPurpose === 'STOP_APPEAL')
                  arrCtrl.push(this.documentCtrl(element, false));
                break;
              case DOC_TEMPLATE.LEXSF082:
                if (_appealPurpose === 'KTB_LAW_STOP_PETITION') arrCtrl.push(this.documentCtrl(element, true));
                break;
              case DOC_TEMPLATE.LEXSF084:
                if (_appealPurpose === 'REQUEST_PETITION' || _appealPurpose === 'STOP_PETITION')
                  arrCtrl.push(this.documentCtrl(element, false));
                break;
              case DOC_TEMPLATE.LEXSF061:
                if (_taskCode === 'CONSIDER_APPEAL' && element.objectType === 'APPEAL')
                  arrCtrl.push(this.documentCtrl(element, !element.documentTemplate?.optional));
                if (_taskCode === 'CONSIDER_SUPREME_COURT' && element.objectType === 'SUPREME')
                  arrCtrl.push(this.documentCtrl(element, !element.documentTemplate?.optional));
                break;
              default:
                break;
            }
          } else if (_taskCode === 'CONDITIONAL_APPEAL' || _taskCode === 'CONDITIONAL_SUPREME_COURT') {
            if (element.documentTemplateId === DOC_TEMPLATE.LEXSF061) {
              if (_taskCode === 'CONDITIONAL_APPEAL' && element.objectType === 'CONDITION_APPEAL')
                arrCtrl.push(this.documentCtrl(element, false));
              if (_taskCode === 'CONDITIONAL_SUPREME_COURT' && element.objectType === 'CONDITION_SUPREME')
                arrCtrl.push(this.documentCtrl(element, false));
            } else {
              arrCtrl.push(
                this.documentCtrl(
                  element,
                  element.objectType === 'CONDITION_APPEAL' || element.objectType === 'CONDITION_SUPREME' ? true : false
                )
              );
            }
          } else if (_taskCode === 'APPROVE_APPEAL' || _taskCode === 'APPROVE_SUPREME_COURT') {
            arrCtrl.push(this.documentCtrl(element, !element.documentTemplate?.optional));
          } else {
            arrCtrl.push(this.documentCtrl(element, true));
          }
        }
      });
      return arrCtrl;
    } else {
      return this.fb.array([]);
    }
  }

  findActiveDecree(_litigationCaseId: number) {
    const findCaseOrder = this._courtResult?.findIndex(res => res.litigationCaseId == _litigationCaseId);
    const findDecreeOrder =
      this._courtResult?.[findCaseOrder]?.courtDecrees?.findIndex(d => d.litigationCaseId == _litigationCaseId) || 0;
    return this._courtResult?.[findCaseOrder]?.courtDecrees?.[findDecreeOrder] || undefined;
  }

  documentCtrl(element: LitigationDocumentDto, isRequired: boolean) {
    return this.fb.group({
      active: element.active,
      documentDate: element.documentDate,
      documentId: element.documentId,
      documentTemplate: element.documentTemplate,
      documentTemplateId: element.documentTemplateId,
      imageId: [element.imageId, isRequired ? Validators.required : null],
      imageName: element.imageName,
      imageSource: element.imageSource,
      objectType: element.objectType,
    });
  }

  async downloadReceiveRequestForm(
    litigationCaseId: number,
    taskId: number,
    source?: string
  ): Promise<DownloadDocumentResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.courtControllerService.downloadReceiveRequestForm(litigationCaseId, taskId, source))
    );
  }

  validateCourtAppeal(taskCode: taskCode, courtAppeal: CourtAppealDto) {
    switch (taskCode) {
      case 'CONSIDER_APPEAL':
      case 'CONDITIONAL_APPEAL':
        return !!courtAppeal.appealPurpose && !!courtAppeal.appealDescription;
      case 'APPROVE_APPEAL':
      case 'APPROVE_SUPREME_COURT':
        return !!courtAppeal.appealDescription && !!courtAppeal.bankRemark;
      default:
        return true;
    }
  }

  clearData() {
    this._hasEdit = false;
    this._courtVerdictDetail = {} as CourtVerdictDto;
    this._courtAppealBundle = {};
    this._currentDisputeAppealBundle = {};
  }

  alreadyUpdateCourt() {
    let updated: boolean = false;
    let inx = this.courtResult.findIndex(
      court => court?.litigationCaseId?.toString() === this.taskService?.taskDetail.litigationCaseId
    );
    if (inx > -1) {
      let alreadyUpdate: boolean = !this.courtResult[inx]?.courtVerdicts?.some(
        f => f?.testimonyStatus === CourtVerdictDto.TestimonyStatusEnum.Pending
      );
      updated = alreadyUpdate;
    }

    return updated;
  }

  async saveDarftCourtAppeal(_taskCode: taskCode, headerFlag: CourtVerdictDto.HeaderFlagEnum = 'DRAFT', lgid?: string) {
    let courtAppealReq: CourtAppealDto = {
      ...this.courtAppealBundle?.courtAppeal,
      headerFlag: headerFlag,
    };
    courtAppealReq.deductionForGuarantor = Number(courtAppealReq.deductionForGuarantor) === 0 ? true : false;
    if (_taskCode === 'APPROVE_APPEAL' || _taskCode === 'APPROVE_SUPREME_COURT') {
      const respone = await this.approveAppeal(this.taskService.taskDetail.id || -1, courtAppealReq);
      if (respone === null) {
        if (headerFlag === 'SUBMIT') {
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('EXCEPTION_CONFIG.MESSAGE_LG_ID_REQUEST_APPROVE', { LG_ID: lgid })
          );
        } else {
          this.notificationService.openSnackbarSuccess(
            this.translate.instant(`COURT.MSG_SNACKBAR.${_taskCode}_UPDATE_SUCCESS`)
          );
        }
      }
    } else {
      const respone = await this.updateCourtAppeal(courtAppealReq, this.taskService.taskDetail.id);
      if (respone === null) {
        if (headerFlag === 'SUBMIT') {
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('EXCEPTION_CONFIG.MESSAGE_LG_ID_REQUEST_APPROVE', { LG_ID: lgid })
          );
        } else {
          this.notificationService.openSnackbarSuccess(
            this.translate.instant(`COURT.MSG_SNACKBAR.${_taskCode}_UPDATE_SUCCESS`)
          );
        }
      }
    }
  }
}
