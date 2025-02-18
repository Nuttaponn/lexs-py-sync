import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { ExternalDocumentsRoutingModule } from './external-documents-routing.module';
import { ExternalDocumentsComponent } from './external-documents/external-documents.component';

@NgModule({
  declarations: [ExternalDocumentsComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    TranslateModule,
    PipesModule,
    ExternalDocumentsRoutingModule,
  ],
})
export class ExternalDocumentsModule {}
