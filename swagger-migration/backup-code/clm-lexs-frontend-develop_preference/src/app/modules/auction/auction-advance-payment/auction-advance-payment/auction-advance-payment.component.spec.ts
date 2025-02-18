import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionAdvancePaymentComponent } from './auction-advance-payment.component';

describe('AuctionAdvancePaymentComponent', () => {
  let component: AuctionAdvancePaymentComponent;
  let fixture: ComponentFixture<AuctionAdvancePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionAdvancePaymentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionAdvancePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
