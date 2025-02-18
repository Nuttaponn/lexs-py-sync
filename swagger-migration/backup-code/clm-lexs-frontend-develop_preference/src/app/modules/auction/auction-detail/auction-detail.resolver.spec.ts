import { TestBed } from '@angular/core/testing';

import { AuctionDetailResolver } from './auction-detail.resolver';

describe('AuctionDetailResolver', () => {
  let resolver: AuctionDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AuctionDetailResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
