import { BatchDataDto, NameValuePair } from '@lexs/lexs-client';

export const accountDataTypeOptions: NameValuePair[] = [
  { name: 'Account List', value: BatchDataDto.ProfileDirectTypeEnum.AccountList },
  { name: 'Account Overview', value: BatchDataDto.ProfileDirectTypeEnum.AccountOverview },
  { name: 'Account History', value: BatchDataDto.ProfileDirectTypeEnum.AccountHistory },
  { name: 'Interest Change Summary Report', value: BatchDataDto.ProfileDirectTypeEnum.InterestChangeSummaryReport },
  { name: 'Statement', value: BatchDataDto.ProfileDirectTypeEnum.Statement },
];

export const searchRealTime: NameValuePair[] = [
  { name: 'Account List', value: BatchDataDto.ProfileDirectTypeEnum.AccountList },
  { name: 'Account Overview', value: BatchDataDto.ProfileDirectTypeEnum.AccountOverview },
  { name: 'Outstanding Report from TFS', value: BatchDataDto.ProfileDirectTypeEnum.OutstandingReport },
];
