module.exports = {
  getCaseStatus: getCaseStatus(),
  getCaseCreator: getCaseCreator(),
  getCollateralStatus: getCollateralStatus(),
  getCollateralType: getCollateralType(),
  getCourt: getCourt(),
  getCustomerStatus: getCustomerStatus(),
  getDebtTransferTo: getDebtTransferTo(),
  getDebtor: getDebtor(),
  getDistrict: getDistrict(),
  getDoneBy: getDoneBy(),
  getSamFlag: getSamFlag(),
  getFollowUpStatus: getFollowUpStatus(),
  getKtbOrg: getKtbOrg(),
  getBcOrg: getBcOrg(),
  getLegalStatus: getLegalStatus(),
  getLoanType: getLoanType(),
  getProvince: getProvince(),
  getScope: getScope(),
  getSubdistrict: getSubdistrict(),
  getTamcFlag: getTamcFlag(),
  getTaskType: getTaskType(),
  getTaskStatus: getTaskStatus(),
  getWriteOffStatus: getWriteOffStatus(),
  getLitigationCloseStatus: getLitigationCloseStatus(),
  getExternalAssetStatus: getExternalAssetStatus(),
  getAllegation: require('../data/masterData/allegations.json'),
  getDefermentReason: getDefermentReason(),
  getApprovalAuthority: getApprovalAuthority(),
  getTitle: getTitle(),
  ciosCaseType: ciosCaseType(),
  courtVerdictType: courtVerdictType(),
  courtFeeType: courtFeeType(),
  courtVerdict: courtVerdict(),
  courtFeeSubType: courtFeeSubType(),
  courtSubVerdict: courtSubVerdict(),
  expenseNo: expenseNo(),
  expenseStatus: expenseStatus(),
  userOptions: userOptions().userOptions,
  courtOrder: courtOrder(),
  suspensExecution: suspensExecution(),
  expenseReviseReason: expenseReviseReason(),
  expenseCancelReason: expenseCancelReason(),
  expenseAction: expenseAction(),
  expenseObject: expenseObject(),
  receiveNo: receiveNo(),
  receiveStatus: receiveStatus(),
  receiveType: receiveType(),
  receiveAccountCode: receiveAccountCode(),
  advancePaymentNo: advancePaymentNo(),
  advancePaymentStatus: advancePaymentStatus(),
  getReceiveCancelReason: getReceiveCancelReason(),
  financialObjectType: financialObjectType(),
  caseType: caseType(),
  financialAccountCode: financialAccountCode(),
  occupant: occupant(),
};

function getCaseStatus() {
  data = [
    { "text": "เตรียมข้อมูล", "value": "001" },
    { "text": "เตรียมการบอกกล่าว", "value": "002" },
    { "text": "บอกกล่าว", "value": "003" },
    { "text": "ยื่นฟ้องศาลชั้นต้น", "value": "004" },
    { "text": "สืบพยานศาลชั้นต้น", "value": "005" },
    { "text": "ศาลชั้นต้นพิพากษา", "value": "006" },
    { "text": "สืบพยานศาลอุทธรณ์", "value": "008" },
    { "text": "ศาลอุทธรณ์พิพากษา", "value": "009" },
    { "text": "ยื่นฎีกา", "value": "010" },
    { "text": "สืบพยานศาลฎีกา", "value": "011" },
    { "text": "ศาลฎีกาพิพากษา", "value": "012" }
  ];
  return data;
}

function receiveAccountCode() {
  return {
    "receiveAccountCode": [
      {
        "caption": "caption_1",
        "code": "code_1",
        "receiveType": "INTER_OFFICE"
      }
    ]
  }
}

function occupant() {
  return data = { occupant: [...mockData('occupant', 5)] };
}

function financialAccountCode() {
  return data = { receiveStatus: [...mockData('financialAccountCode', 5)] };
}

function caseType() {
  return data = { receiveStatus: [...mockData('caseType', 5)] };
}

function financialObjectType() {
  return data = { receiveStatus: [...mockData('financialObjectType', 5)] };
}

function receiveStatus() {
  return data = { receiveStatus: [...mockData('receiveStatus', 5)] };
}

function receiveType() {
  return data = { receiveType: [...mockData('receiveType', 5)] };
}

function expenseObject() {
  return data = { expenseObject: [...mockData('expenseObject', 5)] };
}

function expenseAction() {
  return data = { expenseAction: [...mockData('expenseAction', 5)] };
}

function expenseReviseReason() {
  return data = { reviseReason: [...mockData('reviseReason', 5)] };
}

function expenseCancelReason() {
  return data = { cancelReason: [...mockData('cancelReason', 5)] };
}

function expenseNo() {
  return data = { expenseNo: [...mockData('expenseNo', 5)] };
}

function receiveNo() {
  return data = { receiveNo: [...mockData('receiveNo', 5)] };
}

function advancePaymentNo() {
  return data = { advancePaymentNo: [...mockData('advancePaymentNo', 2)] };
}
function expenseStatus() {
  return data = { expenseStatus: [...mockData('expenseStatus', 5)] };
}

function advancePaymentStatus() {
  return data = { advancePaymentStatus: [...mockData('advancePaymentStatus', 7)] };
}
function userOptions() {
  return data = { userOptions: [...mockData('userOptions', 5)] };
}

function courtOrder() {
  return data = { courtOrder: [...mockData('courtOrder', 5)] };
}

function suspensExecution() {
  return data = { suspensExecution: [...mockData('suspensExecution', 5)] };
}

function getCaseCreator() {
  return data = { caseCreator: [...mockData('writeOffStatus', 5)] };
}

function getCollateralStatus() {
  return data = { collateralStatus: [...mockData('writeOffStatus', 5)] };
}

function getCollateralType() {
  return data = { collateralType: [...mockData('writeOffStatus', 5)] };
}

function getCourt() {
  return data = { court: [...mockData('court', 5)] };
}

function getCustomerStatus() {
  return data = { customerStatus: [...mockData('customerStatus', 5)] };
}

function getDebtTransferTo() {
  return data = { debtTransferTo: [...mockData('debtTransferTo', 5)] };
}

function getDebtor() {
  return data = { debtor: [...mockData('debtor', 5)] };
}

function getDistrict() {
  return data = { district: [...mockData('district', 5)] };
}

function getDoneBy() {
  return data = { doneBy: [...mockData('doneBy', 5)] };
}

function getSamFlag() {
  return data = { samFlag: [...mockData('samFlag', 5)] };
}

function getFollowUpStatus() {
  return data = { followUpStatus: [...mockData('followUpStatus', 5)] };
}

function getKtbOrg() {
  return data = { ktbOrg: [...mockData('ktbOrg', 5)] };
}

function getBcOrg() {
  return data = { bcOrg: [...mockData('bcOrg', 5)] };
}

function getLegalStatus() {
  return data = { legalStatus: [...mockData('legalStatus', 5)] };
}

function getLoanType() {
  return data = { loanType: [...mockData('loanType', 20)] };
}

function getProvince() {
  return data = { province: [...mockData('province', 5)] };
}

function getScope() {
  return data = { scope: [...mockData('scope', 5)] };
}

function getSubdistrict() {
  return data = { subdistrict: [...mockData('subdistrict', 5)] };
}

function getTamcFlag() {
  return data = { tamcFlag: [...mockData('tamcFlag', 5)] };
}

function getTaskType() {
  return data = { taskType: [...mockData('taskType', 5)] };
}

function getTaskStatus() {
  return data = { taskStatus: [...mockData('taskStatus', 5)] };
}

function getWriteOffStatus() {
  return data = { writeOffStatus: [...mockData('writeOffStatus', 5)] };
}

function getLitigationCloseStatus() {
  return data = { litigationCloseStatus: [...mockData('litigationCloseStatus', 5)] };
}

function getExternalAssetStatus() {
  return data = { externalAssetStatus: [...mockData('externalAssetStatus', 5)] };
}

function getDefermentReason() {
  return data = { defermentReason: [...mockData('defermentReason', 5)] };
}

function getApprovalAuthority() {
  return data = { approvalAuthority: [...mockData('approvalAuthority', 5)] };
}

function getTitle() {
  return data = { title: [...mockData('title', 5)] };
}

function ciosCaseType() {
  return data = { ciosCaseType: [...mockData('ciosCaseType', 5)] };
}

function courtVerdictType() {
  return data = { courtVerdictType: [...mockData('courtVerdictType', 5)] };
}

function courtFeeType() {
  return data = { courtFeeType: [...mockData('courtFeeType', 5)] };
}

function courtVerdict() {
  return data = { courtVerdict: [...mockData('courtVerdict', 5)] };
}

function courtFeeSubType() {
  return data = { courtFeeSubType: [...mockData('courtFeeSubType', 5)] };
}

function courtSubVerdict() {
  return data = { courtSubVerdict: [...mockData('courtSubVerdict', 5)] };
}

function getReceiveCancelReason() {
  return data = { receiveCancelReason: [...mockData('receiveCancelReason', 5)] };
}

function mockData(str, num) {
  let temp = [];
  for (let index = 0; index < num; index++) {
    let element = {};
    if (str === 'taskStatus') {
      element = {
        type: 'type ' + str + ' : ' + index,
        name: 'name ' + str + ' : ' + index,
        value: 'value ' + str + ' : ' + index
      }
    } else if (str === 'userOptions') {
      element = {
        authorityCode: 'authorityCode ' + str + ' : ' + index,
        authorityName: 'authorityName ' + str + ' : ' + index,
        category: 'category ' + str + ' : ' + index,
        factionCode: 'factionCode ' + str + ' : ' + index,
        factionName: 'factionName ' + str + ' : ' + index,
        groupCode: 'groupCode ' + str + ' : ' + index,
        groupName: 'groupName ' + str + ' : ' + index,
        name: 'name ' + str + ' : ' + index,
        organizationCode: 'organizationCode ' + str + ' : ' + index,
        organizationName: 'organizationName ' + str + ' : ' + index,
        roleCode: 'roleCode ' + str + ' : ' + index,
        subRoleCode: 'subRoleCode ' + str + ' : ' + index,
        surname: 'surname ' + str + ' : ' + index,
        teamCode: 'teamCode ' + str + ' : ' + index,
        teamName: 'teamName ' + str + ' : ' + index,
        title: 'title ' + str + ' : ' + index,
        userId: 'userId ' + str + ' : ' + index,
      }
    } else {
      element = {
        name: 'name ' + str + ' : ' + index,
        value: 'value ' + str + ' : ' + index
      }
    }
    temp.push(element)
  }
  return temp
}
