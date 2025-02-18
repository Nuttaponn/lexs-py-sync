import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecutionCaseInfoComponent } from './execution-case-info.component';
import { ExecutionCaseInfoResolver } from './execution-case-info.resolver';

const routes: Routes = [
  {
    path: '',
    component: ExecutionCaseInfoComponent,
    resolve: {
      executionCaseInfo: ExecutionCaseInfoResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecutionCaseInfoRoutingModule {}
