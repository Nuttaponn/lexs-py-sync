import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { COURT_FEE_STATUS } from '@app/shared/constant';
import { statusCode, taskCode } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { Utils } from '@app/shared/utils/util';
import {
  AccountDto,
  ConfirmationFormDto,
  CreateLitigationSubCaseRequest,
  LitigationCaseAccountDto,
  LitigationCaseAllegationDto,
  LitigationCaseControllerService,
  LitigationCaseDto,
  LitigationCaseGroupDto,
  LitigationCasePerson,
  LitigationCasePersonDto,
  LitigationCaseRequest,
  LitigationCaseSubCaseDto,
  LitigationDetailDto,
  LitigationDocumentDto,
  PayCourtFeeControllerService,
  PayCourtFeeDto,
  PayCourtFeeReceiptRequest,
  PayCourtFeeResponse,
  PaymentConfirmRequest,
  ReceiptFormDto,
  RejectRequest,
  TaskDetailDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { ExtendedLitigationCaseGroupDto, TaskAttr1 } from './suit.model';
export interface LitigationCaseDtoMeta extends LitigationCaseDto {
  remark?: string;
  allegationsObj?: Array<LitigationCaseAllegationDto>;
}
@Injectable({
  providedIn: 'root',
})
export class SuitService {
  constructor(
    private fb: UntypedFormBuilder,
    private translate: TranslateService,
    private errorHandlingService: ErrorHandlingService,
    private litigationCaseControllerService: LitigationCaseControllerService,
    private payCourtFeeControllerService: PayCourtFeeControllerService
  ) {}

  public firstTime: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>([]);

  /* LEX2 statusCode, taskCode from Task Tab */
  private statusCode!: statusCode | string | null;
  public get statusCodeFromTask(): statusCode | string | null {
    return this.statusCode;
  }
  public set statusCodeFromTask(value: statusCode | string | null) {
    this.statusCode = value;
  }
  private taskCode!: taskCode | null;
  public get taskCodeFromTask(): taskCode | null {
    return this.taskCode;
  }
  public set taskCodeFromTask(value: taskCode | null) {
    this.taskCode = value;
  }

  private _updateLitigationCaseDetail!: LitigationCaseDto | null;
  public get updateLitigationCaseDetail(): LitigationCaseDto | null {
    return this._updateLitigationCaseDetail;
  }
  public set updateLitigationCaseDetail(value: LitigationCaseDto | null) {
    this._updateLitigationCaseDetail = value;
  }

  private _litigationCase: Array<any> = [];
  public get litigationCase(): Array<any> {
    return this._litigationCase;
  }
  public set litigationCase(value: Array<any>) {
    this._litigationCase = value;
  }

  private _litigationCaseDetail!: LitigationCaseDto;
  public get litigationCaseDetail(): LitigationCaseDto {
    return this._litigationCaseDetail;
  }
  public set litigationCaseDetail(value: LitigationCaseDto) {
    this._litigationCaseDetail = value;
  }

  private _paymentConfirmRequest!: PaymentConfirmRequest | null;
  public get paymentConfirmRequest(): PaymentConfirmRequest | null {
    return this._paymentConfirmRequest;
  }
  public set paymentConfirmRequest(value: PaymentConfirmRequest | null) {
    this._paymentConfirmRequest = value;
  }

  private _payCourtFeeReceiptRequest!: PayCourtFeeReceiptRequest | null;
  public get payCourtFeeReceiptRequest(): PayCourtFeeReceiptRequest | null {
    return this._payCourtFeeReceiptRequest;
  }
  public set payCourtFeeReceiptRequest(value: PayCourtFeeReceiptRequest | null) {
    this._payCourtFeeReceiptRequest = value;
  }

  // For tracking have edit some value in screen
  private _hasEdit: boolean = false;
  public get hasEdit(): boolean {
    return this._hasEdit;
  }
  public set hasEdit(value: boolean) {
    this._hasEdit = value;
  }

  clearData() {
    this._hasEdit = false;

    this.paymentConfirmRequest = null;
    this.payCourtFeeReceiptRequest = null;
    this.litigationCase = [];
    this.clearStroeIndictment();
    this.updateLitigationCaseDetail = null;

    this.statusCode = null;
    this.taskCode = null;
    this.litigationCaseDetail = {};
  }

  clearStroeIndictment() {
    this.firstTime.next([]);
  }

  /** LEX2-3276 */
  async readReceiptForm(taskId: number, uploadFlag: 'RECEIPT' | 'PAYMENT', file: Blob): Promise<ReceiptFormDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.payCourtFeeControllerService.readReceiptForm(taskId, uploadFlag, file))
    );
  }

  /* LEX2-168 for add, edit appeal & supreme btns */
  async getLitigationSubmitCourt(courtLevel: string, id: number, isPlaintiff: boolean, taskId?: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.getLitigationSubmitCourt(courtLevel, id, isPlaintiff, taskId))
    );
  }

  async getEditLitigationSubmitCourt(id: number, subCaseId: number, taskId?: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.getLitigationSubmitCourtById(id, subCaseId, taskId))
    );
  }

  getDisputeAppealIdFromTask(taskDetailDto: TaskDetailDto) {
    let disputeAppealId: number = -1;
    try {
      /* (Defect -> LEX2-7431): ใช้หา LitigationSubCase เพียงหนึ่งเดียวที่สามารถแก้ไขได้ */
      const parsedTaskAttr: TaskAttr1 = JSON.parse(taskDetailDto?.attributes || '{"disputeAppealId": -1}');
      if (!!parsedTaskAttr && !!parsedTaskAttr?.disputeAppealId) {
        disputeAppealId = parsedTaskAttr?.disputeAppealId;
      }
    } catch (error) {}
    return disputeAppealId;
  }

  async setUpdateLitigationCaseDetailByTaskCaseId(
    groupCaseDtos: LitigationCaseGroupDto[],
    taskLitigationCaseId: number,
    taskId: number,
    disputeAppealId?: number
  ): Promise<LitigationCaseDto | null> {
    for (let groupCaseDto of groupCaseDtos) {
      for (let caseDto of groupCaseDto?.cases ?? []) {
        if (caseDto?.id === taskLitigationCaseId) {
          const editableSubCases = (caseDto.litigationCaseSubCase ?? []).filter(
            subCaseDto => subCaseDto.statusSubCase !== 'FINISH'
          );
          // ต้องควานหา ด้วย disputeAppealId
          // editableSubCase?.disputeAppealId;
          let editableSubCase;
          if (!!disputeAppealId && disputeAppealId !== -1) {
            editableSubCase = editableSubCases.find(dto => dto.disputeAppealId === disputeAppealId);
          } else {
            editableSubCase = editableSubCases[0];
          }
          if (editableSubCase) {
            const caseDetail = await this.getEditLitigationSubmitCourt(caseDto.id, editableSubCase.id ?? -1, taskId);
            return caseDetail;
          } else {
            return null;
          }
        }
      }
    }
    return null;
  }

  isUpdateLitigationCaseDetailLegit(
    litigationCaseDto: LitigationCaseDto | null,
    taskId: number,
    statusCode?: statusCode,
    taskCode?: taskCode
  ): boolean {
    if (!litigationCaseDto) return false;
    const tempReq = this.getCreateLitigationSubCaseRequest(litigationCaseDto, taskId);
    if (!tempReq) return false;
    if ((tempReq.documentItems || []).length === 0) return false;

    if (!!taskCode && taskCode === 'UPLOAD_E_FILING' && (!tempReq.courtFee || !tempReq.documentFee)) return false;
    else if (
      !!taskCode &&
      !!statusCode &&
      statusCode === 'AWAITING' &&
      taskCode === 'RECORD_OF_SUPREME_COURT' &&
      (!tempReq.courtOrder || !tempReq.courtOrderDate)
    )
      return false;

    return true;
  }

  convertPayCourtFeeDtoToPayCourtFeeReceiptRequest(
    payCourtFeeDto: PayCourtFeeDto,
    litigationDocumentDtos: LitigationDocumentDto[]
  ) {
    const payCourtFeeReceiptRequest: PayCourtFeeReceiptRequest = {
      documentRequestList: [],
      headerFlag: 'DRAFT',
    };
    // payCourtFeeReceiptRequest.documentRequestList =
    payCourtFeeDto.litigationDocumentDto?.forEach((docDto, index) => {
      // dialogRes = dialogRes as UploadCourtFeesReceiptDialogRes
      payCourtFeeReceiptRequest.documentRequestList?.push({
        active: true,
        documentId: docDto.documentId,
        documentTemplateId: docDto.documentTemplateId,
        imageId: litigationDocumentDtos[index].imageId,
      });
    });
    return payCourtFeeReceiptRequest;
  }

  getExtendedLitigationCaseGroupDto(
    litigationCaseGroupDto: LitigationCaseGroupDto,
    taskLitigationCaseId: number,
    statusCode?: statusCode,
    taskCode?: taskCode,
    disputeAppealId: number = -1
  ): ExtendedLitigationCaseGroupDto {
    console.log('getExtendedLitigationCaseGroupDto ::', { litigationCaseGroupDto, taskLitigationCaseId });
    const extendedDto: ExtendedLitigationCaseGroupDto = { ...litigationCaseGroupDto };

    // isPlaintiff กับ courtLevel
    const CourtLevelEnum = LitigationCaseDto.CourtLevelEnum;
    const AppealSideEnum = LitigationCaseDto.AppealSideEnum;
    const courtLevels = [
      CourtLevelEnum.Supreme,
      CourtLevelEnum.Appeal,
      CourtLevelEnum.Civil,
    ]; /* respectively for sorted table */
    // const appealSides = [AppealSideEnum.Bank, AppealSideEnum.Customer]; /* respectively for sorted table */

    extendedDto.courtCaseList = [];

    for (let courtLevel of courtLevels) {
      if (courtLevel !== 'CIVIL') {
        const foundCase: LitigationCaseDto | undefined = extendedDto.cases?.find(dto => dto.courtLevel === courtLevel);
        if (foundCase) {
          /* เอา subCase มาจำแนกว่าเป็นยื่น หรือ แก้ ด้วย "isPlaintiff::
            isPlaintiff === true -> ยื่น, isPlaintiff === false -> แก้ */
          for (let isPlaintiff of [true, false]) {
            const foundSubCases = (foundCase.litigationCaseSubCase ?? []).filter(
              dto => dto.isPlaintiff === isPlaintiff
            );
            if (foundSubCases.length) {
              const isShowColumnBtn = !!(
                foundSubCases.find(dto => dto.statusSubCase !== 'FINISH') || foundCase.id === taskLitigationCaseId
              );

              let isShowAddEfilingBtn = false;
              if (!!statusCode && !!taskCode) {
                let isLoopReachedEditableCase: boolean = this.isLoopReachedEditableCase(
                  isPlaintiff,
                  courtLevel,
                  statusCode,
                  taskCode
                );
                let isEditableSubCaseContained: boolean =
                  isLoopReachedEditableCase &&
                  this.isEditableSubCaseContained(foundSubCases, isPlaintiff, courtLevel, disputeAppealId);
                isShowAddEfilingBtn = isShowColumnBtn && isLoopReachedEditableCase && !isEditableSubCaseContained;
              }

              const tempCase = { ...foundCase };
              tempCase.litigationCaseSubCase = foundSubCases;
              extendedDto.courtCaseList.push({
                appealSide: isPlaintiff ? AppealSideEnum.Bank : AppealSideEnum.Customer, // Bank = ยื่น, Customer = แก้
                courtLevel,
                case: tempCase,
                isShowColumnBtn,
                isShowAddEfilingBtn,
              });
            } else if (
              !!statusCode &&
              !!taskCode &&
              this.isLoopReachedEditableCase(isPlaintiff, courtLevel, statusCode, taskCode)
            ) {
              const tempCase = { ...foundCase };
              tempCase.litigationCaseSubCase = [];
              extendedDto.courtCaseList.push({
                appealSide: isPlaintiff ? AppealSideEnum.Bank : AppealSideEnum.Customer, // Bank = ยื่น, Customer = แก้
                courtLevel,
                case: tempCase,
                isShowColumnBtn: foundCase.id === taskLitigationCaseId,
                isShowAddEfilingBtn: foundCase.id === taskLitigationCaseId,
              });
            }
          }
        }
      } else {
        const foundCases: LitigationCaseDto[] = extendedDto.cases?.filter(dto => dto.courtLevel === courtLevel) ?? [];
        extendedDto.civilCases = foundCases;
      }
    }
    return extendedDto;
  }

  private isLoopReachedEditableCase(
    isPlaintiff: boolean,
    courtLevel: LitigationCaseDto.CourtLevelEnum,
    _statusCode: statusCode,
    _taskCode: taskCode
  ) {
    let checkPoint1: boolean = false;
    if (isPlaintiff === false && courtLevel === LitigationCaseDto.CourtLevelEnum.Supreme) {
      checkPoint1 = _statusCode === 'IN_PROGRESS' && _taskCode === 'RECORD_OF_SUPREME_COURT';
    } else if (isPlaintiff === true && courtLevel === LitigationCaseDto.CourtLevelEnum.Supreme) {
      checkPoint1 = _statusCode === 'PENDING' && _taskCode === 'RECORD_OF_SUPREME_COURT';
    } else if (isPlaintiff === false && courtLevel === LitigationCaseDto.CourtLevelEnum.Appeal) {
      checkPoint1 = _statusCode === 'IN_PROGRESS' && _taskCode === 'RECORD_OF_APPEAL';
    } else if (isPlaintiff === true && courtLevel === LitigationCaseDto.CourtLevelEnum.Appeal) {
      checkPoint1 = _statusCode === 'PENDING' && _taskCode === 'RECORD_OF_APPEAL';
    }
    return checkPoint1;
  }

  isEditableSubCaseContained(
    foundSubCases: LitigationCaseSubCaseDto[],
    isPlaintiff: boolean,
    courtLevel: LitigationCaseDto.CourtLevelEnum,
    disputeAppealId: number = -1
  ) {
    // ถ้ายื่น เช็ค !== FINISH ได้, ถ้าแก้ ให้เช็คว่ามี disputeAppealId ด้วย
    let isLegit: boolean = false;
    if (
      (isPlaintiff === false && courtLevel === LitigationCaseDto.CourtLevelEnum.Supreme) ||
      (isPlaintiff === false && courtLevel === LitigationCaseDto.CourtLevelEnum.Appeal)
    ) {
      isLegit = !!foundSubCases.find(dto => dto.statusSubCase !== 'FINISH' && dto.disputeAppealId === disputeAppealId);
    } else if (
      (isPlaintiff === true && courtLevel === LitigationCaseDto.CourtLevelEnum.Supreme) ||
      (isPlaintiff === true && courtLevel === LitigationCaseDto.CourtLevelEnum.Appeal)
    ) {
      isLegit = !!foundSubCases.find(dto => dto.statusSubCase !== 'FINISH');
    }
    return isLegit;
  }

  /** generate form control for use in lawsuit and task */
  generateLitigationCaseForm(
    _indictment?: LitigationCaseDto | null,
    _litigationDetailDto?: LitigationDetailDto | null
  ): UntypedFormGroup {
    return this.fb.group({
      briefCase: [{ value: _indictment?.briefCase || '', disabled: false }, Validators.required],
      capitalAmount: [{ value: _indictment?.capitalAmount || 0, disabled: false }],
      caseDate: [{ value: _indictment?.caseDate || Utils.getCurrentDate(), disabled: false }, Validators.required],
      caseType: [{ value: _indictment?.caseType || {}, disabled: false }, Validators.required],
      channel: [{ value: _indictment?.channel || 'EFILING', disabled: false }, Validators.required],
      courtCode: [{ value: _indictment?.courtCode || '', disabled: false }, Validators.required],
      courtName: [{ value: _indictment?.courtName || '', disabled: false }],
      courtLevel: [{ value: _indictment?.courtLevel || '', disabled: false }],
      id: [{ value: _indictment?.id || 0, disabled: false }],
      lawyerId: [{ value: _indictment?.lawyerId || '', disabled: false }],
      lawyerName: [{ value: _indictment?.lawyerName || '', disabled: false }],
      lawyerOfficeCode: [{ value: _indictment?.lawyerOfficeCode || '', disabled: false }],
      lawyerOfficeName: [{ value: _indictment?.lawyerOfficeName || '', disabled: false }],
      litigationCaseAccounts: this.getAccounts(
        _indictment?.litigationCaseAccounts,
        _litigationDetailDto?.accountInfo?.accounts
      ),
      litigationCaseAllegations: [
        {
          value:
            _indictment?.litigationCaseAllegations && typeof _indictment.litigationCaseAllegations === 'string'
              ? _indictment.litigationCaseAllegations
              : _indictment?.litigationCaseAllegations && _indictment?.litigationCaseAllegations.length > 0
                ? _indictment?.litigationCaseAllegations[0]?.code
                : '',
          disabled: false,
        },
      ],
      allegationsObj: [
        { value: _indictment?.litigationCaseAllegations ? _indictment.litigationCaseAllegations : [], disabled: false },
      ],
      litigationDocuments: this.getDocumentInfo(_indictment?.litigationDocuments),
      litigationId: [{ value: _indictment?.litigationId || '', disabled: false }],
      persons: this.getPersons(_indictment?.persons),
    });
  }

  /** LEX2-168-169: generate Efiling-form  */
  generateEfilingForm(_dto?: LitigationCaseDto | null, _subCase?: LitigationCaseSubCaseDto): UntypedFormGroup {
    return this.fb.group({
      caseDate: [_subCase?.caseDate || '', Validators.required],
      capitalAmount: [_subCase?.capitalAmount || null, Validators.required],
      courtCode: [_subCase?.courtCode || '', Validators.required],
      reason: [_subCase?.reason || ''],
      courtOrder: [_subCase?.courtOrder || '', Validators.required],
      submitDate: [_subCase?.submitDate || '', Validators.required],
      courtOrderDate: [_subCase?.courtOrderDate || '', Validators.required],
      respiteCase: [_subCase?.respiteCase || '', Validators.required],
    });
  }

  /** LEX2-182: generate upload-receipt-form  */
  generateCourtFeeForm(_dto?: LitigationCaseDto | null, _subCase?: LitigationCaseSubCaseDto): UntypedFormGroup {
    return this.fb.group({
      courtFee: [_subCase?.courtFee || '', Validators.required],
      documentFee: [_subCase?.documentFee || null, Validators.required],
    });
  }

  getDocumentInfo(_data?: LitigationDocumentDto[] | any[]) {
    if (_data && _data.length > 0) {
      return this.fb.array(_data);
    } else {
      return this.fb.array([]);
    }
  }

  getPersons(_data?: LitigationCasePersonDto[]) {
    if (_data && _data.length > 0) {
      let _array = this.fb.array([]);
      _data.forEach(el => {
        const _group = this.fb.group({
          checked: [{ value: el.checked || false, disabled: false }],
          cifNo: [{ value: el.cifNo || '', disabled: false }],
          identificationNo: [{ value: el.identificationNo || '', disabled: false }],
          name: [{ value: el.name || '', disabled: false }],
          personId: [{ value: el.personId || '', disabled: false }],
          relation: [{ value: el.relation || '', disabled: false }],
        });
        _array.push(_group);
      });
      return _array;
    } else {
      return this.fb.array([]);
    }
  }

  getAccounts(_data?: LitigationCaseAccountDto[], _accountDtos?: AccountDto[] | null) {
    if (_data && _data.length > 0) {
      let _array = this.fb.array([]);
      _data.forEach(el => {
        const _group = this.fb.group({
          accountId: [{ value: el.accountId || '', disabled: false }],
          lateCharge: [{ value: el.lateCharge || 0, disabled: false }, Validators.required],
          lateChargeAmount: [{ value: el.lateChargeAmount || 0, disabled: false }, Validators.required],
          litigationCaseId: [{ value: el.litigationCaseId || 0, disabled: false }],
          marketCode: [{ value: el.marketCode || '', disabled: false }],
          marketDescription: [{ value: el.marketDescription || '', disabled: false }],
          outstandingBalance: [{ value: el.outstandingBalance || 0, disabled: false }, Validators.required],
          tdrStatus: [{ value: el.tdrStatus || '', disabled: false }],
          tdrDate: [
            { value: _accountDtos?.find(dto => dto.accountId === el.accountId)?.tdrDate || '', disabled: false },
          ],
          tdrTrackingResult: [{ value: el.tdrTrackingResult || '', disabled: false }],
          totalAmount: [{ value: el.totalAmount || 0, disabled: false }, Validators.required],
        });
        _array.push(_group);
      });
      return _array;
    } else {
      return this.fb.array([]);
    }
  }

  /** Get Litigation Case API */
  async getLitigationCase(litigationId: string, taskId?: number): Promise<LitigationCaseGroupDto[]> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.getLitigationCase(litigationId, taskId))
    );
  }

  /** Get Litigation Case Detail API */
  async getLitigationCaseDetail(id: number, taskId?: number): Promise<LitigationCaseDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.getLitigationCaseDetail(id, taskId))
    );
  }

  /** Get Pay CourtFee API */
  async getPayCourtFee(financialId: number): Promise<PayCourtFeeDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.payCourtFeeControllerService.getPayCourtFee(financialId))
    );
  }

  /** Approve Litigation Case API */
  async litigationCaseApprove(taskId: number): Promise<PayCourtFeeDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.approve(taskId))
    );
  }

  /** LEX2-182: Approve PaymentReceipt API */
  async paymentReceipt(taskId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.payCourtFeeControllerService.paymentReceipt(taskId))
    );
  }

  /** Reject Litigation Case API */
  async litigationCaseReject(taskId: number, reason: string, returnFlag?: boolean): Promise<PayCourtFeeDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.reject(taskId, { reason, returnFlag } as RejectRequest))
    );
  }

  // LEXS-170: eFiling Submission: save, submit
  async saveLitigationCase(taskId: number, request: LitigationCaseRequest): Promise<LitigationCaseDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.saveLitigationCase(taskId, request))
    );
  }

  // LEXS-174: action-bar: save, submit
  async confirmPayment(taskId: number, request: PaymentConfirmRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.payCourtFeeControllerService.confirmPayment(taskId, request))
    );
  }

  // LEXS-193: action-bar: save, submit
  async updateReceipt(taskId: number, request: PayCourtFeeReceiptRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.payCourtFeeControllerService.updateReceipt(taskId, request))
    );
  }
  /* LEX2-168-169 */
  findEditableSubCase(litigationCaseDto: LitigationCaseDto) {
    return (litigationCaseDto.litigationCaseSubCase ?? []).find(dto => dto.statusSubCase !== 'FINISH') ?? null;
  }

  getCreateLitigationSubCaseRequest(
    litigationCaseDto: LitigationCaseDto,
    taskId: number
  ): CreateLitigationSubCaseRequest {
    const litigationCaseSubCaseDto = this.findEditableSubCase(litigationCaseDto) ?? {};
    return {
      headerFlag: CreateLitigationSubCaseRequest.HeaderFlagEnum.Draft,
      courtCode: litigationCaseSubCaseDto.courtCode,
      capitalAmount: litigationCaseSubCaseDto.capitalAmount,
      caseDate: litigationCaseSubCaseDto.caseDate,
      courtFee: litigationCaseSubCaseDto.courtFee,
      courtLevel: litigationCaseSubCaseDto.courtLevel ?? litigationCaseDto.courtLevel,
      courtOrder: litigationCaseSubCaseDto.courtOrder,
      documentFee: litigationCaseSubCaseDto.documentFee,
      documentItems: [
        ...(litigationCaseSubCaseDto.litigationCaseSubCaseDocuments ?? []),
        ...(litigationCaseSubCaseDto.coupleDeliveryFeeDocuments ?? []),
      ],
      reason: litigationCaseSubCaseDto.reason,
      respiteCase: litigationCaseSubCaseDto.respiteCase,
      taskId,
      subId: litigationCaseSubCaseDto.id,
      submitDate: litigationCaseSubCaseDto.submitDate,
      isPlaintiff: litigationCaseSubCaseDto.isPlaintiff,
      courtOrderDate: litigationCaseSubCaseDto.courtOrderDate,
    };
  }

  /* LEX2-168-169--save-draft_submit */
  async updateLitigationSubmitCourt(id: number, request: CreateLitigationSubCaseRequest): Promise<LitigationCaseDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.updateLitigationSubmitCourt(id, request))
    );
  }
  /* LEX2-169--acknowledge */
  async acknowledge(id: number, request: CreateLitigationSubCaseRequest): Promise<LitigationCaseDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.acknowledge(id, request))
    );
  }
  /* LEX2-182-save */
  async updateLitigationReceipt(
    id: number,
    subId: number,
    request: CreateLitigationSubCaseRequest
  ): Promise<LitigationCaseDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseControllerService.updateLitigationReceipt(id, subId, request))
    );
  }

  isSubmitConfirmCourtFeesPayment(litigationCaseGroupDtos: Array<LitigationCaseGroupDto>) {
    let isUploadedCourtFees = false;
    let tempLitigationCaseDto: LitigationCaseDto = {};
    litigationCaseGroupDtos.forEach(it => {
      if (it.cases && it.cases?.length > 0) {
        const foundItem = it.cases.find(
          item =>
            item.actionFlag === true && item.courtFeeStatus === COURT_FEE_STATUS.TRANSFERRED && item.confirmImageId
        );
        if (foundItem) {
          tempLitigationCaseDto = foundItem;
          isUploadedCourtFees = true;
          return;
        }
      }
    });

    if (isUploadedCourtFees) {
      this.setUpdateDataForTaskDetail(tempLitigationCaseDto);
    }
    return isUploadedCourtFees;
  }

  async isSubmitUploadCourtFeesReceipt(litigationCaseGroupDtos: Array<LitigationCaseGroupDto>) {
    let isUploadedRecipt = false;
    let financialId = -1;
    let tempLitigationCaseDto: LitigationCaseDto = {};
    litigationCaseGroupDtos.forEach(it => {
      if (it.cases && it.cases?.length > 0) {
        const foundItem = it.cases.find(
          item => item.actionFlag === true && item.courtFeeStatus === COURT_FEE_STATUS.TRANSFERRED && !!item.financialId
        );

        if (foundItem) {
          financialId = foundItem?.financialId ?? -1;
          tempLitigationCaseDto = foundItem;
          if (foundItem.uploadCourtFeeReceipt === true) {
            isUploadedRecipt = true;
            return;
          }
        }
      }
    });

    if (
      isUploadedRecipt ||
      (!isUploadedRecipt &&
        financialId >
          -1) /* workaround in case of having done save-draft but BE still sends 'uploadCourtFeeReceipt' = false */
    ) {
      this.setUpdateDataForTaskDetail(tempLitigationCaseDto);
    }
    return isUploadedRecipt;
  }

  getLitigationCaseRequest(
    headerFlag: LitigationCaseRequest.HeaderFlagEnum,
    objCaseDto: LitigationCaseDtoMeta
  ): LitigationCaseRequest {
    let _litigationCasePersons: Array<LitigationCasePerson> = [];
    objCaseDto.persons?.forEach(_el => {
      const item = {
        litigationCaseId: objCaseDto.id,
        personId: _el.personId,
        relation: _el.relation,
      } as LitigationCasePerson;
      _litigationCasePersons.push(item);
    });
    const result = {
      briefCase: objCaseDto.briefCase,
      capitalAmount: objCaseDto.capitalAmount,
      caseDate: objCaseDto.caseDate,
      channel: objCaseDto.channel,
      courtCode: objCaseDto.courtCode,
      headerFlag: headerFlag,
      id: objCaseDto.id,
      litigationAllegations:
        typeof objCaseDto.litigationCaseAllegations === 'string'
          ? objCaseDto.allegationsObj
          : objCaseDto.litigationCaseAllegations,
      litigationCaseAccounts: objCaseDto.litigationCaseAccounts,
      litigationCasePersons: _litigationCasePersons,
      litigationDocuments: objCaseDto.litigationDocuments,
      litigationId: objCaseDto.litigationId,

      // LEX2-168: appeal
      appealDate: objCaseDto.appealDate,
      remark: objCaseDto.remark ?? null,
    } as LitigationCaseRequest;
    return result;
  }

  /** older version */

  async readPaymentForm(taskId: number, file: Blob) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.payCourtFeeControllerService.readPaymentForm(taskId, file))
    );
  }

  async readConfirmationForm(taskId: number, file: Blob) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.payCourtFeeControllerService.readConfirmationForm(taskId, file)),
      { snackBarMessage: this.translate.instant('EXCEPTION_CONFIG.MESSAGE_CANNOT_SELECT_DOC') }
    );
  }

  async postPaymentForm(taskId: number, data: any) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.payCourtFeeControllerService.payment(taskId, data))
    );
  }

  async setUpdateDataForTaskDetail(litigationCaseDto: LitigationCaseDto) {
    if (!litigationCaseDto.financialId) return;
    const payCourtFeeDto = await this.getPayCourtFee(litigationCaseDto.financialId ?? -1);
    switch (litigationCaseDto.buttonAction) {
      case LitigationCaseDto.ButtonActionEnum.ConfirmCourtFee:
        this.paymentConfirmRequest = {
          blackCaseNo: payCourtFeeDto.blackCaseNo,
          commentToAccounting: payCourtFeeDto.commentToAccounting,
          confirmImageId: payCourtFeeDto.confirmImageId,
          confirmRefNo: payCourtFeeDto.confirmRefNo,
          courtFeeOriginal: payCourtFeeDto.courtFee,
          deliveryFeeForPleadingsOriginal: Number(payCourtFeeDto.deliveryFeeForPleadings),
          documentPreparationFeeOriginal: Number(payCourtFeeDto.documentPreparationFee),

          headerFlag: PaymentConfirmRequest.HeaderFlagEnum.Draft, // ไปเซ็ตค่าจริงที่ task-detail
        };
        break;
      case LitigationCaseDto.ButtonActionEnum.UploadCourtFeesReceipt:
        this.payCourtFeeReceiptRequest = {
          documentRequestList: [],
          headerFlag: PayCourtFeeReceiptRequest.HeaderFlagEnum.Draft, // ไปเซ็ตค่าจริงที่ task-detail
        };

        this.payCourtFeeReceiptRequest.documentRequestList = [];
        payCourtFeeDto.litigationDocumentDto?.forEach(docDto => {
          this.payCourtFeeReceiptRequest?.documentRequestList?.push({
            active: docDto.active,
            documentId: docDto.documentId,
            documentTemplateId: docDto.documentTemplateId,
            imageId: docDto.imageId,
          });
        });

        break;
    }
  }

  checkErrorCodeList(errCode: string): boolean {
    return ['F003', 'F004', 'F005', 'F006', 'F007', 'F008', 'F009', 'F010', 'F011'].includes(errCode);
  }

  initAppealSideByTaskCode(): 'BANK' | 'CUSTOMER' {
    /* LEX2-168_169 2/17/23 เนื่องจากหลังบ้านไม่สามารถระบุได้ว่า
    - ตอนนี้เป็น status,task Code ที่กดมาจากการยื่นหรือการแก้
    - appealSide ไม่เกี่ยวข้องกับ Logic การแสดงผล
    จึงต้อง control จากหน้าบ้านโดยใช้ taskCode, statusCode เพื่อ control 'appealSide' */
    const taskCode = this.taskCodeFromTask;
    const statusCode = this.statusCodeFromTask;

    if (!taskCode || !statusCode) return 'BANK';

    const taskCodeForForceCustomer: taskCode[] = ['RECORD_OF_APPEAL', 'RECORD_OF_SUPREME_COURT'];
    if (taskCodeForForceCustomer.includes(taskCode) && statusCode === 'IN_PROGRESS') {
      return 'CUSTOMER';
    }
    return 'BANK';
  }

  async getConfirmPaymentManual(taskId: number): Promise<ConfirmationFormDto> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.payCourtFeeControllerService.getConfirmPaymentManual(taskId)),
      { snackBarMessage: this.translate.instant('EXCEPTION_CONFIG.TITLE_COMMON_ERROR') }
    );
  }

  async confirmPaymentManual(taskId: number, request: PaymentConfirmRequest): Promise<PayCourtFeeResponse> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.payCourtFeeControllerService.confirmPaymentManual(taskId, request)),
      { snackBarMessage: this.translate.instant('EXCEPTION_CONFIG.TITLE_COMMON_ERROR') }
    );
  }
}
