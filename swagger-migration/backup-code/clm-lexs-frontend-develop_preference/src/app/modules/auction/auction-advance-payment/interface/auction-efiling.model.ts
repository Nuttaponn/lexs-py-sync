import { IUploadMultiFile, IUploadMultiInfo } from '@app/shared/models';
import { SimpleSelectOption } from '@spig/core';

export const AuctionEfilingDialogModel = {
  title: 'ใบแจ้งหนี้ค่าใช้จ่ายประกาศขายทอดตลาด',
  uploadInfo: {
    taskId: '',
    cif: '',
    documentTemplateId: '',
  },
  isUploaded: false,
  isRequired: false,
  isSubmitted: false,
};

export const AuctionEfilingOrderDialogModel = {
  title: 'อัปโหลดใบเสร็จ (PDF ไม่เกิน 30MB)',
  uploadInfo: {
    taskId: '',
    cif: '',
    documentTemplateId: '',
  },
  isUploaded: false,
  isRequired: false,
  isSubmitted: false,
};

export const AuctionUploadInvoiceForm = {
  amount: 0,
  companyCode: '',
  imageId: '',
  imageName: '',
  invoiceDueDate: '',
  invoiceId: 0,
  ledName: '',
  paid: false,
  paidTimestamp: '',
  redCaseNo: '',
  refNo1: '',
  refNo2: '',
  status: '',
  uploadFlag: false,
};

export const AuctionUploadReceiptForm = {
  amount: 0,
  blackCaseNo: '',
  court: '',
  imageId: '',
  imageName: '',
  ledName: '',
  receiptBookNo: '',
  receiptNo: '',
  redCaseNo: '',
};

export const VIEW_TYPE = {
  VIEW_ACCESS: 'R2E09-14-3C_PENDING_SAVE',
  EDIT_ACCESS: 'R2E09-14-3C_PENDING_REVIEW',
  REJECT_ACCESS: 'R2E09-14-3C_PENDING_UPDATE',
  APPROVAL_ACCESS: 'R2E09-14-3C_PENDING_APPROVAL',
  UPLOAD_RECEIPT_VIEW_ACCESS: 'R2E35-02-E09-01-7A_PENDING_RECEIPT_UPLOAD',
  UPLOAD_RECEIPT_PENDING_VIEW_ACCESS: 'R2E35-02-E09-02-7B_PENDING_RECEIPT_VERIFICATION',
  UPLOAD_RECEIPT_REJECT_VIEW_ACCESS: 'R2E35-02-E09-02-7B_PENDING_RECEIPT_UPDATE',
  COMPLETE: 'COMPLETE',
};

export const DEFAULT_UPLOAD_MULTI_INFO: IUploadMultiInfo = {
  cif: '',
  litigationId: '',
};

export const DEFAULT_UPLOAD_MULTI_ORDER_INFO: IUploadMultiInfo = {
  cif: '',
  litigationId: '',
};

export const DEFAULT_DOCUMENT_UPLOAD = [
  {
    documentTemplate: {
      documentName: 'หมายเรียกวางเงินเพิ่ม',
    },
    documentTemplateId: '', // TODO ADD DOC_TEMPLATE AS TEMPLATE ID
    uploadRequired: true,
    viewOnly: true,
    removeDocument: true,
  } as IUploadMultiFile,
];

export const DEFAULT_DOCUMENT_ORDER_UPLOAD = [
  {
    documentTemplate: {
      documentName: 'คำสั่งเจ้าพนักงานบังคับคดี',
    },
    documentTemplateId: '', // TODO ADD DOC_TEMPLATE AS TEMPLATE ID
    uploadRequired: true,
    viewOnly: true,
    removeDocument: true,
  } as IUploadMultiFile,
];

export const DEFAULT_DROPDOWN_LAWYER: SimpleSelectOption[] = [
  {
    text: 'WAIT BE DATA', // TODO SET DEFAULT VALUE TO NULL OR EMPTY_STRING TO APPLY VALUE TO API (CONCAT)
    value: 'WAIT_DATA', // TODO SET DEFAULT VALUE TO NULL OR EMPTY_STRING TO APPLY VALUE TO API (CONCAT)
  },
];

export const DEFAULT_DROPDOWN_CASHIER: SimpleSelectOption[] = [
  {
    text: 'WAIT BE DATA', // TODO SET DEFAULT VALUE TO NULL OR EMPTY_STRING TO APPLY VALUE TO API (CONCAT)
    value: 'WAIT_DATA', // TODO SET DEFAULT VALUE TO NULL OR EMPTY_STRING TO APPLY VALUE TO API (CONCAT)
  },
];

export const TABLE_COL_DISPLAY: string[] = ['no', 'paymentAmount', 'paymentDate'];

export const AUCTION_EXPENSE_TYPE = {
  SUMMON_FOR_SURCHARGE_E_FILING: 'SUMMON_FOR_SURCHARGE_E_FILING',
  WRIT_OF_EXECUTE_E_FILING: 'WRIT_OF_EXECUTE_E_FILING',
  SUMMON_FOR_SURCHARGE_CASHIER_CHEQUE: 'SUMMON_FOR_SURCHARGE_CASHIER_CHEQUE',
  WRIT_OF_EXECUTE_CASHIER_CHEQUE: 'WRIT_OF_EXECUTE_CASHIER_CHEQUE',
};
