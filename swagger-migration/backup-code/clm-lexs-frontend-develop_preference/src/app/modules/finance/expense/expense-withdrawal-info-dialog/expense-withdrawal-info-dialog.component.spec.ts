import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseWithdrawalInfoDialogComponent } from './expense-withdrawal-info-dialog.component';

describe('ExpenseWithdrawalInfoDialogComponent', () => {
  let component: ExpenseWithdrawalInfoDialogComponent;
  let fixture: ComponentFixture<ExpenseWithdrawalInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpenseWithdrawalInfoDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseWithdrawalInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
