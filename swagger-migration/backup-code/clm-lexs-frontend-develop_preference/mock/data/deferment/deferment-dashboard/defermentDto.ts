import { DefermentDto } from "@lexs/lexs-client";

export const mockResponse: DefermentDto = {
  "deferment": {
    "approveDate": "2023-05-18T04:01:39.078Z",
    "cancelDate": "2023-05-18T04:01:39.078Z",
    "cancelReason": "string",
    "cancelWithDebtChanges": true,
    "conclusionDeferment": "string",
    "createdBy": "string",
    "createdByName": "string",
    "createdDate": "2023-05-18T04:01:39.078Z",
    "currentActorApproved": true,
    "currentApproveActor": "ORGANIZATION",
    "customerHistory": "string",
    "customerId": "string",
    "defermentApprovalHistoryInfos": [
      {
        "approveActor": "ORGANIZATION",
        "approveDate": "2023-05-18T04:01:39.078Z",
        "approveResult": "APPROVE",
        "approverId": "string",
        "approverName": "string",
        "defermentId": "string",
        "reason": "string"
      }
    ],
    "defermentApproverCode": "string",
    "defermentApproverName": "string",
    "defermentDays": 0,
    "defermentId": "string",
    "defermentLitigationDebtInfos": [
      {
        "appraisalPrice": 0,
        "litigationId": "string",
        "outstandingBalance": 0,
        "totalDebt": 0
      }
    ],
    "defermentLitigationInfos": [
      {
        "checked": true,
        "customerId": "string",
        "enabled": true,
        "legalStatus": "string",
        "litigationDate": "string",
        "litigationId": "string"
      }
    ],
    "defermentReason": "string",
    "defermentReasonCode": "string",
    "defermentReasonName": "string",
    "defermentReasonOther": "string",
    "defermentTaskStatus": "DRAFT",
    "dlaApprove": true,
    "documents": [
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
        "dimsHardCopyRequestDate": "2023-05-18T04:01:39.078Z",
        "dimsHardCopyStatus": "FOUND",
        "dimsTicketBarcode": "string",
        "documentCommitmentId": "string",
        "documentDate": "2023-05-18T04:01:39.078Z",
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
        "handlingOrganization": "string",
        "hardCopyState": "SUCCESS",
        "hasOriginalCopy": true,
        "imageId": "string",
        "imageName": "หนังสือสั่งการ",
        "imageSource": "LEXS",
        "litigationCaseId": 0,
        "litigationId": "string",
        "objectId": "string",
        "objectType": "PERSON",
        "receiveDate": "string",
        "received": true,
        "rejectedReasons": [
          {
            "rejectedDate": "2023-05-18T04:01:39.078Z",
            "rejectedDocumentInfo": {
              "documentName": "string",
              "pageCount": 0
            },
            "rejectedReasonId": "string",
            "rejectedReasonName": "string",
            "rejectedRemarks": "string",
            "rejectedUserId": "string",
            "rejectedUserName": "string",
            "rejectedUserRole": "string",
            "rejectedUserSubRole": "string"
          }
        ],
        "sendDate": "string",
        "sent": true,
        "storeOrganization": "string",
        "storeOrganizationName": "string",
        "uploadUserId": "string"
      },
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
        "dimsHardCopyRequestDate": "2023-05-18T04:01:39.078Z",
        "dimsHardCopyStatus": "FOUND",
        "dimsTicketBarcode": "string",
        "documentCommitmentId": "string",
        "documentDate": "2023-05-18T04:01:39.078Z",
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
        "handlingOrganization": "string",
        "hardCopyState": "SUCCESS",
        "hasOriginalCopy": true,
        "imageId": "string",
        "imageName": "เอกสารเกี่ยวกับการชะลอดำเนินคดี",
        "imageSource": "LEXS",
        "litigationCaseId": 0,
        "litigationId": "string",
        "objectId": "string",
        "objectType": "PERSON",
        "receiveDate": "string",
        "received": true,
        "rejectedReasons": [
          {
            "rejectedDate": "2023-05-18T04:01:39.078Z",
            "rejectedDocumentInfo": {
              "documentName": "string",
              "pageCount": 0
            },
            "rejectedReasonId": "string",
            "rejectedReasonName": "string",
            "rejectedRemarks": "string",
            "rejectedUserId": "string",
            "rejectedUserName": "string",
            "rejectedUserRole": "string",
            "rejectedUserSubRole": "string"
          }
        ],
        "sendDate": "string",
        "sent": true,
        "storeOrganization": "string",
        "storeOrganizationName": "string",
        "uploadUserId": "string"
      }
    ],
    "endDate": "2023-05-18T04:01:39.078Z",
    "extendDeferment": true,
    "organizationCode": "string",
    "originAndNecessity": "string",
    "responseUnitType": "RESPONSE_UNIT",
    "startDate": "2023-05-18T04:01:39.078Z",
    "updatedBy": "string",
    "updatedDate": "2023-05-18T04:01:39.078Z",
    "actionFlag": true,

  },
  "defermentApproves": [
    {
      "approveDate": "2023-05-18T04:01:39.078Z",
      "cancelDate": "2023-05-18T04:01:39.078Z",
      "cancelReason": "string",
      "cancelWithDebtChanges": true,
      "conclusionDeferment": "string",
      "createdBy": "string",
      "createdByName": "string",
      "createdDate": "2023-05-18T04:01:39.078Z",
      "currentActorApproved": true,
      "currentApproveActor": "ORGANIZATION",
      "customerHistory": "string",
      "customerId": "string",
      "defermentApprovalHistoryInfos": [
        {
          "approveActor": "ORGANIZATION",
          "approveDate": "2023-05-18T04:01:39.078Z",
          "approveResult": "APPROVE",
          "approverId": "string",
          "approverName": "string",
          "defermentId": "string",
          "reason": "string"
        }
      ],
      "defermentApproverCode": "string",
      "defermentApproverName": "string",
      "defermentDays": 1,
      "defermentId": "string",
      "defermentLitigationDebtInfos": [
        {
          "appraisalPrice": 0,
          "litigationId": "string",
          "outstandingBalance": 0,
          "totalDebt": 0
        }
      ],
      "defermentLitigationInfos": [
        {
          "checked": true,
          "customerId": "string",
          "enabled": true,
          "legalStatus": "string",
          "litigationDate": "2023-05-18T04:01:39.078Z",
          "litigationId": "string"
        }
      ],
      "defermentReason": "string",
      "defermentReasonCode": "string",
      "defermentReasonName": "string",
      "defermentReasonOther": "string",
      "defermentTaskStatus": "DRAFT",
      "dlaApprove": true,
      "documents": [
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
          "dimsHardCopyRequestDate": "2023-05-18T04:01:39.078Z",
          "dimsHardCopyStatus": "FOUND",
          "dimsTicketBarcode": "string",
          "documentCommitmentId": "string",
          "documentDate": "2023-05-18T04:01:39.078Z",
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
          "handlingOrganization": "string",
          "hardCopyState": "SUCCESS",
          "hasOriginalCopy": true,
          "imageId": "string",
          "imageName": "string",
          "imageSource": "LEXS",
          "litigationCaseId": 0,
          "litigationId": "string",
          "objectId": "string",
          "objectType": "PERSON",
          "receiveDate": "2023-05-18T04:01:39.078Z",
          "received": true,
          "rejectedReasons": [
            {
              "rejectedDate": "2023-05-18T04:01:39.078Z",
              "rejectedDocumentInfo": {
                "documentName": "string",
                "pageCount": 0
              },
              "rejectedReasonId": "string",
              "rejectedReasonName": "string",
              "rejectedRemarks": "string",
              "rejectedUserId": "string",
              "rejectedUserName": "string",
              "rejectedUserRole": "string",
              "rejectedUserSubRole": "string"
            }
          ],
          "sendDate": "2023-05-18T04:01:39.078Z",
          "sent": true,
          "storeOrganization": "string",
          "storeOrganizationName": "string",
          "uploadUserId": "string"
        }
      ],
      "endDate": "2023-05-18T04:01:39.078Z",
      "extendDeferment": true,
      "organizationCode": "string",
      "originAndNecessity": "string",
      "responseUnitType": "RESPONSE_UNIT",
      "startDate": "2023-05-18T04:01:39.078Z",
      "updatedBy": "string",
      "updatedDate": "2023-05-18T04:01:39.078Z"
    },
    {
      "approveDate": "2023-05-18T04:01:39.078Z",
      "cancelDate": "2023-05-18T04:01:39.078Z",
      "cancelReason": "string",
      "cancelWithDebtChanges": true,
      "conclusionDeferment": "string",
      "createdBy": "string",
      "createdByName": "string",
      "createdDate": "2023-05-18T04:01:39.078Z",
      "currentActorApproved": true,
      "currentApproveActor": "ORGANIZATION",
      "customerHistory": "string",
      "customerId": "string",
      "defermentApprovalHistoryInfos": [
        {
          "approveActor": "ORGANIZATION",
          "approveDate": "2023-05-18T04:01:39.078Z",
          "approveResult": "APPROVE",
          "approverId": "string",
          "approverName": "string",
          "defermentId": "string",
          "reason": "string"
        }
      ],
      "defermentApproverCode": "string",
      "defermentApproverName": "string",
      "defermentDays": 1,
      "defermentId": "string",
      "defermentLitigationDebtInfos": [
        {
          "appraisalPrice": 0,
          "litigationId": "string",
          "outstandingBalance": 0,
          "totalDebt": 0
        }
      ],
      "defermentLitigationInfos": [
        {
          "checked": true,
          "customerId": "string",
          "enabled": true,
          "legalStatus": "string",
          "litigationDate": "2023-05-18T04:01:39.078Z",
          "litigationId": "string"
        }
      ],
      "defermentReason": "string",
      "defermentReasonCode": "string",
      "defermentReasonName": "string",
      "defermentReasonOther": "string",
      "defermentTaskStatus": "DRAFT",
      "dlaApprove": true,
      "documents": [
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
          "dimsHardCopyRequestDate": "2023-05-18T04:01:39.078Z",
          "dimsHardCopyStatus": "FOUND",
          "dimsTicketBarcode": "string",
          "documentCommitmentId": "string",
          "documentDate": "2023-05-18T04:01:39.078Z",
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
          "handlingOrganization": "string",
          "hardCopyState": "SUCCESS",
          "hasOriginalCopy": true,
          "imageId": "string",
          "imageName": "string",
          "imageSource": "LEXS",
          "litigationCaseId": 0,
          "litigationId": "string",
          "objectId": "string",
          "objectType": "PERSON",
          "receiveDate": "2023-05-18T04:01:39.078Z",
          "received": true,
          "rejectedReasons": [
            {
              "rejectedDate": "2023-05-18T04:01:39.078Z",
              "rejectedDocumentInfo": {
                "documentName": "string",
                "pageCount": 0
              },
              "rejectedReasonId": "string",
              "rejectedReasonName": "string",
              "rejectedRemarks": "string",
              "rejectedUserId": "string",
              "rejectedUserName": "string",
              "rejectedUserRole": "string",
              "rejectedUserSubRole": "string"
            }
          ],
          "sendDate": "2023-05-18T04:01:39.078Z",
          "sent": true,
          "storeOrganization": "string",
          "storeOrganizationName": "string",
          "uploadUserId": "string"
        }
      ],
      "endDate": "2023-05-18T04:01:39.078Z",
      "extendDeferment": true,
      "organizationCode": "string",
      "originAndNecessity": "string",
      "responseUnitType": "RESPONSE_UNIT",
      "startDate": "2023-05-18T04:01:39.078Z",
      "updatedBy": "string",
      "updatedDate": "2023-05-18T04:01:39.078Z"
    }
  ],
  "defermentHistories": [
    {
      "approveDate": "2023-05-18T04:01:39.078Z",
      "cancelDate": "2023-05-18T04:01:39.078Z",
      "cancelReason": "string",
      "cancelWithDebtChanges": true,
      "conclusionDeferment": "string",
      "createdBy": "string",
      "createdByName": "string",
      "createdDate": "2023-05-18T04:01:39.078Z",
      "currentActorApproved": true,
      "currentApproveActor": "ORGANIZATION",
      "customerHistory": "string",
      "customerId": "string",
      "defermentApprovalHistoryInfos": [
        {
          "approveActor": "ORGANIZATION",
          "approveDate": "2023-05-18T04:01:39.078Z",
          "approveResult": "APPROVE",
          "approverId": "string",
          "approverName": "string",
          "defermentId": "string",
          "reason": "string"
        }
      ],
      "defermentApproverCode": "string",
      "defermentApproverName": "string",
      "defermentDays": 0,
      "defermentId": "string",
      "defermentLitigationDebtInfos": [
        {
          "appraisalPrice": 0,
          "litigationId": "string",
          "outstandingBalance": 0,
          "totalDebt": 0
        }
      ],
      "defermentLitigationInfos": [
        {
          "checked": true,
          "customerId": "string",
          "enabled": true,
          "legalStatus": "string",
          "litigationDate": "2023-05-18T04:01:39.078Z",
          "litigationId": "string"
        }
      ],
      "defermentReason": "string",
      "defermentReasonCode": "string",
      "defermentReasonName": "string",
      "defermentReasonOther": "string",
      "defermentTaskStatus": "DRAFT",
      "dlaApprove": true,
      "documents": [
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
          "dimsHardCopyRequestDate": "2023-05-18T04:01:39.079Z",
          "dimsHardCopyStatus": "FOUND",
          "dimsTicketBarcode": "string",
          "documentCommitmentId": "string",
          "documentDate": "2023-05-18T04:01:39.079Z",
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
          "handlingOrganization": "string",
          "hardCopyState": "SUCCESS",
          "hasOriginalCopy": true,
          "imageId": "string",
          "imageName": "string",
          "imageSource": "LEXS",
          "litigationCaseId": 0,
          "litigationId": "string",
          "objectId": "string",
          "objectType": "PERSON",
          "receiveDate": "2023-05-18T04:01:39.078Z",
          "received": true,
          "rejectedReasons": [
            {
              "rejectedDate": "2023-05-18T04:01:39.079Z",
              "rejectedDocumentInfo": {
                "documentName": "string",
                "pageCount": 0
              },
              "rejectedReasonId": "string",
              "rejectedReasonName": "string",
              "rejectedRemarks": "string",
              "rejectedUserId": "string",
              "rejectedUserName": "string",
              "rejectedUserRole": "string",
              "rejectedUserSubRole": "string"
            }
          ],
          "sendDate": "2023-05-18T04:01:39.078Z",
          "sent": true,
          "storeOrganization": "string",
          "storeOrganizationName": "string",
          "uploadUserId": "string"
        }
      ],
      "endDate": "2023-05-18T04:01:39.078Z",
      "extendDeferment": true,
      "organizationCode": "string",
      "originAndNecessity": "string",
      "responseUnitType": "RESPONSE_UNIT",
      "startDate": "2023-05-18T04:01:39.078Z",
      "updatedBy": "string",
      "updatedDate": "2023-05-18T04:01:39.079Z"
    }
  ],
  "defermentPresents": [
    {
      "approveDate": "2022-12-31T12:12:12",
      "cancelDate": "2022-12-31T12:12:12",
      "cancelReason": "string",
      "cancelWithDebtChanges": true,
      "conclusionDeferment": "string",
      "createdBy": "string",
      "createdByName": "string",
      "createdDate": "2023-05-18T04:01:39.079Z",
      "currentActorApproved": true,
      "currentApproveActor": "ORGANIZATION",
      "customerHistory": "string",
      "customerId": "string",
      "defermentApprovalHistoryInfos": [
        {
          "approveActor": "ORGANIZATION",
          "approveDate": "string",
          "approveResult": "APPROVE",
          "approverId": "string",
          "approverName": "string",
          "defermentId": "string",
          "reason": "string"
        }
      ],
      "defermentApproverCode": "string",
      "defermentApproverName": "string",
      "defermentDays": 0,
      "defermentId": "string",
      "defermentLitigationDebtInfos": [
        {
          "appraisalPrice": 0,
          "litigationId": "LG000123",
          "outstandingBalance": 0,
          "totalDebt": 0
        },
        {
          "appraisalPrice": 0,
          "litigationId": "LG000456",
          "outstandingBalance": 0,
          "totalDebt": 0
        }
      ],
      "defermentLitigationInfos": [
        {
          "checked": true,
          "customerId": "string",
          "enabled": true,
          "legalStatus": "string",
          "litigationDate": "string",
          "litigationId": "string"
        }
      ],
      "defermentReason": "string",
      "defermentReasonCode": "string",
      "defermentReasonName": "string",
      "defermentReasonOther": "string",
      "defermentTaskStatus": "DRAFT",
      "actionFlag": true,
      "dlaApprove": true,
      "documents": [
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
          "dimsHardCopyRequestDate": "2023-05-18T04:01:39.079Z",
          "dimsHardCopyStatus": "FOUND",
          "dimsTicketBarcode": "string",
          "documentCommitmentId": "string",
          "documentDate": "2023-05-18T04:01:39.079Z",
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
          "handlingOrganization": "string",
          "hardCopyState": "SUCCESS",
          "hasOriginalCopy": true,
          "imageId": "string",
          "imageName": "หนังสือสั่งการ",
          "imageSource": "LEXS",
          "litigationCaseId": 0,
          "litigationId": "string",
          "objectId": "string",
          "objectType": "PERSON",
          "receiveDate": "string",
          "received": true,
          "rejectedReasons": [
            {
              "rejectedDate": "2023-05-18T04:01:39.079Z",
              "rejectedDocumentInfo": {
                "documentName": "string",
                "pageCount": 0
              },
              "rejectedReasonId": "string",
              "rejectedReasonName": "string",
              "rejectedRemarks": "string",
              "rejectedUserId": "string",
              "rejectedUserName": "string",
              "rejectedUserRole": "string",
              "rejectedUserSubRole": "string"
            }
          ],
          "sendDate": "string",
          "sent": true,
          "storeOrganization": "string",
          "storeOrganizationName": "string",
          "uploadUserId": "string"
        },
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
          "dimsHardCopyRequestDate": "2023-05-18T04:01:39.079Z",
          "dimsHardCopyStatus": "FOUND",
          "dimsTicketBarcode": "string",
          "documentCommitmentId": "string",
          "documentDate": "2023-05-18T04:01:39.079Z",
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
          "handlingOrganization": "string",
          "hardCopyState": "SUCCESS",
          "hasOriginalCopy": true,
          "imageId": "string",
          "imageName": "เอกสารเกี่ยวกับการชะลอดำเนินคดี",
          "imageSource": "LEXS",
          "litigationCaseId": 0,
          "litigationId": "string",
          "objectId": "string",
          "objectType": "PERSON",
          "receiveDate": "string",
          "received": true,
          "rejectedReasons": [
            {
              "rejectedDate": "2023-05-18T04:01:39.079Z",
              "rejectedDocumentInfo": {
                "documentName": "string",
                "pageCount": 0
              },
              "rejectedReasonId": "string",
              "rejectedReasonName": "string",
              "rejectedRemarks": "string",
              "rejectedUserId": "string",
              "rejectedUserName": "string",
              "rejectedUserRole": "string",
              "rejectedUserSubRole": "string"
            }
          ],
          "sendDate": "string",
          "sent": true,
          "storeOrganization": "string",
          "storeOrganizationName": "string",
          "uploadUserId": "string"
        }
      ],
      "endDate": "2023-05-18T04:01:39.079Z",
      "extendDeferment": true,
      "organizationCode": "string",
      "originAndNecessity": "string",
      "responseUnitType": "RESPONSE_UNIT",
      "startDate": "2023-05-18T04:01:39.079Z",
      "updatedBy": "string",
      "updatedDate": "2023-05-18T04:01:39.079Z"
    }
  ],
  "prescriptionDate": "string",
  "tdrContractDate": "string",
  "totalDefermentDaysAmdResponseUnit": 0,
  "totalDefermentDaysResponseUnit": 0
}

export const Add: DefermentDto =
  { "deferment": { "customerId": "37510034", "defermentType": "DEFERMENT", "startDate": "2023-06-02", "endDate": "2023-07-02", "defermentDays": 0, "cancelWithDebtChanges": false, "dlaApprove": false, "currentActorApproved": false, "documents": [{ "documentId": 0, "objectType": "DEFERMENT", "documentTemplate": { "documentTemplateId": "LEXSF079", "documentName": "บันทึกขออนุมัติชะลอดำเนินคดี", "searchType": "LEXS", "documentGroup": "DEFERMENT", "needHardCopy": false, "optional": false, "forNoticeLetter": false, "forLitigation": false, "requiredDocumentDate": true, "contentType": "application/pdf", "generatedBySystem": false }, "active": true, "documentTemplateId": "LEXSF079", "customerId": "37510034", "additionalInfo": { "allowCategory": ["KTB"] } }, { "documentId": 0, "documentTemplate": { "documentTemplateId": "LEXSD016", "documentName": "สัญญาปรับปรุงโครงสร้างหนี้", "searchType": "DIMS", "documentGroup": "ACCOUNT_CONTRACT", "needHardCopy": true, "optional": true, "forNoticeLetter": true, "forLitigation": true, "requiredDocumentDate": true, "contentType": "application/pdf", "generatedBySystem": false }, "active": false, "documentTemplateId": "LEXSD016", "customerId": "37510034" }], "responseUnitType": "AMD_RESPONSE_UNIT", "extendDeferment": false, "defermentLitigationInfos": [{ "customerId": "37510034", "litigationId": "MOCKCOL313", "litigationDate": "2022-07-25", "legalStatus": "สถานะอนุมัติให้ดำเนินคดี/รับเรื่อง", "enabled": true, "checked": false }, { "customerId": "37510034", "litigationId": "MOCKEX0001", "litigationDate": "2022-11-29", "legalStatus": "อนุมัติให้ดำเนินคดี", "enabled": true, "checked": false }, { "customerId": "37510034", "litigationId": "MOCKCOL312", "litigationDate": "2022-07-25", "legalStatus": "สถานะอนุมัติให้ดำเนินคดี/รับเรื่อง", "enabled": true, "checked": false }, { "customerId": "37510034", "litigationId": "LE2565110003", "litigationDate": "2022-11-29", "legalStatus": "อนุมัติให้ดำเนินคดี", "enabled": true, "checked": true }, { "customerId": "37510034", "litigationId": "MOCKCOL311", "litigationDate": "2022-07-25", "legalStatus": "ธนาคารยื่นฎีกาคำพิพากษาศาลอุทธรณ์", "enabled": true, "checked": false }, { "customerId": "37510034", "litigationId": "MOCKCOL309", "litigationDate": "2022-07-25", "legalStatus": "สถานะอนุมัติให้ดำเนินคดี/รับเรื่อง", "enabled": true, "checked": false }, { "customerId": "37510034", "litigationId": "MOCKCOL310", "litigationDate": "2022-07-25", "legalStatus": "สถานะอนุมัติให้ดำเนินคดี/รับเรื่อง", "enabled": true, "checked": false }, { "customerId": "37510034", "litigationId": "MOCKCOL308", "litigationDate": "2022-07-25", "legalStatus": "สถานะอนุมัติให้ดำเนินคดี/รับเรื่อง", "enabled": true, "checked": false }, { "customerId": "37510034", "litigationId": "MOCKCOL307", "litigationDate": "2022-07-25", "legalStatus": "ธนาคารยื่นอุทธรณ์คำพิพากษา", "enabled": true, "checked": false }], "defermentLitigationDebtInfos": [{ "litigationId": "MOCKCOL313" }, { "litigationId": "MOCKEX0001" }, { "litigationId": "MOCKCOL312" }, { "litigationId": "LE2565110003" }, { "litigationId": "MOCKCOL311" }, { "litigationId": "MOCKCOL309" }, { "litigationId": "MOCKCOL310" }, { "litigationId": "MOCKCOL308" }, { "litigationId": "MOCKCOL307" }], "actionFlag": true }, "defermentPresents": [], "defermentApproves": [], "defermentHistories": [], "prescriptionDate": "2026-04-20", "tdrContractDate": "2022-04-27", "totalDefermentDaysResponseUnit": 0, "totalDefermentDaysAmdResponseUnit": 0, "commitmentAccounts": [{ "accountNumber": "100048779271", "accountName": "บจ. พนัส แอสเซมบลีย์", "accountType": "PN", "litigationId": "LE2565110002" }, { "accountNumber": "100082678029", "accountType": "TFS", "litigationId": "LE2565110003" }, { "accountNumber": "100115145652", "accountName": "บจ. พนัส แอสเซมบลีย์", "accountType": "PN", "litigationId": "MOCKCOL307" }] }
