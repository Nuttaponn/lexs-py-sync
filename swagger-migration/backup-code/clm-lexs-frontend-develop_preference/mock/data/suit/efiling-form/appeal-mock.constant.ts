import { LitigationCaseDto, LitigationCaseSubCaseDocumentsDto } from '@lexs/lexs-client';
export const MOCK_APPEAL_LG_CASE: LitigationCaseDto = {
  "buttonAction": "PENDING_PAY_COURT_FEE",
  "id": 10035,
  "lawyerOfficeCode": "1000",
  "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
  "lawyerId": "k3440",
  "courtLevel": "CIVIL",
  "courtCode": "100345",
  "courtName": "ศาลแพ่ง",
  "capitalAmount": 10.00,
  "caseDate": "2022-11-22",
  "sla": "2022-10-28",
  "courtFeeStatus": "NEW",
  "channel": "EFILING",
  "briefCase": "111",
  "actionFlag": true,
  "taskCode": "INDICTMENT_RECORD",
  "litigationId": "LE2565090117",
  "uploadCourtFeeReceipt": false,
  "statusCode": "PENDING",
  "referenceNo": "LC2565100000002"
}

// export const LG_GROUP_MOCK_1 = [
//   {
//     "caseGroupNo": "1",
//     "caseGroupKey": "10035",
//     "lawyerOfficeCode": "1000",
//     "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
//     "lawyerId": "k3440",
//     "cases": [
//       {
//         "buttonAction": "PENDING_PAY_COURT_FEE",
//         "id": 10035,
//         "lawyerOfficeCode": "1000",
//         "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
//         "lawyerId": "k3440",
//         "courtLevel": "CIVIL",
//         "courtCode": "100345",
//         "courtName": "ศาลแพ่ง",
//         "capitalAmount": "10.00",
//         "caseDate": "2022-11-22",
//         "sla": "2022-10-28",
//         "courtFeeStatus": "NEW",
//         "channel": "EFILING",
//         "briefCase": "111",
//         "actionFlag": true,
//         "taskCode": "INDICTMENT_RECORD",
//         "litigationId": "LE2565090117",
//         "uploadCourtFeeReceipt": false,
//         "statusCode": "PENDING",
//         "referenceNo": "LC2565100000002"
//       }
//     ]
//   }
// ]

export const MOCK_PENDING_UPLOAD_E_FILING: LitigationCaseDto = {
}

export const MOCK_IN_PROGRESS_UPLOAD_E_FILING: LitigationCaseDto = {
  "buttonAction": "UPLOAD_COURT_FEES_RECEIPT",
  // "buttonAction": "INDICTMENT_RECORD",
  "litigationCaseSubCase": [
    {
      "id": 100511,
      "courtLevel": "APPEAL",
      "courtCode": "100519",
      "capitalAmount": 500000.00,
      "caseDate": "2022-10-27",
      "litigationCaseSubCaseDocuments": [
        {
          "documentId": 848969,
          "imageId": "",
          "imageName": "",
          "documentTemplate": {
            "documentTemplateId": "LEXSF018",
            "documentName": "เอกสารคำฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF018",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true
        },
        {
          "documentId": 848970,
          "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
          "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
          "documentTemplate": {
            "documentTemplateId": "LEXSF062",
            "documentName": "เอกสารแนบท้ายฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF062",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true
        },
        {
          "documentId": 848971,
          "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
          "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
          "documentTemplate": {
            "documentTemplateId": "LEXSF062",
            "documentName": "เอกสารแนบท้ายฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF062",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true
        }
      ]
    }
  ],
  "id": 10051,
  "lawyerOfficeCode": "1000",
  "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
  "lawyerId": "k3440",
  "lawyerName": "ชื่อทนาย นามสกุลทนาย",
  "courtLevel": "APPEAL",
  "appealSide": "BANK",
  "courtCode": "100519",
  "courtName": "ศาลจังหวัดปทุมธานี",
  "capitalAmount": 500000.00,
  "caseDate": "2022-10-27",
  "channel": "EFILING",
  "briefCase": "Test",
  "caseType": {
    "code": "0001",
    "name": "คดีแพ่ง"
  },
  "litigationId": "LE2565090087",
  "referenceNo": "LC2565100000015"
}

export const MOCK_BANK_APPEAL: LitigationCaseDto = {
  "litigationCaseSubCase": [
    {
      "id": 100511,
      "courtLevel": "APPEAL",
      "courtCode": "100519",
      "capitalAmount": 500000.00,
      "caseDate": "2022-10-27",
      "litigationCaseSubCaseDocuments": [
        {
          "documentId": 848969,
          "imageId": "",
          "imageName": "",
          "documentTemplate": {
            "documentTemplateId": "LEXSF018",
            "documentName": "เอกสารคำฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF018",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true
        },
        {
          "documentId": 848970,
          "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
          "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
          "documentTemplate": {
            "documentTemplateId": "LEXSF062",
            "documentName": "เอกสารแนบท้ายฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF062",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true
        },
        {
          "documentId": 848971,
          "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
          "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
          "documentTemplate": {
            "documentTemplateId": "LEXSF062",
            "documentName": "เอกสารแนบท้ายฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF062",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true
        }
      ]
    }
  ],
  "id": 10051,
  "lawyerOfficeCode": "1000",
  "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
  "lawyerId": "k3440",
  "lawyerName": "ชื่อทนาย นามสกุลทนาย",
  "courtLevel": "APPEAL",
  "appealSide": "BANK",
  "courtCode": "100519",
  "courtName": "ศาลจังหวัดปทุมธานี",
  "capitalAmount": 500000.00,
  "caseDate": "2022-10-27",
  "channel": "EFILING",
  "briefCase": "Test",
  "caseType": {
    "code": "0001",
    "name": "คดีแพ่ง"
  },
  "litigationCaseAllegations": [
    {
      "litigationCaseId": 10051,
      "code": "0004",
      "name": "ขอแบ่งทรัพย์"
    }
  ],
  "persons": [
    {
      "personId": "3680900",
      "relation": "MAIN_BORROWER",
      "name": "MOCKTITLEMOCKFIRST MOCKLAST",
      "identificationNo": "0905539002719",
      "checked": true,
      "cifNo": "3680900"
    }
  ],
  "litigationDocuments": [
    {
      "documentId": 848969,
      "imageId": "fdcc12f3-4e55-4720-9a37-a6918951b12e",
      "imageName": "เอกสารคำฟ้อง.pdf",
      "documentTemplate": {
        "documentTemplateId": "LEXSF018",
        "documentName": "เอกสารคำฟ้อง",
        "searchType": "LEXS",
        "documentGroup": "EFILING",
        "needHardCopy": false,
        "optional": false,
        "forNoticeLetter": false,
        "forLitigation": false,
        "requiredDocumentDate": true,
        "contentType": "application/pdf"
      },
      "documentTemplateId": "LEXSF018",
      "documentDate": "2022-10-27T21:07:52+07:00",
      "active": true
    },
    {
      "documentId": 848970,
      "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
      "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
      "documentTemplate": {
        "documentTemplateId": "LEXSF062",
        "documentName": "เอกสารแนบท้ายฟ้อง",
        "searchType": "LEXS",
        "documentGroup": "EFILING",
        "needHardCopy": false,
        "optional": false,
        "forNoticeLetter": false,
        "forLitigation": false,
        "requiredDocumentDate": true,
        "contentType": "application/pdf"
      },
      "documentTemplateId": "LEXSF062",
      "documentDate": "2022-10-27T21:07:52+07:00",
      "active": true
    },
    {
      "documentId": 848971,
      "imageId": "fdcc12f3-4e55-4720-9a37-a6918951b12e",
      "imageName": "เอกสารคำฟ้อง.pdf",
      "documentTemplate": {
        "documentTemplateId": "LEXSF018",
        "documentName": "เอกสารคำฟ้อง",
        "searchType": "LEXS",
        "documentGroup": "EFILING",
        "needHardCopy": false,
        "optional": false,
        "forNoticeLetter": false,
        "forLitigation": false,
        "requiredDocumentDate": true,
        "contentType": "application/pdf"
      },
      "documentTemplateId": "LEXSF018",
      "documentDate": "2022-10-27T21:07:52+07:00",
      "active": true
    },
  ],
  "litigationId": "LE2565090087",
  "referenceNo": "LC2565100000015"
}

export const MOCK_CUSTOMER_APPEAL: LitigationCaseDto = {
  "litigationCaseSubCase": [
    {
      "id": 100511,
      "courtLevel": "APPEAL",
      "courtCode": "100519",
      "capitalAmount": 500000.00,
      "caseDate": "2022-10-27",
      "litigationCaseSubCaseDocuments": [
        {
          "documentId": 848969,
          "imageId": "fdcc12f3-4e55-4720-9a37-a6918951b12e",
          "imageName": "เอกสารคำฟ้อง.pdf",
          "documentTemplate": {
            "documentTemplateId": "LEXSF018",
            "documentName": "เอกสารคำฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF018",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true
        },
        {
          "documentId": 848970,
          "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
          "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
          "documentTemplate": {
            "documentTemplateId": "LEXSF062",
            "documentName": "เอกสารแนบท้ายฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF062",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true
        }
      ]
    }
  ],
  "id": 10051,
  "lawyerOfficeCode": "1000",
  "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
  "lawyerId": "k3440",
  "lawyerName": "ชื่อทนาย นามสกุลทนาย",
  "courtLevel": "APPEAL",
  "appealSide": "CUSTOMER",
  "courtCode": "100519",
  "courtName": "ศาลจังหวัดปทุมธานี",
  "capitalAmount": 500000.00,
  "caseDate": "2022-10-27",
  "channel": "EFILING",
  "briefCase": "Test",
  "caseType": {
    "code": "0001",
    "name": "คดีแพ่ง"
  },
  "litigationCaseAllegations": [
    {
      "litigationCaseId": 10051,
      "code": "0004",
      "name": "ขอแบ่งทรัพย์"
    }
  ],
  "persons": [
    {
      "personId": "3680900",
      "relation": "MAIN_BORROWER",
      "name": "MOCKTITLEMOCKFIRST MOCKLAST",
      "identificationNo": "0905539002719",
      "checked": true,
      "cifNo": "3680900"
    }
  ],
  "litigationDocuments": [
    {
      "documentId": 848969,
      "imageId": "fdcc12f3-4e55-4720-9a37-a6918951b12e",
      "imageName": "เอกสารคำฟ้อง.pdf",
      "documentTemplate": {
        "documentTemplateId": "LEXSF018",
        "documentName": "เอกสารคำฟ้อง",
        "searchType": "LEXS",
        "documentGroup": "EFILING",
        "needHardCopy": false,
        "optional": false,
        "forNoticeLetter": false,
        "forLitigation": false,
        "requiredDocumentDate": true,
        "contentType": "application/pdf"
      },
      "documentTemplateId": "LEXSF018",
      "documentDate": "2022-10-27T21:07:52+07:00",
      "active": true
    },
    {
      "documentId": 848970,
      "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
      "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
      "documentTemplate": {
        "documentTemplateId": "LEXSF062",
        "documentName": "เอกสารแนบท้ายฟ้อง",
        "searchType": "LEXS",
        "documentGroup": "EFILING",
        "needHardCopy": false,
        "optional": false,
        "forNoticeLetter": false,
        "forLitigation": false,
        "requiredDocumentDate": true,
        "contentType": "application/pdf"
      },
      "documentTemplateId": "LEXSF062",
      "documentDate": "2022-10-27T21:07:52+07:00",
      "active": true
    }
  ],
  "litigationId": "LE2565090087",
  "referenceNo": "LC2565100000015"
}

export const MOCK_BANK_SUPREME: LitigationCaseDto = {
  "litigationCaseSubCase": [
    {
      "id": 100511,
      "courtLevel": "SUPREME",
      "courtCode": "100519",
      "capitalAmount": 500000.00,
      "caseDate": "2022-10-27",
      "litigationCaseSubCaseDocuments": [
        {
          "documentId": 848969,
          "imageId": "fdcc12f3-4e55-4720-9a37-a6918951b12e",
          "imageName": "เอกสารคำฟ้อง.pdf",
          "documentTemplate": {
            "documentTemplateId": "LEXSF018",
            "documentName": "เอกสารคำฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF018",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true
        },
        {
          "documentId": 848970,
          "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
          "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
          "documentTemplate": {
            "documentTemplateId": "LEXSF062",
            "documentName": "เอกสารแนบท้ายฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF062",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true
        }
      ]
    }
  ],
  "id": 10051,
  "lawyerOfficeCode": "1000",
  "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
  "lawyerId": "k3440",
  "lawyerName": "ชื่อทนาย นามสกุลทนาย",
  "courtLevel": "SUPREME",
  "appealSide": "BANK",
  "courtCode": "100519",
  "courtName": "ศาลจังหวัดปทุมธานี",
  "capitalAmount": 500000.00,
  "caseDate": "2022-10-27",
  "channel": "EFILING",
  "briefCase": "Test",
  "caseType": {
    "code": "0001",
    "name": "คดีแพ่ง"
  },
  "litigationCaseAllegations": [
    {
      "litigationCaseId": 10051,
      "code": "0004",
      "name": "ขอแบ่งทรัพย์"
    }
  ],
  "persons": [
    {
      "personId": "3680900",
      "relation": "MAIN_BORROWER",
      "name": "MOCKTITLEMOCKFIRST MOCKLAST",
      "identificationNo": "0905539002719",
      "checked": true,
      "cifNo": "3680900"
    }
  ],
  "litigationDocuments": [
    {
      "documentId": 848969,
      "imageId": "fdcc12f3-4e55-4720-9a37-a6918951b12e",
      "imageName": "เอกสารคำฟ้อง.pdf",
      "documentTemplate": {
        "documentTemplateId": "LEXSF018",
        "documentName": "เอกสารคำฟ้อง",
        "searchType": "LEXS",
        "documentGroup": "EFILING",
        "needHardCopy": false,
        "optional": false,
        "forNoticeLetter": false,
        "forLitigation": false,
        "requiredDocumentDate": true,
        "contentType": "application/pdf"
      },
      "documentTemplateId": "LEXSF018",
      "documentDate": "2022-10-27T21:07:52+07:00",
      "active": true
    },
    {
      "documentId": 848970,
      "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
      "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
      "documentTemplate": {
        "documentTemplateId": "LEXSF062",
        "documentName": "เอกสารแนบท้ายฟ้อง",
        "searchType": "LEXS",
        "documentGroup": "EFILING",
        "needHardCopy": false,
        "optional": false,
        "forNoticeLetter": false,
        "forLitigation": false,
        "requiredDocumentDate": true,
        "contentType": "application/pdf"
      },
      "documentTemplateId": "LEXSF062",
      "documentDate": "2022-10-27T21:07:52+07:00",
      "active": true
    }
  ],
  "litigationId": "LE2565090087",
  "referenceNo": "LC2565100000015"
}

export const MOCK_CUSTOMER_SUPREME: LitigationCaseDto = {
  "litigationCaseSubCase": [
    {
      "id": 100511,
      "courtLevel": "SUPREME",
      "courtCode": "100519",
      "capitalAmount": 500000.00,
      "caseDate": "2022-10-27",
      "litigationCaseSubCaseDocuments": [
        {
          "documentId": 848969,
          "imageId": "fdcc12f3-4e55-4720-9a37-a6918951b12e",
          "imageName": "เอกสารคำฟ้อง.pdf",
          "documentTemplate": {
            "documentTemplateId": "LEXSF018",
            "documentName": "เอกสารคำฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF018",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true
        },
        {
          "documentId": 848970,
          "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
          "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
          "documentTemplate": {
            "documentTemplateId": "LEXSF062",
            "documentName": "เอกสารแนบท้ายฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF062",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true
        }
      ]
    }
  ],
  "id": 10051,
  "lawyerOfficeCode": "1000",
  "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
  "lawyerId": "k3440",
  "lawyerName": "ชื่อทนาย นามสกุลทนาย",
  "courtLevel": "SUPREME",
  "appealSide": "CUSTOMER",
  "courtCode": "100519",
  "courtName": "ศาลจังหวัดปทุมธานี",
  "capitalAmount": 500000.00,
  "caseDate": "2022-10-27",
  "channel": "EFILING",
  "briefCase": "Test",
  "caseType": {
    "code": "0001",
    "name": "คดีแพ่ง"
  },
  "litigationCaseAllegations": [
    {
      "litigationCaseId": 10051,
      "code": "0004",
      "name": "ขอแบ่งทรัพย์"
    }
  ],
  "persons": [
    {
      "personId": "3680900",
      "relation": "MAIN_BORROWER",
      "name": "MOCKTITLEMOCKFIRST MOCKLAST",
      "identificationNo": "0905539002719",
      "checked": true,
      "cifNo": "3680900"
    }
  ],
  "litigationDocuments": [
    {
      "documentId": 848969,
      "imageId": "fdcc12f3-4e55-4720-9a37-a6918951b12e",
      "imageName": "เอกสารคำฟ้อง.pdf",
      "documentTemplate": {
        "documentTemplateId": "LEXSF018",
        "documentName": "เอกสารคำฟ้อง",
        "searchType": "LEXS",
        "documentGroup": "EFILING",
        "needHardCopy": false,
        "optional": false,
        "forNoticeLetter": false,
        "forLitigation": false,
        "requiredDocumentDate": true,
        "contentType": "application/pdf"
      },
      "documentTemplateId": "LEXSF018",
      "documentDate": "2022-10-27T21:07:52+07:00",
      "active": true
    },
    {
      "documentId": 848970,
      "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
      "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
      "documentTemplate": {
        "documentTemplateId": "LEXSF062",
        "documentName": "เอกสารแนบท้ายฟ้อง",
        "searchType": "LEXS",
        "documentGroup": "EFILING",
        "needHardCopy": false,
        "optional": false,
        "forNoticeLetter": false,
        "forLitigation": false,
        "requiredDocumentDate": true,
        "contentType": "application/pdf"
      },
      "documentTemplateId": "LEXSF062",
      "documentDate": "2022-10-27T21:07:52+07:00",
      "active": true
    }
  ],
  "litigationId": "LE2565090087",
  "referenceNo": "LC2565100000015"
}

export const MOCK_SUB_CASE_DOCS: LitigationCaseSubCaseDocumentsDto[] = [
  {
    "documentId": 848969,
    "imageId": "",
    "imageName": "",
    "documentTemplate": {
      "documentTemplateId": "LEXSF018",
      "documentName": "เอกสารคำฟ้อง",
      "searchType": "LEXS",
      "documentGroup": "EFILING",
      "needHardCopy": false,
      "optional": false,
      "forNoticeLetter": false,
      "forLitigation": false,
      "requiredDocumentDate": true,
      "contentType": "application/pdf"
    },
    "documentTemplateId": "LEXSF018",
    "documentDate": "2022-10-27T21:07:52+07:00",
    "active": true,
    "coupleDeliveryFee": "",
  },
  {
    "documentId": 848970,
    "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
    "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
    "documentTemplate": {
      "documentTemplateId": "LEXSF062",
      "documentName": "เอกสารแนบท้ายฟ้อง",
      "searchType": "LEXS",
      "documentGroup": "EFILING",
      "needHardCopy": false,
      "optional": false,
      "forNoticeLetter": false,
      "forLitigation": false,
      "requiredDocumentDate": true,
      "contentType": "application/pdf"
    },
    "documentTemplateId": "LEXSF062",
    "documentDate": "2022-10-27T21:07:52+07:00",
    "active": true,
    "coupleDeliveryFee": "",
  },
  {
    "documentId": 848971,
    "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
    "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
    "documentTemplate": {
      "documentTemplateId": "LEXSF062",
      "documentName": "เอกสารแนบท้ายฟ้อง",
      "searchType": "LEXS",
      "documentGroup": "EFILING",
      "needHardCopy": false,
      "optional": true,
      "forNoticeLetter": false,
      "forLitigation": false,
      "requiredDocumentDate": true,
      "contentType": "application/pdf"
    },
    "documentTemplateId": "LEXSF062",
    "documentDate": "2022-10-27T21:07:52+07:00",
    "active": true,
    "coupleDeliveryFee": "",
  }
]

export const MOCK_COURT_FEE_LG_CASE_UPLOAD_COURT_FEE_RECEIPT: LitigationCaseDto = {
  // "litigationCaseSubCase": [
  //   {
  //     "id": 100511,
  //     "courtLevel": "APPEAL",
  //     "courtCode": "100519",
  //     "capitalAmount": 500000.00,
  //     "caseDate": "2022-10-27",
  //     "litigationCaseSubCaseDocuments": MOCK_SUB_CASE_DOCS,
  //     "courtFee": "5000.00",
  //     "documentFee": "5000.00",
  //     "statusSubCase": 'PENDING',
  //     "coupleDeliveryFeeDocuments": [
  //       {
  //         "documentId": 8000001,
  //         "imageId": "",
  //         "imageName": "",
  //         "documentTemplate": {
  //           "documentTemplateId": "LEXSF018",
  //           "documentName": "เอกสารคำฟ้อง",
  //           "searchType": "LEXS",
  //           "documentGroup": "EFILING",
  //           "needHardCopy": false,
  //           "optional": false,
  //           "forNoticeLetter": false,
  //           "forLitigation": false,
  //           "requiredDocumentDate": true,
  //           "contentType": "application/pdf"
  //         },
  //         "documentTemplateId": "LEXSF018",
  //         "documentDate": "2022-10-27T21:07:52+07:00",
  //         "active": true,
  //         "coupleDeliveryFee": "",
  //       }
  //     ]
  //   }
  // ],
  "id": 10051,
  "lawyerOfficeCode": "1000",
  "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
  "lawyerId": "k3440",
  "lawyerName": "ชื่อทนาย นามสกุลทนาย",
  "courtLevel": "CIVIL",
  "appealSide": "BANK",
  "courtCode": "100519",
  "courtName": "ศาลจังหวัดปทุมธานี",
  "capitalAmount": 500000.00,
  "caseDate": "2022-10-27",
  "channel": "EFILING",
  "briefCase": "Test",
  "caseType": {
    "code": "0001",
    "name": "คดีแพ่ง"
  },
  "litigationId": "LE2565090087",
  "referenceNo": "LC2565100000015",
  "buttonAction": "UPLOAD_COURT_FEES_RECEIPT",
  "redCaseNo": "redCaseEiei",
  "blackCaseNo": "blackCaseNoEiei",
}

export const MOCK_COURT_FEE_LG_CASE_PENDING: LitigationCaseDto = {
  "litigationCaseSubCase": [
    {
      "id": 100511,
      "courtLevel": "APPEAL",
      "courtCode": "100519",
      "capitalAmount": 500000.00,
      "caseDate": "2022-10-27",
      "litigationCaseSubCaseDocuments": MOCK_SUB_CASE_DOCS,
      "courtFee": "5000.00",
      "documentFee": "5000.00",
      "statusSubCase": 'PENDING',
      "coupleDeliveryFeeDocuments": [
        {
          "documentId": 8000001,
          "imageId": "",
          "imageName": "",
          "documentTemplate": {
            "documentTemplateId": "LEXSF018",
            "documentName": "เอกสารคำฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF018",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true,
          "coupleDeliveryFee": "",
        }
      ]
    }
  ],
  "id": 10051,
  "lawyerOfficeCode": "1000",
  "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
  "lawyerId": "k3440",
  "lawyerName": "ชื่อทนาย นามสกุลทนาย",
  "courtLevel": "APPEAL",
  "appealSide": "BANK",
  "courtCode": "100519",
  "courtName": "ศาลจังหวัดปทุมธานี",
  "capitalAmount": 500000.00,
  "caseDate": "2022-10-27",
  "channel": "EFILING",
  "briefCase": "Test",
  "caseType": {
    "code": "0001",
    "name": "คดีแพ่ง"
  },
  "litigationId": "LE2565090087",
  "referenceNo": "LC2565100000015",
  "buttonAction": "UPLOAD_COURT_FEES_RECEIPT",
  "redCaseNo": "redCaseEiei",
  "blackCaseNo": "blackCaseNoEiei",
}

export const MOCK_COURT_FEE_LG_CASE_IN_PROGRESS: LitigationCaseDto = {
  "litigationCaseSubCase": [
    {
      "id": 100511,
      "courtLevel": "APPEAL",
      "courtCode": "100519",
      "capitalAmount": 500000.00,
      "caseDate": "2022-10-27",
      "litigationCaseSubCaseDocuments": MOCK_SUB_CASE_DOCS,
      "courtFee": "5000.00",
      "documentFee": "5000.00",
      "statusSubCase": 'PENDING',
      "coupleDeliveryFeeDocuments": [
        {
          "documentId": 848970,
          "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
          "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
          "documentTemplate": {
            "documentTemplateId": "LEXSF062",
            "documentName": "เอกสารแนบท้ายฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF062",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true,
          "coupleDeliveryFee": "1000",
        },
        {
          "documentId": 848970,
          "imageId": "70ad7394-c99d-4914-bf48-35be2db33416",
          "imageName": "E-Filing ลงทะเบียนทนายความ.pdf",
          "documentTemplate": {
            "documentTemplateId": "LEXSF062",
            "documentName": "เอกสารแนบท้ายฟ้อง",
            "searchType": "LEXS",
            "documentGroup": "EFILING",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF062",
          "documentDate": "2022-10-27T21:07:52+07:00",
          "active": true,
          "coupleDeliveryFee": "2000",
        },
      ]
    }
  ],
  "id": 10051,
  "lawyerOfficeCode": "1000",
  "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
  "lawyerId": "k3440",
  "lawyerName": "ชื่อทนาย นามสกุลทนาย",
  "courtLevel": "APPEAL",
  "appealSide": "BANK",
  "courtCode": "100519",
  "courtName": "ศาลจังหวัดปทุมธานี",
  "capitalAmount": 500000.00,
  "caseDate": "2022-10-27",
  "channel": "EFILING",
  "briefCase": "Test",
  "caseType": {
    "code": "0001",
    "name": "คดีแพ่ง"
  },
  "litigationId": "LE2565090087",
  "referenceNo": "LC2565100000015",
  "buttonAction": "UPLOAD_COURT_FEES_RECEIPT",
  "redCaseNo": "redCaseEiei",
  "blackCaseNo": "blackCaseNoEiei",
}

// LitigationCase.buttonAction = INDICTMENT_RECORD

// litigationCaseSubCase.litigationDocumentDto
// Mandatory document (xxx.documentTemplate.optional = false) display as running number
// • Optional document (xxx.documentTemplate.optional = true) display as checkbox
// litigationCaseSubCase.litigationDocumentDto[x].documentTemplate.optional
// litigationCaseSubCase.litigationDocumentDto[x].documentTemplate.documentName
// litigationCaseSubCase.litigationDocumentDto[x].imageId

// LitigationCaseDto.blackCaseNo
// LitigationCaseDto.redCaseNo
// litigation_case_sub_case[x].court_fee
// litigation_case_sub_case[x].document_fee
