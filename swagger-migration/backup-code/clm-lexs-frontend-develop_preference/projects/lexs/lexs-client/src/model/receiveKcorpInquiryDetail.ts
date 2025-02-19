/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface ReceiveKcorpInquiryDetail { 
    /**
     * ผู้รับงาน
     */
    assignId?: string;
    /**
     * รหัสศาล
     */
    courtCode?: string;
    /**
     * ศาล
     */
    courtName?: string;
    /**
     * ลำดับ
     */
    no?: string;
    /**
     * จำนวนเงินที่ชำระแล้ว
     */
    paidAmount?: number;
    /**
     * เลขที่หนังสือ
     */
    receiveNo?: string;
    /**
     * รหัสสถานะหนังสือรับเงิน
     */
    receiveStatus?: ReceiveKcorpInquiryDetail.ReceiveStatusEnum;
    /**
     * สถานะหนังสือรับเงิน
     */
    receiveStatusDesc?: string;
    /**
     * ref1
     */
    ref1?: string;
    /**
     * ref2
     */
    ref2?: string;
    /**
     * reference no
     */
    referenceNo?: string;
    /**
     * วันที่ตั้ง Suspense A/C
     */
    suspenseAccountDate?: string;
    /**
     * จำนวนเงินตามรายการโอน
     */
    washAccountAmount?: number;
}
export namespace ReceiveKcorpInquiryDetail {
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
}


