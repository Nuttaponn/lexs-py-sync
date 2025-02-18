import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuctionService } from '../../auction.service';

@Injectable({
  providedIn: 'root',
})
export class AuctionAppointmentDateDetailResolver {
  constructor(private auctionService: AuctionService) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const deedGroupId = route.queryParams['deedGroupId'];
    const aucBiddingId = route.queryParams['aucBiddingId'];
    const aucBiddingDeedGroupId = route.queryParams['aucBiddingDeedGroupId'];

    this.auctionService.auctionBiddingDeedGroupResponse = await this.auctionService.getAuctionBiddingDeedGroup(
      aucBiddingId,
      deedGroupId
    );
    this.auctionService.auctionResultCollateral = await this.auctionService.getInquiryLatestResolutionInfo(deedGroupId);

    const aucRef = this.auctionService.auctionBiddingDeedGroupResponse.aucRef;
    this.auctionService.auctionInquiryBiddingCollaterals = await this.auctionService.getInquiryBiddingCollaterals(
      aucRef || 0
    );
    if (this.auctionService.auctionBiddingDeedGroupResponse?.aucBiddingResult?.requireReturnDocument) {
      const chequeInfoRespons = await this.auctionService.getChequeInfo(deedGroupId, 'collaterals');
      this.auctionService.auctionBidingChequeInfoItem = chequeInfoRespons[0] || null;
    }
    if (aucBiddingDeedGroupId) {
      const externalPaymentTrackingLatest =
        await this.auctionService.getExternalPaymentTrackingDeedGroupLatest(aucBiddingDeedGroupId);
      this.auctionService.externalPaymentTrackingLatest = externalPaymentTrackingLatest || null;
    }
    return true;
  }
}
