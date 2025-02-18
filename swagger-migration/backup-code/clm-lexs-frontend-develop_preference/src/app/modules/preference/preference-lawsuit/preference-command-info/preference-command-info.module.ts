import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PreferenceCommandInfoComponent } from './preference-command-info.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: PreferenceCommandInfoComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(AppRoutes), CommonModule],
})
export class PreferenceCommandInfoModule {}
