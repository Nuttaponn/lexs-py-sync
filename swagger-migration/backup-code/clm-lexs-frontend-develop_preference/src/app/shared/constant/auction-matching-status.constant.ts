/**
 * สถานะหลักประกัน (LEXS)
 */
export enum AuctionMathchingStatus {
  /**
   * รอตรวจสอบคดีความ
   */
  PENDING_CASE = 'PENDING_CASE',
  /**
   * อยู่ระหว่างการขายทอดตลาด
   */
  PENDING_COLL = 'PENDING_COLL',
  /**
   * รอบันทึกประกาศ
   */
  PENDING_NEW_ANNOUNCE = 'PENDING_NEW_ANNOUNCE',
  /**
   * รอบันทึกประกาศ
   */
  PENDING_NEW_DEEDGROUP = 'PENDING_NEW_DEEDGROUP',
  /**
   * รอตรวจสอบข้อมูลทรัพย์
   */
  PENDING_NEW_VALIDATE = 'PENDING_NEW_VALIDATE',
}

export enum AuctionStatus {
  /**
   * รอตรวจสอบข้อมูลประกาศ
   */
  NEW = 'NEW',
  /**
   * รอตรวจสอบข้อมูลทรัพย์
   */
  MATCHING = 'MATCHING',
  /**
   * ไม่ดำเนินการ
   */
  NOT_PROCEED = 'NOT_PROCEED',
  /**
   * เสร็จสิ้น (ส่งขอมติ NPA)
   */
  NPA_SUBMIT = 'NPA_SUBMIT',
  /**
   * เสร็จสิ้น (แก้ไขใบประกาศ)
   */
  ADJUST_SUBMIT = 'ADJUST_SUBMIT',
  /**
   * ดำเนินการแก้ไขใบประกาศ
   */
  NPA_ADJUST = 'NPA_ADJUST',
  /**
   * รอผลมติ
   */
  PROCEED = 'PROCEED',
  /**
   * รอขายทอดตลาด
   */
  PENDING_AUCTION = 'PENDING_AUCTION',
  R2E09_02_3B_PENDING_SAVE = 'R2E09-02-3B_PENDING_SAVE',
  R2E09_02_3B_PENDING_PAYMENT = 'R2E09-02-3B_PENDING_PAYMENT',
  R2E09_02_3B_PAYMENT_COMPLETE_PENDING_SAVE = 'R2E09-02-3B_PAYMENT_COMPLETE_PENDING_SAVE',
  R2E09_14_3C_PENDING_SAVE = 'R2E09-14-3C_PENDING_SAVE',
  R2E09_14_3C_PENDING_UPDATE = 'R2E09-14-3C_PENDING_UPDATE',
  R2E09_14_3C_PENDING_REVIEW = 'R2E09-14-3C_PENDING_REVIEW',
  R2E09_14_3C_PENDING_APPROVAL = 'R2E09-14-3C_PENDING_APPROVAL',
  R2E35_02_E09_01_7A_PENDING_RECEIPT_UPLOAD = 'R2E35-02-E09-01-7A_PENDING_RECEIPT_UPLOAD',
  R2E35_02_E09_02_7B_PENDING_RECEIPT_UPDATE = 'R2E35-02-E09-02-7B_PENDING_RECEIPT_UPDATE',
  R2E35_02_E09_02_7B_PENDING_RECEIPT_VERIFICATION = 'R2E35-02-E09-02-7B_PENDING_RECEIPT_VERIFICATION',
  NPA_RECEIVE = 'NPA_RECEIVE',
  /**
   * อยู่ระหว่างนัดตามประกาศขายทอดตลาด
   */
  AUCTION = 'AUCTION',
  COMPLETE = 'COMPLETE',
  APPRAISAL = 'APPRAISAL',
  /**
   * สถานะการตัดบัญชี
   */
  R2E09_10_02_COMPLETE = 'R2E09-10-02_COMPLETE', // ตัดบัญชีชำระหนี้เสร็จสิ้น
  R2E09_10_01_CREATE = 'R2E09-10-01_CREATE', // รอบันทึกตัดบัญชีชำระหนี้
  R2E09_10_02_CREATE = 'R2E09-10-02_CREATE', // รอพิจารณาตัดบัญชีชำระหนี้
  R2E09_10_03_CREATE = 'R2E09-10-03_CREATE', // รอแก้ไข
}

export enum MatchingEventCodeStatus {
  UNPROCEED = 'ไม่ดำเนินการต่อ',
  UNMAP_CASE = 'ยกเลิกประกาศที่จับคู่',
  ADJUST_SUBMIT = 'แถลงแก้ไขประกาศ',
  REPROCEED = 'ดำเนินการใหม่อีกครั้ง',
}

export enum AnnouncementCashierChequeStatus {
  PENDING = 'MOCK_AS_STATUS_PENDING',
  CORRECT_PENDING = 'MOCK_AS_STATUS_CORRECT_PENDING',
  PENDING_APPROVAL = 'MOCK_AS_STATUS_PENDING_APPROVAL',
  CONSIDERATION = 'MOCK_AS_STATUS_CONSIDERATION',
}

export enum AnnouncementExpenseStatus {
  UPLOAD_RECEIPT = 'MOCK_AS_STATUS_UPLOAD_RECEIPT',
  RECEIPT_CORRECT_PENDING = 'MOCK_AS_STATUS_RECEIPT_CORRECT_PENDING',
  RECEIPT_PENDING_APPROVAL = 'MOCK_AS_STATUS_RECEIPT_PENDING_APPROVAL',
  RECEIPT_COMPLETE = 'MOCK_AS_STATUS_RECEIPT_COMPLETE',
}

export enum ConveyanceStatus {
  APPRAISAL = 'APPRAISAL',
  XFER_FAIL = 'XFER_FAIL',
  XFER_ARR = 'XFER_ARR',
  SUBMIT_XFER_CHQ = 'SUBMIT_XFER_CHQ',
  AMEND_XFER_CHQ = 'AMEND_XFER_CHQ',
  ISSUE_XFER_CHQ = 'ISSUE_XFER_CHQ',
  XFER_COMPLETE = 'XFER_COMPLETE',
  COMPLETE = 'COMPLETE',
}
