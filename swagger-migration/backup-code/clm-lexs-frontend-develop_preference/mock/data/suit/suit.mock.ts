import { LitigationCaseGroupDto } from '@lexs/lexs-client';
import { MOCK_BANK_APPEAL, MOCK_BANK_SUPREME, MOCK_CUSTOMER_APPEAL, MOCK_CUSTOMER_SUPREME } from './efiling-form/appeal-mock.constant';

export const GROUP_ARRAY_MOCK_PART: LitigationCaseGroupDto[] = [
  {
    "caseGroupNo": "2",
    "caseGroupKey": "10035",
    "lawyerOfficeCode": "1000",
    "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
    "lawyerId": "K3440",
    "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
    "cases": [
      {
        // "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035000000,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "APPEAL",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      },
      {
        // "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "CIVIL",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      }
    ]
  }
]

export const GROUP_ARRAY_MOCK_CONTAIN_BANK_APPEAL: LitigationCaseGroupDto[] = [
  {
    "caseGroupNo": "1",
    "caseGroupKey": "10035",
    "lawyerOfficeCode": "1000",
    "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
    "lawyerId": "K3440",
    "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
    cases: [
      MOCK_BANK_APPEAL
    ]
  },
  ...GROUP_ARRAY_MOCK_PART
]

export const GROUP_ARRAY_MOCK_CONTAIN_CUSTOMER_APPEAL: LitigationCaseGroupDto[] = [
  {
    "caseGroupNo": "1",
    "caseGroupKey": "10035",
    "lawyerOfficeCode": "1000",
    "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
    "lawyerId": "K3440",
    "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
    cases: [
      MOCK_CUSTOMER_APPEAL
    ]
  },
  ...GROUP_ARRAY_MOCK_PART
]

export const GROUP_ARRAY_MOCK_CONTAIN_BANK_SUPREME: LitigationCaseGroupDto[] = [
  {
    "caseGroupNo": "1",
    "caseGroupKey": "10035",
    "lawyerOfficeCode": "1000",
    "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
    "lawyerId": "K3440",
    "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
    cases: [
      MOCK_BANK_SUPREME
    ]
  },
  ...GROUP_ARRAY_MOCK_PART
]

export const GROUP_ARRAY_MOCK_CONTAIN_CUSTOMER_SUPREME: LitigationCaseGroupDto[] = [
  {
    "caseGroupNo": "1",
    "caseGroupKey": "10035",
    "lawyerOfficeCode": "1000",
    "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
    "lawyerId": "K3440",
    "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
    cases: [
      MOCK_CUSTOMER_SUPREME
    ]
  },
  ...GROUP_ARRAY_MOCK_PART
]

// export const MOCK_APPEAL_LG_CASE_NO_DATA_GROUP: LitigationCaseGroupDto[] = [
//   {
//     "caseGroupNo": "1",
//     "caseGroupKey": "10035",
//     "lawyerOfficeCode": "1000",
//     "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
//     "lawyerId": "K3440",
//     "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
//     // "cases": [
//     //   // {
//     //   //   "buttonAction": "PENDING_PAY_COURT_FEE",
//     //   //   "id": 10035000000,
//     //   //   "lawyerOfficeCode": "1000",
//     //   //   "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
//     //   //   "lawyerId": "K3440",
//     //   //   "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
//     //   //   "courtLevel": "APPEAL",
//     //   //   "courtCode": "100345",
//     //   //   "courtName": "ศาลแพ่ง",
//     //   //   "capitalAmount": 10.00,
//     //   //   "caseDate": "2022-11-22",
//     //   //   "sla": "2022-10-28",
//     //   //   "courtFeeStatus": "NEW",
//     //   //   "channel": "EFILING",
//     //   //   "briefCase": "111",
//     //   //   "actionFlag": true,
//     //   //   "taskCode": "INDICTMENT_RECORD_APPEAL",
//     //   //   "litigationId": "LE2565090117",
//     //   //   "uploadCourtFeeReceipt": false,
//     //   //   "statusCode": "PENDING",
//     //   //   "referenceNo": "LC2565100000002"
//     //   // },
//     //   {
//     //     // "buttonAction": "PENDING_PAY_COURT_FEE",
//     //     "id": 10035,
//     //     "lawyerOfficeCode": "1000",
//     //     "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
//     //     "lawyerId": "K3440",
//     //     "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
//     //     "courtLevel": "CIVIL",
//     //     "courtCode": "100345",
//     //     "courtName": "ศาลแพ่ง",
//     //     "capitalAmount": 10.00,
//     //     "caseDate": "2022-11-22",
//     //     "sla": "2022-10-28",
//     //     "courtFeeStatus": "NEW",
//     //     "channel": "EFILING",
//     //     "briefCase": "111",
//     //     "actionFlag": true,
//     //     "taskCode": "INDICTMENT_RECORD_APPEAL",
//     //     "litigationId": "LE2565090117",
//     //     "uploadCourtFeeReceipt": false,
//     //     "statusCode": "PENDING",
//     //     "referenceNo": "LC2565100000002"
//     //   }
//     // ]
//     cases: [
//       MOCK_APPEAL_LG_CASE_2
//     ]
//   },
//   {
//     "caseGroupNo": "2",
//     "caseGroupKey": "10035",
//     "lawyerOfficeCode": "1000",
//     "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
//     "lawyerId": "K3440",
//     "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
//     "cases": [
//       {
//         // "buttonAction": "PENDING_PAY_COURT_FEE",
//         "id": 10035000000,
//         "lawyerOfficeCode": "1000",
//         "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
//         "lawyerId": "K3440",
//         "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
//         "courtLevel": "APPEAL",
//         "courtCode": "100345",
//         "courtName": "ศาลแพ่ง",
//         "capitalAmount": 10.00,
//         "caseDate": "2022-11-22",
//         "sla": "2022-10-28",
//         "courtFeeStatus": "NEW",
//         "channel": "EFILING",
//         "briefCase": "111",
//         "actionFlag": true,
//         "taskCode": "INDICTMENT_RECORD",
//         "litigationId": "LE2565090117",
//         "uploadCourtFeeReceipt": false,
//         "statusCode": "PENDING",
//         "referenceNo": "LC2565100000002"
//       },
//       {
//         // "buttonAction": "PENDING_PAY_COURT_FEE",
//         "id": 10035,
//         "lawyerOfficeCode": "1000",
//         "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
//         "lawyerId": "K3440",
//         "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
//         "courtLevel": "CIVIL",
//         "courtCode": "100345",
//         "courtName": "ศาลแพ่ง",
//         "capitalAmount": 10.00,
//         "caseDate": "2022-11-22",
//         "sla": "2022-10-28",
//         "courtFeeStatus": "NEW",
//         "channel": "EFILING",
//         "briefCase": "111",
//         "actionFlag": true,
//         "taskCode": "INDICTMENT_RECORD",
//         "litigationId": "LE2565090117",
//         "uploadCourtFeeReceipt": false,
//         "statusCode": "PENDING",
//         "referenceNo": "LC2565100000002"
//       }
//     ]
//   }
// ]

export const MOCK_SUPREME_LG_CASE_NO_DATA_GROUP: LitigationCaseGroupDto[] = [
  {
    "caseGroupNo": "1",
    "caseGroupKey": "10035",
    "lawyerOfficeCode": "1000",
    "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
    "lawyerId": "K3440",
    "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
    "cases": [
      // {
      //   "buttonAction": "PENDING_PAY_COURT_FEE",
      //   "id": 10035000001,
      //   "lawyerOfficeCode": "1000",
      //   "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
      //   "lawyerId": "K3440",
      //   "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
      //   "courtLevel": "SUPREME",
      //   "courtCode": "100345",
      //   "courtName": "ศาลแพ่ง",
      //   "capitalAmount": 10.00,
      //   "caseDate": "2022-11-22",
      //   "sla": "2022-10-28",
      //   "courtFeeStatus": "NEW",
      //   "channel": "EFILING",
      //   "briefCase": "111",
      //   "actionFlag": true,
      //   "taskCode": "INDICTMENT_RECORD_SUPREME",
      //   "litigationId": "LE2565090117",
      //   "uploadCourtFeeReceipt": false,
      //   "statusCode": "PENDING",
      //   "referenceNo": "LC2565100000002"
      // },
      {
        // "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035000000,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "APPEAL",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD_APPEAL",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      },
      {
        // "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "CIVIL",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      }
    ]
  },
  {
    "caseGroupNo": "2",
    "caseGroupKey": "10035",
    "lawyerOfficeCode": "1000",
    "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
    "lawyerId": "K3440",
    "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
    "cases": [
      {
        // "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035000000,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "APPEAL",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      },
      {
        // "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "CIVIL",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      }
    ]
  }
]

export const MOCK_APPEAL_LG_CASE_GROUP: LitigationCaseGroupDto[] = [
  {
    "caseGroupNo": "1",
    "caseGroupKey": "10035",
    "lawyerOfficeCode": "1000",
    "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
    "lawyerId": "K3440",
    "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
    "cases": [
      {
        "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035000000,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "APPEAL",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD_APPEAL",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      },
      {
        // "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "CIVIL",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD_APPEAL",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      }
    ]
  },
  {
    "caseGroupNo": "2",
    "caseGroupKey": "10035",
    "lawyerOfficeCode": "1000",
    "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
    "lawyerId": "K3440",
    "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
    "cases": [
      {
        // "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035000000,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "APPEAL",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      },
      {
        // "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "CIVIL",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      }
    ]
  }
]

export const MOCK_SUPREME_LG_CASE_GROUP: LitigationCaseGroupDto[] = [
  {
    "caseGroupNo": "1",
    "caseGroupKey": "10035",
    "lawyerOfficeCode": "1000",
    "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
    "lawyerId": "K3440",
    "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
    "cases": [
      {
        "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035000001,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "SUPREME",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD_SUPREME",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      },
      {
        // "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035000000,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "APPEAL",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD_APPEAL",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      },
      {
        // "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "CIVIL",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      }
    ]
  },
  {
    "caseGroupNo": "2",
    "caseGroupKey": "10035",
    "lawyerOfficeCode": "1000",
    "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
    "lawyerId": "K3440",
    "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
    "cases": [
      {
        // "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035000000,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "APPEAL",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      },
      {
        // "buttonAction": "PENDING_PAY_COURT_FEE",
        "id": 10035,
        "lawyerOfficeCode": "1000",
        "lawyerOfficeName": "บจ. กรุงไทยกฎหมาย (สำนักงานใหญ่)",
        "lawyerId": "K3440",
        "lawyerName": "นางสาว นัทศริน เบ็ญการีม",
        "courtLevel": "CIVIL",
        "courtCode": "100345",
        "courtName": "ศาลแพ่ง",
        "capitalAmount": 10.00,
        "caseDate": "2022-11-22",
        "sla": "2022-10-28",
        "courtFeeStatus": "NEW",
        "channel": "EFILING",
        "briefCase": "111",
        "actionFlag": true,
        "taskCode": "INDICTMENT_RECORD",
        "litigationId": "LE2565090117",
        "uploadCourtFeeReceipt": false,
        "statusCode": "PENDING",
        "referenceNo": "LC2565100000002"
      }
    ]
  }
]