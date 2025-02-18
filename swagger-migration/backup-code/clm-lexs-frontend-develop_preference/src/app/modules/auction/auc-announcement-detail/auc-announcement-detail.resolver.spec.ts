import { TestBed } from '@angular/core/testing';

import { AucAnnouncementDetailResolver } from './auc-announcement-detail.resolver';

describe('AucAnnouncementDetailResolver', () => {
  let resolver: AucAnnouncementDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AucAnnouncementDetailResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
