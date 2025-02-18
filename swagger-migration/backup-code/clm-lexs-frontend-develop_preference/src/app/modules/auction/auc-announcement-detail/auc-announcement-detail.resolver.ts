import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuctionService } from '../auction.service';

@Injectable({
  providedIn: 'root',
})
export class AucAnnouncementDetailResolver {
  constructor(private auctionService: AuctionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const detail = this.auctionService.selectAnouncementDetail;
    const response = await this.auctionService.getAuctionCollateral(Number(detail?.aucRef));
    this.auctionService.auctionCollaterals = response;
    return true;
  }
}
