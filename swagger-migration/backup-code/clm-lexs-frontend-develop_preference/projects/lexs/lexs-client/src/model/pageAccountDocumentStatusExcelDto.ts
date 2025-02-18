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
import { AccountDocumentStatusExcelDto } from './accountDocumentStatusExcelDto';
import { SortObject } from './sortObject';


export interface PageAccountDocumentStatusExcelDto { 
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: Array<AccountDocumentStatusExcelDto>;
    number?: number;
    sort?: Array<SortObject>;
    numberOfElements?: number;
    pageable?: PageableObject;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
}

