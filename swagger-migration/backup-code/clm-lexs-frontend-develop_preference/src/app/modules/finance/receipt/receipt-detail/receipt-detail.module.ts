import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { ReceiptAmountPipe } from '@app/shared/pipes/receipt-amount.pipe';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AddLgDialogComponent } from './add-lg-dialog/add-lg-dialog.component';
import { ReceiptDetailRoutingModule } from './receipt-detail-routing.module';
import { ReceiptDetailComponent } from './receipt-detail.component';
import { RefundInfoByLgIdComponent } from './refund-info-by-lg-id/refund-info-by-lg-id.component';
import { RefundInfoKcorpComponent } from './refund-info-kcorp/refund-info-kcorp.component';
import { PayerTransPipe, RefundInfoComponent } from './refund-info/refund-info.component';

@NgModule({
  declarations: [
    ReceiptDetailComponent,
    RefundInfoComponent,
    RefundInfoByLgIdComponent,
    AddLgDialogComponent,
    RefundInfoKcorpComponent,
    PayerTransPipe,
  ],
  imports: [
    CommonModule,
    ReceiptDetailRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    TranslateModule,
    PipesModule,
  ],
  providers: [ReceiptAmountPipe],
})
export class ReceiptDetailModule {}
