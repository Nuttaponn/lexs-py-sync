import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuctionCashierChequeComponent } from './auction-cashier-cheque.component';
import { AuctionCashierChequeTableComponent } from './auction-cashier-cheque-table/auction-cashier-cheque-table.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { CashierChequeStatusPipe } from './cashier-cheque-status.pipe';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [AuctionCashierChequeComponent, AuctionCashierChequeTableComponent, CashierChequeStatusPipe],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  exports: [AuctionCashierChequeComponent],
  providers: [CashierChequeStatusPipe, provideNgxMask()],
})
export class AuctionCashierChequeModule {}
