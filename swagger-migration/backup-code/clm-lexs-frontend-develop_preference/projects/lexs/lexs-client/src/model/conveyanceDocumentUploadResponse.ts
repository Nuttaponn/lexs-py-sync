/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ConveyanceDeedGroupDocument } from './conveyanceDeedGroupDocument';
import { ConveyanceOptionalUploadDocument } from './conveyanceOptionalUploadDocument';
import { ConveyanceUploadDocument } from './conveyanceUploadDocument';
import { PublicAuctionAnnounce } from './publicAuctionAnnounce';


export interface ConveyanceDocumentUploadResponse { 
    allowDeedGroupId?: Array<number>;
    completedTimestamp?: string;
    conveyanceDeedGroupDocuments?: Array<ConveyanceDeedGroupDocument>;
    conveyanceDocUploadId?: number;
    conveyanceOptionalUploadDocuments?: Array<ConveyanceOptionalUploadDocument>;
    conveyanceUploadDocuments?: Array<ConveyanceUploadDocument>;
    createdTimestamp?: string;
    initType?: string;
    publicAuctionAnnounce?: PublicAuctionAnnounce;
    status?: string;
}

