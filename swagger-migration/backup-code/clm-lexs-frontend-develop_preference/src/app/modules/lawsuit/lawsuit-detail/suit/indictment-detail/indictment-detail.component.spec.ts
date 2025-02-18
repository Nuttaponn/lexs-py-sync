import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { ActionBarComponent } from '@app/shared/components/action-bar/action-bar.component';
import { TooltipComponent } from '@app/shared/components/tooltip/tooltip.component';
import { UploadMultiFileContentComponent } from '@app/shared/components/upload-multi-file-content/upload-multi-file-content.component';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { IndictmentDetailComponent } from './indictment-detail.component';

describe('TaskDetailComponent', () => {
  let component: IndictmentDetailComponent;
  let fixture: ComponentFixture<IndictmentDetailComponent>;
  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndictmentDetailComponent, ActionBarComponent, TooltipComponent, UploadMultiFileContentComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration, { provide: UntypedFormBuilder, useValue: formBuilder }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndictmentDetailComponent);
    component = fixture.componentInstance;
    component.dataForm = formBuilder.group({
      actionFlag: [{ value: false, disabled: false }],
      appealDate: [{ value: '', disabled: false }],
      appealDueDate: [{ value: '', disabled: false }],
      appealSide: [{ value: '', disabled: false }],
      blackCaseNo: [{ value: '', disabled: false }],
      briefCase: [{ value: '', disabled: false }],
      capitalAmount: [{ value: 0, disabled: false }],
      caseDate: [{ value: '', disabled: false }],
      caseType: [{ value: {}, disabled: false }],
      channel: [{ value: 'EFILING', disabled: false }],
      civilCourtBlackCaseNo: [{ value: '', disabled: false }],
      courtCode: [{ value: '', disabled: false }],
      courtDecreeDate: [{ value: '', disabled: false }],
      courtDecreeResult: [{ value: '', disabled: false }],
      courtDecreeStatus: [{ value: '', disabled: false }],
      courtFee: [{ value: 0, disabled: false }],
      courtFeeStatus: [{ value: '', disabled: false }],
      courtLevel: [{ value: '', disabled: false }],
      courtName: [{ value: '', disabled: false }],
      courtVerdictDate: [{ value: '', disabled: false }],
      courtVerdictType: [{ value: '', disabled: false }],
      filingFee: [{ value: '', disabled: false }],
      id: [{ value: 0, disabled: false }],
      lawyerId: [{ value: '', disabled: false }],
      lawyerName: [{ value: '', disabled: false }],
      lawyerOfficeCode: [{ value: '', disabled: false }],
      lawyerOfficeName: [{ value: '', disabled: false }],
      litigationCaseAccounts: formBuilder.array([]),
      litigationCaseAllegations: [{ value: '', disabled: false }],
      litigationCost: [{ value: 0, disabled: false }],
      litigationDocuments: formBuilder.array([]),
      paymentAuditingStatus: [{ value: '', disabled: false }],
      persons: formBuilder.array([]),
      pleadingFee: [{ value: 0, disabled: false }],
      redCaseNo: [{ value: '', disabled: false }],
      sla: [{ value: '', disabled: false }],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
