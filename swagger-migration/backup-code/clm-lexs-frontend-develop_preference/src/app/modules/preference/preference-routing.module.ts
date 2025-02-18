import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreferenceGuard } from './preference.guard';
import { PreferenceResolver } from './preference.resolver';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./preference-list/preference-list.component').then((m) => m.PreferenceListComponent),
  },
  {
    path: 'detail',
    loadComponent: () => import('./preference-detail/preference-detail.component').then((m) => m.PreferenceDetailComponent),
    canDeactivate: [PreferenceGuard],
    resolve: { preference: PreferenceResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferenceRoutingModule { }
