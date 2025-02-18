import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuctionService } from '../auction.service';

@Injectable({
  providedIn: 'root',
})
export class AucAnnounementMapCollateralResolver {
  constructor(private auctionService: AuctionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.auctionService.sourceCollaralId = route.queryParams['collateralId'] || '';
    this.auctionService.isReselectCollateral = route.queryParams['isReselectCollateral'] || false;
    const aucRef = Number(this.auctionService?.auctionCollateralToVerify?.aucRef);
    const litigationCaseId = Number(this.auctionService?.auctionCollateralToVerify?.litigationCaseId);
    const ledId = Number(this.auctionService?.auctionCollateralToVerify?.lexsLedId);
    const response = await this.auctionService.getInquirySeizureInfo(aucRef, ledId, litigationCaseId);
    this.auctionService.auctionLexsCollateralResponse = response;
    return true;
  }
}
