import { TestBed } from '@angular/core/testing';

import { AuctionDetailItemPaymentResultResolver } from './auction-detail-item-payment-result.resolver';

describe('AuctionDetailItemPaymentResultResolver', () => {
  let resolver: AuctionDetailItemPaymentResultResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AuctionDetailItemPaymentResultResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
