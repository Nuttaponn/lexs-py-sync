import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { CreatePaymentBookComponent } from '../create-payment-book/create-payment-book.component';
import { ExpensePaymentDetailComponent } from '../expense-payment-detail/expense-payment-detail.component';
import { RemarksPaymentDialogComponent } from '../remarks-payment-dialog/remarks-payment-dialog.component';
import { ExpenseDetailRoutingModule } from './expense-detail-routing.module';
import { ExpenseDetailComponent } from './expense-detail.component';

@NgModule({
  declarations: [
    ExpenseDetailComponent,
    CreatePaymentBookComponent,
    ExpensePaymentDetailComponent,
    RemarksPaymentDialogComponent,
  ],
  imports: [
    CommonModule,
    ExpenseDetailRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    TranslateModule,
    PipesModule,
  ],
  exports: [ExpensePaymentDetailComponent, CreatePaymentBookComponent],
})
export class ExpenseDetailModule {}
