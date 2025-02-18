import { ITabNav } from '@app/shared/models';

// WITHDRAWN SEIZURE_PROPERTY TABS Config
export const WITHDRAWN_SEIZURE_PROPERTY_TABS: ITabNav[] = [
  {
    index: 0,
    label: 'รายละเอียดการถอนการยึดทรัพย์',
    prefix: '',
    path: 'nav-tab-withdrawn-detail-info-tab',
    fullPath: '',
  },
  {
    index: 1,
    label: 'ทรัพย์และผู้ติดต่อ',
    prefix: '',
    path: 'nav-tab-assets-contacts-info-tab',
    fullPath: '',
  },
  {
    index: 2,
    label: 'รายละเอียดสำนักงานบังคับคดี',
    prefix: '',
    path: 'nav-tab-legal-execution-office-info-tab',
    fullPath: '',
  },
];

export const WITHDRAWN_SEIZURE_PROPERTY_STEPS: ITabNav[] = [
  {
    index: 0,
    label: 'ตรวจสอบรายละเอียดถอนการยึดทรัพย์',
    prefix: '',
    path: 'withdrawn-info-step',
    fullPath: '',
  },
  {
    index: 1,
    label: 'จัดรายการทรัพย์และเลือกผู้ติดต่อ',
    prefix: '',
    path: 'assets-contacts-info-step',
    fullPath: '',
  },
  {
    index: 2,
    label: 'ตรวจสอบรายละเอียดและอัปโหลดเอกสาร',
    prefix: '',
    path: 'legal-execution-office-info-step',
    fullPath: '',
  },
];

export const LegalExecutionList = [
  {
    text: 'เจ้าหนี้นอกสวมสิทธิ์แทน',
    value: '01',
  },
  {
    text: 'ผู้ติดต่อไม่สามารถจ่ายค่าธรรมเนียมการถอนการยึดทรัพย์',
    value: '02',
  },
  {
    text: 'จำเลยเป็นบุคคลล้มละลาย หรือ ถูกพิทักษ์ทรัพ',
    value: '03',
  },
  {
    text: 'อื่นๆ',
    value: '04',
  },
];
