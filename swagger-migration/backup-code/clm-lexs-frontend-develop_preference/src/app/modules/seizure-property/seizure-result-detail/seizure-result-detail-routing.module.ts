import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeizureResultDetailComponent } from './seizure-result-detail.component';
import { SeizureResultDetailResolver } from '../resolvers';
import { SeizurePropertyGuard } from '../seizure-property.guard';

const routes: Routes = [
  {
    path: '',
    canDeactivate: [SeizurePropertyGuard],
    component: SeizureResultDetailComponent,
    resolve: {
      data: SeizureResultDetailResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeizureResultDetailRoutingModule {}
