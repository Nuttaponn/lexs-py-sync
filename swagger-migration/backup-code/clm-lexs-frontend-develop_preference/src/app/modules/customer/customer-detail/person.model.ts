import { PersonDto } from '@lexs/lexs-client';

export interface IPersonDto extends PersonDto {
  relationSeq?: number;
  isAdditionalPersons?: boolean;
  canUpdateAddress?: boolean;
  foundDopaOrDBD?: boolean;
  manualAddressLineEmpty?: boolean;
  foundHeirObj?: boolean;
}
