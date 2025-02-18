import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { LoggerService } from '@shared/services/logger.service';
import { AuctionService } from '@modules/auction/auction.service';
import { AuctionDetailItemPaymentResultService } from './auction-detail-item-payment-result.service';

@Injectable({
  providedIn: 'root',
})
export class AuctionDetailItemPaymentResultResolver {
  constructor(
    private logger: LoggerService,
    private aucDetailItemService: AuctionDetailItemPaymentResultService,
    private auctionService: AuctionService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('AuctionDetailItemResolver');
    const deedGroupId = route.queryParams['deedGroupId'];
    const aucBiddingId = route.queryParams['aucBiddingId'];
    const aucRef = route.queryParams['aucRef'];
    this.aucDetailItemService.mode = route.queryParams['mode'];
    console.log('deedGroupId', deedGroupId);
    console.log('aucBiddingId', aucBiddingId);
    console.log('aucRef', aucRef);
    console.log(' this.aucDetailItemService.mode ', this.aucDetailItemService.mode);
    this.auctionService.auctionBiddingDeedGroupResponse = await this.auctionService.getAuctionBiddingDeedGroup(
      aucBiddingId,
      deedGroupId
    );
    this.auctionService.auctionResultCollateral = await this.auctionService.getInquiryLatestResolutionInfo(deedGroupId);
    this.auctionService.auctionInquiryBiddingCollaterals = await this.auctionService.getInquiryBiddingCollaterals(
      aucRef || 0
    );
    this.auctionService.auctionResultCollateral = await this.auctionService.getInquiryLatestResolutionInfo(deedGroupId);

    return true;
  }
}
