/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { RejectRequest } from './rejectRequest';
import { TransferOrderDto } from './transferOrderDto';


export interface ReceiveOrderDto { 
    accountCode?: string;
    cancelReason?: string;
    cancelReasonOther?: string;
    editReason?: string;
    headerFlag?: ReceiveOrderDto.HeaderFlagEnum;
    makerId?: string;
    makerName?: string;
    makerOrgId?: string;
    makerOrgName?: string;
    paidAmount?: number;
    payAmount?: number;
    payerType?: ReceiveOrderDto.PayerTypeEnum;
    receiveDate?: string;
    receiveNo?: string;
    receiveReferenceNo?: string;
    receiveSource?: ReceiveOrderDto.ReceiveSourceEnum;
    receiveStatus?: ReceiveOrderDto.ReceiveStatusEnum;
    receiveStatusName?: string;
    receiveType?: ReceiveOrderDto.ReceiveTypeEnum;
    referenceNo?: string;
    rejectRequest?: RejectRequest;
    remark?: string;
    sumTotalClearingAmount?: number;
    transferOrders?: Array<TransferOrderDto>;
    updateFlag?: ReceiveOrderDto.UpdateFlagEnum;
}
export namespace ReceiveOrderDto {
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
    export type PayerTypeEnum = 'DEBTOR' | 'COURT' | 'LAWYER_OFFICE';
    export const PayerTypeEnum = {
        Debtor: 'DEBTOR' as PayerTypeEnum,
        Court: 'COURT' as PayerTypeEnum,
        LawyerOffice: 'LAWYER_OFFICE' as PayerTypeEnum
    };
    export type ReceiveSourceEnum = 'NORMAL' | 'COURT';
    export const ReceiveSourceEnum = {
        Normal: 'NORMAL' as ReceiveSourceEnum,
        Court: 'COURT' as ReceiveSourceEnum
    };
    export type ReceiveStatusEnum = 'DRAFT' | 'PENDING_APPROVE' | 'PENDING_EDIT' | 'PENDING_DOWNLOAD' | 'RECORD_NO_SUCCESS' | 'COMPLETED' | 'COMPLETED_SYSTEM' | 'CANCEL_RECORD' | 'PENDING_NO_SUCCESS';
    export const ReceiveStatusEnum = {
        Draft: 'DRAFT' as ReceiveStatusEnum,
        PendingApprove: 'PENDING_APPROVE' as ReceiveStatusEnum,
        PendingEdit: 'PENDING_EDIT' as ReceiveStatusEnum,
        PendingDownload: 'PENDING_DOWNLOAD' as ReceiveStatusEnum,
        RecordNoSuccess: 'RECORD_NO_SUCCESS' as ReceiveStatusEnum,
        Completed: 'COMPLETED' as ReceiveStatusEnum,
        CompletedSystem: 'COMPLETED_SYSTEM' as ReceiveStatusEnum,
        CancelRecord: 'CANCEL_RECORD' as ReceiveStatusEnum,
        PendingNoSuccess: 'PENDING_NO_SUCCESS' as ReceiveStatusEnum
    };
    export type ReceiveTypeEnum = 'INTER_OFFICE' | 'SUSPENSE' | 'SUSPENSE_COURT' | 'AUTO_CLEARING';
    export const ReceiveTypeEnum = {
        InterOffice: 'INTER_OFFICE' as ReceiveTypeEnum,
        Suspense: 'SUSPENSE' as ReceiveTypeEnum,
        SuspenseCourt: 'SUSPENSE_COURT' as ReceiveTypeEnum,
        AutoClearing: 'AUTO_CLEARING' as ReceiveTypeEnum
    };
    export type UpdateFlagEnum = 'A' | 'U' | 'D';
    export const UpdateFlagEnum = {
        A: 'A' as UpdateFlagEnum,
        U: 'U' as UpdateFlagEnum,
        D: 'D' as UpdateFlagEnum
    };
}


