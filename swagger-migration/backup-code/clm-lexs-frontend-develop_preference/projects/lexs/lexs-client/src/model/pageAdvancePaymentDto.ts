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
import { SortObject } from './sortObject';
import { AdvancePaymentDto } from './advancePaymentDto';


export interface PageAdvancePaymentDto { 
    totalElements?: number;
    totalPages?: number;
    size?: number;
    content?: Array<AdvancePaymentDto>;
    number?: number;
    sort?: Array<SortObject>;
    numberOfElements?: number;
    pageable?: PageableObject;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
}

