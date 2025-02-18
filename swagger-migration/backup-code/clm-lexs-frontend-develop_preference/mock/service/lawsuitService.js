function inquiryLawsuits() {
  let content = [];
  for (let index = 0; index < 10; index++) {
    const element = {
      litigationId: `0000000012345${index}`,
      customerId: "0000000012345",
      customerName: "นายสมชาย ใจดี",
      blackCaseNo: "0000/2565",
      redCaseNo: "0000/2565",
      prescriptionDate: "2009-03-29",
      dpd: "9",
      lawyerOfficeName: "0000-ชื่อสำนักงาน",
      lawyerName: "0000-ชื่อทนายความ",
      ownerBranchCode: "0000",
      ownerBranchName: "สาขา",
      amdResponseUnitCode: "0000",
      amdResponseUnitName: "หน่วยงาน",
      kbdUserId: "000000",
      aoUserId: "000000",
      kbdUserName: "000000-สมชาย ใจดี",
      aoUserName: "000000-สมหมาย ใจงาม",
      litigationStatus: "0103",
      litigationStatusDesc: "อนุมัติให้ดำเนินคดี",
      defermentStatus: "NORMAL",
      flag: "TAMC"
    }
    content.push(element)
  }
  const data = {
    "content": content,
    "empty": true,
    "first": true,
    "last": true,
    "number": 0,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "paged": true,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "unpaged": true
    },
    "size": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "totalElements": 255,
    "totalPages": 8
  }
  return data;
}

function getSubAccounts() {
  let data = [];
  for (let index = 0; index < 5; index++) {
    const element = {
      "accountId": "00000" + index,
      "accountName": "accountName_" + index,
      "accountNo": "accountNo_" + index,
      "accountNote": "accountNote_" + index,
      "accountStatus": "accountStatus_" + index,
      "accountType": "OTHER",
      "amountInArrears": 0,
      "billNo": "123456" + index,
      "blackCaseNo": "123456" + index,
      "bookingCode": "bookingCode_" + index,
      "bookingName": "bookingName_" + index,
      "branchCode": "branchCode_" + index,
      "branchCode": "branchCode_" + index,
      "cfinal": "cfinal_" + index,
      "closeDate": "string",
      "commitmentAccountNo": "commitmentAccountNo",
      "contractDate": "string",
      "customerId": "00000000",
      "deliquencyDate": "string",
      "directDebitAccountNumber": "string",
      "dpd": 0,
      "estimatePrescriptionFlag": true,
      "expiryDate": "string",
      "firstDisbursementDate": "string",
      "interestNonBook": 0,
      "lastDisburseDate": "string",
      "lastPaidDate": "string",
      "lastTransactionDate": "string",
      "lastUpdate": "2022-09-05T03:04:55.878Z",
      "lateChargeAmount": 0,
      "lgAccountName": "string",
      "lgAccountNumber": "string",
      "limitAmount": 0,
      "litigationId": "string",
      "litigationStatus": "string",
      "marketCode": "string",
      "marketDescription": "string",
      "miscCharge": 0,
      "noticeContractName": "string",
      "openDate": "string",
      "outstandingAccruedInterest": 0,
      "outstandingBalance": 0,
      "partialWriteOffFlag": "string",
      "partialWriteOffStatus": "string",
      "prescriptionDate": "string",
      "primaryAccountNumber": "string",
      "productType": "string",
      "projectName": "string",
      "redCaseNo": "string",
      "responseBranchCode": "string",
      "responseBranchName": "string",
      "samFlag": "string",
      "sourceSystem": "string",
      "stageFinal": "string",
      "subAccount": true,
      "subAccountOption": "string",
      "subAccountType": "string",
      "tamcFlag": "string",
      "tdrContractDate": "string",
      "tdrDate": "2022-09-05T03:04:55.878Z",
      "tdrStatus": "string",
      "tdrTrackingResult": "string",
      "writeDate": "string",
      "writeOffStatus": "string"
    }
    data.push(element)
  }
  return data;
}

function getLitigationCase() {
  const data = [
    {
      /** คดีความที่ */
      caseGroupNo: "1",
      cases: [
        {
          actionFlag: true,
          appealDate: "",
          appealDueDate: "",
          appealSide: "BANK", // 'BANK' | 'CUSTOMER'
          /** หมายเลขคดีดำ */
          blackCaseNo: "หมายเลขคดีดำ",
          /** คำขอท้ายฟ้อง */
          briefAccuse: "คำขอท้ายฟ้อง",
          /** ทุนทรัพย์ที่ยื่นฟ้อง */
          capitalAmount: 10,
          /** วันที่ยื่นฟ้อง */
          caseDate: "01/01/2022",
          caseType: {
            code: '001',
            name: 'คดีแพ่ง'
          },
          /** ช่องทางการยื่นฟ้อง */
          channel: "EFILING", // "EFILING" | "DIRECT"
          /** Group of คดีแพ่ง */
          civilCourtBlackCaseNo: "Group of คดีแพ่ง",
          /** รหัสศาล */
          courtCode: "รหัสศาล",
          courtDecreeDate: "",
          courtDecreeResult: "",
          courtDecreeStatus: "",
          courtFee: 1000,
          courtFeeStatus: "",
          courtLevel: "CIVIL", // 'CIVIL' | 'APPEAL' | 'SUPREME'
          /** ชื่อศาล */
          courtName: "ชื่อศาล",
          courtVerdictDate: "",
          courtVerdictType: "",
          filingFee: 1000,
          id: 1001,
          /** รหัสทนายความ */
          lawyerId: "รหัสทนายความ",
          /** ชื่อทนายความ */
          lawyerName: "ชื่อทนายความ",
          /** รหัสสำนักงานทนายความ */
          lawyerOfficeCode: "รหัสสำนักงานทนายความ",
          /** ชื่อสำนักงานทนายความ */
          lawyerOfficeName: "ชื่อสำนักงานทนายความ",
          litigationCaseAccounts: [], // Array < LitigationCaseAccountDto >;
          litigationCaseAllegations: [], // Array < LitigationCaseAllegationDto >;
          litigationCost: 1000,
          litigationDocuments: [], // Array < LitigationDocumentDto >;
          paymentAuditingStatus: "",
          persons: [], // Array < LitigationCasePersonDto >;
          pleadingFee: 1000,
          /** หมายเลขคดีแดง */
          redCaseNo: "หมายเลขคดีแดง",
          /** จำนวนวัน SLA */
          sla: "01/01/2022"
        }
      ],
      /** Group of คดีแพ่ง  */
      civilCourtBlackCaseNo: "Group of คดีแพ่ง",
      /** รหัสทนายความ  */
      lawyerId: "รหัสทนายความ",
      /** ชื่อทนายความ */
      lawyerName: "ชื่อทนายความ",
      /** รหัสสำนักงานทนายความ */
      lawyerOfficeCode: "รหัสสำนักงานทนายความ",
      /** ชื่อสำนักงานทนายความ */
      lawyerOfficeName: "ชื่อสำนักงานทนายความ"
    }
  ]
  return data;
}

function getLitigationCaseDetail() {
  const data = {
    actionFlag: true,
    appealDate: "",
    appealDueDate: "",
    appealSide: "BANK", // 'BANK' | 'CUSTOMER'
    /** หมายเลขคดีดำ */
    blackCaseNo: "หมายเลขคดีดำ",
    /** คำขอท้ายฟ้อง */
    briefAccuse: "mock - คำขอท้ายฟ้อง",
    /** ทุนทรัพย์ที่ยื่นฟ้อง */
    capitalAmount: 10,
    /** วันที่ยื่นฟ้อง */
    caseDate: "2022-09-20",
    caseType: { code: '0001', name: 'คดีแพ่ง' },
    /** ช่องทางการยื่นฟ้อง */
    channel: "EFILING", // "EFILING" | "DIRECT"
    /** Group of คดีแพ่ง */
    civilCourtBlackCaseNo: "Group of คดีแพ่ง",
    /** รหัสศาล */
    courtCode: "value court : 0",
    courtDecreeDate: "",
    courtDecreeResult: "",
    courtDecreeStatus: "",
    courtFee: 1000,
    courtFeeStatus: "",
    courtLevel: "CIVIL", // 'CIVIL' | 'APPEAL' | 'SUPREME'
    /** ชื่อศาล */
    courtName: "ชื่อศาล",
    courtVerdictDate: "",
    courtVerdictType: "",
    filingFee: 1000,
    id: 1001,
    /** รหัสทนายความ */
    lawyerId: "0000/0000",
    /** ชื่อทนายความ */
    lawyerName: "ชื่อทนายความ",
    /** รหัสสำนักงานทนายความ */
    lawyerOfficeCode: "รหัสสำนักงานทนายความ",
    /** ชื่อสำนักงานทนายความ */
    lawyerOfficeName: "ชื่อสำนักงานทนายความ",
    litigationCaseAccounts: [
      {
        accountId: '0000001',
        /** อัตราดอกเบี้ย */
        lateCharge: 1,
        /** ดอกเบี้ยยื่นฟ้อง */
        lateChargeAmount: 1,
        litigationCaseId: 1001,
        /** รหัสประเภทหนี้ */
        marketCode: '1010',
        /** ชื่อประเภทหนี้ */
        marketDescription: 'mock market desc',
        /** เงินต้นยื่นฟ้อง */
        outstandingBalance: 1000,
        /** ข้อมูล TDR Status */
        tdrStatus: 'TDR Status',
        /** TDR Tracking Result */
        tdrTrackingResult: 'tdrTrackingResult',
        /** ภาระหนี้รวม */
        totalAmount: 10000
      },
      {
        accountId: '0000002',
        lateCharge: 2,
        lateChargeAmount: 2,
        litigationCaseId: 1002,
        marketCode: '1012',
        marketDescription: 'mock market desc 2',
        outstandingBalance: 2000,
        tdrStatus: 'TDR Status',
        tdrTrackingResult: 'tdrTrackingResult',
        totalAmount: 20000
      }
    ], // Array < LitigationCaseAccountDto >;
    litigationCaseAllegations: [
      {
        code: '0001',
        litigationCaseId: 1001,
        name: 'ชื่อข้อหาฐานความผิด'  /** ชื่อข้อหาฐานความผิด */
      }
    ], // Array < LitigationCaseAllegationDto >;
    litigationCost: 1000,
    litigationDocuments: [
      {
        active: true,
        documentDate: '',
        // documentId: number;
        documentTemplate: {
          documentName: 'เอกสารคำฟ้อง',
          optional: true,
        }, // DocumentTemplateDto
        documentTemplateId: '001',
        imageId: '',
        imageName: '',
      },
      {
        active: true,
        documentDate: '',
        // documentId: number;
        documentTemplate: {
          documentName: 'เอกสารคำฟ้อง',
          optional: true,
        }, // DocumentTemplateDto
        documentTemplateId: '002',
        imageId: '',
        imageName: '',
      },
      {
        active: true,
        documentDate: '',
        // documentId: number;
        documentTemplate: {
          documentName: 'เอกสารแนบท้ายฟ้อง',
          optional: true,
        }, // DocumentTemplateDto
        documentTemplateId: '003',
        imageId: '',
        imageName: '',
      }
    ], // Array < LitigationDocumentDto >;
    litigationId: "LE2565090009",
    paymentAuditingStatus: "",
    persons: [
      {
        /** True- ถูกติ๊กเลือกในคดี, False -ไม่ถูกติ๊กเลือก */
        checked: false,
        /** CIF No. ของลูกหนี้ */
        cifNo: '000000123',
        /** เลขประจำตัวในบัตรประชาชน หรือ Tax No. */
        identificationNo: '1234567890123',
        /** ชื่อนามสกุลสูกหนี้ */
        name: 'person name1',
        personId: '00000300',
        relation: 'MAIN_BORROWER'
      },
      {
        /** True- ถูกติ๊กเลือกในคดี, False -ไม่ถูกติ๊กเลือก */
        checked: true,
        /** CIF No. ของลูกหนี้ */
        cifNo: '000000456',
        /** เลขประจำตัวในบัตรประชาชน หรือ Tax No. */
        identificationNo: '1234567890456',
        /** ชื่อนามสกุลสูกหนี้ */
        name: 'person name2',
        personId: '00000301',
        relation: 'CO_BORROWER'
      }
    ], // Array < LitigationCasePersonDto >;
    pleadingFee: 1000,
    /** หมายเลขคดีแดง */
    redCaseNo: "หมายเลขคดีแดง",
    /** จำนวนวัน SLA */
    sla: "01/01/2022"
  }
  return data
}

function getDefermentApprove() {
  return {
    "deferment": {
      "cancelDate": "2023-01-25T09:19:54.697Z",
      "cancelReason": "cancelReason",
      "cancelWithDebtChanges": true,
      "createdBy": "0000-ชื่อ นามสกุล",
      "createdDate": "2023-01-20T09:19:54.697Z",
      "customerId": "string",
      "defermentApproverCode": "defermentApproverCode",
      "defermentApproverName": "defermentApproverName",
      "defermentDays": 0,
      "defermentId": "00001",
      "defermentReasonCode": "defermentReasonCode",
      "defermentReasonName": "defermentReasonName",
      "defermentReasonOther": "defermentReasonOther",
      "dlaApprove": true,
      "documents": [
        {
          "active": true,
          "attributes": {},
          "commitmentAccounts": [
            "string"
          ],
          "customerId": "string",
          "dimsTicketBarcode": "string",
          "documentCommitmentId": "string",
          "documentDate": "2022-11-25T09:19:54.697Z",
          "documentId": 0,
          "documentTemplate": {
            "autoMatchType": "string",
            "contentType": "string",
            "documentGroup": "LITIGATION",
            "documentName": "string",
            "documentTemplateId": "string",
            "forLitigation": true,
            "forNoticeLetter": true,
            "needHardCopy": true,
            "optional": true,
            "requiredDocumentDate": true,
            "searchType": "LEXS"
          },
          "documentTemplateId": "string",
          "hasOriginalCopy": true,
          "imageId": "string",
          "imageName": "string",
          "imageSource": "LEXS",
          "litigationId": "string",
          "objectId": "string",
          "objectType": "PERSON",
          "receiveDate": "string",
          "received": true,
          "sent": true,
          "storeOrganization": "string",
          "storeOrganizationName": "string",
          "uploadUserId": "string"
        }
      ],
      "endDate": "2022-12-25T09:19:54.697Z",
      "extendDeferment": true,
      "litigationId": "1234567890",
      "responseUnitType": "RESPONSE_UNIT",
      "startDate": "2022-11-20T09:19:54.697Z",
      "updatedBy": "string",
      "updatedDate": "2022-11-25T09:19:54.697Z"
    },
    "defermentHistories": [
      {
        "cancelDate": "2023-01-25T09:19:54.697Z",
        "cancelReason": "string",
        "cancelWithDebtChanges": true,
        "createdBy": "string",
        "createdDate": "2022-11-25T09:19:54.697Z",
        "customerId": "string",
        "defermentApproverCode": "string",
        "defermentApproverName": "string",
        "defermentDays": 0,
        "defermentId": "string",
        "defermentReasonCode": "string",
        "defermentReasonName": "string",
        "defermentReasonOther": "string",
        "dlaApprove": true,
        "documents": [
          {
            "active": true,
            "attributes": {},
            "commitmentAccounts": [
              "string"
            ],
            "customerId": "string",
            "dimsTicketBarcode": "string",
            "documentCommitmentId": "string",
            "documentDate": "2022-11-25T09:19:54.697Z",
            "documentId": 0,
            "documentTemplate": {
              "autoMatchType": "string",
              "contentType": "string",
              "documentGroup": "LITIGATION",
              "documentName": "string",
              "documentTemplateId": "string",
              "forLitigation": true,
              "forNoticeLetter": true,
              "needHardCopy": true,
              "optional": true,
              "requiredDocumentDate": true,
              "searchType": "LEXS"
            },
            "documentTemplateId": "string",
            "hasOriginalCopy": true,
            "imageId": "string",
            "imageName": "string",
            "imageSource": "LEXS",
            "litigationId": "string",
            "objectId": "string",
            "objectType": "PERSON",
            "receiveDate": "string",
            "received": true,
            "sent": true,
            "storeOrganization": "string",
            "storeOrganizationName": "string",
            "uploadUserId": "string"
          }
        ],
        "endDate": "2022-12-25T09:19:54.697Z",
        "extendDeferment": true,
        "litigationId": "string",
        "responseUnitType": "RESPONSE_UNIT",
        "startDate": "2022-11-25T09:19:54.697Z",
        "updatedBy": "string",
        "updatedDate": "2022-11-25T09:19:54.698Z"
      }
    ],
    "prescriptionDate": "2022-11-20T09:19:54.697Z",
    "totalDefermentDaysAmdResponseUnit": 35,
    "totalDefermentDaysResponseUnit": 30
  }
}

function getDefermentAdd() {
  return {
    "deferment": {
    },
    "defermentHistories": []
  }
}

const mock = {
  documents: [
    {
      "documentId": 847701,
      "imageSource": "LEXS",
      "imageId": "086da1b9-8af1-4c35-b532-c6d11992bd84",
      "imageName": "VongolaPrimo.jpg",
      "documentTemplate": {
        "documentTemplateId": "LEXSD013",
        "documentName": "สัญญาสินเชื่อ",
        "searchType": "DIMS",
        "documentGroup": "ACCOUNT_CONTRACT",
        "needHardCopy": true,
        "optional": false,
        "forNoticeLetter": true,
        "forLitigation": true,
        "requiredDocumentDate": false,
        "contentType": "application/pdf"
      },
      "storeOrganization": "108212",
      "storeOrganizationName": "ทีมเกษตรอุตสาหกรรม 1",
      "hasOriginalCopy": true,
      "active": true,
      "documentDate": "2022-09-27T00:00:00+07:00",
      "uploadUserId": "490537",
      "documentCommitmentId": "086da1b9-8af1-4c35-b532-c6d11992bd84",
      "documentTemplateId": "LEXSD013",
      "commitmentAccounts": [
        "000006156630",
        "100097386204",
        "100097387160",
        "100110235732"
      ],
      "sent": true,
      "received": true,
      "receiveDate": "2022-10-21",
      "customerId": "48269966"
    },
    {
      "documentId": 847733,
      "imageSource": "LEXS",
      "imageId": "086da1b9-8af1-4c35-b532-c6d11992bd84",
      "imageName": "VongolaPrimo.jpg",
      "documentTemplate": {
        "documentTemplateId": "LEXSD013",
        "documentName": "สัญญาสินเชื่อ",
        "searchType": "DIMS",
        "documentGroup": "ACCOUNT_CONTRACT",
        "needHardCopy": true,
        "optional": false,
        "forNoticeLetter": true,
        "forLitigation": true,
        "requiredDocumentDate": false,
        "contentType": "application/pdf"
      },
      "storeOrganization": "108212",
      "storeOrganizationName": "ทีมเกษตรอุตสาหกรรม 1",
      "hasOriginalCopy": true,
      "active": true,
      "documentDate": "2022-09-27T00:00:00+07:00",
      "uploadUserId": "490537",
      "documentCommitmentId": "086da1b9-8af1-4c35-b532-c6d11992bd84",
      "documentTemplateId": "LEXSD013",
      "commitmentAccounts": [
        "000006156630",
        "100097386204",
        "100097387160",
        "100110235732"
      ],
      "sent": true,
      "received": true,
      "receiveDate": "2022-10-21",
      "customerId": "48269966"
    },
    {
      "documentId": 769846,
      "imageSource": "LEXS",
      "imageId": "",
      "imageName": "VongolaPrimo.jpg",
      "documentTemplate": {
        "documentTemplateId": "LEXSD015",
        "documentName": "LEXSD015",
        "searchType": "LEXS",
        "documentGroup": "ACCOUNT_CONTRACT",
        "needHardCopy": true,
        "optional": false,
        "forNoticeLetter": true,
        "forLitigation": true,
        "requiredDocumentDate": false,
        "contentType": "application/pdf"
      },
      "storeOrganization": "108212",
      "storeOrganizationName": "ทีมเกษตรอุตสาหกรรม 1",
      "hasOriginalCopy": true,
      "active": true,
      "documentDate": "2022-09-27T00:00:00+07:00",
      "uploadUserId": "490537",
      "documentTemplateId": "LEXSD015",
      "commitmentAccounts": [],
      "sent": true,
      "received": true,
      "receiveDate": "2022-10-21",
      "customerId": "48269966"
    },
    {
      "documentId": 769846,
      "imageSource": "LEXS",
      "imageId": "6e2e5759-84b4-4f0d-846c-b3e4e2f3091f",
      "imageName": "VongolaPrimo.jpg",
      "documentTemplate": {
        "documentTemplateId": "LEXSD014",
        "documentName": "ระบบ Profile Direct - หน้า Account List",
        "searchType": "LEXS",
        "documentGroup": "ACCOUNT_CONTRACT",
        "needHardCopy": true,
        "optional": false,
        "forNoticeLetter": true,
        "forLitigation": true,
        "requiredDocumentDate": true,
        "contentType": "application/pdf"
      },
      "storeOrganization": "108212",
      "storeOrganizationName": "ทีมเกษตรอุตสาหกรรม 1",
      "hasOriginalCopy": true,
      "active": true,
      "documentDate": "2022-09-27T00:00:00+07:00",
      "uploadUserId": "490537",
      "documentTemplateId": "LEXSD014",
      "commitmentAccounts": [],
      "sent": true,
      "received": true,
      "receiveDate": "2022-10-21",
      "customerId": "48269966"
    },
    {
      "documentId": 769847,
      "documentTemplate": {
        "documentTemplateId": "LEXSD017",
        "documentName": "หนังสือแจ้งลูกหนี้และผู้ค้ำประกันกรณีผิดเงื่อนไขที่ต้องปฏิบัติ (Covenant)",
        "searchType": "LEXS",
        "documentGroup": "ACCOUNT_CONTRACT",
        "needHardCopy": true,
        "optional": true,
        "forNoticeLetter": true,
        "forLitigation": true,
        "requiredDocumentDate": true,
        "contentType": "application/pdf"
      },
      "active": false,
      "documentTemplateId": "LEXSD017",
      "commitmentAccounts": [],
      "customerId": "48269966"
    },
  ]
}

const mockHistory = [
  {
    "cancelDate": "2023-12-31T12:12:12",
    "cancelReason": "string",
    "cancelWithDebtChanges": true,
    "createdBy": "string",
    "createdDate": "14/08/1999",
    "customerId": "string",
    "defermentApproverCode": "string",
    "defermentApproverName": "string",
    "defermentDays": 14,
    "defermentId": "string",
    "defermentReasonCode": "string",
    "defermentReasonName": "string",
    "defermentReasonOther": "string",
    "dlaApprove": true,
    "documents": [
      {
        "active": true,
        "attributes": {},
        "commitmentAccounts": [
          "string"
        ],
        "customerId": "string",
        "dimsTicketBarcode": "string",
        "documentCommitmentId": "string",
        "documentDate": "2022-11-24T05:57:36.556Z",
        "documentId": 0,
        "documentTemplate": {
          "autoMatchType": "string",
          "contentType": "string",
          "documentGroup": "LITIGATION",
          "documentName": "หนังสือ1",
          "documentTemplateId": "string",
          "forLitigation": true,
          "forNoticeLetter": true,
          "needHardCopy": true,
          "optional": true,
          "requiredDocumentDate": true,
          "searchType": "LEXS"
        },
        "documentTemplateId": "string",
        "hasOriginalCopy": true,
        "imageId": "string",
        "imageName": "string",
        "imageSource": "LEXS",
        "litigationId": "string",
        "objectId": "string",
        "objectType": "PERSON",
        "receiveDate": "string",
        "received": true,
        "sent": true,
        "storeOrganization": "string",
        "storeOrganizationName": "string",
        "uploadUserId": "string"
      },
      {
        "active": true,
        "attributes": {},
        "commitmentAccounts": [
          "string"
        ],
        "customerId": "string",
        "dimsTicketBarcode": "string",
        "documentCommitmentId": "string",
        "documentDate": "2022-11-24T05:57:36.556Z",
        "documentId": 0,
        "documentTemplate": {
          "autoMatchType": "string",
          "contentType": "string",
          "documentGroup": "LITIGATION",
          "documentName": "หนังสือ1",
          "documentTemplateId": "string",
          "forLitigation": true,
          "forNoticeLetter": true,
          "needHardCopy": true,
          "optional": true,
          "requiredDocumentDate": true,
          "searchType": "LEXS"
        },
        "documentTemplateId": "string",
        "hasOriginalCopy": true,
        "imageId": "string",
        "imageName": "string",
        "imageSource": "LEXS",
        "litigationId": "string",
        "objectId": "string",
        "objectType": "PERSON",
        "receiveDate": "string",
        "received": true,
        "sent": true,
        "storeOrganization": "string",
        "storeOrganizationName": "string",
        "uploadUserId": "string"
      }
    ],
    "endDate": "2022-12-31T12:12:12",
    "extendDeferment": true,
    "litigationId": "string",
    "responseUnitType": "RESPONSE_UNIT",
    "startDate": "2022-12-31T12:12:12",
    "updatedBy": "string",
    "updatedDate": "2022-11-24T05:57:36.556Z"
  },
  {
    "cancelDate": "2023-12-31T12:12:12",
    "cancelReason": "string",
    "cancelWithDebtChanges": true,
    "createdBy": "string",
    "createdDate": "2022-11-24T05:57:36.556Z",
    "customerId": "string",
    "defermentApproverCode": "string",
    "defermentApproverName": "string",
    "defermentDays": 14,
    "defermentId": "string",
    "defermentReasonCode": "string",
    "defermentReasonName": "string",
    "defermentReasonOther": "string",
    "dlaApprove": true,
    "documents": [
      {
        "active": true,
        "attributes": {},
        "commitmentAccounts": [
          "string"
        ],
        "customerId": "string",
        "dimsTicketBarcode": "string",
        "documentCommitmentId": "string",
        "documentDate": "2022-11-24T05:57:36.556Z",
        "documentId": 0,
        "documentTemplate": {
          "autoMatchType": "string",
          "contentType": "string",
          "documentGroup": "LITIGATION",
          "documentName": "หนังสือ2",
          "documentTemplateId": "string",
          "forLitigation": true,
          "forNoticeLetter": true,
          "needHardCopy": true,
          "optional": true,
          "requiredDocumentDate": true,
          "searchType": "LEXS"
        },
        "documentTemplateId": "string",
        "hasOriginalCopy": true,
        "imageId": "string",
        "imageName": "string",
        "imageSource": "LEXS",
        "litigationId": "string",
        "objectId": "string",
        "objectType": "PERSON",
        "receiveDate": "string",
        "received": true,
        "sent": true,
        "storeOrganization": "string",
        "storeOrganizationName": "string",
        "uploadUserId": "string"
      }
    ],
    "endDate": "2023-12-31T12:12:12",
    "extendDeferment": true,
    "litigationId": "string",
    "responseUnitType": "RESPONSE_UNIT",
    "startDate": "2022-12-31T12:12:12",
    "updatedBy": "string",
    "updatedDate": "2022-11-24T05:57:36.556Z"
  }

]

function getMemoLitigation() {
  return {
    "actionButton": true,
    "memoList": [
      {
        "createdDt": "2023-04-03T04:19:43.957Z",
        "customerId": "string",
        "description": "string",
        "fullName": "string",
        "id": 0,
        "isDeleted": true,
        "lastUpdate": "2023-04-03T04:19:43.957Z",
        "litigationId": "string",
        "userId": "string"
      }
    ]
  }
}


function getHeirInformation() {
  return {
    "birthDate": "string",
    "document": {
      "active": true,
      "commitmentAccounts": [
        "string"
      ],
      "docRefId": "string",
      "documentDate": "2023-04-07T00:25:42.765Z",
      "documentId": 0,
      "documentTemplateId": "string",
      "handlingOrganization": "string",
      "hasOriginalCopy": true,
      "imageId": "string",
      "imageName": "string",
      "imageSource": "LEXS",
      "originalImageId": "string",
      "ownerOrganization": "string",
      "storeOrganization": "string",
      "updateFlag": "A"
    },
    "firstName": "string",
    "identificationNo": "string",
    "lastName": "string",
    "name": "string",
    "personId": "string",
    "personType": "INDIVIDUAL",
    "reason": "string",
    "referencePersonId": "string",
    "relation": "MAIN_BORROWER",
    "selected": true,
    "title": "string",
    "updateFlag": "A"
  }
}


module.exports = {
  inquiryLawsuits: inquiryLawsuits(),
  getLitigationById: require('../data/litigation/litigationById.json'),
  getLitigationByIdForSuitCase: require('../data/litigation/litigationByidForSuitCase.json'),
  inquireDocumentAuditLog: require('../data/customer/inquireDocumentAuditLog.json'),
  getLitigationNoticeById: require('../data/litigation/litigationNoticeById.json'),
  inquireCustomerAuditLog: require('../data/customer/inquireCustomerAuditLog.json'),
  getSubAccounts: getSubAccounts(),
  getLitigationCase: getLitigationCase(),
  getLitigationCaseDetail: getLitigationCaseDetail(),
  getDefermentApprove: getDefermentApprove(),
  getDefermentAdd: getDefermentAdd(),
  getMemoLitigation: getMemoLitigation(),
  getHeirInformation: getHeirInformation(),
};
