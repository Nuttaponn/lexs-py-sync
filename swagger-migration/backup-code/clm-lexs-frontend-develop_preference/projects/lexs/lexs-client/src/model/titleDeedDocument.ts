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
import { DimDetail } from './dimDetail';


export interface TitleDeedDocument { 
    documentId?: number;
    documentTemplate?: SeizureDocumentTemplate;
    documentNo?: string;
    imageSource?: TitleDeedDocument.ImageSourceEnum;
    imageId?: string;
    imageName?: string;
    relatedCollateral?: RelatedCollateral;
    dimDetails?: DimDetail;
    sendMethod?: string;
}
export namespace TitleDeedDocument {
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


