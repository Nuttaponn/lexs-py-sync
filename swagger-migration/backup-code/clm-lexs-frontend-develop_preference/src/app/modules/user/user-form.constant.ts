import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';

export const DASH_BOARD = [
  {
    item: 'ลูกหนี้ก่อนอนุมัติดำเนินคดี และสถานะเอกสาร (CIF)',
    checked: false,
    code: PCode.DASHBOARD_CUSTOMERS_DPD_DOC_STATUS,
  },
  {
    item: 'ลูกหนี้แบ่งตามสถานะการดำเนินคดี (เลขที่กฏหมาย)',
    checked: false,
    code: PCode.DASHBOARD_CUSTOMERS_LIGITATION_STATUS,
  },
  {
    item: 'การบอกกล่าวแบ่งตามประเภทผู้รับ',
    checked: false,
    code: PCode.DASHBOARD_NOTICES_RECIPIENT_TYPE,
  },
  {
    item: 'คดีความแบ่งตามกระบวนการศาล',
    checked: false,
    code: PCode.DASHBOARD_LAWSUIT_COURT_PROCEEDING,
  },
  {
    item: 'การชะลอดำเนินคดีแบ่งตามขั้นตอนดำเนินงาน',
    checked: false,
    code: PCode.DASHBOARD_HOLDING_LITIGATION_CASE,
  },
  {
    item: 'รายการเบิกเงินของ KTBLAW',
    checked: false,
    code: PCode.DASHBOARD_KLAW_FINANCIAL,
  },
  {
    item: 'เงินค่าธรรมเนียมศาลสั่งคืนค้างรับจากศาล',
    checked: false,
    code: PCode.DASHBOARD_COURT_RECEIVABLES,
  },
  {
    item: 'ลูกหนี้มีคำพิพากษา',
    checked: false,
    code: '',
  },
  {
    item: 'ชะลอบังคับคดีแบ่งตามขั้นตอนการดำเนินงาน',
    checked: false,
    code: PCode.VIEW_DEFERMENT_EXECUTION,
  },
  {
    item: 'สถานะหลักประกัน',
    checked: false,
    code: '',
  },
  {
    item: 'ขายทอดตลาด',
    checked: false,
    code: '',
  },
  {
    item: 'ลูกหนี้ในชั้นบังคับคดีแบ่งตามสถานะหลักประกัน',
    checked: false,
    code: PCode.VIEW_COLLATERAL_LEXS_STATUS,
  },
  {
    item: 'ลูกหนี้แบ่งตามสถานะบัญชีรับ-จ่าย',
    checked: false,
    code: PCode.VIEW_ACCOUNT_DOCUMENT_STATUS,
  },
];

export const TRANSFER_TASK = [
  {
    item: 'ดูข้อมูลงาน',
    checked: false,
    code: PCode.ALL_TASK_ACTION,
  },
  {
    item: 'โอนงาน',
    checked: false,
    code: PCode.TASK_TRANSFER,
  },
  {
    item: 'อัปเดทข้อมูลจาก DOPA',
    checked: false,
    code: PCode.UPDATE_DOPA,
  },
];

export const CUSTOMER = [
  {
    item: 'ดูข้อมูลลูกหนี้',
    checked: false,
    code: PCode.ALL_CUSTOMER_ACTION,
  },
  {
    item: 'เพิ่มรายชื่อผู้เกี่ยวข้อง',
    checked: false,
    code: PCode.CUSTOMERS_ADD_STAKEHOLDER,
  },
  {
    item: 'ตรวจสอบสถานะต้นฉบับเอกสารลูกหนี้',
    checked: false,
    code: PCode.CUSTOMERS_VERIFY_ORIGINAL_DOCS,
  },
  {
    item: 'อัปโหลดเอกสารลูกหนี้',
    checked: false,
    code: PCode.CUSTOMERS_UPLOAD_DOCS,
  },
  {
    item: 'แจ้งการเปลี่ยนชื่อ',
    checked: false,
    code: PCode.CUSTOMERS_INFORM_NAME_CHANGE,
  },

  {
    item: 'เริ่มกระบวนการดำเนินคดีเพื่อทำการเร่งรัดดำเนินคดีลูกหนี้',
    checked: false,
    code: PCode.CUSTOMERS_START_LITIGATION_PROCESS,
  },
  {
    item: 'อัปเดตข้อมูลลูกหนี้และผู้ที่เกี่ยวข้องแบบ real-time',
    checked: false,
    code: PCode.CUSTOMERS_UPDATE_CUSTOMER_REALTIME,
  },
  {
    item: 'อัปเดตข้อมูลหลักประกันแบบ real-time',
    checked: false,
    code: PCode.CUSTOMERS_UPDATE_COLLATERAL_REALTIME,
  },
  // SP7
  {
    item: 'เพิ่มบัญชีย่อยหลังมีคำพิพากษา',
    checked: false,
    code: PCode.CUSTOMERS_UPDATE_COLLATERAL_REALTIME,
  },
];

export const LAWSUIT = [
  {
    item: 'ดูข้อมูลลูกหนี้ดำเนินคดี',
    checked: false,
    code: PCode.ALL_LEGAL_ACTION,
  },
  {
    item: 'มอบหมายคดี',
    checked: false,
    code: PCode.LAWSUIT_ASSIGN_CASE,
  },
  {
    item: 'รวมเลขที่กฎหมาย',
    checked: false,
    code: PCode.LAWSUIT_MERGE_ID,
  },
  {
    item: 'สร้างคดี',
    checked: false,
    code: PCode.LAWSUIT_CREATE_CASE,
  },
  {
    item: 'สร้างบอกกล่าว',
    checked: false,
    code: PCode.LAWSUIT_CREATE_NOTICE,
  },
  {
    item: 'เพิ่มรายชื่อผู้เกี่ยวข้อง',
    checked: false,
    code: PCode.LAWSUIT_ADD_STAKEHOLDER,
  },
  {
    item: 'เพิ่มบัญชีย่อย',
    checked: false,
    code: PCode.LAWSUIT_ADD_SUB_ACCOUNT,
  },

  {
    item: 'ตรวจสอบสถานะต้นฉบับเอกสาร',
    checked: false,
    code: PCode.LAWSUIT_VERIFY_ORIGINAL_DOCS,
  },
  {
    item: 'อัพโหลดเอกสารในการดำเนินคดี',
    checked: false,
    code: PCode.LAWSUIT_UPLOAD_DOCS,
  },
  {
    item: 'บันทึกคำฟ้อง/อุทธรณ์/ฎีกา',
    checked: false,
    code: PCode.LAWSUIT_RECORD_INDICTMENT,
  },

  {
    item: 'ให้ความเห็นทนายความเกี่ยวกับการยื่นอุทธรณ์/ฎีกา',
    checked: false,
    code: PCode.LAWSUIT_GIVE_OPINION_TO_LAWYER,
  },
  {
    item: 'อนุมัติยื่นอุทธรณ์/ฎีกา',
    checked: false,
    code: PCode.LAWSUIT_APPROVE_APPEAL,
  },

  {
    item: 'ออกคำบังคับ',
    checked: false,
    code: PCode.LAWSUIT_ISSUE_DECREE,
  },
  {
    item: 'ปิดเลขที่กฏหมาย',
    checked: false,
    code: PCode.LAWSUIT_CLOSE_LEGAL_ID,
  },
  {
    item: 'บันทึกสถานะการติดตาม',
    checked: false,
    code: PCode.LAWSUIT_SAVE_FOLLOW_STATUS,
  },
  {
    item: 'แก้ไขข้อมูลคดี',
    checked: false,
    code: PCode.LAWSUIT_UPDATE_LITIGATION_INFO,
  },
  {
    item: 'เพิ่มวันนัดดำเนินการศาล',
    checked: false,
    code: PCode.LAWSUIT_ADD_COURT_PROCESSDINGS_APPOINTMENT,
  },
  {
    item: 'ลบบัญชีออกจากเลขที่กฎหมาย',
    checked: false,
    code: PCode.LAWSUIT_DELETE_LITIGATION_ACCOUNT,
  },
  {
    item: 'อัปโหลดเอกสารเพื่อทำการบอกกล่าวทวงถาม นิติบุคคลร้าง',
    checked: false,
    code: PCode.LAWSUIT_UPLOAD_DOCUMENT_NOTICE_CLOSED_JURISTIC,
  },
  {
    item: 'การดูเอกสารจากระบบ Profile direct และ Statement',
    checked: false,
    code: PCode.LAWSUIT_VIEW_DOCUMENT_FROM_PROFILE_DIRECT_AND_STATEMENT,
  },
  {
    item: 'เพิ่ม/ลบผู้เกี่ยวข้องกับคดีหลังมีเลขคดีดำ',
    checked: false,
    code: PCode.LAWSUIT_ADD_RELATED_PERSON_AFTER_UNDICIDED_CASE,
  },
];

export const EXPENSES = [
  {
    item: 'ดูข้อมูลการเงิน',
    checked: false,
    code: PCode.ALL_EXPENSE,
  },

  {
    item: 'สร้างหนังสือจ่ายเงิน',
    checked: false,
    code: PCode.FINANCE_EXPENSE_CREATE_PAYMENT_BOOK,
  },
  {
    item: 'ตรวจสอบการเบิกเงิน',
    checked: false,
    code: PCode.FINANCE_EXPENSE_VERIFY_WITHDRAWAL,
  },
  {
    item: 'บันทึกรับเอกสารจ่ายเงิน',
    checked: false,
    code: PCode.FINANCE_EXPENSE_RECORD_RECEIPT_PAYMENT_DOC,
  },
  {
    item: 'พิจารณาจ่ายเงิน',
    checked: false,
    code: PCode.FINANCE_EXPENSE_CONSIDER_PAY,
  },
  {
    item: 'อนุมัติจ่ายเงิน',
    checked: false,
    code: PCode.FINANCE_EXPENSE_APPROVE_PAY,
  },
  {
    item: 'อัปโหลดใบเสร็จรับเงิน',
    checked: false,
    code: PCode.FINANCE_EXPENSE_UPLOAD_RECEIPT,
  },
  {
    item: 'ตรวจสอบใบเสร็จรับเงิน',
    checked: false,
    code: PCode.FINANCE_EXPENSE_VERIFY_RECEIPT,
  },
  {
    item: 'ดาวน์โหลดหนังสือรับรองการหักภาษี ณ ที่จ่าย',
    checked: false,
    code: PCode.FINANCE_EXPENSE_DOWNLOAD_WHT,
  },
  {
    item: 'โอนงานจ่ายเงิน',
    checked: false,
    code: PCode.FINANCE_EXPENSE_TRANSFER_TASK,
  },
  {
    item: 'ลบเอกสาร Optional ประกอบการเบิกเงินที่เคย Upload ผ่าน LEXS',
    checked: false,
    code: PCode.FINANCE_EXPENSE_DELETE_UPLOAD_DOCUMENT,
  },
  {
    item: 'ดาวน์โหลดหนังสือเบิกจ่ายเงิน',
    checked: false,
    code: PCode.DOWNLOAD_EXPENSE_DOCUMENT,
  },
];
export const INCOMES = [
  {
    item: 'ดูข้อมูลการเงิน',
    checked: false,
    code: PCode.ALL_RECEIVE,
  },
  {
    item: 'สร้างหนังสือรับเงิน',
    checked: false,
    code: PCode.FINANCE_RECEIPT_CREATE_RECEIPT,
  },
  {
    item: 'ตรวจสอบหนังสือรับเงิน',
    checked: false,
    code: PCode.FINANCE_RECEIPT_VERIFY_RECEIPT,
  },
  {
    item: 'ดาวน์โหลด Credit Note',
    checked: false,
    code: PCode.DOWNLOAD_CREDIT_NOTE,
  },
];
export const TRANSFER = [
  {
    item: 'ดูข้อมูลการเงิน',
    checked: false,
    code: PCode.ALL_ADVANCE_RECEIVE,
  },
  {
    item: 'สร้างรายการโอนเงินทดรองจ่าย',
    checked: false,
    code: PCode.FINANCE_ADVANCE_CREATE_TRANSACTION,
  },
  {
    item: 'ตรวจสอบรายการโอนเงินทดรองจ่าย',
    checked: false,
    code: PCode.FINANCE_ADVANCE_VERIFY_TRANSACTION,
  },
];

export const REPORT = [
  {
    item: 'ดูข้อมูลรายงาน',
    checked: false,
    code: PCode.ALL_REPORT,
  },
  {
    item: 'รายงาน SLA',
    checked: false,
    code: PCode.VIEW_SLA_REPORT,
  },
  {
    item: 'รายงานภาษีหัก ณ ที่จ่าย',
    checked: false,
    code: PCode.WITHHOLDING_TAX_REPORT,
  },
];
export const UAM = [
  {
    item: 'ดูข้อมูลผู้ใช้งาน',
    checked: false,
    code: PCode.ALL_UAM,
  },
  {
    item: 'จัดการข้อมูลผู้ใช้',
    checked: false,
    code: PCode.MANAGE_USER,
  },
];
export const CONFIG = [
  {
    item: 'ดูข้อมูลตั้งค่า',
    checked: false,
    code: PCode.MANAGE_CONFIG,
  },
  {
    item: 'กำหนดค่าตัวแปรในระบบ',
    checked: false,
    code: PCode.MANAGE_CONFIG,
  },
];
export const COMMON = [
  {
    item: 'ดูข้อมูลในปฎิทิน',
    checked: false,
    code: PCode.COMMON_CALENDAR_ACTIVITIES,
  },
];

export const WAITING_EXECUTION = [
  {
    item: 'ดูข้อมูลงานรอรับมอบหมาย',
    checked: false,
    code: PCode.ALL_TASK_POOL_ASSIGNMENT,
  },
  {
    item: 'รับมอบหมายงาน',
    checked: false,
    code: PCode.ASSIGN_TASK_POOL,
  },
];

export const WRITE_EXECUTION_WARRANT = [
  {
    item: 'ดูข้อมูลการออกหมายบังคับคดี',
    checked: false,
    code: PCode.ALL_WARRANT,
  },
  {
    item: 'บันทึกสรุปภาระหนี้เพื่อออกหมายบังคับคดี',
    checked: false,
    code: PCode.SUBMIT_DEBT_LEGAL_ENFORCEMENT,
  },
  {
    item: 'มอบหมายทนายที่รับผิดชอบการ ออกหมายบังคับคดี',
    checked: false,
    code: PCode.DEBT_ENFORCEMENT_ASSIGNMENT,
  },
  {
    item: 'บันทึกผล การยื่นใบมอบอำนาจ และออกหมายบังคับคดี',
    checked: false,
    code: PCode.SUBMIT_ENFORCEMENT_RESULT,
  },
];

export const WITHDRAWN_WRITE_OF_EXECUTION = [
  {
    item: 'ดูข้อมูลการถอนการบังคับคดี',
    checked: false,
    code: PCode.ALL_WITHDRAW_EXECUTION,
  },
  {
    item: 'สั่งการถอนบังคับคดี',
    checked: false,
    code: PCode.WITHDRAW_EXECUTION,
  },
  {
    item: 'แก้ไขถอนการบังคับคดี',
    checked: false,
    code: PCode.EDIT_WITHDRAW_EXECUTION,
  },
  {
    item: 'อนุมัติการถอนบังคับคดี',
    checked: false,
    code: PCode.APPROVE_WITHDRAW_EXECUTION,
  },
  {
    item: 'ตรวจสอบเอกสารและแนะนำทนาย',
    checked: false,
    code: PCode.VERIFY_DOC_WITHDRAW_EXECUTION,
  },
  {
    item: 'มอบหมายทนาย',
    checked: false,
    code: PCode.ASSIGN_WITHDRAW_EXECUTION,
  },
  {
    item: 'บันทึกผลการถอนบังคับคดี',
    checked: false,
    code: PCode.SAVE_WITHDRAW_EXECUTION,
  },
];

export const DEFERMENT_OF_EXECUTION = [
  {
    item: 'ดูข้อมูลการชะลอบังคับคดี',
    checked: false,
    code: PCode.ALL_DELAY_EXECUTION,
  },
  {
    item: 'สั่งการชะลอบังคับคดี',
    checked: false,
    code: PCode.SUBMIT_DELAY_EXECUTION,
  },
  {
    item: 'อนุมัติสั่งการชะลอบังคับคดี',
    checked: false,
    code: PCode.APPROVE_DELAY_EXECUTION,
  },
  {
    item: 'สั่งการขยายระยะเวลาชะลอบังคับคดี',
    checked: false,
    code: PCode.EXTEND_DELAY_EXECUTION,
  },
  {
    item: 'แก้ไขชะลอบังคับคดี',
    checked: false,
    code: PCode.EDIT_DELAY_EXECUTION,
  },
  {
    item: 'ยกเลิกการชะลอบังคับคดี',
    checked: false,
    code: PCode.CANCEL_DELAY_EXECUTION,
  },
];
export const SEIZURE_PROPERTY = [
  {
    item: 'ดูข้อมูลการยึดทรัพย์จำนอง',
    checked: false,
    code: PCode.ALL_ASSET_SEIZURE,
  },
  {
    item: 'สั่งการยึดทรัพย์จำนอง และเตรียมเอกสารต้นฉบับ',
    checked: false,
    code: PCode.ASSET_SEIZURE_PREP,
  },
  {
    item: 'มอบหมายทนายตั้งเรื่องยึดทรัพย์ สำหรับยึด ทรัพย์นอกจำนอง และเพิ่มการยึดทรัพย์จำนอง',
    checked: false,
    code: PCode.ASSIGN_LAWYER_ASSET_SEIZURE,
  },
  {
    item: 'ตรวจรับเอกสารตัวจริง สำหรับการยึดทรัพย์จำนอง',
    checked: false,
    code: PCode.DOCUMENT_INSPECTION_ASSET_SEIZURE,
  },
  {
    item: 'บันทึกเลขเก็บและ ผลการตั้งเรื่องยึดทรัพย์จำนอง',
    checked: false,
    code: PCode.RECORD_SEIZURE_RESULT,
  },
];

export const CANCEL_SEIZURE_PROPERTY = [
  {
    item: 'ดูข้อมูลการยกเลิก การสั่งการยึดทรัพย์',
    checked: false,
    code: PCode.ALL_CANCEL_ASSET_SEIZURE,
  },
  {
    item: 'สั่งการยกเลิกการยึดทรัพย์',
    checked: false,
    code: PCode.CANCEL_ASSET_SEIZURE,
  },
  {
    item: 'ยืนยันคำสั่งการยกเลิกการยึดทรัพย์',
    checked: false,
    code: PCode.CONFIRM_CANCEL_ASSET_SEIZURE,
  },
  {
    item: 'ส่งเอกสารต้นฉบับคืน',
    checked: false,
    code: PCode.RETURN_ORIGINAL_DOCUMENTS,
  },
];

export const WITHDRAWN_SEIZURE_PROPERTY = [
  {
    item: 'ดูข้อมูลการถอนการยึดทรัพย์',
    checked: false,
    code: PCode.ALL_WITHDRAW_ASSET_SEIZURE,
  },
  {
    item: 'สั่งการถอนการยึดทรัพย์',
    checked: false,
    code: PCode.WITHDRAW_ASSET_SEIZURE,
  },
  {
    item: 'แก้ไขถอนการยึดทรัพย์',
    checked: false,
    code: PCode.EDIT_WITHDRAW_ASSET_SEIZURE,
  },
  {
    item: 'อนุมัติสั่งการถอนการยึดทรัพย์',
    checked: false,
    code: PCode.APPROVE_WITHDRAW_ASSET_SEIZURE,
  },
  {
    item: 'ตรวจสอบเอกสาร และเสนอรายชื่อทนาย',
    checked: false,
    code: PCode.VERIFY_DOC_WITHDRAW_SEIZURE,
  },
  {
    item: 'มอบหมายงานถอนการยึดทรัพย์',
    checked: false,
    code: PCode.ASSIGN_WITHDRAW_SEIZURE,
  },
  {
    item: 'บันทึกผลการถอนการยึดทรัพย์',
    checked: false,
    code: PCode.SAVE_RESULT_WITHDRAW_SEIZURE,
  },
];

export const AUCTION = [
  {
    item: 'ดูข้อมูลการขายทอดตลาด',
    checked: false,
    code: PCode.ALL_AUCTION_EXCEPT_MATCH,
  },
  {
    item: 'มอบหมายทนายขายทอดตลาด',
    checked: false,
    code: PCode.ASSIGN_AUCTION,
  },
  {
    item: 'บันทึกคำขอค่าใช้จ่ายประกาศขายทอดตลาด (E-Filing)',
    checked: false,
    code: PCode.SUBMIT_AUCTION_EXPENSE,
  },
  {
    item: 'บันทึกคำขอค่าใช้จ่ายประกาศขายทอดตลาด (Non E-Filing)',
    checked: false,
    code: PCode.SUBMIT_AUCTION_CASHIER_CHEQUE_EXPENSE,
  },
  {
    item: 'ตรวจสอบการออกแคชเชียร์เช็ค (วางค่าใช้จ่ายเพิ่มเติม)',
    checked: false,
    code: PCode.VERIFY_AUCTION_CASHIER_CHEQUE_EXPENSE,
  },
  {
    item: 'พิจารณาอนุมัติแคชเชียร์เช็ค (วางค่าใช้จ่ายเพิ่มเติม)',
    checked: false,
    code: PCode.APPROVE_AUCTION_CASHIER_CHEQUE_EXPENSE,
  },
  {
    item: 'กรอกข้อมูลการรับแคชเชียร์เช็คหลักประกัน (กรณีมติซื้อ)',
    checked: false,
    code: PCode.SUBMIT_AUCTION_CHECK_INFO,
  },
  {
    item: 'ตรวจสอบการออกแคชเชียร์เช็คหลักประกัน (กรณีมติซื้อ)',
    checked: false,
    code: PCode.VERIFY_AUCTION_CHECK_INFO,
  },
  {
    item: 'พิจารณาอนุมัติแคชเชียร์เช็คหลักประกัน (กรณีมติซื้อ)',
    checked: false,
    code: PCode.APPROVE_AUCTION_CHECK_INFO,
  },
  {
    item: 'บันทึกผลการขายทรัพย์แต่ละวันขาย',
    checked: false,
    code: PCode.SUBMIT_AUCTION_DAY_RESULT,
  },
  {
    item: 'กรอกข้อมูลการรับแคชเชียร์เช็คอากรแสตมป์ (กรณีธนาคารกรุงไทยซื้อทรัพย์ได้)',
    checked: false,
    code: PCode.SUBMIT_AUCTION_CHECK_STAMP_DUTY,
  },
  {
    item: 'ตรวจสอบการออกแคชเชียร์เช็คอากรแสตมป์ (กรณีธนาคารกรุงไทยซื้อทรัพย์ได้)',
    checked: false,
    code: PCode.VERIFY_AUCTION_CHECK_STAMP_DUTY,
  },
  {
    item: 'พิจารณาอนุมัติแคชเชียร์เช็คอากรแสตมป์ (กรณีธนาคารกรุงไทยซื้อทรัพย์ได้)',
    checked: false,
    code: PCode.APPROVE_AUCTION_CHECK_STAMP_DUTY,
  },
  {
    item: 'บันทึกติดตามการชำระเงิน (กรณีบุคคลภายนอกซื้อทรัพย์)',
    checked: false,
    code: PCode.TRACK_PAYMENT_RECORD,
  },
  {
    item: 'กรอกข้อมูลการรับแคชเชียร์เช็ควางเงินเพิ่ม (กรณีวางเงินเพิ่ม)',
    checked: false,
    code: PCode.SUBMIT_ADDITION_DEPOSIT_CHECK,
  },
  {
    item: 'ตรวจสอบคำขอออกแคชเชียร์เช็ควางเงินเพิ่ม (กรณีวางเงินเพิ่ม)',
    checked: false,
    code: PCode.VERIFY_ADDITION_DEPOSIT_CHECK,
  },
  {
    item: 'อนุมัติออกแคชเชียร์เช็ควางเงินเพิ่ม (กรณีวางเงินเพิ่ม)',
    checked: false,
    code: PCode.APPROVE_ADDITION_DEPOSIT_CHECK,
  },
  {
    item: 'บันทึกอัพโหลดเอกสารที่ได้จากการซื้อทรัพย์',
    checked: false,
    code: PCode.ACQUIRED_ASSET_DOCUMENT_UPLOAD,
  },
  {
    item: 'บันทึกนัดหมายโอนกรรมสิทธิ์',
    checked: false,
    code: PCode.ASSET_TRANSFER_APPOINTMENT,
  },
  {
    item: 'บันทึกข้อมูลออกแคชเชียร์เช็คเพื่อโอนกรรมสิทธิ์ (กรณีธนาคารกรุงไทยซื้อทรัพย์ได้)',
    checked: false,
    code: PCode.SUBMIT_CHECK_ASSET_TRANSFER,
  },
  {
    item: 'อนุมัติการออกแคชเชียร์เช็คโอนกรรมสิทธิ์ (กรณีธนาคารกรุงไทยซื้อทรัพย์ได้)',
    checked: false,
    code: PCode.APPROVE_CHECK_ASSET_TRANSFER,
  },
  {
    item: 'บันทึกการตัดหักชำระหนี้',
    checked: false,
    code: PCode.SUBMIT_DEBT_PAYMENT_REDUCTION,
  },
  {
    item: 'อนุมัติการตัดหักชำระหนี้',
    checked: false,
    code: PCode.APPROVE_DEBT_PAYMENT_REDUCTION,
  },
  {
    item: 'บันทึกผลติดตามบัญชีรับจ่ายและตรวจรับรองบัญชี',
    checked: false,
    code: PCode.SUBMIT_ACCOUNT_AUDIT_CERTIFICATION,
  },
  {
    item: 'อนุมัติการติดตามบัญชีรับจ่ายและ ตรวจรับรองบัญชี',
    checked: false,
    code: PCode.APPROVE_ACCOUNT_AUDIT_CERTIFICATION,
  },
];

export const TRANDFER_ASSET = [
  {
    item: 'ดูข้อมูลการโอนกรรมสิทธิ์',
    checked: false,
    code: PCode.ALL_TRANSFER_ASSSET,
  },
];
export const INVESTIGATES_PROPERTY = [
  {
    item: 'ดูข้อมูลการสืบทรัพย์',
    checked: false,
    code: PCode.ALL_INVESTIGATION_ASSET,
  },
  {
    item: 'สั่งการสืบทรัพย์',
    checked: false,
    code: PCode.ORDER_INVESTIGATION_ASSET,
  },
];
export const NOTICE = [
  {
    item: 'ดูข้อมูลหมายและใบประกาศทั้งหมด',
    checked: false,
    code: PCode.ALL_AUCTION_ONLY_MATCH,
  },
  {
    item: 'จับคู่ใบประกาศ',
    checked: false,
    code: PCode.MATCH_ASSET_AUCTION,
  },
];

export const MODE = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  VIEW: 'VIEW',
};

export const DataScopeList = [
  {
    text: 'ข้อมูลของตนเอง',
    code: 'SELF',
  },
  {
    text: 'ข้อมูลของทีม',
    code: 'TEAM',
  },
  {
    text: 'ข้อมูลระดับองค์กร',
    code: 'ORGANIZATION',
  },
];

export const LevelList = [
  {
    text: 'ทุกสิทธิ์การดูข้อมูล',
    value: 'ALL',
  },
  {
    text: 'ข้อมูลของตนเอง',
    value: 'SELF',
  },
  {
    text: 'ข้อมูลของทีม',
    value: 'TEAM',
  },
  {
    text: 'ข้อมูลระดับองค์กร',
    value: 'ORGANIZATION',
  },
];

export const UPDATE_FLAG = {
  CREATE: 'C',
  UPDATE: 'U',
};
export const LEVEL_CODE = {
  ORGANIZATION: 'ORGANIZATION',
  GROUP: 'GROUP',
  FACTION: 'FACTION',
  OFFICER: 'OFFICER',
  TEAM: 'TEAM',
  ALL: 'ALL',
};

export const KEY_TEMPLATE_UAM = [
  {
    key: 'dashBoard',
    value: DASH_BOARD,
  },
  {
    key: 'transferTask',
    value: TRANSFER_TASK,
  },
  {
    key: 'excutionWarrant',
    value: WAITING_EXECUTION,
  },
  {
    key: 'writeExecutionWarrant',
    value: WRITE_EXECUTION_WARRANT,
  },
  {
    key: 'withdrawmnWriteOfExecution',
    value: WITHDRAWN_WRITE_OF_EXECUTION,
  },
  {
    key: 'defermentOfExecution',
    value: DEFERMENT_OF_EXECUTION,
  },
  {
    key: 'seizureProperty',
    value: SEIZURE_PROPERTY,
  },
  {
    key: 'transferTask',
    value: TRANSFER_TASK,
  },
  {
    key: 'cancelSeizureProperty',
    value: CANCEL_SEIZURE_PROPERTY,
  },
  {
    key: 'withdrawmnSeizureProperty',
    value: WITHDRAWN_SEIZURE_PROPERTY,
  },
  {
    key: 'customer',
    value: CUSTOMER,
  },
  {
    key: 'law',
    value: LAWSUIT,
  },
  {
    key: 'expenses',
    value: EXPENSES,
  },
  {
    key: 'income',
    value: INCOMES,
  },
  {
    key: 'transfer',
    value: TRANSFER,
  },
  {
    key: 'report',
    value: REPORT,
  },
  {
    key: 'common',
    value: COMMON,
  },
  {
    key: 'uam',
    value: UAM,
  },
  {
    key: 'auction',
    value: AUCTION,
  },
  {
    key: 'investigate',
    value: INVESTIGATES_PROPERTY,
  },
  {
    key: 'notice',
    value: NOTICE,
  },
  {
    key: 'transferAsset',
    value: TRANDFER_ASSET,
  },
  {
    key: 'config',
    value: CONFIG,
  },
];
