/**
 * ประเภทสำนักงานบังคับคดี
 */
export enum SeizureLedTypes {
  // หลัก
  MAIN = 'MAIN',
  // หลัก เพิ่มเติม
  MAIN_ADDITIONAL = 'MAIN_(ADDITIONAL)',
  // ข้ามเขต
  INTER_REGION = 'INTER-REGION',
  // ข้ามเขต เพิ่มเติม
  INTER_REGION_ADDITIONAL = 'INTER-REGION_(ADDITIONAL)',
}

export const SEIZURE_LED_TYPE = [
  SeizureLedTypes.MAIN,
  SeizureLedTypes.MAIN_ADDITIONAL,
  SeizureLedTypes.INTER_REGION,
  SeizureLedTypes.INTER_REGION_ADDITIONAL,
];
