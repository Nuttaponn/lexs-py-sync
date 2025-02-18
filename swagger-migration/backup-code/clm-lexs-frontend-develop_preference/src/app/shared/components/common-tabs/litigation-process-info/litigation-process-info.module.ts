import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

import { LitigationProcessInfoRoutingModule } from './litigation-process-info-routing.module';
import { LitigationProcessInfoComponent } from './litigation-process-info.component';

@NgModule({
  declarations: [LitigationProcessInfoComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    LitigationProcessInfoRoutingModule,
  ],
})
export class LitigationProcessInfoModule {}
