import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionPaymentEfilingComponent } from './auction-payment-efiling.component';

describe('AuctionPaymentEfilingComponent', () => {
  let component: AuctionPaymentEfilingComponent;
  let fixture: ComponentFixture<AuctionPaymentEfilingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionPaymentEfilingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionPaymentEfilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
