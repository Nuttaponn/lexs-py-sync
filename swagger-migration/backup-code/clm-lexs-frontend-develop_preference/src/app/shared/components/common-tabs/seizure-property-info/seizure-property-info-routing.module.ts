import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SEIZURE_PROPERTY_TABS_INFO } from '@app/shared/constant';
import { SeizurePropertyInfoComponent } from './seizure-property-info.component';

const routes: Routes = [
  {
    path: '',
    component: SeizurePropertyInfoComponent,
    children: [
      {
        path: SEIZURE_PROPERTY_TABS_INFO[0].path,
        loadChildren: () => import('./order-info/order-info.module').then(m => m.OrderInfoModule),
      },
      {
        path: SEIZURE_PROPERTY_TABS_INFO[1].path,
        loadChildren: () => import('./processing-info/processing-info.module').then(m => m.ProcessingInfoModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeizurePropertyInfoRoutingModule {}
