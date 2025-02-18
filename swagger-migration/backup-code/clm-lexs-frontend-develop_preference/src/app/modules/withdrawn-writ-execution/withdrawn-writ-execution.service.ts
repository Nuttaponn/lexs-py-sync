import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import {
  PostApprovalRequest,
  PostCommandAcceptionSubmitRequest,
  PostSubmitRequest,
  WithdrawExecutionValidateRequest,
  WithdrawWritOfExecByLitigationResponse,
  WithdrawWritOfExecControllerService,
  WithdrawWritOfExecResponse,
  WritOfExecDocValidationRequest,
  WritOfExecResultSubmitRequest,
} from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WithdrawnWritExecutionService {
  constructor(
    private errorHandlingService: ErrorHandlingService,
    private withdrawWritOfExecControllerService: WithdrawWritOfExecControllerService,
    private fb: UntypedFormBuilder
  ) {}

  private withdrawnWritExecutionValidateCodes = [
    'WWRIT001',
    'WWRIT002',
    'WWRIT003',
    'WWRIT004',
    'WWRIT005',
    'WWRIT006',
    'WWRIT009',
    'WWRIT010',
    'WWRIT011',
    'WWRIT012',
    'WWRIT013',
    'WWRIT014',
  ];
  public lawyerForm!: UntypedFormGroup;
  getLawyerForm(data?: WithdrawWritOfExecResponse) {
    if (data) {
      return this.fb.group({
        legalExecutionLawyerId: data.publicAuctionLawyerId || '',
      });
    } else {
      return this.fb.group({
        legalExecutionLawyerId: '',
      });
    }
  }

  public withdrawExcutionResultComponentForm!: UntypedFormGroup;
  getWithdrawExcutionResultComponentForm(data?: WithdrawWritOfExecResponse) {
    if (data) {
      return this.fb.group({
        withdrawWritOfExecDatetime: ['', Validators.required],
        withdrawWritOfExecResult: ['', Validators.required],
        withdrawWritOfExecRemark: [''],
        returnAmount: [''],
        withdrawWritOfExecDocument: [{}],
        uploadSessionId: ['', Validators.required],
      });
    } else {
      return this.fb.group({});
    }
  }

  public withdrawExcutionDetailComponentForm!: UntypedFormGroup;
  getWithdrawExcutionDetailComponentForm(data?: WithdrawWritOfExecResponse) {
    if (data) {
      return this.fb.group({
        withdrawWritOfExecReason: ['', Validators.required],
        withdrawWritOfExecOtherReasonRemark: [null],
      });
    } else {
      return this.fb.group({});
    }
  }

  private _withdrawWritOfExecResponse!: WithdrawWritOfExecResponse;
  public get withdrawWritOfExecResponse(): WithdrawWritOfExecResponse {
    return this._withdrawWritOfExecResponse;
  }
  public set withdrawWritOfExecResponse(value: WithdrawWritOfExecResponse) {
    this._withdrawWritOfExecResponse = value;
  }
  async getWithdrawWritOfExec(caseId: number, withdrawWritOfExecId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.withdrawWritOfExecControllerService.getWithdrawWritOfExec(caseId, withdrawWritOfExecId))
    );
  }

  private _withdrawWritOfExecByLitigationResponse!: WithdrawWritOfExecByLitigationResponse;
  public get withdrawWritOfExecByLitigationResponse(): WithdrawWritOfExecByLitigationResponse {
    return this._withdrawWritOfExecByLitigationResponse;
  }
  public set withdrawWritOfExecByLitigationResponse(value: WithdrawWritOfExecByLitigationResponse) {
    this._withdrawWritOfExecByLitigationResponse = value;
  }
  async getWithdrawWritOfExecByLitigation(litigationId: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.withdrawWritOfExecControllerService.getWithdrawWritOfExecByLitigation(litigationId))
    );
  }

  async postValidateWithdrawWritOfExecInit(caseId: number, request: WithdrawExecutionValidateRequest) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.withdrawWritOfExecControllerService.postValidateWithdrawWritOfExecInit(caseId, request)),
      {
        showDialogForSpecificCodes: this.withdrawnWritExecutionValidateCodes,
        notShowAsSnackBar: false,
      }
    );
  }

  async postWithdrawWritOfExecApproval(taskId: number, withdrawWritOfExecId: number, request: PostApprovalRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.withdrawWritOfExecControllerService.postWithdrawWritOfExecApproval(taskId, withdrawWritOfExecId, request)
      )
    );
  }

  async postWithdrawWritOfExecCancel(withdrawWritOfExecId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.withdrawWritOfExecControllerService.postWithdrawWritOfExecCancel(withdrawWritOfExecId))
    );
  }

  async postWithdrawWritOfExecCaseSubmit(caseId: number, taskId: number, request: PostSubmitRequest) {
    return await this.errorHandlingService.invokeNoRetry(
      () =>
        lastValueFrom(
          this.withdrawWritOfExecControllerService.postWithdrawWritOfExecCaseSubmit(caseId, taskId, request)
        ),
      {
        showDialogForSpecificCodes: this.withdrawnWritExecutionValidateCodes,
        notShowAsSnackBar: false,
      }
    );
  }

  async postWithdrawWritOfExecCommandAcceptionSubmit(
    taskId: number,
    withdrawWritOfExecId: number,
    request: PostCommandAcceptionSubmitRequest
  ) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.withdrawWritOfExecControllerService.postWithdrawWritOfExecCommandAcceptionSubmit(
          taskId,
          withdrawWritOfExecId,
          request
        )
      )
    );
  }

  async postWithdrawWritOfExecDocValidationSubmit(
    taskId: number,
    withdrawWritOfExecId: number,
    request: WritOfExecDocValidationRequest
  ) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.withdrawWritOfExecControllerService.postWithdrawWritOfExecDocValidationSubmit(
          taskId,
          withdrawWritOfExecId,
          request
        )
      )
    );
  }

  async postWithdrawWritOfExecResultSubmit(
    taskId: number,
    withdrawWritOfExecId: number,
    request: WritOfExecResultSubmitRequest
  ) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.withdrawWritOfExecControllerService.postWithdrawWritOfExecResultSubmit(
          taskId,
          withdrawWritOfExecId,
          request
        )
      )
    );
  }
}
