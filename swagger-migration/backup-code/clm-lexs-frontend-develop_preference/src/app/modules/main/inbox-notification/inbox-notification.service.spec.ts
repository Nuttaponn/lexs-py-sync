import { TestBed } from '@angular/core/testing';

import { InboxNotificationService } from './inbox-notification.service';

describe('InboxNotificationService', () => {
  let service: InboxNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InboxNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
