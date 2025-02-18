function getAuctionResolutionsLatest() {
  return {
    "aucRef": 783,
    "footNote": "NPA remark",
    "deedGroupResolution": [
      {
        "deedGroupId": "1",
        "resolution": "NOT_PURCHASE",
        "saletypedesc": "ปลอดการจำนอง",
        "minPrice": 5000000.00,
        "maxPrice": 1000000.00,
        "genCbsAppval": 5500000.00,
        "effectiveDateTo": "2023-07-10",
        "colRemark": "",
        "chronicleId": "123456789"
      },
      {
        "deedGroupId": "2",
        "resolution": "PURCHASE",
        "saletypedesc": "ปลอดการจำนอง",
        "minPrice": 5000000.00,
        "maxPrice": 1000000.00,
        "genCbsAppval": 5500000.00,
        "effectiveDateTo": "2023-07-10",
        "colRemark": "",
        "chronicleId": "123456700"
      }
    ]
  };
}

function inquiryAnnouncesResponse() {
  return [
    {
      aucRef: 99,
      annoucnceDate: '2566-03-03',
      aucLot: '19/66/5/2566',
      aucSet: 'สป.2',
      fbidnum: '157',
      redCaseNo: 'ผบ.3140/2560',
      defendantName: 'นายปรีชา ทำประเสริฐ',
      plaintiffName: 'ธนาคารกรุงไทย จำกัด (มหาชน)',
      ledId: '1',
      ledName: 'สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา',
      lawCourtId: '102',
      lawCourtName: 'จังหวัดสมุทรปราการ',
      matchingStatus: 'PENDING_CASE', // PENDING_COLL
      matchingStatusName: 'รอตรวจสอบคดีความ',
      aucStatus: 'NOT_PROCEED',
      aucStatusName: 'รอตรวจสอบข้อมูลประกาศ',
      isExhibit: false,
      saleChannel: 'ขายแบบธรรมดา',
      saleLocation1:
        'จำหน่ายนัดที่ 1-6 ณ สำนักงานบังคับคดีจังหวัดสมุทรปราการ เลขที่ 411 หมู่ที่ 4 ถนน สุขุมวิท ตำบลบางปูใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ',
      saleTime1: '9.30',
      saleLocation2: null,
      saleTime2: null,
      inputDate: '25660216',
      "bidDates": [
        {
          "number": 1,
          "bidDate": "2023-06-21"
        },
        {
          "number": 2,
          "bidDate": "2023-07-12"
        },
        {
          "number": 3,
          "bidDate": "2023-07-31"
        },
        {
          "number": 4,
          "bidDate": "2023-08-23"
        },
        {
          "number": 5,
          "bidDate": "2023-09-13"
        },
        {
          "number": 6,
          "bidDate": "2023-10-04"
        }
      ],
      litigationId: 1,
      litigationCaseId: 10123,
      ledOriginalName: 'สมุทรปราการ',
      auctionMatchingLogs: [
        {
          matchingEventCode: 'ADJUST_SUBMIT',
          matchingEventName: 'แถลงแก้ไขประกาศ',
          eventTimpstamp: '',
          userId: '',
          userRole: '',
          userName: '',
          reason: '',
        },
      ],
      annoucnceDocument: [
        {
          documentId: 111,
          documentTemplate: {
            documentTemplateId: '',
            documentName: '',
          },
          imageSource: '',
          imageId: '',
          imageName: '',
          uploadTimestamp: '',
        },
      ],
      aucLedSeq: '1',
    },
    {
      aucRef: 3,
      annoucnceDate: '2566-01-01',
      aucLot: '19/66/5/2566',
      aucSet: 'สป.3',
      fbidnum: '158',
      redCaseNo: 'ผบ.3140/2560',
      defendantName: 'นายปรีชา ทำประเสริฐ',
      plaintiffName: 'ธนาคารกรุงไทย จำกัด (มหาชน)',
      ledId: '1',
      ledName: 'สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา',
      lawCourtId: '102',
      lawCourtName: 'จังหวัดสมุทรปราการ',
      matchingStatus: 'PENDING_COLL',
      matchingStatusName: 'รอตรวจสอบข้อมูลทรัพย์',
      aucStatus: 'NPA_SUBMIT',
      aucStatusName: 'เสร็จสิ้น (ส่งมติ NPA)',
      isExhibit: false,
      saleChannel: 'ขายแบบธรรมดา',
      saleLocation1:
        'จำหน่ายนัดที่ 1-6 ณ สำนักงานบังคับคดีจังหวัดสมุทรปราการ เลขที่ 411 หมู่ที่ 4 ถนน สุขุมวิท ตำบลบางปูใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ',
      saleTime1: '9.30',
      saleLocation2: null,
      saleTime2: null,
      inputDate: '25660216',
      "bidDates": [
        {
          "number": 1,
          "bidDate": "2023-06-21"
        },
        {
          "number": 2,
          "bidDate": "2023-07-12"
        },
        {
          "number": 3,
          "bidDate": "2023-07-31"
        },
        {
          "number": 4,
          "bidDate": "2023-08-23"
        },
        {
          "number": 5,
          "bidDate": "2023-09-13"
        },
        {
          "number": 6,
          "bidDate": "2023-10-04"
        }
      ],
      litigationId: 1,
      litigationCaseId: 1011,
      ledOriginalName: 'สมุทรปราการ',
      auctionMatchingLogs: [
        {
          matchingEventCode: 'ADJUST_SUBMIT',
          matchingEventName: 'แถลงแก้ไขประกาศ',
          eventTimpstamp: '',
          userId: '',
          userRole: '',
          userName: '',
          reason: '',
        },
      ],
      annoucnceDocument: [
        {
          documentId: 111,
          documentTemplate: {
            documentTemplateId: '',
            documentName: '',
          },
          imageSource: '',
          imageId: '',
          imageName: '',
          uploadTimestamp: '',
        },
      ],
      aucLedSeq: '1',
    },
    {
      aucRef: 100,
      annoucnceDate: '2566-03-03',
      aucLot: '19/66/5/2566',
      aucSet: 'สป.2',
      fbidnum: '157',
      redCaseNo: 'ผบ.3140/2560',
      defendantName: 'นายปรีชา ทำประเสริฐ',
      plaintiffName: 'ธนาคารกรุงไทย จำกัด (มหาชน)',
      ledId: '1',
      ledName: 'สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา',
      lawCourtId: '102',
      lawCourtName: 'จังหวัดสมุทรปราการ',
      matchingStatus: 'PENDING_CASE', // PENDING_COLL
      matchingStatusName: 'รอตรวจสอบคดีความ',
      aucStatus: 'NOT_PROCEED',
      aucStatusName: 'ไม่ดำเนินการ',
      isExhibit: false,
      saleChannel: 'ขายแบบธรรมดา',
      saleLocation1:
        'จำหน่ายนัดที่ 1-6 ณ สำนักงานบังคับคดีจังหวัดสมุทรปราการ เลขที่ 411 หมู่ที่ 4 ถนน สุขุมวิท ตำบลบางปูใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ',
      saleTime1: '9.30',
      saleLocation2: null,
      saleTime2: null,
      inputDate: '25660216',
      "bidDates": [
        {
          "number": 1,
          "bidDate": "2023-06-21"
        },
        {
          "number": 2,
          "bidDate": "2023-07-12"
        },
        {
          "number": 3,
          "bidDate": "2023-07-31"
        },
        {
          "number": 4,
          "bidDate": "2023-08-23"
        },
        {
          "number": 5,
          "bidDate": "2023-09-13"
        },
        {
          "number": 6,
          "bidDate": "2023-10-04"
        }
      ],
      litigationId: 1,
      litigationCaseId: 10123,
      ledOriginalName: 'สมุทรปราการ',
      auctionMatchingLogs: [
        {
          matchingEventCode: 'ADJUST_SUBMIT',
          matchingEventName: 'แถลงแก้ไขประกาศ',
          eventTimpstamp: '',
          userId: '',
          userRole: '',
          userName: '',
          reason: '',
        },
      ],
      annoucnceDocument: [
        {
          documentId: 111,
          documentTemplate: {
            documentTemplateId: '',
            documentName: '',
          },
          imageSource: '',
          imageId: '',
          imageName: '',
          uploadTimestamp: '',
        },
      ],
      aucLedSeq: '1',
    },
    {
      aucRef: 101,
      annoucnceDate: '2566-01-01',
      aucLot: '19/66/5/2566',
      aucSet: 'สป.3',
      fbidnum: '158',
      redCaseNo: 'ผบ.3140/2560',
      defendantName: 'นายปรีชา ทำประเสริฐ',
      plaintiffName: 'ธนาคารกรุงไทย จำกัด (มหาชน)',
      ledId: '1',
      ledName: 'สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา',
      lawCourtId: '102',
      lawCourtName: 'จังหวัดสมุทรปราการ',
      matchingStatus: 'PENDING_COLL',
      matchingStatusName: 'รอตรวจสอบข้อมูลทรัพย์',
      aucStatus: 'NPA_SUBMIT',
      aucStatusName: 'เสร็จสิ้น (ส่งมติ NPA)',
      isExhibit: false,
      saleChannel: 'ขายแบบธรรมดา',
      saleLocation1:
        'จำหน่ายนัดที่ 1-6 ณ สำนักงานบังคับคดีจังหวัดสมุทรปราการ เลขที่ 411 หมู่ที่ 4 ถนน สุขุมวิท ตำบลบางปูใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ',
      saleTime1: '9.30',
      saleLocation2: null,
      saleTime2: null,
      inputDate: '25660216',
      "bidDates": [
        {
          "number": 1,
          "bidDate": "2023-06-21"
        },
        {
          "number": 2,
          "bidDate": "2023-07-12"
        },
        {
          "number": 3,
          "bidDate": "2023-07-31"
        },
        {
          "number": 4,
          "bidDate": "2023-08-23"
        },
        {
          "number": 5,
          "bidDate": "2023-09-13"
        },
        {
          "number": 6,
          "bidDate": "2023-10-04"
        }
      ],
      litigationId: 1,
      litigationCaseId: 1011,
      ledOriginalName: 'สมุทรปราการ',
      auctionMatchingLogs: [
        {
          matchingEventCode: 'ADJUST_SUBMIT',
          matchingEventName: 'แถลงแก้ไขประกาศ',
          eventTimpstamp: '',
          userId: '',
          userRole: '',
          userName: '',
          reason: '',
        },
      ],
      annoucnceDocument: [
        {
          documentId: 111,
          documentTemplate: {
            documentTemplateId: '',
            documentName: '',
          },
          imageSource: '',
          imageId: '',
          imageName: '',
          uploadTimestamp: '',
        },
      ],
      aucLedSeq: '1',
    },
  ];
}

function inquiryAddAnnouncesResponse() {
  return [
    {
      aucRef: 99,
      announceDate: '2020-03-03',
      aucLot: '19/66/5/2566',
      aucSet: 'สป.2',
      fbidnum: '157',
      redCaseNo: 'ผบ.3140/2560',
      defendantName: 'นายปรีชา ทำประเสริฐ',
      plaintiffName: 'ธนาคารกรุงไทย จำกัด (มหาชน)',
      ledId: '1',
      ledName: 'สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา',
      lawCourtId: '102',
      lawCourtName: 'จังหวัดสมุทรปราการ',
      matchingStatus: 'PENDING_NEW_ANNOUNCE', // PENDING_COLL
      matchingStatusName: 'รอบันทึกประกาศ',
      aucStatus: 'NOT_PROCEED',
      aucStatusName: 'รอตรวจสอบข้อมูลประกาศ',
      isExhibit: false,
      saleChannel: 'ขายแบบธรรมดา',
      saleLocation1:
        'จำหน่ายนัดที่ 1-6 ณ สำนักงานบังคับคดีจังหวัดสมุทรปราการ เลขที่ 411 หมู่ที่ 4 ถนน สุขุมวิท ตำบลบางปูใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ',
      saleTime1: '9.30',
      saleLocation2: null,
      saleTime2: null,
      inputDate: '25660216',
      "bidDates": [
        {
          "number": 1,
          "bidDate": "2023-06-21"
        },
        {
          "number": 2,
          "bidDate": "2023-07-12"
        },
        {
          "number": 3,
          "bidDate": "2023-07-31"
        },
        {
          "number": 4,
          "bidDate": "2023-08-23"
        },
        {
          "number": 5,
          "bidDate": "2023-09-13"
        },
        {
          "number": 6,
          "bidDate": "2023-10-04"
        }
      ],
      litigationId: 1,
      litigationCaseId: 10123,
      ledOriginalName: 'สมุทรปราการ',
      auctionMatchingLogs: [
        {
          matchingEventCode: 'ADJUST_SUBMIT',
          matchingEventName: 'แถลงแก้ไขประกาศ',
          eventTimpstamp: '',
          userId: '',
          userRole: '',
          userName: '',
          reason: '',
        },
      ],
      annoucnceDocument: [
        {
          documentId: 111,
          documentTemplate: {
            documentTemplateId: '',
            documentName: '',
          },
          imageSource: '',
          imageId: '',
          imageName: '',
          uploadTimestamp: '',
        },
      ],
      aucLedSeq: '1',
    },
    {
      aucRef: 100,
      annoucnceDate: '2566-03-03',
      aucLot: '19/66/5/2566',
      aucSet: 'สป.2',
      fbidnum: '157',
      redCaseNo: 'ผบ.3140/2560',
      defendantName: 'นายปรีชา ทำประเสริฐ',
      plaintiffName: 'ธนาคารกรุงไทย จำกัด (มหาชน)',
      ledId: '1',
      ledName: 'สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา',
      lawCourtId: '102',
      lawCourtName: 'จังหวัดสมุทรปราการ',
      matchingStatus: 'PENDING_NEW_DEEDGROUP', // PENDING_COLL
      matchingStatusName: 'รอบันทึกประกาศ',
      aucStatus: 'NOT_PROCEED',
      aucStatusName: 'ไม่ดำเนินการ',
      isExhibit: false,
      saleChannel: 'ขายแบบธรรมดา',
      saleLocation1:
        'จำหน่ายนัดที่ 1-6 ณ สำนักงานบังคับคดีจังหวัดสมุทรปราการ เลขที่ 411 หมู่ที่ 4 ถนน สุขุมวิท ตำบลบางปูใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ',
      saleTime1: '9.30',
      saleLocation2: null,
      saleTime2: null,
      inputDate: '25660216',
      "bidDates": [
        {
          "number": 1,
          "bidDate": "2023-06-21"
        },
        {
          "number": 2,
          "bidDate": "2023-07-12"
        },
        {
          "number": 3,
          "bidDate": "2023-07-31"
        },
        {
          "number": 4,
          "bidDate": "2023-08-23"
        },
        {
          "number": 5,
          "bidDate": "2023-09-13"
        },
        {
          "number": 6,
          "bidDate": "2023-10-04"
        }
      ],
      litigationId: 1,
      litigationCaseId: 10123,
      ledOriginalName: 'สมุทรปราการ',
      auctionMatchingLogs: [
        {
          matchingEventCode: 'ADJUST_SUBMIT',
          matchingEventName: 'แถลงแก้ไขประกาศ',
          eventTimpstamp: '',
          userId: '',
          userRole: '',
          userName: '',
          reason: '',
        },
      ],
      annoucnceDocument: [
        {
          documentId: 111,
          documentTemplate: {
            documentTemplateId: '',
            documentName: '',
          },
          imageSource: '',
          imageId: '',
          imageName: '',
          uploadTimestamp: '',
        },
      ],
      aucLedSeq: '1',
    },
    {
      aucRef: 3,
      annoucnceDate: '2566-01-01',
      aucLot: '19/66/5/2566',
      aucSet: 'สป.3',
      fbidnum: '158',
      redCaseNo: 'ผบ.3140/2560',
      defendantName: 'นายปรีชา ทำประเสริฐ',
      plaintiffName: 'ธนาคารกรุงไทย จำกัด (มหาชน)',
      ledId: '1',
      ledName: 'สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา',
      lawCourtId: '102',
      lawCourtName: 'จังหวัดสมุทรปราการ',
      matchingStatus: 'PENDING_NEW_VALIDATE',
      matchingStatusName: 'รอตรวจสอบข้อมูลทรัพย์',
      aucStatus: 'NPA_SUBMIT',
      aucStatusName: 'เสร็จสิ้น (ส่งมติ NPA)',
      isExhibit: false,
      saleChannel: 'ขายแบบธรรมดา',
      saleLocation1:
        'จำหน่ายนัดที่ 1-6 ณ สำนักงานบังคับคดีจังหวัดสมุทรปราการ เลขที่ 411 หมู่ที่ 4 ถนน สุขุมวิท ตำบลบางปูใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ',
      saleTime1: '9.30',
      saleLocation2: null,
      saleTime2: null,
      inputDate: '25660216',
      "bidDates": [
        {
          "number": 1,
          "bidDate": "2023-06-21"
        },
        {
          "number": 2,
          "bidDate": "2023-07-12"
        },
        {
          "number": 3,
          "bidDate": "2023-07-31"
        },
        {
          "number": 4,
          "bidDate": "2023-08-23"
        },
        {
          "number": 5,
          "bidDate": "2023-09-13"
        },
        {
          "number": 6,
          "bidDate": "2023-10-04"
        }
      ],
      litigationId: 1,
      litigationCaseId: 1011,
      ledOriginalName: 'สมุทรปราการ',
      auctionMatchingLogs: [
        {
          matchingEventCode: 'ADJUST_SUBMIT',
          matchingEventName: 'แถลงแก้ไขประกาศ',
          eventTimpstamp: '',
          userId: '',
          userRole: '',
          userName: '',
          reason: '',
        },
      ],
      annoucnceDocument: [
        {
          documentId: 111,
          documentTemplate: {
            documentTemplateId: '',
            documentName: '',
          },
          imageSource: '',
          imageId: '',
          imageName: '',
          uploadTimestamp: '',
        },
      ],
      aucLedSeq: '1',
    },
  ];
}

function inquiryCreateAnnounceResponse() {
 return {
    aucRef: 101,
    matchStatus: 'PENDING_NEW_ANNOUNCE',
    caseMatchDetail: {
      caseType: 'CIVIL',
      aucLot: '11/2566',
      aucSet: 'สป.2',
      fbidnum: '157',
      seizureLedId: 'LED001',
      litigationId: 'LIT2025',
      litigationCaseId: 78901,
      originalLitigationCaseId: 78900,
      ledId: 1001,
      ledName: 'สำนักงานบังคับคดีกรุงเทพมหานคร',
      civilCourtNo: 'ศาลแพ่งกรุงเทพ',
    },
    announceMatchDetail: {
      isExhibition: true,
      saleChannel: 'ขายแบบธรรมดา',
      saleLocation1: 'Bangkok',
      saleTime1: '10:00 AM',
      saleLocation2: 'Chiang Mai',
      saleTime2: '3:00 PM',
      bidDates: [
        { bidDate: '2024-01-01', number: 1 },
        { bidDate: '2024-01-02', number: 2 },
      ],
      aucBiddingDocuments: [
        { docType: 'NOTICE', docPath: '/docs/notice1.pdf' },
        { docType: 'RESULT', docPath: '/docs/result1.pdf' },
      ],
      "document" :  { // use DocumentDto //MVP3 - 08/01/2025
        "documentId" : 0,
        "imageId" : "",
        "imageName" : "",
        "documentDate" : "",
        "documentTemplate" : {
          "documentTemplateId" : "LEXSF137",
          "documentName" : "ใบประกาศขายทอดตลาด"
        }
      },
    },
    deedMatchDetail: [
      {
        fsubbidnum: '001',
        collateralDocNo: 'COLL456',
        assetCollateralSubTypeCode: 123,
        assetCollateralSubTypeDesc: 'Residential',
        assetCollateralTypeCode: 456,
        assetCollateralTypeDesc: 'House',
        assetDescription: 'A two-story house',
        assetDetail: 'Located in central Bangkok',
        assetDocumentNo: 'DOC123',
        assetId: 789,
        assetOwners: [
          // { ownerName: 'John Doe', ownerType: 'Primary' }
        ],
        collateralId: 'C001',
        collateralMatched: true,
        deedGroupId: 1,
        deedId: 101,
        isDeedInfoValid: true,
        landtype: 'Residential',
        ledId: 1001,
        ledName: 'สำนักงานบังคับคดีกรุงเทพมหานคร',
        ledOriginalDeedno: '123456789',
        occupant: 'ผู้แจ้งการครอบครอง',
        plaintiffname: 'ABC Bank',
        remark: 'Valid deed',
        url: '/deeds/view/123',
        validationNote: 'All information validated',
        assettypedesc: 'test',
      },
      {
        fsubbidnum: '002',
        collateralDocNo: 'COLL4567',
        assetCollateralSubTypeCode: 123,
        assetCollateralSubTypeDesc: 'Residential',
        assetCollateralTypeCode: 456,
        assetCollateralTypeDesc: 'House',
        assetDescription: 'A two-story house',
        assetDetail: 'Located in central Bangkok',
        assetDocumentNo: 'DOC123',
        assetId: 789,
        assetOwners: [
          // { ownerName: 'John Doe', ownerType: 'Primary' }
        ],
        collateralId: 'C001',
        collateralMatched: true,
        deedGroupId: 1,
        deedId: 101,
        isDeedInfoValid: true,
        landtype: 'Residential',
        ledId: 1001,
        ledName: 'สำนักงานบังคับคดีกรุงเทพมหานคร',
        ledOriginalDeedno: '123456789',
        occupant: 'ผู้แจ้งการครอบครอง',
        plaintiffname: 'ABC Bank',
        remark: 'Valid deed',
        url: '/deeds/view/123',
        validationNote: 'All information validated',
        assettypedesc: 'test',
      },
      {
        fsubbidnum: '003',
        collateralDocNo: 'COLL4568',
        assetCollateralSubTypeCode: 123,
        assetCollateralSubTypeDesc: 'Residential',
        assetCollateralTypeCode: 456,
        assetCollateralTypeDesc: 'House',
        assetDescription: 'A two-story house',
        assetDetail: 'Located in central Bangkok',
        assetDocumentNo: 'DOC123',
        assetId: 789,
        assetOwners: [
          // { ownerName: 'John Doe', ownerType: 'Primary' }
        ],
        collateralId: 'C001',
        collateralMatched: true,
        deedGroupId: 1,
        deedId: 101,
        isDeedInfoValid: true,
        landtype: 'Residential',
        ledId: 1001,
        ledName: 'สำนักงานบังคับคดีกรุงเทพมหานคร',
        ledOriginalDeedno: '123456789',
        occupant: 'ผู้แจ้งการครอบครอง',
        plaintiffname: 'ABC Bank',
        remark: 'Valid deed',
        url: '/deeds/view/123',
        validationNote: 'All information validated',
        assettypedesc: 'test',
      },
      {
        fsubbidnum: '004',
        collateralDocNo: 'COLL4569',
        assetCollateralSubTypeCode: 123,
        assetCollateralSubTypeDesc: 'Residential',
        assetCollateralTypeCode: 456,
        assetCollateralTypeDesc: 'House',
        assetDescription: 'A two-story house',
        assetDetail: 'Located in central Bangkok',
        assetDocumentNo: 'DOC123',
        assetId: 789,
        assetOwners: [
          // { ownerName: 'John Doe', ownerType: 'Primary' }
        ],
        collateralId: 'C001',
        collateralMatched: true,
        deedGroupId: 1,
        deedId: 101,
        isDeedInfoValid: true,
        landtype: 'Residential',
        ledId: 1001,
        ledName: 'สำนักงานบังคับคดีกรุงเทพมหานคร',
        ledOriginalDeedno: '123456789',
        occupant: 'ผู้แจ้งการครอบครอง',
        plaintiffname: 'ABC Bank',
        remark: 'Valid deed',
        url: '/deeds/view/123',
        validationNote: 'All information validated',
        assettypedesc: 'test',
      },
      {
        fsubbidnum: '005',
        collateralDocNo: 'COLL4561',
        assetCollateralSubTypeCode: 123,
        assetCollateralSubTypeDesc: 'Residential',
        assetCollateralTypeCode: 456,
        assetCollateralTypeDesc: 'House',
        assetDescription: 'A two-story house',
        assetDetail: 'Located in central Bangkok',
        assetDocumentNo: 'DOC123',
        assetId: 789,
        assetOwners: [
          // { ownerName: 'John Doe', ownerType: 'Primary' }
        ],
        collateralId: 'C001',
        collateralMatched: true,
        deedGroupId: 1,
        deedId: 101,
        isDeedInfoValid: true,
        landtype: 'Residential',
        ledId: 1001,
        ledName: 'สำนักงานบังคับคดีกรุงเทพมหานคร',
        ledOriginalDeedno: '123456789',
        occupant: 'ผู้แจ้งการครอบครอง',
        plaintiffname: 'ABC Bank',
        remark: 'Valid deed',
        url: '/deeds/view/123',
        validationNote: 'All information validated',
        assettypedesc: 'test',
      },
      {
        fsubbidnum: '006',
        collateralDocNo: 'COLL4561',
        assetCollateralSubTypeCode: 123,
        assetCollateralSubTypeDesc: 'Residential',
        assetCollateralTypeCode: 456,
        assetCollateralTypeDesc: 'House',
        assetDescription: 'A two-story house',
        assetDetail: 'Located in central Bangkok',
        assetDocumentNo: 'DOC123',
        assetId: 789,
        assetOwners: [
          // { ownerName: 'John Doe', ownerType: 'Primary' }
        ],
        collateralId: 'C001',
        collateralMatched: true,
        deedGroupId: 1,
        deedId: 101,
        isDeedInfoValid: true,
        landtype: 'Residential',
        ledId: 1001,
        ledName: 'สำนักงานบังคับคดีกรุงเทพมหานคร',
        ledOriginalDeedno: '123456789',
        occupant: 'ผู้แจ้งการครอบครอง',
        plaintiffname: 'ABC Bank',
        remark: 'Valid deed',
        url: '/deeds/view/123',
        validationNote: 'All information validated',
        assettypedesc: 'test',
      },
      {
        fsubbidnum: '007',
        collateralDocNo: 'COLL4561',
        assetCollateralSubTypeCode: 123,
        assetCollateralSubTypeDesc: 'Residential',
        assetCollateralTypeCode: 456,
        assetCollateralTypeDesc: 'House',
        assetDescription: 'A two-story house',
        assetDetail: 'Located in central Bangkok',
        assetDocumentNo: 'DOC123',
        assetId: 789,
        assetOwners: [
          // { ownerName: 'John Doe', ownerType: 'Primary' }
        ],
        collateralId: 'C001',
        collateralMatched: true,
        deedGroupId: 1,
        deedId: 101,
        isDeedInfoValid: true,
        landtype: 'Residential',
        ledId: 1001,
        ledName: 'สำนักงานบังคับคดีกรุงเทพมหานคร',
        ledOriginalDeedno: '123456789',
        occupant: 'ผู้แจ้งการครอบครอง',
        plaintiffname: 'ABC Bank',
        remark: 'Valid deed',
        url: '/deeds/view/123',
        validationNote: 'All information validated',
        assettypedesc: 'test',
      },
      {
        fsubbidnum: '008',
        collateralDocNo: 'COLL4550',
        assetCollateralSubTypeCode: 123,
        assetCollateralSubTypeDesc: 'Residential',
        assetCollateralTypeCode: 456,
        assetCollateralTypeDesc: 'House',
        assetDescription: 'A two-story house',
        assetDetail: 'Located in central Bangkok',
        assetDocumentNo: 'DOC123',
        assetId: 789,
        assetOwners: [
          // { ownerName: 'John Doe', ownerType: 'Primary' }
        ],
        collateralId: 'C001',
        collateralMatched: true,
        deedGroupId: 1,
        deedId: 101,
        isDeedInfoValid: true,
        landtype: 'Residential',
        ledId: 1001,
        ledName: 'สำนักงานบังคับคดีกรุงเทพมหานคร',
        ledOriginalDeedno: '123456789',
        occupant: 'ผู้แจ้งการครอบครอง',
        plaintiffname: 'ABC Bank',
        remark: 'Valid deed',
        url: '/deeds/view/123',
        validationNote: 'All information validated',
        assettypedesc: 'test',
      },
      {
        fsubbidnum: '009',
        collateralDocNo: 'COLL4550',
        assetCollateralSubTypeCode: 123,
        assetCollateralSubTypeDesc: 'Residential',
        assetCollateralTypeCode: 456,
        assetCollateralTypeDesc: 'House',
        assetDescription: 'A two-story house',
        assetDetail: 'Located in central Bangkok',
        assetDocumentNo: 'DOC123',
        assetId: 789,
        assetOwners: [
          // { ownerName: 'John Doe', ownerType: 'Primary' }
        ],
        collateralId: 'C001',
        collateralMatched: true,
        deedGroupId: 1,
        deedId: 101,
        isDeedInfoValid: true,
        landtype: 'Residential',
        ledId: 1001,
        ledName: 'สำนักงานบังคับคดีกรุงเทพมหานคร',
        ledOriginalDeedno: '123456789',
        occupant: 'ผู้แจ้งการครอบครอง',
        plaintiffname: 'ABC Bank',
        remark: 'Valid deed',
        url: '/deeds/view/123',
        validationNote: 'All information validated',
        assettypedesc: 'test',
      },
      {
        fsubbidnum: '0010',
        collateralDocNo: 'COLL4551',
        assetCollateralSubTypeCode: 123,
        assetCollateralSubTypeDesc: 'Residential',
        assetCollateralTypeCode: 456,
        assetCollateralTypeDesc: 'House',
        assetDescription: 'A two-story house',
        assetDetail: 'Located in central Bangkok',
        assetDocumentNo: 'DOC123',
        assetId: 789,
        assetOwners: [
          // { ownerName: 'John Doe', ownerType: 'Primary' }
        ],
        collateralId: 'C001',
        collateralMatched: true,
        deedGroupId: 1,
        deedId: 101,
        isDeedInfoValid: true,
        landtype: 'Residential',
        ledId: 1001,
        ledName: 'สำนักงานบังคับคดีกรุงเทพมหานคร',
        ledOriginalDeedno: '123456789',
        occupant: 'ผู้แจ้งการครอบครอง',
        plaintiffname: 'ABC Bank',
        remark: 'Valid deed',
        url: '/deeds/view/123',
        validationNote: 'All information validated',
        assettypedesc: 'test',
      },
      {
        fsubbidnum: '0011',
        collateralDocNo: 'COLL4551',
        assetCollateralSubTypeCode: 123,
        assetCollateralSubTypeDesc: 'Residential',
        assetCollateralTypeCode: 456,
        assetCollateralTypeDesc: 'House',
        assetDescription: 'A two-story house',
        assetDetail: 'Located in central Bangkok',
        assetDocumentNo: 'DOC123',
        assetId: 789,
        assetOwners: [
          // { ownerName: 'John Doe', ownerType: 'Primary' }
        ],
        collateralId: 'C001',
        collateralMatched: true,
        deedGroupId: 1,
        deedId: 101,
        isDeedInfoValid: true,
        landtype: 'Residential',
        ledId: 1001,
        ledName: 'สำนักงานบังคับคดีกรุงเทพมหานคร',
        ledOriginalDeedno: '123456789',
        occupant: 'ผู้แจ้งการครอบครอง',
        plaintiffname: 'ABC Bank',
        remark: 'Valid deed',
        url: '/deeds/view/123',
        validationNote: 'All information validated',
        assettypedesc: 'test',
      },
      {
        fsubbidnum: '0012',
        collateralDocNo: 'COLL4551',
        assetCollateralSubTypeCode: 123,
        assetCollateralSubTypeDesc: 'Residential',
        assetCollateralTypeCode: 456,
        assetCollateralTypeDesc: 'House',
        assetDescription: 'A two-story house',
        assetDetail: 'Located in central Bangkok',
        assetDocumentNo: 'DOC123',
        assetId: 789,
        assetOwners: [
          // { ownerName: 'John Doe', ownerType: 'Primary' }
        ],
        collateralId: 'C0013',
        collateralMatched: true,
        deedGroupId: 1,
        deedId: 101,
        isDeedInfoValid: true,
        landtype: 'Residential',
        ledId: 1001,
        ledName: 'สำนักงานบังคับคดีกรุงเทพมหานคร',
        ledOriginalDeedno: '123456789',
        occupant: 'ผู้แจ้งการครอบครอง',
        plaintiffname: 'ABC Bank',
        remark: 'Valid deed',
        url: '/deeds/view/123',
        validationNote: 'All information validated',
        assettypedesc: 'test',
      },
    ],
    deedGroupMatchDetail: [
      {
        fsubbidnum: '001',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '002',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '003',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '004',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '005',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '006',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '007',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '008',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '009',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '010',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '011',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '012',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '013',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '014',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '015',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '016',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '017',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
      {
        fsubbidnum: '018',
        totalDeeds: 3,
        saleTypeDesc: 'Group Sale',
        reservefund: '500000',
        reservefund1: '250000',
        assetPrice2: '300000',
        assetPrice3: '400000',
        assetPrice4: '500000',
        assetPrice5: '600000',
      },
    ],
  };
}

function auctionCollaterals() {
  return {
    "auctionCollaterals": [
      {
        "aucRef": 99,
        "deedGroupId": 28,
        "deedId": 37,
        "fsubbidnum": "1",
        "assettypedesc": "ที่ดินว่างเปล่า",
        "landtype": "ตามสำเนาโฉนดเลขที่",
        "deedno": "54481",
        "assetDetail": "ตามสำเนาโฉนดเลขที่ 54481, กระโด, ยะรัง, ปัตตานี, เนื้อที่(ไร่) 0, เนื้อที่(ตารางเมตร) 0, เนื้อที่(ตารางวา) 55.9",
        "redCaseNo": "ผบ.1274\/2561",
        "saletypedesc": "ปลอดภาระผูกพัน",
        "debtname": null,
        "ownername": "นายกามัล เจ๊ะกา",
        "plaintiffname": "ธนาคารกรุงไทย จำกัด (มหาชน)",
        "defendantname": "นายกามัล เจ๊ะกา ที่ 1 กับพวกรวม 5 คน",
        "occupant": "ผู้ถือกรรมสิทธิ์",
        "ledid": "906",
        "ledname": "จังหวัดปัตตานี",
        "ledOriginalName": "ปัตตานี",
        "remark": "ขายรวม (แปลงที่ 1 - 4) รวม 4 แปลง,  ราคาประเมินรวม  70,840.- บาท",
        "url": "http:\/\/asset.led.go.th\/newbidreg\/asset_open_reg.asp?law_suit_year=2561&Law_Court_ID=906&deed_no=54481&addrno=-&law_suit_no=%BC%BA.1274",
        "collateralMatched": true,
        "collateralMatchTimestamp": null,
        "collateralTypeCode": null,
        "collateralSubTypeCode": null,
        "collateralDocumentNo": null,
        //"npaResultId" : null, //not use
        "isDeedInfoValid": null,
        "validationNote": null,
        "value1": "25660303",
        "collateralId": null,
        "lexsCollateralTypeDesc": null,
        "lexsCollateralSubTypeDesc": null,
        "lexsCollateralsDescription": null,
        "lexsPlaintiffname": null,
        "lexsOwnerFullName": null,
        "lexsDefendant": [
          {
            "personId": "",
            "personName": "",
            "relation": ""
          }
        ]
      },
      {
        "aucRef": 27,
        "deedGroupId": 28,
        "deedId": 18,
        "fsubbidnum": "1",
        "assettypedesc": "ที่ดินว่างเปล่า",
        "landtype": "ตามสำเนาโฉนดเลขที่",
        "deedno": "54479",
        "assetDetail": "ตามสำเนาโฉนดเลขที่ 54479, กระโด, ยะรัง, ปัตตานี, เนื้อที่(ไร่) 0, เนื้อที่(ตารางเมตร) 0, เนื้อที่(ตารางวา) 11.6",
        "redCaseNo": "ผบ.1274\/2561",
        "saletypedesc": "ปลอดภาระผูกพัน",
        "debtname": null,
        "ownername": "นายกามัล เจ๊ะกา",
        "plaintiffname": "ธนาคารกรุงไทย จำกัด (มหาชน)",
        "defendantname": "นายกามัล เจ๊ะกา ที่ 1 กับพวกรวม 5 คน",
        "occupant": "ผู้ถือกรรมสิทธิ์",
        "ledid": "906",
        "ledname": "จังหวัดปัตตานี",
        "ledOriginalName": "ปัตตานี",
        "remark": "ขายรวม (แปลงที่ 1 - 4) รวม 4 แปลง,  ราคาประเมินรวม  70,840.- บาท",
        "url": "http:\/\/asset.led.go.th\/newbidreg\/asset_open_reg.asp?law_suit_year=2561&Law_Court_ID=906&deed_no=54479&addrno=-&law_suit_no=%BC%BA.1274",
        "collateralMatched": false,
        "collateralMatchTimestamp": null,
        "collateralTypeCode": null,
        "collateralSubTypeCode": null,
        "collateralDocumentNo": null,
        "npaResultId": null,
        "isDeedInfoValid": null,
        "validationNote": null,
        "value1": "25660303",
        "collateralId": null,
        "lexsCollateralTypeDesc": null,
        "lexsCollateralSubTypeDesc": null,
        "lexsCollateralsDescription": null,
        "lexsPlaintiffname": null,
        "lexsOwnerFullName": null,
        "lexsDefendant": [
          {
            "personId": "",
            "personName": "",
            "relation": ""
          }
        ]
      }
    ]
  };
}

function auctionLexsSeizures() {
  return {
    "auctionLexsSeizures": [
      {
        "litigationId": "LE2565090065",
        "litigationCaseId": 10184,
        "originalLitigationCaseId": 10184,
        "seizureId": 10,
        "seizureLedId": 37,
        "redCaseNo": "คพ R19\/2499",
        "ledId": 14,
        "ledName": "สำนักงานบังคับคดีจังหวัดขอนแก่น สาขาพล",
        "civilCourtNo": "100345",
        "civilCourtName": "ศาลแพ่ง",
        "seizureLedType": "INTER-REGION",
        "seizureTimestamp": "2023-05-15T17:07:44.023Z"
      },
      {
        "litigationId": "LE2565090066",
        "litigationCaseId": 10185,
        "originalLitigationCaseId": 10185,
        "seizureId": 11,
        "seizureLedId": 38,
        "redCaseNo": "ผบ.3140/2560",
        "ledId": 14,
        "ledName": "สำนักงานบังคับคดีจังหวัดขอนแก่น สาขาพล",
        "civilCourtNo": "100345",
        "civilCourtName": "ศาลแพ่ง",
        "seizureLedType": "INTER-REGION",
        "seizureTimestamp": "2023-05-15T17:07:44.023Z"
      }
    ]
  };
}

function auctionLexsCollaterals() {
  return {
    "lexsCollaterals": [
      {
        "collateralId": "184099",
        "lexsRedCaseNo": "คพ R19/2499",
        "ledId": "14",
        "ledName": "สำนักงานบังคับคดีจังหวัดขอนแก่น สาขาพล",
        "lexsCollateralTypeCode": "1",
        "lexsCollateralTypeDesc": "ที่ดิน",
        "lexsCollateralSubTypeCode": "1",
        "lexsCollateralSubTypeDesc": "โฉนด",
        "lexsDocumentNo": "102504",
        "lexsCollateralsDescription": "test",
        "lexsPlaintiffname": "ธนาคารกรุงไทย จำกัด (มหาชน)",
        "lexsOwnerFullName": "IBM Thailand, KTB Bank, MR.MOCKFIRST MOCKLAST",
        "lexsDefendant": [
          {
            "personId": "231920",
            "personName": "MOCKTITLEMOCKFIRST MOCKLAST",
            "relation": "MAIN_BORROWER"
          }
        ]
      },
      {
        "collateralId": "184100",
        "lexsRedCaseNo": "คพ R19/2499",
        "ledId": "14",
        "ledName": "สำนักงานบังคับคดีจังหวัดขอนแก่น สาขาพล",
        "lexsCollateralTypeCode": "1",
        "lexsCollateralTypeDesc": "ที่ดิน",
        "lexsCollateralSubTypeCode": "1",
        "lexsCollateralSubTypeDesc": "โฉนด",
        "lexsDocumentNo": "102504",
        "lexsCollateralsDescription": "test",
        "lexsPlaintiffname": "ธนาคารกรุงไทย จำกัด (มหาชน)",
        "lexsOwnerFullName": "IBM Thailand, KTB Bank, MR.MOCKFIRST MOCKLAST",
        "lexsDefendant": [
          {
            "personId": "231920",
            "personName": "MOCKTITLEMOCKFIRST MOCKLAST",
            "relation": "MAIN_BORROWER"
          }
        ]
      }
    ]
  };
}

function inquiryLedInfo() {
  return {
    "ledInfo": [
      {
        "ledId": 8,
        "ledName": "สำนักงานบังคับคดีจังหวัดสมุทรสาคร",
        "courtName": "ศาลแขวงตลิ่งชัน",
        "litigationCaseId": 506,
        "blackCaseNo": "มมE15/2566",
        "redCaseNo": "ผบ.2812/2556",
        "publicAuctionLawyerId": "K6501",
        "lawyerName": "อนัญญา จั่นเพชร",
        "totalAnnounces": 0
      },
      {
        "ledId": 8,
        "ledName": "สำนักงานบังคับคดีจังหวัดเชียงใหม่",
        "courtName": "ศาลแขวงตลิ่งชัน",
        "litigationCaseId": 507,
        "blackCaseNo": "มมE17/2567",
        "redCaseNo": "ผบ.2817/2557",
        "publicAuctionLawyerId": "K6502",
        "lawyerName": "อัมไพ ทำของดี",
        "totalAnnounces": 3
      },
      {
        "ledId": 9,
        "ledName": "สำนักงานบังคับคดีจังหวัดนนทบุรี",
        "courtName": "ศาลแขวงตลิ่งชัน",
        "litigationCaseId": 508,
        "blackCaseNo": "มมE18/2568",
        "redCaseNo": "ผบ.2818/2558",
        "publicAuctionLawyerId": "K6503",
        "lawyerName": "ทวีศักดิ์ แก้ววารี",
        "totalAnnounces": 8
      }
    ]
  };
};

function inquirySeizureInfo() {
  return {
    "seizureInfos": [
      {
        "ledId": 8,
        "litigationCaseId": 506,
        "seizureTimestamp": "10/05/2566",
        "ledType": "MAIN",
        "auctionLawyerName": "นางสาว ทนาย ที่รับผิดชอบ",
        "courtName": "ศาลแพ่งกรุงเทพใต้"
      },
      {
        "ledId": 8,
        "litigationCaseId": 506,
        "seizureTimestamp": "11/06/2566",
        "ledType": "INTER-REGION",
        "auctionLawyerName": "นางสาว ทนาย ที่รับผิดชอบ",
        "courtName": "ศาลแพ่งนนทบุรี"
      }
    ]
  };
}

function inquiryAuctionExpense() {
  return {
    "ledid": 1,
    "ledName": "สำนักงาน",
    "courtName": "ศาล 2",
    "redCaseNo": "123/123",
    "blackCaseNo": "456/456",
    "totalSumAmount": 1000.00,
    "additionalExpenseSubmit": [
      {
        "date": "22/02/2023",
        "expenseRequestType": "หมายเรียกวางเงินเพิ่ม",
        "detail": "เบิกค่าใช้จ่าย",
        "expenseAmount": 500,
        "statusCode": "R2E09-02-3B_PAYMENT_COMPLETE_PENDING_SAVE",
        "statusName": "ชำระเงินสำเร็จรอบันทึกผล"
      },
      {
        "date": "23/02/2023",
        "expenseRequestType": "คำสั่งเจ้าพนักงานบังคับคดี",
        "detail": "เบิกค่าใช้จ่าย",
        "expenseAmount": 500,
        "statusCode": "R2E09-02-3B_PENDING_PAYMENT",
        "statusName": "รอชำระเงิน"
      }
    ]
  };
}

function getAuctionLitigationAnnouncesProcess() {
  return [
    {
      "aucRef": 99,
      "announceDate": "2023-03-03",
      "aucLot": "19/66/5/2566",
      "aucSet": "สป.2",
      "fbidnum": "157",
      "aucLedSeq": "1",
      "litigationId": "text",
      "litigationCaseId": 999,
      "originalLitigationCaseId": 999,
      "redCaseNo": "ผบ.3140/2560",
      "defendantName": "นายปรีชา ทำประเสริฐ",
      "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
      "ledId": null,
      "ledName": null,
      "lawCourtId": "102",
      "lawCourtName": "จังหวัดสมุทรปราการ",
      "aucStatus": "NPA_SUBMIT",
      "isExhibit": false,
      "saleChannel": "ขายแบบธรรมดา"
    },
    {
      "aucRef": 2,
      "announceDate": "2023-03-03",
      "aucLot": "19/66/5/2566",
      "aucSet": "สป.2",
      "fbidnum": "157",
      "aucLedSeq": "2",
      "litigationId": "text",
      "litigationCaseId": 999,
      "originalLitigationCaseId": 999,
      "redCaseNo": "ผบ.3140/2560",
      "defendantName": "นายปรีชา ทำประเสริฐ",
      "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
      "ledId": null,
      "ledName": null,
      "lawCourtId": "102",
      "lawCourtName": "จังหวัดสมุทรปราการ",
      "aucStatus": "NPA_RECEIVE",
      "isExhibit": false,
      "saleChannel": "ขายแบบธรรมดา"
    },
    {
      "aucRef": 3,
      "announceDate": "2023-03-03",
      "aucLot": "19/66/5/2566",
      "aucSet": "สป.2",
      "fbidnum": "157",
      "aucLedSeq": "3",
      "litigationId": "text",
      "litigationCaseId": 999,
      "originalLitigationCaseId": 999,
      "redCaseNo": "ผบ.3140/2560",
      "defendantName": "นายปรีชา ทำประเสริฐ",
      "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
      "ledId": null,
      "ledName": null,
      "lawCourtId": "102",
      "lawCourtName": "จังหวัดสมุทรปราการ",
      "aucStatus": "ADJUST_SUBMIT",
      "isExhibit": false,
      "saleChannel": "ขายแบบธรรมดา"
    },
    {
      "aucRef": 3,
      "announceDate": "2023-03-03",
      "aucLot": "19/66/5/2566",
      "aucSet": "สป.2",
      "fbidnum": "157",
      "aucLedSeq": "4",
      "litigationId": "text",
      "litigationCaseId": 999,
      "originalLitigationCaseId": 999,
      "redCaseNo": "ผบ.3140/2560",
      "defendantName": "นายปรีชา ทำประเสริฐ",
      "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
      "ledId": null,
      "ledName": null,
      "lawCourtId": "102",
      "lawCourtName": "จังหวัดสมุทรปราการ",
      "aucStatus": "AUCTION",
      "isExhibit": false,
      "saleChannel": "ขายแบบธรรมดา"
    },
    {
      "aucRef": 5,
      "announceDate": "2023-03-03",
      "aucLot": "19/66/5/2566",
      "aucSet": "สป.2",
      "fbidnum": "157",
      "aucLedSeq": "4",
      "litigationId": "text",
      "litigationCaseId": 999,
      "originalLitigationCaseId": 999,
      "redCaseNo": "ผบ.3140/2560",
      "defendantName": "นายปรีชา ทำประเสริฐ",
      "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
      "ledId": null,
      "ledName": null,
      "lawCourtId": "102",
      "lawCourtName": "จังหวัดสมุทรปราการ",
      "aucStatus": "MOCK_AS_STATUS_PENDING",
      "isExhibit": false,
      "saleChannel": "ขายแบบธรรมดา"
    },
    {
      "aucRef": 6,
      "announceDate": "2023-03-03",
      "aucLot": "19/66/5/2566",
      "aucSet": "สป.2",
      "fbidnum": "157",
      "aucLedSeq": "4",
      "litigationId": "text",
      "litigationCaseId": 999,
      "originalLitigationCaseId": 999,
      "redCaseNo": "ผบ.3140/2560",
      "defendantName": "นายปรีชา ทำประเสริฐ",
      "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
      "ledId": null,
      "ledName": null,
      "lawCourtId": "102",
      "lawCourtName": "จังหวัดสมุทรปราการ",
      "aucStatus": "MOCK_AS_STATUS_CORRECT_PENDING",
      "isExhibit": false,
      "saleChannel": "ขายแบบธรรมดา"
    },
    {
      "aucRef": 7,
      "announceDate": "2023-03-03",
      "aucLot": "19/66/5/2566",
      "aucSet": "สป.2",
      "fbidnum": "157",
      "aucLedSeq": "4",
      "litigationId": "text",
      "litigationCaseId": 999,
      "originalLitigationCaseId": 999,
      "redCaseNo": "ผบ.3140/2560",
      "defendantName": "นายปรีชา ทำประเสริฐ",
      "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
      "ledId": null,
      "ledName": null,
      "lawCourtId": "102",
      "lawCourtName": "จังหวัดสมุทรปราการ",
      "aucStatus": "MOCK_AS_STATUS_PENDING_APPROVAL",
      "isExhibit": false,
      "saleChannel": "ขายแบบธรรมดา"
    },
    {
      "aucRef": 8,
      "announceDate": "2023-03-03",
      "aucLot": "19/66/5/2566",
      "aucSet": "สป.2",
      "fbidnum": "157",
      "aucLedSeq": "4",
      "litigationId": "text",
      "litigationCaseId": 999,
      "originalLitigationCaseId": 999,
      "redCaseNo": "ผบ.3140/2560",
      "defendantName": "นายปรีชา ทำประเสริฐ",
      "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
      "ledId": null,
      "ledName": null,
      "lawCourtId": "102",
      "lawCourtName": "จังหวัดสมุทรปราการ",
      "aucStatus": "MOCK_AS_STATUS_CONSIDERATION",
      "isExhibit": false,
      "saleChannel": "ขายแบบธรรมดา"
    },
    {
      "aucRef": 9,
      "announceDate": "2023-03-03",
      "aucLot": "19/66/5/2566",
      "aucSet": "สป.2",
      "fbidnum": "157",
      "aucLedSeq": "4",
      "litigationId": "text",
      "litigationCaseId": 999,
      "originalLitigationCaseId": 999,
      "redCaseNo": "ผบ.3140/2560",
      "defendantName": "นายปรีชา ทำประเสริฐ",
      "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
      "ledId": null,
      "ledName": null,
      "lawCourtId": "102",
      "lawCourtName": "จังหวัดสมุทรปราการ",
      "aucStatus": "MOCK_AS_STATUS_UPLOAD_RECEIPT",
      "isExhibit": false,
      "saleChannel": "ขายแบบธรรมดา"
    },
    {
      "aucRef": 10,
      "announceDate": "2023-03-03",
      "aucLot": "19/66/5/2566",
      "aucSet": "สป.2",
      "fbidnum": "157",
      "aucLedSeq": "4",
      "litigationId": "text",
      "litigationCaseId": 999,
      "originalLitigationCaseId": 999,
      "redCaseNo": "ผบ.3140/2560",
      "defendantName": "นายปรีชา ทำประเสริฐ",
      "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
      "ledId": null,
      "ledName": null,
      "lawCourtId": "102",
      "lawCourtName": "จังหวัดสมุทรปราการ",
      "aucStatus": "MOCK_AS_STATUS_RECEIPT_CORRECT_PENDING",
      "isExhibit": false,
      "saleChannel": "ขายแบบธรรมดา"
    },
    {
      "aucRef": 11,
      "announceDate": "2023-03-03",
      "aucLot": "19/66/5/2566",
      "aucSet": "สป.2",
      "fbidnum": "157",
      "aucLedSeq": "4",
      "litigationId": "text",
      "litigationCaseId": 999,
      "originalLitigationCaseId": 999,
      "redCaseNo": "ผบ.3140/2560",
      "defendantName": "นายปรีชา ทำประเสริฐ",
      "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
      "ledId": null,
      "ledName": null,
      "lawCourtId": "102",
      "lawCourtName": "จังหวัดสมุทรปราการ",
      "aucStatus": "MOCK_AS_STATUS_RECEIPT_PENDING_APPROVAL",
      "isExhibit": false,
      "saleChannel": "ขายแบบธรรมดา"
    },
    {
      "aucRef": 12,
      "announceDate": "2023-03-03",
      "aucLot": "19/66/5/2566",
      "aucSet": "สป.2",
      "fbidnum": "157",
      "aucLedSeq": "4",
      "litigationId": "text",
      "litigationCaseId": 999,
      "originalLitigationCaseId": 999,
      "redCaseNo": "ผบ.3140/2560",
      "defendantName": "นายปรีชา ทำประเสริฐ",
      "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
      "ledId": null,
      "ledName": null,
      "lawCourtId": "102",
      "lawCourtName": "จังหวัดสมุทรปราการ",
      "aucStatus": "MOCK_AS_STATUS_RECEIPT_COMPLETE",
      "isExhibit": false,
      "saleChannel": "ขายแบบธรรมดา"
    }
  ];
}

function getAuctionLedsAnnouncesResult() {
  return [
    {
      "aucRef": 99,
      "announceDate": "2023-03-03",
      "aucLot": "19/66/5/2566",
      "aucSet": "สป.2",
      "fbidnum": "157",
      "aucLedSeq": "1",
      "litigationId": "text",
      "litigationCaseId": 999,
      "originalLitigationCaseId": 999,
      "redCaseNo": "ผบ.3140/2560",
      "defendantName": "นายปรีชา ทำประเสริฐ",
      "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
      "ledId": null,
      "ledName": null,
      "lawCourtId": "102",
      "lawCourtName": "จังหวัดสมุทรปราการ",
      "aucStatus": "COMPLETE",
      "isExhibit": false,
      "saleChannel": "ขายแบบธรรมดา"
    }
  ];
}

function inquiryAuctionCashierChequeCollateralsInfo() {
  return [
    {
      "actionFlag": true,
      "assignedLawyerId": "userId userOptions : 0",
      "assignedLawyerMobileNo": "0999999999",
      "aucRef": 234,
      "branchName": "001",
      "cashierCollateralId": 0,
      "receiveCashierDate": "2023-03-30T09:30:29.625Z",
      "deedGroupRecordList": [
        {
          "amount": 2000,
          "deedGroupId": "172",
          "fsubbidnum": "1",
          "no": 0,
          "orderPaymentDate": "2023-10-30T09:30:29.625Z"
        }
      ],
      "ledId": 0,
      "ledName": "สำนักงานบังคับคดีสมุทรสาคร",
      "meetingDate": "2023-09-30T09:30:29.625Z",
      "meetingNo": "39/2563 (804)",
      "receivedByLawyerId": "",
      "receivedByLawyerMobileNo": "",
      "rejectReason": 'A while back I needed to count the amount of letters that a piece of text in an ' +
        'email template had (to avoid passing any character limits). Unfortunately, I could ' +
        'not think of a quick way to do so on my macbook and I therefore turned to the ' +
        'Internet. There were a couple of tools out there, but none of them met my ' +
        'standards and since I am a web designer I thought: why not do it myself and help ' +
        'others along the way? And... here is the result, hope it helps out I thought: why ' +
        'not do it myself and',
      "status": "R2E09-06-7C_CREATE",
      "totalAmount": 1000000,
      "totalDeedGroup": 2
    }
  ];
}

function getAuctionCashierStampDuty() {
  return [
    {
      "actionFlag": true,
      "amount": 1000,
      "assignedLawyerId": "userId userOptions : 0",
      "assignedLawyerMobileNo": "0888888888",
      "aucRef": 234,
      "branchName": "001",
      "cashierStampDutyId": 0,
      "deedGroupId": 0,
      "receiveCashierDate": "2023-04-30T09:30:29.625Z",
      "deedGroupRecordList": [
        {
          "amount": 2000,
          "deedGroupId": "172",
          "feeAmount": 200,
          "fsubbidnum": "1",
          "no": 0,
          "orderPaymentDate": "2023-08-04T07:19:12.216Z",
          "soldPrice": 50,
        }
      ],
      "feeAmount": 1000,
      "ledId": 0,
      "ledName": "สำนักงานบังคับคดีสมุทรปราการ",
      "no": 0,
      "soldDate": "2023-08-04T07:19:12.216Z",
      "receivedByLawyerId": "",
      "receivedByLawyerMobileNo": "",
      "rejectReason": 'A while back I needed to count the amount of letters that a piece of text in an ' +
        'email template had (to avoid passing any character limits). Unfortunately, I could ' +
        'not think of a quick way to do so on my macbook and I therefore turned to the ' +
        'Internet. There were a couple of tools out there, but none of them met my ' +
        'standards and since I am a web designer I thought: why not do it myself and help ' +
        'others along the way? And... here is the result, hope it helps out I thought: why ' +
        'not do it myself and',
      "soldPrice": 50,
      "status": "R2E09-12-12C_02",
      "totalAmount": 1000000,
      "totalDeedGroup": 2
    }
  ];
}

function getAuctionBiddingCollateralsSummary() {
  return {
    "aucRef": 157,
    "ledId": 27,
    "ledName": "สำนักงานบังคับคดีจังหวัดเชียงใหม่",
    "aucLedSeq": "1",
    "litigationId": "text",
    "litigationCaseId": 999,
    "originalLitigationCaseId": 999,
    "deedGroups":
      [
        {
          "deedGroupId": 999,
          "fsubbidnum": "text",
          "saletypedesc": "text",
          "isValid": true,
          "totalDeeds": 999,
          "totalCollaterals": 999,
          "reservefund": "999999999.99",
          "reservefund1": "999999999.99",
          "assetprice2": "999999999.99",
          "assetprice3": "999999999.99",
          "assetprice4": "999999999.99",
          "assetprice5": "999999999.99",
          "npaStatus": "PENDING",     // PENING(รอผลพิจารณาจาก NPA)/ADJUST(รอแก้ไขประกาศ)/PURCHASE(อนุมัติซื้อทรัพย์)/NOT_PURCHASE(อนุมัติไม่ซื้อทรัพย์)
          "deeds":
            [
              {
                "deedId": 998,
                "assetTypeDesc": "text",
                "landType": "text",
                "collateralId": "text",
                "collateralTypeCode": "text",
                "collateralSubTypeCode": "text",
                "collateralDocNo": "text",
                "isDeedInfoValid": true
              },
              {
                "deedId": 999,
                "assetTypeDesc": "text",
                "landType": "text",
                "collateralId": "text",
                "collateralTypeCode": "text",
                "collateralSubTypeCode": "text",
                "collateralDocNo": "text",
                "isDeedInfoValid": true
              }
            ]
        },
        {
          "deedGroupId": 111,
          "fsubbidnum": "text",
          "saletypedesc": "text",
          "isValid": true,
          "totalDeeds": 999,
          "totalCollaterals": 999,
          "reservefund": "999999999.99",
          "reservefund1": "999999999.99",
          "assetprice2": "999999999.99",
          "assetprice3": "999999999.99",
          "assetprice4": "999999999.99",
          "assetprice5": "999999999.99",
          "npaStatus": "PURCHASE",     // PENING(รอผลพิจารณาจาก NPA)/ADJUST(รอแก้ไขประกาศ)/PURCHASE(อนุมัติซื้อทรัพย์)/NOT_PURCHASE(อนุมัติไม่ซื้อทรัพย์)
          "deeds":
            [
              {
                "deedId": 112,
                "assetTypeDesc": "text",
                "landType": "text",
                "collateralId": "text",
                "collateralTypeCode": "text",
                "collateralSubTypeCode": "text",
                "collateralDocNo": "text",
                "isDeedInfoValid": true
              },
              {
                "deedId": 113,
                "assetTypeDesc": "text",
                "landType": "text",
                "collateralId": "text",
                "collateralTypeCode": "text",
                "collateralSubTypeCode": "text",
                "collateralDocNo": "text",
                "isDeedInfoValid": true
              }
            ]
        }
      ]
  };
}

function getAuctionBiddingAnnounce() {
  return {
    "aucRef": 99,
    "announceDate": "2023-03-03",
    "aucLot": "19/66/5/2566",
    "aucSet": "สป.2",
    "fbidnum": "157",
    "aucLedSeq": "1",
    "litigationId": "text",
    "litigationCaseId": 999,
    "originalLitigationCaseId": 999,
    "redCaseNo": "ผบ.3140/2560",
    "defendantName": "นายปรีชา ทำประเสริฐ",
    "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
    "ledId": null,
    "ledName": null,
    "aucStatus": "PENDING_NPA",
    "isExhibit": false,
    "saleChannel": "ขายแบบธรรมดา",
    "saleLocation1": "จำหน่ายนัดที่ 1-6 ณ สำนักงานบังคับคดีจังหวัดสมุทรปราการ เลขที่ 411 หมู่ที่ 4 ถนน สุขุมวิท ตำบลบางปูใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ",
    "saleTime1": "9.30",
    "saleLocation2": null,
    "saleTime2": null,
    "lastBidDate": "2023-07-07",
    //ทนายดูแลการขาย?
    "bidDates":
      [
        {
          "number": 1,
          "bidDate": "2023-07-07",
          "status": "text",
          "remark": "text",
          "aucBiddingStatus": "PENDING",   // PENDING: ยังไม่ได้บันทึกผล, VALIDATE: บันทึกผลแล้วแต่ยังอัปโหลดเอกสารไม่ครบ, COMPLETE: เสร็จสิ้นนัดขาย
        },
        {
          "number": 2,
          "bidDate": "2023-07-14",
          "status": "text",
          "remark": "text",
          "aucBiddingStatus": "PENDING"

        },
        {
          "number": 3,
          "bidDate": "2023-07-21",
          "status": "text",
          "remark": "text",
          "aucBiddingStatus": "PENDING"
        },
        {
          "number": 4,
          "bidDate": "2023-07-28",
          "status": "text",
          "remark": "text",
          "aucBiddingStatus": "PENDING"
        },
        {
          "number": 5,
          "bidDate": "2023-08-04",
          "status": "text",
          "remark": "text",
          "aucBiddingStatus": "PENDING"
        },
        {
          "number": 6,
          "bidDate": "2023-08-11",
          "status": "text",
          "remark": "text",
          "aucBiddingStatus": "PENDING"
        }
      ],
    "aucBiddingDocuments":
      [
        {
          "documentTemplate":
          {
            "documentGroup": "AUCREFRESULT",
            "documentTemplateId": "text",
            "documentName": "ใบประกาศขายทอดตลาด",
          },
          "documentId": 111,
          "imageSource": "",
          "imageId": "",
          "imageName": "",
          "uploadTimestamp": ""
        }
      ]
  };
}

function getAuctionBiddingDeedGroup() {
  return {
    "aucBiddingId": 99,
    "aucBiddingDeedGroupId": 111,
    "aucRef": 99,
    "ledId": 999,
    "ledName": "text",
    "aucLedSeq": "1",
    "deedGroupId": 111,
    "fsubbidnum": "text",
    "lawCourtId": "102",
    "lawCourtName": "จังหวัดสมุทรปราการ",
    "lawCourtLevel": "CIVIL",
    "aucRound": 99,
    "aucBiddingDeedGroupStatus": "COMPLETE",
    "saleChannel": "ขายแบบธรรมดา",
    "bidDate": "2023-07-07",
    "aucBiddingResult":
    {
      "aucResult": "SOLD",
      "aucResultTimestamp": "2023-07-10T13:10:39.401Z",
      "buyerType": "KTB",
      "buyerName": "text",
      "soldPrice": 999999999999,
      "soldDate": "2023-07-10",
      "unsoldReasonType": "NO_BIDDER",
      "unsoldObjectBuyer": "text",
      "unsoldObjectHighestBidder": "text",
      "unsoldObjectPrice": 999999999999,
      "unsoldObjectDissident": "text",
      "returnDocumentNo": "cashier cheque number",
      "returnDocumentRemark": "text",
      "cancelReasonType": "UNLAWFUL_NOTICE",
      "remark": "text",
      "requireResultDocument": true,
      "requireReturnDocument": false
    },
    "aucBiddingDeedGroupDocuments": // Always available regardless of whether auc_result is already saved or not.
      [
        {
          "documentTemplate":
          {
            "documentGroup": "AUCDEEDGROUPRESULT",
            "documentTemplateId": "LEXSF139",
            "documentName": "สัญญาซื้อขาย",
            "optional": false
          },
          "documentId": 111,
          "imageSource": "",
          "imageId": "5e9d760c-edd6-4282-85d6-f2ab6d1feb97",
          "imageName": "",
          "uploadTimestamp": "2023-07-10",
          "reuploadable": false
        },
        {
          "documentTemplate":
          {
            "documentGroup": "AUCDEEDGROUPRETURN",	// Only return this document group if NPA resolution is BUY but aucResult = UNSOLD and Cashier Cheque has been issued
            "documentTemplateId": "text",
            "documentName": "เช็คหลักประกัน",
            "optional": false
          },
          "documentId": 111,
          "imageSource": "",
          "imageId": "text",
          "imageName": "",
          "uploadTimestamp": "2023-07-10",
          "reuploadable": false
        }
      ]
  };
}

function inquiryLatestResolutionInfo() {
  return {
    "resolution": "2",
    "saletypedesc": "ปลอดการจำนอง",
    "minPrice": 5000000.00,
    "maxPrice": 1000000.00,
    "genCbsAppval": 5500000.00,
    "effectiveDateTo": "2023-07-10",
    "chronicleId": "123456789"
  };
}

function inquiryBiddingCollaterals() {
  return {
    "aucRef": 99,
    "ledId": 999,
    "ledName": "text",
    "aucLedSeq": "1",
    "lawCourtId": "102",
    "lawCourtName": "จังหวัดสมุทรปราการ",
    "saleChannel": "ขายแบบธรรมดา",
    "deedGroups":
      [
        {
          "deedGroupId": 999,
          "fsubbidnum": "text",
          "isValid": true,
          "totalDeeds": 999,
          "totalCollaterals": 999,
          "deeds":
            [
              {
                "deedId": 999,
                "assetTypeDesc": "text",
                "landType": "text",
                "deedno": "54481",
                "assetDetail": "ตามสำเนาโฉนดเลขที่ 54481, กระโด, ยะรัง, ปัตตานี, เนื้อที่(ไร่) 0, เนื้อที่(ตารางเมตร) 0, เนื้อที่(ตารางวา) 55.9",
                "redCaseNo": "ผบ.1274/2561",
                "saletypedesc": "text",
                "debtname": null,
                "ownername": "นายกามัล เจ๊ะกา",
                "plaintiffname": "ธนาคารกรุงไทย จำกัด (มหาชน)",
                "defendantname": "นายกามัล เจ๊ะกา ที่ 1 กับพวกรวม 5 คน",
                "occupant": "ผู้ถือกรรมสิทธิ์",
                "ledname": "จังหวัดปัตตานี",
                "remark": "ขายรวม (แปลงที่ 1 - 4) รวม 4 แปลง,  ราคาประเมินรวม  70,840.- บาท",
                "url": "http://asset.led.go.th/newbidreg/asset_open_reg.asp?law_suit_year=2561&Law_Court_ID=906&deed_no=54481&addrno=-&law_suit_no=%BC%BA.1274",
                "isDeedInfoValid": true,
                "deedInfoValidationResult": "ข้อมูลถูกต้อง",
                "initialDeedInfoValidation":
                {
                  "validatorUserId": "text",
                  "validatorUserName": "text",
                  "deedInfoValidationDate": "2023-07-10",
                  "remark": "text"
                },
                "finalDeedInfoValidation":
                {
                  "validatorUserId": "text",
                  "validatorUserName": "text",
                  "deedInfoValidationDate": "2023-07-10",
                  "remark": "text"
                },
                "collateralId": "text",
                "collateralTypeCode": "text",
                "collateralSubTypeCode": "text",
                "collateralDocNo": "text"
              },
              {
                "deedId": 999,
                "assetTypeDesc": "text",
                "landType": "text",
                "deedno": "9000",
                "assetDetail": "ตามสำเนาโฉนดเลขที่ 54481, กระโด, ยะรัง, ปัตตานี, เนื้อที่(ไร่) 0, เนื้อที่(ตารางเมตร) 0, เนื้อที่(ตารางวา) 55.9",
                "redCaseNo": "ผบ.1274/2561",
                "saletypedesc": "text",
                "debtname": null,
                "ownername": "นายกามัล เจ๊ะกา",
                "plaintiffname": "ธนาคารกรุงไทย จำกัด (มหาชน)",
                "defendantname": "นายกามัล เจ๊ะกา ที่ 1 กับพวกรวม 5 คน",
                "occupant": "ผู้ถือกรรมสิทธิ์",
                "ledname": "จังหวัดปัตตานี",
                "remark": "ขายรวม (แปลงที่ 1 - 4) รวม 4 แปลง,  ราคาประเมินรวม  70,840.- บาท",
                "url": "http://asset.led.go.th/newbidreg/asset_open_reg.asp?law_suit_year=2561&Law_Court_ID=906&deed_no=54481&addrno=-&law_suit_no=%BC%BA.1274",
                "isDeedInfoValid": true,
                "deedInfoValidationResult": "ข้อมูลถูกต้อง",
                "initialDeedInfoValidation":
                {
                  "validatorUserId": "text",
                  "validatorUserName": "text",
                  "deedInfoValidationDate": "2023-07-10",
                  "remark": "text"
                },
                "finalDeedInfoValidation":
                {
                  "validatorUserId": "text",
                  "validatorUserName": "text",
                  "deedInfoValidationDate": "2023-07-10",
                  "remark": "text"
                },
                "collateralId": "text",
                "collateralTypeCode": "text",
                "collateralSubTypeCode": "text",
                "collateralDocNo": "text"
              }
            ]
        },
        {
          "deedGroupId": 999,
          "fsubbidnum": "text1",
          "isValid": true,
          "totalDeeds": 999,
          "totalCollaterals": 999,
          "deeds":
            [
              {
                "deedId": 999,
                "assetTypeDesc": "text",
                "landType": "text",
                "deedno": "2001",
                "assetDetail": "ตามสำเนาโฉนดเลขที่ 54481, กระโด, ยะรัง, ปัตตานี, เนื้อที่(ไร่) 0, เนื้อที่(ตารางเมตร) 0, เนื้อที่(ตารางวา) 55.9",
                "redCaseNo": "ผบ.1274/2561",
                "saletypedesc": "text",
                "debtname": null,
                "ownername": "นายกามัล เจ๊ะกา",
                "plaintiffname": "ธนาคารกรุงไทย จำกัด (มหาชน)",
                "defendantname": "นายกามัล เจ๊ะกา ที่ 1 กับพวกรวม 5 คน",
                "occupant": "ผู้ถือกรรมสิทธิ์",
                "ledname": "จังหวัดปัตตานี",
                "remark": "ขายรวม (แปลงที่ 1 - 4) รวม 4 แปลง,  ราคาประเมินรวม  70,840.- บาท",
                "url": "http://asset.led.go.th/newbidreg/asset_open_reg.asp?law_suit_year=2561&Law_Court_ID=906&deed_no=54481&addrno=-&law_suit_no=%BC%BA.1274",
                "isDeedInfoValid": true,
                "deedInfoValidationResult": "ข้อมูลถูกต้อง",
                "initialDeedInfoValidation":
                {
                  "validatorUserId": "text",
                  "validatorUserName": "text",
                  "deedInfoValidationDate": "2023-07-10",
                  "remark": "text"
                },
                "finalDeedInfoValidation":
                {
                  "validatorUserId": "text",
                  "validatorUserName": "text",
                  "deedInfoValidationDate": "2023-07-10",
                  "remark": "text"
                },
                "collateralId": "text",
                "collateralTypeCode": "text",
                "collateralSubTypeCode": "text",
                "collateralDocNo": "text"
              },
              {
                "deedId": 999,
                "assetTypeDesc": "text",
                "landType": "text",
                "deedno": "3000",
                "assetDetail": "ตามสำเนาโฉนดเลขที่ 54481, กระโด, ยะรัง, ปัตตานี, เนื้อที่(ไร่) 0, เนื้อที่(ตารางเมตร) 0, เนื้อที่(ตารางวา) 55.9",
                "redCaseNo": "ผบ.1274/2561",
                "saletypedesc": "text",
                "debtname": null,
                "ownername": "นายกามัล เจ๊ะกา",
                "plaintiffname": "ธนาคารกรุงไทย จำกัด (มหาชน)",
                "defendantname": "นายกามัล เจ๊ะกา ที่ 1 กับพวกรวม 5 คน",
                "occupant": "ผู้ถือกรรมสิทธิ์",
                "ledname": "จังหวัดปัตตานี",
                "remark": "ขายรวม (แปลงที่ 1 - 4) รวม 4 แปลง,  ราคาประเมินรวม  70,840.- บาท",
                "url": "http://asset.led.go.th/newbidreg/asset_open_reg.asp?law_suit_year=2561&Law_Court_ID=906&deed_no=54481&addrno=-&law_suit_no=%BC%BA.1274",
                "isDeedInfoValid": true,
                "deedInfoValidationResult": "ข้อมูลถูกต้อง",
                "initialDeedInfoValidation":
                {
                  "validatorUserId": "text",
                  "validatorUserName": "text",
                  "deedInfoValidationDate": "2023-07-10",
                  "remark": "text"
                },
                "finalDeedInfoValidation":
                {
                  "validatorUserId": "text",
                  "validatorUserName": "text",
                  "deedInfoValidationDate": "2023-07-10",
                  "remark": "text"
                },
                "collateralId": "text",
                "collateralTypeCode": "text",
                "collateralSubTypeCode": "text",
                "collateralDocNo": "text"
              }
            ]
        }
      ]
  };
}

function getAuctionBiddingResultResponse() {
  return {
    "aucBiddingId": 99,
    "aucBiddingStatus": "COMPLETE",
    "aucRef": 99,
    "ledId": 999,
    "ledName": "text",
    "aucLedSeq": "1",
    "litigationId": "text",
    "litigationCaseId": 999,
    "originalLitigationCaseId": 999,
    "bidDate": "2023-07-07",
    "saleChannel": "ขายแบบธรรมดา",
    "aucBiddingResults":
      [
        {
          "aucBiddingDeedGroupId": 111,
          "deedGroupId": 999,
          "fsubbidnum": "text",
          "saletypedesc": "text",
          "aucBiddingDeedGroupStatus": "COMPLETE",
          "aucResult": "SOLD",
          "aucResultTimestamp": "2023-07-10T13:10:39.401Z",
          "buyerType": "KTB",
          "buyerName": "text",
          "soldPrice": 999999999999,
          "soldDate": "2023-07-07",
          "unsoldReasonType": "NO_BIDDER",
          "unsoldObjectBuyer": "text",
          "unsoldObjectHighestBidder": "text",
          "unsoldObjectPrice": 999999999999,
          "unsoldObjectDissident": "text",
          "returnDocumentNo": "cashier cheque number",
          "returnDocumentRemark": "text",
          "cancelReasonType": "UNLAWFUL_NOTICE",
          "remark": "text"
        }
      ]
  };
}

function getAuctionBiddingAnnounceResult() {
  return {
    "aucRef": 99,
    "announceDate": "2023-03-03",
    "aucLot": "19/66/5/2566",
    "aucSet": "สป.2",
    "fbidnum": "157",
    "aucLedSeq": "1",
    "litigationId": "text",
    "litigationCaseId": 999,
    "originalLitigationCaseId": 999,
    "redCaseNo": "ผบ.3140/2560",
    "defendantName": "นายปรีชา ทำประเสริฐ",
    "plaintiffName": "ธนาคารกรุงไทย จำกัด (มหาชน)",
    "ledId": null,
    "ledName": null,
    "aucStatus": "AUCTION",
    "isExhibit": false,
    "saleChannel": "ขายแบบธรรมดา",
    "saleLocation1": "จำหน่ายนัดที่ 1-6 ณ สำนักงานบังคับคดีจังหวัดสมุทรปราการ เลขที่ 411 หมู่ที่ 4 ถนน สุขุมวิท ตำบลบางปูใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ",
    "saleTime1": "9.30",
    "saleLocation2": "จำหน่ายนัดที่ 2-6 ณ สำนักงานบังคับคดีจังหวัดตรัง เลขที่ 290/1 - 4 ถนนกันตัง ตำบลทับเที่ยง อำเภอเมือง จังหวัดตรัง",
    "saleTime2": "9.30",
    //"lastBidDate": "2023-07-07", remove 27/07/2023(not use)
    //ทนายดูแลการขาย?
    "bidDates":
      [
        {
          "aucBiddingId": 99,
          "number": 1,
          "bidDate": "2023-07-07",
          "status": "text",
          "remark": "text",
          "aucBiddingStatus": "PENDING",   // PENDING: ยังไม่ได้บันทึกผล, VALIDATE: บันทึกผลแล้วแต่ยังอัปโหลดเอกสารไม่ครบ, COMPLETE: เสร็จสิ้นนัดขาย
        },
        {
          "aucBiddingId": 90,
          "number": 2,
          "bidDate": "2023-07-14",
          "status": "text",
          "remark": "text",
          "aucBiddingStatus": "COMPLETE"

        },
        {
          "aucBiddingId": 91,
          "number": 3,
          "bidDate": "2023-07-21",
          "status": "text",
          "remark": "text",
          "aucBiddingStatus": "VALIDATE"
        },
        {
          "aucBiddingId": 80,
          "number": 4,
          "bidDate": "2023-07-28",
          "status": "text",
          "remark": "text",
          "aucBiddingStatus": "COMPLETE"
        },
        {
          "aucBiddingId": 89,
          "number": 5,
          "bidDate": "2023-08-04",
          "status": "text",
          "remark": "text",
          "aucBiddingStatus": "PENDING"
        },
        {
          "aucBiddingId": 88,
          "number": 6,
          "bidDate": "2023-08-11",
          "status": "text",
          "remark": "text",
          "aucBiddingStatus": "PENDING"
        }
      ],
    "aucBiddingDocuments":
      [
        {
          "documentTemplate":
          {
            "documentGroup": "AUCREFRESULT",
            "documentTemplateId": "text",
            "documentName": "ใบประกาศขายทอดตลาด",
          },
          "documentId": 111,
          "imageSource": "",
          "imageId": "text",
          "imageName": "",
          "uploadTimestamp": "2023-03-03",
        }
      ]
  };
}



function getAuctionResolutionsHistory() {
  return {
    "resolutions": [
      {
        "meetingNo": "40/2565(805)",
        "meetingDate": "30/09/2565",
        "totalUpdatedCollateral": 3,
        "footNote": "NPA remark",
        "deedGroups": [
          {
            "deedGroupId": "1",
            "resolution": "PURCHASE",
            "saleTypeDesc": "ปลอดการจำนอง",
            "minPrice": 1000.00,
            "maxPrice": 1000000.00,
            "genCbsAppval": 5500000.00,
            "effectiveDateTo": "2023-07-10",
            "colRemark": "test",
            "chronicleId": "123456789"
          },
          {
            "deedGroupId": "2",
            "resolution": "PURCHASE",
            "saleTypeDesc": "ปลอดการจำนอง",
            "minPrice": 5000000.00,
            "maxPrice": 7000000.00,
            "genCbsAppval": 5500000.00,
            "effectiveDateTo": "2023-07-10",
            "colRemark": "test",
            "chronicleId": "123456789"
          },
          {
            "deedGroupId": "3",
            "resolution": "PURCHASE",
            "saleTypeDesc": "ปลอดการจำนอง",
            "minPrice": 600.00,
            "maxPrice": 4000000.00,
            "genCbsAppval": 5500000.00,
            "effectiveDateTo": "2023-07-10",
            "colRemark": "",
            "chronicleId": "123456789"
          }
        ]
      },
      {
        "meetingNo": "39/2565(805)",
        "meetingDate": "30/09/2565",
        "totalUpdatedCollateral": 2,
        "footNote": "NPA remark",
        "deedGroups": [
          {
            "deedGroupId": "1",
            "resolution": "PURCHASE",
            "saleTypeDesc": "ปลอดการจำนอง",
            "minPrice": 600.00,
            "maxPrice": 5000.00,
            "genCbsAppval": 5500000.00,
            "effectiveDateTo": "2023-07-10",
            "colRemark": "test1",
            "chronicleId": "123456789"
          },
          {
            "deedGroupId": "2",
            "resolution": "PURCHASE",
            "saleTypeDesc": "ปลอดการจำนอง",
            "minPrice": 1000.00,
            "maxPrice": 30000.00,
            "genCbsAppval": 5500000.00,
            "effectiveDateTo": "2023-07-10",
            "colRemark": "test1",
            "chronicleId": "123456789"
          }
        ]
      }
    ]
  };
}

function getAuctionCashierChequeBranchList() {
  return {
    "ktbOrg": [
      {
        "name": "สวนมะลิ",
        "value": "001"
      }
    ]
  };
}

function getAuctionBiddingInfo() {
  return {
    "aucBiddingId": 99,
    "aucRef": 99,
    "ledId": 999,
    "ledName": "text",
    "aucLedSeq": "1",
    "lawCourtId": "102",
    "lawCourtName": "จังหวัดสมุทรปราการ",
    "aucRound": 2,
    "totalRound": 6,
    "bidDate": "2023-07-14",
    "aucBiddingStatus": "PENDING",
    "aucBiddingStatusDesc": "อยู่ระหว่างการขายทอดตลาด",
    "aucBiddingStatusRemark": null,
    "saleChannel": "ขายแบบธรรมดา",
    "bidDates":
      [
        {
          "number": 1,
          "bidDate": "2023-07-07",
          "status": "ขายทอดตลาดได้",
          "remark": "ขายทรัพย์ได้บางส่วน"
        },
        {
          "number": 2,
          "bidDate": "2023-07-14",
          "status": "อยู่ระหว่างการขายทอดตลาด",
          "remark": null
        },
        {
          "number": 3,
          "bidDate": "2023-07-21",
          "status": "รอขายทอดตลาด",
          "remark": null
        },
        {
          "number": 4,
          "bidDate": "2023-07-28",
          "status": "รอขายทอดตลาด",
          "remark": null
        },
        {
          "number": 5,
          "bidDate": "2023-08-04",
          "status": "รอขายทอดตลาด",
          "remark": null
        },
        {
          "number": 6,
          "bidDate": "2023-08-11",
          "status": "รอขายทอดตลาด",
          "remark": null
        }
      ],
    "aucBiddingDocuments":
      [
        {
          "documentTemplate":
          {
            "documentGroup": "AUCREFRESULT",
            "documentTemplateId": "LEXSF137",
            "documentName": "ใบประกาศขายทอดตลาด",
            "optional": false
          },
          "documentId": 111,
          "imageSource": "",
          "imageId": "",
          "imageName": "",
          "uploadTimestamp": "",
          "reuploadable": false
        },
        {
          "documentTemplate":
          {
            "documentGroup": "AUCBIDRESULT",
            "documentTemplateId": "LEXSF138",
            "documentName": "รายงานการขาย",
            "optional": true
          },
          "documentId": 111,
          "imageSource": "",
          "imageId": "",
          "imageName": "",
          "uploadTimestamp": "",
          "reuploadable": false
        }
      ],
    "aucBiddingDeedGroups":
      [
        {
          "deedGroupId": 999,
          "aucBiddingDeedGroupId": 111,
          "fsubbidnum": "1",
          "saletypedesc": "text",
          "isValid": true,
          "aucBiddingDeedGroupStatus": "COMPLETE",
          "aucResult": "PENDING",
          "action": "VIEW",  // UPDATE: "บันทึกผล", UPLOAD: "อัปโหลด" (ยังไม่ได้ upload - ปุ่มสีฟ้า), REUPLOAD: "อัปโหลด" (upload ไปแล้วให้ re-upload ซ้ำได้ - ปุ่มสีเทา), VIEW: "ดูรายละเอียด"
          "npaResolutionSummary":
          {
            "resolution": "อนุมัติซื้อทรัพย์",
            "minPrice": 9999999.99,
            "maxPrice": 9999.99,
            "totalAppraisalValue": 9999999.99,
            "effectiveDateTo": "2023-08-06",
            "npaResolutionDocument": "chronicleID"
          },
          "deeds":
            [
              {
                "deedId": 998,
                "assetTypeDesc": "text",
                "landType": "text",
                "collateralId": "text",
                "collateralTypeCode": "text",
                "collateralSubTypeCode": "text",
                "collateralDocNo": "2556/1234"
              },
              {
                "deedId": 999,
                "assetTypeDesc": "text",
                "landType": "text",
                "collateralId": "text",
                "collateralTypeCode": "text",
                "collateralSubTypeCode": "text",
                "collateralDocNo": "2556/9999"
              }
            ]
        },
        {
          "deedGroupId": 888,
          "aucBiddingDeedGroupId": 222,
          "fsubbidnum": "1",
          "saletypedesc": "text",
          "isValid": true,
          "aucBiddingDeedGroupStatus": "COMPLETE",
          "aucResult": "PENDING",
          "action": "UPDATE",  // UPDATE: "บันทึกผล", UPLOAD: "อัปโหลด" (ยังไม่ได้ upload - ปุ่มสีฟ้า), REUPLOAD: "อัปโหลด" (upload ไปแล้วให้ re-upload ซ้ำได้ - ปุ่มสีเทา), VIEW: "ดูรายละเอียด"
          "npaResolutionSummary":
          {
            "resolution": "อนุมัติซื้อทรัพย์",
            "minPrice": 9999999.99,
            "maxPrice": 9999.99,
            "totalAppraisalValue": 9999999.99,
            "effectiveDateTo": "2023-08-06",
            "npaResolutionDocument": "chronicleID"
          },
          "deeds":
            [
              {
                "deedId": 998,
                "assetTypeDesc": "text",
                "landType": "text",
                "collateralId": "text",
                "collateralTypeCode": "text",
                "collateralSubTypeCode": "text",
                "collateralDocNo": "2556/888"
              },
              {
                "deedId": 999,
                "assetTypeDesc": "text",
                "landType": "text",
                "collateralId": "text",
                "collateralTypeCode": "text",
                "collateralSubTypeCode": "text",
                "collateralDocNo": "2556/888"
              }
            ]
        }
      ]
  };
}

function getAuctionBiddingCollateralDeedGroup() {
  return {
    "deedGroupId": 999,
    "fsubbidnum": "text",
    "isValid": true,
    "saletypedesc": "text",
    "totalDeeds": 999,
    "totalCollaterals": 999,
    "deeds":
      [
        {
          "deedId": 999,
          "assetTypeDesc": "text",
          "landType": "text",
          "deedno": "54481",
          "assetDetail": "ตามสำเนาโฉนดเลขที่ 54481, กระโด, ยะรัง, ปัตตานี, เนื้อที่(ไร่) 0, เนื้อที่(ตารางเมตร) 0, เนื้อที่(ตารางวา) 55.9",
          "redCaseNo": "ผบ.1274/2561",
          "saletypedesc": "text",
          "debtname": null,
          "ownername": "นายกามัล เจ๊ะกา",
          "plaintiffname": "ธนาคารกรุงไทย จำกัด (มหาชน)",
          "defendantname": "นายกามัล เจ๊ะกา ที่ 1 กับพวกรวม 5 คน",
          "occupant": "ผู้ถือกรรมสิทธิ์",
          "ledname": "จังหวัดปัตตานี",
          "remark": "ขายรวม (แปลงที่ 1 - 4) รวม 4 แปลง,  ราคาประเมินรวม  70,840.- บาท",
          "url": "http://asset.led.go.th/newbidreg/asset_open_reg.asp?law_suit_year=2561&Law_Court_ID=906&deed_no=54481&addrno=-&law_suit_no=%BC%BA.1274",
          "isDeedInfoValid": true,
          "deedInfoValidationResult": "ข้อมูลถูกต้อง",
          "initialDeedInfoValidation":
          {
            "validatorUserId": "text",
            "validatorUserName": "text",
            "deedInfoValidationDate": "YYYY-MM-DD",
            "remark": "text"
          },
          "finalDeedInfoValidation":
          {
            "validatorUserId": "text",
            "validatorUserName": "text",
            "deedInfoValidationDate": "YYYY-MM-DD",
            "remark": "text"
          },
          "collateralId": "text",
          "collateralTypeCode": "text",
          "collateralSubTypeCode": "text",
          "collateralDocNo": "text"
        }
      ]
  };
}
const getDebtSettleMentData = () => {
  return {
    "auctionDebtSettlementAccountId": 1,
    "aucRef": 2,
    "aucRound": 1,
    "biddate": "2023-05-11",
    "ledId": null,
    "ledName": null,
    "aucLedSeq": "1",
    "status": "",
    "statusName": "",
    "buyerType": "",
    "debitPercentage": "100",
    "chequeAmount": 12.521323,
    "creditNoteRefNo": "1234-00-4321-0-0000",
    "creditNoteOrganizationId": "001",
    "makerId": "",
    "makerName": "",
    "approverId": "",
    "createTimestamp": "",
    "updateTimestamp": "",
    "fetchAccountTimestamp": "",
    "approvedTimestamp": "",
    "totalSoldPrice": 1323000.70,
    "debtAmount100": 1800000, //have value when debitPercentage = 100
    "debtAmount85": 11150.50,  //have value when debitPercentage = 85 and 15
    "debtAmount15": 11150.50,  //have value when debitPercentage = 85 and 15
    "auctionDebtSettlementAccountDocuments": [
      {
        "documentId": "001",
        "documentTemplate": {
          "documentTemplateId": "LEXSF176",
          "documentName": "ชื่อเอกสาร บัญชีรับจ่ายจากการซื้อขายทรัพย์ LEXSF176"
        },
        "imageSource": "",
        "imageId": "1234",
        "imageName": "",
        "uploadTimestamp": "2023-07-10",
      },
      {
        "documentId": "002",
        "documentTemplate": {
          "documentTemplateId": "LEXSF146",
          "documentName": "ชื่อเอกสาร บัญชีรับจ่ายจากการซื้อขายทรัพย์ LEXSF146"
        },
        "imageSource": "",
        "imageId": "1234",
        "imageName": "",
        "uploadTimestamp": "2023-07-10",
      }
    ],
    "collateralGroups": [
      {
        "auctionDebtSettlementAccountDeedGroupId": 1,
        "deedGroupId": 2,
        "fsubbidnum": "ชุดทรัพย์ A",
        "soldPrice": 1200000.60,
        "createTimestamp": "",
        "updatedTimestamp": "2023-01-6"
      },
      {
        "auctionDebtSettlementAccountDeedGroupId": 1,
        "deedGroupId": 2,
        "fsubbidnum": "ชุดทรัพย์ B",
        "soldPrice": 123000.10,
        "createTimestamp": "",
        "updatedTimestamp": "2023-06-6"
      }
    ],

    "debtSettlementTransactions": [
      {
        "litigationId": "xxxxx 1",
        "originalLitigationCaseId": "",
        "litigationCaseId": "",
        "legalStatus": "",
        "legalStatusName": "",
        "blackCaseNo": "",
        "redCaseNo": "",
        "cifNo": "",
        "mainBorrowerName": "",
        "courtCode": "",
        "courtName": "",
        "responseUnitCode": "string",
        "responseUnitName": "string",
        "bookingCode": "string",
        "bookingName": "string",
        "isMainCase": true,
        "debtSettlementAccounts": [
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 1,// 1-7
            "paymentType": "1A", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 100000,
            "debtSettlementAmount": 1,
            "createTimestamp": "",
            "updateTimestamp": ""
          },
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 1,// 1-7
            "paymentType": "1A", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 1,
            "debtSettlementAmount": 1,
            "createTimestamp": "",
            "updateTimestamp": ""
          },
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 1,// 1-7
            "paymentType": "1B", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 2,
            "debtSettlementAmount": 2,
            "createTimestamp": "",
            "updateTimestamp": ""
          },
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 1,// 1-7
            "paymentType": "1C", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 2,
            "debtSettlementAmount": 2,
            "createTimestamp": "",
            "updateTimestamp": ""
          },
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 2,// 1-7
            "paymentType": "2", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 1,
            "debtSettlementAmount": 1,
            "createTimestamp": "",
            "updateTimestamp": ""
          },

          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 3,// 1-7
            "paymentType": "3", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 1,
            "debtSettlementAmount": 1,
            "createTimestamp": "",
            "updateTimestamp": ""
          },
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 4,// 1-7
            "paymentType": "4A", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 1,
            "debtSettlementAmount": 1,
            "createTimestamp": "",
            "updateTimestamp": ""
          },
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 4,// 1-7
            "paymentType": "4B", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 2,
            "debtSettlementAmount": 2,
            "createTimestamp": "",
            "updateTimestamp": ""
          },
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 4,// 1-7
            "paymentType": "4C", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 2,
            "debtSettlementAmount": 2,
            "createTimestamp": "",
            "updateTimestamp": ""
          },
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 5,// 1-7
            "paymentType": "5A", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 1,
            "debtSettlementAmount": 1,
            "createTimestamp": "",
            "updateTimestamp": ""
          },
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 5,// 1-7
            "paymentType": "5B", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 2,
            "debtSettlementAmount": 2,
            "createTimestamp": "",
            "updateTimestamp": ""
          },
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 5,// 1-7
            "paymentType": "5C", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 2,
            "debtSettlementAmount": 2,
            "createTimestamp": "",
            "updateTimestamp": ""
          },
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 6,// 1-7
            "paymentType": "6", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 1,
            "debtSettlementAmount": 1,
            "createTimestamp": "",
            "updateTimestamp": ""
          },

          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 7,// 1-7
            "paymentType": "7", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 1,
            "debtSettlementAmount": 1,
            "createTimestamp": "",
            "updateTimestamp": ""
          },

          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 7,// 1-7
            "paymentType": "7", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 7,
            "debtSettlementAmount": 7,
            "createTimestamp": "",
            "updateTimestamp": ""
          },

          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 7,// 1-7
            "paymentType": "7", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 7,
            "debtSettlementAmount": 7,
            "createTimestamp": "",
            "updateTimestamp": ""
          },


        ]

      },
      {
        "litigationId": "mock 2",
        "originalLitigationCaseId": "",
        "litigationCaseId": "",
        "legalStatus": "",
        "legalStatusName": "",
        "blackCaseNo": "",
        "redCaseNo": "",
        "cifNo": "",
        "mainBorrowerName": "",
        "courtCode": "",
        "courtName": "",
        "responseUnitCode": "string",
        "responseUnitName": "string",
        "bookingCode": "string",
        "bookingName": "string",
        "isMainCase": false,
        "debtSettlementAccounts": [
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 1,// 1-7
            "paymentType": "1A", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 1,
            "debtSettlementAmount": 1,
            "createTimestamp": "",
            "updateTimestamp": ""
          },
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 1,// 1-7
            "paymentType": "1A", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 1,
            "debtSettlementAmount": 1,
            "createTimestamp": "",
            "updateTimestamp": ""
          },
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 1,// 1-7
            "paymentType": "1B", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 2,
            "debtSettlementAmount": 2,
            "createTimestamp": "",
            "updateTimestamp": ""
          },
          {
            "auctionDebtSettlementAccountAccountId": 1,
            "paymentGroupType": 2,// 1-7
            "paymentType": "1A", // 1A 1B 1C
            "accountNo": "",
            "billNo": "",
            "accountType": "",
            "debtAmount": 3,
            "debtSettlementAmount": 3,
            "createTimestamp": "",
            "updateTimestamp": ""
          },

        ]

      }
    ],

    "approval": { // get last apporval
      "reviewResult": "RETURN", //APPROVE, RETURN
      "rejectReason": "A while back I needed to count the amount of letters that a piece of text in an email template had (to avoid passing any character limits). Unfortunately, I could not think of a quick way to do so on my macbook and I therefore turned to the Internet. There were a couple of tools out there, but none of them met my standards and since I am a web designer I thought: why not do it myself and help others along the way? And... here is the result, hope it helps out I thought: why not do it myself and"
    }
  }
}


const getTransfer = () => {
  return{
    "transferPropertyList":[
       {
          "appointmentRound":"1",
          "transferDate":"11/08/2566",
          "transferResult":"XFER_COMPLETE",
          "npaTransferDate":"11/08/2566",
          "transferResultReason":"String",
          "fee":20000.00,
          "feeTax":50000.00,
          "withdrawnTax":3000.00,
          "witnessFee":20.00,
          "total":703020.00,
          "transferDocuments":[
             {
                "documentName":"ใบเสร็จรับเงินค่าธรรมเนียมการโอนกรรมสิทธิ์จากกรมที่ดิน",
                "chronicleId":"10f2727e-2b83-431e-bc81-348d5728a15d",
                "receivedDocumentDate":"15/08/2566"
             },
             {
                "documentName":"ใบเสร็จรับเงินค่าธรรมเนียมการโอนกรรมสิทธิ์จากกรมที่ดิน",
                "chronicleId":"10f2727e-2b83-431e-bc81-348d5728a15d",
                "receivedDocumentDate":"15/08/2566"
             },
             {
                "documentName":"สำเนาคำขอขายตามคำสั่งศาล ทด.9 / สำเนาคำขอระงับจำนอง",
                "chronicleId":"10f2727e-2b83-431e-bc81-348d5728a15d",
                "receivedDocumentDate":"15/08/2566"
             },
             {
                "documentName":"สำเนาคำขอขายตามคำสั่งศาล ทด.9 / สำเนาคำขอระงับจำนอง",
                "chronicleId":"10f2727e-2b83-431e-bc81-348d5728a15d",
                "receivedDocumentDate":"15/08/2566"
             }
          ],
          "collateralDocuments":[
             {
                "documentName":"เอกสารสิทธิ์",
                "chronicleId":"10f2727e-2b83-431e-bc81-348d5728a15d",
                "collateralId":"184035",
                "collateralDocumentNo":"19617",
                "collateralDetails":"",
                "documentStorageCode":"108885",
                "documentStorageName":"ฝ่ายบริหารจัดการเอกสารและโลจิสติกส์",
                "receivedDocumentDate":"15/08/2566"
             },
             {
                "documentName":"เอกสารสิทธิ์",
                "chronicleId":"10f2727e-2b83-000e-bc81-348d5728a15d",
                "collateralId":"184035",
                "collateralDocumentNo":"4437",
                "collateralDetails":"",
                "documentStorageCode":"108885",
                "documentStorageName":"ฝ่ายบริหารจัดการเอกสารและโลจิสติกส์",
                "receivedDocumentDate":"15/08/2566"
             }
          ]
       },
       {
          "appointmentRound":"2",
          "transferDate":"15/08/2566",
          "transferResult":"XFER_FAIL",
          "npaTransferDate":"15/08/2566",
          "transferResultReason":"String",
          "fee":30000.00,
          "feeTax":60000.00,
          "withdrawnTax":3000.00,
          "witnessFee":20.00,
          "total":93020.00,
          "transferDocuments":[
             {
                "documentName":"ใบเสร็จค่าธรรมเนียมการโอน, ใบเสร็จค่าภาษีธุรกิจเฉพาะ ฯลฯ",
                "chronicleId":"10f2727e-2b83-431e-bc81-348d5728a15d",
                "receivedDocumentDate":"15/08/2566"
             },
             {
                "documentName":"ใบเสร็จค่าธรรมเนียมการโอน, ใบเสร็จค่าภาษีธุรกิจเฉพาะ ฯลฯ",
                "chronicleId":"10f2727e-2b83-431e-bc81-348d5728a15d",
                "receivedDocumentDate":"15/08/2566"
             },
             {
                "documentName":"ใบเสร็จค่าธรรมเนียมการโอน, ใบเสร็จค่าภาษีธุรกิจเฉพาะ ฯลฯ",
                "chronicleId":"10f2727e-2b83-431e-bc81-348d5728a15d",
                "receivedDocumentDate":"15/08/2566"
             },
             {
                "documentName":"สำเนาคำขอขายตามคำสั่งศาล ทด.9 / สำเนาคำขอระงับจำนอง",
                "chronicleId":"10f2727e-2b83-431e-bc81-348d5728a15d",
                "receivedDocumentDate":"15/08/2566"
             },
             {
                "documentName":"สำเนาคำขอขายตามคำสั่งศาล ทด.9 / สำเนาคำขอระงับจำนอง",
                "chronicleId":"10f2727e-2b83-431e-bc81-348d5728a15d",
                "receivedDocumentDate":"15/08/2566"
             }
          ],
          "collateralDocuments":[
             {
                "documentName":"เอกสารสิทธิ์",
                "chronicleId":"10f2727e-2b83-431e-bc81-348d5728a15d",
                "collateralId":"184035",
                "documentStorage":"",
                "receivedDocumentDate":"15/08/2566"
             },
             {
                "documentName":"เอกสารสิทธิ์",
                "chronicleId":"10f2727e-2b83-000e-bc81-348d5728a15d",
                "collateralId":"184036",
                "documentStorage":"",
                "receivedDocumentDate":"15/08/2566"
             }
          ]
       }
    ]
 }
}

const getApointmentInfo = () =>{
  return [{
    "appointmentId" : 999,
    "deedGroupId" : 181,
    "appointmentRound" : 1,
    "aucRef" : 22,
    "fbidnum" : 84,
    "fsubbidnum" : 1,
    "isLatest" : false,
    "collateralType": "string",
    "subCollateralType": "string",
    "provinceName": "string",
    "districtName": "string",
    "subDistrictName": "string",
    "createCostcenter": "string",
    "identificationNo" : "text",
    "cifNo" : "text",
    "customerName" : "text",
    "ccCode" : "108183",
    "ccName" : "ศูนย์ปฏิบัติการจำนองนครหลวง 2",
    "locationId" : "010",
    "locationName" : "สำนักงานที่ดินกรุงเทพมหานคร",
    "branchId" : "005",
    "branchName" : "สาขาบางขุนเทียน",
    "appointPeriod" : "PM",  //(AM = เช้า, PM = บ่าย)
    "appointDate" : "2023-05-25T10:15:29.311Z",
    "remark" : "text",
    "masReferenceNum" : "1234567",
    "masAppointPeriod" : "PM",
    "masAppointDate" : "2023-05-25T10:15:29.311Z",
    "masAppointUserId" : "11249",
    "masAppointUserName" : "ชัยสิทธิ์ โชติกาญจนเรือง",
    "masLocationId" : "010",
    "masLocationName" : "สำนักงานที่ดินกรุงเทพมหานคร",
    "masBranchId" : "005",
    "masBranchName" : "สาขาบางขุนเทียน",
    "conveyancingResult" : "UNSUCCESS",
    "conveyancingResultTimestamp" : "",
    "appointmentCollaterals":[
        {
          "deedId" : 21,
          "collateralId" : "29",
          "collateralTypeCode" : "1",
          "collateralSubTypeCode" : "5",
          "collateralDocumentNo" : "19617"
        },
        {
          "deedId" : 22,
          "collateralId" : "30",
          "collateralTypeCode" : "1",
          "collateralSubTypeCode" : "5",
          "collateralDocumentNo" : "19617"
        },
        {
          "deedId" : 23,
          "collateralId" : "31",
          "collateralTypeCode" : "1",
          "collateralSubTypeCode" : "5",
          "collateralDocumentNo" : "19617"
        }
      ],
    "appointmentDocuments":[
        {
          "documentTemplate":
          {
            "documentGroup": "AUCTION",
            "documentTemplateId": "LEXSF196",
            "documentName": "บันทึกอนุมัติโอนกรรมสิทธิ์ใน 5 วันทำการสุดท้ายของเดือน",
            "optional": true
          },
          "documentId": 110,
          "imageSource": "",
          "imageId": "",
          "imageName": "",
          "uploadTimestamp": ""
        },
        {
          "documentTemplate":
          {
            "documentGroup": "AUCTION",
            "documentTemplateId": "LEXSF148",
            "documentName": "สำเนากรมธรรม์ประกันภัย",
            "optional": true
          },
          "documentId": 111,
          "imageSource": "",
          "imageId": "",
          "imageName": "",
          "uploadTimestamp": ""
        },
        {
          "documentTemplate":
          {
            "documentGroup": "AUCTION",
            "documentTemplateId": "LEXSF148",
            "documentName": "สำเนากรมธรรม์ประกันภัย",
            "optional": true
          },
          "documentId": 112,
          "imageSource": "",
          "imageId": "",
          "imageName": "",
          "uploadTimestamp": ""
        }
      ]
  },
  {
    "appointmentId" : 999,
    "deedGroupId" : 181,
    "appointmentRound" : 2,
    "aucRef" : 22,
    "fbidnum" : 84,
    "fsubbidnum" : 1,
    "isLatest" : true,
    "collateralType": "string",
    "subCollateralType": "string",
    "provinceName": "string",
    "districtName": "string",
    "subDistrictName": "string",
    "createCostcenter": "string",
    "identificationNo" : "text",
    "cifNo" : "text",
    "customerName" : "text",
    "ccCode" : null,
    "ccName" : null,
    "locationId" : null,
    "locationName" : null,
    "branchId" : null,
    "branchName" : null,
    "appointPeriod" : null,
    "appointDate" : null,
    "remark" : null,
    "masReferenceNum" : null,
    "masAppointPeriod" : null,
    "masAppointDate" : null,
    "masAppointUserId" : null,
    "masAppointUserName" : null,
    "masLocationId" : null,
    "masLocationName" : null,
    "masBranchId" : null,
    "masBranchName" : null,
    "conveyancingResult" : "APPOINT_NEW",
    "conveyancingResultTimestamp" : "",
    "appointmentCollaterals":[
        {
          "deedId" : 21,
          "collateralId" : "29",
          "collateralTypeCode" : "1",
          "collateralSubTypeCode" : "5",
          "collateralDocumentNo" : "19617"
        },
        {
          "deedId" : 22,
          "collateralId" : "30",
          "collateralTypeCode" : "1",
          "collateralSubTypeCode" : "5",
          "collateralDocumentNo" : "19617"
        },
        {
          "deedId" : 23,
          "collateralId" : "31",
          "collateralTypeCode" : "1",
          "collateralSubTypeCode" : "5",
          "collateralDocumentNo" : "19617"
        }
      ],
    "appointmentDocuments":[
        {
          "documentTemplate":
          {
            "documentGroup": "AUCTION",
            "documentTemplateId": "LEXSF196",
            "documentName": "บันทึกอนุมัติโอนกรรมสิทธิ์ใน 5 วันทำการสุดท้ายของเดือน",
            "optional": true
          },
          "documentId": 0,
          "imageSource": "",
          "imageId": "",
          "imageName": "",
          "uploadTimestamp": ""
        },
        {
          "documentTemplate":
          {
            "documentGroup": "AUCTION",
            "documentTemplateId": "LEXSF148",
            "documentName": "สำเนากรมธรรม์ประกันภัย",
            "optional": true
          },
          "documentId": 0,
          "imageSource": "",
          "imageId": "",
          "imageName": "",
          "uploadTimestamp": ""
        }
      ]
  }
  ]


}
const checkData = () =>{
  return {
  "statusCode": "int",
  "message": "string",
  "ccCode": "string",
  "ccName": "string",
  "locationId": "string",
  "locationName": "string",
  "branchId": "string",
  "branchName": "string",
  "checkAppLists": {
    "calendarDTO": [ //will response min28-max31
      {
        "date": "Sat Aug 19 2023",
        "holidayName": "string",
        "transactionNum": 1,
        "transaction": 6
      },
      {
        "date": "Sun Aug 20 2023",
        "holidayName": "string",
        "transactionNum": 1,
        "transaction": 2
      },
      {
        "date": "Mon Aug 21 2023",
        "holidayName": "string",
        "transactionNum": 6,
        "transaction": 6
      },
      {
        "date": "Sun Aug 27 2023",
        "holidayName": "string",
        "transactionNum": 6,
        "transaction": 6
      },
      {
        "date": "Mon Aug 28 2023",
        "holidayName": "string",
        "transactionNum": 2,
        "transaction": 6
      },
      {
        "date": "Thu Aug 31 2023",
        "holidayName": "string",
        "transactionNum": 2,
        "transaction": 6
      },

    ]
  }
}
}
module.exports = {
  inquiryAnnouncesResponse: inquiryAnnouncesResponse(),
  inquiryAddAnnouncesResponse: inquiryAddAnnouncesResponse(),
  inquiryCreateAnnounceResponse: inquiryCreateAnnounceResponse(),
  auctionCollaterals: auctionCollaterals(),
  auctionLexsSeizures: auctionLexsSeizures(),
  auctionLexsCollaterals: auctionLexsCollaterals(),
  inquiryLedInfo: inquiryLedInfo(),
  // inquirySeizureInfo: inquirySeizureInfo(),
  inquiryAuctionExpense: inquiryAuctionExpense(),
  getAuctionLitigationAnnouncesProcess: getAuctionLitigationAnnouncesProcess(),
  getAuctionLedsAnnouncesResult: getAuctionLedsAnnouncesResult(),
  getAuctionBiddingCollateralsSummary: getAuctionBiddingCollateralsSummary(),
  getAuctionBiddingAnnounce: getAuctionBiddingAnnounce(),
  //-------Auction detail
  inquiryAuctionCashierChequeCollateralsInfo: inquiryAuctionCashierChequeCollateralsInfo(),
  getAuctionCashierStampDuty: getAuctionCashierStampDuty(),
  getAuctionBiddingDeedGroup: getAuctionBiddingDeedGroup(),
  inquiryLatestResolutionInfo: inquiryLatestResolutionInfo(),
  inquiryBiddingCollaterals: inquiryBiddingCollaterals(),
  getAuctionBiddingResultResponse: getAuctionBiddingResultResponse(),
  getAuctionBiddingAnnounceResult: getAuctionBiddingAnnounceResult(),
  getAuctionResolutionsLatest: getAuctionResolutionsLatest(),
  getAuctionResolutionsHistory: getAuctionResolutionsHistory(),
  getAuctionCashierChequeBranchList: getAuctionCashierChequeBranchList(),
  getAuctionBiddingInfo: require('../data/auction/auctionBiddingInfo.json'),
  getAuctionBiddingCollateralDeedGroup: getAuctionBiddingCollateralDeedGroup(),
  getDebtSettleMentData: getDebtSettleMentData(),
  getTransfer: getTransfer(),
  getAppointmentInfo: getApointmentInfo(),
  checkData: checkData(),
  getExternalPaymentTracking: require('../data/auction/externalPaymentTracking.json'),
  getAucBiddingDeedGrupResult: require('../data/auction/aucBiddingDeedGroupResult.json'),
  getResolutionLatest: require('../data/auction/resolutionLatest.json'),
};
