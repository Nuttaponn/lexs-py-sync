import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionAppointmentDateDetailResolver } from './auction-appointment-date-detail.resolver';
import { AuctionAppointmentDateDetailComponent } from './auction-appointment-date-detail.component';
import { AuctionGuard } from '../../auction.guard';

const routes: Routes = [
  {
    path: '',
    component: AuctionAppointmentDateDetailComponent,
    resolve: {
      history: AuctionAppointmentDateDetailResolver,
    },
    canDeactivate: [AuctionGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuctionAppointmentDateDetailRoutingModule {}
