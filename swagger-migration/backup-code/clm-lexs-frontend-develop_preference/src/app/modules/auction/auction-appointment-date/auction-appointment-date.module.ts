import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuctionAppointmentDateRoutingModule } from './auction-appointment-date-routing.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AuctionAppointmentDateComponent } from './auction-appointment-date.component';
import { AuctionAppointmentDateTableComponent } from './auction-appointment-date-table/auction-appointment-date-table.component';

@NgModule({
  declarations: [AuctionAppointmentDateComponent, AuctionAppointmentDateTableComponent],
  imports: [
    CommonModule,
    AuctionAppointmentDateRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
  ],
})
export class AuctionAppointmentDateModule {}
