import { Component, OnInit } from '@angular/core';
import { RouterService } from '@app/shared/services/router.service';
import { AuctionBiddingResultResponse } from '@lexs/lexs-client';
import { AuctionService } from '../auction.service';

@Component({
  selector: 'app-auction-appointment-date',
  templateUrl: './auction-appointment-date.component.html',
  styleUrls: ['./auction-appointment-date.component.scss'],
})
export class AuctionAppointmentDateComponent implements OnInit {
  public isOpened: boolean = true;
  public messageBanner = '';
  public aucBiddingId!: any;
  public auctionBiddingResultResponseData!: AuctionBiddingResultResponse | undefined;
  constructor(
    private routerService: RouterService,
    private auctionService: AuctionService
  ) {}

  ngOnInit() {
    this.auctionBiddingResultResponseData = this.auctionService.auctionBiddingResultResponse;
  }

  onBack() {
    this.routerService.back();
  }
}
