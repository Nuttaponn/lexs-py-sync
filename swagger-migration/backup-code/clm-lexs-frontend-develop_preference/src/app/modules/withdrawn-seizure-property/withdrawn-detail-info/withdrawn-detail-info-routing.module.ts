import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WithdrawnDetailInfoComponent } from './withdrawn-detail-info.component';
import { WithdrawnDetailInfoResolver } from './withdrawn-detail-info.resolver';

const routes: Routes = [
  {
    path: '',
    component: WithdrawnDetailInfoComponent,
    resolve: {
      withdrawnDetailInfo: WithdrawnDetailInfoResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WithdrawnDetailInfoRoutingModule {}
