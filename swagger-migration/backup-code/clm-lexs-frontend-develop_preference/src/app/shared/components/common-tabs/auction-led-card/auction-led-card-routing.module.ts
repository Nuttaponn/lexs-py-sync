import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionLEDCardComponent } from './auction-led-card.component';

const routes: Routes = [
  {
    path: '',
    component: AuctionLEDCardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuctionLedCardRoutingModule {}
