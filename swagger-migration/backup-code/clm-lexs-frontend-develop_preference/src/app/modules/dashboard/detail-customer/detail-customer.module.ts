import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailCustomerRoutingModule } from './detail-customer-routing.module';
import { DetailCustomerComponent } from './detail-customer.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigShareModule, SpigCoreModule } from '@spig/core';
import { DashboardTabComponent } from '../dashboard-tab/dashboard-tab.component';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { DashboardSubTabModule } from '../dashboard-sub-tab/dashboard-sub-tab.module';

@NgModule({
  declarations: [DetailCustomerComponent, DashboardTabComponent],
  imports: [
    CommonModule,
    DetailCustomerRoutingModule,
    SpigShareModule,
    SpigCoreModule,
    SharedModule,
    TranslateModule,
    PipesModule,
    DashboardSubTabModule,
  ],
})
export class DetailCustomerModule {}
