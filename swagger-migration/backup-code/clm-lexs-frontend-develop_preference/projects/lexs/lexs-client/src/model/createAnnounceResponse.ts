/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { CaseMatchDetailRes } from './caseMatchDetailRes';
import { DeedMatchDetailRes } from './deedMatchDetailRes';
import { AnnounceMatchDetailRes } from './announceMatchDetailRes';
import { DeedGroupMatchDetail } from './deedGroupMatchDetail';


export interface CreateAnnounceResponse { 
    aucRef?: number;
    matchStatus?: CreateAnnounceResponse.MatchStatusEnum;
    caseMatchDetail?: CaseMatchDetailRes;
    announceMatchDetail?: AnnounceMatchDetailRes;
    deedMatchDetail?: Array<DeedMatchDetailRes>;
    deedGroupMatchDetail?: Array<DeedGroupMatchDetail>;
}
export namespace CreateAnnounceResponse {
    export type MatchStatusEnum = 'PENDING_CASE' | 'PENDING_COLL' | 'PENDING_NEW_CASE' | 'PENDING_NEW_ANNOUNCE' | 'PENDING_NEW_DEEDGROUP' | 'PENDING_NEW_VALIDATE' | 'DONE';
    export const MatchStatusEnum = {
        PendingCase: 'PENDING_CASE' as MatchStatusEnum,
        PendingColl: 'PENDING_COLL' as MatchStatusEnum,
        PendingNewCase: 'PENDING_NEW_CASE' as MatchStatusEnum,
        PendingNewAnnounce: 'PENDING_NEW_ANNOUNCE' as MatchStatusEnum,
        PendingNewDeedgroup: 'PENDING_NEW_DEEDGROUP' as MatchStatusEnum,
        PendingNewValidate: 'PENDING_NEW_VALIDATE' as MatchStatusEnum,
        Done: 'DONE' as MatchStatusEnum
    };
}


