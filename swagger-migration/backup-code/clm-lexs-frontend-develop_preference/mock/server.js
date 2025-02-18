const jsonServer = require('json-server');
const middleware = jsonServer.defaults();
const server = jsonServer.create();

let username = '';

server.use(middleware);
server.use(jsonServer.bodyParser);

//Define service
const loginService = require('./service/loginService.js');
const userManagementService = require('./service/userManagementService.js');
const customerManagement = require('./service/customerManagementService.js');
const lawsuitService = require('./service/lawsuitService.js');
const masterDataService = require('./service/masterDataService.js');
const dopaService = require('./service/dopaService.js');
const taskManagement = require('./service/taskManagementService.js');
const configurationService = require('./service/configurationService.js');
const taskManagementService = require('./service/taskManagementService.js');
const courtService = require('./service/courtService.js');
const expenseService = require('./service/expenseService.js');
const receiptService = require('./service/receiptService.js');
const writOfExecService = require('./service/writOfExecController.js');
const litigationCaseService = require('./service/litigationCaseController.js');
const financialService = require('./service/financial.js');
const withdrawSeizureService = require('./service/withdrawSeizureService.js');
const withdrawWritOfExecService = require('./service/withdrawWritOfExecService.js');
const announcementService = require('./service/announcementService.js');
const seizureService = require('./service/seizureService.js');
const conveyanceService = require('./service/conveyanceService.js');
const litigationInvestigatePropertyService = require('./service/litigationInvestigatePropertyService.js');
const collateralType = require('./data/masterData/collateralType.json');
const collateralSubType = require('./data/masterData/collateralSubType.json');

/**
 *
 * /v1/authentication
 *
 **/
//Expose API
server.post('/v1/authentication/generate-token', (req, res, next) => {
  username = '';
  if (req.body.username === 'mock' || req.body.username === 'approver') {
    username = req.body.username;
    res.status(200).send(loginService.generateToken);
  } else if (req.body.username === 'dup') {
    username = req.body.username;
    res.status(500).send({ code: 'CONCURRENT_LOGIN' });
  } else {
    res.status(401).send(loginService.authenFailed);
    // res.status(500).send({});
    // res.status(503).send(loginService.ldapFailed);
  }
});
server.post('/v1/authentication/refresh-token', (req, res, next) => {
  res.status(200).json(loginService.generateToken);
});
server.post('/v1/authentication/revoke-token', (req, res, next) => {
  res.status(200).json();
});


/**
 *
 * /v1/user
 *
 **/
server.get('/v1/user/me', (req, res, next) => {
  let mockData = userManagementService.getCurrentUser;
  if (username === 'approver') mockData.subRoleCode = 'APPROVER';
  else mockData.subRoleCode = 'ADMIN';
  res.status(200).json(mockData);
  // res.status(500).json({ code: 'GENERAL_ERROR' });
  // res.status(401).send({});
});
server.get('/api/users', (req, res, next) => {
  res.status(200).json(userManagementService.getUsers);
});
server.get('/v1/user/:id', (req, res, next) => {
  const body = req.params;
  /* Client error responses (400 - 499)
   * 403 - Forbidden
   * 401 - Unauthorized
   * 400 - BAd request
   * 408 - Request timeout
   * Server error responses (500 - 599)
   * 500 - Internal server error
   * 503 - Service unavailable
   * 504 - Gateway timeout
   */
  if (body.id === 'C') {
    res.status(408).json();
  } else if (body.id === 'S') {
    res.status(503).json();
  } else {
    res.status(200).json(userManagementService.getUser);
  }
});
server.get('/v1/user', (req, res, next) => {
  res.status(200).json(userManagementService.inquiryUsers);
});

/**
 *
 * /v1/customer
 *
 **/
server.get('/v1/customer', (req, res, next) => {
  res.status(200).json(customerManagement.inquiryCustomers);
});
server.get('/v1/customer/dopa-task', (req, res, next) => {
  let mockData = dopaService.queryDopaTask;
  res.status(200).json(mockData);
});
server.get('/v1/customer/:id', (req, res, next) => {
  const body = req.params;
  let mockData = customerManagement.getCustomer;
  mockData.customerId = body.id;
  res.status(200).json(mockData);
});
server.get('/v1/customer/:id/liability', (req, res, next) => {
  let mockData = customerManagement.getCustomerLiability;
  res.status(200).json(mockData);
});
server.get('/v1/customer/:customerId/document-audit-log', (req, res, next) => {
  let mockData = customerManagement.inquireDocumentAuditLog;
  res.status(200).json(mockData);
});
server.post('/v1/customer/dopa-task', (req, res, next) => {
  setTimeout(() => {
    res.status(200).send({ successCount: 2 });
  }, 1000 * 10);
});

/**
 *
 * /v1/litigation
 *
 **/
server.get('/v1/litigation', (req, res, next) => {
  res.status(200).json(lawsuitService.inquiryLawsuits);
});
server.get('/v1/litigation/:id', (req, res, next) => {
  // if (req.body.id === 'test-suit') {
  res.status(200).send(lawsuitService.getLitigationById);
  // } else {
  //   res.status(200).json(lawsuitService.getLitigationById);
  // }
  // res.status(200).json(lawsuitService.getLitigationByIdForSuitCase);
});
server.post('/v1/litigation/:id/additional-persons', (req, res, next) => {
  res.status(200).json();
});
server.get('/v1/litigation/:lgid/get-heir-info/:id', (req, res, next) => {
  res.status(200).json(lawsuitService.getHeirInformation);
});
server.post('/v1/litigation/:lgid/process-not-prosecute', (req, res, next) => {
  res.status(200).json(lawsuitService.getHeirInformation);
});
server.get('/v1/customer/:id/caseInfo', (req, res, next) => {
  let mockData = customerManagement.getCustomerLitigationCase;
  res.status(200).json(mockData);
});
server.get('/v1/customer/:customerId/audit-log', (req, res, next) => {
  let mockData = customerManagement.inquireCustomerAuditLog;
  res.status(200).json(mockData);
});
server.get('/v1/litigation/:litigationId/audit-log', (req, res, next) => {
  let mockData = lawsuitService.inquireCustomerAuditLog;
  res.status(200).json(mockData);
});
server.get('/v1/litigation/:litigationId/document-audit-log', (req, res, next) => {
  let mockData = lawsuitService.inquireDocumentAuditLog;
  res.status(200).json(mockData);
});
server.post('/v1/litigation/:taskId/reject', (req, res, next) => {
  res.status(200).json(null);
});
server.post('/v1/litigation/:taskId/approve', (req, res, next) => {
  res.status(200).json(null);
});
server.get('/v1/litigation/:litigationId/subaccounts', (req, res, next) => {
  let mockData = lawsuitService.getSubAccounts;
  res.status(200).json(mockData);
});
server.post('/v1/litigation/:litigationId/subaccounts', (req, res, next) => {
  res.status(200).json(null);
});
server.get('/v1/litigation/:litigationId/litigation-case', (req, res, next) => {
  let mockData = lawsuitService.getLitigationCase;
  res.status(200).json(mockData);
});
server.get('/v1/litigation/litigation-case/:id', (req, res, next) => {
  let mockData = lawsuitService.getLitigationCaseDetail;
  res.status(200).json(mockData);
});
server.post('/v1/litigation/litigation-case/:taskId/approve', (req, res, next) => {
  res.status(200).json(null);
});
server.post('/v1/litigation/litigation-case/:taskId/reject', (req, res, next) => {
  res.status(200).json(null);
});
server.get('/v1/litigation/:litigationId/memo', (req, res, next) => {
  let mockData = lawsuitService.getMemoLitigation;
  res.status(200).json(mockData);
});

/**
 *
 * Litigation Case Controller
 *
 **/
server.get('/v1/litigation/litigation-case-short/:id', (req, res, next) => {
  let mockData = litigationCaseService.getLitigationCaseShortDetail;
  res.status(200).json(mockData);
});
server.get('/v1/litigation/litigation-case/:caseId/accounts/documents', (req, res, next) => {
  let mockData = litigationCaseService.getLitigationCaseAccountDocuments;
  res.status(200).json(mockData);
});
server.get('/v1/litigation/litigation-case/:caseId/documents', (req, res, next) => {
  let mockData = litigationCaseService.getLitigationCaseDocuments;
  res.status(200).json(mockData);
});

server.get('/v1/litigation/litigation-case/:caseId/documents', (req, res, next) => {
  let mockData = litigationCaseService.getLitigationCaseDocuments;
  res.status(200).json(mockData);
});

/**
 *
 * /v1/deferment
 *
 **/
server.get('/v1/deferment/inquiry', (req, res, next) => {
  const mode = req.query.mode;
  if (mode === 'approve') {
    res.status(200).json(lawsuitService.getDefermentApprove);
  } else if (mode === 'add') {
    res.status(200).json(lawsuitService.getDefermentAdd);
  } else {
    res.status(200).json({});
  }
});

server.post('/v1/deferment/inquiry', (req, res, next) => {
  const mode = req.query.mode;
  if (mode === 'approve') {
    res.status(200).json(lawsuitService.getDefermentApprove);
  } else if (mode === 'add') {
    res.status(200).json(lawsuitService.getDefermentAdd);
  } else {
    res.status(200).json({});
  }
});

/**
 *
 * /v1/notice
 *
 **/
server.get('/v1/notice/:litigationId', (req, res, next) => {
  let mockData = lawsuitService.getLitigationNoticeById;
  res.status(200).json(mockData);
});
server.get('/v1/notice/tracking', (req, res, next) => {
  let mockData = taskManagementService.inquiryNoticesForTracking;
  res.status(200).json(mockData);
});

/**
 *
 * /v1/task
 *
 **/
server.get('/v1/task', (req, res, next) => {
  res.status(200).json(taskManagement.inquiryTasks);
});
server.get('/v1/task/:id', (req, res, next) => {
  const body = req.params;
  if(!isNaN(body.id)) {
    const all = taskManagement.inquiryTasks;
    let fillter = all.content.filter((it) => it.taskId.toString() === body.id.toString())[0];
    fillter['id'] = fillter ? fillter['taskId'] : 0;
    fillter['litigationCaseId'] = '10059';
    res.status(200).json(fillter);
  } else {
    res.status(200).json({});
  }
});
server.get('/v1/task/transfer/user', (req, res, next) => {
  res.status(200).json(taskManagement.transferUserOptions);
});
server.post('/v1/task/transfer/user', (req, res, next) => {
  res.status(200).json(taskManagement.transferUserOptions);
});
server.post('/v1/task/expense/transfer', (req, res, next) => {
  res.status(200).json(null);
});
server.post('/v1/task/transfer', (req, res, next) => {
  res.status(200).json(null);
});
server.get('/v1/task/count-unassigned-task', (req, res, next) => {
  res.status(200).json(0)
});
server.get('/v1/task/:id/unhold-page-session', (req, res, next) => {
  res.status(200).json({"isSuccess":true});
});

/**
 *
 * /v1/master-data
 *
 **/
server.get('/v1/master-data/led', (req, res, next) => {
  res.status(200).json({});
});
server.get('/v1/master-data/case-creator', (req, res, next) => {
  res.status(200).json(masterDataService.getCaseCreator);
});
server.get('/v1/master-data/collateral-status', (req, res, next) => {
  res.status(200).json(masterDataService.getCollateralStatus);
});
server.get('/v1/master-data/court', (req, res, next) => {
  res.status(200).json(masterDataService.getCourt);
});
server.get('/v1/master-data/customer-status', (req, res, next) => {
  res.status(200).json(masterDataService.getCustomerStatus);
});
server.get('/v1/master-data/debt-transfer-to', (req, res, next) => {
  res.status(200).json(masterDataService.getDebtTransferTo);
});
server.get('/v1/master-data/debtor', (req, res, next) => {
  res.status(200).json(masterDataService.getDebtor);
});
server.get('/v1/master-data/district', (req, res, next) => {
  res.status(200).json(masterDataService.getDistrict);
});
server.get('/v1/master-data/done-by', (req, res, next) => {
  res.status(200).json(masterDataService.getDoneBy);
});
server.get('/v1/master-data/followup-status', (req, res, next) => {
  res.status(200).json(masterDataService.getFollowUpStatus);
});
server.get('/v1/master-data/ktb-org', (req, res, next) => {
  res.status(200).json(masterDataService.getKtbOrg);
});
server.get('/v1/master-data/legal-status', (req, res, next) => {
  res.status(200).json(masterDataService.getLegalStatus);
});
server.get('/v1/master-data/loan-type', (req, res, next) => {
  res.status(200).json(masterDataService.getLoanType);
});
server.get('/v1/master-data/province', (req, res, next) => {
  res.status(200).json(masterDataService.getProvince);
});
server.get('/v1/master-data/scope', (req, res, next) => {
  res.status(200).json(masterDataService.getScope);
});
server.get('/v1/master-data/subdistrict', (req, res, next) => {
  res.status(200).json(masterDataService.getSubdistrict);
});
server.get('/v1/master-data/sam-flag', (req, res, next) => {
  res.status(200).json(masterDataService.getSamFlag);
});
server.get('/v1/master-data/tamc-flag', (req, res, next) => {
  res.status(200).json(masterDataService.getTamcFlag);
});
server.get('/v1/master-data/task-type', (req, res, next) => {
  res.status(200).json(masterDataService.getTaskType);
});
server.get('/v1/master-data/task-status', (req, res, next) => {
  res.status(200).json(masterDataService.getTaskStatus);
});
server.get('/v1/master-data/write-off-status', (req, res, next) => {
  res.status(200).json(masterDataService.getWriteOffStatus);
});
server.get('/v1/master-data/litigation-close-status', (req, res, next) => {
  res.status(200).json(masterDataService.getLitigationCloseStatus);
});
server.get('/v1/master-data/external-asset-status', (req, res, next) => {
  res.status(200).json(masterDataService.getExternalAssetStatus);
});
server.get('/v1/master-data/caseStatus', (req, res, next) => {
  let mockData = masterDataService.getCaseStatus;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/allegations/:caseTypeCode', (req, res, next) => {
  const body = req.params;
  const caseTypeCode = body.caseTypeCode;
  let mockData = masterDataService.getAllegation;
  mockData.allegations = [...mockData.allegations.filter((item) => item.value === caseTypeCode)];
  res.status(200).json(mockData);
});
server.get('/v1/master-data/deferment-reason', (req, res, next) => {
  let mockData = masterDataService.getDefermentReason;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/approval-authority', (req, res, next) => {
  let mockData = masterDataService.getApprovalAuthority;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/title', (req, res, next) => {
  let mockData = masterDataService.getTitle;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/cios-case-types', (req, res, next) => {
  let mockData = masterDataService.ciosCaseType;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/court-verdict-type', (req, res, next) => {
  let mockData = masterDataService.courtVerdictType;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/court-fee-type', (req, res, next) => {
  let mockData = masterDataService.courtFeeType;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/court-verdict', (req, res, next) => {
  let mockData = masterDataService.courtVerdict;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/court-fee-sub-type', (req, res, next) => {
  let mockData = masterDataService.courtFeeSubType;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/court-sub-verdict', (req, res, next) => {
  let mockData = masterDataService.courtSubVerdict;
  res.status(200).json(mockData);
});
// สถานะงาน  GET /v1/master-data/expense-status
server.get('/v1/master-data/expense-status', (req, res, next) => {
  let mockData = masterDataService.expenseStatus;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/occupant', (req, res, next) => {
  let mockData = {
    occupants: [
      { name: 'ผู้แจ้งการครอบครอง', value: 'ผู้แจ้งการครอบครอง' },
      { name: 'ผู้ถือกรรมสิทธิ์', value: 'ผู้ถือกรรมสิทธิ์' },
      { name: 'ผู้ถือสิทธิครอบครอง', value: 'ผู้ถือสิทธิครอบครอง' },
      { name: 'ผู้เช่า', value: 'ผู้เช่า' },
      { name: 'ผู้ถือหุ้น', value: 'ผู้ถือหุ้น' },
      { name: 'เจ้าของ', value: 'เจ้าของ' },
      { name: 'ผู้เช่าช่วง', value: 'ผู้เช่าช่วง' },
      { name: 'ผู้ถือครอง', value: 'ผู้ถือครอง' },
      { name: 'ผู้ถือหน่วยลงทุน', value: 'ผู้ถือหน่วยลงทุน' },
      { name: 'ผู้ครอบครอง', value: 'ผู้ครอบครอง' },
    ]
  };
  res.status(200).json(mockData);
});
server.get('/v1/master-data/expense-revise-reason', (req, res, next) => {
  let mockData = {
    reviseReason: [
      {
        name: 'เอกสารแนบไม่ถูกต้อง',
        value: '1',
      },
      {
        name: 'บันทึกประเภทค่าใช้จ่ายไม่ถูกต้อง',
        value: '2',
      },
      {
        name: 'บันทึกทุนทรัพย์ไม่ถูกต้อง',
        value: '3',
      },
      {
        name: 'บันทึกค่าธรรมเนียมศาลสั่งคืนไม่ถูกต้อง',
        value: '4',
      },
      {
        name: 'เบิกค่าใช้จ่ายหรือค่าจ้างทนายซ้ำ',
        value: '5',
      },
      {
        name: 'อาจมีการปฏิบัติบกพร่องของทนายความ',
        value: '6',
      },
      {
        name: 'อื่นๆ',
        value: '7',
      },
    ],
  };
  res.status(200).json(mockData);
});
server.get('/v1/master-data/expense-cancel-reason', (req, res, next) => {
  let mockData = {
    cancelReason: [
      {
        name: 'ใบเสร็จหรือจำนวนเงินที่ขอเบิกไม่ถูกต้อง',
        value: '1',
      },
      {
        name: 'ต้องส่งให้ กบม. พิจารณา',
        value: '2',
      },
      {
        name: 'อื่นๆ',
        value: '3',
      },
    ],
  };
  res.status(200).json(mockData);
});
server.get('/v1/master-data/financial-institutions', (req, res, next) => {
  // let req = 'purpose=led-cheque-issuer'
  let mockData = {
    "financialInstitutions": [
      {
        "code": "006",
        "nameThai": "ธนาคาร กรุงไทย จำกัด (มหาชน)"
      },
      {
        "code": "030",
        "nameThai": "ธนาคารออมสิน"
      },
      {
        "code": "033",
        "nameThai": "ธนาคารอาคารสงเคราะห์"
      },
      {
        "code": "034",
        "nameThai": "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร"
      },
      {
        "code": "066",
        "nameThai": "ธนาคารอิสลามแห่งประเทศไทย"
      },
      {
        "code": "098",
        "nameThai": "ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย"
      }
    ]
  };
  res.status(200).json(mockData);
});
// ผู้รับผิดชอบงาน GET /v1/user/options
server.get('/v1/user/options', (req, res, next) => {
  let mockData = masterDataService.userOptions;
  res.status(200).json(mockData);
});
server.get('/v2/user/options', (req, res, next) => {
  let mockData = masterDataService.userOptions;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/court-order', (req, res, next) => {
  let mockData = masterDataService.courtOrder;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/suspens-execution', (req, res, next) => {
  let mockData = masterDataService.suspensExecution;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/expense-action', (req, res, next) => {
  let mockData = masterDataService.expenseAction;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/expense-object', (req, res, next) => {
  let mockData = masterDataService.expenseObject;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/receive-status', (req, res, next) => {
  let mockData = masterDataService.receiveStatus;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/receive-type', (req, res, next) => {
  let mockData = masterDataService.receiveType;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/receive-account-code', (req, res, next) => {
  let mockData = masterDataService.receiveAccountCode;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/financial-object-type', (req, res, next) => {
  let mockData = masterDataService.financialObjectType;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/financial-object-type/:financialObjectType', (req, res, next) => {
  let mockData = masterDataService.financialObjectType;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/case-type', (req, res, next) => {
  let mockData = masterDataService.caseType;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/financial-account-code', (req, res, next) => {
  let mockData = masterDataService.financialAccountCode;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/financial-account-type', (req, res, next) => {
  let mockData = masterDataService.financialAccountCode;
  res.status(200).json(mockData);
});
/**
 *
 * /v1/configuration
 *
 **/
server.get('/v1/configuration/role', (req, res, next) => {
  res.status(200).json(configurationService.getRole);
});
server.get('/v1/configuration/sub-role-map', (req, res, next) => {
  res.status(200).json(configurationService.getSubRoleMap);
});
server.get('/v1/configuration/role-level-map', (req, res, next) => {
  res.status(200).json(configurationService.getRoleLavelMap);
});
server.get('/v1/configuration/organization-map', (req, res, next) => {
  res.status(200).json(configurationService.getOrganizationMap);
});
server.get('/v1/configuration/lexs-config', (req, res, next) => {
  res.status(200).json(configurationService.getLexsConfig);
});
server.post('/v1/configuration/response-unit-users', (req, res, next) => {
  if (req.body.page === 0) {
    res.status(200).json(configurationService.getResponseUnitUsers1);
  } else {
    res.status(200).json(configurationService.getResponseUnitUsers2);
  }
});
server.get('/v1/configuration/expense-config/:id', (req, res, next) => {
  let mockData = [
    {
      accountCode: 'string',
      contractRate: 0,
      docType: 'string',
      expenseGroup: 0,
      expenseSubTypeCode: 'string',
      expenseSubTypeName: 'string',
      expenseTypeCode: 'string',
      expenseTypeName: 'string',
      fieldName: 'string',
      id: 'string',
      paymentMethod: 'string',
      paymentMethodName: 'string',
      rateTypeCode: 'string',
      rateTypeName: 'string',
      refUnitCode: 'string',
      stepCode: 'string',
      stepName: 'string',
      stepSubCode: 'string',
      stepSubName: 'string',
      whtRate: 0,
    },
  ];
  res.status(200).json(mockData);
});
server.get('/v1/configuration/receive-account-code/:type', (req, res, next) => {
  res.status(200).json([]);
});
/**
 *
 * /v1/readcard
 *
 **/
server.get('/v1/readcard/:userId', (req, res, next) => {
  let mockData = dopaService.queryAgentResponse;
  res.status(200).json(mockData);
});

/**
 *
 * /v1/document
 *
 **/
server.post('/v1/document/upload/:tempId', (req, res, next) => {
  // res.status(400).json({ code: 'F015' });
  // res.status(500).json({ errors: [{ code: 'D025' }] });
  res.status(200).json({
    uploadSessionId: new Date().getTime() + req.params.tempId + '_FE_MOCK_UPLOAD_SESSION',
  });
});
server.get('/v1/document/view/:imageSource/:imageId', (req, res, next) => {
  const mock = require('./data/document/sample.json');
  res.status(200).json(mock.file.data);
});

/**
 *
 * /v1/financial
 *
 **/
server.post('/v1/financial/pay-court-fee/:id/read-payment-form', (req, res, next) => {
  let mockData = {
    amount: 1000,
    companyCode: 'COM_001',
    paymentImageId: 'PAYMENT_001',
    ref1: 'REF_1_001',
  };
  res.status(200).json(mockData);
});
server.post('/v1/financial/pay-court-fee/:id/read-confirm-form', (req, res, next) => {
  let mockData = financialService.readConfirmationForm;
  res.status(200).json(mockData);
});
server.post('/v1/expense/:taskId/cancel', (req, res, next) => {
  res.status(200).json(null);
});
server.post('/v1/financial/litigation-transaction-summary/:litigationId', (req, res, next) => {
  let mockData = financialService.getFinancialLitigationTransactionSummary;
  res.status(200).json(mockData);
});
server.get('/v1/financial/credit-note-summary', (req, res, next) => {
  let mockData = financialService.creditNoteSummary;
  res.status(200).json(mockData);
});
/**
 *
 * /v1/expense
 *
 **/

server.get('/v1/seizure/:seizureId/litigation-case-leds', (req, res, next) => {
  res.status(200).json(litigationCaseService.litigationCaseLeds);
});
server.get('/v1/seizure/:seizureId/collaterals-leds/info', (req, res, next) => {
  res.status(200).json(seizureService.getSeizureCollateralInfo);
});
server.get('/v1/seizure/seizureLeds/:seizureLedId/collaterals-leds/info', (req, res, next) => {
  res.status(200).json(seizureService.getSeizureLedCollateralInfo);
});
server.get('/v1/expense', (req, res, next) => {
  res.status(200).json(expenseService.inquiryExpense);
});
server.get('/v1/expense/excel', (req, res, next) => {
  res.status(200).json(expenseService.inquiryExpense);
});
server.get('/v1/expense/:id', (req, res, next) => {
  res.status(200).json(expenseService.getExpenseDetail);
});
// เลขที่หนังสือเบิกเงิน GET /v1/expense/expense-no
server.get('/v1/expense/expense-no', (req, res, next) => {
  res.status(200).json(masterDataService.expenseNo);
});
server.post('/v1/expense/:id/revise', (req, res, next) => {
  res.status(200).json(null);
});
server.post('/v1/expense/:id/approve', (req, res, next) => {
  res.status(200).json(null);
});
server.get('/v1/expense/:type/:id/audit-log', (req, res, next) => {
  res.status(200).json([]);
});
/**
 *
 * /v1/receive
 *
 **/
server.get('/v1/receive/receive-no', (req, res, next) => {
  let mockData = masterDataService.receiveNo;
  res.status(200).json(mockData);
});
server.get('/v1/receive', (req, res, next) => {
  let mockData = receiptService.inquiryReceive;
  res.status(200).json(mockData);
});
server.get('/v1/receive/excel', (req, res, next) => {
  let mockData = receiptService.inquiryReceive;
  res.status(200).json(mockData);
});
server.get('/v1/receive/kcorp', (req, res, next) => {
  let mockData = receiptService.inquiryReceiveKcorp;
  res.status(200).json(mockData);
});
server.get('/v1/receive/kcorp/excel', (req, res, next) => {
  let mockData = receiptService.inquiryReceiveKcorp;
  res.status(200).json(mockData);
});

server.post('/v1/receive/refund-info/advanceReceiveInfoDetail', (req, res, next) => {
  let mockData = receiptService.advanceReceiveInfoDetail;
  res.status(200).json(mockData);
});

server.get('/v1/receive/refund-info/:washAccountNo', (req, res, next) => {
  let mockData = receiptService.inquiryKcorpRefundInfo;
  res.status(200).json(mockData);
});
server.get('/v1/receive/download-credit-note/:bookingRefNo', (req, res, next) => {
  res.status(200).json('download-credit-note');
});
server.get('/v1/receive/refund-info/:washAccountNo/:referenceNo', (req, res, next) => {
  let mockData = receiptService.inquiryKcorpReferenceNoInfo;
  res.status(200).json(mockData);
});
server.get('/v1/receive/receive-order/:recNo', (req, res, next) => {
  let mockData = receiptService.getReceiveOrder;
  res.status(200).json(mockData);
});
server.post('/v1/receive/:taskId/approve', (req, res, next) => {
  res.status(200).json(null);
});
server.post('/v1/receive/:taskId/reject', (req, res, next) => {
  res.status(200).json(null);
});

// /v1/receive/advance-payment
server.get('/v1/receive/advance-payment', (req, res, next) => {
  let mockData = receiptService.inquiryAdvancePayment;
  res.status(200).json(mockData);
});
// /v1/receive/advance-payment/excel
server.get('/v1/receive/advance-payment/excel', (req, res, next) => {
  let mockData = receiptService.inquiryAdvancePayment;
  res.status(200).json(mockData);
});
// /v1/receive/advance-payment-no
server.get('/v1/receive/advance-payment-no', (req, res, next) => {
  res.status(200).json(masterDataService.advancePaymentNo);
});

server.get('/v1/master-data/advance-payment-status', (req, res, next) => {
  let mockData = masterDataService.advancePaymentStatus;
  res.status(200).json(mockData);
});
server.get('v1/master-data/financial-account-type', (req, res, next) => {
  let mockData = masterDataService.advancePaymentStatus;
  res.status(200).json(mockData);
});
server.get('v1/master-data/financial-account-type/:financialObjectType', (req, res, next) => {
  let mockData = masterDataService.advancePaymentStatus;
  res.status(200).json(mockData);
});
server.get('/v1/master-data/receive-cancel-reason', (req, res, next) => {
  let mockData = masterDataService.getReceiveCancelReason;
  res.status(200).json(mockData);
});

/**
 *
 * /v1/court
 *
 **/
server.get('/v1/court-trial/:lgid', (req, res, next) => {
  let mockData = courtService.getCourtTrial;
  res.status(200).json(mockData);
});
server.get('/v1/court/:lgid', (req, res, next) => {
  let mockData = courtService.getLitigationCourtResult;
  res.status(200).json(mockData);
});
server.get('/v1/court/:lgid/verdict/:lgcaseid', (req, res, next) => {
  let mockData = courtService.getLitigationCourtVerdictById;
  res.status(200).json(mockData);
});
server.get('/v1/court/:lgcaseid/appeal/:lgid', (req, res, next) => {
  let mockData = courtService.getLitigationCourtAppealById;
  res.status(200).json(mockData);
});
server.post('/v1/court/:taskId/approve', (req, res, next) => {
  res.status(200).json(null);
});
server.post('/v1/court/:taskId/reject', (req, res, next) => {
  res.status(200).json(null);
});
server.post('/v1/court/appeal', (req, res, next) => {
  res.status(200).json(null);
  // res.status(402).json({ code: 'L021' });
});
server.post('/v1/court/:lgid/approve-appeal', (req, res, next) => {
  res.status(200).json(null);
});
server.get('/v1/court/:lgid/download-conclusion', (req, res, next) => {
  res.status(200).json(null);
});
server.get('/v1/court/:taskId/downloadOrderLetter', (req, res, next) => {
  res.status(200).json(null);
});

/**
 *
 * /v1/writ-of-exec-controller
 *
 **/
server.get('/v1/litigation-case/:caseId/execution/documents', (req, res, next) => {
  let mockDate = writOfExecService.getExecutionDocuments;
  res.status(200).json(mockDate);
});
server.get('/v1/litigation-case/:caseId/execution/debt-calculation-info', (req, res, next) => {
  let mockDate = writOfExecService.getDebtCalculationInfo;
  res.status(200).json(mockDate);
});
server.get('/v1/litigation/:litigationId/legal-executions/writ-of-execs', (req, res, next) => {
  let mockDate = writOfExecService.getLegalExecutionWritOfExecs;
  res.status(200).json(mockDate);
});
server.get('/v1/litigation/{litigationId}/legal-executions/writ-of-execs', (req, res, next) => {
  let mockDate = writOfExecService.getLegalExecutionWritOfExecsByLgId;
  res.status(200).json(mockDate);
});
server.get('/v1/litigation/{litigationId}/legal-executions/{litigationCaseId}/writ-of-execs', (req, res, next) => {
  let mockDate = writOfExecService.getLegalExecutionWritOfExecsByLgIdAngLgCaseId;
  res.status(200).json(mockDate);
});
server.post(
  '/v1/litigation-case/:caseId/execution/accounts/:accountNo/documents/tfs-payment-history',
  (req, res, next) => {
    res.status(200).json(null);
  }
);
server.post('/v1/litigation-case/:caseId/execution/documents/issuance-of-execution', (req, res, next) => {
  res.status(200).json({
    submitDate: '2023-03-13',
    uploadSessionId: '11111',
  });
});
server.post('/v1/litigation-case/:caseId/execution/documents/issuance-of-execution/result', (req, res, next) => {
  res.status(200).json(null);
});
server.post('/v1/litigation-case/:caseId/execution/documents/power-of-attorney/result', (req, res, next) => {
  res.status(200).json(null);
});
server.post('/v1/litigation-case/:caseId/execution/tasks/:taskId/submit', (req, res, next) => {
  res.status(200).json(null);
});
server.post('/v1/litigation-case/:caseId/execution/documents/debt-calculation', (req, res, next) => {
  res.status(200).json(null);
});

/**
 *
 * /v1/mockup
 *
 **/
server.get('/v1/mockup/:id', (req, res, next) => {
  const _id = req.params.id;
  if (Number(_id) < 500) {
    const result = _id.match(/[0-9]/g);
    result ? res.status(200).send({ success: _id }) : res.status(404).json();
  } else {
    res.status(503).json();
  }
});
server.get('/v1/mockup/list', (req, res, next) => {
  let data = [];
  for (let index = 0; index < 100; index++) {
    data.push({ text: 'text ' + index, value: 'value ' + index });
  }
  res.status(200).json(data);
});
server.post('/v1/mockup/submit', (req, res, next) => {
  res.status(200).json(req.body);
  // res.status(404).json(null);
  // res.status(500).json(null);
});
server.get('/v1/mock/dashboard', (req, res, next) => {
  let mockData = require('./data/dashboard/dashboard.json');
  res.status(200).json(mockData);
});

server.get('/v1/notifications/messagesByRecipient', (req, res, next) => {
  res.status(200).json({
    messages: {
      content: [
        {
          customerId: 'string',
          financialId: 0,
          hyperlink: {
            params: [
              {
                name: 'string',
                value: 'string',
              },
            ],
            taskId: 0,
            type: 'T',
            viewCode: 'string',
          },
          litigationCaseId: 0,
          litigationId: 'string',
          messageDetails: 'string',
          messageHeader: 'string',
          notiId: 0,
          notiMessageId: 0,
          readDatetime: '2023-04-04T11:34:05.041Z',
          senderUserId: 'string',
          sentDatetime: '2023-04-04T11:34:05.041Z',
          status: 'string',
        },
      ],
      empty: true,
      first: true,
      last: true,
      number: 0,
      numberOfElements: 0,
      pageable: {
        offset: 0,
        pageNumber: 0,
        pageSize: 0,
        paged: true,
        sort: {
          empty: true,
          sorted: true,
          unsorted: true,
        },
        unpaged: true,
      },
      size: 0,
      sort: {
        empty: true,
        sorted: true,
        unsorted: true,
      },
      totalElements: 0,
      totalPages: 0,
    },
    recipientUserId: 'string',
  });
});
server.get('/v1/notifications/unreadCountByRecipient', (req, res, next) => {
  res.status(200).json({
    recipientUserId: 'string',
    unreadCount: 0,
  });
});
server.get('/v1/litigation/:id/legal-executions/:caseId/writ-of-execs', (req, res, next) => {
  res.status(200).json({
    litigationId: 'LE2566040028',
    litigationCaseId: 10384,
    courtBlackCaseNo: 'ผบE19/4775',
    courtRedCaseNo: 'คพR21/3045',
    legalExecutionLawyerId: 'K4008',
    legalExecutionLawyerName: 'นาย สงคราม ชูศรีจันทร์',
    legalExecutionId: 325,
    legalExecutionDatetime: '2023-05-09T17:38:48+07:00',
    writOfExecStatus: 'R2E04-03-3A_03',
    powerOfAttorneySubmitDate: '2023-05-11',
    powerOfAttorneyRespondDate: '2023-05-11',
    writOfExecRound: 0,
    writOfExecDebtType: 'M',
    powerOfAttorneyDocumentId: 863407,
    powerOfAttorneyDocument: {
      documentId: 863407,
      imageSource: 'LEXS',
      imageId: 'a13b039d-2c00-4d64-94a0-d391b5db9e0f',
      imageName: 'JPEG ขนาดไม่เกิน 30 MB.jpg',
      documentTemplate: {
        documentTemplateId: 'LEXSF103',
        documentName: 'หนังสือมอบอำนาจของทนายความ',
        searchType: 'LEXS',
        documentGroup: 'LEGAL_EXECUTION',
        needHardCopy: false,
        optional: false,
        forNoticeLetter: false,
        forLitigation: false,
        requiredDocumentDate: false,
        contentType: 'xlsx',
        generatedBySystem: false,
      },
      active: false,
      uploadUserId: 'K4008',
      documentTemplateId: 'LEXSF103',
      sendDate: '2023-05-11',
      receiveDate: '2023-05-11',
      litigationId: 'LE2566040028',
      litigationCaseId: 10384,
    },
    writOfExecDebtDocument: [
      {
        documentId: 861359,
        imageSource: 'LEXS',
        imageId: '0e0a9e57-0d1e-40ee-bfc9-45801cb16127',
        imageName: 'Test upload.xlsx',
        documentTemplate: {
          documentTemplateId: 'LEXSF102',
          documentName: 'เอกสารคำนวณหนี้เพื่อออกหมาย',
          searchType: 'LEXS',
          documentGroup: 'LEGAL_EXECUTION',
          needHardCopy: false,
          optional: false,
          forNoticeLetter: false,
          forLitigation: false,
          requiredDocumentDate: false,
          contentType: 'xlsx',
          generatedBySystem: false,
        },
        active: false,
        documentDate: '2023-04-27T11:16:33+07:00',
      },
    ],
    writOfExecSubmissions: [
      {
        writOfExecDocument: {
          documentId: 0,
          documentTemplate: {
            documentTemplateId: 'LEXSF104',
            documentName: 'คำขอออกหมายบังคับคดี',
            searchType: 'LEXS',
            documentGroup: 'LEGAL_EXECUTION',
            needHardCopy: false,
            optional: false,
            forNoticeLetter: false,
            forLitigation: false,
            requiredDocumentDate: false,
            contentType: 'xlsx',
            generatedBySystem: false,
          },
          active: false,
        },
      },
    ],
  });
});

//Start mock server
server.listen(3000, () => {
  console.log('MOCK server listening on port 3000');
});

/**
 *
 * /v1/litigation-case
 *
 **/

server.get('/v1/litigation/:caseId/documents/seizure-prep/title-deed', (req, res, next) => {
  let mockDate = writOfExecService.getSeizurePrepTitleDeed;
  res.status(200).json(mockDate);
});
server.get('/v1/seizure/litigation-case/:caseId/documents/seizure-prep/person', (req, res, next) => {
  let mockDate = writOfExecService.getSeizurePrepPerson;
  res.status(200).json(mockDate);
});
// server.get('/v1/litigation/v1/litigation-case/:caseId/documents/seizure-prep/collateral-appraisal', (req, res, next) => {
//   let mockDate = writOfExecService.getSeizurePrepCollateralAppraisal
//   res.status(200).json(mockDate);
// });
server.get('/v1/seizure/litigation-case/:caseId/collaterals', (req, res, next) => {
  let mockDate = writOfExecService.getLitigationCaseCollaterals;
  res.status(200).json(mockDate);
});
server.get('/v1/litigation/:caseId/collaterals/seizure-prep/draft', (req, res, next) => {
  let mockDate = writOfExecService.getLitigationCaseCollateralsDratf;
  res.status(200).json(mockDate);
});
server.get('/v1/litigation/:caseId/documents/seizure-prep/title-deed/draft', (req, res, next) => {
  let mockDate = writOfExecService.getSeizurePrepTitleDeedDraft;
  res.status(200).json(mockDate);
});
server.get('/v1/litigation/litigation-case/:caseId/persons', (req, res, next) => {
  let mockDate = writOfExecService.getPersons;
  res.status(200).json(mockDate);
});
server.get('/v1/seizure/litigation-case/:caseId/documents/seizure-prep/collateral-appraisal', (req, res, next) => {
  let mockDate = writOfExecService.getSeizurePrepCollateralAppraisal;
  res.status(200).json(mockDate);
});

/**
 *
 * /v1/seizures
 *
 **/

lcount = 0;
server.get('/v1/seizure/:seizureId/documents/title-deed', (req, res, next) => {
  let mockDate = writOfExecService.getSeizureTitleDeed;
  lcount++;
  if (lcount != 1) {
    let reject = {
      rejectedDate: '2023-04-25T12:01:06.555Z',
      rejectedReasonId: 'xx',
      rejectedReasonName: 'xx',
      rejectedRemarks: 'strixxxng',
      rejectedUserId: 'xxx',
    };
    mockDate.titleDeedDocuments[0].approvedStatus = true;
    mockDate.titleDeedDocuments[0].sendMethod = 'AT_KLAW';
    mockDate.titleDeedDocuments[0].rejectedReasons.push(reject);
  }
  res.status(200).json(mockDate);
});
server.get('/v1/seizure/:seizureId/document/excess-documents', (req, res, next) => {
  let mockDate = writOfExecService.getExcessDocuments;
  res.status(200).json(mockDate);
});
server.get('/v1/seizure/:seizureId/documents/title-deed/document-approval/draft', (req, res, next) => {
  let mockDate = writOfExecService.getDocumentsApprovalDraft;
  res.status(200).json(mockDate);
});
server.get('/v1/seizure/litigation/:ld/legal-executions/seizure/command', (req, res, next) => {
  let mockDate = writOfExecService.getExcution;
  res.status(200).json(mockDate);
});
server.post('/v1/seizure/:seizureId/execution/lawyer/submit', (req, res, next) => {
  res.status(200).json(null);
});
server.post('/v1/seizure/:seizureId/documents/title-deed/document-approval/submit', (req, res, next) => {
  let mockDate = writOfExecService.getSeizureTitleDeedReject;
  res.status(200).json(mockDate);
});

server.get('/v1/withdraw-seizure/litigation-case/:caseId/collaterals', (req, res, next) => {
  let mockDate = litigationCaseService.getLiticationCaseCollaterals;
  res.status(200).json(mockDate);
});

/**
 *
 * /v1/withdrawn-seizures
 *
 **/
server.post('/v1/seizure/validate', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(null);
  }
});
server.post('/v1/withdraw-seizure/validate', (req, res, next) => {
  // const errorCode = 'EWS003';
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(null);
  }
});

server.get('/v1/withdraw-seizure/litigation/:litigation/legal-executions/command', (req, res, next) => {
  let mockDate = withdrawSeizureService.getWithdrawnCammands;
  res.status(200).json(mockDate);
});

server.get('/v1/withdraw-seizure/litigation/:litigation/legal-executions/execution', (req, res, next) => {
  let mockDate = withdrawSeizureService.getWithdrawSeizureExcution;
  res.status(200).json(mockDate);
});

server.get('/v1/seizure/litigation/:litigation/legal-executions/seizure/execution', (req, res, next) => {
  let mockDate = withdrawSeizureService.getSeizureExcution;
  res.status(200).json(mockDate);
});

server.get('/v1/withdraw-seizure/:withdrawSeizureId', (req, res, next) => {
  let mockDate = withdrawSeizureService.getWithdrawSeizureList;
  res.status(200).json(mockDate);
});

server.get('/v1/withdraw-seizure/:withdrawSeizureId/withdraw-seizure-led/:withdrawSeizureLedId', (req, res, next) => {
  let mockDate = withdrawSeizureService.getWithdrawSeizureLed;
  res.status(200).json(mockDate);
});

server.post('/v1/withdraw-seizure/submit', (req, res, next) => {
  res.status(200).json(req.body);
});
server.post('/v1/withdraw-seizure/:withdrawSeizureId/approval', (req, res, next) => {
  res.status(200).json(null);
});
server.post('/v1/withdraw-seizure/:withdrawSeizureId/cancel', (req, res, next) => {
  res.status(200).json(req.body);
});
server.post('/v1/withdraw-seizure/:withdrawSeizureId/document-validation/tasks/:taskId/submit', (req, res, next) => {
  res.status(200).json(req.body);
});
server.post('/v1/withdraw-seizure/:withdrawSeizureId/command-acception/tasks/:taskId/submit', (req, res, next) => {
  res.status(200).json(req.body);
});
server.post('/v1/withdraw-seizure/:withdrawSeizureId/result-recording/tasks/:taskId/submit', (req, res, next) => {
  const errorCode = { errors: [{ code: 'EWS006' }] };
  // res.status(422).json({ "errors": [{ "code": "WWRIT011" }] });
  if (errorCode) {
    res.status(403).json(errorCode);
  } else {
    res.status(200).json(req.body);
  }
});

server.get('/v1/withdraw-writ-of-exec/:withdrawWritOfExecId', (req, res, next) => {
  const mockData = withdrawWritOfExecService.getWithdrawWritOfExec;
  res.status(200).json(mockData);
});
server.post('/v1/withdraw-writ-of-exec/:withdrawWritOfExecId/tasks/:taskId/approval', (req, res, next) => {
  res.status(200).json(null);
});
server.get('/v1/withdraw-writ-of-exec/litigation/:litigationId', (req, res, next) => {
  const mockData = withdrawWritOfExecService.getWithdrawWritOfExecByLitigation;
  res.status(200).json(mockData);
});
server.post('/v1/litigation-case/:caseId/execution/withdraw/validate', (req, res, next) => {
  res.status(200).json(null);
  // res.status(422).json({ "errors": [{ "code": "WWRIT011" }] });
});
server.post('/v1/financial/seizure-fee/:seizureLedId/payment', (req, res, next) => {
  // res.status(200).json(null);
  res.status(422).json({ errors: [{ code: 'F033' }] });
});

server.post('/v1/master-data/ktb-org/options', (req, res, next) => {
  const mockData = masterDataService.getKtbOrg;
  res.status(200).json(mockData);
});

// PUBLIC AUCTION MOCK API

server.get('/v1/auction/announces', (req, res, next) => {
  // const mockData = announcementService.inquiryAnnouncesResponse;
  const mockData = announcementService.inquiryAddAnnouncesResponse;
  res.status(200).json(mockData);
});
server.get('/v1/auction/:aucRef/create-announce', (req, res, next) => {
  // const mockData = announcementService.inquiryAnnouncesResponse;
  const mockData = announcementService.inquiryCreateAnnounceResponse;
  res.status(200).json(mockData);
  // res.status(500).json(mockData);
});

server.get('/v1/auction/announce-validate', (req, res, next) => {
  // fail
  res.status(200).json({
    validateStatus: false,
    aucRef: 99,
    aucStatus: 'NOT_PROCEED',
    matchingStatus: 'PENDING_NEW_ANNOUNCE',
  });
});
server.post('/v1/auction/:aucRef/create-announce/submit', (req, res, next) => {
  // const mockData = announcementService.inquiryAnnouncesResponse;
  const res1 = announcementService.inquiryCreateAnnounceResponse;
  const mockData = {
    aucRef: res1?.aucRef,
    litigationCaseId: res1?.caseMatchDetail?.litigationCaseId,
    ledId: res1?.caseMatchDetail?.ledId,
  };
  res.status(200).json(mockData);
  // res.status(500).json({
  //   errors: [{ code: 'AUC060' }],
  // });
});

server.get('/v1/auction/:aucRef/collaterals', (req, res, next) => {
  const mockData = announcementService.auctionCollaterals;
  res.status(200).json(mockData);
});

server.get('/v1/auction/execution/lexs-seizures', (req, res, next) => {
  const mockData = announcementService.auctionLexsSeizures;
  res.status(200).json(mockData);
});

server.get('/v1/auction/lexs-collateral', (req, res, next) => {
  const mockData = announcementService.auctionLexsCollaterals;
  res.status(200).json(mockData);
});


server.post('/v1/auction/:aucRef/not-process', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(null);
  }
});
server.post('/v1/auction/:aucRef/re-process', (req, res, next) => {
  const errorCode = { errors: [{ code: 'EAUC001' }] };
  if (errorCode) {
    res.status(422).json(errorCode);
  } else {
    res.status(200).json(null);
  }
});

server.post('/v1/auction/:aucRef/litigation-case/adjust-submit', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(null);
  }
});

server.post('/v1/auction/:aucRef/litigation-case/unmatch', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(null);
  }
});

server.post('/v1/auction/:aucRef/litigation-case/match', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(null);
  }
});

server.post('/v1/auction/:aucRef/litigation-case/submit', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(null);
  }
});

server.post('/v1/auction/expense/submit', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json({
      "imageId": '',
      "status": 'COMPLETE',
      "uploadTimeStamp": '',
      "auctionExpenseId": 111
    });
  }
});

server.post('/v1/auction/:aucRef/litigation-case/submit', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(null);
  }
});

server.post('/v1/auction/announces/excel', (req, res, next) => {
  const mockData = announcementService.inquiryAnnouncesResponse;
  res.status(200).json(mockData);
});

server.post('/v1/auction/execution/tasks/:taskId/submit', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(null);
  }
});

server.post('/v1/auction/collateral/validate', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(null);
  }
});

server.post('/v1/auction/collateral/match', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(null);
  }
});
server.get('/v1/auction/conveyance/mas/deedGroups/0/transfer-property', (req, res, next) => {
  let data = announcementService.getTransfer;
  res.status(200).json(data);
});
server.get('/v1/auction/conveyance/announces/:deedId/documents', (req, res, next) => {
  let data = conveyanceService.getConveyanceAnnouncesDocuments;
  console.log(data,'-0-0-0-');
  res.status(200).json(data);
});

server.get('/v1/auction/litigation/:litigationId/legal-executions/auction/litigation-case-leds', (req, res, next) => {
  const mockData = announcementService.inquiryLedInfo;
  res.status(200).json(mockData);
});

server.get('/v1/auction/expense/info', (req, res, next) => {
  const response = {
    auctionExpenseType: 'SUMMON_FOR_SURCHARGE',
    citationCaseAssignedTimestamp: '',
    citationCaseCreatedTimestamp: '',
    citationCaseNo: '',
    commandTimestamp: '',
    createdTimestamp: '',
    daysSla: 0,
    daysSpent: 0,
    documents: [],
    feePaidTimestamp: '',
    id: 2,
    initBy: '',
    isFeePaid: false,
    ledId: 0,
    ledName: '',
    litigationCaseId: 0,
    reason: '',
    slaTrackingId: '',
    status: '',
  };
  res.status(200).json(response);
});

server.get('/v1/auction/:aucRef/bidding-announce', (req, res, next) => {
  const mockData = announcementService.getAuctionBiddingAnnounce;
  res.status(200).json(mockData);
});

// server.get('/v1/auction/:ledId/:litigationCaseId', (req, res, next) => {
//   // const mockData = announcementService.inquirySeizureInfo;
//   // res.status(200).json(mockData);
// });

server.get('/v1/auction/expense/:ledId/:litigationCaseId', (req, res, next) => {
  const mockData = announcementService.inquiryAuctionExpense;
  res.status(200).json(mockData);
});

server.get('/v1/auction/litigation-case/:caseId/leds/:ledId/announces/process', (req, res, next) => {
  const mockData = announcementService.getAuctionLitigationAnnouncesProcess;
  res.status(200).json(mockData);
});

server.get('/v1/auction/litigation-case/:caseId/leds/:ledId/announces/complete', (req, res, next) => {
  const mockData = announcementService.getAuctionLedsAnnouncesResult;
  res.status(200).json(mockData);
});

server.get('/v1/auction/cashier-cheque/collaterals/inquiry', (req, res, next) => {
  const mockData = announcementService.inquiryAuctionCashierChequeCollateralsInfo;
  res.status(200).json(mockData);
});

server.get('/v1/auction/cashier-cheque/stamp-duty/inquiry', (req, res, next) => {
  const mockData = announcementService.getAuctionCashierStampDuty;
  res.status(200).json(mockData);
});

server.get('/v1/auction/biddings/announces/:aucRef/bidding-collaterals/summary', (req, res, next) => {
  const mockData = announcementService.getAuctionBiddingCollateralsSummary;
  res.status(200).json(mockData);
});

// server.get('/v1/auction/:aucRef/bidding-announce', (req, res, next) => {
//   const mockData = announcementService.getAuctionBiddingAnnounce;
//   res.status(200).json(mockData);
// });

server.post('/v1/auction/cashier-cheque/NaN/approval', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(null);
  }
});

// รายละเอียดประวัติผลการขาย
//-- Other
server.get('/v1/auction/biddings/:aucBiddingId/deed-groups/:deedGroupId/result', (req, res, next) => {
  const mockData = announcementService.getAuctionBiddingDeedGroup;
  res.status(200).json(mockData);
});
//-- รายละเอียมติ

server.get('/v1/auction/npa/deedGroups/:deedGroupId/resolutions/latest', (req, res, next) => {
  const mockData = announcementService.inquiryLatestResolutionInfo;
  res.status(200).json(mockData);
});

// property NPA in history

server.get('/v1/auction/biddings/announces/:aucRef/bidding-collaterals', (req, res, next) => {
  const mockData = announcementService.inquiryBiddingCollaterals;
  res.status(200).json(mockData);
});
//-- end รายละเอียดประวัติผลการขาย

// -- history date
server.get('/v1/auction/biddings/:aucBiddingId/result', (req, res, next) => {
  const mockData = announcementService.getAuctionBiddingResultResponse;
  res.status(200).json(mockData);
});
// ===============

//--- Genral detail in Auction detail
server.get('/v1/auction/biddings/announces/:aucRef/bidding-announce', (req, res, next) => {
  const mockData = announcementService.getAuctionBiddingAnnounceResult;
  res.status(200).json(mockData);
});
//---

// --- NPA
server.get('/v1/auction/npa/:aucRef/resolutions/latest', (req, res, next) => {
  const mockData = announcementService.getAuctionResolutionsLatest;
  res.status(200).json(mockData);
});
//-----

// --- History NPA
server.get('/v1/auction/npa/:aucRef/resolutions/history', (req, res, next) => {
  const mockData = announcementService.getAuctionResolutionsHistory;
  res.status(200).json(mockData);
});
//-----

server.get('/v1/auction/cashier-cheque/branchList', (req, res, next) => {
  const mockData = announcementService.getAuctionCashierChequeBranchList;
  res.status(200).json(mockData);
});

server.get('/v1/auction/biddings/:auctionBiddingId/info', (req, res, next) => {
  const mockData = announcementService.getAuctionBiddingInfo;
  res.status(200).json(mockData);
});

server.get('/v1/auction/biddings/announces/:aucRef/bidding-collaterals/:deedGroupId', (req, res, next) => {
  const mockData = announcementService.getAuctionBiddingCollateralDeedGroup;
  res.status(200).json(mockData);
});
server.get('/v1/auction/debt-settlement-account/:id', (req, res, next) => {
  let data = announcementService.getDebtSettleMentData;
  res.status(200).json(data);
});

server.post('/v1/auction/debt-settlement-account/submit', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json({
      "description": "OK"
    });
  }
});
server.get('/v1/auction/conveyance/appointment/:deed/info', (req, res, next) => {
  let data = announcementService.getAppointmentInfo;
  res.status(200).json(data);
});
server.post('/v1/auction/conveyance/appointment/check-appointment', (req, res, next) => {
  let data = announcementService.checkData;
  res.status(200).json(data);
});

server.post('/v1/auction/biddings/:auctionBiddingId/result-recording/tasks/:taskId/submit', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json({
      "status": "COMPLETE" // VALIDATE: Pass validation#1, COMPLETE: Pass validation#2
    });
  }
});

server.post('/v1/auction/biddings/:auctionBiddingId/result', (req, res, next) => {
  const errorCode = '';
  const response = {
    "updateAucBiddingResults":
      [
        {
          "deedGroupId": 11,
          "aucBiddingDeedGroupId": 111,
          "aucBiddingDeedGroupStatus": "PENDING_DOC"
        },
        {
          "deedGroupId": 12,
          "aucBiddingDeedGroupId": 112,
          "aucBiddingDeedGroupStatus": "COMPLETE"
        },
        {
          "deedGroupId": 11,
          "aucBiddingDeedGroupId": 113,
          "aucBiddingDeedGroupStatus": "COMPLETE"
        }
      ]
  };
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(response);
  }
});

server.post('/v1/auction/biddings/:auctionBiddingId/documents/upload', (req, res, next) => {
  const errorCode = '';
  const response = {
    "documentTemplate":
    {
      "documentGroup": "AUCREFRESULT",
      "documentTemplateId": "LEXSF137",
      "documentName": "ใบประกาศขายทอดตลาด",
      "optional": false
    },
    "documentId": 111,
    "imageSource": "",
    "imageId": "1231231231",
    "imageName": "",
    "uploadTimestamp": "",
    "reuploadable": false
  };

  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(response);
  }
});
server.post('/v1/auction/biddings/:aucBiddingId/deed-groups/:aucBidingDeedGroupId/documents/upload', (req, res, next) => {
  const errorCode = '';
  const response = {
    "documentTemplate":
    {
      "documentGroup": "AUCREFRESULT",
      "documentTemplateId": "LEXSF137",
      "documentName": "ใบประกาศขายทอดตลาด",
      "optional": false
    },
    "documentId": 111,
    "imageSource": "",
    "imageId": "1231231231",
    "imageName": "",
    "uploadTimestamp": "",
    "reuploadable": false
  };

  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(response);
  }
});

server.delete('/v1/auction/biddings/99/deed-groups/111/documents', (req, res, next) => {
  const errorCode = '';
  const response = {
    "documentTemplate":
    {
      "documentGroup": "AUCREFRESULT",
      "documentTemplateId": "LEXSF137",
      "documentName": "ใบประกาศขายทอดตลาด",
      "optional": false
    },
    "documentId": 111,
    "imageSource": "",
    "imageId": "1231231231",
    "imageName": "",
    "uploadTimestamp": "",
    "reuploadable": false
  };

  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(response);
  }
});

server.post('/v1/financial/auction/cashier-cheque/:collateralId/collateral/approval', (req, res, next) => {
  const errorCode = '';
  const response = {
    "documentTemplate":
    {
      "documentGroup": "AUCREFRESULT",
      "documentTemplateId": "LEXSF137",
      "documentName": "ใบประกาศขายทอดตลาด",
      "optional": false
    },
    "documentId": 111,
    "imageSource": "",
    "imageId": "1231231231",
    "imageName": "",
    "uploadTimestamp": "",
    "reuploadable": false
  };

  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(null);
  }
});
// LEX2-18039-18046
server.get('/v1/auction/conveyance/account-documents/:accountDocFollowUpId', (req, res, next) => {
  const errorCode = '';
  const response = conveyanceService.getAccountDocumentsByAccountDocFollowUpId;
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(response);
  }
});
server.get('/v1/auction/conveyance/announces/:aucRef/account-documents', (req, res, next) => {
  const errorCode = '';
  const response = conveyanceService.getAccountDocumentsByAccountDocFollowUpId;
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(response);
  }
});
server.get('/v1/auction/conveyance/announces/:aucRef/account-documents/deed-groups', (req, res, next) => {
  const errorCode = '';
  const response = conveyanceService.getAccountDocumentDeedGroupsByAucRef;
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(response);
  }
});
// LEX2-464
server.get('/v1/seizure/litigation-case/:caseId/non-pledge-properties/Info', (req, res, next) => {
  const errorCode = '';
  const response = seizureService.getNonPledgePropertiesInfo;
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(response);
  }
});
////
server.get('/v1/auction/external-payment-tracking/:trackinId', (req, res, next) => {
  const errorCode = '';
  let data = announcementService.getExternalPaymentTracking;
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(data);
  }
});

server.get('/v1/auction/biddings/:aucBiddingId/deed-groups/:deedGroupId/result', (req, res, next) => {
  const errorCode = '';
  let data = announcementService.getAucBiddingDeedGrupResult;
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(data);
  }
});

// server.get('/v1/auction/npa/deedGroups/:deedGroupId/resolutions/latest', (req, res, next) => {
//   const errorCode = '';
//   let data = announcementService.getAucBiddingDeedGrupResult;
//   if (errorCode) {
//     res.status(403).json({ code: errorCode });
//   } else {
//     res.status(200).json(data);
//   }
// });

/**
 * /v1/workbench
 */
server.get('/v1/workbench/litigation/litigation-status', (req, res, next) => {
  res.status(200).json({});
});
server.get('/v1/workbench/financial/expense-status', (req, res, next) => {
  res.status(200).json({});
});
server.get('/v1/workbench/litigation/deferment', (req, res, next) => {
  res.status(200).json({});
});
server.get('/v1/financial/seizure-fee/:seizureId/non-efiling/receipt', (req, res, next) => {
  res.status(200).json({});
});
server.get('/v1/master-data/collateral-type', (req, res, next) => {
  res.status(200).json(collateralType);
});
server.get('/v1/master-data/collateral-sub-type', (req, res, next) => {
  res.status(200).json(collateralSubType);
});


server.post('/v1/seizure/:seizureId/document-validation/submit', (req, res, next) => {
  const errorCode = '';
  if (errorCode) {
    res.status(403).json({ code: errorCode });
  } else {
    res.status(200).json(null);
  }
});

// Investigation Assets


server.get('/v1/asset-investigation/litigation/:litigationId/litigation-cases', (req, res, next) => {
  let data = litigationInvestigatePropertyService.litigationCases;
  res.status(200).json(data);
});

server.get('/v1/asset-investigation/litigation-case/:litigationCaseId/create-info', (req, res, next) => {
  let data = litigationInvestigatePropertyService.litigationCreateInfo;
  res.status(200).json(data);
});
server.get('/v1/asset-investigation/:investigationId/info', (req, res, next) => {
  let data = litigationInvestigatePropertyService.investigationInfo;
  res.status(200).json(data);
});

server.get('/v1/preference/:preferenceGroupNo/inquiryDetails', (req, res, next) => {
  let data = {};
  res.status(200).json(data);
});













