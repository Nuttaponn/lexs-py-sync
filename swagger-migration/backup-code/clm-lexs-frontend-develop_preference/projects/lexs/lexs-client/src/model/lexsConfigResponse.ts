/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ResponseUnitResponse } from './responseUnitResponse';
import { KlawConfigs } from './klawConfigs';
import { LexsConfig } from './lexsConfig';


export interface LexsConfigResponse { 
    configs?: Array<LexsConfig>;
    klawConfigs?: Array<KlawConfigs>;
    responseUnitResponse?: Array<ResponseUnitResponse>;
}

