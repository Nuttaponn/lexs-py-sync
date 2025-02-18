/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface Account { 
    accountId?: string;
    accountName?: string;
    accountNo?: string;
    accountNote?: string;
    accountStatus?: string;
    accountType?: Account.AccountTypeEnum;
    amountInArrears?: number;
    billNo?: string;
    bookingCode?: string;
    cfinal?: string;
    closeDate?: string;
    commitmentAccountNo?: string;
    contractDate?: string;
    customerId?: string;
    deliquencyDate?: string;
    directDebitAccountNumber?: string;
    dpd?: number;
    estimatePrescriptionFlag?: boolean;
    expiryDate?: string;
    firstDisbursementDate?: string;
    fleetCardAccount?: string;
    insertFlag?: boolean;
    isClosed?: boolean;
    lastDisburseDate?: string;
    lastPaidDate?: string;
    lastTransactionDate?: string;
    lastUpdate?: string;
    lateChargeAmount?: number;
    lgAccountName?: string;
    lgAccountNumber?: string;
    limitAmount?: number;
    litigationDate?: string;
    litigationId?: string;
    marketCode?: string;
    marketDescription?: string;
    miscCharge?: number;
    openDate?: string;
    outstandingAccruedInterest?: number;
    outstandingBalance?: number;
    outstandingInterestNonBook?: number;
    partialWriteOffFlag?: string;
    partialWriteOffStatus?: string;
    prescriptionDate?: string;
    primaryAccountNumber?: string;
    productType?: string;
    projectName?: string;
    responseBranchCode?: string;
    samFlag?: string;
    sourceSystem?: string;
    specialImport?: string;
    stageFinal?: string;
    subAccount?: boolean;
    subAccountOption?: string;
    subAccountType?: string;
    tamcFlag?: string;
    tdrContractDate?: string;
    tdrStatus?: string;
    tdrTrackingResult?: string;
    writeDate?: string;
    writeOffStatus?: string;
    acct?: string;
    availableBal?: number;
    bankCD?: string;
    brCD?: string;
    ccCD?: string;
    ledgerBal?: number;
    limit?: string;
}
export namespace Account {
    export type AccountTypeEnum = 'OTHER' | 'FCS' | 'FLEET_CARD' | 'OD' | 'PN' | 'SUNDRY_FOREIGN_EXCHANGE' | 'SUNDRY_ACCEPTANCE' | 'SUNDRY_AVAL' | 'SUNDRY_INSURANCE' | 'SUNDRY_LG' | 'SUNDRY_OTHER' | 'SUNDRY_TCG' | 'TL' | 'TFS' | 'LBD' | 'HOME_LOAN' | 'PERSONAL_LOAN' | 'HOME_FOR_CASH';
    export const AccountTypeEnum = {
        Other: 'OTHER' as AccountTypeEnum,
        Fcs: 'FCS' as AccountTypeEnum,
        FleetCard: 'FLEET_CARD' as AccountTypeEnum,
        Od: 'OD' as AccountTypeEnum,
        Pn: 'PN' as AccountTypeEnum,
        SundryForeignExchange: 'SUNDRY_FOREIGN_EXCHANGE' as AccountTypeEnum,
        SundryAcceptance: 'SUNDRY_ACCEPTANCE' as AccountTypeEnum,
        SundryAval: 'SUNDRY_AVAL' as AccountTypeEnum,
        SundryInsurance: 'SUNDRY_INSURANCE' as AccountTypeEnum,
        SundryLg: 'SUNDRY_LG' as AccountTypeEnum,
        SundryOther: 'SUNDRY_OTHER' as AccountTypeEnum,
        SundryTcg: 'SUNDRY_TCG' as AccountTypeEnum,
        Tl: 'TL' as AccountTypeEnum,
        Tfs: 'TFS' as AccountTypeEnum,
        Lbd: 'LBD' as AccountTypeEnum,
        HomeLoan: 'HOME_LOAN' as AccountTypeEnum,
        PersonalLoan: 'PERSONAL_LOAN' as AccountTypeEnum,
        HomeForCash: 'HOME_FOR_CASH' as AccountTypeEnum
    };
}


