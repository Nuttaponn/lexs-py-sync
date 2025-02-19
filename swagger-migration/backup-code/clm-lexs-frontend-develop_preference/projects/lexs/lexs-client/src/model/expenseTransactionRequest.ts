/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { CollateralsAssetDto } from './collateralsAssetDto';
import { ExpenseDocumentDto } from './expenseDocumentDto';


export interface ExpenseTransactionRequest { 
    assetInspectionDate?: string;
    collaterals?: Array<CollateralsAssetDto>;
    documents?: Array<ExpenseDocumentDto>;
    excludedVatAmount?: number;
    expenseAmount?: number;
    expenseRateId?: string;
    fieldName?: string;
    fieldValue?: number;
    id?: number;
    isApproved?: boolean;
    lgId?: string;
    litigationCaseId?: number;
    litigationClosed?: boolean;
    note?: string;
    objectId?: string;
    objectType?: string;
    orderId?: number;
    totalAmount?: number;
    updateFlag?: ExpenseTransactionRequest.UpdateFlagEnum;
    vatRate?: number;
    whtRate?: number;
    wtAmount?: number;
}
export namespace ExpenseTransactionRequest {
    export type UpdateFlagEnum = 'A' | 'U' | 'D';
    export const UpdateFlagEnum = {
        A: 'A' as UpdateFlagEnum,
        U: 'U' as UpdateFlagEnum,
        D: 'D' as UpdateFlagEnum
    };
}


