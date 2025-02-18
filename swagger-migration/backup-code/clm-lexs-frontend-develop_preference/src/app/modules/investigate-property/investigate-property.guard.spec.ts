import { TestBed } from '@angular/core/testing';

import { InvestigatePropertyGuard } from './investigate-property.guard';

describe('InvestigatePropertyGuard', () => {
  let guard: InvestigatePropertyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InvestigatePropertyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
