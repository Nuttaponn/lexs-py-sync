/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { WithdrawSeizureLedGroups } from './withdrawSeizureLedGroups';
import { WithdrawSeizureLedDocumentDto } from './withdrawSeizureLedDocumentDto';


export interface ResultRecordingTaskSubmitRequest { 
    /**
     * Header Flag // DRAFT,SUBMIT
     */
    headerFlag: ResultRecordingTaskSubmitRequest.HeaderFlagEnum;
    withdrawSeizureLedId?: number;
    resultDate?: string;
    withdrawSeizureLedGroups?: Array<WithdrawSeizureLedGroups>;
    withdrawSeizureLedDocuments?: Array<WithdrawSeizureLedDocumentDto>;
}
export namespace ResultRecordingTaskSubmitRequest {
    export type HeaderFlagEnum = 'DRAFT' | 'SUBMIT' | 'APPROVE' | 'REJECT' | 'CANCEL' | 'DELETE' | 'UPDATE' | 'SUBMIT1' | 'SUBMIT2' | 'SAVE';
    export const HeaderFlagEnum = {
        Draft: 'DRAFT' as HeaderFlagEnum,
        Submit: 'SUBMIT' as HeaderFlagEnum,
        Approve: 'APPROVE' as HeaderFlagEnum,
        Reject: 'REJECT' as HeaderFlagEnum,
        Cancel: 'CANCEL' as HeaderFlagEnum,
        Delete: 'DELETE' as HeaderFlagEnum,
        Update: 'UPDATE' as HeaderFlagEnum,
        Submit1: 'SUBMIT1' as HeaderFlagEnum,
        Submit2: 'SUBMIT2' as HeaderFlagEnum,
        Save: 'SAVE' as HeaderFlagEnum
    };
}


