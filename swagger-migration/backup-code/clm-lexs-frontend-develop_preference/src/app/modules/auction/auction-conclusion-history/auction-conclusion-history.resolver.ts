import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuctionService } from '../auction.service';

@Injectable({
  providedIn: 'root',
})
export class AuctionConclusionHistoryResolver {
  constructor(private auctionService: AuctionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const aucRef = route.queryParams['aucRef'] || '';
    this.auctionService.aucRef = aucRef;
    this.auctionService.auctionResolutionsHistory = await this.auctionService.getAuctionResolutionsHistory(aucRef);
    return true;
  }
}
