function getPageOfExpense() {
  return {
    "content": inquiryReceive(),
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

function getPageOfAdvance(){
  return {
    "content": inquiryAdvancePayment(),
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

function inquiryAdvancePayment() {
  return [
    {
      "advancePaymentAmount": 1000.00,
      "advancePaymentNo": "6700114571",
      "advancePaymentStatus": "ร่าง",
      "advancePaymentStatusName": "ร่าง",
      "currentAssigneeId": "0000",
      "currentAssigneeName": "ชื่อ นามสกุล",
      "responseUser": "0000-ชื่อ นามสกุล 22/04/2565 : 13:00",
      "statusCode": "IN_PROGRESS",
      "statusName": "ร่าง",
      "taskCode": "string",
      "taskId": 0,
      "taskName": "string"
    },
    {
      "advancePaymentAmount": 1000.00,
      "advancePaymentNo": "6700114571",
      "advancePaymentStatus": "รอตรวจสอบ",
      "advancePaymentStatusName": "รอตรวจสอบ",
      "currentAssigneeId": "0000",
      "currentAssikgneeName": "ชื่อ นามสกุล",
      "responseUser": "0000-ชื่อ นามสกุล 22/04/2565 : 13:00",
      "statusCode": "PENDING_APPROVAL",
      "statusName": "รอตรวจสอบ",
      "taskCode": "string",
      "taskId": 0,
      "taskName": "string"
    },
    {
      "advancePaymentAmount": 1000.00,
      "advancePaymentNo": "6700114571",
      "advancePaymentStatus": "รอแก้ไข",
      "advancePaymentStatusName": "รอแก้ไข",
      "currentAssigneeId": "0000",
      "currentAssigneeName": "ชื่อ นามสกุล",
      "responseUser": "0000-ชื่อ นามสกุล 22/04/2565 : 13:00",
      "statusCode": "FAILED",
      "statusName": "รอแก้ไข",
      "taskCode": "string",
      "taskId": 0,
      "taskName": "string"
    },
    {
      "advancePaymentAmount": 1000.00,
      "advancePaymentNo": "6700114571",
      "advancePaymentStatus": "ร่าง",
      "advancePaymentStatusName": "รอแก้ไข (มีรายการทำไม่สำเร็จ)",
      "currentAssigneeId": "0000",
      "currentAssigneeName": "ชื่อ นามสกุล",
      "responseUser": "0000-ชื่อ นามสกุล 22/04/2565 : 13:00",
      "statusCode": "FAILED",
      "statusName": "รอแก้ไข (มีรายการทำไม่สำเร็จ)",
      "taskCode": "string",
      "taskId": 0,
      "taskName": "string"
    },
    {
      "advancePaymentAmount": 1000.00,
      "advancePaymentNo": "6700114571",
      "advancePaymentStatus": "ร่าง",
      "advancePaymentStatusName": "เสร็จสิ้น",
      "currentAssigneeId": "0000",
      "currentAssigneeName": "ชื่อ นามสกุล",
      "responseUser": "0000-ชื่อ นามสกุล 22/04/2565 : 13:00",
      "statusCode": "FINISHED",
      "statusName": "เสร็จสิ้น",
      "taskCode": "string",
      "taskId": 0,
      "taskName": "string"
    }
  ]
}

function advanceReceiveInfoDetail(){
  return {
    "advanceReceivePaymentNo": "string",
    "advanceReceivePaymentStatus" : "ร่าง",
    "createAdvancePayTransferInfo": [
      {
        "blackCaseNo": "stringxcv",
        "createAdvancePayTransferDetail": [
          {
            "accountCode": "string",
            "accountName": "string",
            "advanceReceiveAccountNo": "string",
            "advanceReceivePayDate": "string",
            "advanceReceiveTypeCode": "string",
            "advanceReceiveTypeDesc": "string",
            "commentCode": "string",
            "commentDesc": "string bla",
            "groupPayTransferCode": "string",
            "groupPayTransferDesc": "string",
            "payTransfer": 0,
            "payTransferBefore": 20,
            "processStatus": "PENDING_NO_SUCCESS"
          },
          {
            "accountCode": "string",
            "accountName": "string",
            "advanceReceiveAccountNo": "string",
            "advanceReceivePayDate": "string",
            "advanceReceiveTypeCode": "string",
            "advanceReceiveTypeDesc": "string",
            "commentCode": "string",
            "commentDesc": "string bla",
            "groupPayTransferCode": "string",
            "groupPayTransferDesc": "string",
            "payTransfer": 0.01,
            "payTransferBefore": 20.00,
            "processStatus": "COMPLETED"
          }
        ],
        "customerId": "string",
        "customerName": "string",
        "documentCourtVerdicts": [
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
            "documentDate": "2023-03-09T08:01:04.421Z",
            "documentId": 0,
            "documentTemplate": {
              "autoMatchType": "string",
              "contentType": "string",
              "documentGroup": "LITIGATION",
              "documentName": "บัญชีค่าธรรมเนียมตามคำพิพากษา",
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
          }
        ],
        "litigationCaseId": 0,
        "litigationCaseStatus": "string",
        "litigationId": "string",
        "organizationCode": "string",
        "organizationName": "string",
        "redCaseNo": "string",
        "sumPayTransfer": "string",
        "sumPayTransferBefore": "string",
        "totalNetPayTransfer": "totalNetPayTransfer = sumPayTransferBefore + sumPayTransfer",
        "updateFlag": "-"
      },
      {
        "blackCaseNo": "string",
        "createAdvancePayTransferDetail": [
          {
            "accountCode": "string",
            "accountName": "string",
            "advanceReceiveAccountNo": "string",
            "advanceReceivePayDate": "string",
            "advanceReceiveTypeCode": "string",
            "advanceReceiveTypeDesc": "string",
            "commentCode": "string",
            "commentDesc": "string bla",
            "groupPayTransferCode": "string",
            "groupPayTransferDesc": "string",
            "payTransfer": 10,
            "payTransferBefore": 20,
            "processStatus": "COMPLETED"
          }
        ],
        "customerId": "string",
        "customerName": "string",
        "documentCourtVerdicts": [
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
            "documentDate": "2023-03-09T08:01:04.421Z",
            "documentId": 0,
            "documentTemplate": {
              "autoMatchType": "string",
              "contentType": "string",
              "documentGroup": "LITIGATION",
              "documentName": "บัญชีค่าธรรมเนียมตามคำพิพากษา2",
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
          }
        ],
        "litigationCaseId": 0,
        "litigationCaseStatus": "string",
        "litigationId": "string",
        "organizationCode": "string",
        "organizationName": "string",
        "redCaseNo": "string",
        "sumPayTransfer": "string",
        "sumPayTransferBefore": "string",
        "totalNetPayTransfer": "totalNetPayTransfer = sumPayTransferBefore + sumPayTransfer",
        "updateFlag": "-"
      }
    ],
    "reason": "string"
  }
}

function inquiryReceive() {
  return [
    {
      "createDate": "31/12/2565",
      "creditNote": "string",
      "currentAssigneeId": "00001",
      "currentAssigneeName": "test test",
      "displayMaker": "test test",
      "paidAmount": "string",
      "payer": "ศาล/ สนง.บังคับคดี",
      "receiveNo": "RC6501001",
      "receiveStatus": "IN_PROGRESS_RECEIVE_NORMAL_PAYMENT",
      "receiveStatusName": "รอแก้ไข",
      "receiveType": "Suspense - Court of justice",
      "receiverBranch": [
        "108339",
        "108340",
        "108341",
        "108342",
      ],
      "refundAmount": "string",
      "runningNumber": 0,
      "statusCode": "IN_PROGRESS",
      "statusName": "",
      "taskCode": "RECEIVE_NORMAL_PAYMENT",
      "taskId": 1,
      "taskName": "string"
    },
    {
      "createDate": "31/12/2565",
      "creditNote": "string",
      "currentAssigneeId": "00001",
      "currentAssigneeName": "test test",
      "displayMaker": "test test",
      "paidAmount": "string",
      "payer": "LEX2-68 ศาล/ สนง.บังคับคดี",
      "receiveNo": "RC6501001",
      "receiveStatus": "PENDING_APPROVAL_RECEIVE_NORMAL_PAYMENT",
      "receiveStatusName": "รอตรวจสอบ",
      "receiveType": "Suspense - Court of justice",
      "receiverBranch": [
        "108339",
        "108340",
        "108341",
        "108342",
      ],
      "refundAmount": "string",
      "runningNumber": 0,
      "statusCode": "PENDING_APPROVAL",
      "statusName": "",
      "taskCode": "RECEIVE_NORMAL_PAYMENT",
      "taskId": 2,
      "taskName": "string"
    },
    {
      "createDate": "31/12/2565",
      "creditNote": "string",
      "currentAssigneeId": "00001",
      "currentAssigneeName": "test test",
      "displayMaker": "test test",
      "paidAmount": "string",
      "payer": "ศาล/ สนง.บังคับคดี",
      "receiveNo": "RC6501001",
      "receiveStatus": "IN_PROGRESS_RECEIVE_ADVANCE_PAYMENT",
      "receiveStatusName": "รอแก้ไข",
      "receiveType": "Suspense - Court of justice",
      "receiverBranch": [
        "108339",
        "108340",
        "108341",
        "108342",
      ],
      "refundAmount": "string",
      "runningNumber": 0,
      "statusCode": "IN_PROGRESS",
      "statusName": "",
      "taskCode": "RECEIVE_ADVANCE_PAYMENT",
      "taskId": 3,
      "taskName": "string"
    },
    {
      "createDate": "31/12/2565",
      "creditNote": "string",
      "currentAssigneeId": "00001",
      "currentAssigneeName": "test test",
      "displayMaker": "test test",
      "paidAmount": "string",
      "payer": "ศาล/ สนง.บังคับคดี",
      "receiveNo": "RC6501001",
      "receiveStatus": "PENDING_APPROVAL_RECEIVE_ADVANCE_PAYMENT",
      "receiveStatusName": "รอตรวจสอบ",
      "receiveType": "Suspense - Court of justice",
      "receiverBranch": [
        "108339",
        "108340",
        "108341",
        "108342",
      ],
      "refundAmount": "string",
      "runningNumber": 0,
      "statusCode": "PENDING_APPROVAL",
      "statusName": "",
      "taskCode": "RECEIVE_ADVANCE_PAYMENT",
      "taskId": 4,
      "taskName": "string"
    },
    {
      "createDate": "31/12/2565",
      "creditNote": "string",
      "currentAssigneeId": "00001",
      "currentAssigneeName": "test test",
      "displayMaker": "test test",
      "paidAmount": "string",
      "payer": "ศาล/ สนง.บังคับคดี",
      "receiveNo": "RC6501001",
      "receiveStatus": "IN_PROGRESS_RECEIVE_COURT_PAYMENT",
      "receiveStatusName": "รอแก้ไข",
      "receiveType": "Suspense - Court of justice",
      "receiverBranch": [
        "108339",
        "108340",
        "108341",
        "108342",
      ],
      "refundAmount": "string",
      "runningNumber": 0,
      "statusCode": "IN_PROGRESS",
      "statusName": "",
      "taskCode": "RECEIVE_COURT_PAYMENT",
      "taskId": 5,
      "taskName": "string"
    },
    {
      "createDate": "31/12/2565",
      "creditNote": "string",
      "currentAssigneeId": "00001",
      "currentAssigneeName": "test test",
      "displayMaker": "test test",
      "paidAmount": "string",
      "payer": "ศาล/ สนง.บังคับคดี",
      "receiveNo": "RC6501001",
      "receiveStatus": "PENDING_RECEVE_COURT_PAYMENT",
      "receiveStatusName": "ร่าง",
      "receiveType": "Suspense - Court of justice",
      "receiverBranch": [
        "108339",
        "108340",
        "108341",
        "108342",
      ],
      "refundAmount": "string",
      "runningNumber": 0,
      "statusCode": "PENDING",
      "statusName": "",
      "taskCode": "RECEIVE_COURT_PAYMENT",
      "taskId": 6,
      "taskName": "string"
    },
    {
      "createDate": "31/12/2565",
      "creditNote": "string",
      "currentAssigneeId": "00001",
      "currentAssigneeName": "test test",
      "displayMaker": "test test",
      "paidAmount": "string",
      "payer": "ศาล/ สนง.บังคับคดี",
      "receiveNo": "RC6501001",
      "receiveStatus": "PENDING_APPROVAL_RECEIVE_COURT_PAYMENT",
      "receiveStatusName": "รอตรวจสอบ",
      "receiveType": "Suspense - Court of justice",
      "receiverBranch": [
        "108339",
        "108340",
        "108341",
        "108342",
      ],
      "refundAmount": "string",
      "runningNumber": 0,
      "statusCode": "PENDING_APPROVAL",
      "statusName": "",
      "taskCode": "RECEIVE_COURT_PAYMENT",
      "taskId": 7,
      "taskName": "string"
    }
  ]
}

function getKcorpPageOfExpense() {
  return {
    "content": inquiryReceiveKcorp(),
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

function getKcorpRefundInfoPage() {
  return {
    "content": inquiryKcorpRefundInfo(),
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
    "totalElements": 1,
    "totalPages": 1,
    "last": false,
    "size": 10,
    "number": 0,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "numberOfElements": 1,
    "first": true,
    "empty": false
  }
}

function getKcorpReferenceNoPage() {
  return {
    "content": inquiryKcorpReferenceNoInfo(),
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
    "totalElements": 1,
    "totalPages": 1,
    "last": false,
    "size": 10,
    "number": 0,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "numberOfElements": 1,
    "first": true,
    "empty": false
  }
}

function inquiryReceiveKcorp() {
  return [
    {
      "currentAssigneeId": "000000",
      "currentAssigneeName": "Assignee Name",
      "finishedRecord": 0,
      "status": "ทำรายการแล้วบางส่วน",
      "statusCode": "PENDING",
      "statusName": "ทำรายการแล้วบางส่วน",
      "taskCode": "string",
      "taskId": 0,
      "taskName": "string",
      "textFileAmount": 200,
      "totalRecord": 0,
      "transferDate": new Date(),
      "washAccountAmount": 0,
      "washAccountDesc": "string",
      "washAccountNo": "6700114571",
      "washAccountOrgCode": "000000",
      "washAccountOrgName": "กรมบังคับคดี"
    }
  ]
}

function inquiryKcorpRefundInfo() {
  return [{
    organizationCode: '000000',
    organizationName: 'ฝ่ายกำกับและบริหารการบังคับคดี',
    paidType: 'Suspense - Court of justice',
    statusCode: 'PENDING',
    statusName: 'ทำรายการแล้วบางส่วน',
    transferAmount: 1500,
    transferDate: new Date(),
    paidDetails: [{
      assignId: '000001',
      courtCode: '000000',
      courtName: 'สำนักงานศาลยุติธรรม',
      createSuspenseDate: new Date(),
      no: '0',
      payAmount: 1000,
      ref1: '256106000001',
      ref2: '123',
      referenceNo: '008045500000000051',
      receiveStatus: 'PENDING_APPROVAL',
      receiveStatusDesc: 'รอตรวจสอบ',
      transferAmount: 1000,
    }],
    transferUnit: 7,
    washAccountAmount: 1500,
    washAccountNo: '6700114571',
  }]
}

function inquiryKcorpReferenceNoInfo() {
  return [{
    bookingDetailList: [{
      bookingRefNo: 'RC6501001',
      branch: {
        '108339': 'สาขา 1',
        '108763': 'สาขา 2',
        '108222': 'สาขา 3'
       },
      createBy: '000000',
      createDate: new Date(),
      no: '0',
      organizationName: 'ฝ่ายกำกับและบริหารการบังคับคดี',
      paidType: 'Suspense - Court of justice',
      payAmount: 200,
      payer: 'ศาล/สนง.บังคับคดี',
      refundAmount: 200,
      receiveStatus: 'IN_PROGRESS',
      receiveStatusDesc: 'รอแก้ไข',
      userCreateDate: new Date(),
      userName: 'ชื่อ นามสกุล',
    }, {
      bookingRefNo: 'RC6501001',
      branch: {
        '108339': 'สาขา 1',
       },
      createBy: '000000',
      createDate: new Date(),
      no: '0',
      organizationName: 'ฝ่ายกำกับและบริหารการบังคับคดี',
      paidType: 'Suspense - Court of justice',
      payAmount: 200,
      payer: 'ศาล/สนง.บังคับคดี',
      refundAmount: 200,
      receiveStatus: 'IN_PROGRESS',
      receiveStatusDesc: 'รอแก้ไข',
      userCreateDate: new Date(),
      userName: 'ชื่อ นามสกุล',
    }, {
      bookingRefNo: 'RC6501001',
      branch: {
        '108339': 'สาขา 1',
        '108763': 'สาขา 2',
       },
      createBy: '000000',
      createDate: new Date(),
      no: '0',
      organizationName: 'ฝ่ายกำกับและบริหารการบังคับคดี',
      paidType: 'Suspense - Court of justice',
      payAmount: 200,
      payer: 'ศาล/สนง.บังคับคดี',
      refundAmount: 200,
      receiveStatus: 'IN_PROGRESS',
      receiveStatusDesc: 'รอแก้ไข',
      userCreateDate: new Date(),
      userName: 'ชื่อ นามสกุล',
    }],
    courtCode: '000000',
    courtName: 'สำนักงานศาลยุติธรรม',
    suspenseAccountDate: new Date(),
    paidAmount: 200,
    ref1: '256106000001',
    ref2: 123,
    referenceNo: '008045500000000051',
    washAccountAmount: 1000,
  }]
}


function getReceiveOrder() {
  return {
    "accountCode": "string",
    "cancelReason": "string",
    "cancelReasonOther": "string",
    "editReason": "string",
    "headerFlag": "DRAFT",
    "litigationCaseId": 0,
    "litigationId": "string",
    "makerOrgId": "string",
    "makerOrgName": "string",
    "paidAmount": 0,
    "payAmount": 0,
    "payerType": "DEBTOR",
    "receiveDate": "string",
    "receiveNo": "string",
    "receiveReferenceNo": "string",
    "receiveSource": "NORMAL",
    "receiveStatus": "DRAFT",
    "receiveType": "INTER_OFFICE",
    "referenceNo": "string",
    "remark": "string",
    "transferOrders": [
      {
        "blackCaseNo": "string",
        "branchCode": "string",
        "branchName": "string",
        "courtCode": "string",
        "courtName": "string",
        "litigationCaseId": 0,
        "litigationId": "string",
        "litigationStatus": "string",
        "litigationStatusName": "string",
        "mainBorrowerPersonId": "string",
        "mainBorrowerPersonName": "string",
        "orgCode": "string",
        "orgName": "string",
        "receiveTransactions": [
          {
            "advancePaymentAccountNo": "string",
            "advancePaymentDate": "string",
            "clearingAmount": 0,
            "expenseTypeCode": "string",
            "expenseTypeName": "string",
            "id": 0,
            "processStatus": "string",
            "receiveTypeCode": "string",
            "remainingAmount": 0,
            "remark": "string",
            "totalAmount": 0
          }
        ],
        "redCaseNo": "string",
        "responseUnitCode": "string",
        "responseUnitName": "string",
        "transferTransactions": [
          {
            "creditNoteDescription": "string",
            "creditNoteReceiverOrgCode": "string",
            "creditNoteReceiverOrgName": "string",
            "hitCreditNote": 0,
            "id": 0,
            "sendAmount": 0
          }
        ]
      }
    ],
    "updateFlag": "A"
  }
}

module.exports = {
  inquiryReceive: getPageOfExpense(),
  inquiryReceiveKcorp: getKcorpPageOfExpense(),
  inquiryKcorpRefundInfo: getKcorpRefundInfoPage(),
  inquiryKcorpReferenceNoInfo: getKcorpReferenceNoPage(),
  getReceiveOrder: getReceiveOrder(),
  inquiryAdvancePayment: getPageOfAdvance(),
  advanceReceiveInfoDetail: advanceReceiveInfoDetail()
};
