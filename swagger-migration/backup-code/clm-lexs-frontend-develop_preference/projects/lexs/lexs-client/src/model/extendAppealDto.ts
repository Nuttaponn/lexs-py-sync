/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { LitigationDocumentDto } from './litigationDocumentDto';


export interface ExtendAppealDto { 
    litigationCaseId?: number;
    extendDate?: string;
    attachment?: LitigationDocumentDto;
    litigationId?: string;
}

