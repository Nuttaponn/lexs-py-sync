import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatStepperModule } from '@angular/material/stepper';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { WithdrawnSeizureAddContactDialogComponent } from './dialogs/withdrawn-seizure-add-contact-dialog/withdrawn-seizure-add-contact-dialog.component';
import { WithdrawnSeizureAddPropertyDialogComponent } from './dialogs/withdrawn-seizure-add-property-dialog/withdrawn-seizure-add-property-dialog.component';
import { WithdrawnSeizurePropertyConfirmDialogComponent } from './dialogs/withdrawn-seizure-property-confirm-dialog/withdrawn-seizure-property-confirm-dialog.component';
import { WithdrawnSeizurePropertyMoveDialogComponent } from './dialogs/withdrawn-seizure-property-move-dialog/withdrawn-seizure-property-move-dialog.component';
import { WithdrawnSeizurePropertyAssetListModule } from './withdrawn-seizure-property-asset-list/withdrawn-seizure-property-asset-list.module';
import { WithdrawnSeizurePropertyRoutingModule } from './withdrawn-seizure-property-routing.module';
import { WithdrawnSeizurePropertyComponent } from './withdrawn-seizure-property.component';

@NgModule({
  declarations: [
    WithdrawnSeizurePropertyComponent,
    WithdrawnSeizureAddPropertyDialogComponent,
    WithdrawnSeizureAddContactDialogComponent,
    WithdrawnSeizurePropertyMoveDialogComponent,
    WithdrawnSeizurePropertyConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    WithdrawnSeizurePropertyRoutingModule,
    WithdrawnSeizurePropertyAssetListModule,
    MatStepperModule,
    PipesModule,
  ],
})
export class WithdrawnSeizurePropertyModule {}
