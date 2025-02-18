/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { NonPledgePropertiesAssetDoc } from './nonPledgePropertiesAssetDoc';


export interface NonPledgePropertiesAsset { 
    assentRlsStatus?: string;
    assetDocuments?: Array<NonPledgePropertiesAssetDoc>;
    assetId?: number;
    assetSubType?: number;
    assetSubTypeDesc?: string;
    assetType?: number;
    assetTypeDesc?: string;
    collateralCaseLexStatus?: NonPledgePropertiesAsset.CollateralCaseLexStatusEnum;
    collateralDetails?: string;
    disabled?: boolean;
    documentNo?: string;
    isSelected?: boolean;
    obligationStatus?: string;
    ownerFullName?: string;
    seizureStatus?: string;
    seizuredByCaseId?: string;
    seizuredByLitigationId?: string;
    seizuredByParty?: string;
    seizuredBySeizureId?: string;
    totalAppraisalValue?: number;
}
export namespace NonPledgePropertiesAsset {
    export type CollateralCaseLexStatusEnum = 'PLEDGE' | 'SEIZURED' | 'ON_SALE' | 'PENDING_SALE' | 'SOLD' | 'NOT_APPLICABLE';
    export const CollateralCaseLexStatusEnum = {
        Pledge: 'PLEDGE' as CollateralCaseLexStatusEnum,
        Seizured: 'SEIZURED' as CollateralCaseLexStatusEnum,
        OnSale: 'ON_SALE' as CollateralCaseLexStatusEnum,
        PendingSale: 'PENDING_SALE' as CollateralCaseLexStatusEnum,
        Sold: 'SOLD' as CollateralCaseLexStatusEnum,
        NotApplicable: 'NOT_APPLICABLE' as CollateralCaseLexStatusEnum
    };
}


