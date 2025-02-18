import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalExecutionWithdrawConfirmationDialogComponent } from './legal-execution-withdraw-confirmation-dialog.component';

describe('LegalExecutionWithdrawConfirmationDialogComponent', () => {
  let component: LegalExecutionWithdrawConfirmationDialogComponent;
  let fixture: ComponentFixture<LegalExecutionWithdrawConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegalExecutionWithdrawConfirmationDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalExecutionWithdrawConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
