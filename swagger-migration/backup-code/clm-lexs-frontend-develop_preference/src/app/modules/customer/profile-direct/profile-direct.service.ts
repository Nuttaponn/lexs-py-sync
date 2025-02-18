import { Injectable } from '@angular/core';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import {
  Account,
  BatchDataDto,
  BatchDataRequest,
  CommonResponse,
  PageOfBatchDataDto,
  ProfileDirectControllerService,
  ProfileDirectResponse,
} from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileDirectService {
  constructor(
    private errorHandlingService: ErrorHandlingService,
    private profileDirectControllerService: ProfileDirectControllerService
  ) {}

  async download(
    accountDataType: BatchDataDto.ProfileDirectTypeEnum,
    cifNo: string,
    accountNo?: string,
    litigationId?: string
  ): Promise<string> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.profileDirectControllerService.download(accountDataType, cifNo, accountNo, litigationId))
    );
  }

  async validateSaveBatchData(batchDataRequest: BatchDataRequest): Promise<CommonResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.profileDirectControllerService.validateSaveBatchData(batchDataRequest))
    );
  }

  async inquiryAccount(
    cifNo: string,
    accountDataType?: BatchDataDto.ProfileDirectTypeEnum,
    litigationId: string = ''
  ): Promise<Array<Account>> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.profileDirectControllerService.inquiryAccount(cifNo, accountDataType, litigationId))
    );
  }

  async inquiryBatchData(
    cifNo: string,
    litigationId?: string,
    page?: number,
    size?: number,
    type?: BatchDataDto.ProfileDirectTypeEnum
  ): Promise<PageOfBatchDataDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.profileDirectControllerService.inquiryBatchData(cifNo, litigationId, page, size, type))
    );
  }

  async inquiryProfileDirect(
    accountDataType: BatchDataDto.ProfileDirectTypeEnum,
    cifNo: string,
    accountNo?: string,
    litigationId?: string
  ): Promise<ProfileDirectResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.profileDirectControllerService.inquiryProfileDirect(accountDataType, cifNo, accountNo, litigationId)
      )
    );
  }

  async saveBatchData(batchDataRequest: BatchDataRequest): Promise<BatchDataDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.profileDirectControllerService.saveBatchData(batchDataRequest))
    );
  }
}
