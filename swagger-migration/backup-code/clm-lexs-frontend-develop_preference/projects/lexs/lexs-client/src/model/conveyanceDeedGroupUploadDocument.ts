/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DocumentTemplate } from './documentTemplate';


export interface ConveyanceDeedGroupUploadDocument { 
    documentId?: number;
    documentTemplate?: DocumentTemplate;
    imageId?: string;
    imageName?: string;
    imageSource?: string;
    isDraft?: boolean;
    uploadTimestamp?: string;
}

