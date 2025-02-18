import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipeModule, SpigCoreModule, SpigShareModule } from '@spig/core';
import { WithdrawnSeizurePropertyAssetListModule } from '../withdrawn-seizure-property-asset-list/withdrawn-seizure-property-asset-list.module';
import { LegalExecutionOfficeWithdrawUnsuccessComponent } from './dialog/legal-execution-office-withdraw-unsuccess/legal-execution-office-withdraw-unsuccess.component';
import { LegalExecutionWithdrawConfirmationDialogComponent } from './dialog/legal-execution-withdraw-confirmation-dialog/legal-execution-withdraw-confirmation-dialog.component';
import { LegalExecutionOfficeInfoRoutingModule } from './legal-execution-office-info-routing.module';
import { LegalExecutionOfficeInfoComponent, SeizureReasonPipe } from './legal-execution-office-info.component';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [
    LegalExecutionOfficeInfoComponent,
    LegalExecutionOfficeWithdrawUnsuccessComponent,
    LegalExecutionWithdrawConfirmationDialogComponent,
    SeizureReasonPipe,
  ],
  providers: [DecimalPipe, provideNgxMask()],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    LegalExecutionOfficeInfoRoutingModule,
    WithdrawnSeizurePropertyAssetListModule,
    PipeModule,
    PipesModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
})
export class LegalExecutionOfficeInfoModule {}
