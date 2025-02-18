import { DocumentDto } from '@lexs/lexs-client';

export interface DocumentTemplate {
  documentTemplateId: string;
  documentName: string;
}

export interface ExtendMockDocumentDto extends DocumentDto {
  uploadTimestamp?: string;
}

export interface Asset {
  assetId: number;
  assetType: number;
  assetSubType: number;
  assetTypeDesc: string;
  assetSubTypeDesc: string;
  documentNo: string;
  collateralDetails: string;
  ownerFullName: string;
  totalAppraisalValue: number;
  collateralCaseLexStatus: 'SEIZURED' | 'NON_PLEDGE';
  assentRlsStatus: string;
  obligationStatus: string;
  isSelected: boolean;
  disabled: boolean;
  seizureStatus: string;
  seizuredByLitigationId: number | null;
  seizuredByCaseId: number | null;
  seizuredBySeizureId: string;
  seizuredByParty: number | null;
  assetDocuments: ExtendMockDocumentDto[];
}

interface ProcessingDocument {
  documentId: number;
  documentTemplate: DocumentTemplate;
  imageSource: string;
  imageId: string;
  imageName: string;
  uploadTimestamp: string;
  documentType: string;
  cifNo: string;
  taxId: string;
  name: string;
  relation: string;
}

export interface SeizureDTO {
  seizureId: string;
  seizureStatus: string;
  lawyerId: string;
  lawyerName: string;
  recommendLawyerId: string;
  selectedAppraisalValue: number;
  assets: Asset[];
  processingDocument: ProcessingDocument[]; // รายการเอกสาร
}

// ลำดับ;
// ประเภททรัพย์;
// ประเภทย่อย;
// เลขที่เอกสารสิทธิ์;
// รายละเอียดทรัพย์;
// เจ้าของกรรมสิทธิ์;
// ราคาประเมิน (บาท);
// ภาระผูกพัน;
// สถานะทรัพย์ที่สืบพบ;
// สถานะทรัพย์(LEXS);
// รายการเอกสาร;

export interface NonPledgeRequestData {
  header: string;
  assetIdList: number[];
  taskId: number;
}
