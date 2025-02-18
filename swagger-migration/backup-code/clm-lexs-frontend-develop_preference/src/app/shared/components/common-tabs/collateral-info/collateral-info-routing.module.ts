import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollateralInfoComponent } from './collateral-info.component';
import { CollateralInfoResolver } from './collateral-info.resolver';

const routes: Routes = [
  {
    path: '',
    component: CollateralInfoComponent,
    resolve: { collateralInfo: CollateralInfoResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollateralInfoRoutingModule {}
