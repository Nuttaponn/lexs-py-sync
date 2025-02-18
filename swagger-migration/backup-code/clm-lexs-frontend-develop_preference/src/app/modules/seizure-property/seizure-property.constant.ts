import { ITabNav } from '@app/shared/models';

// SEIZURE_PROPERTY TABS Config
export const SEIZURE_PROPERTY_TABS: ITabNav[] = [
  {
    index: 0,
    label: 'รายการทรัพย์ที่จะยึด',
    prefix: '',
    path: 'nav-tab-seizure-list-info-tab',
    fullPath: '',
  },
  {
    index: 1,
    label: 'รายการเอกสารดำเนินงาน',
    prefix: '',
    path: 'nav-tab-seizure-document-info-tab',
    fullPath: '',
  },
];
export const NON_PLEDGE_PROPERTY_TABS: ITabNav[] = [
  {
    index: 0,
    label: 'รายการทรัพย์ที่จะยึด',
    prefix: '',
    path: 'nav-tab-seizure-list-info-tab',
    fullPath: '',
  },
  {
    index: 1,
    label: 'รายการเอกสารดำเนินงาน',
    prefix: '',
    path: 'non-pledge-properties-document-tab',
    fullPath: '',
  },
];
