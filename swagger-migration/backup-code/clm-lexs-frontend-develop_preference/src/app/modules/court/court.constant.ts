import { DOC_TEMPLATE } from '@app/shared/constant';
import { DocumentDto } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';

export const LEXSF052: any = [
  {
    documentDate: '',
    documentId: 0,
    active: true,
    documentTemplate: {
      documentName: 'หนังสือรับร้องคดีถึงที่สิ้นสุด',
      documentTemplateId: DOC_TEMPLATE.LEXSF052,
      optional: false,
    },
    documentTemplateId: DOC_TEMPLATE.LEXSF052,
    imageName: 'หนังสือรับร้องคดีถึงที่สิ้นสุด',
    imageSource: DocumentDto.ImageSourceEnum.Lexs,
    uploadRequired: true,
  },
];

const defaultDropDownConfig: DropDownConfig = {
  displayWith: '',
  valueField: '',
  searchPlaceHolder: '',
  labelPlaceHolder: '',
};

export const ciosCaseTypeConfig: DropDownConfig = {
  ...defaultDropDownConfig,
  ...{
    displayWith: 'name',
    valueField: 'code',
    labelPlaceHolder: 'เลือก',
  },
};

export const courtVerdictTypeConfig: DropDownConfig = {
  ...defaultDropDownConfig,
  ...{
    displayWith: 'verdictTypesName',
    valueField: 'verdictTypesCode',
    labelPlaceHolder: 'ประเภทคำพิพากษา/คำสั่ง',
  },
};

export const courtVerdictConfig: DropDownConfig = {
  ...defaultDropDownConfig,
  ...{
    displayWith: 'verdictName',
    valueField: 'verdictCode',
    labelPlaceHolder: 'คำพิพากษา/คำสั่ง',
  },
};

export const courtVerdictConfig1: DropDownConfig = {
  ...defaultDropDownConfig,
  ...{
    displayWith: 'verdictName',
    valueField: 'verdictCode',
    labelPlaceHolder: 'เงื่อนไขตามสัญญาประนีประนอมยอมความ',
  },
};

export const courtFeeTypeConfig: DropDownConfig = {
  ...defaultDropDownConfig,
  ...{
    displayWith: 'feeTypesName',
    valueField: 'feeTypesCode',
    labelPlaceHolder: 'ประเภทค่าฤชาธรรมเนียม',
  },
};

export const courtSubVerdictConfig: DropDownConfig = {
  ...defaultDropDownConfig,
  ...{
    displayWith: 'subVerdictName',
    valueField: 'subVerdictCode',
    labelPlaceHolder: 'เหตุผลที่ยกฟ้อง',
  },
};

export const courtFeeSubTypeConfig2: DropDownConfig = {
  ...defaultDropDownConfig,
  ...{
    displayWith: 'feeSubTypesName',
    valueField: 'feeSubTypesCode',
    labelPlaceHolder: 'ศาลไม่สั่งคืนธนาคาร',
  },
};
export const courtFeeSubTypeConfig1: DropDownConfig = {
  ...defaultDropDownConfig,
  ...{
    displayWith: 'feeSubTypesName',
    valueField: 'feeSubTypesCode',
    labelPlaceHolder: 'ศาลสั่งคืนธนาคารบางส่วน',
  },
};
export const caseEndConfig: DropDownConfig = {
  ...defaultDropDownConfig,
  ...{
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'คดีถึงที่สุด',
  },
};
export const caseEndOption = [
  {
    name: 'โจทก์ชนะ',
    value: '1',
  },
  {
    name: 'จำเลยชนะ',
    value: '2',
  },
];

export const redYearConfig: DropDownConfig = {
  displayWith: 'name',
  valueField: 'value',
  searchPlaceHolder: '',
  labelPlaceHolder: 'เลือก',
};

export const CONSIDER_APPEAL_DOCS_TEMP = [
  DOC_TEMPLATE.LEXSF081, // บันทึกงดอุทธรณ์โดย KTBLAW
  DOC_TEMPLATE.LEXSF083, // คำร้องขอขยายระยะเวลาอุทธรณ์
  DOC_TEMPLATE.LEXSF061, // เอกสารอื่นๆ
];
export const CONSIDER_SUPREME_COURT_DOCS_TEMP = [
  DOC_TEMPLATE.LEXSF082, // "บันทึกงดฎีกาโดย KTBLAW"
  DOC_TEMPLATE.LEXSF084, // คำร้องขอขยายระยะเวลาฎีกา
  DOC_TEMPLATE.LEXSF061, // เอกสารอื่นๆ
];
export const APPROVE_APPEAL_DOCS_TEMP = [
  DOC_TEMPLATE.LEXSF056, // "หนังสืออนุมัติผลอุทธรณ์/ไม่อุทธรณ์"
  DOC_TEMPLATE.LEXSF085, // "เอกสารที่เกี่ยวข้องกับการพิจารณาอุทธรณ์"
];
export const APPROVE_SUPREME_COURT_DOCS_TEMP = [
  DOC_TEMPLATE.LEXSF055, // "หนังสืออนุมัติผลฎีกา/ไม่ฎีกา"
  DOC_TEMPLATE.LEXSF086, // "เอกสารที่เกี่ยวข้องกับการพิจารณาฎีกา"
];
export const CONDITIONAL_APPEAL_DOCS_TEMP = [
  DOC_TEMPLATE.LEXSF081,
  DOC_TEMPLATE.LEXSF083,
  DOC_TEMPLATE.LEXSF056,
  DOC_TEMPLATE.LEXSF061,
  DOC_TEMPLATE.LEXSF085,
  DOC_TEMPLATE.LEXSF061,
]; // document for CONDITIONAL_APPEAL Step
export const CONDITIONAL_SUPREME_COURT_DOCS_TEMP = [
  DOC_TEMPLATE.LEXSF082,
  DOC_TEMPLATE.LEXSF084,
  DOC_TEMPLATE.LEXSF061,
  DOC_TEMPLATE.LEXSF055,
  DOC_TEMPLATE.LEXSF086,
  DOC_TEMPLATE.LEXSF061,
]; // document for CONDITIONAL_SUPREME Step
export const ADDTIONAL_DOCS_TEMP = [DOC_TEMPLATE.LEXSF061]; // "LEXSF061": "เอกสารอื่นๆ"
