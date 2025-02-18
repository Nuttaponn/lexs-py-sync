import { ContractDto, DocumentDto } from '@lexs/lexs-client';

export interface RelationTypes {
  relationType: string;
  relationDesc: string;
  readyForNotice?: boolean;
  readyForLitigation?: boolean;
  readyForDoc?: boolean;
  forLitigation?: boolean;
  forNoticeLetter?: boolean;
  forDoc?: boolean;
  readyForAsset?: boolean;
  forAsset?: boolean;
  persons: Array<Persons>;
  expanded: boolean;
}

export interface Persons {
  personId: string;
  personType: string;
  subRelationDesc: string;
  name?: string;
  identificationNo?: string;
  readyForNotice: boolean;
  readyForLitigation: boolean;
  readyForDoc: boolean;
  forDoc?: boolean;
  forLitigation?: boolean;
  forNoticeLetter?: boolean;
  readyForAsset?: boolean;
  forAsset?: boolean;
  document: Array<DocumentsDto>;
  expanded: boolean;
  documentNumber: number;
  totalDocuments: number;
  headers: Array<any>;
  documentTemplateId?: string;
  documentName?: string;
}

export interface CollateralTypes {
  docGroup: string;
  docGroupDesc: string;
  readyForNotice?: boolean;
  readyForLitigation?: boolean;
  readyForDoc?: boolean;
  readyForAsset?: boolean;
  forAsset?: boolean;
  forLitigation?: boolean;
  forNoticeLetter?: boolean;
  forDoc?: boolean;
  contracts: Array<Contracts>;
  collaterals: Array<Collaterals>;
  documentNumber: number;
  documents: Array<DocumentsDto>;
  expanded: boolean;
  accounts?: any;
  contractTypes?: any;
}
export interface Contracts extends ContractDto {
  document?: DocumentsDto;
  subContracts?: Array<SubContracts>;
  isSubContact?: boolean;
}

export interface SubContracts extends ContractDto {
  accounts: Array<any>;
  collaterals: Array<any>;
  document: DocumentDto;
}

export interface Collaterals {
  collateralId: string;
  collateralDesc: string;
  accounts: Array<any>;
  document: DocumentsDto;
}

export interface DocumentsDto extends DocumentDto {
  documents: Array<DocumentDto>;
  readyForNotice?: boolean;
  readyForLitigation?: boolean;
}
