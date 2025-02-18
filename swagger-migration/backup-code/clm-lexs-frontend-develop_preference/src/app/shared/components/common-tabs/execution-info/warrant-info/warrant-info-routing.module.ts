import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarrantInfoComponent } from './warrant-info.component';

const routes: Routes = [
  {
    path: '',
    component: WarrantInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarrantInfoRoutingModule {}
