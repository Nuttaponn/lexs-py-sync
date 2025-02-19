/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { InitialDeedInfoValidation } from './initialDeedInfoValidation';
import { FinalDeedInfoValidation } from './finalDeedInfoValidation';


export interface DeedBiddingCollateral { 
    assetDetail?: string;
    assetTypeDesc?: string;
    collateralDocNo?: string;
    collateralId?: string;
    collateralSubTypeCode?: string;
    collateralTypeCode?: string;
    debtname?: string;
    deedId?: number;
    deedInfoValid?: boolean;
    deedInfoValidationResult?: string;
    deedno?: string;
    defendantname?: string;
    finalDeedInfoValidation?: FinalDeedInfoValidation;
    initialDeedInfoValidation?: InitialDeedInfoValidation;
    landType?: string;
    ledname?: string;
    occupant?: string;
    ownername?: string;
    plaintiffname?: string;
    redCaseNo?: string;
    remark?: string;
    saletypedesc?: string;
    url?: string;
}

