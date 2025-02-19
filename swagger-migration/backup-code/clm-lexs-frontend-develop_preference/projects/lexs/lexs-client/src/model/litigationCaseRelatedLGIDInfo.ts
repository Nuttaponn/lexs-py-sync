/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * content
 */
export interface LitigationCaseRelatedLGIDInfo { 
    /**
     * เลขที่กฎหมาย LG ID
     */
    litigationId?: string;
    /**
     * CIF No
     */
    customerId?: string;
    /**
     * ชื่อลูกหนี้
     */
    customerName?: string;
    /**
     * รหัสสถานะการดำเนินคดีทางกฎหมาย
     */
    litigationStatus?: string;
    /**
     * สถานะการดำเนินคดีทางกฎหมาย
     */
    litigationStatusDesc?: string;
    /**
     * Response AMD Unit Code ผู้ดูแลลูกหนี้
     */
    amdResponseUnitCode?: string;
    /**
     * Response AMD Unit Name ผู้ดูแลลูกหนี้
     */
    amdResponseUnitName?: string;
}

