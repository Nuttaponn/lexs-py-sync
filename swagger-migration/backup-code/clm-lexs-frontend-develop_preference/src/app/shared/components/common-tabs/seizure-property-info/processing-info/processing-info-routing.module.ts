import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessingInfoComponent } from './processing-info.component';

const routes: Routes = [
  {
    path: '',
    component: ProcessingInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessingInfoRoutingModule {}
