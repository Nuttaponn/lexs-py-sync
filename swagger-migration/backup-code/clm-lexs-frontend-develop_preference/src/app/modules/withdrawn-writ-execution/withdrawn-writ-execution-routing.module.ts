import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WithdrawnWritExecutionComponent } from './withdrawn-writ-execution.component';
import { WithdrawnWritExecutionGuard } from './withdrawn-writ-execution.guard';
import { WithdrawnWritExecutionResolver } from './withdrawn-writ-execution.resolver';

const routes: Routes = [
  {
    path: '',
    component: WithdrawnWritExecutionComponent,
    canDeactivate: [WithdrawnWritExecutionGuard],
    resolve: {
      withdrawnWritExecution: WithdrawnWritExecutionResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WithdrawnWritExecutionRoutingModule {}
