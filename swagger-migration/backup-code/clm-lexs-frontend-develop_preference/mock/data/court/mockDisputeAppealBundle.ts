import { DisputeAppealBundleDto } from "@lexs/lexs-client";

export const mockDisputeAppealBundle: DisputeAppealBundleDto = {
  "courtVerdicts": {
    "headerFlag": "DRAFT",
    "blackCaseNo": "B001/2565",
    "redCaseNo": "คพ1111/2565",
    "courtLevel": "CIVIL",
    "courtName": "ศาลแขวงปทุมวัน",
    "firstVerdictUserId": "13908",
    "firstVerdictDate": "2022-12-01",
    "lastVerdictUserId": "13908",
    "lastVerdictDate": "2023-01-01",
    "firstVerdictUserFirstName": "ชมพู",
    "firstVerdictUserLastName": "เทียมศร",
    "lastVerdictUserFirstName": "ชมพู",
    "lastVerdictUserLastName": "เทียมศร",
    "courtVerdictDate": "2023-01-14",
    "courtVerdictTypeDesc": "พิพากษาตามยอม",
    "courtVerdictTypeCode": "2",
    "courtVerdictDesc": "พิพากษาให้ชำระหนี้เต็มตามฟ้อง",
    "courtVerdictCode": "1",
    "testimonyStatus": "FINISHED",
    "defendants": [
      {
        "personId": "1133553",
        "title": "นาย",
        "firstName": "เบิร์ต",
        "lastName": "โรมัน",
        "identificationNo": "8289032099003",
        "relation": "MAIN_BORROWER"
      },
      {
        "personId": "7265970",
        "title": "นาย",
        "firstName": "จาตุรงณ์",
        "lastName": "มกจ๊ก",
        "identificationNo": "0805135499001",
        "relation": "CO_BORROWER"
      }
    ],
    "courtVerdictDocuments": [
      {
        "documentId": 0,
        "documentTemplate": {
          "documentTemplateId": "LEXSF010",
          "documentName": "คำพิพากษา",
          "searchType": "LEXS",
          "documentGroup": "LITIGATION",
          "needHardCopy": false,
          "optional": false,
          "forNoticeLetter": false,
          "forLitigation": false,
          "requiredDocumentDate": true,
          "contentType": "application/pdf"
        },
        "imageId": "",
        "imageName": "",
        "documentDate": "2023-02-03T06:05:08.079Z",
        "active": false
      },
      {
        "documentId": 0,
        "documentTemplate": {
          "documentTemplateId": "LEXSF004",
          "documentName": "เอกสารอื่นๆ ที่เกี่ยวข้องกับการดำเนินคดี",
          "searchType": "LEXS",
          "documentGroup": "LITIGATION",
          "needHardCopy": false,
          "optional": true,
          "forNoticeLetter": false,
          "forLitigation": false,
          "requiredDocumentDate": true,
          "contentType": "application/pdf"
        },
        "imageId": "",
        "imageName": "",
        "documentDate": "2023-02-03T06:05:08.079Z",
        "active": false
      },
      {
        "documentId": 0,
        "documentTemplate": {
          "documentTemplateId": "LEXSF009",
          "documentName": "ตารางคำนวนยอดหนี้ตามคำพิพากษา",
          "searchType": "LEXS",
          "documentGroup": "LITIGATION",
          "needHardCopy": false,
          "optional": true,
          "forNoticeLetter": false,
          "forLitigation": false,
          "requiredDocumentDate": true,
          "contentType": "application/pdf"
        },
        "imageId": "",
        "imageName": "",
        "documentDate": "2023-02-03T06:05:08.079Z",
        "active": false
      },
      {
        "documentId": 0,
        "documentTemplate": {
          "documentTemplateId": "LEXSF012",
          "documentName": "คำพิพากษาตามยอม",
          "searchType": "LEXS",
          "documentGroup": "LITIGATION",
          "needHardCopy": false,
          "optional": true,
          "forNoticeLetter": false,
          "forLitigation": false,
          "requiredDocumentDate": true,
          "contentType": "application/pdf"
        },
        "imageId": "",
        "imageName": "",
        "documentDate": "2023-02-03T06:05:08.079Z",
        "active": false
      },
      {
        "documentId": 0,
        "documentTemplate": {
          "documentTemplateId": "LEXSF013",
          "documentName": "สัญญาประนีประนอมยอมความ",
          "searchType": "LEXS",
          "documentGroup": "LITIGATION",
          "needHardCopy": false,
          "optional": true,
          "forNoticeLetter": false,
          "forLitigation": false,
          "requiredDocumentDate": true,
          "contentType": "application/pdf"
        },
        "imageId": "",
        "imageName": "",
        "documentDate": "2023-02-03T06:05:08.079Z",
        "active": false
      },
      {
        "documentId": 0,
        "documentTemplate": {
          "documentTemplateId": "LEXSF052",
          "documentName": "หนังสือรับรองคดีถึงที่สุด",
          "searchType": "LEXS",
          "documentGroup": "LITIGATION",
          "needHardCopy": false,
          "optional": false,
          "forNoticeLetter": false,
          "forLitigation": false,
          "requiredDocumentDate": true,
          "contentType": "application/pdf"
        },
        "imageId": "",
        "imageName": "",
        "documentDate": "2023-02-03T06:05:08.079Z",
        "active": false
      }
    ],
    "accounts": [
      {
        "litigationCaseId": 11,
        "accountId": "100114981492",
        "totalAmount": 10500.00,
        "outstandingBalance": 10000.00,
        "lateChargeAmount": 500.00,
        "lateCharge": 0.00,
        "marketCode": "4002",
        "marketDescription": "รับซื้อตั๋วเงิน(ในท้องถิ่น)",
        "verdictTotalAmount": 0,
        "verdictOutstandingBalance": 0,
        "verdictLateChargeAmount": 0,
        "verdictLateCharge": 0
      },
      {
        "litigationCaseId": 11,
        "accountId": "100115397797",
        "totalAmount": 10100.00,
        "outstandingBalance": 10000.00,
        "lateChargeAmount": 100.00,
        "lateCharge": 0.00,
        "marketCode": "4059",
        "marketDescription": "โครงการสินเชื่อดอกเบี้ยต่ำเพื่อเป็นเงินทุนหมุนเวียนให้แก่ผู้ประกอบการ SMEs (ตั๋วสัญญาใช้เงิน)",
        "verdictTotalAmount": 0,
        "verdictOutstandingBalance": 0,
        "verdictLateChargeAmount": 0,
        "verdictLateCharge": 0
      }
    ],
    "courtFee": [
      {
        "transactionName": "E11",
        "transactionDate": "2022-12-28",
        "courtLevel": "คดีนี้",
        "accountNo": "100086711604",
        "initialAmount": 1000.00,
        "netAmount": 20404.00,
        "courtRefundAmount": 3333.00
      }
    ],
    "totalInitialAmount": 1000.00,
    "totalNetAmount": 20404.00,
    "totalCourtRefundAmount": 3333.00,
    "debtorLawyerFee": [
      {
        "courtName": "ศาลชั้นต้น",
        "initialAmount": 3333.00,
        "paidAmount": 3333.00,
        "remainingAmount": 33333.00
      }
    ],
    "otherCourtFeeTypeDesc": "ศาลสั่งคืนทั้งหมด",
    "otherCourtFeeTypeCode": "1",
    "remark": "testtttttttt by yaaaa  kkkkkkk",
    "caseEnd": true,
    "ciosVerdictDate": false,
    "ciosRedCaseNo": false,
    "litigationId": "MOCK0004",
    "litigationCaseId": 11,
    "taskId": 0,
    "extendAppeals": [],
    "acknowledgement": false,
    "courtFeePaymentStatus": "รอรับเงิน"
  },
  disputeAppeal: {
    "disputeAppealId": 1,
    "defendantAppealDate": "2023-02-03T00:00:00.000Z",
    "disputeAppealDescription": "12345",
    "disputeAppealDocuments": [
      {
        "active": true,
        "documentId": 0,
        "documentTemplate": {
          "documentTemplateId": "LEXSF087",
          "documentName": "หมายศาล (จำเลยยื่นอุทธรณ์)",
          "searchType": "LEXS",
          "documentGroup": "LITIGATION",
          "needHardCopy": false,
          "optional": false,
          "forNoticeLetter": false,
          "forLitigation": false,
          "requiredDocumentDate": true,
          "contentType": "application/pdf"
        },
        "imageId": "db08eb1b-ea96-4b35-9927-6c0866d46f7b",
        "imageName": "456",
        "documentDate": "2023-02-03T06:05:08.079Z"
      },
      {
        "active": true,
        "documentId": 0,
        "documentTemplate": {
          "documentTemplateId": "LEXSF089",
          "documentName": "คำฟ้องอุทธรณ์ (จำเลย)",
          "searchType": "LEXS",
          "documentGroup": "LITIGATION",
          "needHardCopy": false,
          "optional": false,
          "forNoticeLetter": false,
          "forLitigation": false,
          "requiredDocumentDate": true,
          "contentType": "application/pdf"
        },
        "documentTemplateId": "LEXSF089",
        "imageId": "3c9e10b9-5916-4d6d-9e48-bda2703a63d4",
        "imageName": "123",
        "documentDate": "2023-02-03T06:05:11.483Z"
      },
      {
        "active": false,
        "documentId": 0,
        "documentTemplate": {
          "documentTemplateId": "LEXSF061",
          "documentName": "เอกสารอื่นๆ",
          "searchType": "LEXS",
          "documentGroup": "LITIGATION",
          "needHardCopy": false,
          "optional": true,
          "forNoticeLetter": false,
          "forLitigation": false,
          "requiredDocumentDate": true,
          "contentType": "application/pdf"
        },
        "documentTemplateId": "LEXSF061",
        "imageId": '',
        "imageName": '',
        "documentDate": "",
      }
    ],
    "disputeDefendants": [
      {
        "personId": "1133553",
        "title": "นาย",
        "firstName": "เบิร์ต",
        "lastName": "โรมัน",
        "identificationNo": "8289032099003",
        "relation": "MAIN_BORROWER"
      }
    ],
    "finishEfilling": false,
    "lastDisputeAppealDate": "2023-02-28T00:00:00.000Z",
    "litigationCaseId": 11,
    "requestDefer": true,
    "updateFlag": "A"
  }
}
