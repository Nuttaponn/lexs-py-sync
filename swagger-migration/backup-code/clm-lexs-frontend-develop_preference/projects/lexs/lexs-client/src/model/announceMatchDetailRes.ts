/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { BidDate } from './bidDate';
import { AnnounceDocument } from './announceDocument';


export interface AnnounceMatchDetailRes { 
    isExhibition?: boolean;
    saleChannel?: string;
    saleLocation1?: string;
    saleTime1?: string;
    saleLocation2?: string;
    saleTime2?: string;
    bidDates?: Array<BidDate>;
    document?: AnnounceDocument;
    lawCourtName?: string;
    redCaseNo?: string;
    plaintiffName?: string;
    defendantName?: string;
}

