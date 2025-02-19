/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface DeleteAuctionLedsDocumentRequest { 
    documentType?: DeleteAuctionLedsDocumentRequest.DocumentTypeEnum;
    uploadsessionId: string;
    auctionExpenseId?: number;
}
export namespace DeleteAuctionLedsDocumentRequest {
    export type DocumentTypeEnum = 'WRIT_OF_EXECUTE_DOC' | 'INVOICE' | 'RECEIPT' | 'SUMMON_FOR_SURCHARGE_DOC';
    export const DocumentTypeEnum = {
        WritOfExecuteDoc: 'WRIT_OF_EXECUTE_DOC' as DocumentTypeEnum,
        Invoice: 'INVOICE' as DocumentTypeEnum,
        Receipt: 'RECEIPT' as DocumentTypeEnum,
        SummonForSurchargeDoc: 'SUMMON_FOR_SURCHARGE_DOC' as DocumentTypeEnum
    };
}


