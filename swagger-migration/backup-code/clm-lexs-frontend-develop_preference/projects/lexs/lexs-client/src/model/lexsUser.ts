/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Phonebook } from './phonebook';


export interface LexsUser { 
    userId?: string;
    mobileNumber?: string;
    roleCode?: string;
    subRoleCode?: string;
    dataScopeCode?: string;
    levelCode?: string;
    organizationCode?: string;
    groupCode?: string;
    factionCode?: string;
    teamCode?: string;
    authorityCode?: string;
    lastLogin?: string;
    updatedDateTime?: string;
    createdDatetime?: string;
    createdBy?: string;
    updatedBy?: string;
    lastAssignedDateTime?: string;
    phonebook?: Phonebook;
    lawyerCode?: string;
    disable?: boolean;
}

