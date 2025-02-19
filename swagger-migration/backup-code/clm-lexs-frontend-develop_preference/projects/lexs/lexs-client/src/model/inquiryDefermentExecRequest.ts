/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface InquiryDefermentExecRequest { 
    customerId?: string;
    defermentId?: string;
    defermentType: InquiryDefermentExecRequest.DefermentTypeEnum;
    isViewOnly?: boolean;
    litigationId?: string;
    mode: InquiryDefermentExecRequest.ModeEnum;
    taskId?: number;
}
export namespace InquiryDefermentExecRequest {
    export type DefermentTypeEnum = 'DEFERMENT' | 'CESSATION' | 'DEFERMENT_EXEC_SEIZURE' | 'DEFERMENT_EXEC_SALE' | 'DEFERMENT_EXEC_SEIZURE_SALE';
    export const DefermentTypeEnum = {
        Deferment: 'DEFERMENT' as DefermentTypeEnum,
        Cessation: 'CESSATION' as DefermentTypeEnum,
        DefermentExecSeizure: 'DEFERMENT_EXEC_SEIZURE' as DefermentTypeEnum,
        DefermentExecSale: 'DEFERMENT_EXEC_SALE' as DefermentTypeEnum,
        DefermentExecSeizureSale: 'DEFERMENT_EXEC_SEIZURE_SALE' as DefermentTypeEnum
    };
    export type ModeEnum = 'ADD' | 'EDIT' | 'VIEW' | 'APPROVE' | 'CANCEL' | 'DASHBOARD' | 'EXTEND';
    export const ModeEnum = {
        Add: 'ADD' as ModeEnum,
        Edit: 'EDIT' as ModeEnum,
        View: 'VIEW' as ModeEnum,
        Approve: 'APPROVE' as ModeEnum,
        Cancel: 'CANCEL' as ModeEnum,
        Dashboard: 'DASHBOARD' as ModeEnum,
        Extend: 'EXTEND' as ModeEnum
    };
}


