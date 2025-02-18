import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateStore } from '@ngx-translate/core';
import { SpigCoreModule } from '@spig/core';

import { InboxNotificationComponent } from './inbox-notification.component';
import { NotificationService } from './service/notification.service';

describe('InboxNotificationComponent', () => {
  let component: InboxNotificationComponent;
  let fixture: ComponentFixture<InboxNotificationComponent>;
  let mockNotificationService: Partial<NotificationService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [InboxNotificationComponent],
    imports: [ReactiveFormsModule,
        FormsModule,
        MatRadioModule,
        MatIconModule,
        MatDividerModule,
        SpigCoreModule,
        BrowserAnimationsModule,
        NoopAnimationsModule],
    providers: [TranslateStore, provideHttpClient(withInterceptorsFromDi())]
}).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(InboxNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('should call subscribeNotification and update notificationList and notificationCount', fakeAsync(() => {
    const initialNotificationMock = {
      messages: {
        content: [
          {
            notiId: 1,
            notiMessageId: 1,
          },
        ],
      },
    };
    component.initialNotification = jest.fn().mockResolvedValue(initialNotificationMock);
    component.initialNotificationCounter = jest.fn().mockResolvedValue(2);
    mockNotificationService.updateNotificationCount = jest.fn();

    component.subscribeNotification();
    tick(30000);
    expect(component.notificationList).toContain(initialNotificationMock);
    expect(component.notificationCount).toBe(2);
    expect(mockNotificationService.updateNotificationCount).toHaveBeenCalledWith(2);
  }));
});
