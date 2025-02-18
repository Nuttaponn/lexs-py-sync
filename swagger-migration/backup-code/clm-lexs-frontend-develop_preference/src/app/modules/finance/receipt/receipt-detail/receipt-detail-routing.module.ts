import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptDetailComponent } from './receipt-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ReceiptDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptDetailRoutingModule {}
