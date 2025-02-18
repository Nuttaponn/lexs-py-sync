import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoggerService } from '@app/shared/services/logger.service';
import { WithdrawnSeizurePropertyService } from '../withdrawn-seizure-property.service';

@Injectable({
  providedIn: 'root',
})
export class AssetsContactsInfoResolver {
  constructor(
    private logger: LoggerService,
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('AssetsContactsInfoResolver');
    const withdrawSeizureId = Number(this.withdrawnSeizurePropertyService.withdrawSeizureId);
    this.withdrawnSeizurePropertyService.withdrawSeizureResponse =
      await this.withdrawnSeizurePropertyService.getWithdrawSeizures(withdrawSeizureId);
    this.logger.logResolverEnd('AssetsContactsInfoResolver');
    return true;
  }
}
