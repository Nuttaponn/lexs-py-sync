import { TestBed } from '@angular/core/testing';

import { SeizurePropertyInfoService } from './seizure-property-info.service';

describe('SeizurePropertyInfoService', () => {
  let service: SeizurePropertyInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeizurePropertyInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
