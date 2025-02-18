/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DocumentDto } from './documentDto';


export interface DefermentExecCancelRequest { 
    customerId?: string;
    defermentId?: string;
    cancelDate?: string;
    cancelReason?: string;
    cancelWithDebtChanges?: boolean;
    documents?: Array<DocumentDto>;
}

