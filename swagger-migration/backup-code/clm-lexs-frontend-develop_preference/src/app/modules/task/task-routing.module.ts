import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDataResolver } from '@app/shared/resolvers/user-data.resolver';
import { TaskGuard } from './guards/task.guard';
import { TaskResolver } from './task.resolver';
import { TaskComponent } from './task/task.component';
import { PreferenceDetailComponent } from '../preference/preference-detail/preference-detail.component';
import { PreferenceGuard } from '../preference/preference.guard';
import { PreferenceResolver } from '../preference/preference.resolver';

const routes: Routes = [
  {
    path: '',
    component: TaskComponent,
    canDeactivate: [TaskGuard],
    resolve: {
      taskMode: UserDataResolver,
    },
  },
  {
    path: 'pool',
    loadChildren: () => import('./task-pool/task-pool.module').then(m => m.TaskPoolModule),
  },
  {
    path: 'detail',
    loadChildren: () => import('./task-detail/task-detail.module').then(m => m.TaskDetailModule),
  },
  {
    path: 'execution-warrant',
    loadChildren: () => import('../execution-warrant/execution-warrant.module').then(m => m.ExecutionWarrantModule),
    resolve: {
      taskMode: TaskResolver,
    },
  },
  {
    path: 'seizure-property',
    loadChildren: () => import('../seizure-property/seizure-property.module').then(m => m.SeizurePropertyModule),
    resolve: {
      taskMode: TaskResolver,
    },
  },
  {
    path: 'withdrawn-seizure-property',
    loadChildren: () =>
      import('../withdrawn-seizure-property/withdrawn-seizure-property.module').then(
        m => m.WithdrawnSeizurePropertyModule
      ),
    resolve: {
      taskMode: TaskResolver,
    },
  },
  {
    path: 'withdrawn-writ-execution',
    loadChildren: () =>
      import('../withdrawn-writ-execution/withdrawn-writ-execution.module').then(m => m.WithdrawnWritExecutionModule),
    resolve: {
      taskMode: TaskResolver,
    },
  },
  {
    path: 'auction',
    loadChildren: () => import('../auction/auction.module').then(m => m.AuctionModule),
    resolve: {
      taskMode: TaskResolver,
    },
  },
  {
    path: 'preference-detail',
    loadComponent: () => import('../preference/preference-detail/preference-detail.component').then(m => m.PreferenceDetailComponent),
    resolve: {
      taskMode: TaskResolver
    },
    canDeactivate: [PreferenceGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {}
