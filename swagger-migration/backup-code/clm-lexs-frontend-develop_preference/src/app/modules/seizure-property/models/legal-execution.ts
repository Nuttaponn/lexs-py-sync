export interface ILegalExecution {
  seizureId: string;
  seizureLedId: string;
  seizureLedType: string;
  orderNo: number;
  legalExecutionName: string;
  legalDepartment: string;
  totalAsset: number;
  keepDate: string;
  seizureDate: string;
  SLAClasses: string;
  SLA: string;
  collectionNumber: string;
  reportStatus: string;
  isFeePaid: boolean;
  paymentMethod: string;
  action: any;
  createdTimestamp: string;
}

export const LEGAL_EXECUTION_COLUMN = [
  'no',
  'legalExecutionName',
  'legalDepartment',
  'totalAsset',
  'keepDate',
  'seizureDate',
  'SLA',
  'reportStatus',
  'paymentMethod',
  'action',
];
