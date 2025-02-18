import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestigatePropertyComponent } from '@modules/investigate-property/investigate-property.component';
import { InvestigatePropertyGuard } from '@modules/investigate-property/investigate-property.guard';
import { InvestigatePropertyResolver } from '@modules/investigate-property/investigate-property.resolver';
import { InvestigatePropertyCommandComponent } from '@modules/investigate-property/investigate-property-command/investigate-property-command.component';
import { InvestigatePropertyDetailComponent } from './investigate-property-detail/investigate-property-detail.component';

const routes: Routes = [
  {
    path: '',
    component: InvestigatePropertyComponent,
    canDeactivate: [InvestigatePropertyGuard],
    resolve: { investigateProperty: InvestigatePropertyResolver },
    children: [
      {
        path: 'investigate-property-detail',
        component: InvestigatePropertyDetailComponent,
      },
      {
        path: 'investigate-property-command',
        component: InvestigatePropertyCommandComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestigatePropertyRoutingModule {}
