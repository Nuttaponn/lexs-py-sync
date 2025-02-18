import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { DocumentPreparationModule } from '../../document-preparation/document-preparation/document-preparation.module';

import { NoticeModule } from './notice/notice.module';
import { PrepareLawsuitRoutingModule } from './prepare-lawsuit-routing.module';
import { PrepareLawsuitComponent } from './prepare-lawsuit.component';

@NgModule({
  declarations: [PrepareLawsuitComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PrepareLawsuitRoutingModule,
    DocumentPreparationModule,
    NoticeModule,
  ],
  exports: [PrepareLawsuitComponent],
})
export class PrepareLawsuitModule {}
