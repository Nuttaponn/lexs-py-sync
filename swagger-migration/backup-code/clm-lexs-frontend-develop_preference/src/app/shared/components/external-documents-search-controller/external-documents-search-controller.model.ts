export type ExternalDocumentsSearchTemplate = 'AUC_ANNOUCEMENT_KTB_PROCESS' | 'NORMAL';

export interface AucAnnouncementKTBSearchConditionRequest {
  lot: Array<string>;
  set: Array<string>;
  orderNo: Array<string>;
  redCaseNo: Array<string>;
  legalExecutionOffice: Array<string>;
  status: Array<string>;
  defendant: Array<string>;
  caseType: Array<string>;
}
