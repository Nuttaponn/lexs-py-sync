import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentPreparationResolver } from '../../document-preparation/document-preparation/document-preparation.resolver';
import { PrepareLawsuitComponent } from './prepare-lawsuit.component';

const routes: Routes = [
  {
    path: '',
    component: PrepareLawsuitComponent,
    resolve: {
      DocumentPreparation: DocumentPreparationResolver,
    },
    children: [
      {
        path: 'nav-under-sub-tab-document-preparation-info-tab',
        loadChildren: () =>
          import('../../document-preparation/document-preparation/document-preparation.module').then(
            m => m.DocumentPreparationModule
          ),
      },
      {
        path: 'nav-under-sub-tab-notice-info-tab',
        loadChildren: () => import('./notice/notice.module').then(m => m.NoticeModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrepareLawsuitRoutingModule {}
