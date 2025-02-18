import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskPoolComponent } from './task-pool.component';

const routes: Routes = [
  {
    path: '',
    component: TaskPoolComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskPoolRoutingModule {}
