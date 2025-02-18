import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefermentDebtSummaryRoutingModule } from './deferment-debt-summary-routing.module';
import { DefermentDebtSummaryComponent } from './deferment-debt-summary.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { DefermentDetailSubComponent } from '../deferment-detail-sub/deferment-detail-sub.component';
@NgModule({
  declarations: [DefermentDebtSummaryComponent, DefermentDetailSubComponent],
  imports: [
    CommonModule,
    DefermentDebtSummaryRoutingModule,
    TranslateModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
  ],
})
export class DefermentDebtSummaryModule {}
