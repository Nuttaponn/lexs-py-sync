/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SeizureDocumentTemplate } from './seizureDocumentTemplate';
import { RelatedCollateral } from './relatedCollateral';


export interface AmdDocument { 
    documentId?: number;
    documentTemplate?: SeizureDocumentTemplate;
    relatedCollateral?: RelatedCollateral;
    sendMethod?: string;
    sendStatus?: boolean;
    approvedStatus?: boolean;
}

