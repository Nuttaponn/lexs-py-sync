/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface ExpenseAuditLogDto { 
    id?: number;
    expenseObjectType?: string;
    expenseObjectId?: string;
    userId?: string;
    userName?: string;
    objectType?: string;
    action?: string;
    details?: string;
    timestamp?: string;
}

