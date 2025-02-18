import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ITabNav, TMode } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { RouterService } from '@app/shared/services/router.service';
import {
  AuctionDocumentControllerService,
  Contacts,
  GetWithdrawSeizureResponse,
  LegalExecutionCommandResponse,
  LitigationCaseControllerService,
  LitigationCasePersonsDto,
  LitigationCaseShortDto,
  PostApprovalRequest,
  PostCommandAcceptionSubmitRequest,
  PostDocValidationSubmitRequest,
  PostSubmitRequest,
  PostValidateRequest,
  ResultRecordingTaskSubmitRequest,
  WithdrawConsentDocuments,
  SuspendAuctionDocumentRequest,
  WithdrawSeizureControllerService,
  WithdrawSeizureGroups,
  WithdrawSeizureLedAllResponse,
  WithdrawSeizureResponse,
  WithdrawSeizureAssetsResponse,
} from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';
import {
  WITHDRAWN_SEIZURE_PROPERTY_STEPS,
  WITHDRAWN_SEIZURE_PROPERTY_TABS,
} from './withdrawn-seizure-property.constant';

@Injectable({
  providedIn: 'root',
})
export class WithdrawnSeizurePropertyService {
  private _withdrawnSeizurePropertyTabs: ITabNav[] = WITHDRAWN_SEIZURE_PROPERTY_TABS;
  public get withdrawnSeizurePropertyTabs(): ITabNav[] {
    return this._withdrawnSeizurePropertyTabs;
  }
  public set withdrawnSeizurePropertyTabs(value: ITabNav[]) {
    this._withdrawnSeizurePropertyTabs = value;
  }

  public lawyerForm!: UntypedFormGroup;
  getLawyerForm(isRequired: boolean = true, data?: LitigationCaseShortDto) {
    if (data) {
      return this.fb.group({
        legalExecutionLawyerId: [data?.legalExecutionLawyerId || '', !isRequired ? null : Validators.required],
      });
    } else {
      return this.fb.group({ legalExecutionLawyerId: ['', !isRequired ? null : Validators.required] });
    }
  }

  private _withdrawnSeizurePropertySteps: ITabNav[] = WITHDRAWN_SEIZURE_PROPERTY_STEPS;
  public get withdrawnSeizurePropertySteps(): ITabNav[] {
    return this._withdrawnSeizurePropertySteps;
  }
  public set withdrawnSeizurePropertySteps(value: ITabNav[]) {
    this._withdrawnSeizurePropertySteps = value;
  }

  private _litigationCaseCollaterals!: GetWithdrawSeizureResponse;
  public get litigationCaseCollaterals(): GetWithdrawSeizureResponse {
    return this._litigationCaseCollaterals;
  }
  public set litigationCaseCollaterals(value: GetWithdrawSeizureResponse) {
    this._litigationCaseCollaterals = { ...value };
  }

  private _litigationCasePersons!: LitigationCasePersonsDto;
  public get litigationCasePersons(): LitigationCasePersonsDto {
    return this._litigationCasePersons;
  }
  public set litigationCasePersons(value: LitigationCasePersonsDto) {
    this._litigationCasePersons = value;
  }

  private _withdrawSeizurePropertyCreateData!: WithdrawSeizureResponse;
  public get withdrawSeizurePropertyCreateData(): WithdrawSeizureResponse {
    return this._withdrawSeizurePropertyCreateData;
  }
  public set withdrawSeizurePropertyCreateData(value: WithdrawSeizureResponse) {
    this._withdrawSeizurePropertyCreateData = value;
  }
  private _withdrawSeizureResponse!: WithdrawSeizureResponse;
  public get withdrawSeizureResponse(): WithdrawSeizureResponse {
    return this._withdrawSeizureResponse;
  }
  public set withdrawSeizureResponse(value: WithdrawSeizureResponse) {
    this._withdrawSeizureResponse = value;
  }

  private _withdrawSeizureLedAllResponse!: WithdrawSeizureLedAllResponse;
  public get withdrawSeizureLedAllResponse(): WithdrawSeizureLedAllResponse {
    return this._withdrawSeizureLedAllResponse;
  }
  public set withdrawSeizureLedAllResponse(value: WithdrawSeizureLedAllResponse) {
    this._withdrawSeizureLedAllResponse = value;
  }

  private _withdrawSeizureLedAllPayload!: ResultRecordingTaskSubmitRequest;
  public get withdrawSeizureLedAllPayload(): ResultRecordingTaskSubmitRequest {
    return this._withdrawSeizureLedAllPayload;
  }
  public set withdrawSeizureLedAllPayload(value: ResultRecordingTaskSubmitRequest) {
    this._withdrawSeizureLedAllPayload = value;
  }

  private _withdrawSeizureAssetsResponse!: WithdrawSeizureAssetsResponse;
  public get withdrawSeizureAssetsResponse(): WithdrawSeizureAssetsResponse {
    return this._withdrawSeizureAssetsResponse;
  }
  public set withdrawSeizureAssetsResponse(value: WithdrawSeizureAssetsResponse) {
    this._withdrawSeizureAssetsResponse = value;
  }
  public withdrawDateCtrl!: UntypedFormControl;
  public withdrawReasonCtrl!: UntypedFormControl;
  public withdrawFeeCtrl: UntypedFormControl[] = [];

  public litigationId!: string;
  public litigationCaseId!: number;
  public withdrawSeizureId!: number;
  public withdrawSeizureLedId!: number;
  public withdrawSeizureMode!: TMode;
  public withdrawnExcludeItems!: string[];
  public withdrawnExcludeItemsAsset!: string[];

  public isErrorLedDoc: boolean = false;
  public isErrorContactDoc: boolean = false;

  withdrawPaidFeeSource: Array<Contacts[]> = [];
  public tempDataDeletedGroupCol!: any[];
  public tempDataDeletedGroupAsset!: any[];

  constructor(
    private fb: UntypedFormBuilder,
    private errorHandlingService: ErrorHandlingService,
    private withdrawSeizureControllerService: WithdrawSeizureControllerService,
    private litigationCaseService: LitigationCaseControllerService,
    private routerService: RouterService,
    private litigationCaseShortService: LitigationCaseService,
    private auctionDocumentControllerService: AuctionDocumentControllerService
  ) {}

  async getLitigationCaseCollateral(caseId: number): Promise<GetWithdrawSeizureResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseService.getWithdrawSeizureCollateral(caseId))
    );
  }

  async getLegalExecutionCommand(litigationId: string): Promise<LegalExecutionCommandResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.withdrawSeizureControllerService.getLegalExecutionCommand(litigationId))
    );
  }

  async getWithdrawSeizures(withdrawSeizureId: number): Promise<WithdrawSeizureResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.withdrawSeizureControllerService.getWithdrawSeizures(withdrawSeizureId))
    );
  }

  async getWithdrawSeizureAssets(caseId: number): Promise<WithdrawSeizureAssetsResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseService.getWithdrawSeizureAssets(caseId))
    );
  }

  async getWithdrawSeizuresLed(
    withdrawSeizureId: number,
    withdrawSeizuresLedId: number
  ): Promise<WithdrawSeizureLedAllResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.withdrawSeizureControllerService.getWithdrawSeizuresLed(withdrawSeizureId, withdrawSeizuresLedId)
      )
    );
  }

  async postCommandAcceptionSubmit(
    taskId: number,
    withdrawSeizureId: number,
    request: PostCommandAcceptionSubmitRequest
  ) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.withdrawSeizureControllerService.postCommandAcceptionSubmit(taskId, withdrawSeizureId, request)
      )
    );
  }

  async postDocumentValidationSubmit(
    taskId: number,
    withdrawSeizureId: number,
    request: PostDocValidationSubmitRequest
  ) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.withdrawSeizureControllerService.postDocumentValidationSubmit(taskId, withdrawSeizureId, request)
      )
    );
  }

  async postUploadDocumentSubrogation(withdrawSeizureId: number, withdrawSeizuresLedId: number, file: Blob) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.withdrawSeizureControllerService.postUploadDocumentSubrogation(
          withdrawSeizureId,
          withdrawSeizuresLedId,
          file
        )
      )
    );
  }

  async postWithdrawSeizuresApproval(withdrawSeizureId: number, request: PostApprovalRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.withdrawSeizureControllerService.postWithdrawSeizuresApproval(withdrawSeizureId, request))
    );
  }

  async postWithdrawSeizuresCancel(withdrawSeizureId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.withdrawSeizureControllerService.postWithdrawSeizuresCancel(withdrawSeizureId))
    );
  }

  async postWithdrawSeizuresSubmit(request: PostSubmitRequest) {
    request.withdrawSeizureGroups?.forEach(it => {
      it.contacts = it.contacts
        ?.filter(it => it.firstName)
        .map((person, i) => {
          const obj: Contacts = {
            personId: person.personId?.startsWith('CONTACT_') ? '' : person.personId,
            firstName: person.firstName,
            lastName: person.lastName,
            telephoneNo: person.telephoneNo || '',
            isMainContact: person.isMainContact,
          };
          return obj;
        });
    });
    const withdrawSeizureGroups = request.withdrawSeizureGroups?.map(it => {
      const consentDocs: WithdrawConsentDocuments[] = it.consentDocuments
        ?.filter(doc => doc.document?.imageId)
        .map((m: WithdrawConsentDocuments) => {
          return { id: m.id, uploadSessionId: m.document?.imageId } as WithdrawConsentDocuments;
        }) as WithdrawConsentDocuments[];
      return {
        ...it,
        consentDocuments: consentDocs && consentDocs.length > 0 ? consentDocs : null,
      };
    });
    const payload: PostSubmitRequest = {
      headerFlag: request.headerFlag,
      withdrawSeizureId: request.withdrawSeizureId,
      reasonWithdrawSeizures: request.reasonWithdrawSeizures,
      litigationCaseId: request.litigationCaseId,
      withdrawSeizureType: request.withdrawSeizureType,
      isContactResponseForExpense: request.isContactResponseForExpense,
      debtPaidAmount: Number(request.debtPaidAmount),
      withdrawSeizureGroups: withdrawSeizureGroups as WithdrawSeizureGroups[],
    };

    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.withdrawSeizureControllerService.postWithdrawSeizuresSubmit(payload))
    );
  }

  async postWithdrawSeizuresValidate(request: PostValidateRequest) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.withdrawSeizureControllerService.postWithdrawSeizuresValidate(request)),
      {
        showDialogForSpecificCodes: ['EWS001', 'EWS002', 'EWS003'],
        notShowAsSnackBar: true,
      }
    );
  }

  async resultRecordingTaskSubmit(
    taskId: number,
    withdrawSeizureId: number,
    request: ResultRecordingTaskSubmitRequest
  ) {
    return await this.errorHandlingService.invokeNoRetry(
      () =>
        lastValueFrom(
          this.withdrawSeizureControllerService.resultRecordingTaskSubmit(taskId, withdrawSeizureId, request)
        ),
      {
        notShowAsSnackBar: true,
      }
    );
  }

  public propertyForm!: UntypedFormGroup;
  getPropertyForm(properties?: string[], contacts?: string[], assets?: string[]) {
    return this.fb.group({
      properties: new UntypedFormControl(properties || []),
      contacts: new UntypedFormControl(contacts || [], Validators.required),
      assets: new UntypedFormControl(assets || []),
    });
  }

  public withdrawnSeizureDetailForm!: UntypedFormGroup;
  getWithdrawnSeizureDetailForm(data?: WithdrawSeizureResponse) {
    if (data) {
      return this.fb.group({
        reasonWithdrawSeizures: new UntypedFormControl(data?.reasonWithdrawSeizures || null, Validators.required),
        debtPaidAmount: new UntypedFormControl(
          parseFloat(data?.debtPaidAmount?.toString() || '') > 0 ? data?.debtPaidAmount : '' || null,
          Validators.required
        ),
      });
    } else {
      return this.fb.group({
        reasonWithdrawSeizures: new UntypedFormControl('', Validators.required),
        debtPaidAmount: new UntypedFormControl(null, Validators.required),
      });
    }
  }

  public rows: UntypedFormArray = this.fb.array([]);
  public withdrawnSeizureUploadForm: UntypedFormGroup = this.fb.group({
    files: this.rows,
    filesAsset: this.rows,
  });
  getFileValidateControl(data: any) {
    const row = this.fb.group({ file: [false, [Validators.requiredTrue]] });
    this.rows.push(row);
  }
  addFileValidateControl(hasImageId?: boolean) {
    const row = this.fb.group({ file: [hasImageId, [Validators.requiredTrue]] });
    this.rows.push(row);
  }
  clearWithdrawnSeizureUploadForm() {
    (this.withdrawnSeizureUploadForm.controls['files'] as UntypedFormArray).clear();
  }

  public routeCorrection(path: string): string {
    const _prefix = this.routerService.currentRoute.split('/');
    const _prefixPath = `/${_prefix[1]}/${_prefix[2]}/withdrawn-seizure-property/${path}`;
    return _prefixPath;
  }

  public clearData() {
    this.withdrawSeizureId = Number(null);
    this.withdrawSeizureResponse = {};
    this.withdrawSeizurePropertyCreateData = {};
    this.propertyForm?.reset();
    this.withdrawnSeizureDetailForm?.reset();
    this.withdrawnSeizureUploadForm?.reset();
    this.withdrawDateCtrl?.reset();
    this.withdrawSeizureLedAllPayload = { headerFlag: 'DRAFT' };
    this.withdrawSeizureLedAllResponse = {};
    this.withdrawSeizureResponse = {};
    this.isErrorContactDoc = false;
    this.isErrorLedDoc = false;
    this.lawyerForm?.reset();
    this.litigationCaseShortService.litigationCaseShortDetail = {};
  }

  async downloadSuspendAuctionTemplate(request: SuspendAuctionDocumentRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionDocumentControllerService.downloadSuspendAuctionTemplate(request))
    );
  }
}
