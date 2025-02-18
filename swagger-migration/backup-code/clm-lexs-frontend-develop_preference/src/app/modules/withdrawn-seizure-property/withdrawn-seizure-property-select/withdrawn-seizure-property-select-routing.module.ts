import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WithdrawnSeizurePropertySelectComponent } from './withdrawn-seizure-property-select.component';
import { WithdrawnSeizurePropertySelectResolver } from './withdrawn-seizure-property-select.resolver';

const routes: Routes = [
  {
    path: '',
    component: WithdrawnSeizurePropertySelectComponent,
    resolve: {
      withdrawnSeizureProperty: WithdrawnSeizurePropertySelectResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WithdrawnSeizurePropertySelectRoutingModule {}
