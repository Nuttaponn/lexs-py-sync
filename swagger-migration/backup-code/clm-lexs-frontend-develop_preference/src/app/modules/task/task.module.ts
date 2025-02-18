import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';

import { TransferDialogComponent } from '@app/shared/components/common-dialogs/transfer-dialog/transfer-dialog.component';
import { TransferReasonDialogComponent } from '@app/shared/components/common-dialogs/transfer-reason-dialog/transfer-reason-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TaskActionBtnPipe } from './task-action-btn.pipe';
import { TaskDetailModule } from './task-detail/task-detail.module';
import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task/task.component';
import { PreferenceModule } from '../preference/preference.module';
@NgModule({
  declarations: [TaskComponent, TransferDialogComponent, TransferReasonDialogComponent, TaskActionBtnPipe],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TaskRoutingModule,
    TranslateModule,
    SharedModule,
    TaskDetailModule,
    PipesModule,
    PreferenceModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TaskModule {}
