import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionAppointmentDateResolver } from './auction-appointment-date.resolver';
import { AuctionAppointmentDateComponent } from './auction-appointment-date.component';
import { AuctionGuard } from '../auction.guard';

const routes: Routes = [
  {
    path: '',
    component: AuctionAppointmentDateComponent,
    resolve: {
      date: AuctionAppointmentDateResolver,
    },
    canDeactivate: [AuctionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuctionAppointmentDateRoutingModule {}
