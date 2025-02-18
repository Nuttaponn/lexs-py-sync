/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface TaskInquiryRequest { 
    status?: string;
    type?: string;
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
    searchMode: TaskInquiryRequest.SearchModeEnum;
    /**
     * USER, TEAM, ORG
     */
    tab: TaskInquiryRequest.TabEnum;
}
export namespace TaskInquiryRequest {
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


