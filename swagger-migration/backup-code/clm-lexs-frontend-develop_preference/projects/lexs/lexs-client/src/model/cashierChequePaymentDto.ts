/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface CashierChequePaymentDto { 
    amount?: number;
    assignedLawyerId?: string;
    authorizeUserId?: string;
    chequeType?: CashierChequePaymentDto.ChequeTypeEnum;
    createdBy?: string;
    createdTimestamp?: string;
    effectiveDate?: string;
    feeAmount?: number;
    glCostCenter?: string;
    litigationCaseId?: number;
    litigationId?: string;
    objectId?: string;
    objectType?: string;
    outwardBranch?: string;
    payeeName?: string;
    sourceSystem?: string;
}
export namespace CashierChequePaymentDto {
    export type ChequeTypeEnum = 'CHEQUE_AUCTION_ASSET' | 'CHEQUE_DUTY_FEE' | 'CHEQUE_ADDITIONAL_PAYMENT' | 'CHEQUE_TRANSFER_OWNERSHIP' | 'CHEQUE_ADDITIONAL_ANNOUNCE_PAYMENT' | 'CHEQUE_AUCTION_EXPENSE';
    export const ChequeTypeEnum = {
        AuctionAsset: 'CHEQUE_AUCTION_ASSET' as ChequeTypeEnum,
        DutyFee: 'CHEQUE_DUTY_FEE' as ChequeTypeEnum,
        AdditionalPayment: 'CHEQUE_ADDITIONAL_PAYMENT' as ChequeTypeEnum,
        TransferOwnership: 'CHEQUE_TRANSFER_OWNERSHIP' as ChequeTypeEnum,
        AdditionalAnnouncePayment: 'CHEQUE_ADDITIONAL_ANNOUNCE_PAYMENT' as ChequeTypeEnum,
        AuctionExpense: 'CHEQUE_AUCTION_EXPENSE' as ChequeTypeEnum
    };
}


