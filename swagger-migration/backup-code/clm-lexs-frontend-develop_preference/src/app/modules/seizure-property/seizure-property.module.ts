import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CaseDetailsModule } from '@app/shared/components/case-details/case-details.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

import { ResponsibleLawyerModule } from '@app/shared/components/responsible-lawyer/responsible-lawyer.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { AddLegalExecutionDepartmentComponent } from './dialogs/add-legal-execution-department/add-legal-execution-department.component';
import { AddNewCollateralComponent } from './dialogs/add-new-collateral/add-new-collateral.component';
import { ReasonComponent } from './dialogs/reason/reason.component';
import { SeizureUploadDialogReceiptComponent } from './dialogs/seizure-upload-dialog/seizure-upload-dialog-receipt/seizure-upload-dialog-receipt.component';
import { SeizureUploadDialogComponent } from './dialogs/seizure-upload-dialog/seizure-upload-dialog.component';
import { SeizurePropertyRoutingModule } from './seizure-property-routing.module';
import { SeizurePropertyViewComponent } from './seizure-property-view/seizure-property-view.component';
import { SeizurePropertyComponent } from './seizure-property.component';
import { SeizureUploadReceiptComponent } from './seizure-upload-receipt/seizure-upload-receipt.component';
import { SeizureUploadReceiptDetailComponent } from './seizure-upload-receipt-detail/seizure-upload-receipt-detail.component';
import { NonPledgePropertiesDocumentComponent } from './non-pledge-properties-document/non-pledge-properties-document.component';
import { AuctionModule } from '../auction/auction.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [
    SeizurePropertyComponent,
    AddLegalExecutionDepartmentComponent,
    SeizureUploadDialogComponent,
    SeizureUploadDialogReceiptComponent,
    SeizurePropertyViewComponent,
    AddNewCollateralComponent,
    ReasonComponent,
    SeizureUploadReceiptComponent,
    SeizureUploadReceiptDetailComponent,
    NonPledgePropertiesDocumentComponent,
  ],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    CaseDetailsModule,
    ResponsibleLawyerModule,
    SeizurePropertyRoutingModule,
    PipesModule,
    AuctionModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask()],
})
export class SeizurePropertyModule {}
