import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { ExecutionWarrantRoutingModule } from './execution-warrant-routing.module';
import { ExecutionWarrantComponent } from './execution-warrant.component';

@NgModule({
  declarations: [ExecutionWarrantComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    ExecutionWarrantRoutingModule,
  ],
})
export class ExecutionWarrantModule {}
