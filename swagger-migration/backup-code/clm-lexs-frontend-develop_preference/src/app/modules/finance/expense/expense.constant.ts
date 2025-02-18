import { DropDownConfig } from '@spig/core';
// ขั้นตอนดำเนินคดีที่ขอเบิก
export const expenseStepTypeConfig: DropDownConfig = {
  displayWith: 'stepName',
  valueField: 'stepCode',
  searchPlaceHolder: '',
  labelPlaceHolder: 'ขั้นตอนดำเนินคดีที่ขอเบิก',
};
// ขั้นตอนการดำเนินคดีย่อยที่ขอเบิก
export const expenseStepSubTypeConfig: DropDownConfig = {
  displayWith: 'stepSubName',
  valueField: 'stepSubCode',
  searchPlaceHolder: '',
  labelPlaceHolder: 'ขั้นตอนการดำเนินคดีย่อยที่ขอเบิก',
};
// ประเภทค่าใช้จ่าย
export const expenseTypeConfig: DropDownConfig = {
  displayWith: 'expenseTypeFullName',
  valueField: 'expenseTypeCode',
  searchPlaceHolder: '',
  labelPlaceHolder: 'ประเภทค่าใช้จ่าย',
};
// ประเภทค่าใช้จ่ายย่อย
export const expenseSubTypeConfig: DropDownConfig = {
  displayWith: 'expenseSubTypeName',
  valueField: 'expenseSubTypeCode',
  searchPlaceHolder: '',
  labelPlaceHolder: 'ประเภทค่าใช้จ่ายย่อย',
};
// การขออนุมัติ
export const assigneeOptionConfig: DropDownConfig = {
  displayWith: 'name',
  valueField: 'value',
  searchPlaceHolder: '',
  labelPlaceHolder: 'ผู้อนุมัติ',
};
// เลือกผู้อนุมัติ
export const approverOptionConfig: DropDownConfig = {
  displayWith: 'name',
  valueField: 'value',
  searchPlaceHolder: '',
  labelPlaceHolder: 'ผู้อนุมัติ',
};

export const CHECK_BOX = [
  {
    item: 'ได้ตรวจสอบความครบถ้วนถูกต้องของเอกสารที่เกี่ยวข้องแล้ว',
    checked: false,
  },
  {
    item: 'ได้ตรวจสอบความถูกต้องของต้นฉบับใบรับเงินศาล และเจ้าหน้าที่ศาลได้ลงนามในต้นฉบับใบรับเงิน(ถ้ามี)ครบถ้วนแล้ว',
    checked: false,
  },
  {
    item: 'ได้ตรวจสอบความครบถ้วนถูกต้องของการบันทึกข้อมูลในระบบแล้ว',
    checked: false,
  },
  {
    item: 'ได้ตรวจสอบแล้วจำนวนเงินที่ขอเบิกถูกต้องตามสัญญา และยังไม่เคยเบิกจากธนาคารมาก่อน ',
    checked: false,
  },
  {
    item: 'ได้ตรวจสอบข้อมูลสำหรับการออกหนังสือรับรองการหักภาษี ณ ที่จ่าย (ถ้ามี) แล้ว',
    checked: false,
  },
];

export const ExpenseMsgMapper = new Map<string, string>([
  ['PAYMENT_FAILED', 'FINANCE_TITLE_MSG.PAYMENT_FAILED'],
  ['PENDING_AUTO_EXPENSE_CLAIM_CORRECTION', 'FINANCE_TITLE_MSG.PENDING_AUTO_EXPENSE_CLAIM_CORRECTION'], // LEX2-252 รอแก้ไขรายการจ่ายเงินอัตโนมัติ
  [
    'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL',
    'FINANCE_TITLE_MSG.PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL',
  ], // LEX2-252 รอตรวจสอบแก้ไขรายการจ่ายเงินอัตโนมัติ
  ['PENDING_AUTO_PAYMENT_APPROVAL', 'FINANCE_TITLE_MSG.PENDING_AUTO_PAYMENT_APPROVAL'], // LEX2-196
  ['PENDING_AUTO_PAYMENT_RECEIPT_UPLOAD', 'FINANCE_TITLE_MSG.PENDING_AUTO_PAYMENT_RECEIPT_UPLOAD'],
  ['PENDING_AUTO_PAYMENT_VERIFICATION', 'FINANCE_TITLE_MSG.PENDING_AUTO_PAYMENT_VERIFICATION'], // LEX2-105
  ['PENDING_CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION', 'FINANCE_TITLE_MSG.PENDING_CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION'], // LEX2-204
  ['PENDING_EXPENSE_CLAIM_CORRECTION', 'FINANCE_TITLE_MSG.PENDING_EXPENSE_CLAIM_CORRECTION'], // LEX2-252 รอแก้ไขรายการจ่ายเงิน
  ['PENDING_EXPENSE_CLAIM_VERIFICATION', 'FINANCE_TITLE_MSG.PENDING_EXPENSE_CLAIM_VERIFICATION'], // LEX2-95
  ['PENDING_NEWS_RECEIPT_UPLOAD', 'FINANCE_TITLE_MSG.PENDING_NEWS_RECEIPT_UPLOAD'], // LEX2-198
  ['PENDING_PAYMENT_APPROVAL', 'FINANCE_TITLE_MSG.PENDING_PAYMENT_APPROVAL'], // LEX2-101 รออนุมัติจ่ายเงิน
  ['PENDING_PAYMENT_APPROVAL_CONSIDERATION', 'FINANCE_TITLE_MSG.PENDING_PAYMENT_APPROVAL_CONSIDERATION'], // LEX2-101 รอพิจารณาอนุมัติจ่ายเงิน
  ['PENDING_PAYMENT_CONFIRMATION', 'FINANCE_TITLE_MSG.PENDING_PAYMENT_CONFIRMATION'],
  ['PENDING_PAYMENT_CONSIDERATION', 'FINANCE_TITLE_MSG.PENDING_PAYMENT_CONSIDERATION'], // LEX2-99 รอพิจารณาจ่ายเงิน
  ['PENDING_PAYMENT_RECEIPT_UPDATE', 'FINANCE_TITLE_MSG.PENDING_PAYMENT_RECEIPT_UPDATE'],
  ['PENDING_PAYMENT_RECEIPT_UPLOAD', 'FINANCE_TITLE_MSG.PENDING_PAYMENT_RECEIPT_UPLOAD'], // LEX2-106
  ['PENDING_PAYMENT_RECEIPT_APPROVAL', 'FINANCE_TITLE_MSG.PENDING_PAYMENT_RECEIPT_APPROVAL'],
  ['PENDING_PAYMENT_RECEIPT_APPROVAL_AUTO', 'FINANCE_TITLE_MSG.PENDING_PAYMENT_RECEIPT_APPROVAL_AUTO'],
  ['PENDING_ACCEPT_ORIGINAL_DOCUMENT', 'FINANCE_TITLE_MSG.PENDING_ACCEPT_ORIGINAL_DOCUMENT'], // LEX2-104
  ['PAYMENT_FAILED', 'FINANCE_TITLE_MSG.PAYMENT_FAILED'], // LEX2-101 CBS Error
  ['PENDING_AUTO_REVERSE_EXPENSE_CLAIM', 'FINANCE_TITLE_MSG.PENDING_AUTO_REVERSE_EXPENSE_CLAIM'], // LEX2-244
  ['PENDING_DECIDE_REVERSE_EXPENSE_CLAIM', 'FINANCE_TITLE_MSG.PENDING_DECIDE_REVERSE_EXPENSE_CLAIM'], // LEX2-247
  ['PENDING_PAYMENT_RECEIPT_UPDATE_AUTO', 'FINANCE_TITLE_MSG.PENDING_PAYMENT_RECEIPT_UPDATE_AUTO'],
  ['PENDING_CONSIDER_REFUND', 'FINANCE_TITLE_MSG.PENDING_CONSIDER_REFUND'],
]);

export const ReceiptErrorMsgMapper = new Map<string, string>([
  ['ERROR_REQUIRED', 'กรุณาอัปโหลดเอกสาร'], // LEX2-100
  ['ERROR_VERIFY_RECEIPT', 'กรุณาตรวจสอบใบเสร็จ'],
  ['ERROR_DATE_INVALID', 'กรุณาระบุวันที่ออกใบเสร็จ'],
  ['ERROR_MIN_DATE', 'วันที่ตามใบเสร็จห้ามน้อยกว่าวันปัจุบัน'],
  ['ERROR_EXPENSE_DATE_INVALID', 'วันที่ตามใบเสร็จไม่ถูกต้อง'],
]);

export const KbmReasonMapper = new Map<string, string>([
  ['PENDING_PAYMENT_CONFIRMATION', 'เหตุผลส่งให้ กบม. พิจารณา'], // LEX2-5328
  ['PENDING_EXPENSE_CLAIM_CORRECTION', 'เหตุผลไม่อนุมัติ'], // LEX2-252
  ['CANCELLED_EXPENSE_CLAIM', 'เหตุผลการขอคืนเงิน'], // LEX2-27441
  ['PENDING_AUTO_EXPENSE_CLAIM_CORRECTION', 'เหตุผลส่งกลับแก้ไข'], // LEX2-252
  ['PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL', 'เหตุผลส่งกลับแก้ไข'], // LEX2-252
  ['PAYMENT_FAILED', 'เหตุผลทำรายการไม่สำเร็จ'], // LEX2-101 Case : CBS Error
  ['PENDING_AUTO_REVERSE_EXPENSE_CLAIM', 'เหตุผลยกเลิกรายการ'], // LEX2-244
  ['PENDING_DECIDE_REVERSE_EXPENSE_CLAIM', 'เหตุผลยกเลิกรายการ'], // LEX2-247
  ['PENDING_AUTO_EXPENSE_CLAIM_CORRECTION', 'เหตุผลส่งกลับแก้ไข'],
]);
