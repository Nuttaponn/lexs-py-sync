/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SeizureTitleDeedRejectedReason } from './seizureTitleDeedRejectedReason';


export interface SeizureTitleDeedDocument { 
    documentId?: number;
    approve?: boolean;
    sendMethod?: string;
    rejectedReason?: SeizureTitleDeedRejectedReason;
}

