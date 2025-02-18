/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { AuctionExpenseDoc } from './auctionExpenseDoc';


export interface AuctionExpenseRequest { 
    auctionExpenseId?: number;
    auctionExpenseType: AuctionExpenseRequest.AuctionExpenseTypeEnum;
    commandTimestamp?: string;
    citationCaseNo?: string;
    citationCaseAssignedDate?: string;
    citationCaseCreatedDate?: string;
    litigationCaseId?: number;
    litigationId?: string;
    reason?: string;
    ledId?: number;
    auctionExpenseDoc?: AuctionExpenseDoc;
    headerFlag?: AuctionExpenseRequest.HeaderFlagEnum;
    totalAmountPaid?: number;
    payeeName?: string;
    branchCode?: string;
    assignedLawyerId?: string;
    assignedLawyerMobileNo?: string;
    receivedByLawyerId?: string;
    receivedByLawyerMobileNo?: string;
    receiveCashierDate?: string;
}
export namespace AuctionExpenseRequest {
    export type AuctionExpenseTypeEnum = 'SUMMON_FOR_SURCHARGE' | 'WRIT_OF_EXECUTE' | 'SUMMON_FOR_SURCHARGE_E_FILING' | 'WRIT_OF_EXECUTE_E_FILING' | 'SUMMON_FOR_SURCHARGE_CASHIER_CHEQUE' | 'WRIT_OF_EXECUTE_CASHIER_CHEQUE';
    export const AuctionExpenseTypeEnum = {
        SummonForSurcharge: 'SUMMON_FOR_SURCHARGE' as AuctionExpenseTypeEnum,
        WritOfExecute: 'WRIT_OF_EXECUTE' as AuctionExpenseTypeEnum,
        SummonForSurchargeEFiling: 'SUMMON_FOR_SURCHARGE_E_FILING' as AuctionExpenseTypeEnum,
        WritOfExecuteEFiling: 'WRIT_OF_EXECUTE_E_FILING' as AuctionExpenseTypeEnum,
        SummonForSurchargeCashierCheque: 'SUMMON_FOR_SURCHARGE_CASHIER_CHEQUE' as AuctionExpenseTypeEnum,
        WritOfExecuteCashierCheque: 'WRIT_OF_EXECUTE_CASHIER_CHEQUE' as AuctionExpenseTypeEnum
    };
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


