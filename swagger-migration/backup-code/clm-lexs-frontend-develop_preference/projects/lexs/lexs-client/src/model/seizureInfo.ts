/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SeizureCollateralInfo } from './seizureCollateralInfo';
import { SeizureLedsInfo } from './seizureLedsInfo';
import { AppraisalDocument } from './appraisalDocument';
import { DeedDocument } from './deedDocument';


export interface SeizureInfo { 
    appraisalDocuments?: Array<AppraisalDocument>;
    createdTimestamp?: string;
    deedDocuments?: Array<DeedDocument>;
    lawyerId?: string;
    lawyerName?: string;
    recommendLawyerId?: string;
    seizureCollaterals?: Array<SeizureCollateralInfo>;
    seizureId?: number;
    seizureLeds?: Array<SeizureLedsInfo>;
    seizureType?: SeizureInfo.SeizureTypeEnum;
    unMappedCollaterals?: Array<SeizureCollateralInfo>;
}
export namespace SeizureInfo {
    export type SeizureTypeEnum = 'COL' | 'NCOL';
    export const SeizureTypeEnum = {
        Col: 'COL' as SeizureTypeEnum,
        Ncol: 'NCOL' as SeizureTypeEnum
    };
}


