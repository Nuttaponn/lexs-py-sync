/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface AuctionExpenseResponse { 
    uploadTimeStamp?: string;
    imageId?: string;
    status?: AuctionExpenseResponse.StatusEnum;
    auctionExpenseId?: number;
}
export namespace AuctionExpenseResponse {
    export type StatusEnum = 'R2E09_02_3B_PENDING_SAVE' | 'R2E09_02_3B_PENDING_PAYMENT' | 'R2E09_02_3B_PAYMENT_COMPLETE_PENDING_SAVE' | 'COMPLETE' | 'R2E09_14_3C_PENDING_SAVE' | 'R2E09_14_3C_PENDING_UPDATE' | 'R2E09_14_3C_PENDING_REVIEW' | 'R2E09_14_3C_PENDING_APPROVAL' | 'R2E35_02_E09_01_7A_PENDING_RECEIPT_UPLOAD' | 'R2E35_02_E09_02_7B_PENDING_RECEIPT_UPDATE' | 'R2E35_02_E09_02_7B_PENDING_RECEIPT_VERIFICATION';
    export const StatusEnum = {
        R2E09023BPendingSave: 'R2E09_02_3B_PENDING_SAVE' as StatusEnum,
        R2E09023BPendingPayment: 'R2E09_02_3B_PENDING_PAYMENT' as StatusEnum,
        R2E09023BPaymentCompletePendingSave: 'R2E09_02_3B_PAYMENT_COMPLETE_PENDING_SAVE' as StatusEnum,
        Complete: 'COMPLETE' as StatusEnum,
        R2E09143CPendingSave: 'R2E09_14_3C_PENDING_SAVE' as StatusEnum,
        R2E09143CPendingUpdate: 'R2E09_14_3C_PENDING_UPDATE' as StatusEnum,
        R2E09143CPendingReview: 'R2E09_14_3C_PENDING_REVIEW' as StatusEnum,
        R2E09143CPendingApproval: 'R2E09_14_3C_PENDING_APPROVAL' as StatusEnum,
        R2E3502E09017APendingReceiptUpload: 'R2E35_02_E09_01_7A_PENDING_RECEIPT_UPLOAD' as StatusEnum,
        R2E3502E09027BPendingReceiptUpdate: 'R2E35_02_E09_02_7B_PENDING_RECEIPT_UPDATE' as StatusEnum,
        R2E3502E09027BPendingReceiptVerification: 'R2E35_02_E09_02_7B_PENDING_RECEIPT_VERIFICATION' as StatusEnum
    };
}


