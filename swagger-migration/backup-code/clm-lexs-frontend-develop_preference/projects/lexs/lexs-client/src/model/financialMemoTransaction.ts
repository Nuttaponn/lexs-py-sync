/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ExpenseMemoDto } from './expenseMemoDto';


/**
 * รายการหมายเหตุของ Transactions
 */
export interface FinancialMemoTransaction { 
    /**
     * transaction id
     */
    transactionId?: number;
    /**
     * Reference object type
     */
    referenceObjectType?: string;
    /**
     * Reference object id
     */
    referenceTransactionId?: number;
    /**
     * รายการของหมายเหตุในแต่ละ Transaction
     */
    memoList?: Array<ExpenseMemoDto>;
}

