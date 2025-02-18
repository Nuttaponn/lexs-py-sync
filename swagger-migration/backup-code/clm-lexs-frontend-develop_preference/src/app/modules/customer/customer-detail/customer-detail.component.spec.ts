import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionBarComponent } from '@app/shared/components/action-bar/action-bar.component';
import { AccountInfoComponent } from '@app/shared/components/common-tabs/account-info/account-info.component';
import { CaseInfoComponent } from '@app/shared/components/common-tabs/case-info/case-info.component';
import { CollateralInfoComponent } from '@app/shared/components/common-tabs/collateral-info/collateral-info.component';
import { DocBorrowerGuarantorComponent } from '@app/shared/components/document-preparation/doc-borrower-guarantor/doc-borrower-guarantor.component';
import { DocCollateralComponent } from '@app/shared/components/document-preparation/doc-collateral/doc-collateral.component';
import { DocLitigationComponent } from '@app/shared/components/document-preparation/doc-litigation/doc-litigation.component';
import { DocumentAccountComponent } from '@app/shared/components/document-preparation/document-account/document-account.component';
import { DocumentHeaderComponent } from '@app/shared/components/document-preparation/document-header/document-header.component';
import { DocumentPreparationComponent } from '@app/shared/components/document-preparation/document-preparation/document-preparation.component';
import { MessageEmptyComponent } from '@app/shared/components/message-empty/message-empty.component';
import { TooltipComponent } from '@app/shared/components/tooltip/tooltip.component';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';
import { CustomerDetailComponent } from './customer-detail.component';

describe('CustomerDetailComponent', () => {
  let component: CustomerDetailComponent;
  let fixture: ComponentFixture<CustomerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CustomerDetailComponent,
        CollateralInfoComponent,
        MessageEmptyComponent,
        AccountInfoComponent,
        CaseInfoComponent,
        TooltipComponent,
        ActionBarComponent,
        ActionBarComponent,
        DocumentPreparationComponent,
        DocBorrowerGuarantorComponent,
        DocCollateralComponent,
        DocLitigationComponent,
        DocumentAccountComponent,
        DocumentHeaderComponent,
      ],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
