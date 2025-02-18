import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuctionService } from '../../auction.service';

@Injectable({
  providedIn: 'root',
})
export class AuctionPropertyDetailResolver {
  constructor(private auctionService: AuctionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const fsubbidnum = route.queryParams['fsubbidnum'];
    const aucRef = route.queryParams['aucRef'];
    const npaStatus = route.queryParams['npaStatus'];
    this.auctionService.auctionInquiryBiddingCollaterals =
      await this.auctionService.getInquiryBiddingCollaterals(aucRef);
    this.auctionService.npaStatus = npaStatus;
    this.auctionService.aucRef = aucRef;
    this.auctionService.fsubbidnum = fsubbidnum;
    return true;
  }
}
