import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

import { ExecutionInfoRoutingModule } from './execution-info-routing.module';
import { ExecutionInfoComponent } from './execution-info.component';

@NgModule({
  declarations: [ExecutionInfoComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, ExecutionInfoRoutingModule],
})
export class ExecutionInfoModule {}
