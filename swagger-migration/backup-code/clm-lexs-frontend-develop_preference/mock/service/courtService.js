// mock data from backend side
function getLitigationCourtResult() {
  return [
    {
      "lawyerOfficeCode": "1000",
      "lawyerOfficeName": "บจ.กรุงไทยกฎหมาย (สำนักงานใหญ่)",
      "lawyerId": "k6054",
      "lawyerName": "นาย สุรชัย เกตุสุข",
      "litigationCaseId": 16,
      "courtLevel": "CIVIL",
      "courtVerdicts": [
        {
          "blackCaseNo": "B111.2/2565",
          "redCaseNo": "R005/2565",
          "courtType": "CIVIL",
          "courtLevel": "CIVIL",
          "firstVerdictUserId": "13908",
          "firstVerdictDate": "2022-12-01",
          "lastVerdictUserId": "",
          "firstVerdictUserFirstName": "ชมพู",
          "firstVerdictUserLastName": "เทียมศร",
          "courtVerdictDate": "2022-07-10",
          "litigationStatus": "อยู่ระหว่างการพิจารณาของศาล ปรากฏหมายเลขคดีดำ",
          "caseEnd": false,
          "saveStatus": false,
          "ciosVerdictDate": false,
          "ciosRedCaseNo": false,
          "litigationId": "MOCK0004",
          "litigationCaseId": 16,
          "taskId": 0,
          "acknowledgement": false,
          "checkApproverDecision": "N",
          "latestAppealDueDate": "2023-02-03"
        }
      ],
      "courtAppeal": {
        "litigationId": "MOCK0004",
        "litigationCaseId": 16,
        "courtAppealDocuments": [
          {
            "documentId": 0,
            "documentTemplate": {
              "documentTemplateId": "LEXSF081",
              "documentName": "บันทึกงดอุทธรณ์โดย KTBLAW",
              "searchType": "LEXS",
              "documentGroup": "LITIGATION",
              "needHardCopy": false,
              "optional": false,
              "forNoticeLetter": false,
              "forLitigation": false,
              "requiredDocumentDate": true,
              "contentType": "application/pdf"
            },
            "documentTemplateId": "LEXSF081",
            "active": true
          },
          {
            "documentId": 0,
            "documentTemplate": {
              "documentTemplateId": "LEXSF083",
              "documentName": "คำร้องขอขยายระยะเวลาอุทธรณ์",
              "searchType": "LEXS",
              "documentGroup": "LITIGATION",
              "needHardCopy": false,
              "optional": false,
              "forNoticeLetter": false,
              "forLitigation": false,
              "requiredDocumentDate": true,
              "contentType": "application/pdf"
            },
            "documentTemplateId": "LEXSF083",
            "active": true
          },
          {
            "documentId": 0,
            "documentTemplate": {
              "documentTemplateId": "LEXSF061",
              "documentName": "เอกสารอื่นๆ",
              "searchType": "LEXS",
              "documentGroup": "LITIGATION",
              "needHardCopy": false,
              "optional": false,
              "forNoticeLetter": false,
              "forLitigation": false,
              "requiredDocumentDate": true,
              "contentType": "application/pdf"
            },
            "documentTemplateId": "LEXSF061",
            "active": true
          }
        ],
        "dayToAppealDueDate": 0,
        "finishedAppeal": false,
        "deductionForGuarantor": false
      },
      "courtDecrees": [
        {
          "id": 1,
          "litigationId": "MOCK0004",
          "litigationCaseId": 16,
          "requestDecreeDate": "2022-10-25",
          "remark": "MOCK",
          "lawyerId": "k6054",
          "defendants": [
            {
              "courtDecreeId": 1,
              "personId": "10158978",
              "decreeDueDate": "2022-10-30",
              "title": "นาย",
              "firstName": "ทศพร",
              "lastName": "เทศสมบูรณ์",
              "taskId": 0
            },
            {
              "courtDecreeId": 1,
              "personId": "12903473",
              "decreeDueDate": "2022-10-30",
              "firstName": "วิรุฬกานต์",
              "lastName": "กฤตบุญญาลัย",
              "taskId": 0
            }
          ],
          "lawyerName": "นาย สุรชัย เกตุสุข",
          "taskId": 0
        }
      ]
    },
    {
      "lawyerOfficeCode": "1000",
      "lawyerOfficeName": "บจ.กรุงไทยกฎหมาย (สำนักงานใหญ่)",
      "lawyerId": "k6054",
      "lawyerName": "นาย สุรชัย เกตุสุข",
      "litigationCaseId": 12,
      "courtLevel": "APPEAL",
      "courtVerdicts": [
        {
          "blackCaseNo": "B002/2565",
          "redCaseNo": "R016/2565",
          "courtType": "CIVIL",
          "courtLevel": "APPEAL",
          "firstVerdictUserId": "13908",
          "firstVerdictDate": "2022-12-01",
          "lastVerdictUserId": "",
          "firstVerdictUserFirstName": "ชมพู",
          "firstVerdictUserLastName": "เทียมศร",
          "courtVerdictDate": "2022-07-26",
          "caseEnd": true,
          "saveStatus": false,
          "ciosVerdictDate": false,
          "ciosRedCaseNo": false,
          "litigationId": "MOCK0004",
          "litigationCaseId": 12,
          "taskId": 0,
          "acknowledgement": false,
          "checkApproverDecision": "N"
        }
      ],
      "courtAppeal": {
        "litigationId": "MOCK0004",
        "litigationCaseId": 12,
        "courtAppealDocuments": [
          {
            "documentId": 0,
            "documentTemplate": {
              "documentTemplateId": "LEXSF082",
              "documentName": "บันทึกงดฎีกาโดย KTBLAW",
              "searchType": "LEXS",
              "documentGroup": "LITIGATION",
              "needHardCopy": false,
              "optional": false,
              "forNoticeLetter": false,
              "forLitigation": false,
              "requiredDocumentDate": true,
              "contentType": "application/pdf"
            },
            "documentTemplateId": "LEXSF082",
            "active": true
          },
          {
            "documentId": 0,
            "documentTemplate": {
              "documentTemplateId": "LEXSF084",
              "documentName": "คำร้องขอขยายระยะเวลาฎีกา",
              "searchType": "LEXS",
              "documentGroup": "LITIGATION",
              "needHardCopy": false,
              "optional": false,
              "forNoticeLetter": false,
              "forLitigation": false,
              "requiredDocumentDate": true,
              "contentType": "application/pdf"
            },
            "documentTemplateId": "LEXSF084",
            "active": true
          },
          {
            "documentId": 0,
            "documentTemplate": {
              "documentTemplateId": "LEXSF061",
              "documentName": "เอกสารอื่นๆ",
              "searchType": "LEXS",
              "documentGroup": "LITIGATION",
              "needHardCopy": false,
              "optional": false,
              "forNoticeLetter": false,
              "forLitigation": false,
              "requiredDocumentDate": true,
              "contentType": "application/pdf"
            },
            "documentTemplateId": "LEXSF061",
            "active": true
          }
        ],
        "appealDueDate": "2022-07-30",
        "dayToAppealDueDate": 173,
        "finishedAppeal": false,
        "deductionForGuarantor": false,
        "appealPurpose": "REQUEST_APPEAL",
        "approverDecision": "CONDITIONAL_APPEAL"
      },
      "courtDecrees": [
        {
          "id": 3,
          "litigationId": "MOCK0004",
          "litigationCaseId": 12,
          "requestDecreeDate": "2022-10-25",
          "remark": "MOCK",
          "lawyerId": "k6286",
          "defendants": [
            {
              "courtDecreeId": 3,
              "personId": "13396238",
              "decreeDueDate": "2022-10-30",
              "title": "นาง",
              "firstName": "สุภา",
              "lastName": "ลิขิตพฤกษ์",
              "taskId": 0
            }
          ],
          "lawyerName": "นาย ณภัทร สมองาม",
          "taskId": 0
        }
      ]
    },
    {
      "lawyerOfficeCode": "1000",
      "lawyerOfficeName": "บจ.กรุงไทยกฎหมาย (สำนักงานใหญ่)",
      "lawyerId": "k6054",
      "lawyerName": "นาย สุรชัย เกตุสุข",
      "litigationCaseId": 14,
      "courtLevel": "SUPREME",
      "courtVerdicts": [
        {
          "blackCaseNo": "B005/2565",
          "redCaseNo": "R001/2565",
          "courtType": "CIVIL",
          "courtLevel": "SUPREME",
          "firstVerdictUserId": "13908",
          "firstVerdictDate": "2022-12-01",
          "lastVerdictUserId": "",
          "firstVerdictUserFirstName": "ชมพู",
          "firstVerdictUserLastName": "เทียมศร",
          "courtVerdictDate": "2022-07-31",
          "caseEnd": false,
          "saveStatus": false,
          "ciosVerdictDate": false,
          "ciosRedCaseNo": false,
          "litigationId": "MOCK0004",
          "litigationCaseId": 14,
          "taskId": 0,
          "acknowledgement": false,
          "checkApproverDecision": "N"
        }
      ],
      "courtAppeal": {
        "litigationId": "MOCK0004",
        "litigationCaseId": 14,
        "courtAppealDocuments": [
          {
            "documentId": 0,
            "documentTemplate": {
              "documentTemplateId": "LEXSF082",
              "documentName": "บันทึกงดฎีกาโดย KTBLAW",
              "searchType": "LEXS",
              "documentGroup": "LITIGATION",
              "needHardCopy": false,
              "optional": false,
              "forNoticeLetter": false,
              "forLitigation": false,
              "requiredDocumentDate": true,
              "contentType": "application/pdf"
            },
            "documentTemplateId": "LEXSF082",
            "active": true
          },
          {
            "documentId": 0,
            "documentTemplate": {
              "documentTemplateId": "LEXSF084",
              "documentName": "คำร้องขอขยายระยะเวลาฎีกา",
              "searchType": "LEXS",
              "documentGroup": "LITIGATION",
              "needHardCopy": false,
              "optional": false,
              "forNoticeLetter": false,
              "forLitigation": false,
              "requiredDocumentDate": true,
              "contentType": "application/pdf"
            },
            "documentTemplateId": "LEXSF084",
            "active": true
          },
          {
            "documentId": 0,
            "documentTemplate": {
              "documentTemplateId": "LEXSF061",
              "documentName": "เอกสารอื่นๆ",
              "searchType": "LEXS",
              "documentGroup": "LITIGATION",
              "needHardCopy": false,
              "optional": false,
              "forNoticeLetter": false,
              "forLitigation": false,
              "requiredDocumentDate": true,
              "contentType": "application/pdf"
            },
            "documentTemplateId": "LEXSF061",
            "active": true
          }
        ],
        "dayToAppealDueDate": 0,
        "finishedAppeal": false,
        "deductionForGuarantor": false
      },
      "courtDecrees": [
        {
          "id": 4,
          "litigationId": "MOCK0004",
          "litigationCaseId": 14,
          "requestDecreeDate": "2022-10-25",
          "remark": "MOCK",
          "lawyerId": "k6023",
          "defendants": [
            {
              "courtDecreeId": 4,
              "personId": "945790",
              "decreeDueDate": "2022-10-30",
              "title": "นาง",
              "firstName": "รัชนี",
              "lastName": "ไพฑูรย์สวัสดิ์",
              "taskId": 0
            }
          ],
          "lawyerName": "นาย อาทิตย์ จันทร์นฤเบศ",
          "taskId": 0
        }
      ]
    },
    {
      "lawyerOfficeCode": "1000",
      "lawyerOfficeName": "บจ.กรุงไทยกฎหมาย (สำนักงานใหญ่)",
      "lawyerId": "k6054",
      "lawyerName": "นาย สุรชัย เกตุสุข",
      "litigationCaseId": 11,
      "courtLevel": "CIVIL",
      "courtVerdicts": [
        {
          "blackCaseNo": "B001/2565",
          "redCaseNo": "R002/2565",
          "courtType": "CIVIL",
          "courtLevel": "CIVIL",
          "firstVerdictUserId": "13908",
          "firstVerdictDate": "2022-12-01",
          "lastVerdictUserId": "13908",
          "lastVerdictDate": "2023-01-01",
          "firstVerdictUserFirstName": "ชมพู",
          "firstVerdictUserLastName": "เทียมศร",
          "lastVerdictUserFirstName": "ชมพู",
          "lastVerdictUserLastName": "เทียมศร",
          "courtVerdictDate": "2022-07-14",
          "caseEnd": false,
          "saveStatus": false,
          "ciosVerdictDate": false,
          "ciosRedCaseNo": false,
          "litigationId": "MOCK0004",
          "litigationCaseId": 11,
          "taskId": 0,
          "acknowledgement": false,
          "checkApproverDecision": "Y",
          "latestAppealDueDate": "2023-01-31"
        }
      ],
      "courtAppeal": {
        "litigationId": "MOCK0004",
        "litigationCaseId": 11,
        "courtAppealDocuments": [
          {
            "documentId": 0,
            "documentTemplate": {
              "documentTemplateId": "LEXSF081",
              "documentName": "บันทึกงดอุทธรณ์โดย KTBLAW",
              "searchType": "LEXS",
              "documentGroup": "LITIGATION",
              "needHardCopy": false,
              "optional": false,
              "forNoticeLetter": false,
              "forLitigation": false,
              "requiredDocumentDate": true,
              "contentType": "application/pdf"
            },
            "documentTemplateId": "LEXSF081",
            "active": true
          },
          {
            "documentId": 0,
            "documentTemplate": {
              "documentTemplateId": "LEXSF083",
              "documentName": "คำร้องขอขยายระยะเวลาอุทธรณ์",
              "searchType": "LEXS",
              "documentGroup": "LITIGATION",
              "needHardCopy": false,
              "optional": false,
              "forNoticeLetter": false,
              "forLitigation": false,
              "requiredDocumentDate": true,
              "contentType": "application/pdf"
            },
            "documentTemplateId": "LEXSF083",
            "active": true
          },
          {
            "documentId": 0,
            "documentTemplate": {
              "documentTemplateId": "LEXSF061",
              "documentName": "เอกสารอื่นๆ",
              "searchType": "LEXS",
              "documentGroup": "LITIGATION",
              "needHardCopy": false,
              "optional": false,
              "forNoticeLetter": false,
              "forLitigation": false,
              "requiredDocumentDate": true,
              "contentType": "application/pdf"
            },
            "documentTemplateId": "LEXSF061",
            "active": true
          }
        ],
        "appealPurpose": "",
        "appealDescription": "",
        "appealDueDate": "2022-07-25",
        "dayToAppealDueDate": 178,
        "bankRemark": "test",
        "approverDecision": "CONDITIONAL_APPEAL",
        "approverRemark": "test",
        "approveDate": "2023-01-13",
        "finishedAppeal": false,
        "deductionForGuarantor": false
      },
      "courtDecrees": [
        {
          "id": 2,
          "litigationId": "MOCK0004",
          "litigationCaseId": 11,
          "requestDecreeDate": "2023-01-20",
          "remark": "Hello Yo 1234",
          "lawyerId": "k6054",
          "defendants": [
            {
              "courtDecreeId": 2,
              "personId": "106189",
              "decreeDueDate": "2023-01-31",
              "title": "นาย",
              "firstName": "วราวุฒิ",
              "lastName": "ลาภวิสุทธิสิน",
              "taskId": 0
            }
          ],
          "lawyerName": "นาย สุรชัย เกตุสุข",
          "taskId": 0
        }
      ]
    }
  ]
}

function getCourtAppealById() {
  return {
    "courtAppeal": {
      "appealDescription": "TO_STOP_APPEAL",
      "appealDueDate": "2023-01-23",
      "appealPurpose": "KTB_LAW_STOP_APPEAL",
      "approveDate": "2023-01-23",
      "approverDecision": "CONDITIONAL_APPEAL",
      "approverRemark": "mock service approver remark",
      "bankRemark": "mock service bank remark",
      "conditionalAppeal": "APPEAL",
      "conditionalRemark": "mock service conditional remark",
      "courtAppealDocuments": [],
      "dayToAppealDueDate": 30,
      "headerFlag": "SUBMIT",
      "litigationCaseId": 0,
      "litigationId": 0,
      "rejectReason": "string",
      "updateFlag": "U"
    },
    "courtVerdicts": {
      "accounts": [
        {
          "accountId": "string",
          "lateCharge": 0,
          "lateChargeAmount": 0,
          "litigationCaseId": 0,
          "marketCode": "string",
          "marketDescription": "string",
          "outstandingBalance": 0,
          "tdrStatus": "string",
          "tdrTrackingResult": "string",
          "totalAmount": 0,
          "verdictInterestStartDate": "string",
          "verdictLateCharge": 0,
          "verdictLateChargeAmount": 0,
          "verdictOutstandingBalance": 0,
          "verdictTotalAmount": 0
        }
      ],
      "acknowledgement": true,
      "appealCourtBlackCaseNo": "string",
      "blackCaseNo": "string",
      "caseEnd": true,
      "ciosRedCaseNo": true,
      "ciosVerdictDate": true,
      "courtFee": [
        {
          "accountNo": "string",
          "courtLevel": "string",
          "courtRefundAmount": 0,
          "initialAmount": 0,
          "netAmount": 0,
          "status": "string",
          "transactionDate": "string",
          "transactionName": "string"
        }
      ],
      "courtLevel": "CIVIL",
      "courtName": "string",
      "courtType": "CIVIL",
      "courtVerdictCode": "string",
      "courtVerdictDate": "string",
      "courtVerdictDesc": "string",
      "courtVerdictDocuments": [
        {
          "active": true,
          "documentDate": "2023-01-16T04:44:48.060Z",
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
          "imageId": "string",
          "imageName": "string"
        }
      ],
      "courtVerdictTypeCode": "string",
      "courtVerdictTypeDesc": "string",
      "debtorLawyerFee": [
        {
          "courtName": "string",
          "initialAmount": 0,
          "paidAmount": 0,
          "remainingAmount": 0
        }
      ],
      "defendants": [
        {
          "firstName": "string",
          "identificationNo": "string",
          "lastName": "string",
          "personId": "string",
          "relation": "MAIN_BORROWER"
        }
      ],
      "disposeCaseDate": "string",
      "extendAppeals": [
        {
          "attachment": {
            "active": true,
            "documentDate": "2023-01-16T04:44:48.060Z",
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
            "imageId": "string",
            "imageName": "string"
          },
          "extendDate": "string",
          "litigationCaseId": 0,
          "litigationId": "string"
        }
      ],
      "firstEnforcementDate": "string",
      "firstVerdictDate": "string",
      "firstVerdictUserFirstName": "string",
      "firstVerdictUserId": "string",
      "firstVerdictUserLastName": "string",
      "headerFlag": "DRAFT",
      "lastVerdictDate": "string",
      "lastVerdictUserFirstName": "string",
      "lastVerdictUserId": "string",
      "lastVerdictUserLastName": "string",
      "litigationCaseId": 0,
      "litigationId": "string",
      "litigationStatus": "string",
      "otherCourtFeeCode": "string",
      "otherCourtFeeDesc": "string",
      "otherCourtFeeTypeCode": "string",
      "otherCourtFeeTypeDesc": "string",
      "reasonDismiss": "string",
      "reasonDismissCode": "string",
      "redCaseNo": "string",
      "remark": "string",
      "saveStatus": true,
      "supremeCourtBlackCaseNo": "string",
      "taskId": 0,
      "testimonyStatus": "string",
      "totalCourtRefundAmount": 0,
      "totalInitialAmount": 0,
      "totalNetAmount": 0
    }
  }
}

// mock data from backend side
function getLitigationCourtAppealById() {
  return {
    "courtVerdicts": {
      "blackCaseNo": "B001/2565",
      "redCaseNo": "R002/2565",
      "courtLevel": "CIVIL",
      "courtName": "ศาลแขวงปทุมวัน",
      "courtVerdictDate": "2022-07-14",
      "courtVerdictTypeDesc": "ศาลพิพากษา",
      "courtVerdictTypeCode": "1",
      "courtVerdictDesc": "พิพากษายกฟ้อง",
      "courtVerdictCode": "3",
      "testimonyStatus": "PENDING",
      "defendants": [
        {
          "personId": "1133553",
          "title": "นาย",
          "firstName": "ปรีดา",
          "lastName": "บุญภา",
          "identificationNo": "3209900382890",
          "relation": "MAIN_BORROWER"
        },
        {
          "personId": "7265970",
          "title": "นาย",
          "firstName": "บรรพต",
          "lastName": "ธเนศฐิติวัชร์",
          "identificationNo": "3549900108051",
          "relation": "CO_BORROWER"
        }
      ],
      "courtVerdictDocuments": [
        {
          "documentId": 335265,
          "imageId": "5edb124b-dc51-431e-b3a5-8d567814c112",
          "imageName": "ConfirmationForm.pdf",
          "imageSource": "LEXS",
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
          "documentTemplateId": "LEXSF010",
          "documentDate": "2023-01-06T00:00:00+07:00",
          "active": true
        },
        {
          "documentId": 0,
          "documentTemplate": {
            "documentTemplateId": "LEXSF004",
            "documentName": "เอกสารอื่นๆ ที่เกี่ยวข้องกับการดำเนินคดี",
            "searchType": "LEXS",
            "documentGroup": "LITIGATION",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "active": false
        },
        {
          "documentId": 335267,
          "imageId": "5edb124b-dc51-431e-b3a5-8d567814c112",
          "imageName": "ConfirmationForm.pdf",
          "imageSource": "LEXS",
          "documentTemplate": {
            "documentTemplateId": "LEXSF009",
            "documentName": "ตารางคำนวนยอดหนี้ตามคำพิพากษา",
            "searchType": "LEXS",
            "documentGroup": "LITIGATION",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF009",
          "documentDate": "2023-01-06T00:00:00+07:00",
          "active": true
        },
        {
          "documentId": 335268,
          "imageId": "5edb124b-dc51-431e-b3a5-8d567814c112",
          "imageName": "ConfirmationForm.pdf",
          "imageSource": "LEXS",
          "documentTemplate": {
            "documentTemplateId": "LEXSF011",
            "documentName": "คำพิพากษาตามสัญญาประนีประนอมยอมความ",
            "searchType": "LEXS",
            "documentGroup": "LITIGATION",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF011",
          "documentDate": "2023-01-06T00:00:00+07:00",
          "active": true
        },
        {
          "documentId": 335269,
          "imageId": "5edb124b-dc51-431e-b3a5-8d567814c112",
          "imageName": "ConfirmationForm.pdf",
          "imageSource": "LEXS",
          "documentTemplate": {
            "documentTemplateId": "LEXSF012",
            "documentName": "คำพิพากษาตามยอม",
            "searchType": "LEXS",
            "documentGroup": "LITIGATION",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF012",
          "documentDate": "2023-01-06T00:00:00+07:00",
          "active": true
        },
        {
          "documentId": 335270,
          "imageId": "5edb124b-dc51-431e-b3a5-8d567814c112",
          "imageName": "ConfirmationForm.pdf",
          "imageSource": "LEXS",
          "documentTemplate": {
            "documentTemplateId": "LEXSF013",
            "documentName": "สัญญาประนีประนอมยอมความ",
            "searchType": "LEXS",
            "documentGroup": "LITIGATION",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF013",
          "documentDate": "2023-01-06T00:00:00+07:00",
          "active": true
        },
        {
          "documentId": 335271,
          "imageId": "",
          "imageName": "ConfirmationForm.pdf",
          "imageSource": "LEXS",
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
          "documentTemplateId": "LEXSF052",
          "documentDate": "2023-01-06T00:00:00+07:00",
          "active": true
        }
      ],
      "accounts": [
        {
          "litigationCaseId": 11,
          "accountId": "100114981492",
          "totalAmount": "10500.00",
          "outstandingBalance": "10000.00",
          "lateChargeAmount": "500.00",
          "lateCharge": "0.00",
          "marketCode": "4002",
          "marketDescription": "รับซื้อตั๋วเงิน(ในท้องถิ่น)",
          "verdictTotalAmount": "0",
          "verdictOutstandingBalance": "0",
          "verdictLateChargeAmount": "0",
          "verdictLateCharge": "0"
        },
        {
          "litigationCaseId": 11,
          "accountId": "100115397797",
          "totalAmount": "10100.00",
          "outstandingBalance": "10000.00",
          "lateChargeAmount": "100.00",
          "lateCharge": "0.00",
          "marketCode": "4059",
          "marketDescription": "โครงการสินเชื่อดอกเบี้ยต่ำเพื่อเป็นเงินทุนหมุนเวียนให้แก่ผู้ประกอบการ SMEs (ตั๋วสัญญาใช้เงิน)",
          "verdictTotalAmount": "0",
          "verdictOutstandingBalance": "0",
          "verdictLateChargeAmount": "0",
          "verdictLateCharge": "0"
        }
      ],
      "courtFee": [
        {
          "transactionName": "E11",
          "transactionDate": "2022-12-28",
          "courtLevel": "คดีนี้",
          "accountNo": "100073793625",
          "initialAmount": "20000.00",
          "netAmount": "20404.00",
          "courtRefundAmount": "500.00"
        },
        {
          "transactionName": "E11",
          "transactionDate": "2022-12-28",
          "courtLevel": "คดีนี้",
          "accountNo": "100086711604",
          "initialAmount": "1000.00",
          "netAmount": "20404.00",
          "courtRefundAmount": "1000.00"
        }
      ],
      "totalInitialAmount": "1000.00",
      "totalNetAmount": "20404.00",
      "totalCourtRefundAmount": "1000.00",
      "debtorLawyerFee": [
        {
          "courtName": "ศาลชั้นต้น",
          "initialAmount": "5000.00",
          "paidAmount": "2000.00",
          "remainingAmount": "3000.00"
        }
      ],
      "otherCourtFeeTypeDesc": "ศาลไม่สั่งคืนธนาคาร",
      "otherCourtFeeTypeCode": "3",
      "otherCourtFeeDesc": "ค่าฤชาเป็นภาระธนาคารทั้งหมด (เป็นพับ)",
      "otherCourtFeeCode": "3",
      "remark": "Test Jaaa",
      "caseEnd": false,
      "saveStatus": false,
      "ciosVerdictDate": false,
      "ciosRedCaseNo": false,
      "litigationCaseId": 0,
      "taskId": 0,
      "extendAppeals": [
        {
          "litigationCaseId": 0,
          "extendDate": "2023-01-31",
          "attachment": {
            "documentId": 335402,
            "imageId": "5edb124b-dc51-431e-b3a5-8d567814c112",
            "imageName": "ConfirmationForm.pdf",
            "imageSource": "LEXS",
            "documentTemplate": {
              "documentTemplateId": "LEXSF083",
              "documentName": "คำร้องขอขยายระยะเวลาอุทธรณ์",
              "searchType": "LEXS",
              "documentGroup": "LITIGATION",
              "needHardCopy": false,
              "optional": false,
              "forNoticeLetter": false,
              "forLitigation": false,
              "requiredDocumentDate": true,
              "contentType": "application/pdf"
            },
            "documentTemplateId": "LEXSF083",
            "documentDate": "2023-01-18T00:00:00+07:00",
            "active": true
          }
        },
        {
          "litigationCaseId": 0,
          "extendDate": "2023-01-25",
          "attachment": {
            "documentId": 335403,
            "imageId": "5edb124b-dc51-431e-b3a5-8d567814c112",
            "imageName": "ConfirmationForm.pdf",
            "imageSource": "LEXS",
            "documentTemplate": {
              "documentTemplateId": "LEXSF083",
              "documentName": "คำร้องขอขยายระยะเวลาอุทธรณ์",
              "searchType": "LEXS",
              "documentGroup": "LITIGATION",
              "needHardCopy": false,
              "optional": false,
              "forNoticeLetter": false,
              "forLitigation": false,
              "requiredDocumentDate": true,
              "contentType": "application/pdf"
            },
            "documentTemplateId": "LEXSF083",
            "documentDate": "2023-01-18T00:00:00+07:00",
            "active": true
          }
        }
      ],
      "courtSubVerdictDesc": "หนี้มิได้มีอยู่จริง",
      "courtSubVerdictCode": "5",
      "disposeCaseDate": "2023-01-31",
      "acknowledgement": false,
      "courtFeePaymentStatus": "รอรับเงิน"
    },
    "courtAppeal": {
      "litigationId": "MOCK0004",
      "litigationCaseId": 11,
      "courtAppealDocuments": [
        {
          "documentId": 855452,
          "imageId": "",
          // "imageId": "758c4651-9637-4976-ae71-abf6f4d52aaa",
          "imageName": "รายงานกระบวนพิจารณา (2).pdf",
          "imageSource": "LEXS",
          "documentTemplate": {
            "documentTemplateId": "LEXSF061",
            "documentName": "เอกสารอื่นๆ",
            "searchType": "LEXS",
            "documentGroup": "LITIGATION",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF061",
          "documentDate": "2023-02-01T10:19:11+07:00",
          "active": true
        },
        {
          "documentId": 855453,
          "imageId": "",
          // "imageId": "61e88df3-ca81-4121-9199-fefd3cee749d",
          "imageName": "รายงานกระบวนพิจารณา (3).pdf",
          "imageSource": "LEXS",
          "documentTemplate": {
            "documentTemplateId": "LEXSF081",
            "documentName": "บันทึกงดอุทธรณ์โดย KTBLAW",
            "searchType": "LEXS",
            "documentGroup": "LITIGATION",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF081",
          "documentDate": "2023-02-01T10:19:11+07:00",
          "active": true
        },
        {
          "documentId": 855454,
          "imageId": "",
          // "imageId": "88a2af0e-27b7-434c-9068-8007f5ea735d",
          "imageName": "รายงานกระบวนพิจารณา (3).pdf",
          "imageSource": "LEXS",
          "documentTemplate": {
            "documentTemplateId": "LEXSF083",
            "documentName": "คำร้องขอขยายระยะเวลาอุทธรณ์",
            "searchType": "LEXS",
            "documentGroup": "LITIGATION",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF083",
          "documentDate": "2023-02-01T10:19:11+07:00",
          "active": true
        },
        {
          "documentId": 0,
          "documentTemplate": {
            "documentTemplateId": "LEXSF056",
            "documentName": "หนังสืออนุมัติผลอุทธรณ์/ไม่อุทธรณ์",
            "searchType": "LEXS",
            "documentGroup": "LITIGATION",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF056",
          "active": true
        },
        {
          "documentId": 0,
          "documentTemplate": {
            "documentTemplateId": "LEXSF085",
            "documentName": "เอกสารที่เกี่ยวข้องกับการพิจารณาอุทธรณ์",
            "searchType": "LEXS",
            "documentGroup": "LITIGATION",
            "needHardCopy": false,
            "optional": false,
            "forNoticeLetter": false,
            "forLitigation": false,
            "requiredDocumentDate": true,
            "contentType": "application/pdf"
          },
          "documentTemplateId": "LEXSF085",
          "active": true
        }
      ],
      // "courtAppealDocuments": [
      //   {
      //     "documentId": 0,
      //     "documentTemplate": {
      //       "documentTemplateId": "LEXSF081",
      //       "documentName": "บันทึกงดอุทธรณ์โดย KTBLAW",
      //       "searchType": "LEXS",
      //       "documentGroup": "LITIGATION",
      //       "needHardCopy": false,
      //       "optional": false,
      //       "forNoticeLetter": false,
      //       "forLitigation": false,
      //       "requiredDocumentDate": true,
      //       "contentType": "application/pdf"
      //     },
      //     "documentTemplateId": "LEXSF081",
      //     "active": true
      //   },
      //   {
      //     "documentId": 0,
      //     "documentTemplate": {
      //       "documentTemplateId": "LEXSF083",
      //       "documentName": "คำร้องขอขยายระยะเวลาอุทธรณ์",
      //       "searchType": "LEXS",
      //       "documentGroup": "LITIGATION",
      //       "needHardCopy": false,
      //       "optional": false,
      //       "forNoticeLetter": false,
      //       "forLitigation": false,
      //       "requiredDocumentDate": true,
      //       "contentType": "application/pdf"
      //     },
      //     "documentTemplateId": "LEXSF083",
      //     "active": true
      //   },
      //   {
      //     "documentId": 0,
      //     "documentTemplate": {
      //       "documentTemplateId": "LEXSF061",
      //       "documentName": "เอกสารอื่นๆ",
      //       "searchType": "LEXS",
      //       "documentGroup": "LITIGATION",
      //       "needHardCopy": false,
      //       "optional": false,
      //       "forNoticeLetter": false,
      //       "forLitigation": false,
      //       "requiredDocumentDate": true,
      //       "contentType": "application/pdf"
      //     },
      //     "documentTemplateId": "LEXSF061",
      //     "active": true
      //   }
      // ],
      "appealPurpose": "",
      "appealDescription": "",
      "appealDueDate": "2022-07-25",
      "dayToAppealDueDate": 178,
      "bankRemark": "test",
      "approverDecision": "CONDITIONAL_APPEAL",
      "approverRemark": "test",
      "approveDate": "2023-01-13",
      "finishedAppeal": false,
      "deductionForGuarantor": false
    }
  }
}

function getCourtTrial() {
  return [
    {
      "courtLevel": "CIVIL",
      "courtTrialDetails": [
        {
          "actionFlag": true,
          "appointment": [
            "สืบพยาน",
            "ไกล่เกลี่ย",
            "ชี้สองสถาน",
            "ฟังคำพิพากษา",
            "อื่นๆ"
          ],
          "appointmentDate": "2022-11-05",
          "appointmentTime": "13:30",
          "attachment": {
            "active": false,
            "documentDate": "2022-11-01T15:30:59",
            "documentId": 0,
            "documentTemplate": {
              "autoMatchType": "string",
              "contentType": "string",
              "documentGroup": "LITIGATION",
              "documentName": "string",
              "documentTemplateId": "string",
              "forLitigation": true,
              "forNoticeLetter": true,
              "generatedBySystem": true,
              "needHardCopy": true,
              "optional": true,
              "requiredDocumentDate": true,
              "searchType": "LEXS"
            },
            "documentTemplateId": "string",
            "imageId": "string",
            "imageName": "string",
            "imageSource": "LEXS",
            "objectType": "PERSON"
          },
          "cios": false,
          "documentId": 0,
          "headerFlag": "DRAFT",
          "id": 0,
          "litigationCaseId": 0,
          "litigationId": "string",
          "remark": "string",
          "saveStatus": "WAITING",
          "source": "string",
          "updateFlag": "A",
          "userId": "string"
        }
      ],
      "lawyerId": "string",
      "lawyerName": "string",
      "lawyerOfficeCode": "string",
      "lawyerOfficeName": "string",
      "litigationCaseId": 0,
      "taskCompleted": true
    }
  ]
}

module.exports = {
  getCourtTrial: getCourtTrial(),
  getLitigationCourtResult: getLitigationCourtResult(),
  getLitigationCourtVerdictById: require('../data/court/courtVerdictById.json'),
  getLitigationCourtAppealById: getLitigationCourtAppealById()
};
