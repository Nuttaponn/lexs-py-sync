import { LitigationDetailDto, LitigationNoticeDto, TaskDetailDto } from "@lexs/lexs-client";

export const REAL_POGCHAMP_NOTICE_DATA: LitigationNoticeDto[] = [
  {
    "noticeId": 367,
    "litigationId": "LE2022080026",
    "groupNo": 3,
    "personId": "175816",
    "personName": "นายname_000000175816 221",
    "relation": "COLLATERAL_OWNER",
    "noticeNo": "LE2022080026-C0005",
    "addressType": "REGISTRATION",
    "noticeStatus": "DRAFT_NOTICE",
    "personStatus": "ALIVE",
    "noticeType": "LETTER",
    "cifNo": "175816",
    "noticeTemplateNo": "3",
    "actionFlag": false,
    "documentTemplateId": "LEXSF001",
    "primaryCif": "10306234"
  },
  {
    "noticeId": 368,
    "litigationId": "LE2022080026",
    "groupNo": 3,
    "personId": "175816",
    "personName": "นายname_000000175816 221",
    "relation": "COLLATERAL_OWNER",
    "noticeNo": "LE2022080026-C0006",
    "addressType": "CONTRACT",
    "noticeStatus": "DRAFT_NOTICE",
    "personStatus": "ALIVE",
    "noticeType": "LETTER",
    "cifNo": "175816",
    "noticeTemplateNo": "3",
    "actionFlag": false,
    "documentTemplateId": "LEXSF001",
    "primaryCif": "10306234"
  },
  {
    "litigationId": "LE2022080026",
    "personId": "10306234",
    "personName": "นายname_000010306234 221",
    "relation": "MAIN_BORROWER",
    "personStatus": "DEATH",
    "actionFlag": true
  }
]

export const MODIFIED_REAL_POGCHAMP_NOTICE_NEWS_DATA: LitigationNoticeDto[] = [
  {
    "noticeId": 365,
    "litigationId": "LE2022080026",
    "groupNo": 3,
    "personId": "175816",
    "personName": "นายname_000000175816 221",
    "relation": "MAIN_BORROWER_HEIR",
    "noticeNo": "LE2022080026-C0005",
    "addressType": "REGISTRATION",
    "noticeStatus": "DRAFT_NOTICE",
    "personStatus": "ALIVE",
    "noticeType": "NEWS",
    "cifNo": "175816",
    "noticeTemplateNo": "3",
    "actionFlag": false,
    "documentTemplateId": "LEXSF001",
    "primaryCif": "10306234"
  },
  {
    "noticeId": 366,
    "litigationId": "LE2022080026",
    "groupNo": 3,
    "personId": "175816",
    "personName": "นายname_000000175816 221",
    "relation": "MAIN_BORROWER_HEIR",
    "noticeNo": "LE2022080026-C0006",
    "addressType": "CONTRACT",
    "noticeStatus": "DRAFT_NOTICE",
    "personStatus": "ALIVE",
    "noticeType": "NEWS",
    "cifNo": "175816",
    "noticeTemplateNo": "3",
    "actionFlag": false,
    "documentTemplateId": "LEXSF001",
    "primaryCif": "10306234"
  },
]

export const MODIFIED_REAL_POGCHAMP_NOTICE_DATA: LitigationNoticeDto[] = [
  {
    "noticeId": 367,
    "litigationId": "LE2022080026",
    "groupNo": 3,
    "personId": "175816",
    "personName": "นายname_000000175816 221",
    "relation": "MAIN_BORROWER_HEIR",
    "noticeNo": "LE2022080026-C0005",
    "addressType": "REGISTRATION",
    "noticeStatus": "DRAFT_NOTICE",
    "personStatus": "ALIVE",
    "noticeType": "LETTER",
    "cifNo": "175816",
    "noticeTemplateNo": "3",
    "actionFlag": false,
    "documentTemplateId": "LEXSF001",
    "primaryCif": "10306234"
  },
  {
    "noticeId": 368,
    "litigationId": "LE2022080026",
    "groupNo": 3,
    "personId": "175816",
    "personName": "นายname_000000175816 221",
    "relation": "MAIN_BORROWER_HEIR",
    "noticeNo": "LE2022080026-C0006",
    "addressType": "CONTRACT",
    "noticeStatus": "DRAFT_NOTICE",
    "personStatus": "ALIVE",
    "noticeType": "LETTER",
    "cifNo": "175816",
    "noticeTemplateNo": "3",
    "actionFlag": false,
    "documentTemplateId": "LEXSF001",
    "primaryCif": "10306234"
  },
  // {
  //   "litigationId": "LE2022080026",
  //   "personId": "10306234",
  //   "personName": "นายname_000010306234 221",
  //   "relation": "MAIN_BORROWER",
  //   "personStatus": "DEATH",
  //   "actionFlag": true
  // }
]

// ######### Yellow Coldplay #############
export const YELLOW_CARD_NOTICE_DATA: LitigationNoticeDto[] = [
  {
    "noticeId": 16,
    "litigationId": "LE2565080005",
    "groupNo": 1,
    "personId": "201942",
    "personName": "MOCKTITLEMOCKFIRST",
    "relation": "MAIN_BORROWER",
    "noticeNo": "LE2565080005-A0001",
    "addressType": "REGISTRATION",
    "addressDetail": " ตำบล สีลม อำเภอ เขตบางรัก จังหวัด กรุงเทพมหานคร",
    "noticeDate": "2022-09-01",
    "noticeDuration": 90,
    "noticeStatus": "SUCCESS_TRACKING",
    "personStatus": "OPEN",
    "noticeType": "LETTER",
    "cifNo": "201942",
    "taskId": 29231,
    "taskCode": "CONFIRM_NOTICE_LETTER",
    "noticeTemplateNo": "1",
    "successNoticeDate": "2022-08-25",
    "actionFlag": true,
    "taskUserId": "k3440",
    "noticeImageId": "c818a5ef-070d-4bc5-9766-82de5abaab46",
    "documentTemplateId": "LEXSF001",
    "primaryCif": "201942",
    "deliveryDescription": "ผู้รับได้รับสิ่งของเรียบร้อยแล้ว",
    "deliveryDateTime": "2022-08-25T09:26:46+07:00",
    "deliveryStatus": "S",
    "thaiPostStatus": "501",
    "thaiPostStatusDescription": "นำจ่ายสำเร็จ",
    "addressId": 10011,
    "trackingStatusName": "จัดส่งแล้ว",
    "barcode": "barcode_mock_eiei"
  },
  {
    "noticeId": 17,
    "litigationId": "LE2565080005",
    "groupNo": 1,
    "personId": "201942",
    "personName": "MOCKTITLEMOCKFIRST",
    "relation": "MAIN_BORROWER",
    "noticeNo": "LE2565080005-A0002",
    "addressType": "CONTRACT",
    "noticeDate": "2022-09-01",
    "noticeDuration": 90,
    "noticeStatus": "SUCCESS_TRACKING",
    "personStatus": "OPEN",
    "noticeType": "LETTER",
    "cifNo": "201942",
    "taskId": 29231,
    "taskCode": "CONFIRM_NOTICE_LETTER",
    "noticeTemplateNo": "1",
    "successNoticeDate": "2022-08-25",
    "actionFlag": true,
    "taskUserId": "k3440",
    "noticeImageId": "20e6a2a9-682e-4648-9b52-1bfe02995958",
    "documentTemplateId": "LEXSF001",
    "primaryCif": "201942",
    "deliveryDescription": "ผู้รับได้รับสิ่งของเรียบร้อยแล้ว",
    "deliveryDateTime": "2022-08-25T09:26:46+07:00",
    "deliveryStatus": "S",
    "thaiPostStatus": "501",
    "thaiPostStatusDescription": "นำจ่ายสำเร็จ",
    "trackingStatusName": "จัดส่งแล้ว",
    "barcode": "barcode_mock_eiei"
  }
]

export const YELLOW_CARD_TASK_DETAIL: TaskDetailDto = {
  "id": 29231,
  "litigationId": "LE2565080005",
  "userId": "k3440",
  "username": "นางสาว นัทศริน เบ็ญการีม",
  "createdBy": "k3440",
  "createdTime": "2022-09-02T12:59:25+07:00",
  "startDate": "2022-09-02",
  "dueDate": "2022-10-18",
  "statusCode": "PENDING",
  "statusName": "รอดำเนินงาน",
  "taskCode": "CONFIRM_NOTICE_LETTER",
  "scopeName": "บอกกล่าวทวงถาม",
  "daysSla": 30,
  "taskActionHistories": [
    {
      "userId": "k3440",
      "username": "นางสาว นัทศริน เบ็ญการีม",
      "actionCode": "AUTO_WHEN_STATUS_SENT",
      "actionName": "Auto เมื่อ สถานะการบอกกล่าว = จัดส่งแล้ว",
      "startDateTime": "2022-09-02T12:59:25+07:00"
    }
  ]
}

// : LitigationDetailDto
export const REAL_LITIGATION_DETAIL: LitigationDetailDto = {
  "litigationId": "LE2565080005",
  "customerId": "201942",
  "responseUnitCode": "108094",
  "responseUnitName": "สำนักงานธุรกิจสุรวงศ์",
  "amdResponseUnitCode": "108785",
  "approvalResponseUnitCode": "108785",
  "branchCode": "108019",
  "customerName": "NAME_000000201942",
  "litigationStatus": "อนุมัติให้ดำเนินคดี",
  "lawyerOfficeCode": "1000",
  "lawyerOfficeName": "บจ.กรุงไทยกฎหมาย (สำนักงานใหญ่)",
  "lawyerId": "k3440",
  "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
  "firstLawyerOfficeCode": "1000",
  "firstLawyerOfficeName": "บจ.กรุงไทยกฎหมาย (สำนักงานใหญ่)",
  "firstLawyerId": "k3440",
  "firstLawyerName": "นางสาว นัทศริน เบ็ญการีม",
  "litigationDate": "2022-08-31",
  "lawyerUser": {
    "userId": "k3440",
    "category": "KLAW",
    "title": "นางสาว",
    "titleEng": "MISS",
    "name": "นัทศริน",
    "surname": "เบ็ญการีม",
    "nameEng": "Natsarin",
    "surnameEng": "Benkareem",
    "email": "natsarin.benkareem@ktblaw.co.th",
    "originalOrganizationCode": "1000",
    "originalOrganizationName": "บจ.กรุงไทยกฎหมาย (สำนักงานใหญ่)",
    "position": "xxx",
    "mobileNumber": "0987676875",
    "roleCode": "KLAW_USER",
    "subRoleCode": "MAKER",
    "dataScopeCode": "ORGANIZATION",
    "levelCode": "OFFICER",
    "organizationCode": "",
    "groupCode": "",
    "factionCode": "",
    "teamCode": "",
    "authorityCode": "LAW004",
    "lastLogin": "2022-09-04T13:50:53+07:00"
  },
  "cases": [

  ],
  "followups": [

  ],
  "personInfo": {
    "persons": [
      {
        "personId": "201942",
        "personType": "JURISTIC",
        "relation": "MAIN_BORROWER",
        "identificationNo": "0105538089672",
        "personStatus": "OPEN",
        "name": "MOCKTITLEMOCKFIRST MOCKLAST",
        "birthDate": "1995-07-28",
        "address": [
          {
            "personId": "201942",
            "addressLine": "",
            "addressType": "REGISTRATION",
            "lastUpdate": "2022-08-31",
            "sourceSystem": "DBD",
            "subdistrictName": "สีลม",
            "districtName": "เขตบางรัก",
            "provinceName": "กรุงเทพมหานคร",
            "countryCode": "TH"
          }
        ],
        "bankruptcy": [
          {
            //  "brsStatus":"-"
          }
        ],
        "sourceSystem": "CBS"
      }
    ],
    "additionalPersons": [

    ],
    "casePerson": {
      "casePerson": {

      }
    }
  },
  "accountInfo": {
    "accounts": [
      {
        "accountId": "100083191536",
        "customerId": "201942",
        "accountNo": "100062504006",
        "billNo": "100083191536",
        "dpd": 1266,
        //  "outstandingBalance":"0.00",
        //  "outstandingAccruedInterest":"0.00",
        //  "interestNonBook":"0.00",
        //  "lateChargeAmount":"6548921.73",
        "prescriptionDate": "2022-01-03",
        "expiryDate": "2019-01-03",
        "contractDate": "2014-06-04",
        "bookingCode": "108019",
        "responseBranchCode": "108094",
        "responseBranchName": "สำนักงานธุรกิจสุรวงศ์",
        "tdrTrackingResult": "5",
        "tdrStatus": "43",
        "lastUpdate": "2022-06-21T00:00:00+07:00",
        "litigationId": "LE2565080005",
        "litigationStatus": "อนุมัติให้ดำเนินคดี",
        "marketCode": "4002",
        "marketDescription": "รับซื้อตั๋วเงิน(ในท้องถิ่น)",
        //  "limitAmount":"0.00",
        "accountStatus": "16",
        "cfinal": "N/A"
      },
      {
        "accountId": "100091525169",
        "customerId": "201942",
        "accountNo": "100062504006",
        "billNo": "100091525169",
        "dpd": 1330,
        //  "outstandingBalance":"57550000.00",
        //  "outstandingAccruedInterest":"0.00",
        //  "interestNonBook":"15640781.32",
        //  "lateChargeAmount":"18130820.94",
        "prescriptionDate": "2022-01-03",
        "expiryDate": "2019-01-03",
        "contractDate": "2014-06-04",
        "bookingCode": "108019",
        "responseBranchCode": "108094",
        "responseBranchName": "สำนักงานธุรกิจสุรวงศ์",
        "tdrTrackingResult": "5",
        "tdrStatus": "43",
        "lastUpdate": "2022-06-21T00:00:00+07:00",
        "litigationId": "LE2565080005",
        "litigationStatus": "อนุมัติให้ดำเนินคดี",
        "marketCode": "4002",
        "marketDescription": "รับซื้อตั๋วเงิน(ในท้องถิ่น)",
        //  "limitAmount":"0.00",
        "accountStatus": "16",
        "cfinal": "C5"
      }
    ],
    "commitmentAccounts": [
      {
        "accountNumber": "100062504006",
        "accountName": "NAME_100062504006",
        "accountType": "PN",
        //  "totalDebt":"97870523.99",
        "accountLinkages": [

        ]
      }
    ],
    //  "summaryAll":"97870523.99",
    //  "totalOutstandingPrincipal":"57550000.00",
    //  "totalOutstandingAccruedInterest":"0.00",
    //  "totalInterestNonBook":"15640781.32",
    //  "totalLateChargeAmount":"24679742.67",
    //  "summaryDebt":"97870523.99",
    //  "totalBadOutstandingPrincipal":"0",
    //  "totalBadOutstandingAccruedInterest":"0",
    //  "totalBadInterestNonBook":"0",
    //  "totalBadLateChargeAmount":"0",
    //  "summaryBadDebt":"0"
  },
  "collateralInfo": {

  },
  "documentInfo": {
    "customerDocuments": [

    ],
    "litigationDocuments": [
      {
        "documentId": 832246,
        "imageSource": "LEXS",
        "imageId": "20e6a2a9-682e-4648-9b52-1bfe02995958",
        "imageName": "DeliveryKTB_Test.pdf",
        "documentTemplate": {
          "documentTemplateId": "LEXSF001",
          "documentName": "หนังสือบอกกล่าว",
          "searchType": "LEXS",
          "documentGroup": "NOTICE",
          "needHardCopy": false,
          "optional": false,
          "forNoticeLetter": false,
          "forLitigation": false,
          "requiredDocumentDate": true,
          "contentType": "application/pdf"
        },
        "active": true,
        "uploadUserId": "k3440",
        "documentTemplateId": "LEXSF001",
        "customerId": "201942"
      },
      {
        "documentId": 832247,
        "imageSource": "LEXS",
        "imageId": "c818a5ef-070d-4bc5-9766-82de5abaab46",
        "imageName": "DeliveryOTB_Test.pdf",
        "documentTemplate": {
          "documentTemplateId": "LEXSF001",
          "documentName": "หนังสือบอกกล่าว",
          "searchType": "LEXS",
          "documentGroup": "NOTICE",
          "needHardCopy": false,
          "optional": false,
          "forNoticeLetter": false,
          "forLitigation": false,
          "requiredDocumentDate": true,
          "contentType": "application/pdf"
        },
        "active": true,
        "uploadUserId": "k3440",
        "documentTemplateId": "LEXSF001",
        "customerId": "201942"
      }
    ],
    "preparationCompleted": true
  }
}
// export const REAL_LITIGATION_DETAIL: LitigationDetailDto = {
//   "litigationId": "LE2022080026",
//   "customerId": "10306234",
//   "responseUnitCode": "108262",
//   "responseUnitName": "สำนักงานธุรกิจราชวงศ์",
//   "amdResponseUnitCode": "108346",
//   "amdResponseUnitName": "ฝ่ายปรับโครงสร้างหนี้ 7",
//   "approvalResponseUnitCode": "100000",
//   "approvalResponseUnitName": "Test mock data by Aor",
//   "branchCode": "000001",
//   "branchName": "สาขาเยาวราช",
//   "customerName": "นายname_000010306234 221",
//   "litigationStatus": "อนุมัติให้ดำเนินคดี",
//   "defermentStatus": "NORMAL",
//   "editStatus": "NONE",
//   "mainBorrowerLitigationStatus": "อนุมัติให้ดำเนินคดี",
//   "coBorrowerLitigationStatus": "อนุมัติให้ดำเนินคดี",
//   "lawyerOfficeCode": "1000",
//   "lawyerOfficeName": "บจ.กรุงไทยกฎหมาย (สำนักงานใหญ่)",
//   "lawyerId": "k6054",
//   "lawyerName": "นาย สุรชัย เกตุสุข",
//   "firstLawyerOfficeCode": "1000",
//   "firstLawyerOfficeName": "บจ.กรุงไทยกฎหมาย (สำนักงานใหญ่)",
//   "firstLawyerId": "k6054",
//   "firstLawyerName": "นาย สุรชัย เกตุสุข",
//   "litigationDate": "2022-08-25",
//   "amdUser": {
//     "userId": "412041",
//     "category": "KTB",
//     "status": "A",
//     "title": "นาย",
//     "titleEng": "นาย",
//     "name": "นิชรสาร",
//     "surname": "กองแก้ว",
//     "nameEng": "นิชรสาร",
//     "surnameEng": "กองแก้ว",
//     "email": "",
//     "supervisorId": "460013",
//     "supervisorName": "นาย นันทวัต ชนีภาพ",
//     "supervisorEmail": "xxx@krungthai.com",
//     "supervisorMobileNumber": "0897676754",
//     "originalOrganizationCode": "108346",
//     "originalOrganizationName": "ฝ่ายปรับโครงสร้างหนี้ 7",
//     "position": "6030A"
//   },
//   "lawyerUser": {
//     "userId": "k6054",
//     "category": "KLAW",
//     "title": "นาย",
//     "titleEng": "Mr.",
//     "name": "สุรชัย",
//     "surname": "เกตุสุข",
//     "nameEng": "Surachai",
//     "surnameEng": "Getsuk",
//     "email": "xxx@ktblaw.co.th",
//     "supervisorId": "k6265",
//     "supervisorName": "นาย ทวีศักดิ์ แก้ววารี",
//     "supervisorEmail": "taweesak.kaewwaree@ktblaw.co.th",
//     "supervisorMobileNumber": "0987654321",
//     "originalOrganizationCode": "1000",
//     "originalOrganizationName": "บจ.กรุงไทยกฎหมาย (สำนักงานใหญ่)"
//   },
//   "cases": [],
//   "followups": [],
//   "personInfo": {
//     "persons": [
//       {
//         "personId": "10306234",
//         "personType": "INDIVIDUAL",
//         "relation": "MAIN_BORROWER",
//         "identificationNo": "0400470643100",
//         "personStatus": "DEATH",
//         "name": "นายname_000010306234 221",
//         "birthDate": "1947-05-05",
//         "address": [],
//         "bankruptcy": [
//           {
//             // "brsStatus": "-"
//           }
//         ],
//         "sourceSystem": "CBS"
//       },
//       {
//         "personId": "175816",
//         "personType": "INDIVIDUAL",
//         "relation": "COLLATERAL_OWNER",
//         "identificationNo": "0090006973100",
//         "personStatus": "ALIVE",
//         "name": "นายname_000000175816 221",
//         "birthDate": "1952-07-08",
//         "address": [],
//         "bankruptcy": [
//           {
//             // "brsStatus": "-"
//           }
//         ],
//         "sourceSystem": "CBS",
//         referencePersonId: "10306234"
//       }
//     ],
//     "additionalPersons": [],
//     "casePerson": {
//       "casePerson": {}
//     }
//   },
//   "accountInfo": {
//     "accounts": [
//       {
//         "accountId": "100000238171",
//         "customerId": "10306234",
//         "accountNo": "100000238171",
//         "billNo": "100000238171",
//         "dpd": 5239,
//         // "outstandingBalance": "0.00",
//         // "outstandingAccruedInterest": "0.00",
//         // "interestNonBook": "0.00",
//         // "lateChargeAmount": "1580496.08",
//         "prescriptionDate": "2013-03-31",
//         "expiryDate": "2008-03-31",
//         "lastPaidDate": "2021-05-21",
//         "deliquencyDate": "2008-03-31",
//         "contractDate": "2003-07-11",
//         "bookingCode": "200001",
//         "bookingName": "สาขาเยาวราช",
//         "responseBranchCode": "108262",
//         "responseBranchName": "สำนักงานธุรกิจราชวงศ์",
//         "lastUpdate": "2022-08-03T00:00:00+07:00",
//         "litigationId": "LE2022080026",
//         "litigationStatus": "อนุมัติให้ดำเนินคดี",
//         "marketCode": "1001",
//         "marketDescription": "เงินกู้ประจำ - ทั่วไป",
//         // "limitAmount": "15000000.00",
//         "accountStatus": "00",
//         "cfinal": "N/A"
//       }
//     ],
//     "commitmentAccounts": [
//       {
//         "accountNumber": "100000238171",
//         "accountName": "name_000010306234",
//         "accountType": "FLEET_CARD",
//         // "totalDebt": "1580496.08",
//         "accountLinkages": []
//       }
//     ],
//     // "summaryAll": "1580496.08",
//     // "totalOutstandingPrincipal": "0.00",
//     // "totalOutstandingAccruedInterest": "0.00",
//     // "totalInterestNonBook": "0.00",
//     // "totalLateChargeAmount": "1580496.08",
//     // "summaryDebt": "1580496.08",
//     // "totalBadOutstandingPrincipal": "0",
//     // "totalBadOutstandingAccruedInterest": "0",
//     // "totalBadInterestNonBook": "0",
//     // "totalBadLateChargeAmount": "0",
//     // "summaryBadDebt": "0"
//   },
//   "collateralInfo": {
//     "collaterals": [
//       {
//         "collateralId": "68107",
//         "personId": "10306234",
//         "insurancePolicyNumber": "",
//         "litigationId": "LE2022080026",
//         "collateralTypeCode": "1",
//         "collateralTypeDesc": "ที่ดิน",
//         "collateralSubTypeCode": "1",
//         "collateralSubTypeDesc": "โฉนด",
//         "description": "ประเภทเอกสารสิทธิ์..โฉนด..เลขที่..5856..เลขที่ดิน/เล่มที่..-/-..หน้าสำรวจ/ระวาง..-/-..เนื้อที่..0..ไร่..3..งาน..81.00..ตร.วา ตำบล..หนองแขม..อำเภอ..ภาษีเจริญ..จังหวัด..กรุงเทพมหานคร",
//         "collateralStatusCode": "1",
//         "botCode": "286003",
//         "botSubCode": "0",
//         // "totalAppraisalValue": "61100000.00",
//         "appraisalDate": "2008-10-20",
//         "documentNo": "5856",
//         "subdistrictCode": "012",
//         "subDistrict": "หนองแขม",
//         "districtCode": "022",
//         "district": "ภาษีเจริญ",
//         "provinceCode": "010",
//         "province": "กรุงเทพมหานคร",
//         "areaRai": 0,
//         "areaNgan": 3,
//         // "areaSqrWa": "81.00",
//         "tcg": false,
//         "sourceSystem": "CMS",
//         "ownerId": "10306234",
//         "ownerName": "นายname_000010306234 221",
//         "accounts": [
//           "100000238171"
//         ]
//       },
//       {
//         "collateralId": "68116",
//         "personId": "10306234",
//         "insurancePolicyNumber": "",
//         "litigationId": "LE2022080026",
//         "collateralTypeCode": "1",
//         "collateralTypeDesc": "ที่ดิน",
//         "collateralSubTypeCode": "1",
//         "collateralSubTypeDesc": "โฉนด",
//         "description": "ประเภทเอกสารสิทธิ์..โฉนด..เลขที่..5857..เลขที่ดิน/เล่มที่..-/-..หน้าสำรวจ/ระวาง..-/-..เนื้อที่..0..ไร่..3..งาน..16.00..ตร.วา ตำบล..หนองแขม..อำเภอ..ภาษีเจริญ..จังหวัด..กรุงเทพมหานคร",
//         "collateralStatusCode": "1",
//         "botCode": "286003",
//         "botSubCode": "0",
//         // "totalAppraisalValue": "0.00",
//         "appraisalDate": "2008-10-20",
//         "documentNo": "5857",
//         "subdistrictCode": "012",
//         "subDistrict": "หนองแขม",
//         "districtCode": "022",
//         "district": "ภาษีเจริญ",
//         "provinceCode": "010",
//         "province": "กรุงเทพมหานคร",
//         "areaRai": 0,
//         "areaNgan": 3,
//         // "areaSqrWa": "16.00",
//         "tcg": false,
//         "sourceSystem": "CMS",
//         "ownerId": "10306234",
//         "ownerName": "นายname_000010306234 221",
//         "accounts": [
//           "100000238171"
//         ]
//       },
//       {
//         "collateralId": "2630577",
//         "personId": "175816",
//         "insurancePolicyNumber": "",
//         "litigationId": "LE2022080026",
//         "collateralTypeCode": "16",
//         "collateralTypeDesc": "โอนสิทธิเรียกร้องการรับเงิน",
//         "collateralSubTypeCode": "1",
//         "collateralSubTypeDesc": "โอนสิทธิเรียกร้องการรับเงิน",
//         "description": "ประเภทสัญญา..สัญญาเช่า..ประเภทหนังสือ..โอนสิทธิเรียกร้องการรับเงิน..เลขที่..AG22072563..มูลค่า..900,000.00..บาท",
//         "collateralStatusCode": "1",
//         "botCode": "286035",
//         "botSubCode": "1",
//         // "totalAppraisalValue": "900000.00",
//         "documentNo": "AG22072563",
//         "typeDescription": "สัญญาเช่า",
//         // "contractDate": "2022-08-25",
//         "tcg": false,
//         "sourceSystem": "CMS",
//         "ownerId": "175816",
//         "ownerName": "นายname_000000175816 221",
//         "accounts": [
//           "100000238171"
//         ]
//       }
//     ],
//     "assets": [],
//     "contracts": [
//       {
//         "contractId": "26013",
//         "contractDate": "2003-07-11",
//         // "pledgeAmount": "1500000000.00",
//         "contractRelationCode": "1",
//         "contractStatus": "0",
//         "pledgeSeq": "1",
//         "accounts": [
//           "100000238171",
//           "100000243608",
//           "100004194569"
//         ],
//         "collaterals": [
//           "68107",
//           "68116"
//         ],
//         "contractTypes": [
//           "ที่ดิน"
//         ]
//       },
//       {
//         "contractId": "6533780",
//         "contractDate": "2022-03-25",
//         // "pledgeAmount": "20000000.00",
//         "contractRelationCode": "1",
//         "contractStatus": "0",
//         "pledgeSeq": "1",
//         "accounts": [
//           "100000238171"
//         ],
//         "collaterals": [
//           "2630577"
//         ],
//         "contractTypes": [
//           "โอนสิทธิเรียกร้องการรับเงิน"
//         ]
//       }
//     ]
//   },
//   "documentInfo": {
//     "customerDocuments": [
//       {
//         "documentId": 253584,
//         "objectType": "PERSON",
//         "objectId": "10306234",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD002-1",
//           "documentName": "เอกสารบุคคลธรรมดา",
//           "searchType": "DIMS",
//           "documentGroup": "PERSON",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "autoMatchType": "PERSON",
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD002-1",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253591,
//         "objectType": "PERSON",
//         "objectId": "175816",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD002-2",
//           "documentName": "เอกสารบุคคลธรรมดา",
//           "searchType": "DIMS",
//           "documentGroup": "PERSON",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "autoMatchType": "PERSON",
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD002-2",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253581,
//         "objectType": "PERSON",
//         "objectId": "10306234",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD005",
//           "documentName": "สรุปภาระหนี้ (ระดับ CIF)",
//           "searchType": "LEXS",
//           "documentGroup": "PERSON",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD005",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253582,
//         "objectType": "PERSON",
//         "objectId": "10306234",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD006",
//           "documentName": "สรุปหลักประกัน",
//           "searchType": "LEXS",
//           "documentGroup": "PERSON",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD006",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253590,
//         "objectType": "PERSON",
//         "objectId": "175816",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD007",
//           "documentName": "ใบเปลี่ยนชื่อ",
//           "searchType": "LEXS",
//           "documentGroup": "PERSON",
//           "needHardCopy": true,
//           "optional": true,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": false,
//         "documentTemplateId": "LEXSD007",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253583,
//         "objectType": "PERSON",
//         "objectId": "10306234",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD007",
//           "documentName": "ใบเปลี่ยนชื่อ",
//           "searchType": "LEXS",
//           "documentGroup": "PERSON",
//           "needHardCopy": true,
//           "optional": true,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": false,
//         "documentTemplateId": "LEXSD007",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253592,
//         "objectType": "PERSON",
//         "objectId": "175816",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD008",
//           "documentName": "หนังสือแจ้งเปลี่ยนภูมิลำเนา",
//           "searchType": "LEXS",
//           "documentGroup": "PERSON",
//           "needHardCopy": true,
//           "optional": true,
//           "forNoticeLetter": false,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": false,
//         "documentTemplateId": "LEXSD008",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253585,
//         "objectType": "PERSON",
//         "objectId": "10306234",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD008",
//           "documentName": "หนังสือแจ้งเปลี่ยนภูมิลำเนา",
//           "searchType": "LEXS",
//           "documentGroup": "PERSON",
//           "needHardCopy": true,
//           "optional": true,
//           "forNoticeLetter": false,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": false,
//         "documentTemplateId": "LEXSD008",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253593,
//         "objectType": "PERSON",
//         "objectId": "175816",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD009",
//           "documentName": "สำเนาใบมรณะบัตร",
//           "searchType": "LEXS",
//           "documentGroup": "PERSON",
//           "needHardCopy": true,
//           "optional": true,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": false,
//         "documentTemplateId": "LEXSD009",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253586,
//         "objectType": "PERSON",
//         "objectId": "10306234",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD009",
//           "documentName": "สำเนาใบมรณะบัตร",
//           "searchType": "LEXS",
//           "documentGroup": "PERSON",
//           "needHardCopy": true,
//           "optional": true,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": false,
//         "documentTemplateId": "LEXSD009",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253587,
//         "objectType": "PERSON",
//         "objectId": "10306234",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD010",
//           "documentName": "เอกสารแสดงการเป็นผู้จัดการมรดก",
//           "searchType": "LEXS",
//           "documentGroup": "PERSON",
//           "needHardCopy": true,
//           "optional": true,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": false,
//         "documentTemplateId": "LEXSD010",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253594,
//         "objectType": "PERSON",
//         "objectId": "175816",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD010",
//           "documentName": "เอกสารแสดงการเป็นผู้จัดการมรดก",
//           "searchType": "LEXS",
//           "documentGroup": "PERSON",
//           "needHardCopy": true,
//           "optional": true,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": false,
//         "documentTemplateId": "LEXSD010",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253588,
//         "objectType": "PERSON",
//         "objectId": "10306234",
//         "active": false,
//         "documentTemplateId": "LEXSD011",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253589,
//         "objectType": "PERSON",
//         "objectId": "10306234",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD012",
//           "documentName": "หนังสือแจ้งการทำ cross default และ ใบตอบรับของลูกค้าในการทำ cross default",
//           "searchType": "LEXS",
//           "documentGroup": "PERSON",
//           "needHardCopy": true,
//           "optional": true,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": false,
//         "documentTemplateId": "LEXSD012",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253619,
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD014",
//           "documentName": "ระบบ Profile Direct - หน้า Account List",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_CONTRACT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD014",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253620,
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD017",
//           "documentName": "หนังสือแจ้งลูกหนี้และผู้ค้ำประกันกรณีผิดเงื่อนไขที่ต้องปฏิบัติ (Covenant)",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_CONTRACT",
//           "needHardCopy": true,
//           "optional": true,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": false,
//         "documentTemplateId": "LEXSD017",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253607,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100004194569",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD018",
//           "documentName": "Statement บัญชี (ตั้งแต่เปิดบัญชี  – ปัจจุบัน)",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": false,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD018",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253608,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100004194569",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD019",
//           "documentName": "ระบบ Profile Direct - หน้า Account Overview",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD019",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253603,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000243608",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD019",
//           "documentName": "ระบบ Profile Direct - หน้า Account Overview",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD019",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253599,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000238171",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD019",
//           "documentName": "ระบบ Profile Direct - หน้า Account Overview",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD019",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253613,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000239041",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD019",
//           "documentName": "ระบบ Profile Direct - หน้า Account Overview",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD019",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253595,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000238134",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD019",
//           "documentName": "ระบบ Profile Direct - หน้า Account Overview",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD019",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253614,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000239041",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD020",
//           "documentName": "ระบบ Profile Direct - หน้า Pay Off",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD020",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253596,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000238134",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD020",
//           "documentName": "ระบบ Profile Direct - หน้า Pay Off",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD020",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253600,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000238171",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD020",
//           "documentName": "ระบบ Profile Direct - หน้า Pay Off",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD020",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253604,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000243608",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD020",
//           "documentName": "ระบบ Profile Direct - หน้า Pay Off",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD020",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253609,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100004194569",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD020",
//           "documentName": "ระบบ Profile Direct - หน้า Pay Off",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD020",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253610,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100004194569",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD021",
//           "documentName": "ระบบ Profile Direct - หน้า Account History",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD021",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253597,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000238134",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD021",
//           "documentName": "ระบบ Profile Direct - หน้า Account History",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD021",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253615,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000239041",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD021",
//           "documentName": "ระบบ Profile Direct - หน้า Account History",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD021",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253601,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000238171",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD021",
//           "documentName": "ระบบ Profile Direct - หน้า Account History",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD021",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253605,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000243608",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD021",
//           "documentName": "ระบบ Profile Direct - หน้า Account History",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD021",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253617,
//         "objectType": "BILL_NO",
//         "objectId": "100004194569",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD024",
//           "documentName": "คำขอทำธุรกรรม และตั๋วสัญญาใช้เงิน",
//           "searchType": "PN",
//           "documentGroup": "ACCOUNT_BILL",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": false,
//           "forLitigation": true,
//           "requiredDocumentDate": false,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD024",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253611,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100004194569",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD025",
//           "documentName": "รายละเอียดการคำนวณยอดหนี้ตั๋วเงินแต่ละฉบับ",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": true,
//           "forNoticeLetter": false,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": false,
//         "documentTemplateId": "LEXSD025",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253616,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000239041",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD033",
//           "documentName": "ใบแจ้งยอดการใช้จ่ายบัตรฟลีทการ์ดฉบับสำเนา",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD033",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253598,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000238134",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD033",
//           "documentName": "ใบแจ้งยอดการใช้จ่ายบัตรฟลีทการ์ดฉบับสำเนา",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD033",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253602,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000238171",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD033",
//           "documentName": "ใบแจ้งยอดการใช้จ่ายบัตรฟลีทการ์ดฉบับสำเนา",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD033",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253606,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100000243608",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD033",
//           "documentName": "ใบแจ้งยอดการใช้จ่ายบัตรฟลีทการ์ดฉบับสำเนา",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD033",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253618,
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD055",
//           "documentName": "หลักฐานการนำเงินฝากเข้าหักชำระหนี้",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_OTHER",
//           "needHardCopy": true,
//           "optional": true,
//           "forNoticeLetter": false,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": false,
//         "documentTemplateId": "LEXSD055",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253612,
//         "objectType": "ACCOUNT_NO",
//         "objectId": "100004194569",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD057",
//           "documentName": "หนังสือแจ้งการทำ call default และ ใบตอบรับของลูกค้าในการทำ call default",
//           "searchType": "LEXS",
//           "documentGroup": "ACCOUNT_COMMITMENT",
//           "needHardCopy": true,
//           "optional": true,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": false,
//         "documentTemplateId": "LEXSD057",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253637,
//         "objectType": "CONTRACT",
//         "objectId": "2519486",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD058",
//           "documentName": "สัญญาจำนอง-โฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL_CONTRACT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD058",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253638,
//         "objectType": "CONTRACT",
//         "objectId": "2519487",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD139",
//           "documentName": "สัญญาหลักประกันทางธุรกิจ และแบบแจ้งข้อมูลการจดทะเบียนสัญญาสัญญาหลักประกันทางธุรกิจ",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL_CONTRACT",
//           "needHardCopy": true,
//           "optional": false,
//           "forNoticeLetter": false,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD139",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253622,
//         "objectType": "COLLATERAL",
//         "objectId": "246817",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253623,
//         "objectType": "COLLATERAL",
//         "objectId": "68107",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253624,
//         "objectType": "COLLATERAL",
//         "objectId": "68116",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253625,
//         "objectType": "COLLATERAL",
//         "objectId": "246631",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253626,
//         "objectType": "COLLATERAL",
//         "objectId": "246598",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253627,
//         "objectType": "COLLATERAL",
//         "objectId": "246831",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253628,
//         "objectType": "COLLATERAL",
//         "objectId": "246820",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253629,
//         "objectType": "COLLATERAL",
//         "objectId": "246735",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253630,
//         "objectType": "COLLATERAL",
//         "objectId": "246669",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253631,
//         "objectType": "COLLATERAL",
//         "objectId": "246814",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253632,
//         "objectType": "COLLATERAL",
//         "objectId": "35767",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253633,
//         "objectType": "COLLATERAL",
//         "objectId": "246682",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253634,
//         "objectType": "COLLATERAL",
//         "objectId": "27793",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253636,
//         "objectType": "COLLATERAL",
//         "objectId": "2018615",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253621,
//         "objectType": "COLLATERAL",
//         "objectId": "246827",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD140",
//           "documentName": "สำเนาโฉนดที่ดิน",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": true,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD140",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253635,
//         "objectType": "COLLATERAL",
//         "objectId": "1166536",
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD150",
//           "documentName": "สิทธิการเช่าสิ่งปลูกสร้าง",
//           "searchType": "DIMS",
//           "documentGroup": "COLLATERAL",
//           "needHardCopy": false,
//           "optional": false,
//           "forNoticeLetter": false,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD150",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       },
//       {
//         "documentId": 253639,
//         "documentTemplate": {
//           "documentTemplateId": "LEXSD188",
//           "documentName": "ตารางรายละเอียดหลักประกันกรณีโครงการจัดสรร (แยกรายแปลง/รายห้อง) พร้อม file",
//           "searchType": "LEXS",
//           "documentGroup": "COLLATERAL_OTHER",
//           "needHardCopy": true,
//           "optional": true,
//           "forNoticeLetter": false,
//           "forLitigation": true,
//           "requiredDocumentDate": true,
//           "contentType": "application/pdf"
//         },
//         "active": true,
//         "documentTemplateId": "LEXSD188",
//         "commitmentAccounts": [],
//         "customerId": "10306234"
//       }
//     ],
//     "litigationDocuments": [],
//     "preparationCompleted": true
//   }
// }
