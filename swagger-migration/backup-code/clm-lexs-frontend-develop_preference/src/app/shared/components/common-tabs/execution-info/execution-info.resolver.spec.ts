import { TestBed } from '@angular/core/testing';

import { ExecutionInfoResolver } from './execution-info.resolver';

describe('ExecutionInfoResolver', () => {
  let resolver: ExecutionInfoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ExecutionInfoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
