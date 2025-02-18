function getPageOfExpense() {
  return {
    "content": inquiryExpense(),
    "pageable": {
      "sort": {
        "empty": false,
        "sorted": true,
        "unsorted": false
      },
      "offset": 0,
      "pageNumber": 0,
      "pageSize": 10,
      "paged": true,
      "unpaged": false
    },
    "totalElements": 5,
    "totalPages": 1,
    "last": false,
    "size": 10,
    "number": 0,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "numberOfElements": 10,
    "first": true,
    "empty": false
  }
}

function inquiryExpense() {
  return [
    {
      "taskId": 10100,
      "taskCode": "CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION",
      "taskName": "",
      "statusCode": "PENDING_APPROVAL",
      "statusName": "",
      "expenseNo": "บช6500123",
      "numberOfClaims": 204,
      "expenseAmount": 700.00,
      "wtAmount": 0.00,
      "totalAmount": 700.00,
      "slaDays": 1,
      "expenseStatus": "PENDING_CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION",
      "expenseStatusName": "อนุมัติเบิกค่าใช้จ่าย",
      "currentAssigneeId": "00001",
      "currentAssigneeName": "นาย XXX XXXX"
    },
    {
      "taskId": 10100,
      "taskCode": "EXPENSE_CLAIM_RECEIPT_UPLOAD",
      "taskName": "",
      "statusCode": "PENDING",
      "statusName": "",
      "expenseNo": "บช6500123",
      "numberOfClaims": 100,
      "expenseAmount": 700.00,
      "wtAmount": 0.00,
      "totalAmount": 700.00,
      "slaDays": 1,
      "expenseStatus": "PENDING_PAYMENT_RECEIPT_UPDATE",
      "expenseStatusName": "รอแก้ไขใบเสร็จ",
      "currentAssigneeId": "00001",
      "currentAssigneeName": "นาย XXX XXXX"
    },
    {
      "taskId": 10106,
      "taskCode": "EXPENSE_CLAIM_RECEIPT_UPLOAD",
      "taskName": "",
      "statusCode": "PENDING",
      "statusName": "",
      "expenseNo": "บช6500123",
      "numberOfClaims": 106,
      "expenseAmount": 700.00,
      "wtAmount": 0.00,
      "totalAmount": 700.00,
      "slaDays": 1,
      "expenseStatus": "PENDING_PAYMENT_RECEIPT_UPLOAD",
      "expenseStatusName": "รออัปโหลดใบเสร็จ (จ่ายอัตโนมัติ)",
      "currentAssigneeId": "00001",
      "currentAssigneeName": "นาย XXX XXXX"
    },
    {
      "taskId": 1099,
      "taskCode": "EXPENSE_CLAIM_PAYMENT_APPROVAL",
      "taskName": "",
      "statusCode": "PENDING",
      "statusName": "",
      "expenseNo": "บช6500123",
      "numberOfClaims": 99,
      "expenseAmount": 700.00,
      "wtAmount": 0.00,
      "totalAmount": 700.00,
      "slaDays": 1,
      "expenseStatus": "PENDING_PAYMENT_CONSIDERATION",
      "expenseStatusName": "รอพิจารณาจ่ายเงิน",
      "currentAssigneeId": "00001",
      "currentAssigneeName": "นาย XXX XXXX"
    },
    {
      "taskId": 10105,
      "taskCode": "EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL",
      "taskName": "",
      "statusCode": "PENDING",
      "statusName": "",
      "expenseNo": "บช6500123",
      "numberOfClaims": 105,
      "expenseAmount": 700.00,
      "wtAmount": 0.00,
      "totalAmount": 700.00,
      "slaDays": 1,
      "expenseStatus": "PENDING_AUTO_PAYMENT_VERIFICATION",
      "expenseStatusName": "รอตรวจสอบรายการอัตโนมัติ",
      "currentAssigneeId": "00001",
      "currentAssigneeName": "นาย XXX XXXX"
    },
    {
      "taskId": 10196,
      "taskCode": "EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL",
      "taskName": "",
      "statusCode": "PENDING_APPROVAL",
      "statusName": "",
      "expenseNo": "บช6500123",
      "numberOfClaims": 196,
      "expenseAmount": 700.00,
      "wtAmount": 0.00,
      "totalAmount": 700.00,
      "slaDays": 1,
      "expenseStatus": "PENDING_AUTO_PAYMENT_APPROVAL",
      "expenseStatusName": "รออนุมัติรายการอัตโนมัติ",
      "currentAssigneeId": "00001",
      "currentAssigneeName": "นาย XXX XXXX"
    },
  ]
}

function getExpenseDetail() {
  return {
    "accountCode": "string",
    "accountName": "KTB Law",
    "accountNo": "000000000000000",
    "addressId": 0,
    "addressLine": "string",
    "approverId": "string",
    "businessType": "string",
    "cancelReason": "string",
    "districtName": "string",
    "expenseGroup": 1,
    "expenseNo": "บช6500123",
    "expenseRateId": "string",
    "expenseStatusCode": "PENDING_PAYMENT_RECEIPT_UPLOAD",
    "expenseStatusName": "รออัปโหลดใบเสร็จ (จ่ายอัตโนมัติ)",
    "expenseSubTypeCode": "string",
    "expenseSubTypeName": "string",
    "expenseTransactionDto": [
      {
        "objectType": "COL",
        "blackCaseNo": "string",
        "branchCode": "string",
        "branchName": "string",
        "courtCode": "string",
        "courtName": "string",
        "customerId": "string",
        "customerName": "string",
        "excludedVatAmount": 0,
        "expenseAmount": 0,
        "expenseDocumentDtoList": [
          {
            "active": true,
            "additionalInfo": {
              "allowCategory": [
                "string"
              ]
            },
            "attributes": {},
            "commitmentAccounts": [
              "string"
            ],
            "customerId": "string",
            "dimsTicketBarcode": "string",
            "documentCommitmentId": "string",
            "documentDate": "2023-02-13T06:33:59.521Z",
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
            "hasOriginalCopy": true,
            "imageId": "string",
            "imageName": "string",
            "imageSource": "LEXS",
            "litigationCaseId": 0,
            "litigationId": "string",
            "objectId": "string",
            "objectType": "PERSON",
            "receiveDate": "string",
            "received": true,
            "required": true,
            "sent": true,
            "storeOrganization": "string",
            "storeOrganizationName": "string",
            "subjectTo": "string",
            "uploadUserId": "string",
            "uploadUserName": "string"
          }
        ],
        "expenseRateId": "string",
        "expenseSubTypeCode": "string",
        "expenseSubTypeName": "string",
        "expenseTypeCode": "string",
        "expenseTypeName": "string",
        "fieldName": "string",
        "fieldValue": 0,
        "id": 0,
        "isApproved": true,
        "lgId": "string",
        "litigationCaseId": "string",
        "litigationClosed": true,
        "litigationStatus": "string",
        "note": "string",
        "redCaseNo": "string",
        "responseUnitCode": "string",
        "responseUnitName": "string",
        "stepCode": "string",
        "stepName": "string",
        "stepSubCode": "string",
        "stepSubName": "string",
        "totalAmount": 0,
        "vatAmount": 0,
        "vatRate": 0,
        "whtRate": 0,
        "wtAmount": 0
      },
      {
        "objectType": "NCOL",
        "blackCaseNo": "string",
        "branchCode": "string",
        "branchName": "string",
        "courtCode": "string",
        "courtName": "string",
        "customerId": "string",
        "customerName": "string",
        "excludedVatAmount": 0,
        "expenseAmount": 0,
        "expenseDocumentDtoList": [
          {
            "active": true,
            "additionalInfo": {
              "allowCategory": [
                "string"
              ]
            },
            "attributes": {},
            "commitmentAccounts": [
              "string"
            ],
            "customerId": "string",
            "dimsTicketBarcode": "string",
            "documentCommitmentId": "string",
            "documentDate": "2023-02-13T06:33:59.521Z",
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
            "hasOriginalCopy": true,
            "imageId": "string",
            "imageName": "string",
            "imageSource": "LEXS",
            "litigationCaseId": 0,
            "litigationId": "string",
            "objectId": "string",
            "objectType": "PERSON",
            "receiveDate": "string",
            "received": true,
            "required": true,
            "sent": true,
            "storeOrganization": "string",
            "storeOrganizationName": "string",
            "subjectTo": "string",
            "uploadUserId": "string",
            "uploadUserName": "string"
          }
        ],
        "expenseRateId": "string",
        "expenseSubTypeCode": "string",
        "expenseSubTypeName": "string",
        "expenseTypeCode": "string",
        "expenseTypeName": "string",
        "fieldName": "string",
        "fieldValue": 0,
        "id": 0,
        "isApproved": true,
        "lgId": "string",
        "litigationCaseId": "string",
        "litigationClosed": true,
        "litigationStatus": "string",
        "note": "string",
        "redCaseNo": "string",
        "responseUnitCode": "string",
        "responseUnitName": "string",
        "stepCode": "string",
        "stepName": "string",
        "stepSubCode": "string",
        "stepSubName": "string",
        "totalAmount": 0,
        "vatAmount": 0,
        "vatRate": 0,
        "whtRate": 0,
        "wtAmount": 0
      }
    ],
    "expenseTypeCode": "string",
    "expenseTypeName": "string",
    "financialApprover2Id": "string",
    "financialApproverId": "string",
    "financialMakerId": "string",
    "financialNewsReceipt": {
      "active": true,
      "additionalInfo": {
        "allowCategory": [
          "string"
        ]
      },
      "attributes": {},
      "commitmentAccounts": [
        "string"
      ],
      "customerId": "string",
      "dimsTicketBarcode": "string",
      "documentCommitmentId": "string",
      "documentDate": "2023-02-13T06:33:59.521Z",
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
      "hasOriginalCopy": true,
      "imageId": "string",
      "imageName": "string",
      "imageSource": "LEXS",
      "litigationCaseId": 0,
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
    "klawReceipt": {
      "active": true,
      "additionalInfo": {
        "allowCategory": [
          "string"
        ]
      },
      "attributes": {},
      "commitmentAccounts": [
        "string"
      ],
      "customerId": "string",
      "dimsTicketBarcode": "string",
      "documentCommitmentId": "string",
      "documentDate": "2023-02-13T06:33:59.521Z",
      "documentId": 0,
      "documentTemplate": {
        "autoMatchType": "string",
        "contentType": "string",
        "documentGroup": "LITIGATION",
        "documentName": "testdocument",
        "documentTemplateId": "1022222",
        "forLitigation": true,
        "forNoticeLetter": true,
        "generatedBySystem": true,
        "needHardCopy": true,
        "optional": true,
        "requiredDocumentDate": true,
        "searchType": "LEXS"
      },
      "documentTemplateId": "1022222",
      "hasOriginalCopy": true,
      "imageId": "123450001",
      "imageName": "testImageName",
      "imageSource": "LEXS",
      "litigationCaseId": 0,
      "litigationId": "string",
      "objectId": "string",
      "objectType": "PERSON",
      "receiveDate": "string",
      "received": true,
      "sent": true,
      "storeOrganization": "string",
      "storeOrganizationName": "string",
      "uploadUserId": "K234444"
    },
    "makerId": "string",
    "mergedExpenseTransaction": {
      "blackCaseNo": "0000/2565",
      "branchCode": "00000",
      "branchName": "Branch Name",
      "courtCode": "0001",
      "courtName": "ศาลแพ่ง",
      "customerId": "0000000012345",
      "customerName": "บมจ. บริษัทไทย จำกัด",
      "excludedVatAmount": 0,
      "expenseAmount": 9000,
      "expenseDocumentDtoList": [
        {
          "active": true,
          "additionalInfo": {
            "allowCategory": [
              "string"
            ]
          },
          "attributes": {},
          "commitmentAccounts": [
            "string"
          ],
          "customerId": "string",
          "dimsTicketBarcode": "string",
          "documentCommitmentId": "string",
          "documentDate": "2023-02-13T06:33:59.521Z",
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
          "hasOriginalCopy": true,
          "imageId": "string",
          "imageName": "string",
          "imageSource": "LEXS",
          "litigationCaseId": 0,
          "litigationId": "string",
          "objectId": "string",
          "objectType": "PERSON",
          "receiveDate": "string",
          "received": true,
          "required": true,
          "sent": true,
          "storeOrganization": "string",
          "storeOrganizationName": "string",
          "subjectTo": "string",
          "uploadUserId": "string",
          "uploadUserName": "string"
        }
      ],
      "expenseRateId": "string",
      "expenseSubTypeCode": "string",
      "expenseSubTypeName": "string",
      "expenseTypeCode": "string",
      "expenseTypeName": "string",
      "fieldName": "string",
      "fieldValue": 0,
      "id": 0,
      "isApproved": true,
      "lgId": "0000000012345",
      "litigationCaseId": "string",
      "litigationClosed": true,
      "litigationStatus": "string",
      "note": "string",
      "redCaseNo": "0000/2565",
      "responseUnitCode": "string",
      "responseUnitName": "string",
      "stepCode": "string",
      "stepName": "string",
      "stepSubCode": "string",
      "stepSubName": "string",
      "totalAmount": 9000,
      "vatAmount": 9000,
      "vatRate": 9000,
      "whtRate": 9000,
      "wtAmount": 9000
    },
    "note": "A while back I needed to count the amount of letters that a piece of text in an email template had (to avoid passing any character limits). Unfortunately, I could not think of a quick way to do so on my macbook and I therefore turned to the Internet. There were a couple of tools out there, but none of them met my standards and since I am a web designer I thought: why not do it myself and help others along the way? And... here is the result, hope it helps out I thought: why not do it myself and f",
    "paymentMethod": "string",
    "paymentMethodName": "โอนเงิน",
    "postalCode": "string",
    "provinceName": "string",
    "rejectReason": "string",
    "requestKbmReason": "string",
    "stepCode": "string",
    "stepName": "ดำเนินคดี",
    "stepSubCode": "string",
    "stepSubName": "ชั้นฟ้องแพ่ง",
    "subDistrictName": "string",
    "sumExpenseAmount": 9000,
    "sumTotalAmount": 9000,
    "sumVatAmount": 9000,
    "sumWtAmount": 9000,
    "taxNo": "string",
    "telNo": "string",
    "type": "string",
    "whtRate": "1"
  }
}

// DRAFT = ร่าง
// PENDING_EXPENSE_CLAIM_CORRECTION = รอแก้ไขการเบิกเงิน
// PENDING_EXPENSE_CLAIM_VERIFICATION = รอตรวจสอบการเบิกเงิน
// PENDING_CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION = รออนุมัติเบิกค่าใช้จ่าย
// PENDING_PAYMENT_CONSIDERATION = รอพิจารณาจ่ายเงิน
// PENDING_PAYMENT_APPROVAL_CONSIDERATION = รอพิจารณาอนุมัติจ่ายเงิน
// PENDING_PAYMENT_APPROVAL = รออนุมัติจ่ายเงิน
// PENDING_PAYMENT_CONFIRMATION = รอยืนยันจ่ายเงิน
// PENDING_PAYMENT_RECEIPT_UPLOAD = รออัปโหลดใบเสร็จ
// PENDING_NEWS_RECEIPT_UPLOAD = รออัปโหลดใบเสร็จสื่อโฆษณา
// PENDING_AUTO_PAYMENT_RECEIPT_UPLOAD = รออัปโหลดใบเสร็จ(จ่ายอัตโนมัติ)
// PENDING_AUTO_PAYMENT_VERIFICATION = รอตรวจสอบรายการอัตโนมัติ
// PENDING_AUTO_PAYMENT_APPROVAL = รออนุมัติรายการอัตโนมัติ
// PENDING_AUTO_EXPENSE_CLAIM_CORRECTION = รอแก้ไขรายการจ่ายเงินอัตโนมัติ
// PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL = รอตรวจสอบแก้ไขรายการจ่ายเงินอัตโนมัติ
// SUCCESS_EXPENSE_CLAIM = เสร็จสิ้น
// SUCCESS_AUTO_EXPENSE_CLAIM_VERIFICATION = ตรวจสอบเสร็จสิ้น
// SUCCESS_AUTO_PAYMENT = จ่ายเงินอัตโนมัติ
// CANCELLED = ยกเลิก

module.exports = {
  inquiryExpense: getPageOfExpense(),
  getExpenseDetail: getExpenseDetail()
};
