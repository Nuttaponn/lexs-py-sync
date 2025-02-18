import { TestBed } from '@angular/core/testing';

import { AuctionDetailItemPaymentResultService } from './auction-detail-item-payment-result.service';

describe('AuctionDetailItemPaymentResultService', () => {
  let service: AuctionDetailItemPaymentResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuctionDetailItemPaymentResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
