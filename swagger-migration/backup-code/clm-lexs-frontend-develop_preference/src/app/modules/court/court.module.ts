import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { CourtDetailComponent } from './court-detail/court-detail.component';
import { CourtResultComponent } from './court-result/court-result.component';
import { CourtRoutingModule } from './court-routing.module';
import { CourtVerdictDetailComponent } from './court-verdict-detail/court-verdict-detail.component';
import { CourtComponent } from './court/court.component';
import { CustomerOrganizationComponent } from './customer-organization/customer-organization.component';
import { DecreeDetailComponent } from './decree-detail/decree-detail.component';
import { DefendantTableComponent } from './defendant-table/defendant-table.component';
import { DisputeDetailComponent } from './dispute-detail/dispute-detail.component';
import { ExecutionDetailComponent } from './execution-detail/execution-detail.component';
import { ExecutionFeeDialogComponent } from './execution-fee-dialog/execution-fee-dialog.component';
import { ExecutionReceiptUploadComponent } from './execution-receipt-upload/execution-receipt-upload.component';
import { ExtendDialogComponent } from './extend-dialog/extend-dialog.component';

@NgModule({
  declarations: [
    CourtComponent,
    CourtVerdictDetailComponent,
    CourtResultComponent,
    CourtDetailComponent,
    DisputeDetailComponent,
    CustomerOrganizationComponent,
    ExtendDialogComponent,
    ExecutionFeeDialogComponent,
    ExecutionReceiptUploadComponent,
    DefendantTableComponent,
    DecreeDetailComponent,
    ExecutionDetailComponent,
  ],
  imports: [
    CourtRoutingModule,
    CommonModule,
    TranslateModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    PipesModule,
  ],
  exports: [CourtComponent, CourtResultComponent, CustomerOrganizationComponent],
  providers: [DecimalPipe],
})
export class CourtModule {}
