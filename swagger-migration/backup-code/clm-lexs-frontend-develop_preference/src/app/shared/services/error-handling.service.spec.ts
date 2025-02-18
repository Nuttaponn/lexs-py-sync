import { TestBed } from '@angular/core/testing';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { ErrorHandlingService } from './error-handling.service';

describe('ErrorHandlingService', () => {
  let service: ErrorHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    });
    service = TestBed.inject(ErrorHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
