import { InquiryCustomerResponse, InquiryAccountResponse, InquiryCollateralResponse, DocumentDto, NameValuePair } from '@lexs/lexs-client';

export interface DropdownOptions {
  executeType: NameValuePair[];
  led: NameValuePair[];
  // writNotificationNumber: NameValuePair[];
  ciosCaseType: NameValuePair[];
  // caseNumber: NameValuePair[];
  year: NameValuePair[];
  court: NameValuePair[];
  executeCaseTypeEnum: NameValuePair[];
  rejectReason: NameValuePair[];
  sell: NameValuePair[];
  cannotSelected: NameValuePair[];
}

export interface PreferenceDto {
  preferenceId?: string;
  executeType?: string;
  executeDate?: string;
  receivedDate?: string;
  executeNo?: string;
  ledId?: string;
  blackCaseNo?: string;
  elementRedCaseCiosCode?: string;
  elementRedCaseRunning?: string;
  elementRedCaseYear?: string;
  executeCaseType?: string;
  plaintiffName?: string;
  defendantName?: string;
  redCaseNo?: string;
  courtCode?: string;
  // --
  customer?: InquiryCustomerResponse;
  accounts?: Array<InquiryAccountResponse>;
  collaterals?: Array<InquiryCollateralResponse>;
  document?: Array<DocumentDto>
  // --
  nonFilingReason?: string;
  sell?: string;

  approverRejectReason?: string;
}
// export interface CustomerDto {
// export interface AccountDto {
