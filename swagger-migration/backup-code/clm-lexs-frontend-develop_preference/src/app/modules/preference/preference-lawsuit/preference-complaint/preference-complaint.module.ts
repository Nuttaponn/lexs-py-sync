import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PreferenceComplaintComponent } from './preference-complaint.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: PreferenceComplaintComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(AppRoutes), CommonModule],
})
export class PreferenceComplaintModule { }
