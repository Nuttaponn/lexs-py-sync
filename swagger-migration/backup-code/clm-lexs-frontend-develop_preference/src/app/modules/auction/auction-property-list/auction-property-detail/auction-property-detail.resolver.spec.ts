import { TestBed } from '@angular/core/testing';

import { AuctionPropertyDetailResolver } from './auction-property-detail.resolver';

describe('AuctionPropertyDetailResolver', () => {
  let resolver: AuctionPropertyDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AuctionPropertyDetailResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
