/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ResponseUnitUserDetailsDto } from './responseUnitUserDetailsDto';


export interface ResponseUnitUserDto { 
    createdDate?: string;
    effectiveDate?: string;
    ktbBossName?: string;
    ktbBossUserId?: string;
    name?: string;
    responseUnitCode?: string;
    responseUnitName?: string;
    responseUnitUserDetailsDto?: Array<ResponseUnitUserDetailsDto>;
    surName?: string;
    teamName?: string;
    userId?: string;
}

