import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';
import { MessageEmptyComponent } from '../../message-empty/message-empty.component';
import { DocBorrowerGuarantorComponent } from '../doc-borrower-guarantor/doc-borrower-guarantor.component';
import { DocCollateralComponent } from '../doc-collateral/doc-collateral.component';
import { DocLitigationComponent } from '../doc-litigation/doc-litigation.component';
import { DocumentAccountComponent } from '../document-account/document-account.component';
import { DocumentHeaderComponent } from '../document-header/document-header.component';

import { DocumentPreparationComponent } from './document-preparation.component';

describe('DocumentPreparationComponent', () => {
  let component: DocumentPreparationComponent;
  let fixture: ComponentFixture<DocumentPreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentPreparationComponent,
        MessageEmptyComponent,
        DocBorrowerGuarantorComponent,
        DocumentAccountComponent,
        DocCollateralComponent,
        DocumentHeaderComponent,
        DocLitigationComponent,
      ],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
