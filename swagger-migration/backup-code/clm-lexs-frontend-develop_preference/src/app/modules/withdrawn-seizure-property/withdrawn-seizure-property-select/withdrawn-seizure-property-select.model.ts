/**
 * Table: ทรัพจำนอง
 **/
export const WithdrawnCollateralColumns = [
  'orderNumber',
  'collateralId',
  'collateralTypeDesc',
  'collateralSubTypeDesc',
  'documentNo',
  'collateralDetails',
  'ownerId',
  'totalAppraisalValue',
  'ledRefNo',
  'ledName',
  'status',
  // 'action',
];

export const WithdrawAssetColumns = [
  'orderNumber',
  // 'collateralId',
  'collateralTypeDesc',
  'collateralSubTypeDesc',
  'documentNo',
  'collateralDetails',
  'ownerId',
  'totalAppraisalValue',
  'ledRefNo',
  'ledName',
  'obligationStatus',
  'status',
  //  'action',
];

/**
 * Table: ผู้ติดต่อที่เกี่ยวข้อง
 **/
export const WithdrawnPersonColumns = ['no', 'name', 'relationship', 'identificationNo', 'telephoneNo', 'actions'];

export type IWithdrawnCollateralMTable = {
  orderNumber: string;
  collateralId: string;
  collateralTypeDesc: string;
  collateralSubTypeDesc: string;
  documentNo: string;
  collateralDetails: string;
  ownerId: string;
  totalAppraisalValue: string;
  seizureStatu: string;
  collateralCaseLexsStatus: string;
  action: string;
};
