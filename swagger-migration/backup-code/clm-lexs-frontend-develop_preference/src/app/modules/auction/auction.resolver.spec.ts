import { TestBed } from '@angular/core/testing';

import { AuctionResolver } from './auction.resolver';

describe('AuctionResolver', () => {
  let resolver: AuctionResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AuctionResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
