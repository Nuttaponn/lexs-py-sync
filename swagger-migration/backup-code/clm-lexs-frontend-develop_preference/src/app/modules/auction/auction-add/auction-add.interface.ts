import { AnnounceMatchDetail, AucBiddingDocument, AuctionDetails, CaseMatchDetail, CreateAnnounceResponse, DocumentDto } from "@lexs/lexs-client";

// TODO: remove mockDTO
// export interface CaseMatchDetailExt extends CaseMatchDetail {
  /*
  "document" :  { // use DocumentDto //MVP3 - 08/01/2025
    "documentId" : 0,
    "imageId" : "",
    "imageName" : "",
    "documentDate" : "",
    "documentTemplate" : {
      "documentTemplateId" : "LEXSF137",
      "documentName" : "ใบประกาศขายทอดตลาด"
      }
  },
  */
  // document?: DocumentDto;
// }
// TODO: remove mockDTO
// export interface AnnounceMatchDetailExt extends AnnounceMatchDetail {
//   document?: DocumentDto;
// }
// TODO: remove mockDTO
// export interface CreateAnnounceResponseExt extends CreateAnnounceResponse {
//   // caseMatchDetail?: CaseMatchDetailExt;
//   announceMatchDetail?: AnnounceMatchDetailExt;
// }


/*
export interface AuctionValidationResponse {
  validateStatus?: boolean;
  aucRef?: number;
  aucStatus?: string;
  matchingStatus?: MatchStatusEnum
}
*/
export interface LexsAnnouncementDto {
  // no: number; // ลำดับ
  id?: string;
  redCaseNo: string | null; // คดีหมายเลขแดง
  ledName: string | null; // สำนักงานบังคับคดี
  civilCourtName: string | null; // ชื่อศาล
  seizureDate: string | null; // วันที่ยึดทรัพย์ (formatted as DD/MM/yyyy in Buddhist Era)
  ledType: string | null; // ประเภทสำนักงานบังคับคดี (used for navigation)
}

/*
export interface CaseMatchDetail {
  caseType: string;
  aucLot: string;
  aucSet: string;
  fbidnum: string;
  seizureLedId: string; // for save state

  litigationId: string;
  litigationCaseId: number;
  originalLitigationCaseId: number;
  ledId: number;
  ledName: string;
  civilCourtNo: string;
}
*/
/*
export interface AnnounceMatchDetail {
  // isExhibition: boolean;
  isExhibit: boolean;
  saleChannel: string;
  saleLocation1: string;
  saleTime1: string;
  saleLocation2: string | null;
  saleTime2: string | null;
  bidDates: BidDate[];
  aucBiddingDocuments?: Array<AucBiddingDocument>;
}
*/
/*
export interface BidDate {
  bidDate: string;
  number: number;
}
*/

/*
export interface DeedMatchDetail extends AuctionDetails {
  // fsubbidnum: string;
  // collateralId: string;
  // assetId: string;
  // occupant: string;
  // remark: string;

  // ไม่มีทรัพย์นี้อยู่ในประกาศ
  isExclude?: boolean;
}
*/

/*
export interface DeedGroupMatchDetail {
  fsubbidnum: string;
  totalDeeds: number;
  saleTypeDesc: string;
  reservefund: string;
  reservefund1: string;
  assetPrice2: string;
  assetPrice3: string;
  assetPrice4: string;
  assetPrice5: string;
}
*/

// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// POST /v1/auction/{aucRef}/create-announce/submit

/*
export interface AuctionCreateAnnounceSubmitRequest {
  headerFlag: 'SAVE' | 'DELETE' | 'SUBMIT';
  matchStatus: MatchStatusEnum
  caseMatchDetail: CaseMatchDetail;
  announceMatchDetail: AnnounceMatchDetail;
  // deedMatchDetail: DeedMatchDetail[];
  // deedGroupMatchDetail: DeedGroupMatchDetail[];
}
*/

// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// https://ktbinnovation.atlassian.net/browse/LEX2-42634
/*
export interface AnnounceValidateDto {
  aucLot: string; // Auction lot, e.g., "11/2566"
  aucSet: string; // Auction set, e.g., "สป.2"
  fbidnum: string; // Bid number, e.g., "157"
}
*/

// -------------------------------------------
// -------------------------------------------
// -------------------------------------------

export const exampleData: LexsAnnouncementDto[] = [
  {
    // no: 1,
    id: '1111',
    redCaseNo: "12345/2566",
    ledName: "สำนักงานบังคับคดีกรุงเทพมหานคร",
    civilCourtName: "ศาลแพ่ง",
    seizureDate: "01/01/2566",
    ledType: "MAIN",
  },
  {
    // no: 2,
    id: '1112',
    redCaseNo: null,
    ledName: "สำนักงานบังคับคดีปทุมธานี",
    civilCourtName: null,
    seizureDate: null,
    ledType: "MAIN_(ADDITIONAL)",
  },
];
