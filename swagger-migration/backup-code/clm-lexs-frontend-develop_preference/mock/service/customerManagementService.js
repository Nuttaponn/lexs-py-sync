function inquiryCustomers() {
  let content = [];
  for (let index = 0; index < 10; index++) {
    const element = {
      accountNoCount: 5,
      accountNoList: '001536082619|001536114898|004516999994|007146019748|100004187697|100004187734|100004187966|100007859062|100007859074|100009199167|100075931044|100075931166|100075931191|100089269185|100091165455|100091165492|100091177826|100095449133|100095449231',
      amdResponseUnitCode: '000000',
      amdResponseUnitName: 'สาขาลำปาง',
      billNoCount: 6,
      billNoList: '001536082619|001536114898|004516999994|007146019748|100004661688|100007859074|100009199167|100075931056',
      branchCode: 'branchCode',
      cifNo: '000000000000',
      customerId: '00004837224' + index,
      customerStatus: 'NORMAL',
      defermentStatus: 'NORMAL',
      estimationExpireDate: '05/07/2570',
      loanTypeCode: '0010-เงินกู้เบิกเกินบัญชี|1001-เงินกู้ประจำ - ทั่วไป|4001-ซื้อลดตั๋วเงิน(ในท้องถิ่น)|4002-รับซื้อตั๋วเงิน(ในท้องถิ่น)|4157-หนังสือค้ำประกันการใช้กระแสไฟฟ้า',
      maxCFinal: 'C-Final/Stage',
      maxDpd: 90,
      maxStageAccount: 'maxStageAccount',
      name: 'name',
      responseUnitCode: '000000',
      responseUnitName: 'สาขาลำปาง',
      rmUserId: 'rmUserId'
    }
    content.push(element)
  }
  let data = {
    content: content,
    empty: false,
    first: true,
    last: false,
    number: 0,
    numberOfElements: 0,
    pageable: {
      offset: 0,
      pageNumber: 1,
      pageSize: 0,
      paged: false,
      sort: {
        empty: false,
        sorted: false,
        unsorted: false,
      },
      unpaged: false,
    },
    size: 0,
    sort: {
      empty: false,
      sorted: false,
      unsorted: false,
    },
    totalElements: 10,
    totalPages: 1,
  };
  return data;
}

function getCustomer() {
  let accountInfo = [];
  let accounts = [];
  let commitmentAccounts = []
  for (let index = 0; index < 1; index++) {
    const element = getAccountDto();
    accounts.push(element)
  }
  for (let index = 0; index < 1; index++) {
    const element = getCommitmentAccountDto();
    commitmentAccounts.push(element)
  }

  const element = {
    accounts: accounts,
    commitmentAccounts,
    summaryAll: 'number',
    summaryBadDebt: 'number',
    summaryDebt: 'number',
    totalBadInterestNonBook: 'number',
    totalBadLateChargeAmount: 'number',
    totalBadOutstandingAccruedInterest: 'number',
    totalBadOutstandingPrincipal: 'number',
    totalInterestNonBook: 'number',
    totalLateChargeAmount: 'number',
    totalOutstandingAccruedInterest: 'number',
    totalOutstandingPrincipal: 'number'
  }
  accountInfo.push(element)

  const _case = [{
    amdResponseUnitCode: 'string',
    amdResponseUnitName: 'string',
    amdUserId: 'string',
    amdUserName: 'string',
    aoUserId: 'string',
    aoUserName: 'string',
    blackCaseNo: 'string',
    customerId: 'string',
    customerName: 'string',
    defermentStatus: 'NORMAL',
    dpd: 10,
    expireDate: 'string',
    flag: 'string',
    kbdUserId: 'string',
    kbdUserName: 'string',
    lawyerId: 'string',
    lawyerName: 'string',
    lawyerOfficeCode: 'string',
    lawyerOfficeName: 'string',
    litigationId: 'string',
    litigationStatus: 'string',
    ownerBranchCode: 'string',
    ownerBranchName: 'string',
    redCaseNo: 'string',
    responseUnitCode: 'string',
    responseUnitName: 'string',
  }]

  const data = {
    accountInfo: accountInfo,
    amdResponseUnitCode: 'string',
    amdResponseUnitName: 'string',
    amdUserId: 'string',
    branchCode: '000000',
    branchName: 'สาขาลำปาง',
    cases: _case,
    cifNo: '000000000000',
    collateralInfo: 'CollateralInfo',
    commitmentAccounts,
    customerId: 'string',
    customerStatus: 'NORMAL',
    defermentStatus: 'LITIGATION_PROCESS',
    editStatus: 'NONE',
    kbdUserId: 'string',
    kdnUserId: 'string',
    name: 'บริษัท ก จำกัด มหาชน',
    personInfo: getPersonInfo(),
    responseUnitCode: '000000',
    responseUnitName: 'สาขาลำปาง',
    rmUserId: 'string'
  }
  return data;
}

function getPersonInfo() {
  let additionalPersons = [];
  let persons = [];
  for (let index = 0; index < 1; index++) {
    const additional = getPersonDto('INDIVIDUAL', false);
    const person = getPersonDto('INDIVIDUAL');
    additionalPersons.push(additional);
    persons.push(person);
  }
  return {
    additionalPersons: additionalPersons,
    persons: persons
  }
}

function getPersonDto(type = 'INDIVIDUAL' | 'JURISTIC', isPerson = true) {
  let personDto = {
    address: [{
      addressLine: '123/456 ซอยกอไก่',
      addressType: 'ที่อยู่ตามทะเบียน',
      countryCode: 'countryCode',
      countryName: '',
      districtCode: 'districtCode',
      districtName: 'เขตคอควาย',
      lastUpdate: 'DD/MM/YYYY',
      personId: 'personId',
      postalCode: '10000',
      provinceCode: 'provinceCode',
      provinceName: 'กรุงเทพมหานคร',
      source: 'DOPA/DBD',
      subdistrictCode: 'subdistrictCode',
      subdistrictName: 'แขวงขอไข่'
    },
    {
      address: '',
      addressType: 'ที่อยู่ตามสัญญา',
      countryCode: 'countryCode',
      countryName: '',
      districtCode: 'districtCode',
      districtName: '',
      lastUpdate: '',
      personId: 'personId',
      postalCode: '',
      provinceCode: 'provinceCode',
      provinceName: '',
      source: '',
      subdistrictCode: 'subdistrictCode',
      subdistrictName: ''
    }],
    bankruptcy: [{
      absProtDate: '15/12/2564',
      brsStatus: 'สถานะล้มละลาย',
      identificationNo: '00000000000',
      lastUpdate: '15/12/2564',
      redCaseNo: 'ผบ.1234/2550'
    },
    {
      absProtDate: '15/12/2564',
      brsStatus: 'สถานะล้มละลาย',
      identificationNo: '00000000000',
      lastUpdate: '15/12/2564',
      redCaseNo: 'ผบ.1234/2550'
    }],
    birthDate: 'DD/MM/YYYY',
    grade: isPerson ? 'A' : '',
    identificationNo: '0000000000',
    name: 'นายสมชาย ใจดี',
    nameChanged: false,
    addressChanged: false,
    personId: 'personId',
    personStatus: 'เสียชีวิต',
    personType: '',
    referencePersonId: 'referencePersonId',
    relation: 'Header - Relation'
  }
  if (type === 'INDIVIDUAL') {
    personDto.personType = 'INDIVIDUAL';
    return personDto
  } else {
    personDto.personType = 'JURISTIC';
    return personDto
  }
}

function getAccountDto() {
  return {
    accountId: 'string',
    accountNo: 'string',
    billNo: 'string',
    blackRedCaseNo: 'string',
    bookingCode: 'string',
    bookingName: 'string',
    branchCode: 'string',
    branchName: 'string',
    cfinal: 'string',
    cfinalStageAcc: 'string',
    contractDate: 'string',
    customerId: 'string',
    deliquencyDate: 'string',
    dpd: 0,
    expiryDate: 'string',
    interestNonBook: 0,
    lastPaidDate: 'string',
    lastUpdate: 'string',
    lateChargeAmount: 0,
    lgId: 'string',
    litigationId: 'string',
    litigationStatus: 'string',
    loanTypeCode: 'string',
    loanTypeName: 'string',
    marketCode: 'string',
    outstandingAccruedInterest: 0,
    outstandingPrincipal: 0,
    outstandingTotalAmount: 0,
    prescriptionDate: 'string',
    samFlag: 'string',
    stageAccount: 'string',
    tamcFlag: 'string',
    tdrDate: 'string',
    tdrTrackingResult: 'string',
    tdrTrackingStatus: 'string',
    totalAmount: 0,
    totalDebt: 0
  }
}

function getCommitmentAccountDto() {
  return {
    accountLinkages: ['string'],
    accountName: 'accountName',
    accountNumber: 'string',
    accountType: 'SUNDRY_AVAL',
    totalDebt: 0,
  }
}


module.exports = {
  inquiryCustomers: inquiryCustomers(),
  getCustomer: require('../data/customer/getCustomer.json'),
  getCustomerLiability: require('../data/customer/getCustomerLiability.json'),
  getCustomerLitigationCase: require('../data/customer/getCustomerLitigationCase.json'),
  inquireCustomerAuditLog: require('../data/customer/inquireCustomerAuditLog.json'),
  inquireDocumentAuditLog: require('../data/customer/inquireDocumentAuditLog.json')
};
