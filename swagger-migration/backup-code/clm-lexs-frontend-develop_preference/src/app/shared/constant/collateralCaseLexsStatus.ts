/**
 * สถานะหลักประกัน (LEXS)
 */
export enum CollateralCaseLexsStatus {
  // ‘ยึดทรัพย์แล้ว’
  SEIZURED = 'SEIZURED',
  // ‘ไม่ถูกยึด / อายัด / ขาย’
  PLEDGE = 'PLEDGE',
  /**
   * อยู่ระหว่างการขายทอดตลาด
   */
  ON_SALE = 'ON_SALE',
  /**
   * รอประกาศขายทอดตลาดใหม่
   */
  PENDING_SALE = 'PENDING_SALE',
  /**
   * ขายทอดตลาดแล้ว
   */
  SOLD = 'SOLD',
}
