/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { AttributeModel } from './attributeModel';


export interface DocumentMetadata { 
    applicationId?: string;
    attributes?: Array<AttributeModel>;
    callBackRefId?: string;
    chronicleId?: string;
    cif?: string;
    contentType?: string;
    costCenter?: string;
    cusName?: string;
    cusSurname?: string;
    cusTitle?: string;
    docType?: string;
    docVersion?: string;
    effectiveDateFrom?: string;
    fileName?: string;
    fileNameOrg?: string;
    filePath?: string;
    fileSize?: string;
    identificationNo?: string;
    pageCount?: string;
    refId?: string;
    seqId?: string;
    systemName?: string;
    uploadSessionId?: string;
    version?: number;
}

