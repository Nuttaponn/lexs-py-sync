import { CollateralCaseLexsStatus } from './collateralCaseLexsStatus';

export const LEXS_TYPES = [
  {
    text: 'ยึดทรัพย์แล้ว',
    value: 'SEIZURED',
  },
  {
    text: 'ไม่ถูกยึด / อายัด / ขาย',
    value: 'PLEDGE',
  },
];

export const WITHDRAWN_LEXS_TYPES = [
  // {
  //   text: 'ไม่ถูกยึด / อายัด / ขาย',
  //   value: CollateralCaseLexsStatus.PLEDGE,
  // },
  {
    text: 'ยึดทรัพย์แล้ว',
    value: CollateralCaseLexsStatus.SEIZURED,
  },
  {
    text: 'อยู่ระหว่างขายทอดตลาด',
    value: CollateralCaseLexsStatus.ON_SALE,
  },
  {
    text: 'รอประกาศขายทอดตลาดใหม่',
    value: CollateralCaseLexsStatus.PENDING_SALE,
  },
  // {
  //   text: 'ขายทอดตลาดแล้ว',
  //   value: CollateralCaseLexsStatus.SOLD,
  // },
];
