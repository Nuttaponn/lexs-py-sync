import { LitigationDetailDto } from "@lexs/lexs-client";

export const DATA_BY_ID: LitigationDetailDto = {
  "litigationId": "MOCKD0001",
  "customerId": "000004479122",
  "responseUnitCode": "108423",
  "responseUnitName": "สำนักงานธุรกิจนครราชสีมา",
  "branchCode": "000303",
  "customerName": "NAME_000004479122",
  "litigationStatus": "อนุมัติให้ดำเนินคดี",
  "defermentStatus": "NORMAL",
  "editStatus": "NONE",
  "lawyerOfficeCode": "1000",
  "lawyerOfficeName": "บจ.กรุงไทยกฎหมาย (สำนักงานใหญ่)",
  "lawyerId": "k7723T",
  "lawyerName": "นาย บุญประกอบ จองจิตบริสุทธิ์",
  "firstLawyerOfficeCode": "1000",
  "firstLawyerOfficeName": "บจ.กรุงไทยกฎหมาย (สำนักงานใหญ่)",
  "firstLawyerId": "k7723T",
  "firstLawyerName": "นาย บุญประกอบ จองจิตบริสุทธิ์",
  "litigationDate": "2022-07-12",
  "lawyerUser": {
    "userId": "k7723T",
    "category": "KLAW",
    "title": "นาย",
    "titleEng": "MR",
    "name": "บุญประกอบ",
    "surname": "จองจิตบริสุทธิ์",
    "nameEng": "Boonprakob",
    "surnameEng": "Jongjitborisut",
    "email": "boonprakob.jongjitborisut@ktblaw.co.th",
    "originalOrganizationCode": "1000",
    "originalOrganizationName": "บจ.กรุงไทยกฎหมาย (สำนักงานใหญ่)",
    "mobileNumber": "0923133423",
    "roleCode": "FINANCIAL1",
    "subRoleCode": "APPROVER",
    "dataScopeCode": "ORGANIZATION",
    "levelCode": "OFFICER",
    "factionCode": "LAW001",
    "authorityCode": "LAW001",
    "lastLogin": "2022-07-11T18:55:25+07:00"
  },
  "cases": [
    {
      "id": 34,
      "lawyerOfficeCode": "1000",
      "lawyerId": "k7723T",
      "lawyerName": "บุญประกอบ",
      "courtLevel": "CIVIL",
      "civilCourtBlackCaseNo": "BC012/2565",
      "blackCaseNo": "BC012",
      "courtCode": "101389",
      "courtName": "ศาลแขวงปทุมวัน",
      "capitalAmount": 300.00,
      "caseDate": "2022-07-02",
      "sla": "2022-07-02",
      "appealSide": "CUSTOMER",
      "appealDate": "2022-07-02",
      "courtVerdictDate": "2022-07-02",
      "appealDueDate": "2022-07-12"
    },
    {
      "id": 33,
      "lawyerOfficeCode": "1000",
      "lawyerId": "k7723T",
      "lawyerName": "บุญประกอบ",
      "courtLevel": "CIVIL",
      "civilCourtBlackCaseNo": "BC011/2565",
      "blackCaseNo": "BC011",
      "redCaseNo": "R011",
      "courtCode": "101389",
      "courtName": "ศาลแขวงปทุมวัน",
      "capitalAmount": 400.00,
      "caseDate": "2022-07-02",
      "sla": "2022-07-02",
      "appealSide": "CUSTOMER",
      "appealDate": "2022-07-02",
      "courtVerdictType": "ศาลพิพากษา",
      "courtVerdictDate": "2022-07-02",
      "courtDecreeDate": "2022-07-03",
      "courtDecreeResult": "พิพากษาให้ชำระหนี้เต็มตามฟ้อง",
      "appealDueDate": "2022-07-12"
    }
  ],
  "followups": [],
  "personInfo": {
    "persons": [
      {
        "personId": "000000081383",
        "personType": "JURISTIC",
        "relation": "CO_BORROWER",
        "identificationNo": "3105525025824",
        // "nameChanged": false,
        "name": "NAME_000000081383",
        "birthDate": "1982-07-21",
        "address": [],
        "bankruptcy": [
          {}
        ],
        "addressChanged": false,
        "sourceSystem": "CBS"
      },
      {
        "personId": "000000082769",
        "personType": "JURISTIC",
        "relation": "CO_BORROWER",
        "identificationNo": "3105537141534",
        // "nameChanged": false,
        "name": "NAME_000000082769",
        "birthDate": "1994-11-29",
        "address": [],
        "bankruptcy": [
          {}
        ],
        "addressChanged": false,
        "sourceSystem": "CBS"
      },
      {
        "personId": "000000082919",
        "personType": "JURISTIC",
        "relation": "GUARANTOR",
        "identificationNo": "3107537002152",
        // "nameChanged": false,
        "name": "NAME_000000082919",
        "birthDate": "1994-06-13",
        "address": [],
        "bankruptcy": [
          {}
        ],
        "addressChanged": false,
        "sourceSystem": "CBS"
      },
      {
        "personId": "000004479122",
        "personType": "JURISTIC",
        "relation": "MAIN_BORROWER",
        "identificationNo": "3303525000343",
        // "nameChanged": false,
        "name": "NAME_000004479122",
        "birthDate": "1982-05-26",
        "address": [],
        "bankruptcy": [
          {}
        ],
        "addressChanged": false,
        "sourceSystem": "CBS"
      }
    ],
    "additionalPersons": [],
    "casePerson": {
      "casePerson": {
        "33": [
          "000000081383",
          "000004479122"
        ],
        "34": [
          "000000082769",
          "000004479122"
        ]
      }
    }
  },
  "accountInfo": {
    "accounts": [
      {
        "accountId": "003036032398",
        "customerId": "000004479122",
        "accountNo": "003036032398",
        "billNo": "003036032398",
        "dpd": 0,
        // "loanTypeCode": "0010",
        // "loanTypeName": "เงินกู้เบิกเกินบัญชี",
        "outstandingBalance": 0.00,
        "outstandingAccruedInterest": 0.00,
        "interestNonBook": 0.00,
        "lateChargeAmount": 0,
        "expiryDate": "2023-06-30",
        "lastPaidDate": "2022-03-30",
        "contractDate": "2012-10-31",
        "bookingCode": "200303",
        "bookingName": "สาขาปากช่อง",
        "responseBranchCode": "108423",
        "responseBranchName": "สำนักงานธุรกิจนครราชสีมา",
        "lastUpdate": "2022-06-21T00:00:00+07:00",
        "litigationId": "MOCKD0001",
        "litigationStatus": "อนุมัติให้ดำเนินคดี",
        "limitAmount": 30000000.00,
        "accountStatus": "00",
        "cfinal": "C1"
      },
      {
        "accountId": "100006352065",
        "customerId": "000004479122",
        "accountNo": "100004474892",
        "billNo": "100006352065",
        "dpd": 7205,
        // "loanTypeCode": "4157",
        // "loanTypeName": "หนังสือค้ำประกันการใช้กระแสไฟฟ้า",
        "outstandingBalance": 40000.00,
        "outstandingAccruedInterest": 0.00,
        "interestNonBook": 0.00,
        "lateChargeAmount": 0.00,
        "prescriptionDate": "2004-09-30",
        "expiryDate": "2023-06-30",
        "lastPaidDate": "2021-08-31",
        "contractDate": "1994-09-30",
        "bookingCode": "200303",
        "bookingName": "สาขาปากช่อง",
        "responseBranchCode": "108423",
        "responseBranchName": "สำนักงานธุรกิจนครราชสีมา",
        "lastUpdate": "2022-06-21T00:00:00+07:00",
        "litigationId": "MOCKD0001",
        "litigationStatus": "อนุมัติให้ดำเนินคดี",
        "limitAmount": 40000.00,
        "accountStatus": "00",
        "cfinal": "N/A"
      },
      {
        "accountId": "100029670199",
        "customerId": "000004479122",
        "accountNo": "100029669928",
        "billNo": "100029670199",
        "dpd": 265,
        // "loanTypeCode": "4157",
        // "loanTypeName": "หนังสือค้ำประกันการใช้กระแสไฟฟ้า",
        "outstandingBalance": 64000.00,
        "outstandingAccruedInterest": 0.00,
        "interestNonBook": 0.00,
        "lateChargeAmount": 0.00,
        "prescriptionDate": "2019-07-20",
        "expiryDate": "2023-06-30",
        "lastPaidDate": "2021-08-31",
        "contractDate": "2009-07-20",
        "bookingCode": "200303",
        "bookingName": "สาขาปากช่อง",
        "responseBranchCode": "108423",
        "responseBranchName": "สำนักงานธุรกิจนครราชสีมา",
        "lastUpdate": "2022-06-21T00:00:00+07:00",
        "litigationId": "MOCKD0001",
        "litigationStatus": "อนุมัติให้ดำเนินคดี",
        "limitAmount": 64000.00,
        "accountStatus": "00",
        "cfinal": "N/A"
      },
      {
        "accountId": "100052612895",
        "customerId": "000004479122",
        "accountNo": "100052612895",
        "billNo": "100052612895",
        "dpd": 0,
        // "loanTypeCode": "4002",
        // "loanTypeName": "รับซื้อตั๋วเงิน(ในท้องถิ่น)",
        "outstandingBalance": 0.00,
        "outstandingAccruedInterest": 0,
        "interestNonBook": 0,
        "lateChargeAmount": 0,
        "prescriptionDate": "2026-06-30",
        "expiryDate": "2023-06-30",
        "contractDate": "2012-10-31",
        "bookingCode": "200303",
        "bookingName": "สาขาปากช่อง",
        "responseBranchCode": "108423",
        "responseBranchName": "สำนักงานธุรกิจนครราชสีมา",
        "lastUpdate": "2022-06-21T00:00:00+07:00",
        "litigationId": "MOCKD0001",
        "litigationStatus": "อนุมัติให้ดำเนินคดี",
        "limitAmount": 20000000.00,
        "accountStatus": "00",
        "cfinal": "N/A"
      },
      {
        "accountId": "100058834820",
        "customerId": "000004479122",
        "accountNo": "100058834208",
        "billNo": "100058834820",
        "dpd": 2407,
        // "loanTypeCode": "4113",
        // "loanTypeName": "หนังสือค้ำประกันการปฏิบัติตามสัญญา",
        "outstandingBalance": 200000.00,
        "outstandingAccruedInterest": 0.00,
        "interestNonBook": 0.00,
        "lateChargeAmount": 0.00,
        "prescriptionDate": "2023-11-19",
        "expiryDate": "2023-06-30",
        "lastPaidDate": "2022-03-25",
        "contractDate": "2013-11-19",
        "bookingCode": "200303",
        "bookingName": "สาขาปากช่อง",
        "responseBranchCode": "108423",
        "responseBranchName": "สำนักงานธุรกิจนครราชสีมา",
        "lastUpdate": "2022-06-21T00:00:00+07:00",
        "litigationId": "MOCKD0001",
        "litigationStatus": "อนุมัติให้ดำเนินคดี",
        "limitAmount": 200000.00,
        "accountStatus": "00",
        "cfinal": "N/A"
      },
      {
        "accountId": "100066939675",
        "customerId": "000004479122",
        "accountNo": "100066930953",
        "billNo": "100066939675",
        "dpd": 2372,
        // "loanTypeCode": "4113",
        // "loanTypeName": "หนังสือค้ำประกันการปฏิบัติตามสัญญา",
        "outstandingBalance": 200000.00,
        "outstandingAccruedInterest": 0.00,
        "interestNonBook": 0.00,
        "lateChargeAmount": 0.00,
        "prescriptionDate": "2024-12-24",
        "expiryDate": "2023-06-30",
        "lastPaidDate": "2021-12-14",
        "contractDate": "2014-12-24",
        "bookingCode": "200303",
        "bookingName": "สาขาปากช่อง",
        "responseBranchCode": "108423",
        "responseBranchName": "สำนักงานธุรกิจนครราชสีมา",
        "lastUpdate": "2022-06-21T00:00:00+07:00",
        "litigationId": "MOCKD0001",
        "litigationStatus": "อนุมัติให้ดำเนินคดี",
        "limitAmount": 200000.00,
        "accountStatus": "00",
        "cfinal": "N/A"
      },
      {
        "outstandingBalance": 0,
        "outstandingAccruedInterest": 0,
        "interestNonBook": 0,
        "lateChargeAmount": 0,
        "litigationId": "MOCKD0001",
        "litigationStatus": "อนุมัติให้ดำเนินคดี",
        "limitAmount": 0
      }
    ],
    "summaryAll": 504000.00,
    "totalOutstandingPrincipal": 504000.00,
    "totalOutstandingAccruedInterest": 0.00,
    "totalInterestNonBook": 0.00,
    "totalLateChargeAmount": 0.00,
    "summaryDebt": 504000.00,
    "totalBadOutstandingPrincipal": 0,
    "totalBadOutstandingAccruedInterest": 0,
    "totalBadInterestNonBook": 0,
    "totalBadLateChargeAmount": 0,
    "summaryBadDebt": 0
  },
  "collateralInfo": {},

}

export const mock = {
  seizureId: '', //https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3093233860/EPIC+E05+-+Seizure+of+Property#ex_seizures
  seizureStatus: '', //https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/3093233860/EPIC+E05+-+Seizure+of+Property#ex_seizures
  lawyerId: '',
  lawyerName: '', //se_phone_book
  recommendLawyerId: '', //ex_seizures.recommend_lawyer_id
  selectedAppraisalValue: 1000000,
  assets: [
    {
      assetId: 1, // lw_litigation_case_non_pledge_assets.asset_id
      assetType: 1, //ex_non_pledge_assets.asset_type
      assetSubType: 1, //ex_non_pledge_assets.asset_sub_type
      assetTypeDesc: '', // ad_collateral_types.collateral_type_desc
      assetSubTypeDesc: '', //ad_collateral_sub_types.collateral_sub_type_desc
      documentNo: '', //ColType = 1,2 :ex_non_pledge_assets.document_no ColType = 3 : ex_non_pledge_assets.build_code ColType = 4 : ex_non_pledge_assets.room_no ColType = 5 : ex_non_pledge_assets.machine_no ถ้าไม่มีแสดง '-'
      collateralDetails: '', // https://ktbinnovation.atlassian.net/browse/LEX2-26764 field name รายละเอียด : 1. Change [RLS>LEXS] to ex_non_pledge_assets 2. Change camel case field name to snake case
      ownerFullName: '', // Join from ex_non_pledge_asset_owners if more than one owner found , just concatenate all name. https://ktbinnovation.atlassian.net/browse/LEX2-26764 field name เจ้าของกรรมสิทธิ์ 1. Change [RLS>LEXS] to ex_non_pledge_asset_owners 2. Change camel case field name to snake case
      totalAppraisalValue: 1000000.0, // total_lo_appraisal_value from ex_non_pledge_assets
      collateralCaseLexStatus: 'PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/', // lw_litigation_case_non_pledge_assets.non_pledge_case_lex_status
      assentRlsStatus: 'ไม่มี', // ex_non_pledge_assets.asset_status
      obligationStatus: 'ไม่มี', // ex_non_pledge_assets.obligation_status
      isSelected: true, // if first time select all (exclude disable) else select follow by ex_seizure_collaterals
      disabled: true, // (true when lw_litigation_case_non_pledge_assets.non_pledge_case_lex_status <> 'PLEDGE' || seizureStatus=IN_PROGRESS) otherwise false
      seizureStatus: 'null/IN_PROGRESS/COMPLETED',
      seizuredByLitigationId: null, // lw_litigation_case_non_pledge_assets
      seizuredByCaseId: null, //lw_litigation_case_non_pledge_assets
      seizuredBySeizureId: '', //lw_litigation_case_non_pledge_assets
      seizuredByParty: null, //lw_litigation_case_non_pledge_assets
      assetDocuments: [
        // LEXSD211 LEXSD212 LEXSD213 LEXSD214 LEXSD215 LEXSD216 LEXSD217 LEXSD218 LEXSD219 LEXSD220 LEXSD221 LEXSD227 inquiry gn_lexs_documents where object_type="ASSET" and object_id=assetId
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
    },
    {
      assetId: 2, // lw_litigation_case_non_pledge_assets.asset_id
      assetType: 1, //ex_non_pledge_assets.asset_type
      assetSubType: 1, //ex_non_pledge_assets.asset_sub_type
      assetTypeDesc: '', // ad_collateral_types.collateral_type_desc
      assetSubTypeDesc: '', //ad_collateral_sub_types.collateral_sub_type_desc
      documentNo: '', //ColType = 1,2 :ex_non_pledge_assets.document_no ColType = 3 : ex_non_pledge_assets.build_code ColType = 4 : ex_non_pledge_assets.room_no ColType = 5 : ex_non_pledge_assets.machine_no ถ้าไม่มีแสดง '-'
      collateralDetails: '', // https://ktbinnovation.atlassian.net/browse/LEX2-26764 field name รายละเอียด : 1. Change [RLS>LEXS] to ex_non_pledge_assets 2. Change camel case field name to snake case
      ownerFullName: '', // Join from ex_non_pledge_asset_owners if more than one owner found , just concatenate all name. https://ktbinnovation.atlassian.net/browse/LEX2-26764 field name เจ้าของกรรมสิทธิ์ 1. Change [RLS>LEXS] to ex_non_pledge_asset_owners 2. Change camel case field name to snake case
      totalAppraisalValue: 1000000.0, // total_lo_appraisal_value from ex_non_pledge_assets
      collateralCaseLexStatus: 'PLEDGE(ไม่ถูกอายัด/ยึด/ขาย)/SEIZURED(ยึดทรัพย์)/', // lw_litigation_case_non_pledge_assets.non_pledge_case_lex_status
      assentRlsStatus: 'ไม่มี', // ex_non_pledge_assets.asset_status
      obligationStatus: 'ไม่มี', // ex_non_pledge_assets.obligation_status
      isSelected: true, // ex_non_pledge_assets.obligation_status
      disabled: true, // (true when lw_litigation_case_non_pledge_assets.non_pledge_case_lex_status <> 'PLEDGE' || seizureStatus=IN_PROGRESS) otherwise false
      seizureStatus: 'null/IN_PROGRESS/COMPLETED',
      seizuredByLitigationId: null, // lw_litigation_case_non_pledge_assets
      seizuredByCaseId: null, //lw_litigation_case_non_pledge_assets
      seizuredBySeizureId: '', //lw_litigation_case_non_pledge_assets
      seizuredByParty: null, //lw_litigation_case_non_pledge_assets
      assetDocument: [],
    },
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

  processingDocument: [
    {
      documentId: 111,
      documentTemplate: {
        documentTemplateId: 'cc',
        documentName: 'cccc',
      },
      imageSource: 'ccc',
      imageId: 'ccc',
      imageName: 'ccc',
      uploadTimestamp: '',

      documentType: 'CASE', //CASE PERSON ACCOUNT
      cifNo: 'cccc', // for documentType=PERSON, Inquiry from gn_persons
      taxId: 'ccc', // for documentType=PERSON, If gn_persons.person_type='INDIVIDUAL' then gn_persons.identification_no else gn_persons.tax_no
      name: 'ccc', // for documentType=PERSON, Inquiry from gn_persons (titile+first_name+ " "+ last_name)
      relation: '', // for documentType=PERSON, Inquiry relation from lw_litigation_case_persons
    },
    {
      documentId: 111,
      documentTemplate: {
        documentTemplateId: 'cc',
        documentName: 'cccc',
      },
      imageSource: 'ccc',
      imageId: 'ccc',
      imageName: 'ccc',
      uploadTimestamp: '',

      documentType: 'CASE', //CASE PERSON ACCOUNT
      cifNo: 'cccc', // for documentType=PERSON, Inquiry from gn_persons
      taxId: 'ccc', // for documentType=PERSON, If gn_persons.person_type='INDIVIDUAL' then gn_persons.identification_no else gn_persons.tax_no
      name: 'ccc', // for documentType=PERSON, Inquiry from gn_persons (titile+first_name+ " "+ last_name)
      relation: '', // for documentType=PERSON, Inquiry relation from lw_litigation_case_persons
    },
    {
      documentId: 111,
      documentTemplate: {
        documentTemplateId: 'xxxx',
        documentName: 'xxx',
      },
      imageSource: '',
      imageId: 'xxxxx',
      imageName: 'xxxx',
      uploadTimestamp: '',

      documentType: 'PERSON', //CASE PERSON ACCOUNT
      cifNo: 'xxxxx', // for documentType=PERSON, Inquiry from gn_persons
      taxId: 'xxxx', // for documentType=PERSON, If gn_persons.person_type='INDIVIDUAL' then gn_persons.identification_no else gn_persons.tax_no
      name: 'xxxx', // for documentType=PERSON, Inquiry from gn_persons (titile+first_name+ " "+ last_name)
      relation: 'CO_BORROWER', // for documentType=PERSON, Inquiry relation from lw_litigation_case_persons
    },
    {
      documentId: 111,
      documentTemplate: {
        documentTemplateId: 'xxxx',
        documentName: 'xxx',
      },
      imageSource: '',
      imageId: 'xxxxx',
      imageName: 'xxxx',
      uploadTimestamp: '',

      documentType: 'PERSON', //CASE PERSON ACCOUNT
      cifNo: 'xxxxx', // for documentType=PERSON, Inquiry from gn_persons
      taxId: 'xxxx', // for documentType=PERSON, If gn_persons.person_type='INDIVIDUAL' then gn_persons.identification_no else gn_persons.tax_no
      name: 'xxxx', // for documentType=PERSON, Inquiry from gn_persons (titile+first_name+ " "+ last_name)
      relation: 'MAIN_BORROWER', // for documentType=PERSON, Inquiry relation from lw_litigation_case_persons
    },
    {
      documentId: 111,
      documentTemplate: {
        documentTemplateId: 'xxxx',
        documentName: 'xxx',
      },
      imageSource: '',
      imageId: 'ssss',
      imageName: 's',
      uploadTimestamp: '',

      documentType: 'PERSON', //CASE PERSON ACCOUNT
      cifNo: 'ss', // for documentType=PERSON, Inquiry from gn_persons
      taxId: 'ss', // for documentType=PERSON, If gn_persons.person_type='INDIVIDUAL' then gn_persons.identification_no else gn_persons.tax_no
      name: 'xsssx', // for documentType=PERSON, Inquiry from gn_persons (titile+first_name+ " "+ last_name)
      relation: 'GUARANTOR', // for documentType=PERSON, Inquiry relation from lw_litigation_case_persons
    },
    {
      documentId: 111,
      documentTemplate: {
        documentTemplateId: '',
        documentName: 'zzzzzzz',
      },
      imageSource: '',
      imageId: 'zzzz',
      imageName: 'zzzz',
      uploadTimestamp: '',

      documentType: 'ACCOUNT', //CASE PERSON ACCOUNT
      cifNo: 'zzzz', // for documentType=PERSON, Inquiry from gn_persons
      taxId: 'zzzzz', // for documentType=PERSON, If gn_persons.person_type='INDIVIDUAL' then gn_persons.identification_no else gn_persons.tax_no
      name: 'zzzzz', // for documentType=PERSON, Inquiry from gn_persons (titile+first_name+ " "+ last_name)
      relation: '', // for documentType=PERSON, Inquiry relation from lw_litigation_case_persons
    },
    {
      documentId: 111,
      documentTemplate: {
        documentTemplateId: '',
        documentName: 'zzzzzzz',
      },
      imageSource: '',
      imageId: 'zzzz',
      imageName: 'zzzz',
      uploadTimestamp: '',

      documentType: 'ACCOUNT', //CASE PERSON ACCOUNT
      cifNo: 'zzzz', // for documentType=PERSON, Inquiry from gn_persons
      taxId: 'zzzzz', // for documentType=PERSON, If gn_persons.person_type='INDIVIDUAL' then gn_persons.identification_no else gn_persons.tax_no
      name: 'zzzzz', // for documentType=PERSON, Inquiry from gn_persons (titile+first_name+ " "+ last_name)
      relation: '', // for documentType=PERSON, Inquiry relation from lw_litigation_case_persons
    },




  ],
};
