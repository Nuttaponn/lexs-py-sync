import { IUploadMultiFile } from '@app/shared/models';
import { DocumentDto } from '@lexs/lexs-client';

export interface IDocument extends DocumentDto {
  uploadDate?: string;
  isUpload?: boolean;
  isSubContract?: boolean | undefined;
  total: number;
  createdDate: string;
  additionalInfo: any;
  uploadRequired?: boolean;
}

export type defermentState =
  | 'NORMAL'
  | 'NORMAL_PENDING_APPROVED'
  | 'DEFERMENT'
  | 'DEFERMENT_PENDING_APPROVED'
  | 'CESSATION'
  | 'CESSATION_PENDING_APPROVED'
  | 'SAVE_DRAFT_DEFERMENT'
  | 'SAVE_DRAFT_CESSATION'
  | 'DEFERMENT_EXEC';
export const defermentState = {
  NORMAL: 'NORMAL' as defermentState,
  NORMAL_PENDING_APPROVED: 'NORMAL_PENDING_APPROVED' as defermentState,
  DEFERMENT: 'DEFERMENT' as defermentState,
  DEFERMENT_PENDING_APPROVED: 'DEFERMENT_PENDING_APPROVED' as defermentState,
  CESSATION: 'CESSATION' as defermentState,
  CESSATION_PENDING_APPROVED: 'CESSATION_PENDING_APPROVED' as defermentState,
  SAVE_DRAFT_DEFERMENT: 'SAVE_DRAFT_DEFERMENT' as defermentState,
  SAVE_DRAFT_CESSATION: 'SAVE_DRAFT_CESSATION' as defermentState,
  DEFERMENT_EXEC: 'DEFERMENT_EXEC' as defermentState,
};

export interface IDefermentExcution {
  defermentCategory?: DefermentCategoryCode;
}

export type DefermentCategoryCode = 'EXECUTION' | 'PROSECUTE';

export interface PermissionExec {
  canDelay?: boolean;
  canExtendDelay?: boolean;
  canEditDelay?: boolean;
  canCancelDelay?: boolean;
}

export interface DefermentStatementUploadedDocument extends DocumentDto {
  documentName?: string;
  uploadDate?: string;
  suspendAuctionEndDate?: string;
  ledName?: string;
  lawyerName?: string;
  collateralIds?: any[];
  redCaseNo?: string;
}

export interface SuspendAuctionResultDocumentsAttributes {
  ledName?: string;
  lawyerId?: string;
  lawyerName?: string;
  suspendAuctionEndDate?: string;
  collateralIds?: any[];
  redCaseNo?: string;
}

export interface SuspendAuctionResultDocumentsUploadMultiFiles extends IUploadMultiFile {
  attributes?: SuspendAuctionResultDocumentsAttributes;
}
