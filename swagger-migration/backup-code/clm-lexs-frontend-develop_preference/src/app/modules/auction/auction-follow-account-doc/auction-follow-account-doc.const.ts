import { DOC_TEMPLATE } from '@app/shared/constant';

export const ChequeIssuerConstants = {
  LED_CHEQUE_ISSUER: 'led-cheque-issuer',
};

export const CertifyAccountWarrantStatus = {
  // certifyAccountWarrantStatus ยังไม่ได้รับ ได้รับแล้ว
  NOT_RECEIVE: 'NOT_RECEIVE',
  RECEIVE: 'RECEIVE',
};

export const CertifyAccountWarrantType = {
  // certifyAccountWarrantType หมายชอบ หมายไม่ชอบ
  VALID_WARRANT: 'VALID_WARRANT',
  INVALID_WARRANT: 'INVALID_WARRANT',
};

export const AccountDocVerifyStatus = {
  // accountDocVerifyStatus กำลังตรวจสอบ ตรวจสอบเสร็จแล้ว
  IN_PROCESS: 'IN_PROCESS',
  VERIFIED: 'VERIFIED',
};

export const AccountDocVerifyResult = {
  // accountDocVerifyResult ข้อมูลถูกต้อง ข้อมูลไม่ถูกต้อง
  VALID_DATA: 'VALID_DATA',
  INVALID_DATA: 'INVALID_DATA',
};

/*
- S : Task is initiated automatically by the system (initial - one time)
- F : Task is initiated automatically by the system (for follow-up task)
- M : Task is initiated manually (via on-request process)
*/
export enum TaskInitiationType {
  S = 'S', // auto-task
  F = 'F', // auto-task
  M = 'M', // on-request
}

export namespace AccDocScenario {
  export type AccDocScenarioEnum = 'S1' | 'S2' | 'S3' | 'S4' | 'S5_1' | 'S5_2';
  export const AccDocScenarioEnum = {
    S1: 'S1' as AccDocScenarioEnum,
    S2: 'S2' as AccDocScenarioEnum,
    S3: 'S3' as AccDocScenarioEnum,
    S4: 'S4' as AccDocScenarioEnum,
    S5_1: 'S5_1' as AccDocScenarioEnum,
    S5_2: 'S5_2' as AccDocScenarioEnum,
  };
}

export const specifiedDocumentsDict: {
  [key in AccDocScenario.AccDocScenarioEnum]: string[];
} = {
  S1: [],
  S2: [DOC_TEMPLATE.LEXSF160],
  S3: [DOC_TEMPLATE.LEXSF197],
  S4: [DOC_TEMPLATE.LEXSF160],
  S5_1: [DOC_TEMPLATE.LEXSF160, DOC_TEMPLATE.LEXSF146, DOC_TEMPLATE.LEXSF175, DOC_TEMPLATE.LEXSF176],
  S5_2: [DOC_TEMPLATE.LEXSF160, DOC_TEMPLATE.LEXSF146],
};

export const notSpecifiedDocumentsDict: {
  [key in AccDocScenario.AccDocScenarioEnum]: string[];
} = {
  S1: [],
  S2: [DOC_TEMPLATE.LEXSF146, DOC_TEMPLATE.LEXSF175, DOC_TEMPLATE.LEXSF176, DOC_TEMPLATE.LEXSF197],
  S3: [DOC_TEMPLATE.LEXSF146, DOC_TEMPLATE.LEXSF160, DOC_TEMPLATE.LEXSF175, DOC_TEMPLATE.LEXSF176],
  S4: [DOC_TEMPLATE.LEXSF146, DOC_TEMPLATE.LEXSF175, DOC_TEMPLATE.LEXSF176, DOC_TEMPLATE.LEXSF197],
  S5_1: [DOC_TEMPLATE.LEXSF197],
  S5_2: [DOC_TEMPLATE.LEXSF175, DOC_TEMPLATE.LEXSF176, DOC_TEMPLATE.LEXSF197],
};

/*
{
  "documentTemplate": {
      "documentGroup": "AUCTION",
      "documentTemplateId": "LEXSF160",
      "documentName": "หมายตรวจรับรองบัญชีรับ-จ่าย"
  }
},
{
  "documentTemplate": {
      "documentGroup": "AUCTION",
      "documentTemplateId": "LEXSF146",
      "documentName": "บัญชีรับจ่ายจากการซื้อขายทรัพย์"
  }
},
{
  "documentTemplate": {
      "documentGroup": "AUCTION",
      "documentTemplateId": "LEXSF175",
      "documentName": "แคชเชียร์เช็คจากการขายทรัพย์ตามบัญชีรับจ่าย"
  }
},
{
  "documentTemplate": {
      "documentGroup": "AUCTION",
      "documentTemplateId": "LEXSF176",
      "documentName": "เอกสาร credit note ตามบัญชีรับจ่าย"
  }
},
{
  "documentTemplate": {
      "documentGroup": "AUCTION",
      "documentTemplateId": "LEXSF197",
      "documentName": "เอกสารคำแถลงติดตามบัญชีรับจ่าย"
  }
}
*/

/*
export interface AccountDocumentFormValues {
  certifyAccountWarrantStatus?: string;
  certifyAccountWarrantType?: string;
  certifyAccountWarrantDate?: string;
  accountDocVerifyStatus?: string;
  remark?: string;
  accountDocVerifyResult?: string;
  accountDocDeedGroups?: AccountDocDeedGroup[];
  debtSettlementAmount?: number;
  additionalPaymentAmount?: number;
  chequeNo?: string;
  amount?: number;
  chequeDate?: string;
  chequeBankName?: string;
  chequeBankCode?: string;
  refNo?: string;
  files?: IUploadMultiFile[];
}
*/
