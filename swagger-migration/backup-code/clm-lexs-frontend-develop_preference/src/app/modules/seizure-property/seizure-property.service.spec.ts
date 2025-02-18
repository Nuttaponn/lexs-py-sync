import { TestBed } from '@angular/core/testing';

import { SeizurePropertyService } from './seizure-property.service';

describe('SeizurePropertyService', () => {
  let service: SeizurePropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeizurePropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
