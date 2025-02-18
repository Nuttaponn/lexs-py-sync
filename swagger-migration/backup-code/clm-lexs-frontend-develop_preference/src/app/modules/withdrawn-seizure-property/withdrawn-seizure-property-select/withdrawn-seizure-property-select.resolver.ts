import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { WithdrawnSeizurePropertyService } from '../withdrawn-seizure-property.service';
import { LitigationCasePersonsDto } from '@lexs/lexs-client';

@Injectable({
  providedIn: 'root',
})
export class WithdrawnSeizurePropertySelectResolver {
  private isSkipUpdate!: boolean;
  constructor(
    private logger: LoggerService,
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService,
    private litigationCaseService: LitigationCaseService
  ) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('WithdrawnSeizurePropertySelectResolver');
    this.isSkipUpdate = route.queryParams['skipUpdate'];
    const withdrawSeizureId = Number(this.withdrawnSeizurePropertyService.withdrawSeizureId || 0);
    const litigationCaseId = Number(this.withdrawnSeizurePropertyService.litigationCaseId);
    if (!this.isSkipUpdate) {
      const allResponse = await Promise.all([
        this.litigationCaseService.getLitigationCasePersons(litigationCaseId),
        this.withdrawnSeizurePropertyService.getLitigationCaseCollateral(litigationCaseId),
        this.withdrawnSeizurePropertyService.getWithdrawSeizures(withdrawSeizureId),
      ]);
      this.withdrawnSeizurePropertyService.litigationCasePersons = allResponse[0];
      this.withdrawnSeizurePropertyService.litigationCaseCollaterals = allResponse[1];
      this.withdrawnSeizurePropertyService.withdrawSeizureResponse = allResponse[2];
      this.withdrawnSeizurePropertyService.withdrawSeizureAssetsResponse =
        await this.withdrawnSeizurePropertyService.getWithdrawSeizureAssets(litigationCaseId);
    }

    this.withdrawnSeizurePropertyService.propertyForm = this.withdrawnSeizurePropertyService.getPropertyForm();

    return true;
  }
}
