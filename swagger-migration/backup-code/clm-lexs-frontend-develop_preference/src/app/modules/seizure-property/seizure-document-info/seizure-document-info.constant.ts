import {
  RejectedReason,
  RejectedReasonDto,
  ReturningDocumentInfo,
  SeizureDocumentTemplate,
  SeizureTitleDeedRejectedReason,
  TitleDeedDocument,
} from '@lexs/lexs-client';
export interface TitleDeedDocumentExtend extends TitleDeedDocument {
  sent?: boolean;
  approve?: boolean;
  expanded?: boolean;
  approvedStatus?: boolean;
  readyForAsset?: boolean;
  index?: number;
  documentTemplate?: SeizureDocumentTemplateExtend;
  rejectedReasons?: Array<RejectedReason>;
  sendStatus?: boolean;
  rejectedReason?: SeizureTitleDeedRejectedReason;
  returningDocumentInfo?: ReturningDocumentInfo;
  rejectReason?: boolean;
  name?: string;
  rejectedReasonId?: string;
  rejectedRemarks?: string;
  docCount?: number;
  approveStatus?: boolean;
}

export interface SeizureDocumentTemplateExtend extends SeizureDocumentTemplate {
  forAsset?: boolean;
}
export interface RejectedReasonDtoExtend extends RejectedReasonDto {
  isSaveButton?: boolean;
  mode?: string | null;
}
