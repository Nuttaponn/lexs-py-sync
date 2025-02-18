import { TestBed } from '@angular/core/testing';

import { AuctionGuard } from './auction.guard';

describe('AuctionGuard', () => {
  let guard: AuctionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuctionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
