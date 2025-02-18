import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestigatePropertyRoutingModule } from './investigate-property-routing.module';
import { InvestigatePropertyDetailComponent } from './investigate-property-detail/investigate-property-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { SharedModule } from '@app/shared/shared.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { InvestigatePropertyResultsComponent } from './investigate-property-results/investigate-property-results.component';
import { InvestigatePropertyResultsTableComponent } from './investigate-property-results-table/investigate-property-results-table.component';
import { InvestigatePropertyComponent } from '@modules/investigate-property/investigate-property.component';
import { InvestigatePropertyDocumentsListComponent } from '@modules/investigate-property/investigate-property-documents-list/investigate-property-documents-list.component';
import { InvestigatePropertyCommandComponent } from './investigate-property-command/investigate-property-command.component';
import { CaseDetailsModule } from '@shared/components/case-details/case-details.module';
import { AuctionModule } from '../auction/auction.module';
import { AssetOwnerPipe } from './asset-owner.pipe';

@NgModule({
  declarations: [
    InvestigatePropertyDetailComponent,
    InvestigatePropertyResultsComponent,
    InvestigatePropertyResultsTableComponent,
    InvestigatePropertyComponent,
    InvestigatePropertyDocumentsListComponent,
    InvestigatePropertyCommandComponent,
    AssetOwnerPipe,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    PipesModule,
    InvestigatePropertyRoutingModule,
    CaseDetailsModule,
    AuctionModule,
  ],
})
export class InvestigatePropertyModule {}
