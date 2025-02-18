import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { WithdrawnSeizurePropertyAssetListModule } from '../withdrawn-seizure-property-asset-list/withdrawn-seizure-property-asset-list.module';
import { AssetsContactsInfoRoutingModule } from './assets-contacts-info-routing.module';
import { AssetsContactsInfoComponent } from './assets-contacts-info.component';

@NgModule({
  declarations: [AssetsContactsInfoComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    AssetsContactsInfoRoutingModule,
    WithdrawnSeizurePropertyAssetListModule,
  ],
})
export class AssetsContactsInfoModule {}
