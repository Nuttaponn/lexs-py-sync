import { SeizureDocumentTemplate } from '@lexs/lexs-client';

/**
 * Table รายการที่ต้องบันทึก
 */
export const DocumentColumns = ['no', 'documentName', 'documentDate', 'documentAction'];

export type IDocumentAction = {
  uploaded: boolean;
  reuploadable: boolean;
  hidden: boolean;
  disabled: boolean;
  colorClass: 'primary' | 'warn' | 'link';
  deletable?: boolean;
};

export type IDocumentMTable = {
  refs?: any;
  optional: boolean;
  orderNumber: string;
  docType: string;
  documentTemplate: SeizureDocumentTemplate;
  documentName: string;
  documentDate: string;
  action: IDocumentAction;
  sendChannel: IDocumentSendChannel;
};

export type IDocumentSendChannel = {
  display: {
    checkbox: boolean;
    label: boolean;
  };
  checked: boolean;
  disabled: boolean;
};
