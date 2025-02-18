import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { CaseDetailsComponent } from './case-details.component';

@NgModule({
  declarations: [CaseDetailsComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, PipesModule],
  exports: [CaseDetailsComponent],
})
export class CaseDetailsModule {}
