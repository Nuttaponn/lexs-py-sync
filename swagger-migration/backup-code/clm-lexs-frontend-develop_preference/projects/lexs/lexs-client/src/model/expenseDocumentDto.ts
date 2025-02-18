/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DocumentTemplateDto } from './documentTemplateDto';
import { AdditionalInfo } from './additionalInfo';
import { RejectedReasonDto } from './rejectedReasonDto';


export interface ExpenseDocumentDto { 
    active?: boolean;
    additionalInfo?: AdditionalInfo;
    attributes?: object;
    commitmentAccounts?: Array<string>;
    customerId?: string;
    dimsHardCopyRequestDate?: string;
    dimsHardCopyStatus?: ExpenseDocumentDto.DimsHardCopyStatusEnum;
    dimsTicketBarcode?: string;
    documentCommitmentId?: string;
    documentDate?: string;
    documentId?: number;
    documentTemplate?: DocumentTemplateDto;
    documentTemplateId?: string;
    editableFlag?: boolean;
    handlingOrganization?: string;
    hardCopyState?: ExpenseDocumentDto.HardCopyStateEnum;
    hasOriginalCopy?: boolean;
    holderOrganization?: string;
    holderOrganizationName?: string;
    imageId?: string;
    imageName?: string;
    imageSource?: ExpenseDocumentDto.ImageSourceEnum;
    litigationCaseId?: number;
    litigationId?: string;
    multipleFlag?: boolean;
    objectId?: string;
    objectType?: ExpenseDocumentDto.ObjectTypeEnum;
    receiveDate?: string;
    received?: boolean;
    rejectedReasons?: Array<RejectedReasonDto>;
    required?: boolean;
    sendChannel?: string;
    sendDate?: string;
    sent?: boolean;
    storeOrganization?: string;
    storeOrganizationName?: string;
    subjectTo?: string;
    uploadUserId?: string;
    uploadUserName?: string;
    uploadUserOrganizationName?: string;
}
export namespace ExpenseDocumentDto {
    export type DimsHardCopyStatusEnum = 'FOUND' | 'NOT_FOUND' | 'IN_PROGRESS';
    export const DimsHardCopyStatusEnum = {
        Found: 'FOUND' as DimsHardCopyStatusEnum,
        NotFound: 'NOT_FOUND' as DimsHardCopyStatusEnum,
        InProgress: 'IN_PROGRESS' as DimsHardCopyStatusEnum
    };
    export type HardCopyStateEnum = 'SUCCESS' | 'IN_PROGRESS' | 'REJECT' | 'DISABLE' | 'OPEN';
    export const HardCopyStateEnum = {
        Success: 'SUCCESS' as HardCopyStateEnum,
        InProgress: 'IN_PROGRESS' as HardCopyStateEnum,
        Reject: 'REJECT' as HardCopyStateEnum,
        Disable: 'DISABLE' as HardCopyStateEnum,
        Open: 'OPEN' as HardCopyStateEnum
    };
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
    export type ObjectTypeEnum = 'PERSON' | 'CONTRACT' | 'COLLATERAL' | 'BILL_NO' | 'ACCOUNT_NO' | 'LINKAGE' | 'SUNDRY' | 'SUB_ACCOUNT' | 'DEFERMENT' | 'CESSATION' | 'APPEAL' | 'SUPREME' | 'DISPUTE_APPEAL' | 'DISPUTE_SUPREME' | 'EXPENSE' | 'CONDITION_APPEAL' | 'CONDITION_SUPREME' | 'SEIZURE_LED' | 'WITHDRAW_SEIZURE_LED' | 'DEFERMENT_EXEC' | 'AUCTION_EXPENSE' | 'AUCTION' | 'EXTERNAL_PAYMENT_TRACKING_DEED_GROUP' | 'CASHIER_CHEQUE' | 'CHEQUE_ADDITIONAL_PAYMENT' | 'CASHIER_CHEQUE_TRANSFER_OWNERSHIP' | 'DEED_GROUP_ID' | 'CONV_DOC_UPLOAD_ID' | 'CONVY_ACC_DOC_FOLLOWUP_ID' | 'AUC_BIDDING_ID' | 'AUC_BIDDING_DEED_GROUP_ID' | 'WITHDRAW_SEIZURES_COLLATERALS_CONSENT_DOCUMENT' | 'DEBT_SETTLEMENT_DOCUMENT' | 'ACCOUNT' | 'ASSET' | 'ASSET_INVESTIGATION' | 'AUCTION_CASHIER_CHEQUE_TRANSFER_OWNERSHIP' | 'DEBT_SETTLEMENT_ACCOUNT';
    export const ObjectTypeEnum = {
        Person: 'PERSON' as ObjectTypeEnum,
        Contract: 'CONTRACT' as ObjectTypeEnum,
        Collateral: 'COLLATERAL' as ObjectTypeEnum,
        BillNo: 'BILL_NO' as ObjectTypeEnum,
        AccountNo: 'ACCOUNT_NO' as ObjectTypeEnum,
        Linkage: 'LINKAGE' as ObjectTypeEnum,
        Sundry: 'SUNDRY' as ObjectTypeEnum,
        SubAccount: 'SUB_ACCOUNT' as ObjectTypeEnum,
        Deferment: 'DEFERMENT' as ObjectTypeEnum,
        Cessation: 'CESSATION' as ObjectTypeEnum,
        Appeal: 'APPEAL' as ObjectTypeEnum,
        Supreme: 'SUPREME' as ObjectTypeEnum,
        DisputeAppeal: 'DISPUTE_APPEAL' as ObjectTypeEnum,
        DisputeSupreme: 'DISPUTE_SUPREME' as ObjectTypeEnum,
        Expense: 'EXPENSE' as ObjectTypeEnum,
        ConditionAppeal: 'CONDITION_APPEAL' as ObjectTypeEnum,
        ConditionSupreme: 'CONDITION_SUPREME' as ObjectTypeEnum,
        SeizureLed: 'SEIZURE_LED' as ObjectTypeEnum,
        WithdrawSeizureLed: 'WITHDRAW_SEIZURE_LED' as ObjectTypeEnum,
        DefermentExec: 'DEFERMENT_EXEC' as ObjectTypeEnum,
        AuctionExpense: 'AUCTION_EXPENSE' as ObjectTypeEnum,
        Auction: 'AUCTION' as ObjectTypeEnum,
        ExternalPaymentTrackingDeedGroup: 'EXTERNAL_PAYMENT_TRACKING_DEED_GROUP' as ObjectTypeEnum,
        CashierCheque: 'CASHIER_CHEQUE' as ObjectTypeEnum,
        ChequeAdditionalPayment: 'CHEQUE_ADDITIONAL_PAYMENT' as ObjectTypeEnum,
        CashierChequeTransferOwnership: 'CASHIER_CHEQUE_TRANSFER_OWNERSHIP' as ObjectTypeEnum,
        DeedGroupId: 'DEED_GROUP_ID' as ObjectTypeEnum,
        ConvDocUploadId: 'CONV_DOC_UPLOAD_ID' as ObjectTypeEnum,
        ConvyAccDocFollowupId: 'CONVY_ACC_DOC_FOLLOWUP_ID' as ObjectTypeEnum,
        AucBiddingId: 'AUC_BIDDING_ID' as ObjectTypeEnum,
        AucBiddingDeedGroupId: 'AUC_BIDDING_DEED_GROUP_ID' as ObjectTypeEnum,
        WithdrawSeizuresCollateralsConsentDocument: 'WITHDRAW_SEIZURES_COLLATERALS_CONSENT_DOCUMENT' as ObjectTypeEnum,
        DebtSettlementDocument: 'DEBT_SETTLEMENT_DOCUMENT' as ObjectTypeEnum,
        Account: 'ACCOUNT' as ObjectTypeEnum,
        Asset: 'ASSET' as ObjectTypeEnum,
        AssetInvestigation: 'ASSET_INVESTIGATION' as ObjectTypeEnum,
        AuctionCashierChequeTransferOwnership: 'AUCTION_CASHIER_CHEQUE_TRANSFER_OWNERSHIP' as ObjectTypeEnum,
        DebtSettlementAccount: 'DEBT_SETTLEMENT_ACCOUNT' as ObjectTypeEnum
    };
}


