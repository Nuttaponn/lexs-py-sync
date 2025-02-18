import { Injectable } from '@angular/core';
import {
  GetNotificationByRecipientResponse,
  NotiUsersUnreadCountResponse,
  NotificationControllerService,
  NotificationMarkReadRequest,
  NotificationMarkReadResponse,
} from '@lexs/lexs-client';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InboxNotificationService {
  private notificationCountSubject = new BehaviorSubject<number>(0);
  notificationCount$ = this.notificationCountSubject.asObservable();

  constructor(private notificationControllerService: NotificationControllerService) {}

  async messagesByRecipient(
    page?: number,
    size?: number,
    status?: string
  ): Promise<GetNotificationByRecipientResponse> {
    return await lastValueFrom(this.notificationControllerService.messagesByRecipient(page, size, status));
  }

  async unreadCountByRecipient(): Promise<NotiUsersUnreadCountResponse> {
    return await lastValueFrom(this.notificationControllerService.unreadCountByRecipient());
  }

  async markReadByRecipient(request: NotificationMarkReadRequest): Promise<NotificationMarkReadResponse> {
    return await lastValueFrom(this.notificationControllerService.markReadByRecipient(request));
  }

  updateNotificationCount(newCount: number): void {
    this.notificationCountSubject.next(newCount);
  }
}
