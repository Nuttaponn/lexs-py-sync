import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentBookComponent } from './create-payment-book.component';

describe('CreatePaymentBookComponent', () => {
  let component: CreatePaymentBookComponent;
  let fixture: ComponentFixture<CreatePaymentBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePaymentBookComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePaymentBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
