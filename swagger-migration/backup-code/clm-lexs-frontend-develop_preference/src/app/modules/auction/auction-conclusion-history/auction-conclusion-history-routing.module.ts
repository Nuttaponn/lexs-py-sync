import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionConclusionHistoryComponent } from './auction-conclusion-history.component';
import { AuctionConclusionHistoryResolver } from './auction-conclusion-history.resolver';
import { AuctionGuard } from '../auction.guard';
const routes: Routes = [
  {
    path: '',
    component: AuctionConclusionHistoryComponent,
    resolve: {
      history: AuctionConclusionHistoryResolver,
    },
    canDeactivate: [AuctionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuctionConclusionHistoryRoutingModule {}
