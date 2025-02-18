/**
 * Table: ทรัพจำนอง
 **/
export const CollateralColumns = [
  'orderNumber',
  'collateralId',
  'collateralTypeDesc',
  'collateralSubTypeDesc',
  'documentNo',
  'collateralDetails',
  'ownerId',
  'totalAppraisalValue',
  'collateralCmsStatus',
  'collateralCaseLexsStatus',
  'action',
];

export const NonMortgageColumns = [
  'orderNumber',
  'collateralTypeDesc',
  'collateralSubTypeDesc',
  'documentNo',
  'collateralDetails',
  'ownerId',
  'totalAppraisalValue',
  'assentRlsStatus',
  'obligationStatus',
  'collateralCaseLexsStatus',
  'assetDocuments',
  'action',
];

export type ICollateralMTable = {
  orderNumber: string;
  collateralId: string;
  collateralTypeDesc: string;
  collateralType: string;
  collateralSubTypeDesc: string;
  documentNo: string;
  collateralDetails: string;
  ownerId: string;
  totalAppraisalValue: string;
  collateralCmsStatus: string;
  collateralCaseLexsStatus: string;
  seizureStatus: string;
  action: ICollateralMTableAction;
  remark?: string;
  reason?: string;
  assentRlsStatus?: string;
  obligationStatus?: string;
  assetDocuments?: any[];
};

export type ICollateralMTableAction = {
  deletable: boolean;
  editable: boolean;
};
