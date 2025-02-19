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


export interface ConsentDocument { 
    documentId?: number;
    documentTemplate?: WdSeizureDocumentTemplate;
    imageSource?: ConsentDocument.ImageSourceEnum;
    imageId?: string;
    imageName?: string;
    reuploadable?: boolean;
}
export namespace ConsentDocument {
    export type ImageSourceEnum = 'LEXS' | 'IMP' | 'DIMS' | 'LG' | 'PN' | 'FCS' | 'TFS' | 'LCS' | 'RLS';
    export const ImageSourceEnum = {
        Lexs: 'LEXS' as ImageSourceEnum,
        Imp: 'IMP' as ImageSourceEnum,
        Dims: 'DIMS' as ImageSourceEnum,
        Lg: 'LG' as ImageSourceEnum,
        Pn: 'PN' as ImageSourceEnum,
        Fcs: 'FCS' as ImageSourceEnum,
        Tfs: 'TFS' as ImageSourceEnum,
        Lcs: 'LCS' as ImageSourceEnum,
        Rls: 'RLS' as ImageSourceEnum
    };
}


