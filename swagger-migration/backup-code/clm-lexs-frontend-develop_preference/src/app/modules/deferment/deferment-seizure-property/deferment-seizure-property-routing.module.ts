import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefermentSeizurePropertyComponent } from './deferment-seizure-property.component';

const routes: Routes = [
  {
    path: '',
    component: DefermentSeizurePropertyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefermentSeizurePropertyRoutingModule {}
