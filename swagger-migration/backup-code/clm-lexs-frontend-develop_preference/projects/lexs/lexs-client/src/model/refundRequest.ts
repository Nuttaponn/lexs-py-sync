/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ExpenseTransactionNoteDto } from './expenseTransactionNoteDto';


export interface RefundRequest { 
    expenseTransactionNoteDtoList?: Array<ExpenseTransactionNoteDto>;
    isAccept?: boolean;
    note?: string;
}

