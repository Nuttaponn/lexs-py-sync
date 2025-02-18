export type CopyColumnDisplayOption = 'CHOOSE_DOCUMENT' | 'LINK' | 'EDIT' | 'NONE';

export interface ReadyStatus {
  activeNotice: number;
  activeLitigation: number;
  totalNotice: number;
  totalLitigation: number;
  activeSent: number;
  totalSent: number;
  activeReceived: number;
  totalReceived: number;
}
