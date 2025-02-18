import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawLawsuitDefendantDialogComponent } from './withdraw-lawsuit-defendant-dialog.component';

describe('WithdrawLawsuitDefendantDialogComponent', () => {
  let component: WithdrawLawsuitDefendantDialogComponent;
  let fixture: ComponentFixture<WithdrawLawsuitDefendantDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawLawsuitDefendantDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawLawsuitDefendantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
