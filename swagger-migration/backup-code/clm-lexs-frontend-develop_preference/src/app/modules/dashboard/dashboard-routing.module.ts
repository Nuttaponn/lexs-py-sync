import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'customers',
    loadChildren: () => import('./detail-customer/detail-customer.module').then(m => m.DetailCustomerModule),
  },
  {
    path: 'litigation',
    loadChildren: () => import('./detail-litigation/detail-litigation.module').then(m => m.DetailLitigationModule),
  },
  {
    path: 'finance',
    loadChildren: () => import('./detail-finance/detail-finance.module').then(m => m.DetailFinanceModule),
  },
  {
    path: 'collateral',
    loadChildren: () => import('./detail-collateral/detail-collateral.module').then(m => m.DetailCollateralModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
