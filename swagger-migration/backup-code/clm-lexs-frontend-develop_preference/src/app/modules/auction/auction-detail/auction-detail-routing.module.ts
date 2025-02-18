import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionDetailComponent } from './auction-detail.component';
import { AuctionDetailResolver } from './auction-detail.resolver';

const routes: Routes = [
  {
    path: '',
    component: AuctionDetailComponent,
    resolve: {
      auctionDetail: AuctionDetailResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuctionDetailRoutingModule {}
