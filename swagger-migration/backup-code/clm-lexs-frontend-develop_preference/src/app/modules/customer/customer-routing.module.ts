import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerGuard } from './customer.guard';
import { CustomerResolver } from './customer.resolver';
import { CustomerComponent } from './customer/customer.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    canDeactivate: [CustomerGuard],
    resolve: { pageOfCustomerDto: CustomerResolver },
  },
  {
    path: 'detail',
    loadChildren: () => import('./customer-detail/customer-detail.module').then(m => m.CustomerDetailModule),
    resolve: { customerDetail: CustomerResolver },
  },
  {
    path: 'profile-direct',
    loadChildren: () => import('./profile-direct/profile-direct.module').then(m => m.ProfileDirectModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
