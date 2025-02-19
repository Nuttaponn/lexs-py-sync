/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { AccountDocFollowup } from './accountDocFollowup';
import { PublicAuctionAnnounce } from './publicAuctionAnnounce';
import { AccountDocumentDto } from './accountDocumentDto';


export interface AccountDocumentsResponse { 
    accountDocuments?: Array<AccountDocumentDto>;
    publicAuctionAnnounce?: PublicAuctionAnnounce;
    accountDocFollowups?: Array<AccountDocFollowup>;
}

