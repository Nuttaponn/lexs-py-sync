function getFinancialLitigationTransactionSummary() {
  return {
    "accountCode": "0001",
    "caseType": "2022-10-10",
    "endDate": "2022-10-10",
    "financialObjectType": "EXPENSE",
    "financialType": "E11, E31",
    "maximumAmount": 0,
    "minimumAmount": 0,
    "startDate": "2022-10-10 ",
  }
}
function readConfirmationForm() {
  return {
    appointmentDate: "2022-10-10",
    blackCaseNo: "0001",
    caseDate: "2022-10-10",
    confirmImageId: "IMAGE_ID_0001",
    courtFee: 1000,
    deliveryFeeForPleadings: 100,
    documentPreparationFee: 1000
  }
}
function creditNoteSummary() {
  return {
    "financialCreditNoteList": [
      {
        "approveDate": "2022-10-10",
        "branchCode": "string",
        "branchName": "string",
        "creditNoteDescription": "string",
        "creditNoteReceiverOrgCode": "string",
        "creditNoteReceiverOrgName": "string",
        "legalStatus": "string",
        "litigationCaseId": 0,
        "litigationId": "string",
        "receiveNo": "string",
        "receiveStatus": "string",
        "receiveStatusName": "string",
        "refBranchAccount": "string",
        "responseUnitCode": "string",
        "responseUnitName": "string",
        "sendAmount": 0,
        "transferredBranchCode": "string",
        "transferredBranchName": "string"
      }
    ]
  }
}


module.exports = {
  getFinancialLitigationTransactionSummary: getFinancialLitigationTransactionSummary(),
  readConfirmationForm: readConfirmationForm(),
  creditNoteSummary: creditNoteSummary()
};
