import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CourtModule } from '@app/modules/court/court.module';
import { CustomerModule } from '@app/modules/customer/customer.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AddRelatedPersonLegalComponent } from './add-related-person-legal/add-related-person-legal.component';
import { LawsuitDetailRoutingModule } from './lawsuit-detail-routing.module';
import { LawsuitDetailComponent } from './lawsuit-detail.component';
import { CourtFeeFormComponent } from './suit/court-fee-form/court-fee-form.component';
import { UploadFileAmountTableV2Component } from './suit/upload-file-amount-table-v2/upload-file-amount-table-v2.component';

@NgModule({
  declarations: [
    LawsuitDetailComponent,
    CourtFeeFormComponent,
    AddRelatedPersonLegalComponent,
    UploadFileAmountTableV2Component,
  ],
  imports: [
    CommonModule,
    LawsuitDetailRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    CustomerModule,
    CourtModule,
  ],
  exports: [CourtFeeFormComponent],
})
export class LawsuitDetailModule {}
