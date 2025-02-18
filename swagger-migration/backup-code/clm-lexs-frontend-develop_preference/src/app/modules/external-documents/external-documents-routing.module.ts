import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalDocumentsGuard } from './external-documents.guard';
import { ExternalDocumentsComponent } from './external-documents/external-documents.component';

const routes: Routes = [
  {
    path: '',
    component: ExternalDocumentsComponent,
    canDeactivate: [ExternalDocumentsGuard],
    children: [
      {
        path: 'annoucement-ktb',
        loadChildren: () =>
          import('./auc-annoucement-ktb/auc-annoucement-ktb.module').then(m => m.AucAnnoucementKtbModule),
      },
    ],
  },
  {
    path: 'auction',
    loadChildren: () => import('../auction/auction.module').then(m => m.AuctionModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExternalDocumentsRoutingModule {}
