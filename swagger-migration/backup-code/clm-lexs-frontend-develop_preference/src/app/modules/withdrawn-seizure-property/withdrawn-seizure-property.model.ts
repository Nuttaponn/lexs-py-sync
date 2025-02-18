import {
  Assets,
  PersonForLitigationCaseDto,
  WithdrawConsentDocuments,
  WithdrawSeizureCollateralInfo,
} from '@lexs/lexs-client';
/**
 * Temporary interface for: ผู้ติดต่อ
 **/
export interface WithdrawnSeizurePerson {
  personId: string;
  name: string;
  telephoneNo: string;
  identificationNo: string;
  relation: string;
}

/**
 * Temporary interface for: ผู้ติดต่อ
 **/
export interface WithdrawnSeizurePersonResponse {
  persons: WithdrawnSeizurePerson[];
}

export interface WithdrawnSeizureViewModel {
  index?: number;
  groupName: string;
  groupId?: string;
  collaterals: WithdrawSeizureCollateralInfo[];
  asset?: Assets[];
  contactPersons?: PersonForLitigationCaseDto[];
  consentDocuments?: Array<WithdrawConsentDocuments>;
}

export interface WithdrawnSeizureContactPersonViewModel extends PersonForLitigationCaseDto {
  litigationCaseRelation?: string;
}

export interface ErrorResponse {
  errors: ErrorDetail[];
}

export interface ErrorDetail {
  code: string;
  message: string;
  traceId: string;
  description: string;
}
