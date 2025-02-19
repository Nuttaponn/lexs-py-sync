/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { WithdrawConsentDocuments } from './withdrawConsentDocuments';
import { LedDocumentDto } from './ledDocumentDto';
import { Contacts } from './contacts';
import { Assets } from './assets';
import { Collaterals } from './collaterals';


export interface WithdrawSeizureGroups { 
    withdrawSeizuresGroupId?: number;
    collaterals?: Array<Collaterals>;
    contacts?: Array<Contacts>;
    withdrawSeizureLedGroupDocuments?: Array<LedDocumentDto>;
    assets?: Array<Assets>;
    consentDocuments?: Array<WithdrawConsentDocuments>;
}

