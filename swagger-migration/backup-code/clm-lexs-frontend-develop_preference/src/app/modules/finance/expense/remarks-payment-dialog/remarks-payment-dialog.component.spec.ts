import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarksPaymentDialogComponent } from './remarks-payment-dialog.component';

describe('RemarksPaymentDialogComponent', () => {
  let component: RemarksPaymentDialogComponent;
  let fixture: ComponentFixture<RemarksPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemarksPaymentDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemarksPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
