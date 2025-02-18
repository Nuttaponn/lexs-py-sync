/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DocumentLitigationSubCase } from './documentLitigationSubCase';


export interface CreateLitigationSubCaseRequest { 
    /**
     * ทุนทรัพย์ที่ยื่นฟ้อง
     */
    capitalAmount?: number;
    /**
     * วันที่ยื่นแก้
     */
    caseDate?: string;
    /**
     * รหัสศาล
     */
    courtCode?: string;
    /**
     * ค่าธรรมเนียมศาล
     */
    courtFee?: string;
    /**
     * ระดับศาล
     */
    courtLevel?: string;
    /**
     * คำสั่งศาล
     */
    courtOrder?: string;
    /**
     * วันที่ศาลสั่ง
     */
    courtOrderDate?: string;
    /**
     * ค่าจัดทำเอกสาร
     */
    documentFee?: string;
    /**
     * รหัสเอกสาร
     */
    documentItems?: Array<DocumentLitigationSubCase>;
    /**
     * Header Flag // DRAFT,SUBMIT
     */
    headerFlag: CreateLitigationSubCaseRequest.HeaderFlagEnum;
    /**
     * true is ยื่น / false is แก้
     */
    isPlaintiff?: boolean;
    /**
     * เหตุผล
     */
    reason?: string;
    /**
     * คำสั่งศาลทุเลาคดี
     */
    respiteCase?: CreateLitigationSubCaseRequest.RespiteCaseEnum;
    subId?: number;
    /**
     * วันที่ยื่นคำร้อง
     */
    submitDate?: string;
    taskId?: number;
}
export namespace CreateLitigationSubCaseRequest {
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
    export type RespiteCaseEnum = 'Y' | 'N';
    export const RespiteCaseEnum = {
        Y: 'Y' as RespiteCaseEnum,
        N: 'N' as RespiteCaseEnum
    };
}


