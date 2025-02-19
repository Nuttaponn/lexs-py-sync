/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PageableObject } from './pageableObject';
import { ExpenseAuditLogDto } from './expenseAuditLogDto';
import { SortObject } from './sortObject';


export interface PageExpenseAuditLogDto { 
    totalElements?: number;
    totalPages?: number;
    size?: number;
    content?: Array<ExpenseAuditLogDto>;
    number?: number;
    sort?: Array<SortObject>;
    numberOfElements?: number;
    pageable?: PageableObject;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
}

