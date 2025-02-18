import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CaseDetailsModule } from '@app/shared/components/case-details/case-details.module';
import { DocumentPreparationModule } from '@app/shared/components/document-preparation/document-preparation/document-preparation.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { ExecutionDocumentInfoRoutingModule } from './execution-document-info-routing.module';
import { ExecutionDocumentInfoComponent } from './execution-document-info.component';
import { RecordDialogComponent } from './record-docs/record-dialog/record-dialog.component';
import { RecordDocsComponent } from './record-docs/record-docs.component';
import { ConcludeCalculateDebtComponent } from './related-accounts/conclude-calculate-debt/conclude-calculate-debt.component';
import { ListAccountDocumentComponent } from './related-accounts/list-account-document/list-account-document.component';
import { RelatedAccountsComponent } from './related-accounts/related-accounts.component';
@NgModule({
  declarations: [
    ExecutionDocumentInfoComponent,
    RecordDocsComponent,
    RecordDialogComponent,
    RelatedAccountsComponent,
    ListAccountDocumentComponent,
    ConcludeCalculateDebtComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ExecutionDocumentInfoRoutingModule,
    SpigCoreModule,
    CaseDetailsModule,
    DocumentPreparationModule,
    TranslateModule,
    SpigShareModule,
    PipesModule,
  ],
})
export class ExecutionDocumentInfoModule {}
