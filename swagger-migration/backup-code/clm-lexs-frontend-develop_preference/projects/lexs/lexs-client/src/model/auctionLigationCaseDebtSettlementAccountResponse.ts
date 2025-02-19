/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { AuctLitigationDebtSettlementAcctCollateralDto } from './auctLitigationDebtSettlementAcctCollateralDto';


export interface AuctionLigationCaseDebtSettlementAccountResponse { 
    approvedTimestamp?: string;
    auctionDebtSettlementAccountId?: number;
    collateralGroups?: Array<AuctLitigationDebtSettlementAcctCollateralDto>;
    createTimestamp?: string;
    debitPercentage?: string;
    documentType?: string;
    status?: string;
    statusName?: string;
    totalAmount?: number;
    totalDebtSettlementAmount?: number;
    totalDeedGroup?: number;
}

