import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskPoolRoutingModule } from './task-pool-routing.module';
import { TaskPoolComponent } from './task-pool.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
@NgModule({
  declarations: [TaskPoolComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    TaskPoolRoutingModule,
    PipesModule,
  ],
})
export class TaskPoolModule {}
