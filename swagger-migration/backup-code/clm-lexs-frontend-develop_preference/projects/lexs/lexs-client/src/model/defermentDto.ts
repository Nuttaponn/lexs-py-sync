/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DefermentItem } from './defermentItem';
import { DefermentHeaderDetails } from './defermentHeaderDetails';
import { CommitmentDto } from './commitmentDto';


export interface DefermentDto { 
    commitmentAccounts?: Array<CommitmentDto>;
    deferment?: DefermentItem;
    defermentApproves?: Array<DefermentItem>;
    defermentHistories?: Array<DefermentItem>;
    defermentPresents?: Array<DefermentItem>;
    defermentRole?: DefermentDto.DefermentRoleEnum;
    firstTimeAmd?: boolean;
    firstTimeRm?: boolean;
    headerDetails?: DefermentHeaderDetails;
    maxPrescriptionMonth?: number;
    minPrescriptionMonth?: number;
    prescriptionDate?: string;
    tdrContractDate?: string;
    totalDefermentDaysAmdResponseUnit?: number;
    totalDefermentDaysResponseUnit?: number;
    usedImageIds?: Array<string>;
}
export namespace DefermentDto {
    export type DefermentRoleEnum = 'MAKER' | 'APPROVER' | 'OTHER';
    export const DefermentRoleEnum = {
        Maker: 'MAKER' as DefermentRoleEnum,
        Approver: 'APPROVER' as DefermentRoleEnum,
        Other: 'OTHER' as DefermentRoleEnum
    };
}


