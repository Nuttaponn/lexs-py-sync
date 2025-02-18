import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { CaseInfoRoutingModule } from './case-info-routing.module';
import { CaseInfoComponent } from './case-info.component';

@NgModule({
  declarations: [CaseInfoComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, CaseInfoRoutingModule],
  exports: [CaseInfoComponent],
})
export class CaseInfoModule {}
