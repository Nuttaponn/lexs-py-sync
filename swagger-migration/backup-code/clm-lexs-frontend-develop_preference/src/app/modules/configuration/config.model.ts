import { KlawConfigDto, LexsUserOption, ResponseUnitUserDetailsDto, ResponseUnitUserDto } from '@lexs/lexs-client';

export interface ILexsUserOption extends LexsUserOption {
  fullname?: string;
  textShow?: string;
}

export interface ConfigurationSearchConditionReq {
  userId?: string;
  responseUnitCode?: string;
  size?: number;
  sortBy?: Array<string>;
  sortOrder?: string;
  page?: number;
}
export interface ExtendResponseUnitUserDto extends ResponseUnitUserDto {
  no?: string;
  customPrimaryKey?: string;
  responseUnitUserDetailsDto?: Array<ExtendedResponseUnitUserDetailsDto>;
}

export interface ExtendedResponseUnitUserDetailsDto extends ResponseUnitUserDetailsDto {
  updateFlag?: string /* ‘A’ (Add), ‘D’ (delete), ‘U’ (Update) */;
  isMock?: boolean;
}

export interface BusinessLogicAdduserValidate {
  isRepeatAssigningUser: boolean;
  isSameEffectiveDateAsExisted: boolean;
}

export interface ExtendedKlawConfigDto extends KlawConfigDto {
  usersList?: LexsUserOption[];
  klawName?: string;
  primaryKey?: string;
}
export interface UserMatchDialogResponse {
  selectedUser: ILexsUserOption;
  effectiveDate: string;
}

export namespace ConfigModel {
  export const RES_UNIT_USER_STATUSES = {
    Q: {
      statusCode: 'QUEUE',
      statusName: 'รอมีผล',
    },
    A: {
      statusCode: 'ACTIVE',
      statusName: 'มีผลแล้ว',
    },
    I: {
      statusCode: 'INACTIVE',
      statusName: 'ยกเลิกแล้ว',
    },
  };

  export type UpdateFlagEnum = 'A' | 'U' | 'D';
  export const UpdateFlagEnum = {
    A: 'A' as UpdateFlagEnum,
    U: 'U' as UpdateFlagEnum,
    D: 'D' as UpdateFlagEnum,
  };
}
