/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DeedBiddingCollateral } from './deedBiddingCollateral';


export interface DeedGroupBiddingCollateral { 
    deedGroupId?: string;
    fsubbidnum?: string;
    totalDeeds?: string;
    totalCollaterals?: string;
    deeds?: Array<DeedBiddingCollateral>;
    valid?: boolean;
}

