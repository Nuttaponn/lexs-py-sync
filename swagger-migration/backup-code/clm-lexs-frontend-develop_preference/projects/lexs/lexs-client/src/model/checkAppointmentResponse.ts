/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { CheckAppLists } from './checkAppLists';


export interface CheckAppointmentResponse { 
    branchId?: string;
    branchName?: string;
    ccCode?: string;
    ccName?: string;
    checkAppLists?: CheckAppLists;
    locationId?: string;
    locationName?: string;
    message?: string;
    statusCode?: number;
}

