import { SimpleSelectOption } from '@spig/core';

export const WITHDRAWN_REASON_OPTION: SimpleSelectOption[] = [
  { value: '01', text: 'โอนทรัพย์ชำระหนี้' },
  { value: '02', text: 'ชำระหนี้เสร็จสิ้นทั้งหมด' },
  { value: '03', text: 'ชำระหนี้เสร็จสิ้นเฉพาะทรัพย์ที่ต้องการไถ่ถอน' },
  { value: '04', text: 'ขายทรัพย์ชำระหนี้' },
];
