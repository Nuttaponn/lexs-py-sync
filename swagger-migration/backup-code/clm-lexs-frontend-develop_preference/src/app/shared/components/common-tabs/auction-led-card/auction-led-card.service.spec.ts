import { TestBed } from '@angular/core/testing';

import { AuctionLedCardService } from './auction-led-card.service';

describe('AuctionLedCardService', () => {
  let service: AuctionLedCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuctionLedCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
