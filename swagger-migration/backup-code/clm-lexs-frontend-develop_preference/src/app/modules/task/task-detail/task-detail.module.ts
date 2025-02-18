import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CourtModule } from '@app/modules/court/court.module';
import { CustomerModule } from '@app/modules/customer/customer.module';
import { DefermentModule } from '@app/modules/deferment/deferment.module';
import { ExpenseDetailModule } from '@app/modules/finance/expense/expense-detail/expense-detail.module';
import { LawsuitDetailModule } from '@app/modules/lawsuit/lawsuit-detail/lawsuit-detail.module';
import { LawsuitModule } from '@app/modules/lawsuit/lawsuit.module';
import { AccountInfoModule } from '@app/shared/components/common-tabs/account-info/account-info.module';
import { AuditLogModule } from '@app/shared/components/common-tabs/audit-log/audit-log.module';
import { CollateralInfoModule } from '@app/shared/components/common-tabs/collateral-info/collateral-info.module';
import { LitigationSummaryModule } from '@app/shared/components/common-tabs/litigation-summary/litigation-summary.module';
import { PrepareLawsuitModule } from '@app/shared/components/common-tabs/prepare-lawsuit/prepare-lawsuit.module';
import { SuitEfilingModule } from '@app/shared/components/common-tabs/suit-efiling/suit-efiling.module';
import { TrialModule } from '@app/shared/components/common-tabs/trial/trial.module';
import { DebtRelatedInfoTabModule } from '@app/shared/components/debt-related-info-tab/debt-related-info-tab.module';
import { DocumentPreparationModule } from '@app/shared/components/document-preparation/document-preparation/document-preparation.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AdvanceDetailModule } from './../../finance/advance/advance-detail/advance-detail.module';
import { TaskDetailRoutingModule } from './task-detail-routing.module';
import { TaskDetailComponent } from './task-detail.component';
import { PreferenceModule } from '@app/modules/preference/preference.module';
@NgModule({
  declarations: [TaskDetailComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TaskDetailRoutingModule,
    TranslateModule,
    SharedModule,
    CustomerModule,
    LawsuitModule,
    DefermentModule,
    CourtModule,
    LawsuitDetailModule,
    DebtRelatedInfoTabModule,
    AuditLogModule,
    AccountInfoModule,
    CollateralInfoModule,
    DocumentPreparationModule,
    LitigationSummaryModule,
    SuitEfilingModule,
    TrialModule,
    PrepareLawsuitModule,
    ExpenseDetailModule,
    PipesModule,
    AdvanceDetailModule,
  ],
})
export class TaskDetailModule {}
