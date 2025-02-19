/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { AucBiddingResult } from './aucBiddingResult';


export interface AuctionBiddingResultResponse { 
    aucBiddingId?: number;
    aucBiddingStatus?: string;
    aucRef?: number;
    ledId?: number;
    ledName?: string;
    aucLedSeq?: number;
    litigationId?: string;
    litigationCaseId?: number;
    originalLitigationCaseId?: number;
    bidDate?: string;
    saleChannel?: string;
    aucBiddingResults?: Array<AucBiddingResult>;
}

