import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoggerService } from '@app/shared/services/logger.service';
import { WithdrawnSeizurePropertyService } from '../withdrawn-seizure-property.service';

@Injectable({
  providedIn: 'root',
})
export class WithdrawnSeizurePropertyDocumentResolver {
  constructor(
    private logger: LoggerService,
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService
  ) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('WithdrawnSeizurePropertySelectResolver');
    const withdrawSeizureId = Number(this.withdrawnSeizurePropertyService.withdrawSeizureId);
    this.withdrawnSeizurePropertyService.withdrawSeizurePropertyCreateData = {};
    this.withdrawnSeizurePropertyService.withdrawSeizureResponse =
      await this.withdrawnSeizurePropertyService.getWithdrawSeizures(withdrawSeizureId);
    return true;
  }
}
