import { TestBed } from '@angular/core/testing';

import { WithdrawnSeizurePropertySelectResolver } from './withdrawn-seizure-property-select.resolver';

describe('WithdrawnSeizurePropertySelectResolver', () => {
  let resolver: WithdrawnSeizurePropertySelectResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(WithdrawnSeizurePropertySelectResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
