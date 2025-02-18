import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PreferenceDocumentLedComponent } from './preference-document-led.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: PreferenceDocumentLedComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(AppRoutes), CommonModule],
})
export class PreferenceDocumentLedModule {}
