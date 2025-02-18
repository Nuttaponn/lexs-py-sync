import { TestBed } from '@angular/core/testing';

import { AdvanceDetailResolver } from './advance-detail.resolver';

describe('AdvanceDetailResolver', () => {
  let resolver: AdvanceDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AdvanceDetailResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
