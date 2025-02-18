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
import { LitigationDefermentDashboardExcelDto } from './litigationDefermentDashboardExcelDto';


export interface PageLitigationDefermentDashboardExcelDto { 
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: Array<LitigationDefermentDashboardExcelDto>;
    number?: number;
    sort?: Array<SortObject>;
    numberOfElements?: number;
    pageable?: PageableObject;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
}

