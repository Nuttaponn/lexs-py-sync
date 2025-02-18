/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { WdSeizureDocumentTemplate } from './wdSeizureDocumentTemplate';


export interface LedDocumentDto { 
    active?: boolean;
    allowedUploadFlag?: string;
    documentId?: string;
    documentTemplate?: WdSeizureDocumentTemplate;
    imageId?: string;
    imageName?: string;
    imageSource?: string;
    isSubContract?: boolean;
    uploadTimestamp?: string;
}

