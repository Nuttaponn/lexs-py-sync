/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DeedGroupHistory } from './deedGroupHistory';


export interface ResolutionHistory { 
    meetingNo?: string;
    meetingDate?: string;
    totalUpdatedCollateral?: number;
    footNote?: string;
    deedGroups?: Array<DeedGroupHistory>;
}

