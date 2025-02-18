import { TestBed } from '@angular/core/testing';

import { InvestigatePropertyResolver } from './investigate-property.resolver';

describe('InvestigatePropertyResolver', () => {
  let resolver: InvestigatePropertyResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(InvestigatePropertyResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
