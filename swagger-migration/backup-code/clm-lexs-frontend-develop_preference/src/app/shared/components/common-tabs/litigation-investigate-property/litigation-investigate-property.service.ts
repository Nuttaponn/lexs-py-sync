import { Injectable } from '@angular/core';
import { ERROR_CODE } from '@app/shared/constant';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import {
  AssetInvestigationControllerService,
  AssetInvestigationLitigationCaseCreateInfoResponse,
  AssetInvestigationLitigationCasesResponse,
} from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LitigationInvestigatePropertyService {
  constructor(
    private errorHandlingService: ErrorHandlingService,
    private assetInvestigationControllerService: AssetInvestigationControllerService
  ) {}

  async getAssetInvestigationLitigationCase(litigationId: string): Promise<AssetInvestigationLitigationCasesResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.assetInvestigationControllerService.getAssetInvestigationLitigationCases(litigationId))
    );
  }

  async getAssetInvestigationCreateInfo(
    litigationCaseId: number
  ): Promise<AssetInvestigationLitigationCaseCreateInfoResponse> {
    return await this.errorHandlingService.invokeNoRetry(
      () =>
        lastValueFrom(
          this.assetInvestigationControllerService.getAssetInvestigationLitigationCreateInfo(litigationCaseId)
        ),
      {
        showDialogForSpecificCodes: [ERROR_CODE.EAI004, ERROR_CODE.EAI005],
        notShowAsSnackBar: true,
      }
    );
  }
}
