/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { FinancialTransactionSummaryDashboard } from './financialTransactionSummaryDashboard';


/**
 * ข้อมูลการเงินระดับคดี
 */
export interface FinancialLitigationSummaryDetailDto { 
    /**
     * ประเภทคดี
     */
    caseType?: string;
    /**
     * ชื่อประเภทคดี
     */
    caseTypeName?: string;
    /**
     * คดีหมายเลขดำ
     */
    blackCaseNo?: string;
    /**
     * คดีหมายเลขแดง
     */
    redCaseNo?: string;
    litigationCaseTransactionDashboard?: FinancialTransactionSummaryDashboard;
}

