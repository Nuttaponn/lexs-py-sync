import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentListDialogComponent } from './add-payment-list-dialog.component';

describe('AddPaymentListDialogComponent', () => {
  let component: AddPaymentListDialogComponent;
  let fixture: ComponentFixture<AddPaymentListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPaymentListDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
