import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WithdrawnSeizurePropertyReasonComponent } from './withdrawn-seizure-property-reason.component';
import { WithdrawnSeizurePropertyReasonResolver } from './withdrawn-seizure-property-reason.resolver';

const routes: Routes = [
  {
    path: '',
    component: WithdrawnSeizurePropertyReasonComponent,
    resolve: {
      WithdrawnSeizurePropertyReasonResolver: WithdrawnSeizurePropertyReasonResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WithdrawnSeizurePropertyReasonRoutingModule {}
