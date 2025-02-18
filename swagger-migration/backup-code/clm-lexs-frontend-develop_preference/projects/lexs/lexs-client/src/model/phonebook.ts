/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { LexsUser } from './lexsUser';


export interface Phonebook { 
    userId?: string;
    category?: string;
    status?: string;
    title?: string;
    titleEng?: string;
    name?: string;
    surname?: string;
    nameEng?: string;
    surnameEng?: string;
    citizenId?: string;
    email?: string;
    organizationCode?: string;
    supervisorId?: string;
    rankCode?: string;
    fullName?: string;
    officePhoneNumber?: string;
    fullNameHashing?: string;
    nameHashing?: string;
    surnameHashing?: string;
    emailHashing?: string;
    previousOrganizationCode?: string;
    lexsUser?: LexsUser;
}

