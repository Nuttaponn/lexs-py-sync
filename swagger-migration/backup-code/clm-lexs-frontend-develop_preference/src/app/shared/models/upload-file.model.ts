import { ConfirmationFormDto, DocumentDto, DocumentTemplateDto, PaymentFormDto } from '@lexs/lexs-client';
import { ITooltip } from './tooltip.model';

export interface UploadFileContentConfirmationFormDto extends ConfirmationFormDto {
  fileName?: string;
}
export interface UploadFileContentPaymentFormDto extends PaymentFormDto {
  fileName?: string;
}

export interface IGenerateFile {
  isAllow?: boolean;
  isDownload?: boolean;
}

export interface IUploadMultiFile {
  documentTemplate?: DocumentTemplateDto;
  documentTemplateId?: string;
  imageId?: string | null;
  uploadRequired?: boolean;
  removeDocument?: boolean;
  uploadDate?: string;
  documentDate?: string;
  isUpload: boolean;
  viewOnly?: boolean;
  coupleDeliveryFee?: string;
  generateFile?: IGenerateFile; // for get generate doc from BE succ.
  active?: boolean;
  params?: any;
  uploadFlag?: 'RECEIPT' | 'PAYMENT'; // LEX2-3276 read-receipt-form,
  indexOnly?: boolean;
  disabled?: boolean;
  multipleUpload?: boolean; // suport only one template id
  runningNo?: number;
  attributes?: UploadFileCustomAttribute;
  tooltip?: boolean;
  paramsMsg?: Array<ITooltip> | undefined;
  imageSource?: DocumentDto.ImageSourceEnum;
}

export interface IUploadMultiInfo {
  cif: string;
  litigationId?: string;
  taskId?: string;
  withdrawSeizureId?: string;
  withdrawSeizuresLedId?: string;
  auctionBiddingId?: string;
  aucBiddingDeedGroupId?: number;
  aucRef?: number;
}

export interface IUploadInfo {
  cif: string;
  documentTemplateId: string;
  litigationId?: string;
  taskId?: string;
}

export interface IERRORS {
  code: string;
  message: string;
}

export interface IERRORS_UPLOAD {
  errors: IERRORS[];
}

export interface DatePickerChange {
  dateValue: string;
  index: number;
}

export interface UploadFileCustomAttribute {
  ledName?: string;
  lawyerName?: string;
  suspendAuctionEndDate?: string;
  collateralIds?: any[];
  redCaseNo?: string;
  documentNo?: string;
  collateralOwnerName?: string;
  id?: number;
}
