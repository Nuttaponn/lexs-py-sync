import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionAdvancePaymentComponent } from './auction-advance-payment/auction-advance-payment.component';

const routes: Routes = [
  {
    path: '',
    component: AuctionAdvancePaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuctionAdvancePaymentRoutingModule {}
