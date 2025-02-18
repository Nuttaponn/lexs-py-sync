import { TestBed } from '@angular/core/testing';

import { ProfileDirectService } from './profile-direct.service';

describe('ProfileDirectService', () => {
  let service: ProfileDirectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileDirectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
