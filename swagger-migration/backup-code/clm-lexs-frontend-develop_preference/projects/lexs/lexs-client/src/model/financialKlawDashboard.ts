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
 * รายการเบิกเงินของ KTBLAW
 */
export interface FinancialKlawDashboard { 
    /**
     * รอตรวจสอบรายการเบิกเงินโดย KTB Law : รายการเบิกเงินที่รอตรวจสอบรายการเบิกเงินโดย KTB Law
     */
    pendingTransaction?: number;
    /**
     * รออนุมัติการจ่ายเงินโดย KTB : รายการเบิกเงินที่รออนุมัติการจ่ายเงินโดย KTB
     */
    pendingApprove?: number;
    /**
     * รออัปโหลดใบเสร็จโดย KTB Law : รายการเบิกเงินที่รออัปโหลดใบเสร็จโดย KTB Law
     */
    pendingReceipt?: number;
    /**
     * รอตรวจสอบใบเสร็จโดย KTB : รายการเบิกเงินที่รอตรวจสอบใบเสร็จโดย KTB
     */
    pendingVerifyReceipt?: number;
    /**
     * รายการเบิกเงินของ KTBLAW
     */
    totalTransaction?: number;
}

