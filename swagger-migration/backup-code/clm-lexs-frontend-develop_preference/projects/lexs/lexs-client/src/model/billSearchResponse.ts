/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { CustomerProductBSList } from './customerProductBSList';
import { Navigator } from './navigator';
import { BillList } from './billList';


export interface BillSearchResponse { 
    code?: string;
    dtm?: string;
    err?: string;
    info?: string;
    txRef?: string;
    bills?: BillList;
    customerProductBSs?: CustomerProductBSList;
    navigator?: Navigator;
}

