import { TestBed } from '@angular/core/testing';

import { CivilCaseInfoService } from './civil-case-info.service';

describe('CivilCaseInfoService', () => {
  let service: CivilCaseInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CivilCaseInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
