/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DocumentDto } from './documentDto';
import { LitigationCasePersonDto } from './litigationCasePersonDto';


export interface ExecutionFeeDto { 
    amount?: number;
    companyCode?: string;
    /**
     * status check button retry=PARTIAL_PAY / payment=WAITING_PAY
     */
    decreeUpdateStatus?: ExecutionFeeDto.DecreeUpdateStatusEnum;
    deliveryFeeForPleadings?: number;
    documentDto?: DocumentDto;
    persons?: Array<LitigationCasePersonDto>;
    ref1?: string;
}
export namespace ExecutionFeeDto {
    export type DecreeUpdateStatusEnum = 'NOT_DECREE' | 'WAITING_PAY' | 'PARTIAL_PAY' | 'PAID' | 'RECEIPT_UPLOADED' | 'PENDING' | 'PENDING_SEND_RESULT' | 'FINISHED' | 'DECREE_RECORD' | 'DECREE_UPDATE' | 'DECREE_UPDATE_R' | 'SEND_RESULT_RECORD' | 'SEND_RESULT_UPDATE' | 'CLOSE' | 'MARK' | 'SIGN' | 'LISTEN' | 'ANNOUNCE' | 'OTHER' | 'DEFENDANT' | 'NO_DEFENDANT' | 'SEND' | 'NOT_SEND';
    export const DecreeUpdateStatusEnum = {
        NotDecree: 'NOT_DECREE' as DecreeUpdateStatusEnum,
        WaitingPay: 'WAITING_PAY' as DecreeUpdateStatusEnum,
        PartialPay: 'PARTIAL_PAY' as DecreeUpdateStatusEnum,
        Paid: 'PAID' as DecreeUpdateStatusEnum,
        ReceiptUploaded: 'RECEIPT_UPLOADED' as DecreeUpdateStatusEnum,
        Pending: 'PENDING' as DecreeUpdateStatusEnum,
        PendingSendResult: 'PENDING_SEND_RESULT' as DecreeUpdateStatusEnum,
        Finished: 'FINISHED' as DecreeUpdateStatusEnum,
        DecreeRecord: 'DECREE_RECORD' as DecreeUpdateStatusEnum,
        DecreeUpdate: 'DECREE_UPDATE' as DecreeUpdateStatusEnum,
        DecreeUpdateR: 'DECREE_UPDATE_R' as DecreeUpdateStatusEnum,
        SendResultRecord: 'SEND_RESULT_RECORD' as DecreeUpdateStatusEnum,
        SendResultUpdate: 'SEND_RESULT_UPDATE' as DecreeUpdateStatusEnum,
        Close: 'CLOSE' as DecreeUpdateStatusEnum,
        Mark: 'MARK' as DecreeUpdateStatusEnum,
        Sign: 'SIGN' as DecreeUpdateStatusEnum,
        Listen: 'LISTEN' as DecreeUpdateStatusEnum,
        Announce: 'ANNOUNCE' as DecreeUpdateStatusEnum,
        Other: 'OTHER' as DecreeUpdateStatusEnum,
        Defendant: 'DEFENDANT' as DecreeUpdateStatusEnum,
        NoDefendant: 'NO_DEFENDANT' as DecreeUpdateStatusEnum,
        Send: 'SEND' as DecreeUpdateStatusEnum,
        NotSend: 'NOT_SEND' as DecreeUpdateStatusEnum
    };
}


