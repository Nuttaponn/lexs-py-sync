function getExecutionDocuments() {
  return {
    documentList: [
      {
        displayName: "string",
        documentId: 0,
        documentTemplateId: "string",
        documentTemplateName: "string",
        fileName: "string",
        imageId: "string",
        imageSource: "LEXS",
        reason: "string",
        resultDate: "2023-03-13",
        status: "COMPLETED",
        submitDate: "2023-03-13",
      },
    ],
  };
}

function getDebtCalculationInfo() {
  const mockBE = {
    litigationId: "LE2565100005",
    litigationCaseId: 10059,
    accounts: [
      {
        accountId: "100090836783",
        accountNo: "100016142896",
        billNo: "100090836783",
        outstandingBalance: "0",
        outstandingAccruedInterest: "0",
        interestNonBook: "0",
        lateChargeAmount: "0",
        lastPaidDate: "2022-06-21",
        bookingCode: "200046",
        bookingName: "สาขาจรัญสนิทวงศ์ 13",
        responseBranchCode: "108252",
        responseBranchName: "สำนักงานธุรกิจพระปิ่นเกล้า",
        tdrDate: "2023-06-21T00:00:00+07:00",
        marketCode: "4002",
        marketDescription: "รับซื้อตั๋วเงิน(ในท้องถิ่น)",
        subAccount: false,
        commitmentAccountNo: "100016142896",
        newSubAccount: false,
        totalDebt: "14908035.93",
        totalDebtDate: "2022-06-21",
        tdrAccount: false,
        tdrTrackingHistory: "00000000000",
      },
      {
        accountId: "100092443860",
        customerId: "19159753",
        accountNo: "100092443860",
        billNo: "100092443860",
        outstandingBalance: "0",
        outstandingAccruedInterest: "0",
        interestNonBook: "0",
        lateChargeAmount: "0",
        lastPaidDate: "2022-06-21",
        bookingCode: "200046",
        bookingName: "สาขาจรัญสนิทวงศ์ 13",
        responseBranchCode: "108252",
        responseBranchName: "สำนักงานธุรกิจพระปิ่นเกล้า",
        tdrDate: "2023-06-21T00:00:00+07:00",
        marketCode: "4046",
        marketDescription:
          "บัญชี Sub ปรับปรุงโครงสร้างหนี้เงินกู้โดยตั๋วสัญญาใช้เงิน Product Type 8003",
        subAccount: true,
        commitmentAccountNo: "100092443860",
        newSubAccount: false,
        totalDebt: "12331.93",
        totalDebtDate: "2022-06-21",
        tdrAccount: true,
        tdrTrackingHistory: "00000000000",
      },
    ],
    commitmentAccounts: [
      {
        accountNumber: "100016142896",
        accountName: "NAME_100016142896",
        accountType: "PN",
        totalDebt: "14908035.93",
        accountLinkages: [],
        totalDebtDate: "2022-06-21",
        tdrTrackingHistory: "00000000000",
      },
      {
        accountNumber: "100092443860",
        accountName: "NAME_100092443860",
        accountType: "PN",
        totalDebt: "12331.93",
        accountLinkages: [],
        totalDebtDate: "2022-06-21",
        tdrTrackingHistory: "00000000000",
      },
    ],
    summaryTotalDebt: "100.00",
    summaryTotalDebtDate: "2023-04-16",
    documentInfo: {
      accountDocuments: [],
      debtCalculationDocuments: [
        {
          documentId: 0,
          documentTemplate: {
            documentTemplateId: "LEXSF102",
            documentName: "เอกสารคำนวณหนี้เพื่อออกหมาย",
            searchType: "LEXS",
            documentGroup: "LEGAL_EXECUTION",
            needHardCopy: false,
            optional: false,
            forNoticeLetter: false,
            forLitigation: false,
            requiredDocumentDate: false,
            contentType: "xlsx",
            generatedBySystem: false,
          },
          active: false,
        },
      ],
    },
  };
  const mockFE = {
    accounts: [
      {
        accountId: "string",
        accountName: "string",
        accountNo: "111222333",
        accountNote: "string",
        accountStatus: "string",
        accountType: "OTHER",
        amountInArrears: 0,
        billNo: "string",
        blackCaseNo: "string",
        bookingCode: "string",
        bookingName: "string",
        branchCode: "string",
        branchName: "string",
        cfinal: "string",
        closeDate: "2023-03-28",
        commitmentAccountNo: "string",
        contractDate: "2023-03-28",
        customerId: "string",
        deliquencyDate: "2023-03-28",
        directDebitAccountNumber: "string",
        dpd: 0,
        estimatePrescriptionFlag: true,
        expiryDate: "2023-03-28",
        firstDisbursementDate: "2023-03-28",
        interestNonBook: 0,
        lastDisburseDate: "2023-03-28",
        lastPaidDate: "2023-03-28",
        lastTransactionDate: "2023-03-28",
        lastUpdate: "2023-03-28T10:25:28.312Z",
        lateChargeAmount: 0,
        lgAccountName: "string",
        lgAccountNumber: "string",
        limitAmount: 0,
        litigationId: "string",
        litigationStatus: "string",
        marketCode: "string",
        marketDescription: "string",
        miscCharge: 0,
        newSubAccount: true,
        noticeContractName: "string",
        openDate: "2023-03-28",
        outstandingAccruedInterest: 0,
        outstandingBalance: 0,
        partialWriteOffFlag: "string",
        partialWriteOffStatus: "string",
        prescriptionDate: "2023-03-28",
        primaryAccountNumber: "111222333",
        productType: "string",
        projectName: "string",
        redCaseNo: "string",
        responseBranchCode: "string",
        responseBranchName: "string",
        samFlag: "string",
        sourceSystem: "string",
        stageFinal: "string",
        subAccount: true,
        subAccountOption: "string",
        subAccountType: "string",
        tamcFlag: "string",
        tdrAccount: true,
        tdrContractDate: "2023-03-28",
        tdrDate: "2023-03-28T10:25:28.312Z",
        tdrStatus: "string",
        tdrTrackingHistory: "string",
        tdrTrackingResult: "string",
        totalDebt: 0,
        totalDebtDate: "2023-03-13",
        userName: "string",
        writeDate: "2023-03-28",
        writeOffStatus: "string",
      },
      {
        accountId: "string",
        accountName: "string",
        accountNo: "123456789",
        accountNote: "string",
        accountStatus: "string",
        accountType: "OTHER",
        amountInArrears: 0,
        billNo: "string",
        blackCaseNo: "string",
        bookingCode: "string",
        bookingName: "string",
        branchCode: "string",
        branchName: "string",
        cfinal: "string",
        closeDate: "2023-03-28",
        commitmentAccountNo: "string",
        contractDate: "2023-03-28",
        customerId: "string",
        deliquencyDate: "2023-03-28",
        directDebitAccountNumber: "string",
        dpd: 0,
        estimatePrescriptionFlag: true,
        expiryDate: "2023-03-28",
        firstDisbursementDate: "2023-03-28",
        interestNonBook: 0,
        lastDisburseDate: "2023-03-28",
        lastPaidDate: "2023-03-28",
        lastTransactionDate: "2023-03-28",
        lastUpdate: "2023-03-28T10:25:28.312Z",
        lateChargeAmount: 0,
        lgAccountName: "string",
        lgAccountNumber: "string",
        limitAmount: 0,
        litigationId: "string",
        litigationStatus: "string",
        marketCode: "string",
        marketDescription: "string",
        miscCharge: 0,
        newSubAccount: true,
        noticeContractName: "string",
        openDate: "2023-03-28",
        outstandingAccruedInterest: 0,
        outstandingBalance: 0,
        partialWriteOffFlag: "string",
        partialWriteOffStatus: "string",
        prescriptionDate: "2023-03-28",
        primaryAccountNumber: "123456789",
        productType: "string",
        projectName: "string",
        redCaseNo: "string",
        responseBranchCode: "string",
        responseBranchName: "string",
        samFlag: "string",
        sourceSystem: "string",
        stageFinal: "string",
        subAccount: true,
        subAccountOption: "string",
        subAccountType: "string",
        tamcFlag: "string",
        tdrAccount: true,
        tdrContractDate: "2023-03-28",
        tdrDate: "2023-03-28T10:25:28.312Z",
        tdrStatus: "string",
        tdrTrackingHistory: "string",
        tdrTrackingResult: "string",
        totalDebt: 0,
        totalDebtDate: "2023-03-13",
        userName: "string",
        writeDate: "2023-03-28",
        writeOffStatus: "string",
      },
      {
        accountId: "string",
        accountName: "string",
        accountNo: "987654321",
        accountNote: "string",
        accountStatus: "string",
        accountType: "OTHER",
        amountInArrears: 0,
        billNo: "string",
        blackCaseNo: "string",
        bookingCode: "string",
        bookingName: "string",
        branchCode: "string",
        branchName: "string",
        cfinal: "string",
        closeDate: "2023-03-28",
        commitmentAccountNo: "string",
        contractDate: "2023-03-28",
        customerId: "string",
        deliquencyDate: "2023-03-28",
        directDebitAccountNumber: "string",
        dpd: 0,
        estimatePrescriptionFlag: true,
        expiryDate: "2023-03-28",
        firstDisbursementDate: "2023-03-28",
        interestNonBook: 0,
        lastDisburseDate: "2023-03-28",
        lastPaidDate: "2023-03-28",
        lastTransactionDate: "2023-03-28",
        lastUpdate: "2023-03-28T10:25:28.312Z",
        lateChargeAmount: 0,
        lgAccountName: "string",
        lgAccountNumber: "string",
        limitAmount: 0,
        litigationId: "string",
        litigationStatus: "string",
        marketCode: "string",
        marketDescription: "string",
        miscCharge: 0,
        newSubAccount: true,
        noticeContractName: "string",
        openDate: "2023-03-28",
        outstandingAccruedInterest: 0,
        outstandingBalance: 0,
        partialWriteOffFlag: "string",
        partialWriteOffStatus: "string",
        prescriptionDate: "2023-03-28",
        primaryAccountNumber: "987654321",
        productType: "string",
        projectName: "string",
        redCaseNo: "string",
        responseBranchCode: "string",
        responseBranchName: "string",
        samFlag: "string",
        sourceSystem: "string",
        stageFinal: "string",
        subAccount: true,
        subAccountOption: "string",
        subAccountType: "string",
        tamcFlag: "string",
        tdrAccount: true,
        tdrContractDate: "2023-03-28",
        tdrDate: "2023-03-28T10:25:28.312Z",
        tdrStatus: "string",
        tdrTrackingHistory: "string",
        tdrTrackingResult: "string",
        totalDebt: 0,
        totalDebtDate: "2023-03-13",
        userName: "string",
        writeDate: "2023-03-28",
        writeOffStatus: "string",
      },
    ],
    commitmentAccounts: [
      {
        accountLinkages: ["string"],
        accountName: "NAME_100092443860",
        accountNumber: "111222333",
        accountType: "SUNDRY_LG",
        tdrTrackingHistory: "string",
        totalDebt: 0,
        totalDebtDate: "2023-03-13",
      },
      {
        accountLinkages: ["string"],
        accountName: "NAME_100092443870",
        accountNumber: "123456789",
        accountType: "OD",
        tdrTrackingHistory: "string",
        totalDebt: 1000,
        totalDebtDate: "2023-03-13",
      },
      {
        accountLinkages: ["string"],
        accountName: "NAME_100092443880",
        accountNumber: "987654321",
        accountType: "PN",
        tdrTrackingHistory: "string",
        totalDebt: 0,
        totalDebtDate: "2000",
      },
    ],
    documentInfo: {
      accountDocuments: [
        {
          active: true,
          additionalInfo: {
            allowCategory: ["string"],
          },
          attributes: {},
          commitmentAccounts: ["string"],
          customerId: "string",
          dimsTicketBarcode: "string",
          documentCommitmentId: "string",
          documentDate: "2023-03-28T10:25:28.312Z",
          documentId: 0,
          documentTemplate: {
            autoMatchType: "string",
            contentType: "string",
            documentGroup: "LITIGATION",
            documentName: "string",
            documentTemplateId: "string",
            forLitigation: true,
            forNoticeLetter: true,
            generatedBySystem: true,
            needHardCopy: true,
            optional: true,
            requiredDocumentDate: true,
            searchType: "LEXS",
          },
          documentTemplateId: "string",
          hasOriginalCopy: true,
          imageId: "string",
          imageName: "string",
          imageSource: "LEXS",
          litigationCaseId: 0,
          litigationId: "string",
          objectId: "string",
          objectType: "PERSON",
          receiveDate: "2023-03-28",
          received: true,
          sendDate: "2023-03-28",
          sent: true,
          storeOrganization: "string",
          storeOrganizationName: "string",
          uploadUserId: "string",
        },
      ],
      debtCalculationDocuments: [
        {
          active: true,
          additionalInfo: {
            allowCategory: ["string"],
          },
          attributes: {},
          commitmentAccounts: ["string"],
          customerId: "string",
          dimsTicketBarcode: "string",
          documentCommitmentId: "string",
          documentDate: "2023-03-28T10:25:28.312Z",
          documentId: 0,
          documentTemplate: {
            autoMatchType: "string",
            contentType: "string",
            documentGroup: "LITIGATION",
            documentName: "string",
            documentTemplateId: "string",
            forLitigation: true,
            forNoticeLetter: true,
            generatedBySystem: true,
            needHardCopy: true,
            optional: true,
            requiredDocumentDate: true,
            searchType: "LEXS",
          },
          documentTemplateId: "string",
          hasOriginalCopy: true,
          imageId: "string",
          imageName: "string",
          imageSource: "LEXS",
          litigationCaseId: 0,
          litigationId: "string",
          objectId: "string",
          objectType: "PERSON",
          receiveDate: "2023-03-28",
          received: true,
          sendDate: "2023-03-28",
          sent: true,
          storeOrganization: "string",
          storeOrganizationName: "string",
          uploadUserId: "string",
        },
      ],
    },
    litigationCaseId: 0,
    litigationId: "string",
    summaryTotalDebt: 0,
    summaryTotalDebtDate: "2023-03-13",
  };
  return mockBE;
}

function getLegalExecutionWritOfExecs() {
  return {
    writOfExecs: [
      {
        courtBlackCaseNo: "string",
        courtRedCaseNo: "string",
        legalExecDatetime: "2023-06-21T00:00:00+07:00",
        legalExecutionDatetime: "2023-06-21T00:00:00+07:00",
        legalExecutionId: 0,
        legalExecutionLawyerId: "string",
        legalExecutionLawyerName: "string",
        litigationCaseId: 0,
        litigationId: "string",
        powerOfAttorneyRespondDate: "2023-03-13",
        powerOfAttorneySubmitDate: "2023-03-13",
        writOfExecDebtAccountsDateTime: "2023-06-21T00:00:00+07:00",
        writOfExecDebtDocumentId: 0,
        writOfExecDebtTotalDebt: 0,
        writOfExecDebtType: "string",
        writOfExecRound: 0,
        writOfExecStatus: "R2E04-01-2B_CREATE",
        writOfExecSubmissions: [
          {
            respondCode: "string",
            respondDate: "2023-03-13",
            respondReason: "string",
            roundNumber: 0,
            submissionId: 0,
            submitDate: "2023-03-13",
          },
        ],
      },
    ],
  };
}

function getLegalExecutionWritOfExecsByLgId() {
  return {
    writOfExecs: [
      {
        courtBlackCaseNo: "string",
        courtRedCaseNo: "string",
        legalExecDatetime: "2023-06-21T00:00:00+07:00",
        legalExecutionDatetime: "2023-06-21T00:00:00+07:00",
        legalExecutionId: 0,
        legalExecutionLawyerId: "string",
        legalExecutionLawyerName: "string",
        litigationCaseId: 0,
        litigationId: "string",
        powerOfAttorneyDocumentId: 0,
        powerOfAttorneyRespondDate: "2023-03-13",
        powerOfAttorneySubmitDate: "2023-03-13",
        writOfExecDebtAccountsDateTime: "2023-06-21T00:00:00+07:00",
        writOfExecDebtDocumentId: 0,
        writOfExecDebtTotalDebt: 0,
        writOfExecDebtType: "string",
        writOfExecRound: 0,
        writOfExecStatus: "R2E04-01-2B_CREATE",
        writOfExecSubmissions: [
          {
            documentId: 0,
            respondCode: "string",
            respondDate: "2023-03-13",
            respondReason: "string",
            roundNumber: 0,
            submissionId: 0,
            submitDate: "2023-03-13",
          },
        ],
      },
    ],
  };
}

function getLegalExecutionWritOfExecsByLgIdAngLgCaseId() {
  return {
    courtBlackCaseNo: "string",
    courtRedCaseNo: "string",
    legalExecDatetime: "2023-06-21T00:00:00+07:00",
    legalExecutionDatetime: "2023-06-21T00:00:00+07:00",
    legalExecutionId: 0,
    legalExecutionLawyerId: "string",
    legalExecutionLawyerName: "string",
    litigationCaseId: 0,
    litigationId: "string",
    powerOfAttorneyDocument: {
      active: true,
      additionalInfo: {
        allowCategory: ["string"],
      },
      attributes: {},
      commitmentAccounts: ["string"],
      customerId: "string",
      dimsTicketBarcode: "string",
      documentCommitmentId: "string",
      documentDate: "2023-03-28T10:32:52.384Z",
      documentId: 0,
      documentTemplate: {
        autoMatchType: "string",
        contentType: "string",
        documentGroup: "LITIGATION",
        documentName: "string",
        documentTemplateId: "string",
        forLitigation: true,
        forNoticeLetter: true,
        generatedBySystem: true,
        needHardCopy: true,
        optional: true,
        requiredDocumentDate: true,
        searchType: "LEXS",
      },
      documentTemplateId: "string",
      hasOriginalCopy: true,
      imageId: "string",
      imageName: "string",
      imageSource: "LEXS",
      litigationCaseId: 0,
      litigationId: "string",
      objectId: "string",
      objectType: "PERSON",
      receiveDate: "2023-03-28",
      received: true,
      sendDate: "2023-03-28",
      sent: true,
      storeOrganization: "string",
      storeOrganizationName: "string",
      uploadUserId: "string",
    },
    powerOfAttorneyDocumentId: 0,
    powerOfAttorneyRespondDate: "2023-03-13",
    powerOfAttorneySubmitDate: "2023-03-13",
    writOfExecDebtAccountsDateTime: "2023-06-21T00:00:00+07:00",
    writOfExecDebtDocument: [
      {
        active: true,
        additionalInfo: {
          allowCategory: ["string"],
        },
        attributes: {},
        commitmentAccounts: ["string"],
        customerId: "string",
        dimsTicketBarcode: "string",
        documentCommitmentId: "string",
        documentDate: "2023-03-28T10:32:52.384Z",
        documentId: 0,
        documentTemplate: {
          autoMatchType: "string",
          contentType: "string",
          documentGroup: "LITIGATION",
          documentName: "string",
          documentTemplateId: "string",
          forLitigation: true,
          forNoticeLetter: true,
          generatedBySystem: true,
          needHardCopy: true,
          optional: true,
          requiredDocumentDate: true,
          searchType: "LEXS",
        },
        documentTemplateId: "string",
        hasOriginalCopy: true,
        imageId: "string",
        imageName: "string",
        imageSource: "LEXS",
        litigationCaseId: 0,
        litigationId: "string",
        objectId: "string",
        objectType: "PERSON",
        receiveDate: "2023-03-28",
        received: true,
        sendDate: "2023-03-28",
        sent: true,
        storeOrganization: "string",
        storeOrganizationName: "string",
        uploadUserId: "string",
      },
    ],
    writOfExecDebtDocumentId: 0,
    writOfExecDebtTotalDebt: 0,
    writOfExecDebtType: "string",
    writOfExecRound: 0,
    writOfExecStatus: "R2E04-01-2B_CREATE",
    writOfExecSubmissions: [
      {
        documentId: 0,
        respondCode: "string",
        respondDate: "2023-03-13",
        respondReason: "string",
        roundNumber: 0,
        submissionId: 0,
        submitDate: "2023-03-13",
        writOfExecDocument: {
          active: true,
          additionalInfo: {
            allowCategory: ["string"],
          },
          attributes: {},
          commitmentAccounts: ["string"],
          customerId: "string",
          dimsTicketBarcode: "string",
          documentCommitmentId: "string",
          documentDate: "2023-03-28T10:32:52.384Z",
          documentId: 0,
          documentTemplate: {
            autoMatchType: "string",
            contentType: "string",
            documentGroup: "LITIGATION",
            documentName: "string",
            documentTemplateId: "string",
            forLitigation: true,
            forNoticeLetter: true,
            generatedBySystem: true,
            needHardCopy: true,
            optional: true,
            requiredDocumentDate: true,
            searchType: "LEXS",
          },
          documentTemplateId: "string",
          hasOriginalCopy: true,
          imageId: "string",
          imageName: "string",
          imageSource: "LEXS",
          litigationCaseId: 0,
          litigationId: "string",
          objectId: "string",
          objectType: "PERSON",
          receiveDate: "2023-03-28",
          received: true,
          sendDate: "2023-03-28",
          sent: true,
          storeOrganization: "string",
          storeOrganizationName: "string",
          uploadUserId: "string",
        },
      },
    ],
  };
}

function getSeizurePrepTitleDeed() {
  return {
    titleDeedDocuments: [
      {
        documentId: "22222",
        documentTemplate: {
          documentTemplateId: "",
          documentName: "xxxxxx",
          optional: false,
        },
        documentNo: "no---111",
        imageSource: "",
        imageId: "xxxxx.pfd",
        relatedCollateral: {
          collateralId: "",
          collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        },
        dimDetails: {
          dimDocStatus:
            "เบิกจากห้องมั่นคง/เอกสารอยู่ที่หน่วยงานกฏหมายกรุงไทย/หน่วยงานดูแลลูกหนี้ติดตามการเบิก", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
          dimHolderCostCenter: "001000", // map directly from DIMs response
          dimHardCopyStatus: "NOT_FOUND", // if response from DIM.response_desc is in ("พบ" , "อยู่ระหว่างจัดเก็บ") => พบต้นฉบับ, if response from DIM.response_desc is "ไม่พบ" => ไม่พบต้นฉบับ
        },
        sendMethod: "TRIGGER_DIMS", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
      },
      {
        documentId: "333333",
        documentTemplate: {
          documentTemplateId: "",
          documentName: "xxxxxxx",
          optional: false,
        },
        documentNo: "no---111", // เลขที่เอกสารสิทธิ์
        imageSource: "",
        imageId: "xxxxx.pfd",
        relatedCollateral: {
          collateralId: "",
          collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        },
        dimDetails: {
          dimDocStatus:
            "เบิกจากห้องมั่นคง/เอกสารอยู่ที่หน่วยงานกฏหมายกรุงไทย/หน่วยงานดูแลลูกหนี้ติดตามการเบิก", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
          dimHolderCostCenter: "001000", // map directly from DIMs response
          dimHardCopyStatus: "NOT_FOUND", // if response from DIM.response_desc is in ("พบ" , "อยู่ระหว่างจัดเก็บ") => พบต้นฉบับ, if response from DIM.response_desc is "ไม่พบ" => ไม่พบต้นฉบับ
        },
        sendMethod: "AT_KLAW", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
      },
      {
        documentId: "333333",
        documentTemplate: {
          documentTemplateId: "",
          documentName: "xxxxxxx",
          optional: false,
        },
        documentNo: "no---111", // เลขที่เอกสารสิทธิ์
        imageSource: "",
        imageId: "xxxxx.pfd",
        relatedCollateral: {
          collateralId: "",
          collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        },
        dimDetails: {
          dimDocStatus:
            "เบิกจากห้องมั่นคง/เอกสารอยู่ที่หน่วยงานกฏหมายกรุงไทย/หน่วยงานดูแลลูกหนี้ติดตามการเบิก", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
          dimHolderCostCenter: "001000", // map directly from DIMs response
          dimHardCopyStatus: "NOT_FOUND", // if response from DIM.response_desc is in ("พบ" , "อยู่ระหว่างจัดเก็บ") => พบต้นฉบับ, if response from DIM.response_desc is "ไม่พบ" => ไม่พบต้นฉบับ
        },
        sendMethod: "AMD_MANUAL", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
      },
      {
        documentId: "333333",
        documentTemplate: {
          documentTemplateId: "1",
          documentName: "xxxxxxx",
          optional: false,
        },
        documentNo: "no---111", // เลขที่เอกสารสิทธิ์
        imageSource: "",
        imageId: "xxxxx.pfd",
        relatedCollateral: {
          collateralId: "",
          collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        },
        dimDetails: {
          dimDocStatus:
            "เบิกจากห้องมั่นคง/เอกสารอยู่ที่หน่วยงานกฏหมายกรุงไทย/หน่วยงานดูแลลูกหนี้ติดตามการเบิก", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
          dimHolderCostCenter: "001000", // map directly from DIMs response
          dimHardCopyStatus: "NOT_FOUND", // if response from DIM.response_desc is in ("พบ" , "อยู่ระหว่างจัดเก็บ") => พบต้นฉบับ, if response from DIM.response_desc is "ไม่พบ" => ไม่พบต้นฉบับ
        },
        sendMethod: "AMD_MANUAL", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
      },
      {
        documentId: "333333",
        documentTemplate: {
          documentTemplateId: "",
          documentName: "xxxxxxx",
          optional: false,
        },
        documentNo: "no---111", // เลขที่เอกสารสิทธิ์
        imageSource: "",
        imageId: "xxxxx.pfd",
        relatedCollateral: {
          collateralId: "",
          collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        },
        dimDetails: {
          dimDocStatus:
            "เบิกจากห้องมั่นคง/เอกสารอยู่ที่หน่วยงานกฏหมายกรุงไทย/หน่วยงานดูแลลูกหนี้ติดตามการเบิก", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
          dimHolderCostCenter: "001000", // map directly from DIMs response
          dimHardCopyStatus: "FOUND", // if response from DIM.response_desc is in ("พบ" , "อยู่ระหว่างจัดเก็บ") => พบต้นฉบับ, if response from DIM.response_desc is "ไม่พบ" => ไม่พบต้นฉบับ
        },
        sendMethod: "", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
      },
      {
        documentId: "1",
        documentTemplate: {
          documentTemplateId: "",
          documentName: "xxxxxxx",
          optional: false,
        },
        documentNo: "no---111", // เลขที่เอกสารสิทธิ์
        imageSource: "",
        imageId: "xxxxx.pfd",
        relatedCollateral: {
          collateralId: "2",
          collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        },
        dimDetails: {
          dimDocStatus:
            "เบิกจากห้องมั่นคง/เอกสารอยู่ที่หน่วยงานกฏหมายกรุงไทย/หน่วยงานดูแลลูกหนี้ติดตามการเบิก", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
          dimHolderCostCenter: "001000", // map directly from DIMs response
          dimHardCopyStatus: "FOUND", // if response from DIM.response_desc is in ("พบ" , "อยู่ระหว่างจัดเก็บ") => พบต้นฉบับ, if response from DIM.response_desc is "ไม่พบ" => ไม่พบต้นฉบับ
        },
        sendMethod: "", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
      },
      {
        documentId: "2",
        documentTemplate: {
          documentTemplateId: "",
          documentName: "xxxxxxx",
          optional: false,
        },
        documentNo: "no---111", // เลขที่เอกสารสิทธิ์
        imageSource: "",
        imageId: "xxxxx.pfd",
        relatedCollateral: {
          collateralId: "",
          collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        },
        dimDetails: {
          dimDocStatus:
            "เบิกจากห้องมั่นคง/เอกสารอยู่ที่หน่วยงานกฏหมายกรุงไทย/หน่วยงานดูแลลูกหนี้ติดตามการเบิก", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
          dimHolderCostCenter: "001000", // map directly from DIMs response
          dimHardCopyStatus: "FOUND", // if response from DIM.response_desc is in ("พบ" , "อยู่ระหว่างจัดเก็บ") => พบต้นฉบับ, if response from DIM.response_desc is "ไม่พบ" => ไม่พบต้นฉบับ
        },
        sendMethod: "", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
      },
      {
        documentId: "3",
        documentTemplate: {
          documentTemplateId: "",
          documentName: "xxxxxxx",
          optional: false,
        },
        documentNo: "no---111", // เลขที่เอกสารสิทธิ์
        imageSource: "",
        imageId: "xxxxx.pfd",
        relatedCollateral: {
          collateralId: "1",
          collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        },
        dimDetails: {
          dimDocStatus:
            "เบิกจากห้องมั่นคง/เอกสารอยู่ที่หน่วยงานกฏหมายกรุงไทย/หน่วยงานดูแลลูกหนี้ติดตามการเบิก", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
          dimHolderCostCenter: "001000", // map directly from DIMs response
          dimHardCopyStatus: "FOUND", // if response from DIM.response_desc is in ("พบ" , "อยู่ระหว่างจัดเก็บ") => พบต้นฉบับ, if response from DIM.response_desc is "ไม่พบ" => ไม่พบต้นฉบับ
        },
        sendMethod: "", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
      },
      {
        documentId: "333333",
        documentTemplate: {
          documentTemplateId: "",
          documentName: "xxxxxxx",
          optional: false,
        },
        documentNo: "no---111", // เลขที่เอกสารสิทธิ์
        imageSource: "",
        imageId: "xxxxx.pfd",
        relatedCollateral: {
          collateralId: "",
          collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        },
        dimDetails: {
          dimDocStatus:
            "เบิกจากห้องมั่นคง/เอกสารอยู่ที่หน่วยงานกฏหมายกรุงไทย/หน่วยงานดูแลลูกหนี้ติดตามการเบิก", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
          dimHolderCostCenter: "001000", // map directly from DIMs response
          dimHardCopyStatus: "FOUND", // if response from DIM.response_desc is in ("พบ" , "อยู่ระหว่างจัดเก็บ") => พบต้นฉบับ, if response from DIM.response_desc is "ไม่พบ" => ไม่พบต้นฉบับ
        },
        sendMethod: "", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
      },
      {
        documentId: "333333",
        documentTemplate: {
          documentTemplateId: "",
          documentName: "xxxxxxx",
          optional: false,
        },
        documentNo: "no---111", // เลขที่เอกสารสิทธิ์
        imageSource: "",
        imageId: "xxxxx.pfd",
        relatedCollateral: {
          collateralId: "",
          collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        },
        dimDetails: {
          dimDocStatus:
            "เบิกจากห้องมั่นคง/เอกสารอยู่ที่หน่วยงานกฏหมายกรุงไทย/หน่วยงานดูแลลูกหนี้ติดตามการเบิก", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
          dimHolderCostCenter: "001000", // map directly from DIMs response
          dimHardCopyStatus: "FOUND", // if response from DIM.response_desc is in ("พบ" , "อยู่ระหว่างจัดเก็บ") => พบต้นฉบับ, if response from DIM.response_desc is "ไม่พบ" => ไม่พบต้นฉบับ
        },
        sendMethod: "", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
      },
      {
        documentId: "333333",
        documentTemplate: {
          documentTemplateId: "",
          documentName: "xxxxxxx",
          optional: false,
        },
        documentNo: "no---111", // เลขที่เอกสารสิทธิ์
        imageSource: "",
        imageId: "xxxxx.pfd",
        relatedCollateral: {
          collateralId: "",
          collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        },
        dimDetails: {
          dimDocStatus:
            "เบิกจากห้องมั่นคง/เอกสารอยู่ที่หน่วยงานกฏหมายกรุงไทย/หน่วยงานดูแลลูกหนี้ติดตามการเบิก", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
          dimHolderCostCenter: "001000", // map directly from DIMs response
          dimHardCopyStatus: "NOT_FOUND", // if response from DIM.response_desc is in ("พบ" , "อยู่ระหว่างจัดเก็บ") => พบต้นฉบับ, if response from DIM.response_desc is "ไม่พบ" => ไม่พบต้นฉบับ
        },
        sendMethod: "", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
      },
      {
        documentId: "333333",
        documentTemplate: {
          documentTemplateId: "",
          documentName: "xxxxxxx",
          optional: false,
        },
        documentNo: "no---111", // เลขที่เอกสารสิทธิ์
        imageSource: "",
        imageId: "xxxxx.pfd",
        relatedCollateral: {
          collateralId: "",
          collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        },
        dimDetails: {
          dimDocStatus:
            "เบิกจากห้องมั่นคง/เอกสารอยู่ที่หน่วยงานกฏหมายกรุงไทย/หน่วยงานดูแลลูกหนี้ติดตามการเบิก", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
          dimHolderCostCenter: "001000", // map directly from DIMs response
          dimHardCopyStatus: "FOUND", // if response from DIM.response_desc is in ("พบ" , "อยู่ระหว่างจัดเก็บ") => พบต้นฉบับ, if response from DIM.response_desc is "ไม่พบ" => ไม่พบต้นฉบับ
        },
        sendMethod: "", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
      },
      {
        documentId: "333333",
        documentTemplate: {
          documentTemplateId: "",
          documentName: "xxxxxxx",
          optional: false,
        },
        documentNo: "no---111", // เลขที่เอกสารสิทธิ์
        imageSource: "",
        imageId: "xxxxx.pfd",
        relatedCollateral: {
          collateralId: "",
          collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        },
        dimDetails: {
          dimDocStatus:
            "เบิกจากห้องมั่นคง/เอกสารอยู่ที่หน่วยงานกฏหมายกรุงไทย/หน่วยงานดูแลลูกหนี้ติดตามการเบิก", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
          dimHolderCostCenter: "001000", // map directly from DIMs response
          dimHardCopyStatus: "FOUND", // if response from DIM.response_desc is in ("พบ" , "อยู่ระหว่างจัดเก็บ") => พบต้นฉบับ, if response from DIM.response_desc is "ไม่พบ" => ไม่พบต้นฉบับ
        },
        sendMethod: "", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
      },
      {
        documentId: "333333",
        documentTemplate: {
          documentTemplateId: "",
          documentName: "xxxxxxx",
          optional: false,
        },
        documentNo: "no---111", // เลขที่เอกสารสิทธิ์
        imageSource: "",
        imageId: "xxxxx.pfd",
        relatedCollateral: {
          collateralId: "",
          collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        },
        dimDetails: {
          dimDocStatus:
            "เบิกจากห้องมั่นคง/เอกสารอยู่ที่หน่วยงานกฏหมายกรุงไทย/หน่วยงานดูแลลูกหนี้ติดตามการเบิก", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
          dimHolderCostCenter: "001000", // map directly from DIMs response
          dimHardCopyStatus: "FOUND", // if response from DIM.response_desc is in ("พบ" , "อยู่ระหว่างจัดเก็บ") => พบต้นฉบับ, if response from DIM.response_desc is "ไม่พบ" => ไม่พบต้นฉบับ
        },
        sendMethod: "", // conditional logic in https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3096620209/DIMS
      },
    ],
  };
}

function getSeizurePrepCollateralAppraisal() {
  return [
    {
      documentId: "011000101",
      documentTemplate: {
        documentTemplateId: "",
        documentName: "ทะเบียนเครื่องจักร",
      },
      documentNo: "011000101", // เลขที่เอกสารสิทธิ์
      imageSource: "",
      imageId: "",
      appraisalDate: "2023-03-13",
      relatedCollateral: {
        collateralId: "111111",
      },
    },
    {
      documentId: "",
      documentTemplate: {
        documentTemplateId: "",
        documentName: "ทะเบียนเครื่องจักร",
      },
      documentNo: "011000101", // เลขที่เอกสารสิทธิ์
      imageSource: "",
      imageId: "",
      appraisalDate: "2023-03-13",
      relatedCollateral: {
        collateralId: "22222",
      },
    },
  ];
}

function getSeizurePrepPerson() {
  return {
    documents: [
      {
        documentId: "49294139",
        objectType: "PERSON",
        objectId: "00000300",
        documentTemplate: {
          documentTemplateId: "x1",
          documentName: "",
          optional: false,
        },
        imageSource: "",
        documentTemplateId: "x1",
        imageId: "",
        storeOrganization: "",
        storeOrganizationName: "",
        documentDate: "",
      },
      {
        documentId: "1900306",
        objectType: "PERSON",
        objectId: "00000301",
        documentTemplate: {
          documentTemplateId: "x2",
          documentName: "",
          optional: false,
        },
        imageSource: "",
        imageId: "",
        documentTemplateId: "x2",
        storeOrganization: "",
        storeOrganizationName: "",
        documentDate: "",
      },
      {
        documentId: "41299591",
        objectType: "PERSON",
        objectId: "41299591",
        documentTemplate: {
          documentTemplateId: "x3",
          documentName: "",
          optional: false,
        },
        documentTemplateId: "x3",
        imageSource: "",
        imageId: "",
        storeOrganization: "",
        storeOrganizationName: "",
        documentDate: "",
      },
    ],
  };
}
function getLitigationCaseCollaterals() {
  return {
    collaterals: [
      {
        collateralId: "",
        collateralType: "",
        collateralSubType: "",
        documentNo: "",
        collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        ownerId: "", // Join from gn_collateral_owners
        partialOwned: false,
        totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
        collateralCaseLexStatus:
          "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)",
        collateralCmsStatus: "P(Pledge)/R(Release)",
        disabled: true, // (true if seizure_status == "IN_PROGRESS" || collateralCmsStatus == 'R') otherwise false
        seizureStatus: "null/IN_PROGRESS/COMPLETED",
        seizuredByLitigationId: null,
        seizuredByCaseId: null,
        seizuredBySeizureId: "",
      },
      {
        collateralId: "",
        collateralType: "",
        collateralSubType: "",
        documentNo: "",
        collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        ownerId: "", // Join from gn_collateral_owners
        partialOwned: false,
        totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
        collateralCaseLexStatus:
          "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)",
        collateralCmsStatus: "P(Pledge)/R(Release)",
        disabled: true, // (true if seizure_status == "IN_PROGRESS" || collateralCmsStatus == 'R') otherwise false
        seizureStatus: "null/IN_PROGRESS/COMPLETED",
        seizuredByLitigationId: null,
        seizuredByCaseId: null,
        seizuredBySeizureId: "",
      },
    ],
    selectedAppraisalValue: 1000000.0,
  };
}

function getSeizurePrepTitleDeedDraft() {
  return {
    litigationCaseId: 12456789,
    selectedDocumentIdList: ["1", "2", "3", "4", "5"],
  };
}

function getLitigationCaseCollateralsDratf() {
  return {
    litigationCaseId: 12456789,
    collateralIdList: ["1", "2"],
  };
}

function getSeizureTitleDeed() {
  return {
    titleDeedDocuments: [
      {
        approvedDate: "2023-04-25T12:01:06.555Z",
        approvedStatus: false,
        dimHardCopyStatus: "string",
        documentId: 0,
        documentNo: "string",
        documentTemplate: {
          documentName: "string",
          documentTemplateId: "string",
          optional: false,
        },
        imageId: "string",
        imageSource: "LEXS",
        rejectedReasons: [

        ],
        relatedCollateral: {
          collateralDetails: "string",
          collateralId: "string",
        },
        sendStatus: true,
        sendMethod: 'AMD_MANUAL'
      },
      {
        approvedDate: "2023-04-25T12:01:06.555Z",
        approvedStatus: false,
        dimHardCopyStatus: "string",
        documentId: 2,
        documentNo: "string",
        documentTemplate: {
          documentName: "string",
          documentTemplateId: "string",
          optional: false,
        },
        imageId: "string",
        imageSource: "LEXS",
        rejectedReasons: [],
        relatedCollateral: {
          collateralDetails: "string",
          collateralId: "string",
        },
        sendMethod: 'AMD_MANUAL',
        sendStatus: true,
      },
      {
        approvedDate: "2023-04-25T12:01:06.555Z",
        approvedStatus: false,
        dimHardCopyStatus: "string",
        documentId: 2,
        documentNo: "string",
        documentTemplate: {
          documentName: "string",
          documentTemplateId: "string",
          optional: false,
        },
        imageId: "string",
        imageSource: "LEXS",
        rejectedReasons: [],
        relatedCollateral: {
          collateralDetails: "string",
          collateralId: "string",
        },
        sendMethod: 'AT_KLAW',
        sendStatus: true,
      },
    ],
  };
}

function getExcessDocuments() {
  return {
    excessDocuments: [
      {
        refId: 1,
        name: "A",
        number: 1,
        submittedTimestamp: "",
      },
      {
        refId: 2,
        name: "B",
        number: 2,
        submittedTimestamp: "",
      },
    ],
  };
}

function getDocumentsApprovalDraft() {
  return {
    documents: [
      {
        documentId: "",
        approve: true,
        rejectedReason: {
          reason: "",
          remarks: "",
        },
        returningDocumentInfo: {
          name: "",
          docCount: 2,
        },
      },
    ],
  };
}

function getExcution() {
  let originalResponse = {
    litigationId: "",
    litigationCases: [
      {
        litigationCaseId: "1",
        courtBlackCaseNo: "text",
        courtRedCaseNo: "text",
        litigationCaseCollateralCount: 20,
        seizures: [
          {
            createdTimestamp: "",
            seizureCollaterals: [
              {
                collateralId: "1",
                collateralType: "",
                collateralSubType: "",
                documentNo: "",
                collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
                ownerId: "", // Join from gn_collateral_owners
                partialOwned: false,
                totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
                collateralCaseLexStatus:
                  "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)",
                collateralCmsStatus: "P(Pledge)/R(Release)",
                seizureStatus: "PENDING_PAYMENT",
                seizureResultFlag: null,
                seizureFailedReason: null,
                seizureFailedRemarks: null,
              },
              {
                collateralId: "2",
                collateralType: "",
                collateralSubType: "",
                documentNo: "",
                collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
                ownerId: "", // Join from gn_collateral_owners
                partialOwned: false,
                totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
                collateralCaseLexStatus:
                  "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)",
                collateralCmsStatus: "P(Pledge)/R(Release)",
                seizureStatus: "PENDING_PAYMENT",
                seizureResultFlag: null,
                seizureFailedReason: null,
                seizureFailedRemarks: null,
              },
              {
                collateralId: "3",
                collateralType: "",
                collateralSubType: "",
                documentNo: "",
                collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
                ownerId: "", // Join from gn_collateral_owners
                partialOwned: false,
                totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
                collateralCaseLexStatus:
                  "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)",
                collateralCmsStatus: "P(Pledge)/R(Release)",
                seizureStatus: "PENDING_PAYMENT",
                seizureResultFlag: null,
                seizureFailedReason: null,
                seizureFailedRemarks: null,
              },
            ],
            seizureLeds: [
              {
                id: 1,
                seizureId: "",
                ledId: 1,
                ledName: "สำนักงานบังคับคดีกรุงเทพมหานคร 1", // JOIN from led table with ledId
                ledRefNo: "",
                ledRefNoDate: "",
                ledRefNoEditable: true,
                onsiteLawyerId: 123,
                status: "PENDING",
                createdTimestamp: "",
                completedTimestamp: "",
                seizureLedType: "MAIN",
                isDocumentsRequired: false,
                isFeePaid: false,
                documents: [],
                collaterals: [],
                isEligibleToRecordSeizureResult: false,
              },
              {
                id: 2,
                seizureId: "",
                ledId: 1,
                ledName: "สำนักงานบังคับคดีเชียงใหม่", // JOIN from led table with ledId
                ledRefNo: "",
                ledRefNoDate: "",
                ledRefNoEditable: true,
                onsiteLawyerId: 756,
                status: "PENDING",
                createdTimestamp: "",
                completedTimestamp: "",
                seizureLedType: "INTERREGION",
                isDocumentsRequired: true,
                isFeePaid: false,
                documents: [
                  // populate all required documents as template for document
                  {
                    documentTemplate: {
                      documentTemplateId: "{TEMPLATE_ID_OF คำขอยึดทรัพย์}",
                      documentName: "คำขอยึดทรัพย์",
                      optional: false,
                    },
                    imageSource: null,
                    imageId: null,
                    imageName: "",
                    documentDate: null,
                    sendChannel: null,
                  },
                  {
                    documentTemplateId: {
                      documentTemplateId:
                        "{TEMPLATE_ID_OF คำขอนำส่งต้นฉบับ เอกสารยึดทรัพย์}",
                      documentName: "คำขอนำส่งต้นฉบับ เอกสารยึดทรัพย์",
                      optional: false,
                    },
                    imageSource: null,
                    imageId: null,
                    imageName: "",
                    documentDate: null,
                    sendChannel: "SELF",
                  },
                  {
                    documentTemplateId: {
                      documentTemplateId:
                        "{TEMPLATE_ID_OF ใบแจ้งหนี้ค่าธรรมเนียมตั้งเรื่องยึดทรัพย์}",
                      documentName: "ใบแจ้งหนี้ค่าธรรมเนียมตั้งเรื่องยึดทรัพย์",
                      optional: false,
                    },
                    imageSource: null,
                    imageId: null,
                    imageName: "",
                    documentDate: null,
                    sendChannel: null,
                  },
                  {
                    documentTemplateId: {
                      documentTemplateId:
                        "{TEMPLATE_ID_OF ใบเสร็จค่าใช้จ่ายในการยึดทรัพย์}",
                      documentName: "ใบเสร็จค่าใช้จ่ายในการยึดทรัพย์",
                      optional: false,
                    },
                    imageSource: null,
                    imageId: null,
                    imageName: "",
                    documentDate: null,
                    sendChannel: null,
                  },
                  {
                    documentTemplateId: {
                      documentTemplateId: "{TEMPLATE_ID_OF รายงานการยึดทรัพย์}",
                      documentName: "รายงานการยึดทรัพย์",
                      optional: false,
                    },
                    imageSource: null,
                    imageId: null,
                    imageName: "",
                    documentDate: null,
                    sendChannel: null,
                  },
                  {
                    documentTemplateId: {
                      documentTemplateId:
                        "{TEMPLATE_ID_OF คำขอยึดทรัพย์ต่างสำนักงานบังคับคดี}",
                      documentName: "คำขอยึดทรัพย์ต่างสำนักงานบังคับคดี",
                      optional: true,
                    },
                    imageSource: null,
                    imageId: null,
                    imageName: "",
                    documentDate: null,
                    sendChannel: null,
                  },
                ],
                isEligibleToRecordSeizureResult: false,
                collaterals: [
                  {
                    collateralId: "1",
                    collateralType: "",
                    collateralSubType: "",
                    documentNo: "",
                    collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
                    ownerId: "", // Join from gn_collateral_owners
                    partialOwned: false,
                    totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
                    collateralCaseLexStatus:
                      "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)",
                    collateralCmsStatus: "P(Pledge)/R(Release)",
                    seizureStatus: "PENDING_PAYMENT",
                    seizureResultFlag: null,
                    seizureFailedReason: null,
                    seizureFailedRemarks: null,
                  },
                  {
                    collateralId: "2",
                    collateralType: "",
                    collateralSubType: "",
                    documentNo: "",
                    collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
                    ownerId: "", // Join from gn_collateral_owners
                    partialOwned: false,
                    totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
                    collateralCaseLexStatus:
                      "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)",
                    collateralCmsStatus: "P(Pledge)/R(Release)",
                    seizureStatus: "PENDING_PAYMENT",
                    seizureResultFlag: null,
                    seizureFailedReason: null,
                    seizureFailedRemarks: null,
                  },
                ],
              },
            ],
            unMappedCollaterals: [
              {
                collateralId: "3",
                collateralType: "",
                collateralSubType: "",
                documentNo: "",
                collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
                ownerId: "", // Join from gn_collateral_owners
                partialOwned: false,
                totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
                collateralCaseLexStatus:
                  "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)",
                collateralCmsStatus: "P(Pledge)/R(Release)",
                seizureStatus: "PENDING_PAYMENT",
                seizureResultFlag: null,
                seizureFailedReason: null,
                seizureFailedRemarks: null,
              },
            ],
          },
          {
            createdTimestamp: "",
            seizureCollaterals: [
              {
                collateralId: "1",
                collateralType: "",
                collateralSubType: "",
                documentNo: "",
                collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
                ownerId: "", // Join from gn_collateral_owners
                partialOwned: false,
                totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
                collateralCaseLexStatus:
                  "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)",
                collateralCmsStatus: "P(Pledge)/R(Release)",
                seizureStatus: "PENDING_PAYMENT",
                seizureResultFlag: null,
                seizureFailedReason: null,
                seizureFailedRemarks: null,
              },
              {
                collateralId: "2",
                collateralType: "",
                collateralSubType: "",
                documentNo: "",
                collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
                ownerId: "", // Join from gn_collateral_owners
                partialOwned: false,
                totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
                collateralCaseLexStatus:
                  "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)",
                collateralCmsStatus: "P(Pledge)/R(Release)",
                seizureStatus: "PENDING_PAYMENT",
                seizureResultFlag: null,
                seizureFailedReason: null,
                seizureFailedRemarks: null,
              },
              {
                collateralId: "3",
                collateralType: "",
                collateralSubType: "",
                documentNo: "",
                collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
                ownerId: "", // Join from gn_collateral_owners
                partialOwned: false,
                totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
                collateralCaseLexStatus:
                  "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)",
                collateralCmsStatus: "P(Pledge)/R(Release)",
                seizureStatus: "PENDING_PAYMENT",
                seizureResultFlag: null,
                seizureFailedReason: null,
                seizureFailedRemarks: null,
              },
            ],
            seizureLeds: [
              {
                id: 1,
                seizureId: "",
                ledId: 1,
                ledName: "สำนักงานบังคับคดีกรุงเทพมหานคร 1", // JOIN from led table with ledId
                ledRefNo: "",
                ledRefNoDate: "",
                ledRefNoEditable: true,
                onsiteLawyerId: 123,
                status: "PENDING",
                createdTimestamp: "",
                completedTimestamp: "",
                seizureLedType: "MAIN",
                isDocumentsRequired: false,
                isFeePaid: false,
                documents: [],
                collaterals: [],
                isEligibleToRecordSeizureResult: false,
              },
              {
                id: 2,
                seizureId: "",
                ledId: 1,
                ledName: "สำนักงานบังคับคดีเชียงใหม่", // JOIN from led table with ledId
                ledRefNo: "",
                ledRefNoDate: "",
                ledRefNoEditable: true,
                onsiteLawyerId: 756,
                status: "PENDING",
                createdTimestamp: "",
                completedTimestamp: "",
                seizureLedType: "INTERREGION",
                isDocumentsRequired: true,
                isFeePaid: false,
                documents: [
                  // populate all required documents as template for document
                  {
                    documentTemplate: {
                      documentTemplateId: "{TEMPLATE_ID_OF คำขอยึดทรัพย์}",
                      documentName: "คำขอยึดทรัพย์",
                      optional: false,
                    },
                    imageSource: null,
                    imageId: null,
                    imageName: "",
                    documentDate: null,
                    sendChannel: null,
                  },
                  {
                    documentTemplateId: {
                      documentTemplateId:
                        "{TEMPLATE_ID_OF คำขอนำส่งต้นฉบับ เอกสารยึดทรัพย์}",
                      documentName: "คำขอนำส่งต้นฉบับ เอกสารยึดทรัพย์",
                      optional: false,
                    },
                    imageSource: null,
                    imageId: null,
                    imageName: "",
                    documentDate: null,
                    sendChannel: "SELF",
                  },
                  {
                    documentTemplateId: {
                      documentTemplateId:
                        "{TEMPLATE_ID_OF ใบแจ้งหนี้ค่าธรรมเนียมตั้งเรื่องยึดทรัพย์}",
                      documentName: "ใบแจ้งหนี้ค่าธรรมเนียมตั้งเรื่องยึดทรัพย์",
                      optional: false,
                    },
                    imageSource: null,
                    imageId: null,
                    imageName: "",
                    documentDate: null,
                    sendChannel: null,
                  },
                  {
                    documentTemplateId: {
                      documentTemplateId:
                        "{TEMPLATE_ID_OF ใบเสร็จค่าใช้จ่ายในการยึดทรัพย์}",
                      documentName: "ใบเสร็จค่าใช้จ่ายในการยึดทรัพย์",
                      optional: false,
                    },
                    imageSource: null,
                    imageId: null,
                    imageName: "",
                    documentDate: null,
                    sendChannel: null,
                  },
                  {
                    documentTemplateId: {
                      documentTemplateId: "{TEMPLATE_ID_OF รายงานการยึดทรัพย์}",
                      documentName: "รายงานการยึดทรัพย์",
                      optional: false,
                    },
                    imageSource: null,
                    imageId: null,
                    imageName: "",
                    documentDate: null,
                    sendChannel: null,
                  },
                  {
                    documentTemplateId: {
                      documentTemplateId:
                        "{TEMPLATE_ID_OF คำขอยึดทรัพย์ต่างสำนักงานบังคับคดี}",
                      documentName: "คำขอยึดทรัพย์ต่างสำนักงานบังคับคดี",
                      optional: true,
                    },
                    imageSource: null,
                    imageId: null,
                    imageName: "",
                    documentDate: null,
                    sendChannel: null,
                  },
                ],
                isEligibleToRecordSeizureResult: false,
                collaterals: [
                  {
                    collateralId: "1",
                    collateralType: "",
                    collateralSubType: "",
                    documentNo: "",
                    collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
                    ownerId: "", // Join from gn_collateral_owners
                    partialOwned: false,
                    totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
                    collateralCaseLexStatus:
                      "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)",
                    collateralCmsStatus: "P(Pledge)/R(Release)",
                    seizureStatus: "PENDING_PAYMENT",
                    seizureResultFlag: null,
                    seizureFailedReason: null,
                    seizureFailedRemarks: null,
                  },
                  {
                    collateralId: "2",
                    collateralType: "",
                    collateralSubType: "",
                    documentNo: "",
                    collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
                    ownerId: "", // Join from gn_collateral_owners
                    partialOwned: false,
                    totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
                    collateralCaseLexStatus:
                      "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)",
                    collateralCmsStatus: "P(Pledge)/R(Release)",
                    seizureStatus: "PENDING_PAYMENT",
                    seizureResultFlag: null,
                    seizureFailedReason: null,
                    seizureFailedRemarks: null,
                  },
                ],
              },
            ],
            unMappedCollaterals: [
              {
                collateralId: "3",
                collateralType: "",
                collateralSubType: "",
                documentNo: "",
                collateralDetails: "", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
                ownerId: "", // Join from gn_collateral_owners
                partialOwned: false,
                totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
                collateralCaseLexStatus:
                  "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)",
                collateralCmsStatus: "P(Pledge)/R(Release)",
                seizureStatus: "PENDING_PAYMENT",
                seizureResultFlag: null,
                seizureFailedReason: null,
                seizureFailedRemarks: null,
              },
            ],
          },
        ],
      },
    ],
  };
  let enhanceLEX2464response = {
    "litigationId": "12345",
    "litigationCases": [
      {
        "litigationCaseId": "1",
        "courtBlackCaseNo": "ABC123",
        "courtRedCaseNo": "XYZ789",
        "litigationCaseCollateralsCount": 20,
        "litigationCaseAssetsCount": 20,
        "seizures": [
          {
            "seizureId": 1,
            "createdTimestamp": "2023-09-27T12:00:00Z",
            "seizureType": "NCOL",
            "lawyerId": "lawyer123",
            "lawyerName": "John Doe",
            "recommendLawyerId": "recommendLawyer456",
            "seizureCollaterals": [
              {
                "collateralId": 1,
                "collateralType": "Type A",
                "collateralTypeDesc": "Description for Type A",
                "collateralSubType": "Subtype B",
                "collateralSubTypeDesc": "Description for Subtype B",
                "documentNo": "DOC123",
                "collateralDetails": "Details about collateral",
                "collateralCaseLexsStatus": "Approved",
                "collateralCmsStatus": "Active",
                "ownerFullName": "Alice Johnson",
                "partialOwned": false,
                "totalAppraisalValue": 1000000,
                "seizureStatus": "PENDING_PAYMENT",
                "seizureResultFlag": null,
                "seizureFailedReason": null,
                "seizureFailedRemarks": null,
                "assetId": 1,
                "assetType": 2,
                "assetSubType": 3,
                "assetTypeDesc": "Real Estate",
                "assetSubTypeDesc": "Residential",
                "assentRlsStatus": "ไม่มี",
                "obligationStatus": "ไม่มี",
                "assetDocuments": [
                  {
                    "documentId": 111,
                    "documentTemplate": {
                      "documentTemplateId": "template123",
                      "documentName": "Asset Document 1"
                    },
                    "imageSource": "image123.jpg",
                    "imageId": "image123",
                    "imageName": "Document Image 1",
                    "uploadTimestamp": "2023-09-27T14:30:00Z"
                  }
                ]
              }
            ],
            "processingDocument": [
              {
                "documentId": 112,
                "documentTemplate": {
                  "documentTemplateId": "template124",
                  "documentName": "Processing Document 1"
                },
                "imageSource": "image124.jpg",
                "imageId": "image124",
                "imageName": "Processing Image 1",
                "uploadTimestamp": "2023-09-27T15:00:00Z",
                "documentType": "CASE",
                "cifNo": "CIF456",
                "taxId": "TAX789",
                "name": "Mary Smith",
                "relation": "Mother"
              }
            ],
            "deedDocuments": [
              {
                "documentNo": "DEED789",
                "imageSource": "deed_image.jpg",
                "imageId": "deed123",
                "imageName": "Deed Image",
                "documentTemplate": {
                  "documentTemplateId": "template125",
                  "documentName": "Deed Document 1"
                },
                "dimHardCopyStatus": "Active",
                "sendStatus": true,
                "approveStatus": true,
                "approveDate": "2023-09-27T16:00:00Z",
                "rejectedReasons": [
                  {
                    "rejectedReason": "Incomplete Information",
                    "rejectedRemarks": "Missing signature",
                    "rejectedDate": "2023-09-27T16:30:00Z",
                    "rejectedUserId": "user123",
                    "rejectedUsername": "Admin",
                    "rejectedUserRole": "Supervisor",
                    "rejectedUserSubRole": "Reviewer",
                    "returnDocumentName": "Document A",
                    "returnDocumentCount": 2
                  }
                ]
              }
            ],
            "appraisalDocuments": [
              {
                "documentNo": "APPRAISAL456",
                "imageSource": "appraisal_image.jpg",
                "imageId": "appraisal123",
                "imageName": "Appraisal Image",
                "documentTemplate": {
                  "documentTemplateId": "template126",
                  "documentName": "Appraisal Document 1"
                },
                "relatedCollateral": {
                  "collateralId": "collateral789"
                },
                "appraisalDate": "2023-09-27T17:00:00Z"
              }
            ]
          }
        ]
      }
    ]
  }

  return enhanceLEX2464response;
}

function getPersons() {
  return {
    litigationCasePersons: [
      {
        person: {
          personId: "person001",
          cifNo: "18913383",
          personType: "INDIVIDUAL/JURISTIC",
          name: "name001 last",
          title: "title",
          firstName: "name001",
          lastName: "last",
          identificationNo: "XXXXXXXXXXXX",
          telephoneNo: "", // new field in withdraw seizure
        },
        litigationCaseRelation: "MAIN_BORROWER",
      },
      {
        person: {
          personId: "person002",
          cifNo: "18913383",
          personType: "INDIVIDUAL/JURISTIC",
          name: "name002 last",
          title: "title",
          firstName: "name002",
          lastName: "last",
          identificationNo: "XXXXXXXXXXXX",
          telephoneNo: "", // new field in withdraw seizure
        },
        litigationCaseRelation: "CO_BORROWER",
      },
    ],
  };
}

module.exports = {
  getExecutionDocuments: getExecutionDocuments(),
  getDebtCalculationInfo: getDebtCalculationInfo(),
  getLegalExecutionWritOfExecs: getLegalExecutionWritOfExecs(),
  getLegalExecutionWritOfExecsByLgId: getLegalExecutionWritOfExecsByLgId(),
  getLegalExecutionWritOfExecsByLgIdAngLgCaseId:
    getLegalExecutionWritOfExecsByLgIdAngLgCaseId(),
  getSeizurePrepTitleDeed: getSeizurePrepTitleDeed(),
  getSeizurePrepCollateralAppraisal: getSeizurePrepCollateralAppraisal(),
  getSeizurePrepPerson: getSeizurePrepPerson(),
  getLitigationCaseCollaterals: getLitigationCaseCollaterals(),
  getSeizurePrepTitleDeedDraft: getSeizurePrepTitleDeedDraft(),
  getLitigationCaseCollateralsDratf: getLitigationCaseCollateralsDratf(),
  getSeizureTitleDeed: getSeizureTitleDeed(),
  getExcessDocuments: getExcessDocuments(),
  getDocumentsApprovalDraft: getDocumentsApprovalDraft(),
  getExcution: getExcution(),
  getPersons: getPersons(),
};
