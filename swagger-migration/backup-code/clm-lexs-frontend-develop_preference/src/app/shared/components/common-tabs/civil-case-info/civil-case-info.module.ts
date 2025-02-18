import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

import { CivilCaseInfoRoutingModule } from './civil-case-info-routing.module';
import { CivilCaseInfoComponent } from './civil-case-info.component';

@NgModule({
  declarations: [CivilCaseInfoComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, CivilCaseInfoRoutingModule],
})
export class CivilCaseInfoModule {}
