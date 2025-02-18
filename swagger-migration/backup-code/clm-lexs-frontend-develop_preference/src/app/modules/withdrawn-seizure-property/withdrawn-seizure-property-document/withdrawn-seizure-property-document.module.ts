import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { WithdrawnSeizurePropertyAssetListModule } from '../withdrawn-seizure-property-asset-list/withdrawn-seizure-property-asset-list.module';
import { WithdrawnSeizurePropertyDocumentRoutingModule } from './withdrawn-seizure-property-document-routing.module';
import { WithdrawnSeizurePropertyDocumentComponent } from './withdrawn-seizure-property-document.component';

@NgModule({
  declarations: [WithdrawnSeizurePropertyDocumentComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    WithdrawnSeizurePropertyAssetListModule,
    WithdrawnSeizurePropertyDocumentRoutingModule,
  ],
})
export class WithdrawnSeizurePropertyDocumentModule {}
