/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DocumentTemplateDto } from './documentTemplateDto';


export interface WithdrawWritOfExecDocumentDto { 
    documentId?: number;
    uploadSessionId?: string;
    imageSource?: string;
    imageId?: string;
    imageName?: string;
    uploadTimestamp?: string;
    documentTemplate?: DocumentTemplateDto;
}

