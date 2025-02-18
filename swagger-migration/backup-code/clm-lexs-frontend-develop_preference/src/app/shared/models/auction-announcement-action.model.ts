export const auctionActionCode = {
  R2E09_2_A: 'R2E09-2-A' as auctionActionCode,
  R2E09_4: 'R2E09-4' as auctionActionCode,
  R2E09_3: 'R2E09-3' as auctionActionCode, // มติ
  R2E09_3_16757: 'R2E09-3-16757' as auctionActionCode, //ประวัติมติ
  R2E09_16282: 'R2E09-16282' as auctionActionCode, //รายละเอียดทรัพย์ NPA
  R2E11_LEXS2_552: 'R2E11_LEXS2_552' as auctionActionCode, // revoke sale
  R2E09_04_01_11: 'R2E09-04-01-11' as auctionActionCode, // taskcode R2E09-04-01-11 ใช้ รายละเอียดทรัพย์จาก หน้า AuctionDetail
  R2E09_05_01_12A: 'R2E09-05-01-12A' as auctionActionCode,
  PENDING_NEW_ANNOUNCE: 'PENDING_NEW_ANNOUNCE' as auctionActionCode,
  PENDING_NEW_DEEDGROUP: 'PENDING_NEW_DEEDGROUP' as auctionActionCode,
  PENDING_NEW_VALIDATE: 'PENDING_NEW_VALIDATE' as auctionActionCode,
};
export type auctionActionCode =
  | 'R2E09_2_A'
  | 'R2E09_4'
  | 'R2E09_3'
  | 'R2E09-3-16757'
  | 'R2E09-16282'
  | 'R2E11_LEXS2_552'
  | 'R2E09-04-01-11'
  | 'R2E09-05-01-12A'
  | 'PENDING_NEW_ANNOUNCE'
  | 'PENDING_NEW_DEEDGROUP'
  | 'PENDING_NEW_VALIDATE';
