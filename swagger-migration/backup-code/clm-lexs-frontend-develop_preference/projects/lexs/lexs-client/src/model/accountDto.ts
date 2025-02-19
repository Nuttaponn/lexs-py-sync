/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface AccountDto { 
    accountId?: string;
    accountName?: string;
    accountNo?: string;
    accountNote?: string;
    accountStatus?: string;
    accountType?: AccountDto.AccountTypeEnum;
    amountInArrears?: number;
    billNo?: string;
    blackCaseNo?: string;
    bookingCode?: string;
    bookingName?: string;
    branchCode?: string;
    branchName?: string;
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
    interestNonBook?: number;
    lastDisburseDate?: string;
    lastPaidDate?: string;
    lastTransactionDate?: string;
    lastUpdate?: string;
    lateChargeAmount?: number;
    lgAccountName?: string;
    lgAccountNumber?: string;
    limitAmount?: number;
    litigationId?: string;
    litigationStatus?: string;
    marketCode?: string;
    marketDescription?: string;
    miscCharge?: number;
    newSubAccount?: boolean;
    noticeContractName?: string;
    openDate?: string;
    outstandingAccruedInterest?: number;
    outstandingBalance?: number;
    partialWriteOffFlag?: string;
    partialWriteOffStatus?: string;
    prescriptionDate?: string;
    primaryAccountNumber?: string;
    productType?: string;
    projectName?: string;
    redCaseNo?: string;
    responseBranchCode?: string;
    responseBranchName?: string;
    samFlag?: string;
    sourceSystem?: string;
    stageFinal?: string;
    subAccount?: boolean;
    subAccountOption?: string;
    subAccountType?: string;
    tamcFlag?: string;
    tdrContractDate?: string;
    tdrDate?: string;
    tdrStatus?: string;
    tdrTrackingResult?: string;
    userName?: string;
    writeDate?: string;
    writeOffStatus?: string;
}
export namespace AccountDto {
    export type AccountTypeEnum = 'OTHER' | 'FCS' | 'FLEET_CARD' | 'OD' | 'PN' | 'SUNDRY_FOREIGN_EXCHANGE' | 'SUNDRY_ACCEPTANCE' | 'SUNDRY_AVAL' | 'SUNDRY_INSURANCE' | 'SUNDRY_LG' | 'SUNDRY_OTHER' | 'SUNDRY_TCG' | 'TL' | 'TFS' | 'LBD' | 'HOME_LOAN' | 'PERSONAL_LOAN' | 'HOME_FOR_CASH' | 'OTHER' | 'FCS' | 'FLEET_CARD' | 'OD' | 'PN' | 'SUNDRY_FOREIGN_EXCHANGE' | 'SUNDRY_ACCEPTANCE' | 'SUNDRY_AVAL' | 'SUNDRY_INSURANCE' | 'SUNDRY_LG' | 'SUNDRY_OTHER' | 'SUNDRY_TCG' | 'TL' | 'TFS' | 'LBD' | 'HOME_LOAN' | 'PERSONAL_LOAN' | 'HOME_FOR_CASH' | 'THANAWAT';
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
        HomeForCash: 'HOME_FOR_CASH' as AccountTypeEnum,
        Other2: 'OTHER' as AccountTypeEnum,
        Fcs2: 'FCS' as AccountTypeEnum,
        FleetCard2: 'FLEET_CARD' as AccountTypeEnum,
        Od2: 'OD' as AccountTypeEnum,
        Pn2: 'PN' as AccountTypeEnum,
        SundryForeignExchange2: 'SUNDRY_FOREIGN_EXCHANGE' as AccountTypeEnum,
        SundryAcceptance2: 'SUNDRY_ACCEPTANCE' as AccountTypeEnum,
        SundryAval2: 'SUNDRY_AVAL' as AccountTypeEnum,
        SundryInsurance2: 'SUNDRY_INSURANCE' as AccountTypeEnum,
        SundryLg2: 'SUNDRY_LG' as AccountTypeEnum,
        SundryOther2: 'SUNDRY_OTHER' as AccountTypeEnum,
        SundryTcg2: 'SUNDRY_TCG' as AccountTypeEnum,
        Tl2: 'TL' as AccountTypeEnum,
        Tfs2: 'TFS' as AccountTypeEnum,
        Lbd2: 'LBD' as AccountTypeEnum,
        HomeLoan2: 'HOME_LOAN' as AccountTypeEnum,
        PersonalLoan2: 'PERSONAL_LOAN' as AccountTypeEnum,
        HomeForCash2: 'HOME_FOR_CASH' as AccountTypeEnum,
        Thanawat: 'THANAWAT' as AccountTypeEnum
    };
}


