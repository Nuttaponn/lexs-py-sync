import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ITabNav } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import {
  CommitmentAccountDto,
  ExecutionDocAttorneyResultRequest,
  ExecutionDocIssuanceRequest,
  ExecutionDocIssuanceResultRequest,
  ExecutionTaskSubmitRequest,
  LegalExecutionWritOfExecsResponse,
  LitigationCaseDebtCalculationDto,
  LitigationCaseShortDto,
  LitigationWritOfExecDetailDto,
  WithdrawWritOfExecByLitigationResponse,
  WritOfExecControllerService,
} from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';
import { EXECUTION_WARRANT_TABS } from './execution-warrant.constant';

@Injectable({
  providedIn: 'root',
})
export class ExecutionWarrantService {
  /** Clear data */
  clearDataExecutionWarrant() {
    this.litigationWritOfExec = {};
  }

  /** Getter Setter Expense DTO */ //LitigationWritOfExecDto
  private _litigationWritOfExec!: LegalExecutionWritOfExecsResponse;
  public get litigationWritOfExec(): LegalExecutionWritOfExecsResponse {
    return this._litigationWritOfExec;
  }
  public set litigationWritOfExec(value: LegalExecutionWritOfExecsResponse) {
    this._litigationWritOfExec = value;
  }

  private _withdrawWritOfExecByLitigationResponse!: WithdrawWritOfExecByLitigationResponse;
  public get withdrawWritOfExecByLitigationResponse(): WithdrawWritOfExecByLitigationResponse {
    return this._withdrawWritOfExecByLitigationResponse;
  }
  public set withdrawWritOfExecByLitigationResponse(value: WithdrawWritOfExecByLitigationResponse) {
    this._withdrawWritOfExecByLitigationResponse = value;
  }

  private _executionWarrantTabs: ITabNav[] = EXECUTION_WARRANT_TABS;
  public get executionWarrantTabs(): ITabNav[] {
    return this._executionWarrantTabs;
  }
  public set executionWarrantTabs(value: ITabNav[]) {
    this._executionWarrantTabs = value;
  }

  private _litigationCaseDebtCalculation!: LitigationCaseDebtCalculationDto;
  public get litigationCaseDebtCalculation(): LitigationCaseDebtCalculationDto {
    return this._litigationCaseDebtCalculation;
  }
  public set litigationCaseDebtCalculation(value: LitigationCaseDebtCalculationDto) {
    this._litigationCaseDebtCalculation = value;
  }

  private _commitments!: CommitmentAccountDto[];
  public get commitments(): CommitmentAccountDto[] {
    return this._commitments;
  }
  public set commitments(value: CommitmentAccountDto[]) {
    this._commitments = value;
  }

  private _legalExecutionWritOfExecsByLgIdAngLgCaseId!: LitigationWritOfExecDetailDto;
  public get legalExecutionWritOfExecsByLgIdAngLgCaseId(): LitigationWritOfExecDetailDto {
    return this._legalExecutionWritOfExecsByLgIdAngLgCaseId;
  }
  public set legalExecutionWritOfExecsByLgIdAngLgCaseId(value: LitigationWritOfExecDetailDto) {
    this._legalExecutionWritOfExecsByLgIdAngLgCaseId = value;
  }

  constructor(
    private errorHandlingService: ErrorHandlingService,
    private writOfExecControllerService: WritOfExecControllerService,
    private litigationCaseService: LitigationCaseService,
    private fb: UntypedFormBuilder
  ) {}

  async getDebtCalculationInfo(caseId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.writOfExecControllerService.getDebtCalculationInfo(caseId))
    );
  }

  async getExecutionDocuments(caseId: number, q: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.writOfExecControllerService.getExecutionDocuments(caseId, q))
    );
  }

  async getLegalExecutionWritOfExecsByLgId(litigationId: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.writOfExecControllerService.getLegalExecutionWritOfExecsByLgId(litigationId))
    );
  }

  async getLegalExecutionWritOfExecsByLgIdAngLgCaseId(litigationCaseId: number, litigationId: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.writOfExecControllerService.getLegalExecutionWritOfExecsByLgIdAngLgCaseId(litigationCaseId, litigationId)
      )
    );
  }

  async postDocumentIssuanceOfExecutionResult(caseId: number, request: ExecutionDocIssuanceResultRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.writOfExecControllerService.postDocumentIssuanceOfExecutionResult(caseId, request))
    );
  }

  async postDocumentPowerOfAttorneyResult(caseId: number, request: ExecutionDocAttorneyResultRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.writOfExecControllerService.postDocumentPowerOfAttorneyResult(caseId, request))
    );
  }

  async postExecutionDocDebtCalculation(caseId: number, file: Blob) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.writOfExecControllerService.postExecutionDocDebtCalculation(caseId, file))
    );
  }

  async postExecutionTaskSubmit(caseId: number, taskId: number, request: ExecutionTaskSubmitRequest) {
    if (!!!request.legalExecutionLawyerId) {
      request.legalExecutionLawyerId = this.litigationCaseService.litigationCaseShortDetail.legalExecutionLawyerId;
    }
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.writOfExecControllerService.postExecutionTaskSubmit(caseId, taskId, request))
    );
  }

  async saveDocumentIssuanceOfExecution(caseId: number, request: ExecutionDocIssuanceRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.writOfExecControllerService.saveDocumentIssuanceOfExecution(caseId, request))
    );
  }

  async uploadDocumentTfsPaymentHistory(accountNo: string, caseId: number, file: Blob) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.writOfExecControllerService.uploadDocumentTfsPaymentHistory(accountNo, caseId, file))
    );
  }

  public lawyerForm!: UntypedFormGroup;
  getLawyerForm(data?: LitigationCaseShortDto) {
    if (data) {
      return this.fb.group({
        legalExecutionLawyerId: data.legalExecutionLawyerId || '',
      });
    } else {
      return this.fb.group({});
    }
  }
}
