import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailCustomerComponent } from './detail-customer.component';

const routes: Routes = [
  {
    path: '',
    component: DetailCustomerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailCustomerRoutingModule {}
