import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

import { PipesModule } from '@app/shared/pipes/pipes.module';
import { AnnouncePropertyListComponent } from './announce-property-list/announce-property-list.component';
import { SeizurePropertyInfoRoutingModule } from './seizure-property-info-routing.module';
import { SeizurePropertyInfoComponent } from './seizure-property-info.component';
import { SeizurePropertyListComponent } from './seizure-property-list/seizure-property-list.component';
import { CheckboxDialogTableComponent } from './checkbox-dialog-table/checkbox-dialog-table.component';
import { AucAnnounementCollateralSetDialogComponent } from './auc-announement-collateral-set-dialog/auc-announement-collateral-set-dialog.component';

@NgModule({
  declarations: [
    SeizurePropertyInfoComponent,
    SeizurePropertyListComponent,
    AnnouncePropertyListComponent,
    CheckboxDialogTableComponent,
    AucAnnounementCollateralSetDialogComponent,
  ],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    SeizurePropertyInfoRoutingModule,
    PipesModule,
  ],
  exports: [SeizurePropertyListComponent, AnnouncePropertyListComponent],
})
export class SeizurePropertyInfoModule {}
