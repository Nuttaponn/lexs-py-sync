/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { WithdrawSeizureResponse } from './withdrawSeizureResponse';


export interface WithdrawLitigationCaseDto { 
    litigationCaseId?: number;
    courtBlackCaseNo?: string;
    courtRedCaseNo?: string;
    withdrawSeizure?: Array<WithdrawSeizureResponse>;
}

