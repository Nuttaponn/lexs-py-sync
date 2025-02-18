import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LitigationSummaryComponent } from './litigation-summary.component';

const routes: Routes = [
  {
    path: '',
    component: LitigationSummaryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LitigationSummaryRoutingModule {}
