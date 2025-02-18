// import { ResolveFn } from '@angular/router';

import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { NewAuctionService } from "../auction-add/new-auction.service";
import { Injectable } from "@angular/core";
import { AuctionService } from "../auction.service";

// export const AuctionManualAnnouncementResolver: ResolveFn<boolean> = (route, state) => {
//   return true;
// };

// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { AuctionService } from '../auction.service';

@Injectable({
  providedIn: 'root',
})
export class AuctionManualAnnouncementResolver {
  constructor(
    private newAuctionService: NewAuctionService,
    // private auctionService: AuctionService,
  ) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    /* move to auction.resolver.ts
    TODO: remove after passed LEX2-44654 and MVP3 sprint 1
    try {
      await this.newAuctionService.setNewAuctionServiceData();
      return true;
    } catch (error) {
      console.error('AuctionManualAnnouncementResolver error', error);
      return false;
    }
    */
   return true
  }
}
