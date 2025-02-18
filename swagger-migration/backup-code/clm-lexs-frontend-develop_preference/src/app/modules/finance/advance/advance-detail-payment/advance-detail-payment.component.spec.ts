import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceDetailPaymentComponent } from './advance-detail-payment.component';

describe('AdvanceDetailPaymentComponent', () => {
  let component: AdvanceDetailPaymentComponent;
  let fixture: ComponentFixture<AdvanceDetailPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvanceDetailPaymentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceDetailPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
