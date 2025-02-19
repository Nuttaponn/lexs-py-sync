/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface LitigationCasePerson { 
    litigationCaseId?: number;
    personId?: string;
    relation?: LitigationCasePerson.RelationEnum;
}
export namespace LitigationCasePerson {
    export type RelationEnum = 'MAIN_BORROWER' | 'CO_BORROWER' | 'GUARANTOR' | 'COLLATERAL_OWNER' | 'MAIN_BORROWER_TRUSTEE' | 'CO_BORROWER_TRUSTEE' | 'GUARANTOR_TRUSTEE' | 'MAIN_BORROWER_HEIR' | 'CO_BORROWER_HEIR' | 'GUARANTOR_HEIR' | 'STAND_IN_PAYER' | 'DEBT_ACCEPTOR' | 'DEBT_ACCEPT_SIGNER' | 'CO_DEFENDANT';
    export const RelationEnum = {
        MainBorrower: 'MAIN_BORROWER' as RelationEnum,
        CoBorrower: 'CO_BORROWER' as RelationEnum,
        Guarantor: 'GUARANTOR' as RelationEnum,
        CollateralOwner: 'COLLATERAL_OWNER' as RelationEnum,
        MainBorrowerTrustee: 'MAIN_BORROWER_TRUSTEE' as RelationEnum,
        CoBorrowerTrustee: 'CO_BORROWER_TRUSTEE' as RelationEnum,
        GuarantorTrustee: 'GUARANTOR_TRUSTEE' as RelationEnum,
        MainBorrowerHeir: 'MAIN_BORROWER_HEIR' as RelationEnum,
        CoBorrowerHeir: 'CO_BORROWER_HEIR' as RelationEnum,
        GuarantorHeir: 'GUARANTOR_HEIR' as RelationEnum,
        StandInPayer: 'STAND_IN_PAYER' as RelationEnum,
        DebtAcceptor: 'DEBT_ACCEPTOR' as RelationEnum,
        DebtAcceptSigner: 'DEBT_ACCEPT_SIGNER' as RelationEnum,
        CoDefendant: 'CO_DEFENDANT' as RelationEnum
    };
}


