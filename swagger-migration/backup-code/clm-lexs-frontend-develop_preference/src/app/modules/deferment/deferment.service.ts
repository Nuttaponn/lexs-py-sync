import { Inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { DisplayDocument } from '@app/shared/components/document-preparation/interface/document';
import { DOC_TEMPLATE } from '@app/shared/constant';
import { IUploadMultiFile } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  AuctionDocumentControllerService,
  CollateralAuctionInfo,
  DefermentApprovalHistoryInfo,
  DefermentCancelRequest,
  DefermentCancelResponse,
  DefermentControllerService,
  DefermentDto,
  DefermentExecCancelRequest,
  DefermentExecControllerService,
  DefermentExecDto,
  DefermentExecItem,
  DefermentExecReviseResponse,
  DefermentInfo,
  DefermentItem,
  DefermentLitigationDebtInfo,
  DefermentLitigationInfo,
  DefermentReviseRequest,
  DefermentReviseResponse,
  DocumentDto,
  InquiryDefermentExecRequest,
  InquiryDefermentRequest,
  LitigationCaseDebtInfo,
  LitigationCollateralDeedGroupDto,
  LitigationDetailDto,
  LitigationsCollateralsDto,
  LitigationsCollateralsResponse,
  LitigationsRequest,
  RejectRequest,
  SaveAnnounceSuspendAuctionResponse,
  SaveDefermentExecRequest,
  SaveDefermentExecResponse,
  SaveDefermentRequest,
  SuspendAuctionDocumentRequest,
} from '@lexs/lexs-client';
import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { IDocument, PermissionExec, SuspendAuctionResultDocumentsAttributes, defermentState } from './deferment.model';
import { IDeferment } from './deferment.resolver';
import { TranslateService } from '@ngx-translate/core';
import { BuddhistEraPipe } from '@spig/core';
import { Utils } from '@app/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class DefermentService {
  public contractList = [DOC_TEMPLATE.LEXSD016];
  public defermentStateEnum = defermentState;
  private _litigation!: LitigationDetailDto;

  constructor(
    @Inject(SessionService) private sessionService: SessionService,
    private defermentControllerService: DefermentControllerService,
    private fb: UntypedFormBuilder,
    private documentService: DocumentService,
    private errorHandlingService: ErrorHandlingService,
    private notificationService: NotificationService,
    private defermentExecControllerService: DefermentExecControllerService,
    private auctionDocumentControllerService: AuctionDocumentControllerService,
    private translate: TranslateService,
    private buddhistEraPipe: BuddhistEraPipe
  ) {}

  private _deferment: DefermentDto | DefermentExecDto = {};
  private _documents: Array<DocumentDto> = [];
  private _dataResolve: IDeferment = {};
  public get deferment(): DefermentDto | DefermentExecDto {
    return this._deferment;
  }
  public set deferment(value: DefermentDto | DefermentExecDto) {
    this._deferment = value;
  }
  public get documents(): Array<DocumentDto> {
    return this._documents;
  }
  public set documents(value: Array<DocumentDto>) {
    this._documents = value;
  }
  private _responseUnitType!: DefermentItem.ResponseUnitTypeEnum | null;
  public get responseUnitType(): DefermentItem.ResponseUnitTypeEnum | null {
    return this._responseUnitType;
  }
  public set responseUnitType(value: DefermentItem.ResponseUnitTypeEnum | null) {
    this._responseUnitType = value;
  }

  public get dataResolve(): IDeferment {
    return this._dataResolve;
  }
  public set dataResolve(value: IDeferment) {
    this._dataResolve = value;
  }

  private _dashboard!: DefermentDto;
  public get dashboard(): DefermentDto {
    return this._dashboard;
  }
  public set dashboard(value: DefermentDto) {
    this._dashboard = value;
  }

  private _selectedSeizureProperties: LitigationsCollateralsDto[] | undefined = undefined;
  public get selectedSeizureProperties(): LitigationsCollateralsDto[] | undefined {
    return this._selectedSeizureProperties;
  }
  public set selectedSeizureProperties(value: LitigationsCollateralsDto[] | undefined) {
    this._selectedSeizureProperties = value;
  }

  private _selectedCollateralSets: LitigationCollateralDeedGroupDto[] | undefined = undefined;
  public get selectedCollateralSets(): LitigationCollateralDeedGroupDto[] | undefined {
    return this._selectedCollateralSets;
  }
  public set selectedCollateralSets(value: LitigationCollateralDeedGroupDto[] | undefined) {
    this._selectedCollateralSets = value;
  }

  private _selectedCollateralFlag: boolean = false;
  public get selectedCollateralFlag(): boolean {
    return this._selectedCollateralFlag;
  }
  public set selectedCollateralFlag(value: boolean) {
    this._selectedCollateralFlag = value;
  }

  private _litigations: string[] = [];
  public get litigations(): string[] {
    return this._litigations;
  }
  public set litigations(value: any[]) {
    this._litigations = value;
  }

  get currentLitigation(): LitigationDetailDto {
    return this._litigation;
  }

  set currentLitigation(role: LitigationDetailDto) {
    this._litigation = role;
  }

  private _paramTemp: any;
  public get paramTemp(): any {
    return this._paramTemp;
  }
  public set paramTemp(value: any) {
    this._paramTemp = value;
  }

  private _dataCopy?: any;

  public get dataCopy(): any {
    return this._dataCopy;
  }
  public set dataCopy(value) {
    this._dataCopy = value;
  }

  private _oldDocs: Array<DocumentDto> = [];
  public get oldDocs(): Array<DocumentDto> {
    return this._oldDocs;
  }
  public set oldDocs(value: Array<DocumentDto>) {
    this._oldDocs = value;
  }

  public dashboardTabIndex: number = 0;

  private _hasEdit: boolean = false;
  public get hasEdit(): boolean {
    return this._hasEdit;
  }
  public set hasEdit(value: boolean) {
    this._hasEdit = value;
  }

  async inquiryDeferment(
    customerId: string,
    defermentId: string,
    defermentType: DefermentInfo.DefermentTypeEnum,
    litigationId: string,
    mode: any,
    taskId?: number
  ) {
    const request: InquiryDefermentRequest = {
      customerId: customerId,
      defermentId: defermentId || undefined,
      defermentType: defermentType,
      litigationId: litigationId,
      mode: mode,
      taskId: taskId || undefined,
    };
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.defermentControllerService.inquiryCustomerDeferment(request)),
      { showDialogForSpecificCodes: ['L006', 'L007', 'L013', 'L014', 'L015', 'L016'] }
    );
  }
  async inquiryDefermentExec(request: InquiryDefermentExecRequest): Promise<DefermentExecDto> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.defermentExecControllerService.inquiryCustomerDeferment(request)),
      { notShowAsSnackBar: true }
    );
  }

  clearDataExec() {
    this.selectedSeizureProperties = [];
    this.selectedCollateralSets = [];
    this._dataCopy = {};
    this.selectedCollateralFlag = false;
    this.hasEdit = false;
  }

  olddata(data: any, flag: boolean) {
    if (flag === true) {
      this._dataCopy = data;
    } else {
      return this._dataCopy;
    }
  }

  get defaultDefermentExecType(): InquiryDefermentExecRequest.DefermentTypeEnum {
    return 'DEFERMENT_EXEC_SALE';
  }

  async cancelDeferment(cancelRequest: DefermentCancelRequest): Promise<DefermentCancelResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.defermentControllerService.cancel(cancelRequest))
    );
  }
  async cancelDefermentExec(cancelRequest: DefermentExecCancelRequest): Promise<DefermentCancelResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.defermentExecControllerService.cancel(cancelRequest))
    );
  }

  async revise(reviseRequest: DefermentReviseRequest): Promise<DefermentReviseResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.defermentControllerService.revise(reviseRequest))
    );
  }
  async reviseExec(reviseRequest: DefermentReviseRequest): Promise<DefermentExecReviseResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.defermentExecControllerService.revise(reviseRequest))
    );
  }

  async saveCustomerDeferment(request: SaveDefermentRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.defermentControllerService.saveCustomerDeferment(request))
    );
  }
  async saveCustomerDefermentExec(request: SaveDefermentExecRequest): Promise<SaveDefermentExecResponse> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.defermentExecControllerService.saveCustomerDeferment(request)),
      { notShowAsSnackBar: true }
    );
  }

  async saveAnnounceSuspendAuction(request: SaveDefermentExecRequest): Promise<SaveAnnounceSuspendAuctionResponse> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.defermentExecControllerService.saveAnnounceSuspendAuction(request)),
      { notShowAsSnackBar: true }
    );
  }

  async approve(taskId: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.defermentExecControllerService.approve(taskId))
    );
  }

  async reject(taskId: number, reason: RejectRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.defermentExecControllerService.reject(taskId, reason))
    );
  }

  async postForLitigationCollaterals(request: LitigationsRequest): Promise<LitigationsCollateralsResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.defermentExecControllerService.postForLitigationCollaterals(request))
    );
  }

  async downloadSuspendAuctionTemplate(request: SuspendAuctionDocumentRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionDocumentControllerService.downloadSuspendAuctionTemplate(request))
    );
  }

  async getEmptySuspendAuctionDocument(request: SuspendAuctionDocumentRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.defermentExecControllerService.getEmptySuspendAuctionDocument(request))
    );
  }

  saveCustomerDefermentExecRequest(
    headerFlag: SaveDefermentRequest.HeaderFlagEnum,
    dataForm: UntypedFormGroup,
    taskId?: number,
    defermentId?: string,
    litigationId?: string
  ): SaveDefermentExecRequest {
    let rawData = dataForm.getRawValue();
    let request: SaveDefermentExecRequest = {
      customerId: this.currentLitigation?.customerId || this.deferment.deferment?.customerId || '',
      defermentExecItem: {
        ...rawData,
        collaterals: this.getSelectedCollaterals.collaterals,
        collateralDeedGroups: this.getSelectedCollaterals.collateralDeedGroups,
        collateralNoAnnounceAuctions: this.getSelectedCollaterals.collateralNoAnnounceAuctions,
      },
      headerFlag: headerFlag,
      taskId: taskId,
      litigationId: litigationId || '',
    };
    if (rawData.extendDeferment && request.defermentExecItem) {
      request.defermentExecItem.extendDefermentId = defermentId;
    }

    return request;
  }

  generateDefermentForm(_deferment?: DefermentItem | DefermentExecItem | null, hasCeased: boolean = false) {
    const defaultEndDate = moment(moment()).add(29, 'days').format('YYYY-MM-DD');
    const toDay = moment(new Date()).format('YYYY-MM-DD');

    let formGroup = this.fb.group({
      actionFlag: [{ value: _deferment?.actionFlag || false, disabled: false }],
      approveDate: [
        { value: _deferment?.approveDate || new Date().toISOString(), disabled: false },
        Validators.required,
      ],
      cancelDate: [{ value: _deferment?.cancelDate || new Date().toISOString(), disabled: false }],
      cancelReason: [{ value: _deferment?.cancelReason || '', disabled: false }],
      cancelWithDebtChanges: [{ value: _deferment?.cancelWithDebtChanges || false, disabled: false }],
      conclusionDeferment: [{ value: _deferment?.conclusionDeferment || '', disabled: false }],
      createdBy: [{ value: _deferment?.createdBy || '', disabled: false }],
      createdByName: [{ value: _deferment?.createdByName || '', disabled: false }],
      createdDate: [{ value: _deferment?.createdDate || new Date().toISOString(), disabled: false }],
      currentActorApproved: [{ value: _deferment?.currentActorApproved || false, disabled: false }],
      currentApproveActor: [{ value: _deferment?.currentApproveActor || undefined, disabled: false }],
      customerHistory: [{ value: _deferment?.customerHistory || '', disabled: false }],
      customerId: [{ value: _deferment?.customerId || '', disabled: false }],
      defermentApprovalHistoryInfos: this.getDefermentList(_deferment?.defermentApprovalHistoryInfos),
      defermentApproverCode: [{ value: _deferment?.defermentApproverCode || '', disabled: false }],
      defermentApproverName: [{ value: _deferment?.defermentApproverName || '', disabled: false }],
      defermentDays: [{ value: _deferment?.defermentDays || 0, disabled: false }],
      defermentId: [{ value: _deferment?.defermentId || '', disabled: false }],
      defermentLitigationDebtInfos: this.getDefermentList(_deferment?.defermentLitigationDebtInfos),
      defermentLitigationInfos: this.getDefermentList(_deferment?.defermentLitigationInfos),
      defermentReason: [{ value: _deferment?.defermentReason || '', disabled: false }],
      defermentReasonCode: [{ value: _deferment?.defermentReasonCode || '', disabled: false }, Validators.required],
      defermentReasonName: [{ value: _deferment?.defermentReasonName || '', disabled: false }],
      defermentReasonOther: [{ value: _deferment?.defermentReasonOther || '', disabled: false }],
      defermentTaskStatus: [{ value: _deferment?.defermentTaskStatus || undefined, disabled: false }],
      defermentType: [{ value: _deferment?.defermentType || '', disabled: false }],
      dlaApprove: hasCeased
        ? [{ value: _deferment?.dlaApprove || true, disabled: false }]
        : [{ value: _deferment?.dlaApprove || false, disabled: false }],
      dlaAuthorityCode: [{ value: _deferment?.dlaAuthorityCode || '', disabled: false }],
      dlaAuthorityName: [{ value: _deferment?.dlaAuthorityName || '', disabled: false }],
      documents: this.getDocumentInfo(_deferment?.documents),
      suspendAuctionDocuments: ((_deferment as DefermentExecItem)?.suspendAuctionDocuments as DocumentDto[]) || [],
      endDate: [{ value: _deferment?.endDate || defaultEndDate, disabled: false }, Validators.required],
      extendDeferment: [{ value: _deferment?.extendDeferment || false, disabled: false }],
      extendDefermentId: [{ value: _deferment?.extendDefermentId || '', disabled: false }],
      noAuctionDefermentEndDate: [
        { value: (_deferment as DefermentExecItem)?.noAuctionDefermentEndDate || defaultEndDate, disabled: false },
      ],
      noAuctionDefermentStartDate: [
        { value: (_deferment as DefermentExecItem)?.noAuctionDefermentStartDate || toDay, disabled: false },
      ],
      organizationCode: [{ value: _deferment?.organizationCode || '', disabled: false }],
      originAndNecessity: [{ value: _deferment?.originAndNecessity || '', disabled: false }],
      responseUnitType: [{ value: _deferment?.responseUnitType || '', disabled: false }],
      startDate: [{ value: _deferment?.startDate || toDay, disabled: false }, Validators.required],
      taskId: [{ value: _deferment?.taskId || '', disabled: false }],
      updatedBy: [{ value: _deferment?.updatedBy || '', disabled: false }],
      updatedDate: [{ value: _deferment?.updatedDate || new Date().toISOString(), disabled: false }],
      suspendAuctionResultDocuments: this.getSuspendAuctionResultDocuments(
        ((_deferment as DefermentExecItem)?.suspendAuctionResultDocuments as DocumentDto[]) || []
      ),
    });
    formGroup
      .get('suspendAuctionDocuments')
      ?.patchValue(((_deferment as DefermentExecItem)?.suspendAuctionDocuments as DocumentDto[]) || []);
    return formGroup;
  }

  uploadedDocumentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const files = control.value as DocumentDto[];

      if (!!files && files.length > 0) {
        const isDocumentUploaded = files.every(file => !!file.imageId);
        return !!!isDocumentUploaded && control.touched ? { uploadedDocumentCompletedError: true } : null;
      }

      return null;
    };
  }

  getSuspendAuctionResultDocuments(documentFiles: DocumentDto[]) {
    let arrayCtrl = this.fb.array([]);
    if (documentFiles.length > 0) {
      for (let index = 0; index < documentFiles.length; index++) {
        const element = documentFiles[index];
        const documentDate = element.documentDate as string;
        const attributes = element.attributes as SuspendAuctionResultDocumentsAttributes;
        arrayCtrl.push(
          this.fb.group({
            active: [element.active || false],
            customerId: [element.customerId || ''],
            documentId: [element.documentId || 0],
            documentTemplate: [element.documentTemplate],
            documentTemplateId: [element.documentTemplateId || ''],
            imageId: [element.imageId || null, Validators.required],
            uploadDate: [documentDate || '', Validators.required],
            ...(!!attributes && {
              attributes: this.fb.group({
                collateralIds: [attributes.collateralIds || []],
                ledName: [attributes.ledName || ''],
                redCaseNo: [attributes.redCaseNo || ''],
                lawyerName: [attributes.lawyerName || ''],
                lawyerId: [attributes.lawyerId || ''],
                suspendAuctionEndDate: [attributes.suspendAuctionEndDate || ''],
              }),
            }),
            ...(!!documentDate && { documentDate: [element.documentDate || ''] }),
          })
        );
      }
      arrayCtrl.addValidators(this.uploadedDocumentValidator());
    }
    return arrayCtrl;
  }

  getLitigationCaseDebtInfo(litigationCaseDebtInfos: LitigationCaseDebtInfo[]) {
    let arrayCtrl = this.fb.array([]);
    litigationCaseDebtInfos.forEach(el => {
      arrayCtrl.push(
        this.fb.group({
          blackCaseNo: el.blackCaseNo || '',
          debtAmount: [el.debtAmount || null, Validators.required],
          litigationCaseId: el.litigationCaseId || '',
          litigationId: el.litigationId || '',
          redCaseNo: el.redCaseNo || '',
        })
      );
    });
    return arrayCtrl;
  }

  getDocumentInfo(_data?: Array<DocumentDto>[] | Array<DefermentItem>) {
    if (_data && _data.length > 0) {
      return this.fb.array(_data);
    } else {
      return this.fb.array([]);
    }
  }

  formatDocs(documents: DocumentDto[] = [], isViewMode?: boolean, readOnlyDoc: boolean = false) {
    let docs: IDocument[] = [];
    let category = this.sessionService.currentUser?.category;

    const groupedDocs = this.documentService.groupBy(documents, 'documentTemplateId');
    let sortData = Object.keys(groupedDocs).sort((a: any, b: any) => {
      return b?.documentTemplateId - a?.documentTemplateId;
    });
    for (const keys of sortData) {
      let doc = groupedDocs[keys];
      let isSubContract = false;
      if (doc?.length > 1) {
        isSubContract = true;
        for (let index = 0; index < doc.length; index++) {
          let key = doc[index] as IDocument;
          if (index == 0 && keys === DOC_TEMPLATE.LEXSD016) {
            if (key?.isSubContract !== false) {
              let remap = {
                ...doc[index],
                total: doc?.length,
                isSubContract: false,
                removeDocument: !!key?.imageId,
                uploadDate: doc[0]?.documentDate || '',
                isUpload: true,
              };
              docs.push(remap);
            } else {
              doc[index].total = doc?.length - 1;
              doc[index].isUpload = true;
              doc[index].uploadDate = new Date().toDateString();
              doc[index].imageId = '';
              doc[index].removeDocument = true;
            }
          }
        }
      } else {
        if (doc?.length === 1 && keys === DOC_TEMPLATE.LEXSD016) {
          if (doc[0].imageId) {
            isSubContract = true;
            let remap = {
              ...doc[0],
              total: doc?.length,
              imageId: '',
              isSubContract: false,
              removeDocument: true,
              isUpload: true,
              uploadDate: doc[0]?.documentDate || '',
            };
            docs.push(remap);
            doc[0].isSubContract = true;
            doc[0].uploadRequired = false;
            doc[0].isUpload = true;
            if (!!!doc[0].commitmentAccounts) {
              doc[0].commitmentAccounts = [];
            }
          }
        }
      }
      //contact
      let total = doc.filter((f: IDocument) => !!f?.isSubContract);
      doc = doc.map((m: IDocument) => {
        const subContractMap = {
          ...m,
          commitmentAccounts: m.commitmentAccounts || [],
          isSubContract: isSubContract,
          total: isSubContract ? 0 : total?.length,
          uploadDate: m?.documentDate || '',
          removeDocument: isSubContract ? false : doc?.length <= 1,
          imageId:
            isViewMode && m.documentTemplateId == DOC_TEMPLATE.LEXSF079
              ? m?.additionalInfo?.allowCategory.includes(category)
                ? m?.imageId
                : ''
              : m?.imageId,
        };
        return m?.isSubContract == false ? m : subContractMap;
      });

      docs = docs.concat(doc);
    }

    if (!readOnlyDoc) {
      this._documents = docs as any;
    }
    return docs;
  }

  mapId(data: DisplayDocument[]) {
    return data.map((d, i) => ({
      ...d,
      id: i,
      documentId: 0,
    }));
  }

  updateDocumentDeferment(documents: DocumentDto[]) {
    let newDocuments = this.mapId(documents);
    let newDocs = this._documents.filter((d: any) => !d?.isSubContract);
    let allDoc = newDocs.concat(newDocuments);
    this.formatDocs(allDoc);
  }

  async download(_defermentId: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.defermentControllerService.download(_defermentId))
    );
  }

  validateUserDeferment(_litigationDetail: LitigationDetailDto) {
    if (
      _litigationDetail?.amdResponseUnitCode &&
      _litigationDetail.amdUser?.userId === this.sessionService.currentUser?.userId
    ) {
      this.responseUnitType = 'AMD_RESPONSE_UNIT';
      return this.responseUnitType;
    } else if (_litigationDetail.rmUser?.userId === this.sessionService.currentUser?.userId) {
      this.responseUnitType = 'RESPONSE_UNIT';
      return this.responseUnitType;
    } else {
      return null;
    }
  }

  updateDocumentCommitmentAccount(accounts: string[], element: DisplayDocument) {
    const foundIndex = this._documents.findIndex((doc: any) => doc?.id === element?.id && doc?.isSubContract);
    if (foundIndex >= 0 && this._documents[foundIndex]) {
      this._documents[foundIndex].commitmentAccounts = accounts;
    }
  }

  checkCommitmentAccount(state?: defermentState) {
    let title = '';
    let accounts = this._documents.filter(
      (d: any) =>
        (d.documentTemplate?.optional === false || d.uploadRequired || d.uploadedFromDeferment) &&
        d.documentTemplateId &&
        this.contractList.includes(d.documentTemplateId) &&
        d?.isSubContract
    );
    const isAccountDocsCompleted = accounts.every(
      (e: DocumentDto) => e.commitmentAccounts && e.commitmentAccounts?.length > 0
    );
    switch (state) {
      case defermentState.NORMAL:
        title = 'LAWSUIT.DEFERMENT.FAIL_HEADER_COMMITMENT_NORMAL';
        break;
      case defermentState.DEFERMENT_EXEC:
        title = 'LAWSUIT.DEFERMENT.FAIL_HEADER_COMMITMENT_NORMAL_EXEC';
        break;

      case defermentState.DEFERMENT:
        title = 'LAWSUIT.DEFERMENT.FAIL_HEADER_COMMITMENT_DEFERMENT';
        break;

      case defermentState.DEFERMENT_PENDING_APPROVED:
        title = 'LAWSUIT.DEFERMENT.FAIL_HEADER_COMMITMENT_PENDING';
        break;
    }
    if (!isAccountDocsCompleted && accounts.length > 0) {
      this.notificationService.alertDialog(
        title,
        'LAWSUIT.DEFERMENT.FAIL_MSG_COMMITMENT',
        'COMMON.BUTTON_ACKNOWLEDGE',
        'icon-Check-Square'
      );
      return false;
    }
    return true;
  }
  setDocumentWithCondition(isRequired: boolean, documentTemplateId: string) {
    this.documents = this.documents.map((m: any) => {
      if (m.documentTemplateId === documentTemplateId && m.documentTemplate) {
        m.documentTemplate.optional = !isRequired;
        m.uploadRequired = isRequired;
        m.active = isRequired;
      }
      return m;
    });
  }

  async getLitigationIdByCustomerId(customerId: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.defermentControllerService.getLitigationIdByCustomerId(customerId))
    );
  }
  async getLitigationIdByCustomerIdExec(customerId: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.defermentExecControllerService.getLitigationIdByCustomerId(customerId))
    );
  }

  getDefermentList(
    _data?: Array<DefermentLitigationDebtInfo> | Array<DefermentLitigationInfo> | Array<DefermentApprovalHistoryInfo>
  ) {
    if (_data && _data.length > 0) {
      return this.fb.array(_data);
    } else {
      return this.fb.array([]);
    }
  }

  async updateInquiryDeferment(
    customerId: string,
    defermentId: string,
    defermentType: DefermentInfo.DefermentTypeEnum,
    litigationId: string,
    mode: any,
    taskId?: number
  ) {
    const res = await this.inquiryDeferment(customerId, defermentId, defermentType, litigationId, mode, taskId);
    this.deferment = res;
  }

  hasPermissionExecution(): PermissionExec {
    const canDelay: boolean = this.sessionService.hasPermission(PCode.SUBMIT_DELAY_EXECUTION);
    const canExtendDelay: boolean = this.sessionService.hasPermission(PCode.EXTEND_DELAY_EXECUTION);
    const canEditDelay: boolean = this.sessionService.hasPermission(PCode.EDIT_DELAY_EXECUTION);
    const canCancelDelay: boolean = this.sessionService.hasPermission(PCode.CANCEL_DELAY_EXECUTION);
    return {
      canDelay: canDelay,
      canExtendDelay: canExtendDelay,
      canEditDelay: canEditDelay,
      canCancelDelay: canCancelDelay,
    };
  }

  clearData() {
    this.dashboardTabIndex = 0;
  }

  get getSelectedCollaterals() {
    const statusEnum = LitigationsCollateralsDto.LexsCollateralStatusEnum;
    let collaterals = []; // ทรัพย์ที่จะชะลอยึด lexsCollateralStatus = PLEDGE
    let collateralNoAnnounceAuctions = []; // ทรัพย์ที่จะชะลอขาย (ไม่มีประกาศขายทอดตลาด) lexsCollateralStatus = SEIZURED
    let collateralDeedGroups = []; // ทรัพย์ที่จะชะลอขาย (มีประกาศขายทอดตลาด) lexsCollateralStatus = ON_SALE ,PENDING_SALE
    collaterals =
      this._selectedSeizureProperties?.filter(
        (c: any) => c.defermentCollateralStatus === statusEnum.Pledge || c.lexsCollateralStatus === statusEnum.Pledge
      ) || [];
    collateralNoAnnounceAuctions =
      this._selectedSeizureProperties?.filter(
        (c: any) =>
          c.defermentCollateralStatus === statusEnum.Seizured || c.lexsCollateralStatus === statusEnum.Seizured
      ) || [];
    collateralDeedGroups = this._selectedCollateralSets || [];
    return {
      collaterals,
      collateralNoAnnounceAuctions,
      collateralDeedGroups,
    };
  }

  isValidSuspendAuctionDocuments(docs: IUploadMultiFile[]) {
    if (!docs) {
      return false;
    }
    return docs.every((doc: IUploadMultiFile) => !!doc.imageId);
  }

  canSelectAppointment(element: CollateralAuctionInfo, isGetAucRound: boolean = false) {
    /**
     * check Date
     * check AucResult
     */
    return (
      element.enabled &&
      (this.isGreaterCurrentDate(element.bidDate as string) || isGetAucRound) &&
      this.isNotAucResult(element.aucResult as CollateralAuctionInfo.AucResultEnum)
    );
  }

  isGreaterCurrentDate(bidDate: string) {
    return new Date(bidDate) > new Date();
  }

  isNotAucResult(aucResult: CollateralAuctionInfo.AucResultEnum) {
    const exceptAucResult = [CollateralAuctionInfo.AucResultEnum.Sold, CollateralAuctionInfo.AucResultEnum.Unsold];
    return !exceptAucResult.includes(aucResult);
  }

  getBannerMessageExecution(defermentType: DefermentInfo.DefermentTypeEnum, endDate: string) {
    const endDateFormat = this.buddhistEraPipe.transform(endDate, 'DD/MM/yyyy');
    switch (defermentType) {
      case 'DEFERMENT_EXEC_SEIZURE':
        return this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.PENDING_APPROVED_EXEC_SEIZURE', {
          ENDDATE: endDateFormat,
        });
      case 'DEFERMENT_EXEC_SALE':
        return this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.PENDING_APPROVED_EXEC_SALE', {
          ENDDATE: endDateFormat,
        });
      case 'DEFERMENT_EXEC_SEIZURE_SALE':
        return this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.PENDING_APPROVED_EXEC_SEIZURE_SALE', {
          ENDDATE: endDateFormat,
        });
    }
  }

  async isPrescriptionLessThanProperMonths(
    endDate: Date | string,
    defermentLitigationInfosValue: DefermentLitigationInfo[]
  ) {
    // console.log('this.defermentService.deferment', this.defermentService.deferment)
    const dateNumbers = [
      ((this.deferment as DefermentDto)?.minPrescriptionMonth || 0) * 30,
      ((this.deferment as DefermentDto)?.maxPrescriptionMonth || 0) * 30,
    ];
    // dateNumbers.sort((a, b) => a - b); // Sort the array in descending order

    let isShowLowDateDiffWarning = false;
    let warningMessageKey = 'LAWSUIT.DEFERMENT.FAIL_MESSAGE_BETWEEN_DYNAMIC';
    let showDate = -1;
    let continueButtonKey = '';

    // Loop through the sorted dateNumbers array and determine the correct showDate
    for (let i = 0; i < dateNumbers.length; i++) {
      if (this.validatePrescriptionDate(endDate, '<', dateNumbers[i], defermentLitigationInfosValue)) {
        isShowLowDateDiffWarning = true;
        showDate = dateNumbers[i];
        continueButtonKey = 'COMMON.BUTTON_CONTINUE2';
        break;

      }
    }

    return isShowLowDateDiffWarning
      ? await this.notificationService.warningDialog(
          'LAWSUIT.DEFERMENT.WARNING_DURATION',
          this.translate.instant(warningMessageKey, { MONTH: Math.floor(showDate / 30), DATE: showDate }),
          continueButtonKey,
          'icon-Arrow-Right'
        )
      : true;
  }

  validatePrescriptionDate(dateCompare: Date | string, symbolCheck: string, numCompare: number, defermentLitigationInfosValue: DefermentLitigationInfo[]) {
    let dateDiffLessThan = false;
    const prescriptionDateList = (
      defermentLitigationInfosValue
    ).filter(e => e.checked);
    prescriptionDateList.forEach(e => {
      if (!e.prescriptionDate) {
        return;
      }
      let dateDiff = Utils.calculateDateDiff(dateCompare, e.prescriptionDate);
      // console.log('e.prescriptionDate ::', e.prescriptionDate)
      // console.log('dateDiff ::', dateDiff)
      switch (symbolCheck) {
        case '<':
          if (dateDiff < numCompare) dateDiffLessThan = true;
          break;
        case '<=':
          if (dateDiff <= numCompare) dateDiffLessThan = true;
          break;
        case '>':
          if (dateDiff > numCompare) dateDiffLessThan = true;
          break;
        case '>=':
          if (dateDiff >= numCompare) dateDiffLessThan = true;
          break;
        default:
          break;
      }
    });
    return dateDiffLessThan;
  }
}
