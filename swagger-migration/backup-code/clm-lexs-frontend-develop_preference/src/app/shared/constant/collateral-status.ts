import { NameValuePair } from '@lexs/lexs-client';

export const CollateralStatus: NameValuePair[] = [
  { name: 'สถานะทรัพย์ (LEXS)', value: 'ALL' },
  { name: 'ไม่ถูกอายัด/ยึด/ขาย', value: 'PLEDGE' },
  { name: 'ยึดทรัพย์', value: 'SEIZURED' },
  { name: 'อยู่ระหว่างขายทอดตลาด', value: 'ON_SALE' },
  { name: 'ขายทอดตลาดแล้ว', value: 'SOLD' },
  { name: 'รอประกาศขายทอดตลาดใหม่', value: 'PENDING_SALE' },
  { name: 'ถูกเจ้าหนี้นอกยึด', value: '005' },
  { name: '-', value: '-' },
];

export const DefermentCollateralStatus: NameValuePair[] = [
  { name: 'สถานะทรัพย์ (LEXS)', value: 'ALL' },
  { name: 'ไม่ถูกอายัด/ยึด/ขาย', value: 'PLEDGE' },
  { name: 'ยึดแล้ว', value: 'SEIZURED' },
  { name: 'รอประกาศขายทอดตลาดใหม่', value: 'PENDING_SALE' },
];

export const CollateralStatusAlternate: NameValuePair[] = [
  { name: 'ทุกสถานะหลักประกัน', value: 'ALL' },
  { name: 'ไม่ถูกอายัด/ยึด/ขาย', value: 'PLEDGE' },
  { name: 'ยึดทรัพย์', value: 'SEIZURED' },
  { name: 'อยู่ระหว่างขายทอดตลาด', value: '002' },
  { name: 'ขายทอดตลาดแล้ว', value: '003' },
  { name: 'รอประกาศขายทอดตลาดใหม่', value: '004' },
  { name: 'ถูกเจ้าหนี้นอกยึด', value: '005' },
  { name: '-', value: '-' },
];
