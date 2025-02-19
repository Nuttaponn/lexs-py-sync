/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface LitigationCaseShortDto { 
    /**
     * เลขที่กฏหมาย
     */
    litigationId?: string;
    cifNo?: string;
    /**
     * รหัสหน่วยงานผู้ดูแล
     */
    responseUnitCode?: string;
    /**
     * ชื่อหน่วยงานผู้ดูแล
     */
    responseUnitName?: string;
    /**
     * รหัสสาขา
     */
    bookingCode?: string;
    /**
     * ชื่อสาขา
     */
    bookingName?: string;
    /**
     * รหัสหน่วยงานผู้ดูแล AMD
     */
    amdResponseUnitCode?: string;
    /**
     * ชื่อหน่วยงานผู้ดูแล AMD
     */
    amdResponseUnitName?: string;
    /**
     * ภาระหนี้รวม
     */
    sumLimitAmount?: number;
    /**
     * คดีหมายเลขดำ ศาลชั้นต้น
     */
    civilCourtBlackCaseNo?: string;
    /**
     * คดีหมายเลขแดง ศาลชั้นต้น
     */
    civilCourtRedCaseNo?: string;
    /**
     * วันที่ฟ้องดำเนินคดี
     */
    civilCourtCaseDate?: string;
    /**
     * วันแรกที่อาจครบกำหนดระยะเวลาบังคับคดี
     */
    firstPossibleExecutionDueDate?: string;
    /**
     * วันที่หมดอายุความฟ้องล้มละลาย
     */
    bankruptcyFilingExpiryDate?: string;
    /**
     * ทนายความผู้รับผิดชอบ
     */
    legalExecutionLawyerId?: string;
    legalExecutionLawyerFullName?: string;
    publicAuctionLawyerId?: string;
    bankruptcyLawyerId?: string;
    mainBorrowerName?: string;
    defermentStatus?: LitigationCaseShortDto.DefermentStatusEnum;
    courtVerdictDate?: string;
    auctionLawyerIdNonPledgeAssets?: string;
    caseType?: string;
    plaintiff?: string;
    defendant?: string;
    courtName?: string;
    ledName?: string;
    preferenceGroupNo?: string;
    executeNo?: string;
    executeDate?: string;
    ownerFullName?: string;
    otherPreferenceGroupNos?: Array<string>;
}
export namespace LitigationCaseShortDto {
    export type DefermentStatusEnum = 'CESSATION' | 'DEFERMENT' | 'NORMAL' | 'DEFERMENT_EXEC_SEIZURE' | 'DEFERMENT_EXEC_SALE' | 'DEFERMENT_EXEC_SEIZURE_SALE';
    export const DefermentStatusEnum = {
        Cessation: 'CESSATION' as DefermentStatusEnum,
        Deferment: 'DEFERMENT' as DefermentStatusEnum,
        Normal: 'NORMAL' as DefermentStatusEnum,
        DefermentExecSeizure: 'DEFERMENT_EXEC_SEIZURE' as DefermentStatusEnum,
        DefermentExecSale: 'DEFERMENT_EXEC_SALE' as DefermentStatusEnum,
        DefermentExecSeizureSale: 'DEFERMENT_EXEC_SEIZURE_SALE' as DefermentStatusEnum
    };
}


