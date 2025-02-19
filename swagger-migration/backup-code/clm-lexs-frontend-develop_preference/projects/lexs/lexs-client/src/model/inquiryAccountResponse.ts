/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface InquiryAccountResponse { 
    accountNo?: string;
    billNo?: string;
    accountType?: string;
    dpd?: number;
    stageAccount?: string;
    marketCode?: string;
    marketDescription?: string;
    totalAmount?: number;
    prescriptionDate?: string;
    litigationId?: string;
    litigationStatus?: string;
    litigationStatusName?: string;
    blackCaseNo?: string;
    redCaseNo?: string;
    insertFlag?: string;
    selected?: boolean;
    tdrTrackingResult?: string;
    tdrDate?: string;
    bookingCode?: string;
    bookingCodeName?: string;
    responseBranchCode?: string;
    responseBranchCodeName?: string;
    cfinalStage?: string;
}

