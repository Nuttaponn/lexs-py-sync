import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { WithdrawnSeizureContactComponent } from './withdrawn-seizure-contact/withdrawn-seizure-contact.component';
import { WithdrawnSeizurePropertyAssetListComponent } from './withdrawn-seizure-property-asset-list.component';
import { WithdrawnSeizurePropertyUploadDocumentComponent } from './withdrawn-seizure-property-upload-document/withdrawn-seizure-property-upload-document.component';

@NgModule({
  declarations: [
    WithdrawnSeizurePropertyAssetListComponent,
    WithdrawnSeizureContactComponent,
    WithdrawnSeizurePropertyUploadDocumentComponent,
  ],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, PipesModule],
  exports: [
    WithdrawnSeizurePropertyAssetListComponent,
    WithdrawnSeizureContactComponent,
    WithdrawnSeizurePropertyUploadDocumentComponent,
  ],
})
export class WithdrawnSeizurePropertyAssetListModule {}
