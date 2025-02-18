import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CloseLgComponent } from './lawsuit-detail/close-lg/close-lg.component';
import { LawsuitGuard } from './lawsuit.guard';
import { LawsuitResolver } from './lawsuit.resolver';
import { LawsuitComponent } from './lawsuit/lawsuit.component';
const routes: Routes = [
  {
    path: '',
    canDeactivate: [LawsuitGuard],
    component: LawsuitComponent,
    resolve: { pageOfLitigationDto: LawsuitResolver },
  },
  {
    path: 'detail',
    loadChildren: () => import('./lawsuit-detail/lawsuit-detail.module').then(m => m.LawsuitDetailModule),
    resolve: { litgation: LawsuitResolver },
  },
  {
    path: 'execution-warrant',
    loadChildren: () => import('../execution-warrant/execution-warrant.module').then(m => m.ExecutionWarrantModule),
  },
  {
    path: 'seizure-property',
    loadChildren: () => import('../seizure-property/seizure-property.module').then(m => m.SeizurePropertyModule),
  },
  {
    path: 'withdrawn-seizure-property',
    loadChildren: () =>
      import('../withdrawn-seizure-property/withdrawn-seizure-property.module').then(
        m => m.WithdrawnSeizurePropertyModule
      ),
  },
  {
    path: 'withdrawn-writ-execution',
    loadChildren: () =>
      import('../withdrawn-writ-execution/withdrawn-writ-execution.module').then(m => m.WithdrawnWritExecutionModule),
  },
  {
    path: 'deferment',
    loadChildren: () => import('../deferment/deferment.module').then(m => m.DefermentModule),
  },
  {
    path: 'court',
    loadChildren: () => import('../court/court.module').then(m => m.CourtModule),
  },
  {
    path: 'close',
    canDeactivate: [LawsuitGuard],
    component: CloseLgComponent,
    resolve: { litigation: LawsuitResolver },
  },
  {
    path: 'auction',
    loadChildren: () => import('../auction/auction.module').then(m => m.AuctionModule),
  },
  {
    path: 'investigate-property',
    loadChildren: () =>
      import('../investigate-property/investigate-property.module').then(m => m.InvestigatePropertyModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LawsuitRoutingModule {}
