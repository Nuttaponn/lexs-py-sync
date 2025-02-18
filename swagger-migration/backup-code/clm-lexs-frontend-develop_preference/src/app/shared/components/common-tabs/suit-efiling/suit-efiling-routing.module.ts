import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuitEfilingComponent } from './suit-efiling.component';

const routes: Routes = [
  {
    path: '',
    component: SuitEfilingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuitEfilingRoutingModule {}
