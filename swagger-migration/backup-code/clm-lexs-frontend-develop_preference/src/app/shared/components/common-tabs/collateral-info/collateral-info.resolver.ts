import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoggerService } from '@app/shared/services/logger.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { CollateralInfoService } from './collateral-info.service';

@Injectable({
  providedIn: 'root',
})
export class CollateralInfoResolver {
  constructor(
    private logger: LoggerService,
    private masterDataService: MasterDataService,
    private collateralInfoService: CollateralInfoService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    this.logger.logResolverStart('CollateralInfoResolver', route.queryParams);
    this.collateralInfoService.externalAssetStatus = await this.masterDataService.externalAssetStatus();
    this.collateralInfoService.collateralSubType = await this.masterDataService.collateralSubType();
    return true;
  }
}
