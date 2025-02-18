import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LitigationCaseInfoComponent } from './litigation-case-info.component';

const routes: Routes = [
  {
    path: '',
    component: LitigationCaseInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LitigationCaseInfoRoutingModule {}
