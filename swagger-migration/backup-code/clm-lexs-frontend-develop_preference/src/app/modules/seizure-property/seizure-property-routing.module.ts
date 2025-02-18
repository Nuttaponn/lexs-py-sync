import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeizurePropertyResolver } from './resolvers';
import { SeizurePropertyViewComponent } from './seizure-property-view/seizure-property-view.component';
import { SeizurePropertyComponent } from './seizure-property.component';
import { SeizurePropertyGuard } from './seizure-property.guard';
import { SeizureUploadReceiptComponent } from './seizure-upload-receipt/seizure-upload-receipt.component';
import { SeizureUploadReceiptDetailComponent } from './seizure-upload-receipt-detail/seizure-upload-receipt-detail.component';
import { NonPledgePropertiesDocumentComponent } from './non-pledge-properties-document/non-pledge-properties-document.component';

const routes: Routes = [
  // Case Route
  {
    path: '',
    component: SeizurePropertyComponent,
    canDeactivate: [SeizurePropertyGuard],
    resolve: {
      seizureProperty: SeizurePropertyResolver,
    },
  },
  {
    path: 'execution-detail',
    loadChildren: () =>
      import('./seizure-result-detail/seizure-result-detail.module').then(m => m.SeizureResultDetailModule),
  },
  {
    path: 'command',
    canDeactivate: [SeizurePropertyGuard],
    component: SeizurePropertyViewComponent,
    resolve: {
      seizureProperty: SeizurePropertyResolver,
    },
    children: [
      {
        path: 'nav-tab-seizure-list-info-tab',
        loadChildren: () => import('./seizure-list-info/seizure-list-info.module').then(m => m.SeizureListInfoModule),
      },
      {
        path: 'nav-tab-seizure-document-info-tab',
        loadChildren: () =>
          import('./seizure-document-info/seizure-document-info.module').then(m => m.SeizureDocumentInfoModule),
      },
    ],
  },
  {
    path: 'non-pledge',
    canDeactivate: [SeizurePropertyGuard],
    component: SeizurePropertyViewComponent,
    resolve: {
      seizureProperty: SeizurePropertyResolver,
    },
    children: [
      {
        path: 'nav-tab-seizure-list-info-tab',
        loadChildren: () => import('./seizure-list-info/seizure-list-info.module').then(m => m.SeizureListInfoModule),
      },
      {
        path: 'non-pledge-properties-document-tab',
        component: NonPledgePropertiesDocumentComponent,
      },
    ],
  },
  {
    path: 'upload-receipt',
    component: SeizureUploadReceiptComponent,
    resolve: {
      seizureProperty: SeizurePropertyResolver,
    },
  },
  {
    path: 'upload-receipt-detail',
    canDeactivate: [SeizurePropertyGuard],
    component: SeizureUploadReceiptDetailComponent,
    resolve: {
      seizureProperty: SeizurePropertyResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeizurePropertyRoutingModule {}
