/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface PreferenceApproveRequest { 
    approvalStatus?: PreferenceApproveRequest.ApprovalStatusEnum;
    rejectReason?: string;
}
export namespace PreferenceApproveRequest {
    export type ApprovalStatusEnum = 'APPROVE' | 'REJECT' | 'RETURN';
    export const ApprovalStatusEnum = {
        Approve: 'APPROVE' as ApprovalStatusEnum,
        Reject: 'REJECT' as ApprovalStatusEnum,
        Return: 'RETURN' as ApprovalStatusEnum
    };
}


