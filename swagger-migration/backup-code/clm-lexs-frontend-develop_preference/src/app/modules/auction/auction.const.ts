import { ITooltip } from '@app/shared/models';
import {
  CollateralDocument,
  ConveyanceDeedGroupDocument,
  ConveyanceDocumentUploadResponse,
  DebitTransaction,
  DebtSettlementAccount,
  DebtSettlementTransaction,
  DocumentTemplateDto,
  MasAppointmentInfoResponse,
  NameValuePair,
  TransferDocument,
  TransferProperty,
} from '@lexs/lexs-client';

/**
 * สถานะหลักประกัน (LEXS)
 */
export enum AuctionResultSubmitStatus {
  /**
   * ขายทอดตลาดได้
   */
  SOLD = 'SOLD',
  /**
   * ขายทอดตลาดไม่ได้
   */
  UNSOLD = 'UNSOLD',
  /**
   * ยกเลิกการขาย
   */
  CANCEL = 'CANCEL',
}
// waiting deploy
export interface AuctionDebtSettlementAccountTransactionExtend extends DebtSettlementTransaction {
  expanded: boolean;
  debtSettlementAccounts?: Array<DebtSettlementAccountExtend>;
  debtSettlementAmountTotal?: number;
  debtAmountTotal?: number;
  index: number;
  ready: boolean;
  mainBorrowers?: MainBorrower[];
}

export interface DebtSettlementAccountExtend extends DebtSettlementAccount {
  expanded?: boolean;
  paymentGroupName?: string;
  paymentName?: string;
  paymentType?: string;
  debtSettlementAmountTotal?: number | string;
  debtAmountTotal?: number;
  accountsList: DebtSettlementAccountExtend[];
  accList?: DebtSettlementAccountExtend[];
  summaryAccountsList?: DebtSettlementAccountExtend[];
  struturedDebtList?: DebtSettlementAccountExtend[];
  index: number;
  ready?: boolean;
  hasHeaderSuffix?: boolean;
  isEmpty?: boolean;
  isAccNo?: boolean;
  defaultDebtSettlementAmount?: number;
  isViewOnly?: boolean;
  billDetails?: DetailsHeader[];
  forDetail?: boolean;
  forSummaryTable?: boolean;
  isLastest?: boolean; //for check lastest  account group
  isHeader?: boolean; //for check header account group
  isFirstTime?: boolean; // for check dispay - at first time
  paymentGroupTypes?: string[];
  name?: string;
}

export interface MainBorrower {
  mainBorrowerName: string;
  courtName: string;
  responseUnitCode: string;
  responseUnitName: string;
  bookingCode: string;
  bookingName: string;
}
export interface DebitData extends DebitTransaction {
  name?: string;
  collateralGroupsMsg: ITooltip[];
}

export enum SubmitAuctionResultAction {
  /**
   * "บันทึกผล"
   */
  UPDATE = 'UPDATE',
  /**
   * "อัปโหลด" (ยังไม่ได้ upload - ปุ่มสีฟ้า)
   */
  UPLOAD = 'UPLOAD',
  /**
   * "อัปโหลด" (upload ไปแล้วให้ re-upload ซ้ำได้
   */
  REUPLOAD = 'REUPLOAD',
  /**
   * ดูรายละเอียด
   */
  VIEW = 'VIEW',
}

export interface ConveyanceDocumentUploadResponseExtend extends ConveyanceDocumentUploadResponse {
  aucRef?: string;
  type?: string;
}

export const RESOLUTION_MAPPING = new Map<string, string>([
  ['PURCHASE', 'อนุมัติซื้อทรัพย์'],
  ['NOT_PURCHASE', 'อนุมัติไม่ซื้อทรัพย์'],
  ['ADJUST', 'รอแก้ไขประกาศ'],
  ['PENDING', 'รอผลพิจารณาจาก NPA'],
  ['NOT_PURCHASE_NON_PLEDGE_ASSETS', 'อนุมัติไม่ซื้อ (ทรัพย์นอกจำนอง)'],
  ['', '-'],
]);

export const AUCTION_RESULT_MAPPING = new Map<string, string>([
  ['UNSOLD', 'ขายทอดตลาดทรัพย์ไม่ได้'],
  ['SOLD', 'ขายทอดตลาดได้'],
  ['CANCEL', 'งดการขาย'],
  ['-', 'งดขาย'],
]);

export const TYPE_BUYER_MAPPING = new Map<string, string>([
  ['EXTERNAL', 'บุคคลภายนอก'],
  ['KTB', 'บมจ. ธนาคารกรุงไทย'],
  ['-', '-'],
]);

export interface ConveyanceDeedGroupDocumentExtend extends ConveyanceDeedGroupDocument {
  hided?: boolean;
  readyForSet?: boolean;
  expand?: boolean;
  readyForContract?: boolean;
  expandSub?: boolean;
  deedConfig?: any;
  details?: any;
  deedDocumentsMapping?: any[];
  conveyanceDeedGroupUploadDocuments: any[];
}

export interface TransferDocumentExtend extends TransferDocument {
  documentTemplate?: DocumentTemplateDto;
  imageId?: string;
  receivedDate?: string;
  customDate?: string;
  documentName?: string;
  receivedDocumentDate?: string;
}
export interface CollateralDocumentExtend extends CollateralDocument {
  documentTemplate?: DocumentTemplateDto;
  imageId?: string;
  receivedDate?: string;
  customDate?: string;
  documentName?: string;
  appraisalDate?: string;
  documentNo?: string;
  storeOrganization?: string;
  storeOrganizationName?: string;
  relatedCollateral?: any;
}

export interface TransferConfig extends TransferProperty {
  expand: boolean;
  ready: boolean;
  expenseList?: any;
  details?: any;
  result?: string;
}

export interface AuctionConveyanceAppointmentInfoResponseExtend extends MasAppointmentInfoResponse {
  appointmentList?: any;
}

export interface DetailsHeader {
  name?: string;
  hasDecimal?: number;
  value?: string | number;
}

export const saleTypeDescOptions: NameValuePair[] = [
  { name: 'การจำนองติดไป', value: 'การจำนองติดไป' },
  { name: 'ปลอดการจำนอง', value: 'ปลอดการจำนอง' },
  { name: 'ปลอดภาระผูกพัน', value: 'ปลอดภาระผูกพัน' },
  { name: 'ปลอดการจำนำ', value: 'ปลอดการจำนำ' },
  { name: 'การจำนำติดไป', value: 'การจำนำติดไป' },
];
