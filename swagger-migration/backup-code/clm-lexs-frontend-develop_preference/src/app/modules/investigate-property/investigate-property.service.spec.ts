import { TestBed } from '@angular/core/testing';

import { InvestigatePropertyService } from './investigate-property.service';

describe('InvestigatePropertyService', () => {
  let service: InvestigatePropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestigatePropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
