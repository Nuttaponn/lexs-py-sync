/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SortObject } from './sortObject';


export interface PageableObject { 
    offset?: number;
    sort?: Array<SortObject>;
    paged?: boolean;
    pageNumber?: number;
    pageSize?: number;
    unpaged?: boolean;
}

