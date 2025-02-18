import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationResolver } from '@app/modules/configuration/configuration.resolver';
import { EfilingFormComponent } from '@app/modules/lawsuit/lawsuit-detail/suit/efiling-form/efiling-form.component';
import { IndictmentMainComponent } from '@app/modules/lawsuit/lawsuit-detail/suit/indictment-main/indictment-main.component';
import { SuitResolver } from '@app/modules/lawsuit/lawsuit-detail/suit/suit.resolver';
import { IndictmentGuard } from '../guards/indictment.guard';
import { TaskGuard } from '../guards/task.guard';
import { TaskResolver } from '../task.resolver';
import { CourtFeeFormComponent } from './../../lawsuit/lawsuit-detail/suit/court-fee-form/court-fee-form.component';
import { TaskDetailComponent } from './task-detail.component';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailComponent,
    canDeactivate: [TaskGuard],
    resolve: {
      taskMode: TaskResolver,
      configResolver: ConfigurationResolver,
    },
  },
  {
    path: 'suit-indictment',
    canDeactivate: [IndictmentGuard],
    component: IndictmentMainComponent,
    resolve: {
      litigationCase: SuitResolver,
    },
  },
  {
    path: 'efiling-form',
    canDeactivate: [IndictmentGuard],
    data: {
      isFromRefLink: false,
    },
    component: EfilingFormComponent,
  },
  {
    path: 'court-fee-form',
    canDeactivate: [IndictmentGuard],
    component: CourtFeeFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDetailRoutingModule {}
