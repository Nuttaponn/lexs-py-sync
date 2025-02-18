import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SeizurePropertyInfoModule } from '@app/shared/components/common-tabs/seizure-property-info/seizure-property-info.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { WithdrawnSeizurePropertyAssetListModule } from '../withdrawn-seizure-property/withdrawn-seizure-property-asset-list/withdrawn-seizure-property-asset-list.module';
import { DefermentDashboardComponent } from './deferment-dashboard/deferment-dashboard.component';
import { DefermentDetailComponent, TotalDebtAmountPipe } from './deferment-detail/deferment-detail.component';
import { DefermenRoutingModule } from './deferment-routing.module';
import { DefermentStatementsComponent } from './deferment-statements/deferment-statements.component';
import { DefermentComponent } from './deferment.component';
import { DefermentInfoComponent } from './deferment-info/deferment-info.component';

@NgModule({
  declarations: [
    DefermentComponent,
    DefermentDetailComponent,
    TotalDebtAmountPipe,
    DefermentDashboardComponent,
    DefermentStatementsComponent,
    DefermentInfoComponent,
  ],
  exports: [DefermentDetailComponent],
  imports: [
    CommonModule,
    DefermenRoutingModule,
    TranslateModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    PipesModule,
    WithdrawnSeizurePropertyAssetListModule,
    SeizurePropertyInfoModule,
  ],
})
export class DefermentModule {}
