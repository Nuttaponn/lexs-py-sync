function getLitigationCaseShortDetail() {
  const be = {
    litigationId: '10059',
    cifNo: '8693140',
    responseUnitCode: '108306',
    responseUnitName: 'สำนักงานธุรกิจนานาเหนือ',
    bookingCode: '108342',
    bookingName: 'ทีมธุรกิจก่อสร้าง',
    sumLimitAmount: '0',
    mainBorrowerName: ' ',
  };
  const fe = {
    amdResponseUnitCode: '000000',
    amdResponseUnitName: 'AMD 1',
    bankruptcyFilingExpiryDate: '2033-04-13',
    bankruptcyLawyerId: 'string',
    bookingCode: '000000',
    bookingName: 'สาขาลำปาง',
    cifNo: '00000000000000000',
    civilCourtBlackCaseNo: 'ผบ0001/2565',
    civilCourtCaseDate: '2023-03-13',
    civilCourtRedCaseNo: 'ผบ0002/2565',
    firstPossibleExecutionDueDate: '2033-03-13',
    legalExecutionLawyerId: '0000/2542',
    legalExecutionLawyerFullName: 'นายสงวนศักดิ์ วังวรรณรัตน์',
    litigationId: 'MOCK_12345678',
    mainBorrowerName: 'string',
    publicAuctionLawyerId: 'string',
    responseUnitCode: '000000',
    responseUnitName: 'สำนักงานธุรกิจราชวงศ์',
    sumLimitAmount: 1000000,
  };
  return be;
}

function getLitigationCaseAccountDocuments() {
  const fe = {
    accountDocuments: [
      {
        accountNo: 'string',
        accountType: 'string',
        documents: [
          {
            active: true,
            additionalInfo: {
              allowCategory: ['string'],
            },
            attributes: {},
            commitmentAccounts: ['string'],
            customerId: 'string',
            dimsTicketBarcode: 'string',
            documentCommitmentId: 'string',
            documentDate: '2023-03-28T10:41:04.816Z',
            documentId: 0,
            documentTemplate: {
              autoMatchType: 'string',
              contentType: 'string',
              documentGroup: 'LITIGATION',
              documentName: 'string',
              documentTemplateId: 'string',
              forLitigation: true,
              forNoticeLetter: true,
              generatedBySystem: true,
              needHardCopy: true,
              optional: true,
              requiredDocumentDate: true,
              searchType: 'LEXS',
            },
            documentTemplateId: 'string',
            hasOriginalCopy: true,
            imageId: 'string',
            imageName: 'string',
            imageSource: 'LEXS',
            litigationCaseId: 0,
            litigationId: 'string',
            objectId: 'string',
            objectType: 'PERSON',
            receiveDate: '2023-03-28',
            received: true,
            sendDate: '2023-03-28',
            sent: true,
            storeOrganization: 'string',
            storeOrganizationName: 'string',
            uploadUserId: 'string',
          },
        ],
      },
    ],
  };
  const be = {
    litigationCaseDocuments: [
      {
        documentId: 849011,
        imageSource: 'LEXS',
        imageId: 'e7956640-118d-4687-9d77-25083b64a6a7',
        imageName: 'Comfirm.pdf',
        documentTemplate: {
          documentTemplateId: 'LEXSF018',
          documentName: 'เอกสารคำฟ้อง',
          searchType: 'LEXS',
          documentGroup: 'EFILING',
          needHardCopy: false,
          optional: false,
          forNoticeLetter: false,
          forLitigation: false,
          requiredDocumentDate: true,
          contentType: 'application/pdf',
          generatedBySystem: false,
        },
        active: true,
        documentDate: '2022-11-03T17:07:29+07:00',
        uploadUserId: 'K6133',
        customerId: '8693140',
        litigationId: 'LE2565100005',
        litigationCaseId: 10059,
      },
    ],
  };
  return be;
}

function getLitigationCaseDocuments() {
  return {
    accountDocuments: [
      {
        accountNo: '000006141617',
        documents: [null],
      },
      {
        accountNo: '006446015240',
        documents: [null],
      },
      {
        accountNo: '100101982666',
        accountType: 'T/L',
        documents: [
          {
            documentId: 844740,
            objectType: 'ACCOUNT_NO',
            objectId: '100101982666',
            imageSource: 'LEXS',
            imageId: 'a2a255e5-1d2c-4757-8546-b6f5d61d8096',
            imageName: 'เอกสารแนบท้ายฟ้อง.pdf',
            documentTemplate: {
              documentTemplateId: 'LEXSD018',
              documentName: 'Statement บัญชี (ตั้งแต่เปิดบัญชี  – ปัจจุบัน)',
              searchType: 'LEXS',
              documentGroup: 'ACCOUNT_COMMITMENT',
              needHardCopy: true,
              optional: false,
              forNoticeLetter: false,
              forLitigation: true,
              requiredDocumentDate: true,
              contentType: 'application/pdf',
              generatedBySystem: false,
            },
            storeOrganization: '108402',
            storeOrganizationName: 'สำนักงานธุรกิจอุดรธานี',
            hasOriginalCopy: true,
            active: true,
            documentDate: '2022-10-11T00:00:00+07:00',
            uploadUserId: '14505',
            sent: true,
            received: true,
            customerId: '8693140',
          },
          {
            documentId: 843779,
            imageSource: 'LEXS',
            imageId: '1d71397a-9e23-446c-a6f4-6158ecfc89d1',
            imageName: 'Template 1 - หนังสือบอกกล่าวทวงถาม-ผู้กู้หลัก ไม่มีทรัพย์จำนอง (4).pdf',
            documentTemplate: {
              documentTemplateId: 'LEXSD013',
              documentName: 'สัญญาสินเชื่อ',
              searchType: 'DIMS',
              documentGroup: 'ACCOUNT_CONTRACT',
              needHardCopy: true,
              optional: false,
              forNoticeLetter: true,
              forLitigation: true,
              requiredDocumentDate: true,
              contentType: 'application/pdf',
              generatedBySystem: false,
            },
            storeOrganization: '108018',
            storeOrganizationName: 'สายงานธุรกิจขนาดกลาง',
            hasOriginalCopy: true,
            active: true,
            documentDate: '2022-09-13T00:00:00+07:00',
            uploadUserId: '490475',
            documentCommitmentId: '1d71397a-9e23-446c-a6f4-6158ecfc89d1',
            customerId: '14763514',
          },
          {
            documentId: 846843,
            imageSource: 'LEXS',
            imageId: 'fd869515-ae54-46c2-91b1-579ace33c04c',
            imageName: 'messageImage_1662609875695.jpg',
            documentTemplate: {
              documentTemplateId: 'LEXSD013',
              documentName: 'สัญญาสินเชื่อ',
              searchType: 'DIMS',
              documentGroup: 'ACCOUNT_CONTRACT',
              needHardCopy: true,
              optional: false,
              forNoticeLetter: true,
              forLitigation: true,
              requiredDocumentDate: true,
              contentType: 'application/pdf',
              generatedBySystem: false,
            },
            storeOrganization: '108402',
            storeOrganizationName: 'สำนักงานธุรกิจอุดรธานี',
            hasOriginalCopy: true,
            active: true,
            documentDate: '2022-09-21T00:00:00+07:00',
            uploadUserId: '14505',
            documentCommitmentId: 'fd869515-ae54-46c2-91b1-579ace33c04c',
            sent: true,
            received: true,
            customerId: '8693140',
          },
        ],
      },
      {
        accountNo: '100103568271',
        accountType: 'Sundry TCG',
        documents: [null],
      },
      {
        accountNo: '100106259191',
        accountType: 'Sundry TCG',
        documents: [null],
      },
      {
        accountNo: '100107978413',
        accountType: 'Sundry TCG',
        documents: [null],
      },
      {
        accountNo: '100108915945',
        accountType: 'Sundry L/G',
        documents: [null],
      },
      {
        accountNo: '100110801621',
        accountType: 'Sundry TCG',
        documents: [null],
      },
      {
        accountNo: '100112720514',
        accountType: 'Sundry Insurance',
        documents: [null],
      },
      {
        accountNo: '100112928172',
        accountType: 'Sundry TCG',
        documents: [null],
      },
      {
        accountNo: '100113145138',
        accountType: 'T/L',
        documents: [null],
      },
      {
        accountNo: '100114994440',
        accountType: 'Sundry TCG',
        documents: [null],
      },
      {
        accountNo: '8357IC22000892',
        documents: [null],
      },
      {
        accountNo: '8593TC22000435',
        accountType: 'TFS',
        documents: [
          null,
          {
            documentId: 843779,
            imageSource: 'LEXS',
            imageId: '1d71397a-9e23-446c-a6f4-6158ecfc89d1',
            imageName: 'Template 1 - หนังสือบอกกล่าวทวงถาม-ผู้กู้หลัก ไม่มีทรัพย์จำนอง (4).pdf',
            documentTemplate: {
              documentTemplateId: 'LEXSD013',
              documentName: 'สัญญาสินเชื่อ',
              searchType: 'DIMS',
              documentGroup: 'ACCOUNT_CONTRACT',
              needHardCopy: true,
              optional: false,
              forNoticeLetter: true,
              forLitigation: true,
              requiredDocumentDate: true,
              contentType: 'application/pdf',
              generatedBySystem: false,
            },
            storeOrganization: '108018',
            storeOrganizationName: 'สายงานธุรกิจขนาดกลาง',
            hasOriginalCopy: true,
            active: true,
            documentDate: '2022-09-13T00:00:00+07:00',
            uploadUserId: '490475',
            documentCommitmentId: '1d71397a-9e23-446c-a6f4-6158ecfc89d1',
            customerId: '14763514',
          },
          {
            documentId: 846843,
            imageSource: 'LEXS',
            imageId: 'fd869515-ae54-46c2-91b1-579ace33c04c',
            imageName: 'messageImage_1662609875695.jpg',
            documentTemplate: {
              documentTemplateId: 'LEXSD013',
              documentName: 'สัญญาสินเชื่อ',
              searchType: 'DIMS',
              documentGroup: 'ACCOUNT_CONTRACT',
              needHardCopy: true,
              optional: false,
              forNoticeLetter: true,
              forLitigation: true,
              requiredDocumentDate: true,
              contentType: 'application/pdf',
              generatedBySystem: false,
            },
            storeOrganization: '108402',
            storeOrganizationName: 'สำนักงานธุรกิจอุดรธานี',
            hasOriginalCopy: true,
            active: true,
            documentDate: '2022-09-21T00:00:00+07:00',
            uploadUserId: '14505',
            documentCommitmentId: 'fd869515-ae54-46c2-91b1-579ace33c04c',
            sent: true,
            received: true,
            customerId: '8693140',
          },
        ],
      },
    ],
  };
}

function getLitigationCaseDocuments() {
  return {
    litigationCaseDocuments: [
      {
        documentId: 855753,
        objectType: null,
        objectId: null,
        imageSource: 'LEXS',
        imageId: '8c5c6a69-ede8-4014-b517-d7bd6f8a0599',
        imageName: 'เอกสารคำนวณภาระหนี้',
        documentTemplate: {
          documentTemplateId: 'LEXSF018',
          documentName: 'เอกสารคำฟ้อง',
          searchType: 'LEXS',
          documentGroup: 'EFILING',
          needHardCopy: false,
          optional: false,
          forNoticeLetter: false,
          forLitigation: false,
          requiredDocumentDate: false,
          contentType: 'application/pdf',
          generatedBySystem: false,
        },
        storeOrganization: '10001',
        storeOrganizationName: 'KLAW',
      },
      {
        documentId: 855725,
        objectType: null,
        objectId: null,
        imageSource: 'LEXS',
        imageId: '',
        imageName: 'เอกสารคำนวณภาระหนี้',
        documentTemplate: {
          documentTemplateId: 'LEXSF052',
          documentName: 'หนังสือรับรองคดีถึงที่สุด',
          searchType: 'LEXS',
          documentGroup: 'LITIGATION',
          needHardCopy: false,
          optional: false,
          forNoticeLetter: false,
          forLitigation: false,
          requiredDocumentDate: false,
          contentType: 'application/pdf',
          generatedBySystem: false,
        },
        storeOrganization: '10001',
        storeOrganizationName: 'KLAW',
      },
    ],
  };
}

function getLiticationCaseCollaterals() {
  return {
    collaterals: [
      {
        collateralId: '1',
        collateralType: 'ที่ดิน',
        collateralSubType: 'โฉนด',
        documentNo: '77644',
        collateralDetails: '', // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
        ownerId: '', // Join from gn_collateral_owners
        partialOwned: false,
        totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
        collateralCaseLexStatus:
          'PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)',
        collateralCmsStatus: 'P(Pledge)/R(Release)',
        seizureStatus: 'PENDING_PAYMENT',
        seizureResultFlag: null,
        seizureFailedReason: null,
        seizureFailedRemarks: null,
        ledName: 'สำนักงานบังคับคดีเชียงใหม่',
        status: 'PLEDGE',
      },
      {
        collateralId: '2',
        collateralType: 'ที่ดิน',
        collateralSubType: 'โฉนด',
        documentNo: '15963',
        collateralDetails:
          'ประเภทเอกสารสิทธิ์  โฉนด  เลขที่  77644  เลขที่ดิน/เล่มที่  123/-  หน้าสำรวจ/ระวาง  -/5136IV 8042-3  เนื้อที่  0  ไร่  0  งาน  16.00  ตร.วา ตำบล  บึงลาดสวาย  อำเภอ  ลำลูกกา  จังหวัด  ปทุมธานี',
        ownerId: '', // Join from gn_collateral_owners
        partialOwned: false,
        totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
        collateralCaseLexStatus:
          'PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)',
        collateralCmsStatus: 'P(Pledge)/R(Release)',
        seizureStatus: 'PENDING_PAYMENT',
        seizureResultFlag: null,
        seizureFailedReason: null,
        seizureFailedRemarks: null,
        ledName: 'สำนักงานบังคับคดีเชียงใหม่',
        status: 'SEIZURED',
      },
      {
        collateralId: '3',
        collateralType: 'ที่ดิน',
        collateralSubType: 'โฉนด',
        documentNo: '9999',
        collateralDetails:
          'ประเภทเอกสารสิทธิ์  โฉนด  เลขที่  77644  เลขที่ดิน/เล่มที่  123/-  หน้าสำรวจ/ระวาง  -/5136IV 8042-3  เนื้อที่  0  ไร่  0  งาน  16.00  ตร.วา ตำบล  บึงลาดสวาย  อำเภอ  ลำลูกกา  จังหวัด  ปทุมธานี',

        ownerId: '', // Join from gn_collateral_owners
        partialOwned: false,
        totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
        collateralCaseLexStatus:
          'PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)',
        collateralCmsStatus: 'P(Pledge)/R(Release)',
        seizureStatus: 'PENDING_PAYMENT',
        seizureResultFlag: null,
        seizureFailedReason: null,
        seizureFailedRemarks: null,
        ledName: 'สำนักงานบังคับคดีเชียงใหม่',
        status: 'SEIZURED',
      },
      {
        collateralId: '4',
        collateralType: 'ที่ดิน',
        collateralSubType: 'โฉนด',
        documentNo: '9999',
        collateralDetails:
          'ประเภทเอกสารสิทธิ์  โฉนด  เลขที่  77644  เลขที่ดิน/เล่มที่  123/-  หน้าสำรวจ/ระวาง  -/5136IV 8042-3  เนื้อที่  0  ไร่  0  งาน  16.00  ตร.วา ตำบล  บึงลาดสวาย  อำเภอ  ลำลูกกา  จังหวัด  ปทุมธานี',

        ownerId: '', // Join from gn_collateral_owners
        partialOwned: false,
        totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
        collateralCaseLexStatus:
          'PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)',
        collateralCmsStatus: 'P(Pledge)/R(Release)',
        seizureStatus: 'PENDING_PAYMENT',
        seizureResultFlag: null,
        seizureFailedReason: null,
        seizureFailedRemarks: null,
        ledName: 'สำนักงานบังคับคดีเชียงใหม่',
        status: 'SEIZURED',
      },
      {
        collateralId: '5',
        collateralType: 'ที่ดิน',
        collateralSubType: 'โฉนด',
        documentNo: '9999',
        collateralDetails:
          'ประเภทเอกสารสิทธิ์  โฉนด  เลขที่  77644  เลขที่ดิน/เล่มที่  123/-  หน้าสำรวจ/ระวาง  -/5136IV 8042-3  เนื้อที่  0  ไร่  0  งาน  16.00  ตร.วา ตำบล  บึงลาดสวาย  อำเภอ  ลำลูกกา  จังหวัด  ปทุมธานี',

        ownerId: '', // Join from gn_collateral_owners
        partialOwned: false,
        totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
        collateralCaseLexStatus:
          'PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)',
        collateralCmsStatus: 'P(Pledge)/R(Release)',
        seizureStatus: 'PENDING_PAYMENT',
        seizureResultFlag: null,
        seizureFailedReason: null,
        seizureFailedRemarks: null,
        ledName: 'สำนักงานบังคับคดีเชียงใหม่',
        status: 'SEIZURED',
      },
      {
        collateralId: '6',
        collateralType: 'ที่ดิน',
        collateralSubType: 'โฉนด',
        documentNo: '9999',
        collateralDetails:
          'ประเภทเอกสารสิทธิ์  โฉนด  เลขที่  77644  เลขที่ดิน/เล่มที่  123/-  หน้าสำรวจ/ระวาง  -/5136IV 8042-3  เนื้อที่  0  ไร่  0  งาน  16.00  ตร.วา ตำบล  บึงลาดสวาย  อำเภอ  ลำลูกกา  จังหวัด  ปทุมธานี',

        ownerId: '', // Join from gn_collateral_owners
        partialOwned: false,
        totalAppraisalValue: 1000000.0, // total_appraisal_value from gn_collateral
        collateralCaseLexStatus:
          'PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/ null (If CMS status = R)',
        collateralCmsStatus: 'P(Pledge)/R(Release)',
        seizureStatus: 'PENDING_PAYMENT',
        seizureResultFlag: null,
        seizureFailedReason: null,
        seizureFailedRemarks: null,
        ledName: 'สำนักงานบังคับคดีเชียงใหม่',
        status: 'SEIZURED',
      },
    ],
  };
}

function litigationCaseLeds() {
  return {
    "litigationCaseLeds": [
      {
        "ledName": "สำนักงานบังคับคดีแพ่งกรุงเทพมหานคร 1",
        "ledId": 1
      },
      {
        "ledName": "สำนักงานบังคับคดีแพ่งกรุงเทพมหานคร 2",
        "ledId": 2,
        "ledRefNoDate": "2023-05-25",
        "ledRefNoEditable": false
      },
      {
        "ledName": "สำนักงานบังคับคดีแพ่งกรุงเทพมหานคร 3",
        "ledId": 3
      },
      {
        "ledName": "สำนักงานบังคับคดีแพ่งกรุงเทพมหานคร 4",
        "ledId": 4
      },
      {
        "ledName": "สำนักงานบังคับคดีแพ่งกรุงเทพมหานคร 5",
        "ledId": 5
      },
      {
        "ledName": "สำนักงานบังคับคดีแพ่งกรุงเทพมหานคร 6",
        "ledId": 6
      },
      {
        "ledName": "สำนักงานบังคับคดีแพ่งกรุงเทพมหานคร 7",
        "ledId": 7,
        "ledRefNo": "5555",
        "ledRefNoDate": "2023-05-26",
        "ledRefNoEditable": true
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดกระบี่",
        "ledId": 8,
        "ledRefNoDate": "2023-05-25",
        "ledRefNoEditable": false
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดกาญจนบุรี",
        "ledId": 9
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดกาญจนบุรี สาขาทองผาภูมิ",
        "ledId": 10,
        "ledRefNo": "5555",
        "ledRefNoDate": "2023-05-26",
        "ledRefNoEditable": false
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดกาฬสินธุ์",
        "ledId": 11
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดกำแพงเพชร",
        "ledId": 12
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดขอนแก่น",
        "ledId": 13
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดขอนแก่น สาขาพล",
        "ledId": 14
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดขอนแก่น สาขาชุมแพ",
        "ledId": 15
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดจันทบุรี",
        "ledId": 16
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา",
        "ledId": 17
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดชลบุรี",
        "ledId": 18
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดชลบุรี สาขาพัทยา",
        "ledId": 19
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดชัยนาท",
        "ledId": 20,
        "ledRefNo": "5555",
        "ledRefNoDate": "2023-05-26",
        "ledRefNoEditable": false
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดชัยภูมิ",
        "ledId": 21
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดชัยภูมิ สาขาภูเขียว",
        "ledId": 22
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดชุมพร",
        "ledId": 23
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดชุมพร สาขาหลังสวน",
        "ledId": 24
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดเชียงราย",
        "ledId": 25,
        "ledRefNo": "5555",
        "ledRefNoDate": "2023-05-26",
        "ledRefNoEditable": false
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดเชียงราย สาขาเทิง",
        "ledId": 26
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดเชียงใหม่",
        "ledId": 27
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดเชียงใหม่ สาขาฝาง",
        "ledId": 28
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดเชียงใหม่ สาขาฮอด",
        "ledId": 29
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดตรัง",
        "ledId": 30
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดตราด",
        "ledId": 31
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดตาก",
        "ledId": 32,
        "ledRefNo": "5555",
        "ledRefNoDate": "2023-05-26",
        "ledRefNoEditable": false
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดตาก สาขาแม่สอด",
        "ledId": 33,
        "ledRefNoEditable": false
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดนครนายก",
        "ledId": 34
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดนครปฐม",
        "ledId": 35
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดนครพนม",
        "ledId": 36
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดนครราชสีมา",
        "ledId": 37
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดนครราชสีมา สาขาสีคิ้ว",
        "ledId": 38
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดนครราชสีมา สาขาบัวใหญ่",
        "ledId": 39
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดนครราชสีมา สาขาพิมาย",
        "ledId": 40
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดนครศรีธรรมราช",
        "ledId": 41
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดนครศรีธรรมราช สาขาทุ่งสง",
        "ledId": 42
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดนครศรีธรรมราช สาขาปากพนัง",
        "ledId": 43
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดนครสวรรค์",
        "ledId": 44
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดนนทบุรี",
        "ledId": 45,
        "ledRefNo": "5555",
        "ledRefNoDate": "2023-05-26",
        "ledRefNoEditable": false
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดนราธิวาส",
        "ledId": 46
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดน่าน",
        "ledId": 47
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดบึงกาฬ",
        "ledId": 48
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดบุรีรัมย์",
        "ledId": 49
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดบุรีรัมย์ สาขานางรอง",
        "ledId": 50
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดปทุมธานี",
        "ledId": 51
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดปทุมธานี สาขาธัญบุรี",
        "ledId": 52
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดประจวบคีรีขันธ์",
        "ledId": 53
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดประจวบคีรีขันธ์ สาขาหัวหิน",
        "ledId": 54
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดปราจีนบุรี",
        "ledId": 55
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดปราจีนบุรี สาขากบินทร์บุรี",
        "ledId": 56
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดปัตตานี",
        "ledId": 57
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดพระนครศรีอยุธยา",
        "ledId": 58
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดพังงา",
        "ledId": 59
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดพังงา สาขาตะกั่วป่า",
        "ledId": 60
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดพัทลุง",
        "ledId": 61
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดพิจิตร",
        "ledId": 62
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดพิษณุโลก",
        "ledId": 63
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดเพชรบุรี",
        "ledId": 64
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดเพชรบูรณ์",
        "ledId": 65
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดเพชรบูรณ์ สาขาหล่มสัก",
        "ledId": 66
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดเพชรบูรณ์ สาขาวิเชียรบุรี",
        "ledId": 67
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดแพร่",
        "ledId": 68
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดพะเยา",
        "ledId": 69
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดพะเยา สาขาเชียงคำ",
        "ledId": 70
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดภูเก็ต",
        "ledId": 71
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดมหาสารคาม",
        "ledId": 72
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดแม่ฮ่องสอน",
        "ledId": 73
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดแม่ฮ่องสอน สาขาแม่สะเรียง",
        "ledId": 74
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดมุกดาหาร",
        "ledId": 75
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดยะลา",
        "ledId": 76
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดยะลา สาขาเบตง",
        "ledId": 77
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดยโสธร",
        "ledId": 78
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดร้อยเอ็ด",
        "ledId": 79
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดระนอง",
        "ledId": 80
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดระยอง",
        "ledId": 81
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดราชบุรี",
        "ledId": 82
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดลพบุรี",
        "ledId": 83
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดลพบุรี สาขาชัยบาดาล",
        "ledId": 84
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดลำปาง",
        "ledId": 85
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดลำพูน",
        "ledId": 86
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดเลย",
        "ledId": 87
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดศรีสะเกษ",
        "ledId": 88
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดศรีสะเกษ สาขากันทรลักษ์",
        "ledId": 89
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสกลนคร",
        "ledId": 90
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสกลนคร สาขาสว่างแดนดิน",
        "ledId": 91
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสงขลา",
        "ledId": 92
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสงขลา สาขานาทวี",
        "ledId": 93
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสตูล",
        "ledId": 94
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสมุทรปราการ",
        "ledId": 95
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสมุทรสงคราม",
        "ledId": 96
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสมุทรสาคร",
        "ledId": 97
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสระแก้ว",
        "ledId": 98
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสระบุรี",
        "ledId": 99
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสิงห์บุรี",
        "ledId": 100
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสุโขทัย",
        "ledId": 101
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสุโขทัย สาขาสวรรคโลก",
        "ledId": 102
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสุพรรณบุรี",
        "ledId": 103
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสุราษฎร์ธานี",
        "ledId": 104
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสุราษฎร์ธานี สาขาเกาะสมุย",
        "ledId": 105
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสุราษฎร์ธานี สาขาไชยา",
        "ledId": 106
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสุราษฎร์ธานี สาขาเวียงสระ",
        "ledId": 107
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสุรินทร์",
        "ledId": 108
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดสุรินทร์ สาขารัตนบุรี",
        "ledId": 109
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดหนองคาย",
        "ledId": 110
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดหนองบัวลำภู",
        "ledId": 111
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดอ่างทอง",
        "ledId": 112
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดอุดรธานี",
        "ledId": 113
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดอุตรดิตถ์",
        "ledId": 114
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดอุทัยธานี",
        "ledId": 115
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดอุบลราชธานี",
        "ledId": 116
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดอุบลราชธานี สาขาเดชอุดม",
        "ledId": 117
      },
      {
        "ledName": "สำนักงานบังคับคดีจังหวัดอำนาจเจริญ",
        "ledId": 118
      }
    ]
  };
}
function getNonPledgePropertiesInfo() {
  return {
    "seizureId": "", //https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3093233860/EPIC+E05+-+Seizure+of+Property#ex_seizures
    "seizureStatus": "", //https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3093233860/EPIC+E05+-+Seizure+of+Property#ex_seizures
    "lawyerId": "lw_litigation_cases.legal_execution_lawyer_id",
    "lawyerName": "", //se_phone_book
    "recommendLawyerId": "", //ex_seizures.recommend_lawyer_id 
    "selectedAppraisalValue": 1000000.00,
    "assets": [
        {
          "assetId": 1, // lw_litigation_case_non_pledge_assets.asset_id
          "assetType": 1, //ex_non_pledge_assets.asset_type
          "assetSubType": 1, //ex_non_pledge_assets.asset_sub_type
          "assetTypeDesc": "", // ad_collateral_types.collateral_type_desc
          "assetSubTypeDesc": "", //ad_collateral_sub_types.collateral_sub_type_desc
          "documentNo": "", //ColType = 1,2 :ex_non_pledge_assets.document_no ColType = 3 : ex_non_pledge_assets.build_code ColType = 4 : ex_non_pledge_assets.room_no ColType = 5 : ex_non_pledge_assets.machine_no ถ้าไม่มีแสดง '-'
          "collateralDetails": "", // https://ktbinnovation.atlassian.net/browse/LEX2-26764 field name รายละเอียด : 1. Change [RLS>LEXS] to ex_non_pledge_assets 2. Change camel case field name to snake case
          "ownerFullName": "", // Join from ex_non_pledge_asset_owners if more than one owner found , just concatenate all name. https://ktbinnovation.atlassian.net/browse/LEX2-26764 field name เจ้าของกรรมสิทธิ์ 1. Change [RLS>LEXS] to ex_non_pledge_asset_owners 2. Change camel case field name to snake case
          "totalAppraisalValue": 1000000.00, // total_lo_appraisal_value from ex_non_pledge_assets
          "collateralCaseLexStatus": "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/", // lw_litigation_case_non_pledge_assets.non_pledge_case_lex_status
          "assentRlsStatus": "ไม่มี",  // ex_non_pledge_assets.asset_status
          "obligationStatus": "ไม่มี", // ex_non_pledge_assets.obligation_status
          "isSelected": true, // if first time select all (exclude disable) else select follow by ex_seizure_leds_non_pledge_asset
          "disabled": true, // (true when lw_litigation_case_non_pledge_assets.non_pledge_case_lex_status <> 'PLEDGE' || seizureStatus=IN_PROGRESS) otherwise false
          "seizureStatus": "null/IN_PROGRESS/COMPLETED",
          "seizuredByLitigationId": null, // lw_litigation_case_non_pledge_assets
          "seizuredByCaseId": null, //lw_litigation_case_non_pledge_assets
          "seizuredBySeizureId": "", //lw_litigation_case_non_pledge_assets
          "seizuredByParty": null, //lw_litigation_case_non_pledge_assets
          "assetDocuments":[// LEXSD211 LEXSD212 LEXSD213 LEXSD214 LEXSD215 LEXSD216 LEXSD217 LEXSD218 LEXSD219 LEXSD220 LEXSD221 LEXSD227 inquiry gn_lexs_documents where object_type="ASSET" and object_id=assetId
            {
            "documentId":111,
            "documentTemplate":{
                    "documentTemplateId":"",
                    "documentName":""
                },
            "imageSource":"",
            "imageId":"",
            "imageName":"",
            "uploadTimestamp":""
            }
          ],
        },
        {
          "assetId": 2, // lw_litigation_case_non_pledge_assets.asset_id
          "assetType": 1, //ex_non_pledge_assets.asset_type
          "assetSubType": 1, //ex_non_pledge_assets.asset_sub_type
          "assetTypeDesc": "", // ad_collateral_types.collateral_type_desc
          "assetSubTypeDesc": "", //ad_collateral_sub_types.collateral_sub_type_desc
          "documentNo": "", //ColType = 1,2 :ex_non_pledge_assets.document_no ColType = 3 : ex_non_pledge_assets.build_code ColType = 4 : ex_non_pledge_assets.room_no ColType = 5 : ex_non_pledge_assets.machine_no ถ้าไม่มีแสดง '-'
          "collateralDetails": "", // https://ktbinnovation.atlassian.net/browse/LEX2-26764 field name รายละเอียด : 1. Change [RLS>LEXS] to ex_non_pledge_assets 2. Change camel case field name to snake case
          "ownerFullName": "", // Join from ex_non_pledge_asset_owners if more than one owner found , just concatenate all name. https://ktbinnovation.atlassian.net/browse/LEX2-26764 field name เจ้าของกรรมสิทธิ์ 1. Change [RLS>LEXS] to ex_non_pledge_asset_owners 2. Change camel case field name to snake case
          "totalAppraisalValue": 1000000.00, // total_lo_appraisal_value from ex_non_pledge_assets
          "collateralCaseLexStatus": "PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/", // lw_litigation_case_non_pledge_assets.non_pledge_case_lex_status
          "assentRlsStatus": "ไม่มี",  // ex_non_pledge_assets.asset_status
          "obligationStatus": "ไม่มี", // ex_non_pledge_assets.obligation_status
          "isSelected": true, // ex_non_pledge_assets.obligation_status
          "disabled": true, // (true when lw_litigation_case_non_pledge_assets.non_pledge_case_lex_status <> 'PLEDGE' || seizureStatus=IN_PROGRESS) otherwise false
          "seizureStatus": "null/IN_PROGRESS/COMPLETED",
          "seizuredByLitigationId": null, // lw_litigation_case_non_pledge_assets
          "seizuredByCaseId": null, //lw_litigation_case_non_pledge_assets
          "seizuredBySeizureId": "", //lw_litigation_case_non_pledge_assets
          "seizuredByParty": null, //lw_litigation_case_non_pledge_assets
          "assetDocument":[
          ]
        }       
    ],
    /*
    documentType = CASE
    1. Inquiry gn_lexs_documents where litigation_case_id={caseId} and document_template_id in (LEXSF018,LEXSF010,LEXSF007,LEXSF008,LEXSF012,LEXSF052,LEXSF013)
    2. In group of (LEXSF010 หรือ LEXSF007 หรือ LEXSF008 หรือ LEXSF012), build only one object that last sequence on this group. ex. no1.get LEXSF010 and LEXSF007 then build LEXSF007
    
    documentType = PERSON
    1. Inquiry person_id from lw_litigation_case_persons where litigation_case_id={caseId}
    2. Inquiry gn_lexs_documents where object_type="PERSON" and object_id=person_id from no.1 and document_template_id in (LEXSD002-1,LEXSD002-2,LEXSD001,LEXSD007,LEXSD008,LEXSD222)
    3. foreach LEXSD002-1 LEXSD002-2 LEXSD001 can have more than one, get latest.

    documentType = ACCOUNT
    1. Inquiry gn_lexs_documents where litigation_case_id={caseId} and document_template_id in (LEXSF146,LEXSF139)
    */
    
    "processingDocument": [
        {
              "documentId":111,
              "documentTemplate":{
                      "documentTemplateId":"",
                      "documentName":""
                  },
              "imageSource":"",
              "imageId":"",
              "imageName":"",
              "uploadTimestamp":"",
              
              "documentType": "", //CASE PERSON ACCOUNT
              "cifNo":"", // for documentType=PERSON, Inquiry from gn_persons
              "taxId":"", // for documentType=PERSON, If gn_persons.person_type='INDIVIDUAL' then gn_persons.identification_no else gn_persons.tax_no
              "name":"", // for documentType=PERSON, Inquiry from gn_persons (titile+first_name+ " "+ last_name)
              "relation":"" // for documentType=PERSON, Inquiry relation from lw_litigation_case_persons
          }
    ]
  }
}

module.exports = {
  getLitigationCaseShortDetail: getLitigationCaseShortDetail(),
  getLitigationCaseAccountDocuments: getLitigationCaseAccountDocuments(),
  getLitigationCaseDocuments: getLitigationCaseDocuments(),
  getLiticationCaseCollaterals: getLiticationCaseCollaterals(),
  litigationCaseLeds: litigationCaseLeds(),
  getNonPledgePropertiesInfo: getNonPledgePropertiesInfo(),
};
