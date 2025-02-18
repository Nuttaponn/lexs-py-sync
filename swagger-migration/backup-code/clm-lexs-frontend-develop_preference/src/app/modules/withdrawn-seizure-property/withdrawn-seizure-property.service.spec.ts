import { TestBed } from '@angular/core/testing';

import { WithdrawnSeizurePropertyService } from './withdrawn-seizure-property.service';

describe('WithdrawnSeizurePropertyService', () => {
  let service: WithdrawnSeizurePropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WithdrawnSeizurePropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
