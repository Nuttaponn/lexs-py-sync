function getAccountDocumentsByAccountDocFollowUpId() {
  var documentObject = {
    active: true,
    additionalInfo: {
      allowCategory: ["Category A", "Category B"]
    },
    attributes: {},
    commitmentAccounts: ["Account A", "Account B"],
    customerId: "987654321",
    dimsHardCopyRequestDate: "2023-08-27",
    dimsHardCopyStatus: "FOUND",
    dimsTicketBarcode: "TICKET123",
    documentCommitmentId: "DOC123",
    documentDate: "2023-08-26",
    documentId: 1,
    documentTemplate: {
      autoMatchType: "Type A",
      contentType: "Type B",
      documentGroup: "LITIGATION",
      documentName: "Document A",
      documentTemplateId: "TEMPLATE123",
      forLitigation: true,
      forNoticeLetter: false,
      generatedBySystem: true,
      needHardCopy: true,
      optional: false,
      requiredDocumentDate: true,
      searchType: "LEXS"
    },
    documentTemplateId: "TEMPLATE123",
    handlingOrganization: "Org XYZ",
    hardCopyState: "SUCCESS",
    hasOriginalCopy: true,
    imageId: "IMAGE123",
    imageName: "Image A",
    imageSource: "LEXS",
    litigationCaseId: 12345,
    litigationId: "LE987654",
    objectId: "OBJ123",
    objectType: "PERSON",
    receiveDate: "2023-08-25",
    received: true,
    rejectedReasons: [],
    sendDate: "2023-08-24",
    sent: true,
    storeOrganization: "Store Org",
    storeOrganizationName: "Store Org Name",
    uploadUserId: "user123"
  };

  var documentObjects = [];
  var docTempIds = [
    'LEXSF146',
    'LEXSF160',
    'LEXSF175',
    'LEXSF176',
    'LEXSF197'
  ];

  let i = 1;
  for (let docTempId of docTempIds) {
    documentObjects.push({
      ...documentObject,
      documentTemplateId: docTempId,
      documentTemplate: {
        ...documentObject.documentTemplate,
        documentName: docTempId,
        documentTemplateId: docTempId,
        optional: true,
      },
      documentId: i++,
    })
  }

  var mockDocument/*: DocumentDto*/ = {
    accountNo: "123456789",
    accountType: "Savings",
    documents: documentObjects,
    /*[
      {
        active: true,
        additionalInfo: {
          allowCategory: ["Category A", "Category B"]
        },
        attributes: {},
        commitmentAccounts: ["Account A", "Account B"],
        customerId: "987654321",
        dimsHardCopyRequestDate: "2023-08-27",
        dimsHardCopyStatus: "FOUND",
        dimsTicketBarcode: "TICKET123",
        documentCommitmentId: "DOC123",
        documentDate: "2023-08-26",
        documentId: 1,
        documentTemplate: {
          autoMatchType: "Type A",
          contentType: "Type B",
          documentGroup: "LITIGATION",
          documentName: "Document A",
          documentTemplateId: "TEMPLATE123",
          forLitigation: true,
          forNoticeLetter: false,
          generatedBySystem: true,
          needHardCopy: true,
          optional: false,
          requiredDocumentDate: true,
          searchType: "LEXS"
        },
        documentTemplateId: "TEMPLATE123",
        handlingOrganization: "Org XYZ",
        hardCopyState: "SUCCESS",
        hasOriginalCopy: true,
        imageId: "IMAGE123",
        imageName: "Image A",
        imageSource: "LEXS",
        litigationCaseId: 12345,
        litigationId: "LE987654",
        objectId: "OBJ123",
        objectType: "PERSON",
        receiveDate: "2023-08-25",
        received: true,
        rejectedReasons: [],
        sendDate: "2023-08-24",
        sent: true,
        storeOrganization: "Store Org",
        storeOrganizationName: "Store Org Name",
        uploadUserId: "user123"
      }
    ]*/
  };

  var mockAccountDocFollowup/*: AccountDocFollowup*/ = {
    accountDocDeedGroups: [],
    accountDocFollowupId: 123,
    accountDocReceiveStatus: "RECEIVED",
    accountDocVerifyResult: "VERIFIED",
    accountDocVerifyStatus: "PENDING",
    activeFlag: true,
    additionalPaymentAmount: 0,
    cashierChequeInfo: {
      amount: 1000,
      chequeBankCode: "123456",
      chequeBankName: "Bank ABC",
      chequeBranch: "Branch XYZ",
      chequeDate: "2023-08-27",
      chequeNo: "CHQ123"
    },
    certifyAccountWarrantDate: "2023-08-28",
    certifyAccountWarrantStatus: "",
    certifyAccountWarrantType: "WARRANT_A",
    creditNoteInfo: {
      recipientDeptCode: "DEPT123",
      recipientDeptName: "Department XYZ",
      refNo: "REF456"
    },
    debtSettlementAmount: 2000,
    // documents: [mockDocument.documents[0]],
    documents: [ ...documentObjects ],
    followupResult: "SUCCESS",
    followupStatus: "PENDING",
    initType: "INITIAL",
    originalAccountDocFollowupId: 0,
    remark: "Some remark",
    reviewInfo: [],
    roundNo: 1,
    status: "ACTIVE"
  };

  var mockAccountDocFollowupUpgraded = {
    "certifyAccountWarrantStatus":"RECEIVE",
    "certifyAccountWarrantType":"VALID_WARRANT",
    "certifyAccountWarrantDate":"2023-08-28",
    "accountDocVerifyStatus":"VERIFIED",
    "remark":"Some remark",
    "accountDocVerifyResult":"VALID_DATA",
    "accountDocDeedGroups":[
       {
          "fsubbidnum":"ชุดทรัพย์ที่ 1",
          "deedGroupId":183
       },
       {
          "fsubbidnum":"ชุดทรัพย์ที่ 1",
          "deedGroupId":181
       }
    ],
    "debtSettlementAmount":2000,
    "additionalPaymentAmount":null,
    cashierChequeInfo: {
      "chequeNo":"CHQ123",
      "amount":1000,
      "chequeDate":"2023-08-27",
      "chequeBankName":"030",
      "chequeBankCode":"123456",
    },
    creditNoteInfo: {
      recipientDeptCode: "DEPT123",
      recipientDeptName: "Department XYZ",
      // "refNo":"REF456",
      refNo: "2131-23-2132-1-3212"
    },
    "files":[
       {
          "documentTemplateId":"TEMPLATE123",
          "documentTemplate":{
             "autoMatchType":"Type A",
             "contentType":"Type B",
             "documentGroup":"LITIGATION",
             "documentName":"Document A",
             "documentTemplateId":"TEMPLATE123",
             "forLitigation":true,
             "forNoticeLetter":false,
             "generatedBySystem":true,
             "needHardCopy":true,
             "optional":false,
             "requiredDocumentDate":true,
             "searchType":"LEXS"
          },
          "imageId":"Wed Aug 30 2023TEMPLATE123_FE_MOCK_UPLOAD_SESSION",
          "uploadDate":"Wed Aug 30 2023",
          "isUpload":true,
          "removeDocument":true,
          "uploadRequired":true,
          "documentDate":"2023-08-29T17:13:22.257Z"
       }
    ]
  }
  mockAccountDocFollowup = {
    ...mockAccountDocFollowup,
    ...mockAccountDocFollowupUpgraded
  }
  var mockPublicAuctionAnnounce/*: PublicAuctionAnnounce*/ = {
    aucLedSeq: 1234,
    aucRef: 166,
    ledId: 1,
    ledName: "LedA",
    litigationCaseId: 98765,
    litigationId: "LE123456",
    originalLitigationCaseId: 54321,
    saleChannel: "Online"
  };

  var mockAccountDocumentsResponse/*: AccountDocumentsResponse*/ = {
    accountDocuments: [mockDocument],
    accountDocFollowups: [mockAccountDocFollowup],
    publicAuctionAnnounce: mockPublicAuctionAnnounce
  };

  return mockAccountDocumentsResponse;
}
function getAccountDocumentDeedGroupsByAucRef(/*aucRef = 166*/) {
  return {
    "aucRef": 166,
    "accountDocDeedGroups": [
      {
        "deedGroupId": 183,
        "fsubbidnum": "1"
      },
      {
        "deedGroupId": 181,
        "fsubbidnum": "1"
      },
      {
        "deedGroupId": 182,
        "fsubbidnum": "2"
      }
    ]
  };
}



function deedDoc(/*aucRef = 166*/) {
  return   {
    "deedGroupId": 888,
    "conveyanceDeedGroupUploadDocuments":
    [
        {
            "documentTemplate":
            {
                "documentGroup": "AUCTION",
                "documentTemplateId": "LEXSF143",
                "documentName": "หนังสือโอนกรรมสิทธิ์"
            },
            "documentId": 113,
            "imageSource": "LEXS",
            "imageId": "f6e61c1f-6ad6-47d3-b5fa-87c561218622",
            "imageName": "text",
            "uploadTimestamp": "2023-07-25T13:10:39.401Z"
        }
    ],
    "deedDocuments":
    [
        {
            "deedId": 999,
            "collateralId": "text",
            "collateralTypeCode": "text",
            "collateralSubTypeCode": "text",
            "collateralDocNo": "text",
  "collateralsDescription": "text",
            "documents":
            [
                {
                    "documentTemplate":
                    {
                        "documentGroup": "COLLATERAL_CONTRACT",
                        "documentTemplateId": "LEXSD058",
                        "documentName": "สัญญาจำนอง-โฉนดที่ดิน"
                    },
                    "documentId": 114,
                    "imageSource": "LEXS",
                    "imageId": "f6e61c1f-6ad6-47d3-b5fa-87c561218622",
                    "imageName": "text",
                    "uploadTimestamp": "2023-07-25T13:10:39.401Z",
                    "storeOrgCode": "text",
                    "storeOrgName": "text",
                    "receiveDate": "YYYY-MM-DD"
                },
                {
                    "documentTemplate":
                    {
                        "documentGroup": "COLLATERAL",
                        "documentTemplateId": "LEXSD140",
                        "documentName": "สำเนาโฉนดที่ดิน"
                    },
                    "documentId": 114,
                    "imageSource": "LEXS",
                    "imageId": "f6e61c1f-6ad6-47d3-b5fa-87c561218622",
                    "imageName": "text",
                    "uploadTimestamp": "2023-07-25T13:10:39.401Z",
                    "storeOrgCode": "text",
                    "storeOrgName": "text",
                    "receiveDate": "YYYY-MM-DD"
                }
            ]
        },
        {
            "deedId": 998,
            "collateralId": "text",
            "collateralTypeCode": "text",
            "collateralSubTypeCode": "text",
            "collateralDocNo": "text",
  "collateralsDescription": "text",
            "documents":
            [
                {
                    "documentTemplate":
                    {
                        "documentGroup": "COLLATERAL_CONTRACT",
                        "documentTemplateId": "LEXSD059",
                        "documentName": "สัญญาจำนอง-นส.3ก."
                    },
                    "documentId": 114,
                    "imageSource": "LEXS",
                    "imageId": "f6e61c1f-6ad6-47d3-b5fa-87c561218622",
                    "imageName": "text",
                    "uploadTimestamp": "2023-07-25T13:10:39.401Z",
                    "storeOrgCode": "text",
                    "storeOrgName": "text",
                    "receiveDate": "YYYY-MM-DD"
                },
                {
                    "documentTemplate":
                    {
                        "documentGroup": "COLLATERAL",
                        "documentTemplateId": "LEXSD141",
                        "documentName": "นส.3ก."
                    },
                    "documentId": 114,
                    "imageSource": "LEXS",
                    "imageId": "f6e61c1f-6ad6-47d3-b5fa-87c561218622",
                    "imageName": "text",
                    "uploadTimestamp": "2023-07-25T13:10:39.401Z",
                    "storeOrgCode": "text",
                    "storeOrgName": "text",
                    "receiveDate": "YYYY-MM-DD"
                }
            ]
        }
    ],
  "appraisalDocuments":
    [
  {
            "deedId": 999,
            "collateralId": "text",
            "collateralTypeCode": "text",
            "collateralSubTypeCode": "text",
            "collateralDocNo": "text",
  "collateralsDescription": "text",
  "appraisalDate": "",
            "documents":
            [
                {
                    "documentTemplate":
                    {
                        "documentGroup": "COLLATERAL_APPRAISAL",
                        "documentTemplateId": "LEXSD191",
                        "documentName": "รายงานการประเมินราคาที่ดิน - โฉนดที่ดิน"
                    },
                    "documentId": 222,
                    "imageSource": "IMP",
                    "imageId": "f6e61c1f-6ad6-47d3-b5fa-87c561218622",
                    "imageName": "text",
                    "uploadTimestamp": "2023-07-25T13:10:39.401Z"
                },
                {
                    "documentTemplate":
                    {
                        "documentGroup": "COLLATERAL_APPRAISAL",
                        "documentTemplateId": "LEXSD191",
                        "documentName": "รายงานการประเมินราคาที่ดิน - โฉนดที่ดิน"
                    },
                    "documentId": 223,
                    "imageSource": "IMP",
                    "imageId": "f6e61c1f-6ad6-47d3-b5fa-87c561218622",
                    "imageName": "text",
                    "uploadTimestamp": "2023-07-25T13:10:39.401Z"
                }
            ]
        },
        {
            "deedId": 998,
            "collateralId": "text",
            "collateralTypeCode": "text",
            "collateralSubTypeCode": "text",
            "collateralDocNo": "text",
  "collateralsDescription": "text",
  "appraisalDate": "",
            "documents":
            [
                {
                    "documentTemplate":
                    {
                        "documentGroup": "COLLATERAL_APPRAISAL",
                        "documentTemplateId": "LEXSD191",
                        "documentName": "รายงานการประเมินราคาที่ดิน - โฉนดที่ดิน"
                    },
                    "documentId": 224,
                    "imageSource": "IMP",
                    "imageId": "f6e61c1f-6ad6-47d3-b5fa-87c561218622",
                    "imageName": "text",
                    "uploadTimestamp": "2023-07-25T13:10:39.401Z"
                }
            ]
        }
  ]
  }
}
module.exports = {
  getAccountDocumentsByAccountDocFollowUpId: getAccountDocumentsByAccountDocFollowUpId(),
  getAccountDocumentDeedGroupsByAucRef: getAccountDocumentDeedGroupsByAucRef(),
  getConveyanceAnnouncesDocuments: deedDoc(),
};
