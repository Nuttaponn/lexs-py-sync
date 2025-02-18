import { AuctionDetails } from "@lexs/lexs-client";

/**
 * Table: รายการชุดทรัพย์
 **/
export const TableAuctionCollateralColumns = [
  'selection',
  'orderNumber',
  'col1',
  'col2',
  'col3',
  'col4',
  'col5',
  'col6',
  'col7',
  'col8',
  'action',
];

export enum columnNameType {
  selection = 'selection',
  orderNumber = 'orderNumber',
  /**
   * ชุดทรัพย์
   */
  col1 = 'deedGroupId',
  /**
   * มติที่ประชุม
   */
  col2 = 'resolution',
  /**
   * ประเภทการขาย
   */
  col3 = 'saletypedesc',
  saleTypeDesc = 'saleTypeDesc',
  /**
   * กำหนดราคาซื้อต่ำสุด (บาท)
   */
  col4 = 'minPrice',
  /**
   * กำหนดราคาซื้อสูงสุด (บาท)
   */
  col5 = 'maxPrice',
  /**
   * ราคาประเมิน (บาท)
   */
  col6 = 'genCbsAppval',
  /**
   * ราคาอนุมัติ ใช้ได้ถึงวันที่
   */
  col7 = 'effectiveDateTo',
  /**
   * เอกสาร
   */
  col8 = 'chronicleId',
  col9 = 'col9',
  status = 'status',
  action = 'action',
  fsubbidnum = 'fsubbidnum',
  npaResolutionSummary = 'npaResolutionSummary',
  resolution = 'resolution',
  effectiveDateTo = 'effectiveDateTo',
  maxPrice = 'maxPrice',
  minPrice = 'minPrice',
  totalAppraisalValue = 'totalAppraisalValue',
  saletypedesc = 'saletypedesc',
  npaResolutionDocument = 'npaResolutionDocument',
}

export interface TableAuctionModel {
  colName: columnNameType;
  hideCol: boolean;
  isHyperlink?: boolean;
  hyperlinkKey?: string;
  isNumber?: boolean;
  isDate?: boolean;
  hasSubValue?: boolean;
  mainValue?: columnNameType | undefined;
  subValue?: columnNameType | undefined;
}

export enum AucCollateralColType {
  selection = 'selection',
  orderNumber = 'orderNumber',
  /**
   * ชุดทรัพย์
   */
  col1 = 'col1',
  /**
   * มติที่ประชุม
   */
  col2 = 'col2',
  /**
   * ประเภทการขาย
   */
  col3 = 'col3',
  /**
   * กำหนดราคาซื้อต่ำสุด (บาท)
   */
  col4 = 'col4',
  /**
   * กำหนดราคาซื้อสูงสุด (บาท)
   */
  col5 = 'col5',
  /**
   * ราคาประเมิน (บาท)
   */
  col6 = 'col6',
  /**
   * ราคาอนุมัติ ใช้ได้ถึงวันที่
   */
  col7 = 'col7',
  col8 = 'col8',
  col9 = 'col9',
  col10 = 'col10',
  col11 = 'col11',
  col12 = 'col12',
  col13 = 'col13',
  col14 = 'col14',
  col15 = 'col15',
  col16 = 'col16',
  action = 'action',
  sourceOfAsset = 'sourceOfAsset',
  fsubbidnum = 'fsubbidnum',
  assettypedesc = 'assettypedesc',
  landtype = 'landtype',
  deedno = 'deedno',
  assetDetail = 'assetDetail',
  redCaseNo = 'redCaseNo',
  saletypedesc = 'saletypedesc',
  debtname = 'debtname',
  ownername = 'ownername',
  personName1 = 'personName1',
  personName2 = 'personName2',
  occupant = 'occupant',
  ledname = 'ledname',
  remark = 'remark',
  announceLink = 'announceLink',
  aucRef = 'aucRef',
  statusPending = 'statusPending',
  statusSuccess = 'statusSuccess',
  status = 'status',
  collateralDocNo = 'collateralDocNo',
  statusOther = 'statusOther',
}

export enum AucLexsSeizureColType {
  selection = 'selection',
  orderNumber = 'orderNumber',
  civilCourtName = 'civilCourtName',
  civilCourtNo = 'civilCourtNo',
  ledName = 'ledName',
  redCaseNo = 'redCaseNo',
  seizureLedType = 'seizureLedType',
  seizureTimestamp = 'seizureTimestamp',
  action = 'action',
}

export interface CollateralTableGroupConfig {
  hasExpand?: boolean;
  hasFilter?: boolean;
  hasAction?: boolean;
}

export enum AuctionMenu {
  CASHIER = 'CASHIER', //วางเงินเพิ่ม
  VIEW_CASHIER = 'VIEW_CASHIER', // ใบประกาศ
  UPLOAD_DOC = 'UPLOAD_DOC', //อัปโหลดเอกสารจากการซื้อทรัพย์
  VIEW_PAYMENT = 'VIEW_PAYMENT', //ผลการชำระเงิน
  REVOKE = 'REVOKE', //เพิกถอนการขาย
  OWNERSHIP_TRNASFER = 'OWNERSHIP_TRNASFER ', // LEX2-539
  VIEW_OWNERSHIP_TRNASFER = 'VIEW_OWNERSHIP_TRNASFER', //รายละเอียดโอนกรรมสิทธิ์
  VIEW_OWNERSHIP_TRNASFER_MAS = 'VIEW_OWNERSHIP_TRNASFER_MAS', // รายละเอียดโอนกรรมสิทธิ์ [LEX2-541] maker ได้รับ noti แจ้งผลการโอนกรรมสิทธิ์
  VIEW_OWNERSHIP_TRNASFER_DATE_TIME = 'VIEW_OWNERSHIP_TRNASFER_DATE_TIME', // [LEX2-35666] Notification แจ้งวันและเวลานัดโอนกรรมสิทธิ์จาก MAS
  VIEW_ACCOUNT = 'VIEW_ACCOUNT', // รายการตัดบัญชี
  ACCOUNT_DOCUMENT = 'ACCOUNT_DOCUMENT', // งานบันทึกผลติดตามบัญชีรับจ่ายและตรวจรับรองบัญชี
}

export const CaseTypeOptions = [
  { name: '-', value: '-' },
  { name: 'คดีแพ่ง', value: 'CIVIL' }
]

export enum LawColType {
  labelNumber = 'labelNumber',
  lgId = 'lgId',
  customerId = 'customerId',
  responseUnit = 'responseUnit'
}


export interface DeedMatchDetailEtx extends AuctionDetails {
  fsubbidnum?: string;
  collateralId?: string;
  assetId?: number;
  occupant?: string;
  remark?: string;
  isExclude?: boolean;
}
