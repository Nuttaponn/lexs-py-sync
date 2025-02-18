/**
 * ประเภทสำนักงานบังคับคดี
 */
export enum SeizureCollateralTypes {
  // ทรัพย์จำนอง
  PLEDGE = 'PLEDGE',
  // ทรัพย์นอกจำนอง
  NON_PLEDGE = 'NON-PLEDGE',
}

export type SEIZURE_COLLATERAL_TYPE = SeizureCollateralTypes.PLEDGE | SeizureCollateralTypes.NON_PLEDGE;
