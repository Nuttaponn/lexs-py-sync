import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseInfoComponent } from './case-info.component';

const routes: Routes = [
  {
    path: '',
    component: CaseInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseInfoRoutingModule {}
