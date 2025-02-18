import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AddPaymentListDialogComponent } from './add-payment-list-dialog/add-payment-list-dialog.component';
import { ExpenseDetailViewComponent } from './expense-detail-view/expense-detail-view.component';
import { ExpenseRoutingModule } from './expense-routing.module';
import { ExpenseComponent } from './expense.component';
import { ExpenseWithdrawalInfoDialogComponent } from './expense-withdrawal-info-dialog/expense-withdrawal-info-dialog.component';
import { ExpenseAssetsComponent } from './expense-assets/expense-assets.component';
import { ExpenseAssetDocumentsComponent } from './expense-asset-documents/expense-asset-documents.component';

@NgModule({
  declarations: [
    ExpenseComponent,
    AddPaymentListDialogComponent,
    ExpenseDetailViewComponent,
    ExpenseWithdrawalInfoDialogComponent,
    ExpenseAssetsComponent,
    ExpenseAssetDocumentsComponent,
  ],
  imports: [
    CommonModule,
    ExpenseRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    TranslateModule,
    PipesModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ExpenseModule {}
