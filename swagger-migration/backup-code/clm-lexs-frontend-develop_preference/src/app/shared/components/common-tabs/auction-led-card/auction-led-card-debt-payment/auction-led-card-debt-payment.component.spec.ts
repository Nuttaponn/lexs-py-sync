import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionLedCardDebtPaymentComponent } from './auction-led-card-debt-payment.component';

describe('AuctionLedCardDebtPaymentComponent', () => {
  let component: AuctionLedCardDebtPaymentComponent;
  let fixture: ComponentFixture<AuctionLedCardDebtPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionLedCardDebtPaymentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionLedCardDebtPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
