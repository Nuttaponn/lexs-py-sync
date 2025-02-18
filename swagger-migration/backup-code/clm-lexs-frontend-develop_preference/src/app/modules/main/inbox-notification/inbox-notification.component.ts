import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDrawerMode } from '@angular/material/sidenav';
import { RouterService } from '@app/shared/services/router.service';
import { Utils } from '@app/shared/utils/util';
import {
  GetNotificationByRecipientResponse,
  MessageResponse,
  NotificationMarkReadRequest,
  PageOfMessageResponse,
  Param,
} from '@lexs/lexs-client';
import { DropDownConfig, PaginatorActionConfig, SimpleSelectOption } from '@spig/core';
import { interval, debounceTime, startWith, Subscription } from 'rxjs';
import { localParamsMapper, notificationMapper, notificationMapperTabIndex } from './inbox-notification.constant';
import { MESSAGE_STATUS, NotificationList, ReadMessage } from './inbox-notification.model';
import { InboxNotificationService } from './inbox-notification.service';
import { LoggerService } from '@app/shared/services/logger.service';

@Component({
  selector: 'app-inbox-notification',
  templateUrl: './inbox-notification.component.html',
  styleUrls: ['./inbox-notification.component.scss'],
})
export class InboxNotificationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() notificationCount!: number;
  @Input() notificationState: boolean = false;
  @Input() onUpdate!: boolean;
  @Output() closeNotification = new EventEmitter<void>();
  @Input() onPanelClose: (() => Promise<void>) | null = null;

  notificationObj!: GetNotificationByRecipientResponse;
  private lastSuccessfulNotificationObj!: GetNotificationByRecipientResponse;
  readMessages: ReadMessage[] = [];
  unreadCount: number | null = null;
  fetchPaginator: PageOfMessageResponse | undefined;
  currentPage = 0;
  selectedFilter: string = MESSAGE_STATUS.UNREAD;
  notificationFormControl!: UntypedFormControl;
  pageActionConfig!: PaginatorActionConfig;
  notificationMode: MatDrawerMode = 'side';
  selectedNotification: number | null = null;
  notificationDropdownConfig: DropDownConfig = {
    iconName: 'icon-Filter',
  };
  notificationOptions: SimpleSelectOption[] = NotificationList;
  private sub!: Subscription;

  constructor(
    private inboxNotificationService: InboxNotificationService,
    private routerService: RouterService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.onSetDropdownValue();
    this.subscribeNotification();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['onUpdate'] && changes['onUpdate'].currentValue) {
      this.refreshData();
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  subscribeNotification(): void {
    const POLLING_INTERVAL = 30 * 1000;
    this.sub = interval(POLLING_INTERVAL)
      .pipe(startWith(0))
      .subscribe(async () => {
        try {
          await this.fetchMessages(this.selectedFilter);
          this.lastSuccessfulNotificationObj = this.notificationObj;
          this.initialPaginator();
        } catch (err) {
          this.notificationObj = this.lastSuccessfulNotificationObj;
        }
      });
  }

  async fetchMessages(selectedFilter?: string): Promise<void> {
    const newNotification = await this.initialNotification(selectedFilter);
    if (newNotification && newNotification.messages && newNotification.messages.content) {
      this.fetchPaginator = newNotification.messages;
      newNotification.messages.content = newNotification.messages.content.filter(
        message => !this.isMessageRead(message)
      );
      this.notificationObj = newNotification;
      this.initialPaginator();
    }
    const newUnreadCount = await this.initialNotificationCounter();
    if (newUnreadCount !== null) {
      this.notificationCount = newUnreadCount;
      this.inboxNotificationService.updateNotificationCount(newUnreadCount);
    }
    this.onUpdateNotificationCount();
  }

  isMessageRead(message: MessageResponse): boolean {
    return this.readMessages.some(readMessage => readMessage.notiMessageId === message.notiMessageId);
  }

  async initialNotification(selectedFilter?: string): Promise<GetNotificationByRecipientResponse | null> {
    try {
      const type = {
        page: this.currentPage,
        size: 10,
        status: selectedFilter,
      };
      const notificationResponse = await this.inboxNotificationService.messagesByRecipient(
        type.page,
        type.size,
        type.status
      );
      return notificationResponse;
    } catch (error) {
      this.logger.catchError(error);
      return null;
    }
  }

  async initialNotificationCounter(): Promise<number | null> {
    try {
      const notificationCounter = await this.inboxNotificationService.unreadCountByRecipient();
      return notificationCounter.unreadCount || 0;
    } catch (error) {
      this.logger.catchError(error);
      return null;
    }
  }

  async submitMarkReadRequest(readMessages: ReadMessage[]): Promise<void> {
    try {
      const markReadRequest: NotificationMarkReadRequest = {
        readMessages: readMessages,
      };
      await this.inboxNotificationService.markReadByRecipient(markReadRequest);
    } catch (error) {
      this.logger.catchError(error);
    }
  }

  async onNotificationReader(
    notification: GetNotificationByRecipientResponse,
    messageIndex: number,
    readType: 'M' | 'H',
    newStatus?: string
  ): Promise<void> {
    if (!notification.messages || !notification.messages.content) {
      return;
    }
    const message = notification.messages.content[messageIndex];

    if (message.status === MESSAGE_STATUS.READ) {
      if (message.hyperlink?.viewCode && message.hyperlink.viewCode !== '') {
        this.onNavigatePath(message.hyperlink?.viewCode, message.hyperlink?.params);
      }
      return;
    }

    if (newStatus === MESSAGE_STATUS.READ && !this.isMessageInReadMessages(message.notiMessageId!)) {
      message.status === newStatus;
      await this.addReadMessage(message, readType);
      if (readType === 'H') {
        await this.submitMarkReadRequest(this.readMessages).then(async () => {
          this.onUpdateNotificationCount();
          await this.fetchMessages(this.selectedFilter);
        });
        this.readMessages = [];
        this.onNavigatePath(message.hyperlink?.viewCode, message.hyperlink?.params);
      }
    } else {
      return;
    }
  }

  onNavigatePath(viewCode?: string, paramsArray?: Array<Param>) {
    if (viewCode && notificationMapper.has(viewCode)) {
      const path = notificationMapper.get(viewCode);
      const tabIndex = notificationMapperTabIndex.get(viewCode);
      if (path) {
        const paramsObject: any = {};
        if (paramsArray) {
          paramsArray.forEach(params => {
            if (params.name) {
              paramsObject[params.name] = params.value;
            }
          });
        }
        this.logger.info('~ viewCode :: ', viewCode, ' ~ paramsObject:', paramsObject);

        // verify and assign tab / subTab / underSubTab value
        const _tabIndex = tabIndex?.tabIndex || 0;
        const _subIndex = tabIndex?.subIndex || 0;
        const _underSubIndex = tabIndex?.underSubIndex || 0;

        const _paramsObjectWithLocal = !!localParamsMapper.get(viewCode)
          ? {
              ...paramsObject,
              ...localParamsMapper.get(viewCode),
            }
          : { ...paramsObject };
        this.routerService.fromNotiMenu = true;
        this.routerService.navigateTo('/main/notification-landing', {
          ..._paramsObjectWithLocal,
          ...{ _tabIndex, _subIndex, _underSubIndex, nextPath: path },
        });
        this.closeNotification.emit();
      }
    }
  }

  async addReadMessage(message: MessageResponse, readType: 'M' | 'H'): Promise<void> {
    const readMessage: ReadMessage = {
      notiMessageId: message.notiMessageId!,
      readType: readType,
    };
    this.readMessages.push(readMessage);
  }

  onNotificationClose(): void {
    this.notificationFormControl.setValue(this.notificationOptions[0].value);
    this.closeNotification.emit();
  }

  onSetDropdownValue(): void {
    this.notificationFormControl = new UntypedFormControl(this.notificationOptions[0].value);
    this.notificationFormControl.valueChanges.pipe(debounceTime(15)).subscribe(async selectedValue => {
      this.notificationObj = {};
      this.selectedFilter = selectedValue;
      if (this.readMessages.length > 0) {
        this.submitMarkReadRequest(this.readMessages).then(() => this.onUpdateNotificationCount());
        this.readMessages = [];
      }
      this.currentPage = 0;
      await this.fetchMessages(this.selectedFilter);
    });
  }

  async onRadioButtonClick(notification: GetNotificationByRecipientResponse, messageIndex: number): Promise<void> {
    if (!notification.messages || !notification.messages.content) {
      return;
    }
    const message = notification.messages.content[messageIndex];
    if (!this.isMessageInReadMessages(message.notiMessageId!)) {
      message.status = MESSAGE_STATUS.READ;
      await this.addReadMessage(message, 'M');
    }
    const allRead = notification.messages.content.every(message => this.isMessageRead(message));

    if (
      allRead &&
      this.fetchPaginator &&
      this.fetchPaginator.totalPages &&
      this.currentPage < this.fetchPaginator.totalPages - 1
    ) {
      this.currentPage += 1;
      await this.fetchMessages(this.selectedFilter);
    }
  }

  onUpdateNotificationCount(): void {
    this.inboxNotificationService.updateNotificationCount(this.notificationCount);
  }

  isMessageInReadMessages(notiMessageId: number): boolean {
    return this.readMessages.some(readMessage => readMessage.notiMessageId === notiMessageId);
  }

  isMessageVisible(message: MessageResponse): boolean {
    if (!message) {
      return false;
    }
    const selectedFilter = this.notificationFormControl.value;
    return message.status === selectedFilter || selectedFilter === MESSAGE_STATUS.ALL;
  }

  hasUnreadMessage(): boolean {
    const selectedFilter = this.notificationFormControl.value;

    if (!this.notificationObj || Object.keys(this.notificationObj).length === 0) {
      return true;
    }

    const hasMessagesWithSelectedFilter = this.notificationObj.messages?.content?.some(
      message => message.status === selectedFilter
    );

    const hasMessagesInRorU = this.notificationObj.messages?.content?.some(
      message => message.status === MESSAGE_STATUS.READ || message.status === MESSAGE_STATUS.UNREAD
    );

    if (selectedFilter === MESSAGE_STATUS.ALL) {
      return !hasMessagesInRorU;
    }

    return !hasMessagesWithSelectedFilter;
  }

  hasVisibleMessages(): boolean {
    return this.notificationObj.messages?.content?.some(message => this.isMessageVisible(message)) || false;
  }

  isMessageHidden(message: MessageResponse): boolean {
    return this.readMessages.some(hiddenMessage => hiddenMessage.notiMessageId === message.notiMessageId);
  }

  async onPageChange(event: number): Promise<void> {
    const currentSelectedValue = this.notificationFormControl.value;
    this.currentPage = event - 1;
    await this.fetchMessages(currentSelectedValue);
  }

  initialPaginator(): void {
    const paginator = this.fetchPaginator;
    const { resultConfig, actionConfig } = Utils.setPagination(
      paginator?.pageable,
      paginator?.numberOfElements,
      paginator?.totalPages,
      paginator?.totalElements
    );
    this.pageActionConfig = actionConfig;
  }

  async refreshData(): Promise<void> {
    this.notificationObj = {};
    this.notificationFormControl.setValue(this.notificationOptions[0].value);
    await this.fetchMessages(MESSAGE_STATUS.UNREAD);
    const newNotification = await this.initialNotification();
    if (newNotification) {
      this.notificationObj = newNotification;
    }
  }
}
