import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LitigationMemoComponent } from './litigation-memo.component';

const routes: Routes = [
  {
    path: '',
    component: LitigationMemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LitigationMemoRoutingModule {}
