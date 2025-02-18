import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardResolver } from './deferment-dashboard/dashboard.resolver';
import { DefermentDashboardComponent } from './deferment-dashboard/deferment-dashboard.component';
import { DefermentComponent } from './deferment.component';
import { DefermentGuard } from './deferment.guard';
import { DefermentResolver } from './deferment.resolver';

const routes: Routes = [
  {
    path: 'defer',
    component: DefermentDashboardComponent,
    resolve: { deferment: DashboardResolver },
    canDeactivate: [DefermentGuard],
  },
  {
    path: 'defer/main',
    component: DefermentComponent,
    resolve: { deferment: DefermentResolver },
  },
  {
    path: 'defer/seizure-property',
    loadChildren: () =>
      import('./deferment-seizure-property/deferment-seizure-property.module').then(
        m => m.DefermentSeizurePropertyModule
      ),
  },
  {
    path: 'defer/debt-summary',
    loadChildren: () =>
      import('./deferment-debt-summary/deferment-debt-summary.module').then(m => m.DefermentDebtSummaryModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefermenRoutingModule {}
