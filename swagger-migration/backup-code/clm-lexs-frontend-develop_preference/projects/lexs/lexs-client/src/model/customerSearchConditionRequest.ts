/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface CustomerSearchConditionRequest { 
    customerStatus?: CustomerSearchConditionRequest.CustomerStatusEnum;
    responseUnit?: string;
    amdUnit?: string;
    searchString?: string;
    litigationCloseStatus?: string;
    customerId?: string;
    litigationId?: string;
    customerName?: string;
    customerSurname?: string;
    citizenId?: string;
    blackCaseId?: string;
    redCaseId?: string;
    caseStatus?: string;
    searchScope?: string;
    orgCode?: string;
    loanType?: Array<string>;
    accountNo?: string;
    billNo?: string;
    kbdId?: string;
    debtor?: string;
    tamcFlag?: string;
    samFlag?: string;
    writeOffStatus?: string;
    debtTransferTo?: Array<string>;
    caseCreator?: string;
    court?: string;
    ownerId?: string;
    roomNo?: string;
    /**
     * BASIC, ADVANCE, LIST
     */
    searchMode: CustomerSearchConditionRequest.SearchModeEnum;
    /**
     * USER, TEAM, ORG
     */
    tab: CustomerSearchConditionRequest.TabEnum;
    /**
     * LEXS_FINISHED_DOCUMENT, LEXS_PENDING_NOTICE, LEXS_PENDING_LITIGATION, LITIGATION_FINISHED_DOCUMENT, LITIGATION_PENDING_NOTICE, LITIGATION_PENDING_LITIGATION, ALL, ALL_PENDING_NOTICE, ALL_PENDING_LITIGATION, ALL_FINISHED_DOCUMENT
     */
    dashboard?: string;
}
export namespace CustomerSearchConditionRequest {
    export type CustomerStatusEnum = 'DEFAULT_PAYMENT' | 'NOTICE_LETTER_PROCESS' | 'LITIGATION_PROCESS' | 'DEFERMENT' | 'CESSATION' | 'NORMAL';
    export const CustomerStatusEnum = {
        DefaultPayment: 'DEFAULT_PAYMENT' as CustomerStatusEnum,
        NoticeLetterProcess: 'NOTICE_LETTER_PROCESS' as CustomerStatusEnum,
        LitigationProcess: 'LITIGATION_PROCESS' as CustomerStatusEnum,
        Deferment: 'DEFERMENT' as CustomerStatusEnum,
        Cessation: 'CESSATION' as CustomerStatusEnum,
        Normal: 'NORMAL' as CustomerStatusEnum
    };
    export type SearchModeEnum = 'BASIC' | 'ADVANCE' | 'LIST';
    export const SearchModeEnum = {
        Basic: 'BASIC' as SearchModeEnum,
        Advance: 'ADVANCE' as SearchModeEnum,
        List: 'LIST' as SearchModeEnum
    };
    export type TabEnum = 'USER' | 'TEAM' | 'ORG' | 'CLOSED' | 'DASHBOARD';
    export const TabEnum = {
        User: 'USER' as TabEnum,
        Team: 'TEAM' as TabEnum,
        Org: 'ORG' as TabEnum,
        Closed: 'CLOSED' as TabEnum,
        Dashboard: 'DASHBOARD' as TabEnum
    };
}


