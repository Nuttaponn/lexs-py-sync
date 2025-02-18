import { ConfirmationFormDto, LitigationCaseDto, LitigationCaseGroupDto } from '@lexs/lexs-client';

export interface CourtCaseDto {
  appealSide?: LitigationCaseDto.AppealSideEnum;
  courtLevel?: LitigationCaseDto.CourtLevelEnum;
  case?: LitigationCaseDto;
  isShowColumnBtn?: boolean;
  isShowAddEfilingBtn?: boolean;
}

export interface ExtendedLitigationCaseGroupDto extends LitigationCaseGroupDto {
  courtCaseList?: CourtCaseDto[];
  civilCases?: LitigationCaseDto[];
  suitLitigationCaseId?: number;
}

/* LEXS-confirm-payment, LEX2-3240 */
export interface IExtendConfirmationFormDto extends ConfirmationFormDto {
  remark?: string;
  confirmRefNo?: string;
  fileName?: string;
}

export interface TaskAttr1 {
  disputeAppealId: number;
}

