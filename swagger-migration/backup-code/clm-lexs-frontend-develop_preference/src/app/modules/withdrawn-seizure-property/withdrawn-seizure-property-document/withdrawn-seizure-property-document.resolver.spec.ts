import { TestBed } from '@angular/core/testing';

import { WithdrawnSeizurePropertyDocumentResolver } from './withdrawn-seizure-property-document.resolver';

describe('WithdrawnSeizurePropertyDocumentResolver', () => {
  let resolver: WithdrawnSeizurePropertyDocumentResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(WithdrawnSeizurePropertyDocumentResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
