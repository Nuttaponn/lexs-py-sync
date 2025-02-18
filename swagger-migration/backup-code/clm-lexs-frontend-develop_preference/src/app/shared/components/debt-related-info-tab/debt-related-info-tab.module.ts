import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { DebtRelatedInfoTabRoutingModule } from './debt-related-info-tab-routing.module';
import { AddRelatedPersonLawsuitComponent } from './debt-related-info-tab/add-related-person-lawsuit/add-related-person-lawsuit.component';
import { DebtRelatedInfoTabComponent } from './debt-related-info-tab/debt-related-info-tab.component';
import { EditRelatedPersonComponent } from './debt-related-info-tab/edit-related-person/edit-related-person.component';
import { RegisterAddressDialogComponent } from './debt-related-info-tab/register-address-dialog/register-address-dialog.component';
import { RemoveRelatedPersonLawsuitComponent } from './debt-related-info-tab/remove-related-person-lawsuit/remove-related-person-lawsuit.component';
import { WithdrawLawsuitDefendantDialogComponent } from './debt-related-info-tab/withdraw-lawsuit-defendant-dialog/withdraw-lawsuit-defendant-dialog.component';
import { ResonRejectDialogComponent } from './debt-related-info-tab/reson-reject-dialog/reson-reject-dialog.component';

@NgModule({
  declarations: [
    DebtRelatedInfoTabComponent,
    EditRelatedPersonComponent,
    AddRelatedPersonLawsuitComponent,
    RemoveRelatedPersonLawsuitComponent,
    RegisterAddressDialogComponent,
    WithdrawLawsuitDefendantDialogComponent,
    ResonRejectDialogComponent,
  ],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    DebtRelatedInfoTabRoutingModule,
  ],
  exports: [DebtRelatedInfoTabComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DebtRelatedInfoTabModule {}
