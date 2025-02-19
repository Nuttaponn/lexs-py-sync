/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DisputeAppealDto } from './disputeAppealDto';
import { CourtDecreeDto } from './courtDecreeDto';
import { CourtVerdictDto } from './courtVerdictDto';
import { CourtAppealDto } from './courtAppealDto';


export interface CourtResultDto { 
    lawyerOfficeCode?: string;
    lawyerOfficeName?: string;
    lawyerId?: string;
    lawyerName?: string;
    litigationCaseId?: number;
    courtLevel?: CourtResultDto.CourtLevelEnum;
    checkApproverDecision?: string;
    latestAppealDueDate?: string;
    checkCaseEnd?: boolean;
    courtVerdicts?: Array<CourtVerdictDto>;
    courtAppeal?: CourtAppealDto;
    disputeAppeals?: Array<DisputeAppealDto>;
    courtDecrees?: Array<CourtDecreeDto>;
    userId?: string;
    userName?: string;
    litigationStatus?: string;
    enableDispute?: boolean;
}
export namespace CourtResultDto {
    export type CourtLevelEnum = 'CIVIL' | 'APPEAL' | 'SUPREME' | 'FIRST';
    export const CourtLevelEnum = {
        Civil: 'CIVIL' as CourtLevelEnum,
        Appeal: 'APPEAL' as CourtLevelEnum,
        Supreme: 'SUPREME' as CourtLevelEnum,
        First: 'FIRST' as CourtLevelEnum
    };
}


