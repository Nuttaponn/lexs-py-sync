import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { WithdrawnSeizurePropertyAssetListModule } from '../withdrawn-seizure-property-asset-list/withdrawn-seizure-property-asset-list.module';
import { WithdrawnSeizurePropertyCreateGroupRoutingModule } from './withdrawn-seizure-property-create-group-routing.module';
import { WithdrawnSeizurePropertyCreateGroupComponent } from './withdrawn-seizure-property-create-group.component';

@NgModule({
  declarations: [WithdrawnSeizurePropertyCreateGroupComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    WithdrawnSeizurePropertyAssetListModule,
    WithdrawnSeizurePropertyCreateGroupRoutingModule,
  ],
})
export class WithdrawnSeizurePropertyCreateGroupModule {}
