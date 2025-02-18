import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoggerService } from '@app/shared/services/logger.service';
import { LitigationCaseService } from '@shared/services/litigation-case.service';
import { WithdrawnSeizurePropertyService } from '../withdrawn-seizure-property.service';

@Injectable({
  providedIn: 'root',
})
export class WithdrawnSeizurePropertyReasonResolver {
  constructor(
    private logger: LoggerService,
    private litigationCaseService: LitigationCaseService,
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('WithdrawnSeizurePropertyReasonResolver');

    this.withdrawnSeizurePropertyService.withdrawnSeizureDetailForm =
      this.withdrawnSeizurePropertyService.getWithdrawnSeizureDetailForm(
        this.withdrawnSeizurePropertyService.withdrawSeizureResponse
      );
    this.litigationCaseService.litigationCaseShortDetail =
      await this.litigationCaseService.getLitigationCaseShortDetail(
        Number(this.withdrawnSeizurePropertyService.litigationCaseId)
      );
    this.logger.info('litigationCaseShortDetail :: ', this.litigationCaseService.litigationCaseShortDetail);
    this.logger.logResolverEnd('WithdrawnSeizurePropertyReasonResolver');
    return true;
  }
}
