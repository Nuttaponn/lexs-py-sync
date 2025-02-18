import { Component, OnInit } from '@angular/core';
import { RouterService } from '@shared/services/router.service';
import { AuctionDetailItemPaymentResultService } from './auction-detail-item-payment-result.service';

@Component({
  selector: 'app-auction-detail-item-payment-result',
  templateUrl: './auction-detail-item-payment-result.component.html',
  styleUrls: ['./auction-detail-item-payment-result.component.scss'],
})
export class AuctionDetailItemPaymentResultComponent implements OnInit {
  public mode = '';

  constructor(
    private routerService: RouterService,
    private auctionDetailItemPaymentResultService: AuctionDetailItemPaymentResultService
  ) {}

  ngOnInit() {
    this.mode = this.auctionDetailItemPaymentResultService.mode;
  }

  onBack() {
    this.routerService.back();
  }
}
