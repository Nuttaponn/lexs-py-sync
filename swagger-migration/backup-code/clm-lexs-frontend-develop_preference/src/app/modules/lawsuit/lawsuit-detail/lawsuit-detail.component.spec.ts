import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionBarComponent } from '@app/shared/components/action-bar/action-bar.component';
import { AccountAndDebtComponent } from '@app/shared/components/common-tabs/account-and-debt/account-and-debt.component';
import { CollateralInfoComponent } from '@app/shared/components/common-tabs/collateral-info/collateral-info.component';
import { LitigationSummaryComponent } from '@app/shared/components/common-tabs/litigation-summary/litigation-summary.component';
import { DocBorrowerGuarantorComponent } from '@app/shared/components/document-preparation/doc-borrower-guarantor/doc-borrower-guarantor.component';
import { DocCollateralComponent } from '@app/shared/components/document-preparation/doc-collateral/doc-collateral.component';
import { DocLitigationComponent } from '@app/shared/components/document-preparation/doc-litigation/doc-litigation.component';
import { DocumentAccountComponent } from '@app/shared/components/document-preparation/document-account/document-account.component';
import { DocumentHeaderComponent } from '@app/shared/components/document-preparation/document-header/document-header.component';
import { DocumentPreparationComponent } from '@app/shared/components/document-preparation/document-preparation/document-preparation.component';
import { MessageBannerComponent } from '@app/shared/components/message-banner/message-banner.component';
import { MessageEmptyComponent } from '@app/shared/components/message-empty/message-empty.component';
import { TooltipComponent } from '@app/shared/components/tooltip/tooltip.component';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';
import { BuddhistEraPipe, PaginatorComponent } from '@spig/core';

import { LetterComponent } from '@app/shared/components/common-tabs/prepare-lawsuit/notice/letter/letter.component';
import { NewspaperComponent } from '@app/shared/components/common-tabs/prepare-lawsuit/notice/newspaper/newspaper.component';
import { NoticeComponent } from '@app/shared/components/common-tabs/prepare-lawsuit/notice/notice.component';
import { PrepareLawsuitComponent } from '@app/shared/components/common-tabs/prepare-lawsuit/prepare-lawsuit.component';
import { LawsuitDetailComponent } from './lawsuit-detail.component';

describe('LawsuitDetailComponent', () => {
  let component: LawsuitDetailComponent;
  let fixture: ComponentFixture<LawsuitDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LawsuitDetailComponent,
        CollateralInfoComponent,
        LitigationSummaryComponent,
        ActionBarComponent,
        AccountAndDebtComponent,
        PrepareLawsuitComponent,
        DocumentPreparationComponent,
        PaginatorComponent,
        DocBorrowerGuarantorComponent,
        DocCollateralComponent,
        DocLitigationComponent,
        NoticeComponent,
        DocumentAccountComponent,
        MessageEmptyComponent,
        BuddhistEraPipe,
        DocumentHeaderComponent,
        LetterComponent,
        MessageBannerComponent,
        NewspaperComponent,
        TooltipComponent,
      ],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LawsuitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
