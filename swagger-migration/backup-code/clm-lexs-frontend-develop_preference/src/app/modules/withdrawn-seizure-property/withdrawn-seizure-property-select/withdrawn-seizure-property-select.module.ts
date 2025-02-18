import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { WithdrawnSeizurePropertyAssetListModule } from '../withdrawn-seizure-property-asset-list/withdrawn-seizure-property-asset-list.module';
import { WithdrawnSeizurePropertySelectRoutingModule } from './withdrawn-seizure-property-select-routing.module';
import { WithdrawnSeizurePropertySelectComponent } from './withdrawn-seizure-property-select.component';

@NgModule({
  declarations: [WithdrawnSeizurePropertySelectComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    WithdrawnSeizurePropertyAssetListModule,
    WithdrawnSeizurePropertySelectRoutingModule,
  ],
  exports: [RouterModule],
})
export class WithdrawnSeizurePropertySelectModule {}
