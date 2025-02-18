import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuctionService } from '../auction.service';

@Injectable({
  providedIn: 'root',
})
export class AuctionAppointmentDateResolver {
  constructor(private auctionService: AuctionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const aucBiddingId = route.queryParams['aucBiddingId'];
    this.auctionService.auctionBiddingResultResponse =
      await this.auctionService.getAuctionBiddingResultResponse(aucBiddingId);
    return true;
  }
}
