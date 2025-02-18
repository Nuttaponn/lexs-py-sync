import { CollateralDto, CollateralRequest } from '@lexs/lexs-client';
export const TYPE_CODE: any = {
  LAND: '1',
  LAND_BUILDING: '2',
  BUILDING: '3',
  MACHINE: '5',
  ACCOUNT: '8',
  BOND: '10',
  STOCK_CER: '9',
  CONDO: '4',
  SALARY: '97',
  VEHICLE: '19',
  LEASEHOLD: '6',
  COOPERATIVE_STOCK: '98',
  OTHER: '99',
};

export const CollateralOptions = [
  { text: 'ที่ดิน', value: TYPE_CODE.LAND },
  { text: 'ที่ดินพร้อมสิ่งปลูกสร้าง', value: TYPE_CODE.LAND_BUILDING },
  { text: 'อาคารสิ่งปลูกสร้าง', value: TYPE_CODE.BUILDING },
  { text: 'เครื่องจักร', value: TYPE_CODE.MACHINE },
  { text: 'เงินฝาก', value: TYPE_CODE.ACCOUNT },
  { text: 'ตราสารหนี้', value: TYPE_CODE.BOND },
  { text: 'ตราสารทุน', value: TYPE_CODE.STOCK_CER },
  { text: 'คอนโดมีเนียม/อาคารชุด/ห้องชุด', value: TYPE_CODE.CONDO },
  { text: 'เงินเดือน', value: TYPE_CODE.SALARY },
  { text: 'ยานพาหนะ', value: TYPE_CODE.VEHICLE },
  { text: 'สิทธิการเช่า', value: TYPE_CODE.LEASEHOLD },
  { text: 'เงินปันผลหุ้นสหกรณ์', value: TYPE_CODE.COOPERATIVE_STOCK },
  { text: 'อื่นๆ', value: TYPE_CODE.OTHER },
];

export const TYPE: any = {
  LAND: {
    NAME: 'ที่ดิน',
    KEY: TYPE_CODE.LAND,
  },
  LAND_BUILDING: {
    NAME: 'ที่ดินพร้อมสิ่งปลูกสร้าง',
    KEY: TYPE_CODE.LAND_BUILDING,
  },
  BUILDING: {
    NAME: 'อาคารสิ่งปลูกสร้าง',
    KEY: TYPE_CODE.BUILDING,
  },
  MACHINE: {
    NAME: 'เครื่องจักร',
    KEY: TYPE_CODE.MACHINE,
  },
  ACCOUNT: {
    NAME: 'เงินฝาก',
    KEY: TYPE_CODE.ACCOUNT,
  },
  BOND: {
    NAME: 'ตราสารหนี้',
    KEY: TYPE_CODE.BOND,
  },
  STOCK_CER: {
    NAME: 'ตราสารทุน',
    KEY: TYPE_CODE.STOCK_CER,
  },
  CONDO: {
    NAME: 'คอนโดมีเนียม/อาคารชุด/ห้องชุด',
    KEY: TYPE_CODE.CONDO,
  },
  SALARY: {
    NAME: 'เงินเดือน',
    KEY: TYPE_CODE.SALARY,
  },
  VEHICLE: {
    NAME: 'ยานพาหนะ',
    KEY: TYPE_CODE.VEHICLE,
  },
  LEASEHOLD: {
    NAME: 'สิทธิการเช่า',
    KEY: TYPE_CODE.LEASEHOLD,
  },
  COOPERATIVE_STOCK: {
    NAME: 'เงินปันผลหุ้นสหกรณ์',
    KEY: TYPE_CODE.COOPERATIVE_STOCK,
  },
  OTHER: {
    NAME: 'อื่นๆ',
    KEY: TYPE_CODE.OTHER,
  },
};

export interface CollateralDtoHide {
  hide: boolean;
  data: Array<CollateralDto>;
  collateralTypeDesc: string;
  collateralTypeCode: string;
  totalElements?: number;
  totalPages?: number;
  _data?: Array<CollateralDto>;
  currentPage: number;
  fromIndex: number;
  toIndex: number;
  dataFilter?: Array<any>;
}

export interface CollateralRequestDes {
  collateralTypeDesc?: string;
  externalAssetStatusDesc?: string;
}

export interface CollateralRequestDes extends CollateralRequest {}
