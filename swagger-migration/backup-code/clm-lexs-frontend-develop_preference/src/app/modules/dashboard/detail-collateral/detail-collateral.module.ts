import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailCollateralRoutingModule } from './detail-collateral-routing.module';
import { DetailCollateralComponent } from './detail-collateral.component';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigShareModule, SpigCoreModule } from '@spig/core';
import { DashboardSubTabModule } from '../dashboard-sub-tab/dashboard-sub-tab.module';

@NgModule({
  declarations: [DetailCollateralComponent],
  imports: [
    CommonModule,
    DetailCollateralRoutingModule,
    SpigShareModule,
    SpigCoreModule,
    SharedModule,
    TranslateModule,
    PipesModule,
    DashboardSubTabModule,
  ],
})
export class DetailCollateralModule {}
