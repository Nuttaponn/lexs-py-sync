import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LitigationInvestigatePropertyComponent } from '@shared/components/common-tabs/litigation-investigate-property/litigation-investigate-property.component';

const routes: Routes = [
  {
    path: '',
    component: LitigationInvestigatePropertyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LitigationInvestigatePropertyRoutingModule {}
