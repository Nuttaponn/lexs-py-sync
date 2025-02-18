import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionPropertyDetailComponent } from './auction-property-detail.component';
import { AuctionPropertyDetailResolver } from './auction-property-detail.resolver';
import { AuctionGuard } from '../../auction.guard';

const routes: Routes = [
  {
    path: '',
    component: AuctionPropertyDetailComponent,
    resolve: {
      propertyDetail: AuctionPropertyDetailResolver,
    },
    canDeactivate: [AuctionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuctionPropertyDetailRoutingModule {}
