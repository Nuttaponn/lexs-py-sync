import { TestBed } from '@angular/core/testing';

import { CommonTabsService } from './common-tabs.service';

describe('CommonTabsService', () => {
  let service: CommonTabsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonTabsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
