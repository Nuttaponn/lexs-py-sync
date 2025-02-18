import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailLitigationRoutingModule } from './detail-litigation-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigShareModule, SpigCoreModule } from '@spig/core';
import { DetailLitigationComponent } from './detail-litigation.component';
import { DashboardSubTabModule } from '../dashboard-sub-tab/dashboard-sub-tab.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';

@NgModule({
  declarations: [DetailLitigationComponent],
  imports: [
    CommonModule,
    DetailLitigationRoutingModule,
    SpigShareModule,
    SpigCoreModule,
    SharedModule,
    TranslateModule,
    PipesModule,
    DashboardSubTabModule,
  ],
})
export class DetailLitigationModule {}
