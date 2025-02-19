/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SuccessMessageModel } from './successMessageModel';
import { FailureMessageModel } from './failureMessageModel';


export interface NotificationMarkReadResponse { 
    recipientUserId?: string;
    successMessages?: Array<SuccessMessageModel>;
    failureMessages?: Array<FailureMessageModel>;
}

