import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionPropertySetBuyerComponent } from './auction-property-set-buyer.component';

const routes: Routes = [
  {
    path: '',
    component: AuctionPropertySetBuyerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuctionPropertySetBuyerRoutingModule {}
