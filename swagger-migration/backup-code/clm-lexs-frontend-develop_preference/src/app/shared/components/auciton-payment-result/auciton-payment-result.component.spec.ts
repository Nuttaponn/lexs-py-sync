import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AucitonPaymentResultComponent } from './auciton-payment-result.component';

describe('AucitonPaymentResultComponent', () => {
  let component: AucitonPaymentResultComponent;
  let fixture: ComponentFixture<AucitonPaymentResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AucitonPaymentResultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AucitonPaymentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
