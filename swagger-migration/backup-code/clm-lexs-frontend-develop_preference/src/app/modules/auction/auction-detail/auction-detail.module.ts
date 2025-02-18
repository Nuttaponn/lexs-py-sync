import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ResponsibleLawyerModule } from '@app/shared/components/responsible-lawyer/responsible-lawyer.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AuctionPropertyListTableComponent } from '../auction-property-list/auction-property-list-table/auction-property-list-table.component';
import { AuctionPropertyListComponent } from '../auction-property-list/auction-property-list.component';
import { AuctionRevokeModule } from '../auction-revoke/auction-revoke.module';
import { AuctionModule } from '../auction.module';
import { AuctionDetailRoutingModule } from './auction-detail-routing.module';
import { AuctionDetailComponent } from './auction-detail.component';
import { AuctionPropertySetBuyerModule } from '../auction-property-set-buyer/auction-property-set-buyer.module';
import { AuctionGroupCollateralModule } from '../auction-group-collateral/auction-group-collateral.module';
import { AuctionCashierChequeModule } from '../auction-cashier-cheque/auction-cashier-cheque.module';
import { AuctionFollowAccountDocComponent } from '../auction-follow-account-doc/auction-follow-account-doc.component';
import { DebtSettlementAccountsDetailComponent } from '../debt-settlement-accounts/debt-settlement-accounts-detail/debt-settlement-accounts-detail.component';
import { DebtSettlementAccountsComponent } from '../debt-settlement-accounts/debt-settlement-accounts.component';
import { AuctionCollateralForSaleComponent } from '../auction-collateral-for-sale/auction-collateral-for-sale.component';

@NgModule({
  declarations: [
    AuctionDetailComponent,
    AuctionPropertyListComponent,
    AuctionPropertyListTableComponent,
    AuctionFollowAccountDocComponent,
    DebtSettlementAccountsComponent,
    DebtSettlementAccountsDetailComponent,
    AuctionCollateralForSaleComponent,
  ],
  exports: [AuctionPropertyListComponent],
  imports: [
    CommonModule,
    AuctionDetailRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    ResponsibleLawyerModule,
    PipesModule,
    AuctionModule,
    AuctionRevokeModule,
    AuctionPropertySetBuyerModule,
    AuctionGroupCollateralModule,
    AuctionCashierChequeModule,
  ],
})
export class AuctionDetailModule {}
