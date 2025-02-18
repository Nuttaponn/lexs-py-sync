import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CaseDetailsModule } from '@app/shared/components/case-details/case-details.module';
import { DocumentPreparationModule } from '@app/shared/components/document-preparation/document-preparation/document-preparation.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { SeizureDocumentInfoRoutingModule } from './seizure-document-info-routing.module';
import { SeizureDocumentInfoComponent } from './seizure-document-info.component';

@NgModule({
  declarations: [SeizureDocumentInfoComponent],
  imports: [
    CommonModule,
    SeizureDocumentInfoRoutingModule,
    SharedModule,
    SpigCoreModule,
    CaseDetailsModule,
    DocumentPreparationModule,
    TranslateModule,
    SpigShareModule,
    PipesModule,
  ],
})
export class SeizureDocumentInfoModule {}
