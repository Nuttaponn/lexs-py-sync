import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PreferenceJudgeComponent } from './preference-judge.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: PreferenceJudgeComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(AppRoutes), CommonModule],
})
export class PreferenceJudgeModule { }
