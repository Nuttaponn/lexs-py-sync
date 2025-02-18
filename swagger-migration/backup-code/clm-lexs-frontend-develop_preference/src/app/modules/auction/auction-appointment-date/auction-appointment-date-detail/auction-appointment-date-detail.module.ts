import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuctionAppointmentDateDetailRoutingModule } from './auction-appointment-date-detail-routing.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AuctionModule } from '../../auction.module';
import { AuctionAppointmentDateDetailComponent } from './auction-appointment-date-detail.component';
@NgModule({
  declarations: [AuctionAppointmentDateDetailComponent],
  imports: [
    CommonModule,
    AuctionAppointmentDateDetailRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
    AuctionModule,
  ],
})
export class AuctionAppointmentDateDetailModule {}
