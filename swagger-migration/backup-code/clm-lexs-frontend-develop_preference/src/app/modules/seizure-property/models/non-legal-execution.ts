/**
 * Table รายการที่ไม่สามารถระบุสำนักงานบังคับคดี
 */
export interface INoneLegalExecution {
  collateralId: string;
  // ledId: string,
  orderNo: number;
  legalNumber: string;
  legalType: string;
  legalSubType: string;
  owner: string;
  // เลขที่เอกสารสิทธิ์
  documentNo: string;
  // ราคาประเมิน
  totalAppraisalValue: string;
  // สถานะหลักประกัน(CMS)
  collateralCmsStatus: string;
  propertieDesc: string;
  collateralCaseLexsStatus: string;
  action: Object;
  collateralType: string;
}

export const NONE_LEGAL_EXECUTION_COLUMN = [
  'orderNo',
  'legalNumber',
  'legalType',
  'legalSubType',
  'documentNo',
  'propertieDesc',
  'owner',
  'totalAppraisalValue',
  'collateralCmsStatus',
  'collateralCaseLexsStatus',
  'action',
];

export const NONE_LEGAL_EXECUTION_NON_PLEDGE_COLUMN = [
  'orderNo',
  'legalType',
  'legalSubType',
  'documentNo',
  'propertieDesc',
  'owner',
  'totalAppraisalValue',
  'assentRlsStatus',
  'obligationStatus',
  'collateralCaseLexsStatus',
  'assetDocuments',
  'action',
];
