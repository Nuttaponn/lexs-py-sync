import { TestBed } from '@angular/core/testing';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    });
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
