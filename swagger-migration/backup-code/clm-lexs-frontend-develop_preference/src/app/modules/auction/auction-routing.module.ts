import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionSeizureDocumentDetailComponent } from './auction-seizure-document-detail/auction-seizure-document-detail.component';
import { AuctionComponent } from './auction.component';
import { AuctionGuard } from './auction.guard';
import { AuctionResolver } from './auction.resolver';
import { AuctionDetailLexsSysMainComponent } from './auction-manual-announcement/auction-detail-lexs-sys-main/auction-detail-lexs-sys-main.component';

const routes: Routes = [
  {
    path: '',
    component: AuctionComponent,
    canDeactivate: [AuctionGuard],
    resolve: { Auction: AuctionResolver },
    children: [
      {
        path: 'auction-detail',
        loadChildren: () => import('./auction-detail/auction-detail.module').then(m => m.AuctionDetailModule),
      },
      {
        path: 'auction-result-info',
        loadChildren: () =>
          import('./auction-result-info/auction-result-info.module').then(m => m.AuctionResultInfoModule),
      },
      {
        path: 'auction-advance-payment',
        loadChildren: () =>
          import('./auction-advance-payment/auction-advance-payment.module').then(m => m.AuctionAdvancePaymentModule),
      },
      {
        path: 'auction-annoucement-detail',
        loadChildren: () =>
          import('./auc-announcement-detail/auc-announcement-detail.module').then(m => m.AucAnnouncementDetailModule),
      },
      {
        path: 'auction-manual-announcement',
        loadChildren: () =>
          import('./auction-manual-announcement/auction-manual-announcement.module').then(m => m.AuctionManualAnnouncementModule),
      },
      {
        path: 'property-set-buyer',
        loadChildren: () =>
          import('./auction-property-set-buyer/auction-property-set-buyer.module').then(
            m => m.AuctionPropertySetBuyerModule
          ),
      },
      {
        path: 'auction-item-payment-result',
        loadChildren: () =>
          import('./auction-detail-item-payment-result/auction-detail-item-payment-result.module').then(
            m => m.AuctionDetailItemPaymentResultModule
          ),
      },
    ],
  },
  {
    path: 'auction-math',
    loadChildren: () =>
      import('./auc-announement-match/auc-announement-match.module').then(m => m.AucAnnounementMatchModule),
  },
  {
    path: 'property-detail',
    loadChildren: () =>
      import('./auction-property-list/auction-property-detail/auction-property-detail.module').then(
        m => m.AuctionPropertyDetailModule
      ),
  },
  {
    path: 'appointment-date-detail',
    loadChildren: () =>
      import('./auction-appointment-date/auction-appointment-date-detail/auction-appointment-date-detail.module').then(
        m => m.AuctionAppointmentDateDetailModule
      ),
  },
  {
    path: 'document-detail',
    component: AuctionSeizureDocumentDetailComponent,
    canDeactivate: [AuctionGuard],
  },
  {
    path: 'owner-transfer',
    loadChildren: () => import('./ownership-transfer/ownership-transfer.module').then(m => m.OwnershipTransferModule),
  },
  {
    path: 'npa-history',
    loadChildren: () =>
      import('./auction-conclusion-history/auction-conclusion-history.module').then(
        m => m.AuctionConclusionHistoryModule
      ),
  },
  {
    path: 'auction-appointment-date',
    loadChildren: () =>
      import('./auction-appointment-date/auction-appointment-date.module').then(m => m.AuctionAppointmentDateModule),
  },

  {
    path: 'auction-verify-collateral',
    loadChildren: () =>
      import('./auc-announement-verify-collateral/auc-announement-verify-collateral.module').then(
        m => m.AucAnnounementVerifyCollateralModule
      ),
  },
  {
    path: 'auction-map-collateral',
    loadChildren: () =>
      import('./auc-announement-map-collateral/auc-announement-map-collateral.module').then(
        m => m.AucAnnounementMapCollateralModule
      ),
  },
  {
    path: 'auction-detail-lexs-sys-main',
    component: AuctionDetailLexsSysMainComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuctionRoutingModule {}
