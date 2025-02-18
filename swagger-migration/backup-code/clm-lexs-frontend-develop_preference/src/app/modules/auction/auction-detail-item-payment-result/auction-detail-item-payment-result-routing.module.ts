import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionDetailItemPaymentResultComponent } from './auction-detail-item-payment-result.component';
import { AuctionDetailItemPaymentResultResolver } from './auction-detail-item-payment-result.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { Auction: AuctionDetailItemPaymentResultResolver },
    component: AuctionDetailItemPaymentResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuctionDetailItemPaymentResultRoutingModule {}
