import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuctionService } from '../auction.service';

@Injectable({
  providedIn: 'root',
})
export class AucAnnounementMatchResolver {
  constructor(private auctionService: AuctionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const response = await this.auctionService.getAuctionLexsSeizures();
    this.auctionService.auctionLexsSeizures = response;

    return true;
  }
}
