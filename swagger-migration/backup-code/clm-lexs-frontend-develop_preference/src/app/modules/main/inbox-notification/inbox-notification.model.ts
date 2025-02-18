export interface NotificationModel {
  messages: Messages;
  recipientUserId: string;
}

export interface Messages {
  content: Content[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: Sort;
  totalElements: number;
  totalPages: number;
}

export interface Content {
  customerId: string;
  financialId: number;
  hyperlink: Hyperlink;
  litigationCaseId: number;
  litigationId: string;
  messageDetails: string;
  messageHeader: string;
  notiId: number;
  notiMessageId: number;
  readDatetime: string;
  senderUserId: string;
  sentDatetime: string;
  status: string;
}

export interface Hyperlink {
  params: Param[];
  taskId: number;
  type: string;
  viewCode: string;
}

export interface Param {
  name: string;
  value: string;
}

export interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: Sort;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export const NotificationList = [
  {
    text: 'ที่ยังไม่ได้อ่าน',
    value: 'U',
  },
  {
    text: 'ที่อ่านแล้ว',
    value: 'R',
  },
  {
    text: 'แสดงทั้งหมด',
    value: 'A',
  },
];

export interface UnreadCountModel {
  recipientUserId: string;
  unreadCount: number;
}

export interface MarkReadMessagesModel {
  readMessages: ReadMessage[];
}

export interface ReadMessage {
  notiMessageId: number;
  readType: string;
}

export enum MESSAGE_STATUS {
  UNREAD = 'U',
  READ = 'R',
  ALL = 'A',
}
