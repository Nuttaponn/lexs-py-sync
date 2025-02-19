/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { RejectedDocumentInfo } from './rejectedDocumentInfo';
import { DocumentDto } from './documentDto';


export interface DocumentInfo { 
    customerDocuments?: Array<DocumentDto>;
    litigationDocuments?: Array<DocumentDto>;
    defermentDocuments?: Array<DocumentDto>;
    cessationDocuments?: Array<DocumentDto>;
    rejectedExceedDocuments?: Array<RejectedDocumentInfo>;
    preparationCompleted?: boolean;
}

