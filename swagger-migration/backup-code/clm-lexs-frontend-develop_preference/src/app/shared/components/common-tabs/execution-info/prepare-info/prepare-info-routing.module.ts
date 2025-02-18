import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrepareInfoComponent } from './prepare-info.component';

const routes: Routes = [
  {
    path: '',
    component: PrepareInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrepareInfoRoutingModule {}
