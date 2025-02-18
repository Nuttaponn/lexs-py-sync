import { TestBed } from '@angular/core/testing';

import { AucAnnounementMatchResolver } from './auc-announement-match.resolver';

describe('AucAnnounementMatchResolver', () => {
  let resolver: AucAnnounementMatchResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AucAnnounementMatchResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
