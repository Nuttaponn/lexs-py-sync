import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EXECUTION_TABS_INFO } from '@app/shared/constant';
import { ExecutionInfoComponent } from './execution-info.component';
import { ExecutionInfoResolver } from './execution-info.resolver';

const routes: Routes = [
  {
    path: '',
    component: ExecutionInfoComponent,
    children: [
      {
        path: EXECUTION_TABS_INFO[0].path,
        loadChildren: () => import('./prepare-info/prepare-info.module').then(m => m.PrepareInfoModule),
      },
      {
        path: EXECUTION_TABS_INFO[1].path,
        loadChildren: () => import('./warrant-info/warrant-info.module').then(m => m.WarrantInfoModule),
      },
    ],
    resolve: {
      executioninfo: ExecutionInfoResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecutionInfoRoutingModule {}
