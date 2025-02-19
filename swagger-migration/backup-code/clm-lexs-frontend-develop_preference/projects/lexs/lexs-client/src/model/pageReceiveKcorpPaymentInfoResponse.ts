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
import { ReceiveKcorpPaymentInfoResponse } from './receiveKcorpPaymentInfoResponse';
import { SortObject } from './sortObject';


export interface PageReceiveKcorpPaymentInfoResponse { 
    totalElements?: number;
    totalPages?: number;
    size?: number;
    content?: Array<ReceiveKcorpPaymentInfoResponse>;
    number?: number;
    sort?: Array<SortObject>;
    numberOfElements?: number;
    pageable?: PageableObject;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
}

