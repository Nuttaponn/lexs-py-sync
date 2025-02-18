import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionDetailItemPaymentResultComponent } from './auction-detail-item-payment-result.component';

describe('AuctionDetailItemPaymentResultComponent', () => {
  let component: AuctionDetailItemPaymentResultComponent;
  let fixture: ComponentFixture<AuctionDetailItemPaymentResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionDetailItemPaymentResultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionDetailItemPaymentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
