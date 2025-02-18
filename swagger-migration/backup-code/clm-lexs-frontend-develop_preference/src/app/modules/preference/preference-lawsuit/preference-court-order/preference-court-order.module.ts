import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PreferenceCourtOrderComponent } from './preference-court-order.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: PreferenceCourtOrderComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(AppRoutes), CommonModule],
})
export class PreferenceCourtOrderModule { }
