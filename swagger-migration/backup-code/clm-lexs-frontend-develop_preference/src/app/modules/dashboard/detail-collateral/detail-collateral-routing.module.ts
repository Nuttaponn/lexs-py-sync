import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailCollateralComponent } from './detail-collateral.component';

const routes: Routes = [
  {
    path: '',
    component: DetailCollateralComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailCollateralRoutingModule {}
