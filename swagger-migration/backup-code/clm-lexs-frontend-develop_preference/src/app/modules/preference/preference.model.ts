export type ModeCompEnum = 'EDIT' | 'VIEW';
export const ModeCompEnum = {
  EDIT: 'EDIT' as ModeCompEnum,
  VIEW: 'VIEW' as ModeCompEnum,
}

export type ScenarioPreferenceEnum = 'SCENARIO0' | 'SCENARIO1' | 'SCENARIO2' | 'SCENARIO3' | 'SCENARIO4' | 'SCENARIO5' | 'SCENARIO6' | 'SCENARIO7';
export const ScenarioPreferenceEnum = {
  SCENARI0: 'NoCondition' as ScenarioPreferenceEnum,
  SCENARIO1: 'MenuTask_ActionButtonOnRequestPreference' as ScenarioPreferenceEnum,
  SCENARIO2: 'MenuTask_TaskPendingApprove' as ScenarioPreferenceEnum,
  SCENARIO3: 'MenuTask_TaskPendingEdit' as ScenarioPreferenceEnum,
  SCENARIO4: 'MenuTask_TaskPendingAssignLawyer' as ScenarioPreferenceEnum,
  SCENARIO5: 'MenuTask_TaskPrepareDocument' as ScenarioPreferenceEnum,
  SCENARIO6: 'MenuPreference_LinkNumRequest' as ScenarioPreferenceEnum,
  SCENARIO7: 'MenuLawSuit_LinkNumRequest' as ScenarioPreferenceEnum,
}

export interface ModeCompPreference {
  isShowCompActionBar: boolean,
  isShowCompTab: boolean,
  isShowCompCommand: boolean,
  isShowCompAssignLawyer: boolean,
  isShowCompClaim: boolean,
  modeCompCommand: ModeCompEnum,
  modeCompAssignLawyer: ModeCompEnum,
  modeCompClaim: ModeCompEnum,
}

export class DefaultModeCompPreference implements ModeCompPreference {
  isShowCompActionBar: boolean = false;
  isShowCompTab: boolean = false;
  isShowCompCommand: boolean = false;
  isShowCompAssignLawyer: boolean = false;
  isShowCompClaim: boolean = false;
  modeCompCommand: ModeCompEnum = ModeCompEnum.VIEW;
  modeCompAssignLawyer: ModeCompEnum = ModeCompEnum.VIEW;
  modeCompClaim: ModeCompEnum = ModeCompEnum.VIEW;
}

export interface SearchTaskPreference {
  tabName: 'USER' | 'TEAM' | 'ORG' | 'CLOSED' | 'DASHBOARD' | 'PREFERENCE' | 'NOT_PREFERENCE' | 'ALL';
  preferenceGroupNo?: string;
  litigationId?: string;
  size?: number;
  page?: number;
  sortBy?: Array<string>;
  sortOrder?: string;
}
