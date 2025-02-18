import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AttibuteDocumentPipe } from '../components/document-preparation/attibute-document.pipe';
import { AppealPurposePipe } from './appeal-purpose.pipe';
import { ApproverDecisionPipe } from './approver-decision.pipe';
import { AucLedTypePipe } from './auc-led-type.pipe';
import { AucMainDefendantPipe } from './auc-main-defendant.pipe';
import { AucSubDefendantPipe } from './auc-sub-defendant.pipe';
import { CoerceStringPipe } from './coerce-string.pipe';
import { CollateralStatusPipe } from './collateral-status.pipe';
import { ConditionalAppealPipe } from './conditional-appeal.pipe';
import { CourtConsiderActionPipe } from './court-consider-action.pipe';
import { CustomerTooptipPipe } from './customer-tooptip.pipe';
import { DefermentStatusPipe } from './deferment-status.pipe';
import { ExpenseAmountPipe } from './expense-amount.pipe';
import { FinanceStatusButtonPipe } from './finance-status-button.pipe';
import { IsNotTaskOwnerPipe } from './is-not-task-owner.pipe';
import { OwnerNamePipe } from './owner-name.pipe';
import { ReceiptAmountPipe } from './receipt-amount.pipe';
import { SplitTxtPipe } from './split-txt.pipe';
import { TaskStatusPipe } from './task-status.pipe';
import { WhtTypePipe } from './wht-type.pipe';
import { ArraySumPipe } from './array-sum.pipe';
import { SlaStatusPipe } from './sla-status.pipe';

@NgModule({
  declarations: [
    TaskStatusPipe,
    SlaStatusPipe,
    IsNotTaskOwnerPipe,
    AppealPurposePipe,
    ApproverDecisionPipe,
    ConditionalAppealPipe,
    CustomerTooptipPipe,
    ExpenseAmountPipe,
    WhtTypePipe,
    CourtConsiderActionPipe,
    FinanceStatusButtonPipe,
    ReceiptAmountPipe,
    SplitTxtPipe,
    AttibuteDocumentPipe,
    CoerceStringPipe,
    OwnerNamePipe,
    DefermentStatusPipe,
    CollateralStatusPipe,
    AucMainDefendantPipe,
    AucSubDefendantPipe,
    AucLedTypePipe,
    ArraySumPipe,
  ],
  imports: [CommonModule],
  exports: [
    TaskStatusPipe,
    SlaStatusPipe,
    IsNotTaskOwnerPipe,
    AppealPurposePipe,
    ApproverDecisionPipe,
    ConditionalAppealPipe,
    CustomerTooptipPipe,
    ExpenseAmountPipe,
    WhtTypePipe,
    CourtConsiderActionPipe,
    FinanceStatusButtonPipe,
    ReceiptAmountPipe,
    SplitTxtPipe,
    AttibuteDocumentPipe,
    CoerceStringPipe,
    OwnerNamePipe,
    DefermentStatusPipe,
    CollateralStatusPipe,
    AucMainDefendantPipe,
    AucSubDefendantPipe,
    AucLedTypePipe,
    ArraySumPipe,
  ],
  providers: [ReceiptAmountPipe],
})
export class PipesModule {}
