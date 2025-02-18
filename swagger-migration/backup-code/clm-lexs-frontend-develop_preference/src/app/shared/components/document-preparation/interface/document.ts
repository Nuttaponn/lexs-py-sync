import { DOC_TEMPLATE } from '@app/shared/constant';
import { CollateralTypes, RelationTypes } from '@app/shared/models';
import { CommitmentDto, DocumentDto, DocumentRequest, PersonDto } from '@lexs/lexs-client';

export interface DocumentGroup {
  docGroup: string;
  readyForNotice: boolean;
  readyForDoc?: boolean;
  readyForLitigation: boolean;
  forNoticeLetter?: boolean;
  forLitigation?: boolean;
  accountsSet?: AccountsSet[];
  documents?: DisplayDocument[];
  contracts?: Contract[];
  documentNumber?: number;
  totalDocuments?: number;
}

export interface Contract {
  documentTemplateId: string;
  documentSetName: string;
  forLitigation: boolean;
  forNoticeLetter: boolean;
  optional: boolean;
  active: boolean;
  disabled: boolean;
  documents: DisplayDocument[];
  // document that is used to determined whether the contract is active or not
  dummyDocument?: DisplayDocument;
  single: boolean;
  initButtonText?: string;
  editButtonText?: string;
  documentEditText?: string | null;
  subDocumentPrefix?: string;
  readyForLitigation?: boolean;
  readyForNotice?: boolean;
  readyForDoc?: boolean;
  needsCopyForLitigation?: boolean;
}

export interface AccountsSet {
  readyForNotice?: boolean;
  readyForLitigation?: boolean;
  readyForDoc?: boolean;
  commitments?: DisplayCommitment[];
}

export interface DisplayCommitment extends CommitmentDto {
  accountTypeDesc?: string;
  documentsAndBills?: Array<Bill | DisplayDocument>;
  readyForLitigation?: boolean;
  readyForNotice?: boolean;
  readyForDoc?: boolean;
  needsCopyForLitigation?: boolean;
  documentNumber?: number;
  totalDocuments?: number;
  details?: any;
}

export interface DisplayDocument extends DocumentDto {
  id?: number;
  order?: number;
  optional?: boolean;
  createdDate?: string;
  ownerOrganization?: string;
  handlingOrganization?: string;
  updateFlag?: DocumentRequest.UpdateFlagEnum;
  readyForLitigation?: boolean;
  readyForNotice?: boolean;
  readyForDoc?: boolean;
  needsCopyForLitigation?: boolean;
  hasSave?: boolean;
  rejectReason?: boolean;
  hardCopyState?: any;
  tooltips?: any;
}

export interface Bill {
  order?: number;
  active?: boolean;
  billNo?: string;
  dpd?: number;
  forLitigation?: boolean;
  forNoticeLetter?: boolean;
  optional?: boolean;
  documents?: DisplayDocument[];
  readyForLitigation?: boolean;
  readyForNotice?: boolean;
  readyForDoc?: boolean;
  needsCopyForLitigation?: boolean;
}

export interface SubAccount {
  order?: number;
  active?: boolean;
  accountNumber?: string;
  forLitigation?: boolean;
  forNoticeLetter?: boolean;
  optional?: boolean;
  documents?: DisplayDocument[];
  readyForLitigation?: boolean;
  readyForNotice?: boolean;
  readyForDoc?: boolean;
  needsCopyForLitigation?: boolean;
}

export const initCollateral: Array<CollateralTypes> = [
  {
    docGroup: 'col_contract',
    docGroupDesc: 'เอกสารสัญญา',
    readyForNotice: false,
    readyForLitigation: false,
    readyForDoc: false,
    forLitigation: false,
    forNoticeLetter: false,
    contracts: [],
    expanded: false,
    documents: [],
    collaterals: [],
    documentNumber: 0,
  },
  {
    docGroup: 'col_ownership',
    docGroupDesc: 'เอกสารสิทธิ์',
    readyForNotice: false,
    readyForLitigation: false,
    readyForDoc: false,
    forLitigation: false,
    forNoticeLetter: false,
    collaterals: [],
    expanded: false,
    documents: [],
    contracts: [],
    documentNumber: 0,
  },
  {
    docGroup: 'col_other',
    docGroupDesc: 'เอกสารอื่นๆ',
    readyForNotice: false,
    readyForLitigation: false,
    readyForDoc: false,
    forLitigation: false,
    forNoticeLetter: false,
    documents: [],
    expanded: false,
    contracts: [],
    collaterals: [],
    documentNumber: 0,
  },
];

export const initPerson: Array<RelationTypes> = [
  {
    relationType: PersonDto.RelationEnum.MainBorrower,
    relationDesc: 'เอกสารผู้กู้หลัก',
    readyForNotice: false,
    readyForLitigation: false,
    readyForDoc: false,
    forLitigation: false,
    forNoticeLetter: false,
    expanded: true,
    persons: [],
  },
  {
    relationType: PersonDto.RelationEnum.CoBorrower,
    relationDesc: 'เอกสารผู้กู้ร่วม ',
    readyForNotice: false,
    readyForLitigation: false,
    readyForDoc: false,
    forLitigation: false,
    forNoticeLetter: false,
    expanded: false,
    persons: [],
  },
  {
    relationType: PersonDto.RelationEnum.Guarantor,
    relationDesc: 'เอกสารผู้ค้ำประกัน',
    readyForNotice: false,
    readyForLitigation: false,
    readyForDoc: false,
    forLitigation: false,
    forNoticeLetter: false,
    expanded: false,
    persons: [],
  },
  {
    relationType: PersonDto.RelationEnum.CollateralOwner,
    relationDesc: 'เอกสารผู้จำนอง',
    readyForNotice: false,
    readyForLitigation: false,
    readyForDoc: false,
    forLitigation: false,
    forNoticeLetter: false,
    expanded: false,
    persons: [],
  },
];
export const LCS_DOC = [
  {
    documentId: 0,
    imageSource: 'LCS',
    documentTemplate: {
      documentTemplateId: DOC_TEMPLATE.LEXSD003,
      documentName: 'หนังสือที่ธนาคารแจ้งผู้ค้ำประกันถึงเหตุผิดนัดชำระหนี้ภายใน 60 วัน นับแต่วันที่ลูกหนี้ผิดนัด',
      searchType: 'DIMS',
      documentGroup: 'PERSON_LCS',
      forNoticeLetter: true,
      forLitigation: true,
      imageId: null,
      needHardCopy: true,
      requiredDocumentDate: false,
    },

    active: true,
    documentTemplateId: DOC_TEMPLATE.LEXSD003,
    documents: [
      {
        documentId: 0,
        imageSource: 'LCS',
        documentTemplate: {
          documentTemplateId: DOC_TEMPLATE.LEXSD003,
          documentName: 'หนังสือที่ธนาคารแจ้งผู้ค้ำประกันถึงเหตุผิดนัดชำระหนี้ภายใน 60 วัน นับแต่วันที่ลูกหนี้ผิดนัด',
          searchType: 'DIMS',
          documentGroup: 'PERSON_LCS',
          forNoticeLetter: true,
          forLitigation: true,
          imageId: null,
          needHardCopy: true,
          requiredDocumentDate: false,
        },

        active: true,
        documentTemplateId: DOC_TEMPLATE.LEXSD003,
      },
    ],
  },
  {
    documentId: 0,
    imageSource: 'LCS',
    documentTemplate: {
      documentTemplateId: DOC_TEMPLATE.LEXSD004,
      documentName: 'ใบตอบรับ กรณีส่งหนังสือที่ธนาคารแจ้งผู้ค้ำประกันถึงเหตุผิดนัดชำระหนี้ภายใน 60 วัน',
      searchType: 'DIMS',
      documentGroup: 'PERSON_LCS',
      forNoticeLetter: true,
      forLitigation: true,
      imageId: null,
      needHardCopy: true,
      requiredDocumentDate: false,
    },
    active: true,
    documents: [
      {
        documentId: 0,
        imageSource: 'LCS',
        documentTemplate: {
          documentTemplateId: DOC_TEMPLATE.LEXSD004,
          documentName: 'ใบตอบรับ กรณีส่งหนังสือที่ธนาคารแจ้งผู้ค้ำประกันถึงเหตุผิดนัดชำระหนี้ภายใน 60 วัน',
          searchType: 'DIMS',
          documentGroup: 'PERSON_LCS',
          forNoticeLetter: true,
          forLitigation: true,
          imageId: null,
          needHardCopy: true,
          requiredDocumentDate: false,
        },
        active: true,
        documentTemplateId: DOC_TEMPLATE.LEXSD004,
      },
    ],
  },
];

export interface ReadyFor {
  readyForNotice?: boolean;
  readyForLitigation?: boolean;
  readyForAsset?: boolean;
  readyForDoc?: boolean;
}
