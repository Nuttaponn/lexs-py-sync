import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WithdrawnSeizurePropertyComponent } from './withdrawn-seizure-property.component';
import { WithdrawnSeizurePropertyGuard } from './withdrawn-seizure-property.guard';
import { WithdrawnSeizurePropertyResolver } from './withdrawn-seizure-property.resolver';

const routes: Routes = [
  {
    path: '',
    component: WithdrawnSeizurePropertyComponent,
    canDeactivate: [WithdrawnSeizurePropertyGuard],
    resolve: {
      withdrawnSeizureProperty: WithdrawnSeizurePropertyResolver,
    },
    children: [
      {
        path: 'nav-tab-withdrawn-detail-info-tab',
        loadChildren: () =>
          import('./withdrawn-detail-info/withdrawn-detail-info.module').then(m => m.WithdrawnDetailInfoModule),
      },
      {
        path: 'nav-tab-assets-contacts-info-tab',
        loadChildren: () =>
          import('./assets-contacts-info/assets-contacts-info.module').then(m => m.AssetsContactsInfoModule),
      },
      {
        path: 'nav-tab-legal-execution-office-info-tab',
        loadChildren: () =>
          import('./legal-execution-office-info/legal-execution-office-info.module').then(
            m => m.LegalExecutionOfficeInfoModule
          ),
      },
      {
        path: 'withdrawn-info-step',
        loadChildren: () =>
          import(
            '@modules/withdrawn-seizure-property/withdrawn-seizure-property-reason/withdrawn-seizure-property-reason.module'
          ).then(m => m.WithdrawnSeizurePropertyReasonModule),
      },
      {
        path: 'assets-contacts-info-step',
        loadChildren: () =>
          import('./withdrawn-seizure-property-select/withdrawn-seizure-property-select.module').then(
            m => m.WithdrawnSeizurePropertySelectModule
          ),
      },
      {
        path: 'legal-execution-office-info-step',
        loadChildren: () =>
          import('./withdrawn-seizure-property-document/withdrawn-seizure-property-document.module').then(
            m => m.WithdrawnSeizurePropertyDocumentModule
          ),
      },
    ],
  },
  {
    path: 'create-property-group',
    loadChildren: () =>
      import('./withdrawn-seizure-property-create-group/withdrawn-seizure-property-create-group.module').then(
        m => m.WithdrawnSeizurePropertyCreateGroupModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WithdrawnSeizurePropertyRoutingModule {}
