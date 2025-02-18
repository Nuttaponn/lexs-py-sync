import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { CommitmentAccountSelectComponent } from '../commitment-account-select/commitment-account-select.component';
import { CommonDocumentTableComponent } from '../common-document-table/common-document-table.component';
import { DocBorrowerGuarantorComponent } from '../doc-borrower-guarantor/doc-borrower-guarantor.component';
import { DocCollateralComponent } from '../doc-collateral/doc-collateral.component';
import { DocLitigationComponent } from '../doc-litigation/doc-litigation.component';
import { DocSelectionComponent } from '../doc-selection/doc-selection.component';
import { DocumentAccountComponent } from '../document-account/document-account.component';
import { DocumentHeaderComponent } from '../document-header/document-header.component';
import { DocumentPreparationComponent } from './document-preparation.component';
import { DocumentPreparationRoutingModule } from './document-preparation.routing.module';

@NgModule({
  declarations: [
    DocumentPreparationComponent,
    DocumentAccountComponent,
    DocCollateralComponent,
    DocBorrowerGuarantorComponent,
    DocLitigationComponent,
    DocumentHeaderComponent,
    DocSelectionComponent,
    CommitmentAccountSelectComponent,
    CommonDocumentTableComponent,
  ],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    DocumentPreparationRoutingModule,
    PipesModule,
  ],
  exports: [
    DocumentPreparationComponent,
    DocLitigationComponent,
    DocumentHeaderComponent,
    CommonDocumentTableComponent,
    DocBorrowerGuarantorComponent,
  ],
})
export class DocumentPreparationModule {}
