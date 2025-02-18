import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecutionWarrantComponent } from './execution-warrant.component';
import { ExecutionWarrantGuard } from './execution-warrant.guard';

const routes: Routes = [
  {
    path: '',
    component: ExecutionWarrantComponent,
    canDeactivate: [ExecutionWarrantGuard],
    children: [
      {
        path: 'nav-tab-case-info-tab',
        loadChildren: () =>
          import('./execution-case-info/execution-case-info.module').then(m => m.ExecutionCaseInfoModule),
      },
      {
        path: 'nav-tab-document-info-tab',
        loadChildren: () =>
          import('./execution-document-info/execution-document-info.module').then(m => m.ExecutionDocumentInfoModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecutionWarrantRoutingModule {}
