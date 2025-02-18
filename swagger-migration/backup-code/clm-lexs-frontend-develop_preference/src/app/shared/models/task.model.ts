export interface TaskMode {
  mode?: taskMode;
  tabIndex?: number;
  subTabIndex?: number;
  underSubTabIndex?: number;
}

export type taskCode =
  | 'ADD_SUB_ACCOUNT'
  | 'VERIFY_INFO_AND_DOCUMENT'
  | 'CHANGE_RELATED_PERSON'
  | 'INVESTIGATE_HEIR_OR_TRUSTEE'
  | 'PROCESS_NOT_PROSECUTE_1'
  | 'PROCESS_NOT_PROSECUTE_2'
  | 'EDIT_MORTGAGE_ASSETS'
  | 'ON_REQUEST'
  | 'RECORD_NOTICE'
  | 'RECORD_NOTICE_GUARANTOR'
  | 'SEND_AND_TRACK_NOTICE'
  | 'SEND_AND_TRACK_NOTICE_GUARANTOR'
  | 'CONFIRM_NOTICE_LETTER'
  | 'NEWSPAPER_ANNOUCEMENT'
  | 'RECEIPT_ORIGINAL_DOCUMENT'
  | 'SUBMIT_ORIGINAL_DOCUMENT'
  | 'COLLECT_LG_ID'
  | 'INDICTMENT_RECORD'
  | 'RECORD_DIAGNOSIS_DATE'
  | 'MEMORANDUM_COURT_FIRST_INSTANCE'
  | 'CONSIDER_APPEAL'
  | 'APPROVE_APPEAL'
  | 'CONDITIONAL_APPEAL'
  | 'CONSIDER_SUPREME_COURT'
  | 'APPROVE_SUPREME_COURT'
  | 'CONDITIONAL_SUPREME_COURT'
  | 'DECREE'
  | 'CONFIRM_COURT_FEES_PAYMENT'
  | 'UPLOAD_COURT_FEES_RECEIPT'
  | 'REQUEST_DEFERMENT'
  | 'EXTEND_DEFERMENT'
  | 'REQUEST_CESSATION'
  | 'RESPONSE_UNIT_MAPPING'
  | 'CONSIDER_REMAINING_COSTS'
  | 'CONSIDER_APPROVE_CLOSE_LG'
  | 'AUTO_CREATE_DRAFT_DEFERMENT'
  | 'AUTO_CREATE_DRAFT_CESSATION'
  | 'AUTO_WHEN_MEET_CRITERIA_DEFERMENT'
  | 'AUTO_WHEN_MEET_CRITERIA_CESSATION'
  | 'MEMORANDUM_COURT_APPEAL'
  | 'MEMORANDUM_SUPREME_COURT'
  | 'CHANGE_RELATED_PERSON_BLACK_CASE'
  | 'CHANGE_RELATED_PERSON_LITIGATION_CASE'
  | 'DECREASE_RELATED_PERSON_LITIGATION_CASE'
  | 'RECORD_OF_APPEAL'
  | 'RECORD_OF_SUPREME_COURT'
  | 'RECORD_OF_SUPREME_COURT_ACKNOWLEDGE'
  | 'UPLOAD_E_FILING'
  | 'DECREE_OF_FIRST_INSTANCE'
  | 'DECREE_OF_APPEAL'
  | 'DECREE_OF_SUPREME_COURT'
  | 'PAY_EXECUTION_FEE_FIRST_INSTANCE'
  | 'PAY_EXECUTION_FEE_APPEAL'
  | 'PAY_EXECUTION_FEE_SUPREME'
  | 'UPLOAD_EXECUTION_RECEIPT_FIRST_INSTANCE'
  | 'UPLOAD_EXECUTION_RECEIPT_APPEAL'
  | 'UPLOAD_EXECUTION_RECEIPT_SUPREME'
  // finance EXPENSE
  | 'EXPENSE_CLAIM_VERIFICATION' // ตรวจสอบการเบิกเงิน
  | 'CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION' // อนุมัติเบิกค่าใช้จ่าย
  | 'EXPENSE_CLAIM_PAYMENT_APPROVAL' // อนุมัติการจ่ายเงิน
  | 'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL' // ตรวจสอบรายการ
  | 'EXPENSE_CLAIM_RECEIPT_UPLOAD' // อัปโหลดใบเสร็จ
  | 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD' // อัปโหลดใบเสร็จสื่อโฆษณา
  | 'EXPENSE_CLAIM_CORRECTION' // แก้ไขหนังสือเบิกเงิน
  | 'AUTO_CREATE_EXPENSE_CLAIM' // สร้างรายการเบิกเงินอัตโนมัติ่
  | 'EXPENSE_CLAIM_RETRY' // พิจารณาเบิกจ่ายใหม่
  | 'EXPENSE_CLAIM_SYSTEM_PAYMENT' // เบิกจ่ายโดยระบบ
  | 'EXPENSE_CLAIM_RECIEVE_ORIGINAL_DOCUMENT' // บันทึกรับเอกสาร
  | 'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT' // พิจารณาการคืนเงินค่าใช้จ่าย
  | 'REVERSE_EXPENSE_CLAIM_OTHER' // พิจารณาการคืนเงินค่าใช้จ่าย
  | 'DECIDE_REVERSE_EXPENSE_CLAIM' // ตัดสินคืนเงินค่าใช้จ่าย
  // finance RECEIPT
  | 'RECEIVE_NORMAL_PAYMENT'
  | 'RECEIVE_ADVANCE_PAYMENT'
  | 'RECEIVE_COURT_PAYMENT'
  | 'RECEIVE_CREDIT_NOTE_PAYMENT'
  // LITIGATION for EXECUTION
  | 'R2E04-02-2A'
  | 'R2E04-01-2B'
  | 'R2E04-03-3A'
  // LITIGATION for Seizure of Property
  | 'R2E05-01-2D' // งานเตรียมเอกสารสั่งการยึดทรัพย์และส่งเอกสารฉบับจริง
  | 'R2E05-02-3C' // งานตรวจสอบเอกสารสั่งการยึดทรัพย์และรับเอกสารตัวจริงของทรัพย์จำนอง
  | 'R2E05-04-4'
  | 'R2E05-03-3D' // งานส่งแก้ไขเอกสารต้นฉบับเมื่อมีการปฏิเสธการรับเอกสารจาก KTBLAW
  | 'R2E05-06-3F' // งานมอบหมายทนายความเพื่อตั้งเรื่องยึดทรัพย์
  | 'R2E05-09-4' // งานมอบหมายทนายความดำเนินการยึดทรัพย์นอกจำนอง
  // LITIGATION for Withdrawn Seizure Property
  | 'R2E06-01-A'
  | 'R2E06-02-B'
  | 'R2E06-03-C'
  | 'R2E06-04-D'
  | 'R2E06-05-E'
  | 'RECEIPT_REJECT_ORIGINAL_DOCUMENT'
  | 'SUBMIT_REJECT_ORIGINAL_DOCUMENT'
  | 'TRY_CONFIRM_COURT_FEES_PAYMENT'
  | 'REQUEST_REVISE_DEFERMENT'
  | 'REQUEST_REVISE_CESSATION'
  | 'SAVE_DRAFT_DEFERMENT'
  | 'SAVE_DRAFT_CESSATION'
  // DEFER EXECUTION
  | 'R2E07-01-A'
  | 'R2E07-02-B'
  | 'R2E07-04-D'
  | 'R2E07-03-C'
  | 'R2E07-05-E'
  | 'R2E14_LEX2_656'
  | 'R2E09-08-01-3.1'
  | 'R2E09-11-01'
  | 'R2E09-10-01'
  | 'R2E10-06-2A'
  | 'R2E09-06-03'
  | 'R2E09-09-01-13.1'
  | 'R2E09-09-03-14.1'
  | 'R2E35-01-E05-01-6A'
  | 'R2E35-01-E05-02-6B'
  | 'R2E35-02-E09-01-7A'
  | 'R2E35-02-E09-02-7B'
  | 'R2E05-08-3A'
  | 'R2E05-07-2A' // SP7
  | 'R2E05-10-5'
  | 'EXECUTE_PREFERENCE'
  | 'ASSIGN_LAWYER_PLAINTIFF_CASE'
  | 'PREPARE_PREFERENCE_DODUMENT';

export const taskCode = {
  ADD_SUB_ACCOUNT: 'ADD_SUB_ACCOUNT' as taskCode,
  VERIFY_INFO_AND_DOCUMENT: 'VERIFY_INFO_AND_DOCUMENT' as taskCode,
  CHANGE_RELATED_PERSON: 'CHANGE_RELATED_PERSON' as taskCode,
  INVESTIGATE_HEIR_OR_TRUSTEE: 'INVESTIGATE_HEIR_OR_TRUSTEE' as taskCode,
  PROCESS_NOT_PROSECUTE_1: 'PROCESS_NOT_PROSECUTE_1' as taskCode,
  PROCESS_NOT_PROSECUTE_2: 'PROCESS_NOT_PROSECUTE_2' as taskCode,
  EDIT_MORTGAGE_ASSETS: 'EDIT_MORTGAGE_ASSETS' as taskCode,
  ON_REQUEST: 'ON_REQUEST' as taskCode,
  RECORD_NOTICE: 'RECORD_NOTICE' as taskCode,
  RECORD_NOTICE_GUARANTOR: 'RECORD_NOTICE_GUARANTOR' as taskCode,
  SEND_AND_TRACK_NOTICE: 'SEND_AND_TRACK_NOTICE' as taskCode,
  SEND_AND_TRACK_NOTICE_GUARANTOR: 'SEND_AND_TRACK_NOTICE_GUARANTOR' as taskCode,
  CONFIRM_NOTICE_LETTER: 'CONFIRM_NOTICE_LETTER' as taskCode,
  NEWSPAPER_ANNOUCEMENT: 'NEWSPAPER_ANNOUCEMENT' as taskCode,
  RECEIPT_ORIGINAL_DOCUMENT: 'RECEIPT_ORIGINAL_DOCUMENT' as taskCode,
  SUBMIT_ORIGINAL_DOCUMENT: 'SUBMIT_ORIGINAL_DOCUMENT' as taskCode,
  COLLECT_LG_ID: 'COLLECT_LG_ID' as taskCode,
  INDICTMENT_RECORD: 'INDICTMENT_RECORD' as taskCode,
  RECORD_DIAGNOSIS_DATE: 'RECORD_DIAGNOSIS_DATE' as taskCode,
  MEMORANDUM_COURT_FIRST_INSTANCE: 'MEMORANDUM_COURT_FIRST_INSTANCE' as taskCode,
  MEMORANDUM_COURT_APPEAL: 'MEMORANDUM_COURT_APPEAL' as taskCode,
  MEMORANDUM_SUPREME_COURT: 'MEMORANDUM_SUPREME_COURT' as taskCode,
  CONSIDER_APPEAL: 'CONSIDER_APPEAL' as taskCode,
  APPROVE_APPEAL: 'APPROVE_APPEAL' as taskCode,
  CONDITIONAL_APPEAL: 'CONDITIONAL_APPEAL' as taskCode,
  CONSIDER_SUPREME_COURT: 'CONSIDER_SUPREME_COURT' as taskCode,
  APPROVE_SUPREME_COURT: 'APPROVE_SUPREME_COURT' as taskCode,
  CONDITIONAL_SUPREME_COURT: 'CONDITIONAL_SUPREME_COURT' as taskCode,
  DECREE: 'DECREE' as taskCode,
  CONFIRM_COURT_FEES_PAYMENT: 'CONFIRM_COURT_FEES_PAYMENT' as taskCode,
  UPLOAD_COURT_FEES_RECEIPT: 'UPLOAD_COURT_FEES_RECEIPT' as taskCode,
  REQUEST_DEFERMENT: 'REQUEST_DEFERMENT' as taskCode,
  EXTEND_DEFERMENT: 'EXTEND_DEFERMENT' as taskCode,
  REQUEST_CESSATION: 'REQUEST_CESSATION' as taskCode,
  RESPONSE_UNIT_MAPPING: 'RESPONSE_UNIT_MAPPING' as taskCode,
  CONSIDER_REMAINING_COSTS: 'CONSIDER_REMAINING_COSTS' as taskCode,
  CONSIDER_APPROVE_CLOSE_LG: 'CONSIDER_APPROVE_CLOSE_LG' as taskCode,
  AUTO_CREATE_DRAFT_DEFERMENT: 'AUTO_CREATE_DRAFT_DEFERMENT' as taskCode,
  AUTO_CREATE_DRAFT_CESSATION: 'AUTO_CREATE_DRAFT_CESSATION' as taskCode,
  AUTO_WHEN_MEET_CRITERIA_DEFERMENT: 'AUTO_WHEN_MEET_CRITERIA_DEFERMENT' as taskCode,
  AUTO_WHEN_MEET_CRITERIA_CESSATION: 'AUTO_WHEN_MEET_CRITERIA_CESSATION' as taskCode,
  CHANGE_RELATED_PERSON_BLACK_CASE: 'CHANGE_RELATED_PERSON_BLACK_CASE' as taskCode,
  CHANGE_RELATED_PERSON_LITIGATION_CASE: 'CHANGE_RELATED_PERSON_LITIGATION_CASE' as taskCode,
  DECREASE_RELATED_PERSON_LITIGATION_CASE: 'DECREASE_RELATED_PERSON_LITIGATION_CASE' as taskCode,
  RECORD_OF_APPEAL: 'RECORD_OF_APPEAL' as taskCode,
  RECORD_OF_SUPREME_COURT: 'RECORD_OF_SUPREME_COURT' as taskCode,
  RECORD_OF_SUPREME_COURT_ACKNOWLEDGE: 'RECORD_OF_SUPREME_COURT_ACKNOWLEDGE' as taskCode,
  UPLOAD_E_FILING: 'UPLOAD_E_FILING' as taskCode,
  DECREE_OF_FIRST_INSTANCE: 'DECREE_OF_FIRST_INSTANCE' as taskCode,
  DECREE_OF_APPEAL: 'DECREE_OF_APPEAL' as taskCode,
  DECREE_OF_SUPREME_COURT: 'DECREE_OF_SUPREME_COURT' as taskCode,
  PAY_EXECUTION_FEE_FIRST_INSTANCE: 'PAY_EXECUTION_FEE_FIRST_INSTANCE' as taskCode,
  PAY_EXECUTION_FEE_APPEAL: 'PAY_EXECUTION_FEE_APPEAL' as taskCode,
  PAY_EXECUTION_FEE_SUPREME: 'PAY_EXECUTION_FEE_SUPREME' as taskCode,
  UPLOAD_EXECUTION_RECEIPT_FIRST_INSTANCE: 'UPLOAD_EXECUTION_RECEIPT_FIRST_INSTANCE' as taskCode,
  UPLOAD_EXECUTION_RECEIPT_APPEAL: 'UPLOAD_EXECUTION_RECEIPT_APPEAL' as taskCode,
  UPLOAD_EXECUTION_RECEIPT_SUPREME: 'UPLOAD_EXECUTION_RECEIPT_SUPREME' as taskCode,
  // finance EXPENSE
  EXPENSE_CLAIM_VERIFICATION: 'EXPENSE_CLAIM_VERIFICATION' as taskCode,
  CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION: 'CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION' as taskCode,
  EXPENSE_CLAIM_PAYMENT_APPROVAL: 'EXPENSE_CLAIM_PAYMENT_APPROVAL' as taskCode,
  EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL: 'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL' as taskCode,
  EXPENSE_CLAIM_RECEIPT_UPLOAD: 'EXPENSE_CLAIM_RECEIPT_UPLOAD' as taskCode,
  EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD: 'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD' as taskCode,
  EXPENSE_CLAIM_CORRECTION: 'EXPENSE_CLAIM_CORRECTION' as taskCode,
  AUTO_CREATE_EXPENSE_CLAIM: 'AUTO_CREATE_EXPENSE_CLAIM' as taskCode,
  EXPENSE_CLAIM_RETRY: 'EXPENSE_CLAIM_RETRY' as taskCode,
  EXPENSE_CLAIM_SYSTEM_PAYMENT: 'EXPENSE_CLAIM_SYSTEM_PAYMENT' as taskCode,
  EXPENSE_CLAIM_RECIEVE_ORIGINAL_DOCUMENT: 'EXPENSE_CLAIM_RECIEVE_ORIGINAL_DOCUMENT' as taskCode,
  REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT: 'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT' as taskCode,
  REVERSE_EXPENSE_CLAIM_OTHER: 'REVERSE_EXPENSE_CLAIM_OTHER' as taskCode,
  DECIDE_REVERSE_EXPENSE_CLAIM: 'DECIDE_REVERSE_EXPENSE_CLAIM' as taskCode,
  // finance RECEIPT
  RECEIVE_NORMAL_PAYMENT: 'RECEIVE_NORMAL_PAYMENT' as taskCode,
  RECEIVE_ADVANCE_PAYMENT: 'RECEIVE_ADVANCE_PAYMENT' as taskCode,
  RECEIVE_COURT_PAYMENT: 'RECEIVE_COURT_PAYMENT' as taskCode,
  RECEIVE_CREDIT_NOTE_PAYMENT: 'RECEIVE_CREDIT_NOTE_PAYMENT' as taskCode,
  // LITIGATION for EXECUTION
  R2E04_02_2A: 'R2E04-02-2A' as taskCode, // งานคำนวณภาระหนี้เพื่อออกหมายบังคับคดี
  R2E04_01_2B: 'R2E04-01-2B' as taskCode, // งานมอบหมายทนายรับผิดชอบเพื่อออกหมายบังคับคดี
  R2E04_03_3A: 'R2E04-03-3A' as taskCode, // งานดำเนินการบันทึกใบมอบอำนาจและหมายบังคับคดี
  // LITIGATION for Seizure of Property
  R2E05_01_2D: 'R2E05-01-2D' as taskCode,
  R2E05_02_3C: 'R2E05-02-3C' as taskCode,
  R2E05_04_4: 'R2E05-04-4' as taskCode,
  R2E05_03_4: 'R2E05-03-4' as taskCode,
  R2E05_03_3D: 'R2E05-03-3D' as taskCode,
  R2E05_06_3F: 'R2E05-06-3F' as taskCode,
  /**
   * LEX2-3412 งานมอบหมายทนายความเพื่อตั้งเรื่องยึดทรัพย์นอกจำนอง
   */
  R2E05_09_4: 'R2E05-09-4' as taskCode,
  // LITIGATION for Withdrawn Seizure of Property
  R2E06_01_A: 'R2E06-01-A' as taskCode,
  R2E06_02_B: 'R2E06-02-B' as taskCode,
  R2E06_03_C: 'R2E06-03-C' as taskCode,
  R2E06_04_D: 'R2E06-04-D' as taskCode,
  R2E06_05_E: 'R2E06-05-E' as taskCode,
  // LITIGATION for Withdrawn Writ of Execution
  R2E06_10: 'R2E06-10' as taskCode,
  R2E06_11_A: 'R2E06-11-A' as taskCode,
  R2E06_12_B: 'R2E06-12-B' as taskCode,
  R2E06_13_C: 'R2E06-13-C' as taskCode,
  R2E06_14_D: 'R2E06-14-D' as taskCode,
  R2E06_15_E: 'R2E06-15-E' as taskCode,
  RECEIPT_REJECT_ORIGINAL_DOCUMENT: 'RECEIPT_REJECT_ORIGINAL_DOCUMENT' as taskCode,
  SUBMIT_REJECT_ORIGINAL_DOCUMENT: 'SUBMIT_REJECT_ORIGINAL_DOCUMENT' as taskCode,
  TRY_CONFIRM_COURT_FEES_PAYMENT: 'TRY_CONFIRM_COURT_FEES_PAYMENT' as taskCode,
  REQUEST_REVISE_DEFERMENT: 'REQUEST_REVISE_DEFERMENT' as taskCode,
  REQUEST_REVISE_CESSATION: 'REQUEST_REVISE_CESSATION' as taskCode,
  SAVE_DRAFT_DEFERMENT: 'SAVE_DRAFT_DEFERMENT' as taskCode,
  SAVE_DRAFT_CESSATION: 'SAVE_DRAFT_CESSATION' as taskCode,
  // DEFER EXECUTION
  R2E07_01_A: 'R2E07-01-A' as taskCode,
  R2E07_02_B: 'R2E07-02-B' as taskCode,
  R2E07_04_D: 'R2E07-04-D' as taskCode,
  R2E07_03_C: 'R2E07-03-C' as taskCode,
  R2E07_05_E: 'R2E07-05-E' as taskCode,
  // PUBLIC ACUTION
  /**
   * Task Code for LEX2-492
   */
  R2E09_00_1A: 'R2E09-00-1A' as taskCode,
  /**
   * Task Code for LEX2-496
   */
  R2E09_02_3B: 'R2E09-02-3B' as taskCode,
  /**
   * Task Code for LEX2-514 งานกรอกข้อมูลการรับแคชเชียร์เช็คหลักประกัน
   */
  R2E09_06_7C: 'R2E09-06-7C' as taskCode,
  /**
   * Task Code for LEX2-518
   */
  R2E09_04_01_11: 'R2E09-04-01-11' as taskCode,
  /**
   * Task Code for LEX2-16479 งานกรอกข้อมูลการรับแคชเชียร์เช็คอากรแสตมป์
   */
  R2E09_06_12C: 'R2E09-06-12C' as taskCode,
  /**
   * Task Code for LEX2-542
   */
  R2E09_05_01_12A: 'R2E09-05-01-12A' as taskCode,
  /**
   * Task Code for LEX2-16211
   */
  R2E09_2_A: 'R2E09-2-A' as taskCode,
  /**
   * Task Code for LEX2-536
   */
  R2E09_08_01_3_1: 'R2E09-08-01-3.1' as taskCode,

  /**
   * Task Code for LEX2-538
   */
  R2E09_11_01: 'R2E09-11-01' as taskCode,
  /**
   * Task Code for LEX2-561
   * TODO: new task code, pls check with BE :: https://ktbinnovation.atlassian.net/browse/LEX2-561
   */
  R2E05_561_A_MOCK: 'R2E05_561_A_MOCK' as taskCode,

  /**
   * Task Code for LEX2-552
   * TODO: new task code, pls check with BE :: https://ktbinnovation.atlassian.net/browse/LEX2-552
   */
  R2E11_LEXS2_552: 'R2E11_LEXS2_552' as taskCode,

  /**
   * Task Code for LEX2-5369
   */
  R2E09_10_01: 'R2E09-10-01' as taskCode,
  /**
   * Task Code for LEX2-5365
   */
  R2E09_10_02: 'R2E09-10-02' as taskCode,
  /**
   * Task Code for LEX2-5368
   */
  R2E09_10_03: 'R2E09-10-03' as taskCode,

  /**
   * Task Code for LEX2-534, 535, 537
   */
  R2E09_06_03: 'R2E09-06-03' as taskCode, // รอบันทึกออกแคชเชียร์เช็ค รอแก้ไขออกแคชเชียร์เช็ค งานบันทึกพิจารณาอนุมัติสั่งวางเงินเพิ่ม รอตรวจสอบแคชเชียร์เช็ควางเงินเพิ่ม
  /**
   * Task Code for LEX2-18039-18046
   */
  R2E09_09_01_13_1: 'R2E09-09-01-13.1' as taskCode,
  R2E09_09_03_14_1: 'R2E09-09-03-14.1' as taskCode,
  /**
   * Task Code for LEX2-539
   * บันทึกออกแคชเชียร์เช็คโอนกรรมสิทธิ์'
   * งานแก้ไขข้อมูลการออกแคชเชียร์เช็คโอนกรรมสิทธิ์
   * Task Code for LEX2-540
   * [LEX2-540] การพิจารณาอนุมัติออกแคชเชียร์เช็คโอนกรรมสิทธิ์
   */
  R2E09_06_04_6: 'R2E09-06-04-6' as taskCode,
  // MOCK TASK CODE LEX2-420
  R2E09_INVEST: 'R2E09_INVEST' as taskCode,
  /**
   * E35-01 การอัปโหลดใบเสร็จเบิกจ่ายอัตโนมัติสำหรับค่าธรรมเนียมการยึดทรัพย์แบบ non e-filing
   */
  R2E35_01_E05_01_6A: 'R2E35-01-E05-01-6A' as taskCode,
  /**
   * ตรวจสอบใบเสร็จค่าใช้จ่ายบังคับคดีตั้งเรื่องยึดทรัพย์
   */
  R2E35_01_E05_02_6B: 'R2E35-01-E05-02-6B' as taskCode,
  /**
   * E35-02 การอัปโหลดใบเสร็จค่าใช้จ่ายวางเพิ่มประกาศขายทอดตลาดทรัพย์จำนอง (แคชเชียร์เช็ค)
   */
  R2E35_02_E09_01_7A: 'R2E35-02-E09-01-7A' as taskCode,
  R2E35_02_E09_02_7B: 'R2E35-02-E09-02-7B' as taskCode,
  R2E09_14_3C: 'R2E09-14-3C' as taskCode,
  /**
   * LEX2-466 งานตรวจสอบเอกสารสั่งการยึดทรัพย์นอกจำนอง
   * LEX2-467 รายละเอียดของงานสั่งการยึดทรัพย์นอกจำนองจากหน่วยงานดูแลลูกหนี้
   * LEX2-468 รายการเอกสารดำเนินงานสั่งการยึดทรัพย์นอกจำนองจากหน่วยงานดูแลลูกหนี้
   */
  R2E05_08_3A: 'R2E05-08-3A' as taskCode,
  /**
   * [LEX2-463 ] งานสั่งการยึดทรัพย์นอกจำนอง
   */
  R2E05_07_2A: 'R2E05-07-2A' as taskCode,
  /**
   * [LEX2-469] งานบันทึกผลการตั้งเรื่องยึดทรัพย์นอกจำนอง
   * รอบันทึกผล การยึดทรัพย์นอกจำนอง
   */
  R2E05_10_5: 'R2E05-10-5' as taskCode,
  /**
   * [LEX2-419] งานสั่งการสืบทรัพย์ (MOCK)
   */
  R2E03_01_01: 'R2E03-01-01' as taskCode,
  /**
   * Task Code for LEX2-463
   */
  R2_LEX2_463_MOCK: 'R2_LEX2_463_MOCK' as taskCode,
  /**
   * Task Code for LEX2-26737
   */
  R2E09_00_01_1A: 'R2E09-00-01-1A' as taskCode,

  /**
   * Preference-MVP3 [LEX2-42046] งานพิจารณาอนุมัติสั่งการยื่น, รอแก้ไขสั่งการบุริมสิทธิจำนอง
   */
  EXECUTE_PREFERENCE: 'EXECUTE_PREFERENCE' as taskCode,
  /**
   * Preference-MVP3 [LEX2-42697] งานมอบหมายทนายความผู้รับผิดชอบ
   */
  ASSIGN_LAWYER_PLAINTIFF_CASE: 'ASSIGN_LAWYER_PLAINTIFF_CASE' as taskCode,
  /**
   * Preference-MVP3 [LEX2-???] รอตรวจสอบเอกสารบุริมสิทธิจำนอง
   */
  PREPARE_PREFERENCE_DODUMENT: 'PREPARE_PREFERENCE_DODUMENT' as taskCode,
};

export const taskCodeList: taskCode[] = [
  taskCode.ADD_SUB_ACCOUNT, // [LEXS-4733] เพิ่ม Sub Account หลังมีเลขที่คดีแดง
  taskCode.VERIFY_INFO_AND_DOCUMENT,
  taskCode.CHANGE_RELATED_PERSON,
  taskCode.INVESTIGATE_HEIR_OR_TRUSTEE,
  taskCode.PROCESS_NOT_PROSECUTE_1,
  taskCode.PROCESS_NOT_PROSECUTE_2,
  taskCode.EDIT_MORTGAGE_ASSETS,
  taskCode.ON_REQUEST,
  taskCode.RECORD_NOTICE, // [LEXS - 71] Generate Notice
  taskCode.RECORD_NOTICE_GUARANTOR, // [LEXS - 71] Generate Notice
  taskCode.SEND_AND_TRACK_NOTICE, // [LEXS - 73] Update Bulk Status
  taskCode.SEND_AND_TRACK_NOTICE_GUARANTOR, // [LEXS - 73] Update Bulk Status
  taskCode.CONFIRM_NOTICE_LETTER, // [LEXS - 84] Delivered
  taskCode.NEWSPAPER_ANNOUCEMENT, // [LEXS - 74] Failed to Deliver
  taskCode.RECEIPT_ORIGINAL_DOCUMENT, // [LEXS - 75] Original Doc Confirmation
  taskCode.SUBMIT_ORIGINAL_DOCUMENT, // [LEXS - 179] Send Original Doc
  taskCode.COLLECT_LG_ID, // [LEXS - 120] การรวมเลขที่กฏหมาย (รวม LG ID)
  taskCode.INDICTMENT_RECORD, // [LEXS-170] บันทึกคำฟ้อง
  taskCode.RECORD_DIAGNOSIS_DATE, // [LEX2-82] หน้าจอบันทึกวันนัดพิจารณาคดี
  taskCode.MEMORANDUM_COURT_FIRST_INSTANCE, //[LEX2-86/88] หน้าจอผลการดำเนินคดี/หน้าจอบันทึกผลคำพิพากษา
  taskCode.MEMORANDUM_COURT_APPEAL, //[LEX2-86/88] หน้าจอผลการดำเนินคดี/หน้าจอบันทึกผลคำพิพากษา
  taskCode.MEMORANDUM_SUPREME_COURT, //[LEX2-86/88] หน้าจอผลการดำเนินคดี/หน้าจอบันทึกผลคำพิพากษา
  taskCode.CONSIDER_APPEAL, //[LEX2-34/35] การบันทึกขอพิจารณายื่นอุทธรณ์/การอนุมัติยื่นอุทธรณ์
  taskCode.APPROVE_APPEAL, //[LEX2-34/35] การบันทึกขอพิจารณายื่นอุทธรณ์/การอนุมัติยื่นอุทธรณ์
  taskCode.CONDITIONAL_APPEAL, //[LEX2-34/35] การบันทึกขอพิจารณายื่นอุทธรณ์/การอนุมัติยื่นอุทธรณ์
  taskCode.CONSIDER_SUPREME_COURT, //[LEX2-40] การบันทึกขอพิจารณายื่นฎีกา (KTBLAW)
  taskCode.APPROVE_SUPREME_COURT, //[LEX2-40] การบันทึกขอพิจารณายื่นฎีกา (KTBLAW)
  taskCode.CONDITIONAL_SUPREME_COURT, //[LEX2-40] การบันทึกขอพิจารณายื่นฎีกา (KTBLAW)
  taskCode.DECREE,
  taskCode.CONFIRM_COURT_FEES_PAYMENT, // [LEXS-193] การอัปโหลดใบเสร็จค่าธรรมเนียมศาล
  taskCode.UPLOAD_COURT_FEES_RECEIPT, // [LEXS-174]  ชำระค่าธรรมเนียมศาล (ยืนยัน),
  taskCode.REQUEST_DEFERMENT, // LEX2-48 รออนุมัติชะลอดำเนินคดี
  taskCode.EXTEND_DEFERMENT, // LEX2-43 ขยายระยะเวลาการชะลอดำเนินคดี
  taskCode.REQUEST_CESSATION, // LEX2-53 ยุติดำเนินคดี
  taskCode.RESPONSE_UNIT_MAPPING,
  taskCode.CONSIDER_REMAINING_COSTS, // LEXS2-144 ปิดเลขที่กฎหมาย
  taskCode.CONSIDER_APPROVE_CLOSE_LG, // LEXS2-144 ปิดเลขที่กฎหมาย
  taskCode.AUTO_CREATE_DRAFT_DEFERMENT, //[LEX2-46] การนำเข้างานรอชะลอ/ยุติดำเนินคดีอัตโนมัติ
  taskCode.AUTO_CREATE_DRAFT_CESSATION, //[LEX2-46] การนำเข้างานรอชะลอ/ยุติดำเนินคดีอัตโนมัติ
  taskCode.AUTO_WHEN_MEET_CRITERIA_DEFERMENT, //[LEX2-46] การนำเข้างานรอชะลอ/ยุติดำเนินคดีอัตโนมัติ
  taskCode.AUTO_WHEN_MEET_CRITERIA_CESSATION, //[LEX2-46] การนำเข้างานรอชะลอ/ยุติดำเนินคดีอัตโนมัติ
  taskCode.CHANGE_RELATED_PERSON_BLACK_CASE, // [LEX2-16] ทำการเพิ่ม/ลดบุคคลที่เกี่ยวข้องกับคดีหลังมีเลขคดีดำแล้ว
  taskCode.CHANGE_RELATED_PERSON_LITIGATION_CASE, // [LEX2-16] ทำการเพิ่ม/ลดบุคคลที่เกี่ยวข้องกับคดีหลังมีเลขคดีดำแล้ว
  taskCode.DECREASE_RELATED_PERSON_LITIGATION_CASE, // [LEX2-16] ทำการเพิ่ม/ลดบุคคลที่เกี่ยวข้องกับคดีหลังมีเลขคดีดำแล้ว
  taskCode.RECORD_OF_APPEAL, // [LEX2-168] e-Filing - บันทึกคำฟ้องยื่นอุทธรณ์/แก้อุทธรณ์
  taskCode.RECORD_OF_SUPREME_COURT, // [LEX2-169] e-Filing - บันทึกคำฟ้องยื่นฎีกา/แก้ฎีกา
  taskCode.RECORD_OF_SUPREME_COURT_ACKNOWLEDGE, // [LEX2-169] รับทราบคำร้องขออนุญาตฎีกา
  taskCode.UPLOAD_E_FILING, // [LEX2-182] e-Filing - อัปโหลดใบเสร็จค่าธรรมเนียมศาลชั้นอุทธรณ์/ฎีกา
  taskCode.DECREE_OF_FIRST_INSTANCE,
  taskCode.DECREE_OF_APPEAL,
  taskCode.DECREE_OF_SUPREME_COURT,
  taskCode.PAY_EXECUTION_FEE_FIRST_INSTANCE,
  taskCode.PAY_EXECUTION_FEE_APPEAL,
  taskCode.PAY_EXECUTION_FEE_SUPREME,
  taskCode.UPLOAD_EXECUTION_RECEIPT_FIRST_INSTANCE,
  taskCode.UPLOAD_EXECUTION_RECEIPT_APPEAL,
  taskCode.UPLOAD_EXECUTION_RECEIPT_SUPREME,
  // finance EXPENSE
  taskCode.EXPENSE_CLAIM_VERIFICATION,
  taskCode.CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION,
  taskCode.EXPENSE_CLAIM_PAYMENT_APPROVAL,
  taskCode.EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL,
  taskCode.EXPENSE_CLAIM_RECEIPT_UPLOAD,
  taskCode.EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD,
  taskCode.EXPENSE_CLAIM_CORRECTION,
  taskCode.AUTO_CREATE_EXPENSE_CLAIM,
  taskCode.EXPENSE_CLAIM_RETRY,
  taskCode.EXPENSE_CLAIM_SYSTEM_PAYMENT,
  taskCode.EXPENSE_CLAIM_RECIEVE_ORIGINAL_DOCUMENT,
  taskCode.REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT,
  taskCode.REVERSE_EXPENSE_CLAIM_OTHER,
  taskCode.DECIDE_REVERSE_EXPENSE_CLAIM,
  // finance RECEIPT
  taskCode.RECEIVE_NORMAL_PAYMENT, // [LEX2-68] รับเงินคืน แบบปกติ
  taskCode.RECEIVE_ADVANCE_PAYMENT, // [LEX2-74] การตรวจสอบการโอนเงินทดรองจ่ายเป็นค่าใช้จ่าย
  taskCode.RECEIVE_COURT_PAYMENT, // [LEX2-71] รับเงินโอนจากศาล
  taskCode.RECEIVE_CREDIT_NOTE_PAYMENT, //  [LEX2-66] credit note,
  // LITIGATION for EXECUTION
  taskCode.R2E04_02_2A, // LEX2-450
  taskCode.R2E04_01_2B, // LEX2-455
  taskCode.R2E04_03_3A, // LEX2-457 / LEX2-459
  // LITIGATION for Seizure of Property
  taskCode.R2E05_01_2D,
  taskCode.R2E05_02_3C,
  taskCode.R2E05_04_4,
  taskCode.R2E05_03_3D,
  taskCode.R2E05_06_3F,
  taskCode.R2E05_09_4,
  // LITIGATION for Withdrawn Seizure Property
  taskCode.R2E06_01_A,
  taskCode.R2E06_02_B,
  taskCode.R2E06_03_C,
  taskCode.R2E06_04_D,
  taskCode.R2E06_05_E,
  taskCode.RECEIPT_REJECT_ORIGINAL_DOCUMENT,
  taskCode.SUBMIT_REJECT_ORIGINAL_DOCUMENT,
  taskCode.TRY_CONFIRM_COURT_FEES_PAYMENT, // [LEX2-7505] ใบยืนยันการชำระค่าธรรมเนียมศาล manually retry
  taskCode.REQUEST_REVISE_DEFERMENT, // [LEX2-1239] แก้ไขชะลอ
  taskCode.REQUEST_REVISE_CESSATION, // [LEX2-7505] แก้ไขขุติ
  taskCode.SAVE_DRAFT_DEFERMENT, // [LEX2-1234] รอบันทึกชะลอดำเนินคดี (สร้างงานสำหรับบันทึกร่าง)
  taskCode.SAVE_DRAFT_CESSATION, // [LEX2-1234] รอบันทึกยุติดำเนินคดี (สร้างงานสำหรับบันทึกร่าง)
  // DEFER EXECUTION
  taskCode.R2E07_02_B,
  taskCode.R2E07_04_D,
  taskCode.R2E07_03_C,
  taskCode.R2E07_01_A,
  taskCode.R2E07_05_E,
  taskCode.R2E09_08_01_3_1,
  // AUCTION ACCOUNT DOCUMENT FOLLOWUP
  taskCode.R2E09_09_01_13_1,
  taskCode.R2E09_09_03_14_1,
  taskCode.R2E09_06_03,
  taskCode.R2E09_10_02,
  taskCode.R2E09_06_04_6,
  taskCode.R2E09_INVEST,
  taskCode.R2E05_07_2A,
  taskCode.EXECUTE_PREFERENCE,
  taskCode.ASSIGN_LAWYER_PLAINTIFF_CASE,
  taskCode.PREPARE_PREFERENCE_DODUMENT,
];

export const StatusStyle = {
  NORMAL: 'status-normal',
  PENDING: 'status-pending',
  FAILED: 'status-failed',
  INFO: 'status-info',
  SUCCESS: 'status-success',
};

export type statusCode =
  | 'IN_PROGRESS'
  | 'AWAITING'
  | 'PENDING'
  | 'PENDING_APPROVAL'
  | 'FAILED'
  | 'FINISHED'
  | 'PENDING_REVIEW'
  | 'PENDING_CORRECTION'
  | 'PENDING_REVISE';
export const statusCode = {
  IN_PROGRESS: 'IN_PROGRESS' as statusCode,
  PENDING: 'PENDING' as statusCode,
  PENDING_APPROVAL: 'PENDING_APPROVAL' as statusCode,
  AWAITING: 'AWAITING' as statusCode,
  FAILED: 'FAILED' as statusCode,
  FINISHED: 'FINISHED' as statusCode,
  CORRECT_PENDING: 'CORRECT_PENDING' as statusCode,
  PENDING_REVIEW: 'PENDING_REVIEW' as statusCode,
  PENDING_REVISE: 'PENDING_REVISE' as statusCode,
};

export type taskMode =
  | 'LITIGATION'
  | 'CUSTOMER'
  | 'CONFIGURATION'
  | 'FINANCE_EXPENSE'
  | 'FINANCE_RECEIPT'
  | 'FINANCE_ADVANCE';
export const taskMode = {
  LITIGATION: 'LITIGATION' as taskMode,
  CUSTOMER: 'CUSTOMER' as taskMode,
  CONFIGURATION: 'CONFIGURATION' as taskMode,
  FINANCE_EXPENSE: 'FINANCE_EXPENSE' as taskMode,
  FINANCE_RECEIPT: 'FINANCE_RECEIPT' as taskMode,
  FINANCE_ADVANCE: 'FINANCE_ADVANCE' as taskMode,
};

/**
 * RE -Arrange tab for MPV 2.1
 * From (MVP 1.3) tabIndex: 0 => tabIndex: 0 no subTabIndex
 * From (MVP 1.3) tabIndex: 1 => tabIndex: 1 subTabIndex: 0
 * From (MVP 1.3) tabIndex: 2 => tabIndex: 1 subTabIndex: 1
 * From (MVP 1.3) tabIndex: 3 => tabIndex: 1 subTabIndex: 2
 * From (MVP 1.3) tabIndex: 4 => tabIndex: 2 subTabIndex: 0
 * From (MVP 1.3) tabIndex: 5 => tabIndex: 2 subTabIndex: 1
 * From (MVP 1.3) tabIndex: 6 => tabIndex: 2 subTabIndex: 2
 * From (MVP 1.3) tabIndex: 7 => tabIndex: 2 subTabIndex: 3
 * From (MVP 1.3) tabIndex: 8 => tabIndex: 3 no subTabIndex
 */

export const taskMapper = new Map<taskCode, TaskMode>([
  [taskCode.CHANGE_RELATED_PERSON, { mode: taskMode.LITIGATION, tabIndex: 1, subTabIndex: 0 }],
  [taskCode.EDIT_MORTGAGE_ASSETS, { mode: taskMode.LITIGATION, tabIndex: 1, subTabIndex: 2 }],
  [taskCode.INVESTIGATE_HEIR_OR_TRUSTEE, { mode: taskMode.LITIGATION, tabIndex: 1, subTabIndex: 0 }],
  [taskCode.PROCESS_NOT_PROSECUTE_1, { mode: taskMode.LITIGATION, tabIndex: 1, subTabIndex: 0 }],
  [taskCode.PROCESS_NOT_PROSECUTE_2, { mode: taskMode.LITIGATION, tabIndex: 1, subTabIndex: 0 }],
  [taskCode.VERIFY_INFO_AND_DOCUMENT, { mode: taskMode.CUSTOMER, tabIndex: 3 }],
  [taskCode.RECORD_NOTICE, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 0, underSubTabIndex: 1 }],
  [taskCode.RECORD_NOTICE_GUARANTOR, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 0, underSubTabIndex: 1 }],
  [taskCode.SEND_AND_TRACK_NOTICE, { mode: taskMode.LITIGATION }],
  [taskCode.SEND_AND_TRACK_NOTICE_GUARANTOR, { mode: taskMode.LITIGATION }],
  [taskCode.CONFIRM_NOTICE_LETTER, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 0, underSubTabIndex: 1 }],
  [taskCode.NEWSPAPER_ANNOUCEMENT, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 0, underSubTabIndex: 1 }],
  [taskCode.COLLECT_LG_ID, { mode: taskMode.LITIGATION, tabIndex: 0 }],
  [taskCode.ADD_SUB_ACCOUNT, { mode: taskMode.LITIGATION, tabIndex: 0 }],
  [taskCode.INDICTMENT_RECORD, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 1 }],
  [taskCode.CONFIRM_COURT_FEES_PAYMENT, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 1 }],
  [taskCode.TRY_CONFIRM_COURT_FEES_PAYMENT, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 1 }],
  [taskCode.RECEIPT_ORIGINAL_DOCUMENT, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 0, underSubTabIndex: 0 }],
  [taskCode.SUBMIT_ORIGINAL_DOCUMENT, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 0, underSubTabIndex: 0 }],
  [taskCode.UPLOAD_COURT_FEES_RECEIPT, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 1 }],
  [taskCode.RECORD_DIAGNOSIS_DATE, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 2 }],
  [taskCode.REQUEST_DEFERMENT, { mode: taskMode.LITIGATION }],
  [taskCode.EXTEND_DEFERMENT, { mode: taskMode.LITIGATION }],
  [taskCode.REQUEST_CESSATION, { mode: taskMode.LITIGATION }],
  [taskCode.RESPONSE_UNIT_MAPPING, { mode: taskMode.CONFIGURATION }],
  [taskCode.CONSIDER_REMAINING_COSTS, { mode: taskMode.LITIGATION }],
  [taskCode.CONSIDER_APPROVE_CLOSE_LG, { mode: taskMode.LITIGATION }],
  [taskCode.AUTO_CREATE_DRAFT_DEFERMENT, { mode: taskMode.LITIGATION }],
  [taskCode.AUTO_CREATE_DRAFT_CESSATION, { mode: taskMode.LITIGATION }],
  [taskCode.AUTO_WHEN_MEET_CRITERIA_DEFERMENT, { mode: taskMode.LITIGATION }],
  [taskCode.AUTO_WHEN_MEET_CRITERIA_CESSATION, { mode: taskMode.LITIGATION }],
  [
    taskCode.MEMORANDUM_COURT_FIRST_INSTANCE,
    { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 0 },
  ],
  [taskCode.MEMORANDUM_COURT_APPEAL, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 1 }],
  [taskCode.MEMORANDUM_SUPREME_COURT, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 2 }],
  [taskCode.CONSIDER_APPEAL, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 0 }],
  [taskCode.APPROVE_APPEAL, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 0 }],
  [taskCode.CONDITIONAL_APPEAL, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 0 }],
  [taskCode.CONSIDER_SUPREME_COURT, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 1 }],
  [taskCode.CHANGE_RELATED_PERSON_BLACK_CASE, { mode: taskMode.LITIGATION, tabIndex: 1 }],
  [taskCode.CHANGE_RELATED_PERSON_LITIGATION_CASE, { mode: taskMode.LITIGATION, tabIndex: 1 }],
  [taskCode.DECREASE_RELATED_PERSON_LITIGATION_CASE, { mode: taskMode.LITIGATION, tabIndex: 1 }],
  [taskCode.APPROVE_SUPREME_COURT, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 1 }],
  [taskCode.CONDITIONAL_SUPREME_COURT, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 1 }],
  [taskCode.RECORD_OF_APPEAL, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 1 }],
  [taskCode.RECORD_OF_SUPREME_COURT, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 1 }],
  [taskCode.UPLOAD_E_FILING, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 1 }],
  [taskCode.DECREE_OF_FIRST_INSTANCE, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 0 }],
  [taskCode.DECREE_OF_APPEAL, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 1 }],
  [taskCode.DECREE_OF_SUPREME_COURT, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 2 }],
  [
    taskCode.PAY_EXECUTION_FEE_FIRST_INSTANCE,
    { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 0 },
  ],
  [taskCode.PAY_EXECUTION_FEE_APPEAL, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 1 }],
  [taskCode.PAY_EXECUTION_FEE_SUPREME, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 2 }],
  [
    taskCode.UPLOAD_EXECUTION_RECEIPT_FIRST_INSTANCE,
    { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 0 },
  ],
  [
    taskCode.UPLOAD_EXECUTION_RECEIPT_APPEAL,
    { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 1 },
  ],
  [
    taskCode.UPLOAD_EXECUTION_RECEIPT_SUPREME,
    { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 3, underSubTabIndex: 2 },
  ],
  [taskCode.RECEIPT_REJECT_ORIGINAL_DOCUMENT, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 0 }],
  [taskCode.SUBMIT_REJECT_ORIGINAL_DOCUMENT, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 0 }],
  // FINANCE
  [taskCode.CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION, { mode: taskMode.FINANCE_EXPENSE }],
  [taskCode.EXPENSE_CLAIM_PAYMENT_APPROVAL, { mode: taskMode.FINANCE_EXPENSE }],
  [taskCode.EXPENSE_CLAIM_CORRECTION, { mode: taskMode.FINANCE_EXPENSE }],
  [taskCode.EXPENSE_CLAIM_RECEIPT_UPLOAD, { mode: taskMode.FINANCE_EXPENSE }],
  [taskCode.EXPENSE_CLAIM_VERIFICATION, { mode: taskMode.FINANCE_EXPENSE }],
  [taskCode.REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT, { mode: taskMode.FINANCE_EXPENSE }],
  [taskCode.REVERSE_EXPENSE_CLAIM_OTHER, { mode: taskMode.FINANCE_EXPENSE }],
  [taskCode.RECEIVE_ADVANCE_PAYMENT, { mode: taskMode.FINANCE_ADVANCE }],
  // LITIGATION for EXECUTION
  [taskCode.R2E04_02_2A, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 4, underSubTabIndex: 0 }],
  [taskCode.R2E04_01_2B, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 4, underSubTabIndex: 0 }],
  [taskCode.R2E04_03_3A, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 4, underSubTabIndex: 0 }],
  // LITIGATION for SEIZURE OF PROPERTY
  [taskCode.R2E05_01_2D, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 5, underSubTabIndex: 0 }],
  [taskCode.R2E05_02_3C, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 5, underSubTabIndex: 0 }],
  [taskCode.R2E05_04_4, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 5, underSubTabIndex: 0 }],
  [taskCode.R2E05_03_3D, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 5, underSubTabIndex: 0 }],
  [taskCode.R2E05_06_3F, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 5, underSubTabIndex: 0 }],
  [taskCode.R2E05_06_3F, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 5, underSubTabIndex: 0 }],
  [taskCode.R2E05_09_4, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 5, underSubTabIndex: 0 }],
  // LITIGATION for WITHDRAWN SEIZURE OF PROPERTY
  [taskCode.R2E06_01_A, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 5, underSubTabIndex: 0 }],
  [taskCode.R2E06_02_B, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 5, underSubTabIndex: 0 }],
  [taskCode.R2E06_03_C, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 5, underSubTabIndex: 0 }],
  [taskCode.R2E06_04_D, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 5, underSubTabIndex: 0 }],
  [taskCode.R2E06_05_E, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 5, underSubTabIndex: 1 }],
  // DEFER EXECUTION
  [taskCode.R2E07_01_A, { mode: taskMode.LITIGATION }],
  [taskCode.R2E07_02_B, { mode: taskMode.LITIGATION }],
  [taskCode.R2E07_04_D, { mode: taskMode.LITIGATION }],
  [taskCode.R2E07_03_C, { mode: taskMode.LITIGATION }],
  [taskCode.R2E07_05_E, { mode: taskMode.LITIGATION }],
  // Deferment Revise, Draft
  [taskCode.REQUEST_REVISE_DEFERMENT, { mode: taskMode.LITIGATION }],
  [taskCode.REQUEST_REVISE_CESSATION, { mode: taskMode.LITIGATION }],
  [taskCode.SAVE_DRAFT_DEFERMENT, { mode: taskMode.LITIGATION }],
  [taskCode.SAVE_DRAFT_CESSATION, { mode: taskMode.LITIGATION }],
  // seizure-fee upload receipts for non e-filing
  [taskCode.R2E35_01_E05_01_6A, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 4, underSubTabIndex: 0 }],
  [taskCode.R2E35_01_E05_02_6B, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 4, underSubTabIndex: 0 }],
  // auction-expense upload receipts for non e-filing
  [taskCode.R2E35_02_E09_01_7A, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 5, underSubTabIndex: 0 }],
  [taskCode.R2E35_02_E09_02_7B, { mode: taskMode.LITIGATION, tabIndex: 2, subTabIndex: 5, underSubTabIndex: 0 }],
]);

export const TaskCodeLitigation = [
  taskCode.INVESTIGATE_HEIR_OR_TRUSTEE,
  taskCode.PROCESS_NOT_PROSECUTE_1,
  taskCode.PROCESS_NOT_PROSECUTE_2,
  taskCode.CHANGE_RELATED_PERSON,
  taskCode.EDIT_MORTGAGE_ASSETS,
  taskCode.RECORD_NOTICE,
  taskCode.RECORD_NOTICE_GUARANTOR,
  taskCode.SEND_AND_TRACK_NOTICE,
  taskCode.SEND_AND_TRACK_NOTICE_GUARANTOR,
  taskCode.CONFIRM_NOTICE_LETTER,
  taskCode.NEWSPAPER_ANNOUCEMENT,
  taskCode.RECEIPT_ORIGINAL_DOCUMENT,
  taskCode.SUBMIT_ORIGINAL_DOCUMENT,
  taskCode.COLLECT_LG_ID,
  taskCode.ADD_SUB_ACCOUNT,
  taskCode.INDICTMENT_RECORD,
  taskCode.CONFIRM_COURT_FEES_PAYMENT,
  taskCode.TRY_CONFIRM_COURT_FEES_PAYMENT,
  taskCode.UPLOAD_COURT_FEES_RECEIPT,
  taskCode.REQUEST_DEFERMENT,
  taskCode.EXTEND_DEFERMENT,
  taskCode.REQUEST_CESSATION,
  taskCode.CONSIDER_REMAINING_COSTS,
  taskCode.CONSIDER_APPROVE_CLOSE_LG,
  taskCode.AUTO_CREATE_DRAFT_DEFERMENT,
  taskCode.AUTO_CREATE_DRAFT_CESSATION,
  taskCode.AUTO_WHEN_MEET_CRITERIA_DEFERMENT,
  taskCode.AUTO_WHEN_MEET_CRITERIA_CESSATION,
  taskCode.MEMORANDUM_COURT_FIRST_INSTANCE,
  taskCode.MEMORANDUM_COURT_APPEAL,
  taskCode.MEMORANDUM_SUPREME_COURT,
  taskCode.CONSIDER_APPEAL,
  taskCode.APPROVE_APPEAL,
  taskCode.CONDITIONAL_APPEAL,
  taskCode.CONSIDER_SUPREME_COURT,
  taskCode.RECORD_DIAGNOSIS_DATE,
  taskCode.CHANGE_RELATED_PERSON_BLACK_CASE,
  taskCode.CHANGE_RELATED_PERSON_LITIGATION_CASE,
  taskCode.DECREASE_RELATED_PERSON_LITIGATION_CASE,
  taskCode.APPROVE_SUPREME_COURT,
  taskCode.CONDITIONAL_SUPREME_COURT,
  taskCode.RECORD_DIAGNOSIS_DATE,
  taskCode.RECORD_OF_APPEAL,
  taskCode.RECORD_OF_SUPREME_COURT,
  taskCode.RECORD_OF_SUPREME_COURT_ACKNOWLEDGE,
  taskCode.UPLOAD_E_FILING,
  taskCode.DECREE_OF_FIRST_INSTANCE,
  taskCode.DECREE_OF_APPEAL,
  taskCode.DECREE_OF_SUPREME_COURT,
  taskCode.PAY_EXECUTION_FEE_FIRST_INSTANCE,
  taskCode.PAY_EXECUTION_FEE_APPEAL,
  taskCode.PAY_EXECUTION_FEE_SUPREME,
  taskCode.UPLOAD_EXECUTION_RECEIPT_FIRST_INSTANCE,
  taskCode.UPLOAD_EXECUTION_RECEIPT_APPEAL,
  taskCode.UPLOAD_EXECUTION_RECEIPT_SUPREME,
  taskCode.SUBMIT_REJECT_ORIGINAL_DOCUMENT,
  taskCode.RECEIPT_REJECT_ORIGINAL_DOCUMENT,
  taskCode.REQUEST_REVISE_DEFERMENT,
  taskCode.REQUEST_REVISE_CESSATION,
  taskCode.SAVE_DRAFT_DEFERMENT,
  taskCode.SAVE_DRAFT_CESSATION,
  taskCode.R2E07_02_B,
  taskCode.R2E07_04_D,
  taskCode.R2E07_03_C,
  taskCode.R2E07_01_A,
  taskCode.R2E07_05_E,
];
export const TaskCodeCustomer = [taskCode.VERIFY_INFO_AND_DOCUMENT]; // [LEXS-107] Doc Prep
// export const TaskCodeConfiguration = [taskCode.RESPONSE_UNIT_MAPPING]; // [LEX2-125] เปลี่ยนการ mapping กบด กดน เป็น กบม
// TaskCodeFinance not all finance task, use only Finance task working on Task menu...
export const TaskCodeFinance: taskCode[] = [
  taskCode.CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION,
  taskCode.EXPENSE_CLAIM_PAYMENT_APPROVAL,
  taskCode.EXPENSE_CLAIM_RECEIPT_UPLOAD,
];
export const TaskCodeFinanceEdit: taskCode[] = [
  taskCode.EXPENSE_CLAIM_CORRECTION,
  taskCode.EXPENSE_CLAIM_VERIFICATION,
  taskCode.REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT,
  taskCode.REVERSE_EXPENSE_CLAIM_OTHER,
];

export const ApprovalFlowTaskCode: taskCode[] = [
  taskCode.INDICTMENT_RECORD,
  taskCode.REQUEST_DEFERMENT,
  taskCode.EXTEND_DEFERMENT,
  taskCode.REQUEST_CESSATION, // deferment task(s)
  taskCode.MEMORANDUM_COURT_FIRST_INSTANCE,
  taskCode.MEMORANDUM_COURT_APPEAL,
  taskCode.MEMORANDUM_SUPREME_COURT, // memo task(s)
  taskCode.DECREE_OF_FIRST_INSTANCE,
  taskCode.DECREE_OF_APPEAL,
  taskCode.DECREE_OF_SUPREME_COURT, // decree tasks
  taskCode.RECORD_OF_SUPREME_COURT_ACKNOWLEDGE, // e-filing tasks
  taskCode.UPLOAD_E_FILING, // e-filing: upload receipt taskss
  taskCode.R2E07_02_B,
  taskCode.R2E07_04_D,
  taskCode.R2E07_03_C, // defer execution
  taskCode.R2E07_05_E,
];

export const ForceApprovalFlowTaskCode: taskCode[] = [
  taskCode.RECORD_OF_SUPREME_COURT_ACKNOWLEDGE, // e-filing tasks
  taskCode.R2E07_02_B,
  taskCode.R2E07_04_D,
  taskCode.R2E07_03_C, // defer execution
  taskCode.R2E07_05_E,
];

export const TaskCodeMemorandumCourt: taskCode[] = [
  taskCode.MEMORANDUM_COURT_FIRST_INSTANCE,
  taskCode.MEMORANDUM_COURT_APPEAL,
  taskCode.MEMORANDUM_SUPREME_COURT,
];
export const TaskCodeAppeal: taskCode[] = [
  taskCode.CONSIDER_APPEAL,
  taskCode.APPROVE_APPEAL,
  taskCode.CONDITIONAL_APPEAL,
];
export const TaskCodeSupreme: taskCode[] = [
  taskCode.CONSIDER_SUPREME_COURT,
  taskCode.APPROVE_SUPREME_COURT,
  taskCode.CONDITIONAL_SUPREME_COURT,
];
export const TaskCodeDecree: taskCode[] = [
  taskCode.DECREE_OF_FIRST_INSTANCE,
  taskCode.DECREE_OF_APPEAL,
  taskCode.DECREE_OF_SUPREME_COURT,
];
export const TaskCodePaymentExecutionFee: taskCode[] = [
  taskCode.PAY_EXECUTION_FEE_FIRST_INSTANCE,
  taskCode.PAY_EXECUTION_FEE_APPEAL,
  taskCode.PAY_EXECUTION_FEE_SUPREME,
];
export const TaskCodePayExecutionFee: taskCode[] = [
  taskCode.PAY_EXECUTION_FEE_FIRST_INSTANCE,
  taskCode.PAY_EXECUTION_FEE_APPEAL,
  taskCode.PAY_EXECUTION_FEE_SUPREME,
];
export const TaskCodeUploadExecutionReceipt: taskCode[] = [
  taskCode.UPLOAD_EXECUTION_RECEIPT_FIRST_INSTANCE,
  taskCode.UPLOAD_EXECUTION_RECEIPT_APPEAL,
  taskCode.UPLOAD_EXECUTION_RECEIPT_SUPREME,
];
export const TaskCodeDeferExecution: taskCode[] = [taskCode.R2E07_02_B, taskCode.R2E07_03_C];

export const TaskCodeWorkAroundBugFlowType: taskCode[] = [
  taskCode.RECORD_OF_APPEAL,
  taskCode.RECORD_OF_SUPREME_COURT,
  taskCode.UPLOAD_E_FILING,
];

// ForceStatus color
export const ForceStatusNormal: taskCode[] = [
  taskCode.RECORD_OF_SUPREME_COURT_ACKNOWLEDGE,
  taskCode.PROCESS_NOT_PROSECUTE_2,
  // taskCode.R2E09_06_04_6,
  taskCode.R2E09_09_03_14_1,
  taskCode.R2E09_10_02,
];
export const ForceStatusPending: taskCode[] = [
  taskCode.CONSIDER_APPEAL,
  taskCode.CONSIDER_SUPREME_COURT,
  taskCode.SUBMIT_ORIGINAL_DOCUMENT,
  taskCode.APPROVE_APPEAL,
  taskCode.APPROVE_SUPREME_COURT,
  taskCode.RECORD_OF_SUPREME_COURT,
  taskCode.UPLOAD_E_FILING,
  taskCode.RECORD_DIAGNOSIS_DATE,
  taskCode.RECORD_OF_APPEAL,
  taskCode.CONDITIONAL_APPEAL,
  taskCode.CONDITIONAL_SUPREME_COURT,
  taskCode.MEMORANDUM_COURT_FIRST_INSTANCE,
  // taskCode.MEMORANDUM_COURT_APPEAL,
  taskCode.MEMORANDUM_SUPREME_COURT,
  taskCode.SUBMIT_REJECT_ORIGINAL_DOCUMENT,
  taskCode.R2E09_09_01_13_1,
  taskCode.R2E05_07_2A,
  taskCode.R2E35_02_E09_02_7B,
  taskCode.R2E09_06_03,
];

export const ForceStatusPendingPair: { taskCode: taskCode; statusCode: statusCode }[] = [
  { taskCode: taskCode.DECREE_OF_FIRST_INSTANCE, statusCode: statusCode.PENDING },
  { taskCode: taskCode.DECREE_OF_FIRST_INSTANCE, statusCode: statusCode.IN_PROGRESS },
  { taskCode: taskCode.DECREE_OF_FIRST_INSTANCE, statusCode: statusCode.AWAITING },
  { taskCode: taskCode.DECREE_OF_APPEAL, statusCode: statusCode.PENDING },
  { taskCode: taskCode.DECREE_OF_APPEAL, statusCode: statusCode.IN_PROGRESS },
  { taskCode: taskCode.DECREE_OF_APPEAL, statusCode: statusCode.AWAITING },
  { taskCode: taskCode.DECREE_OF_SUPREME_COURT, statusCode: statusCode.PENDING },
  { taskCode: taskCode.DECREE_OF_SUPREME_COURT, statusCode: statusCode.IN_PROGRESS },
  { taskCode: taskCode.DECREE_OF_SUPREME_COURT, statusCode: statusCode.AWAITING },
  { taskCode: taskCode.INVESTIGATE_HEIR_OR_TRUSTEE, statusCode: statusCode.AWAITING },
  { taskCode: taskCode.INVESTIGATE_HEIR_OR_TRUSTEE, statusCode: statusCode.IN_PROGRESS },
  { taskCode: taskCode.R2E35_01_E05_02_6B, statusCode: statusCode.AWAITING },
  { taskCode: taskCode.R2E09_14_3C, statusCode: statusCode.PENDING_REVIEW },
  { taskCode: taskCode.R2E09_06_7C, statusCode: statusCode.PENDING_REVIEW },
  { taskCode: taskCode.R2E09_06_12C, statusCode: statusCode.PENDING_REVIEW },

];

export const TaskCodeStatusMapper = [
  taskCode.ADD_SUB_ACCOUNT,
  taskCode.VERIFY_INFO_AND_DOCUMENT,
  taskCode.CHANGE_RELATED_PERSON,
  taskCode.INVESTIGATE_HEIR_OR_TRUSTEE,
  taskCode.PROCESS_NOT_PROSECUTE_1,
  taskCode.PROCESS_NOT_PROSECUTE_2,
  taskCode.EDIT_MORTGAGE_ASSETS,
  taskCode.ON_REQUEST,
  taskCode.RECORD_NOTICE,
  taskCode.RECORD_NOTICE_GUARANTOR,
  taskCode.SEND_AND_TRACK_NOTICE,
  taskCode.SEND_AND_TRACK_NOTICE_GUARANTOR,
  taskCode.CONFIRM_NOTICE_LETTER,
  taskCode.NEWSPAPER_ANNOUCEMENT,
  taskCode.RECEIPT_ORIGINAL_DOCUMENT,
  taskCode.SUBMIT_ORIGINAL_DOCUMENT,
  taskCode.COLLECT_LG_ID,
  taskCode.INDICTMENT_RECORD,
  taskCode.RECORD_DIAGNOSIS_DATE,
  taskCode.MEMORANDUM_COURT_FIRST_INSTANCE,
  taskCode.MEMORANDUM_COURT_APPEAL,
  taskCode.MEMORANDUM_SUPREME_COURT,
  taskCode.CONSIDER_APPEAL,
  taskCode.APPROVE_APPEAL,
  taskCode.CONDITIONAL_APPEAL,
  taskCode.CONSIDER_SUPREME_COURT,
  taskCode.APPROVE_SUPREME_COURT,
  taskCode.CONDITIONAL_SUPREME_COURT,
  taskCode.DECREE,
  taskCode.CONFIRM_COURT_FEES_PAYMENT,
  taskCode.UPLOAD_COURT_FEES_RECEIPT,
  taskCode.REQUEST_DEFERMENT,
  taskCode.EXTEND_DEFERMENT,
  taskCode.REQUEST_CESSATION,
  taskCode.RESPONSE_UNIT_MAPPING,
  taskCode.CONSIDER_REMAINING_COSTS,
  taskCode.CONSIDER_APPROVE_CLOSE_LG,
  taskCode.AUTO_CREATE_DRAFT_DEFERMENT,
  taskCode.AUTO_CREATE_DRAFT_CESSATION,
  taskCode.AUTO_WHEN_MEET_CRITERIA_DEFERMENT,
  taskCode.AUTO_WHEN_MEET_CRITERIA_CESSATION,
  taskCode.CHANGE_RELATED_PERSON_BLACK_CASE,
  taskCode.CHANGE_RELATED_PERSON_LITIGATION_CASE,
  taskCode.DECREASE_RELATED_PERSON_LITIGATION_CASE,
  taskCode.RECORD_OF_APPEAL,
  taskCode.RECORD_OF_SUPREME_COURT,
  taskCode.RECORD_OF_SUPREME_COURT_ACKNOWLEDGE,
  taskCode.UPLOAD_E_FILING,
  taskCode.DECREE_OF_FIRST_INSTANCE,
  taskCode.DECREE_OF_APPEAL,
  taskCode.DECREE_OF_SUPREME_COURT,
  taskCode.PAY_EXECUTION_FEE_FIRST_INSTANCE,
  taskCode.PAY_EXECUTION_FEE_APPEAL,
  taskCode.PAY_EXECUTION_FEE_SUPREME,
  taskCode.UPLOAD_EXECUTION_RECEIPT_FIRST_INSTANCE,
  taskCode.UPLOAD_EXECUTION_RECEIPT_APPEAL,
  taskCode.UPLOAD_EXECUTION_RECEIPT_SUPREME,
  taskCode.EXPENSE_CLAIM_VERIFICATION,
  taskCode.CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION,
  taskCode.EXPENSE_CLAIM_PAYMENT_APPROVAL,
  taskCode.EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL,
  taskCode.EXPENSE_CLAIM_RECEIPT_UPLOAD,
  taskCode.EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD,
  taskCode.EXPENSE_CLAIM_CORRECTION,
  taskCode.AUTO_CREATE_EXPENSE_CLAIM,
  taskCode.EXPENSE_CLAIM_RETRY,
  taskCode.EXPENSE_CLAIM_SYSTEM_PAYMENT,
  taskCode.EXPENSE_CLAIM_RECIEVE_ORIGINAL_DOCUMENT,
  taskCode.REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT,
  taskCode.REVERSE_EXPENSE_CLAIM_OTHER,
  taskCode.DECIDE_REVERSE_EXPENSE_CLAIM,
  taskCode.RECEIVE_NORMAL_PAYMENT,
  taskCode.RECEIVE_ADVANCE_PAYMENT,
  taskCode.RECEIVE_COURT_PAYMENT,
  taskCode.RECEIVE_CREDIT_NOTE_PAYMENT,
  taskCode.R2E09_06_03,
  taskCode.RECEIPT_REJECT_ORIGINAL_DOCUMENT,
  taskCode.SUBMIT_REJECT_ORIGINAL_DOCUMENT,
  taskCode.TRY_CONFIRM_COURT_FEES_PAYMENT,
  taskCode.REQUEST_REVISE_DEFERMENT,
  taskCode.REQUEST_REVISE_CESSATION,
  taskCode.SAVE_DRAFT_DEFERMENT,
  taskCode.SAVE_DRAFT_CESSATION,
  taskCode.R2E07_02_B,
  taskCode.R2E07_04_D,
  taskCode.R2E07_03_C,
  taskCode.R2E07_01_A,
  taskCode.R2E09_10_02,
  taskCode.EXECUTE_PREFERENCE,
  taskCode.ASSIGN_LAWYER_PLAINTIFF_CASE,
  taskCode.PREPARE_PREFERENCE_DODUMENT,
];

// seizure-fee upload receipts for non e-filing
export const TaskCodeSeizureFeeNonEfiling = [taskCode.R2E35_01_E05_01_6A, taskCode.R2E35_01_E05_02_6B];

// auction-expense upload receipts for non e-filing
export const TaskCodeAuctionExpenseNonEfiling = [taskCode.R2E35_02_E09_01_7A, taskCode.R2E35_02_E09_02_7B];
