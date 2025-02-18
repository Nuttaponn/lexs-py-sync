import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AucAnnoucementKtbComponent } from './auc-annoucement-ktb.component';

const routes: Routes = [
  {
    path: '',
    component: AucAnnoucementKtbComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AucAnnoucementKtbRoutingModule {}
