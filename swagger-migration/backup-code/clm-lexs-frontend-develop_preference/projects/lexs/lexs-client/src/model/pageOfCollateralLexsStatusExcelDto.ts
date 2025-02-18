/**
 * KTB Backend for Frontend APIs.
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { CollateralLexsStatusExcelDto } from './collateralLexsStatusExcelDto';
import { Pageable } from './pageable';
import { Sort } from './sort';


export interface PageOfCollateralLexsStatusExcelDto { 
    content?: Array<CollateralLexsStatusExcelDto>;
    empty?: boolean;
    first?: boolean;
    last?: boolean;
    number?: number;
    numberOfElements?: number;
    pageable?: Pageable;
    size?: number;
    sort?: Sort;
    totalElements?: number;
    totalPages?: number;
}

