import { ITabNav } from '../models';
import {
  CIVIL_CASE_TAB_ROUTES,
  CUSTOMER_DETAIL_ROUTES,
  CUSTOMER_ROUTES,
  EXECUTION_INFO_TAB_ROUTES,
  EXTERNAL_DOC_DETAIL_ROUTES,
  EXTERNAL_DOC_ROUTES,
  LAWSUIT_DETAIL_ROUTES,
  LAWSUIT_ROUTES,
  LITIGATION_PROCESS_INFO_TAB_ROUTES,
  PREFERENCE_CASE_TAB_ROUTES,
  SEIZURE_PROPERTY_INFO_TAB_ROUTES,
} from './routes.constant';

export const CUSTOMER_TABS_INFO: ITabNav[] = [
  {
    index: 0,
    label: 'CUSTOMER.HEAD_COLUMN_DEBT_RELATED_INFO',
    prefix: CUSTOMER_ROUTES.DETAIL,
    path: 'nav-tab-debt-related-info-tab',
    fullPath: CUSTOMER_DETAIL_ROUTES.DEBT_RELATED_INFO_TAB,
  },
  {
    index: 1,
    label: 'CUSTOMER.HEAD_COLUMN_ACCOUNT_INFO',
    prefix: CUSTOMER_ROUTES.DETAIL,
    path: 'nav-tab-account-info-tab',
    fullPath: CUSTOMER_DETAIL_ROUTES.ACCOUNT_INFO_TAB,
  },
  {
    index: 2,
    label: 'CUSTOMER.HEAD_COLUMN_COLLATERAL_INFO',
    prefix: CUSTOMER_ROUTES.DETAIL,
    path: 'nav-tab-collateral-info-tab',
    fullPath: CUSTOMER_DETAIL_ROUTES.COLLATERAL_INFO_TAB,
  },
  {
    index: 3,
    label: 'CUSTOMER.HEAD_COLUMN_DOCUMENT_CHECKLIST_INFO',
    prefix: CUSTOMER_ROUTES.DETAIL,
    path: 'nav-tab-document-checklist-info-tab',
    fullPath: CUSTOMER_DETAIL_ROUTES.DOCUMENT_CHECKLIST_INFO_TAB,
  },
  {
    index: 4,
    label: 'CUSTOMER.HEAD_COLUMN_CASE_INFO',
    prefix: CUSTOMER_ROUTES.DETAIL,
    path: 'nav-tab-case-info-tab',
    fullPath: CUSTOMER_DETAIL_ROUTES.CASE_INFO_TAB,
  },
  {
    index: 5,
    label: 'CUSTOMER.HEAD_COLUMN_AUDIT_LOG_INFO',
    prefix: CUSTOMER_ROUTES.DETAIL,
    path: 'nav-tab-audit-log-info-tab',
    fullPath: CUSTOMER_DETAIL_ROUTES.AUDIT_LOG_INFO_TAB,
  },
];

export const LAWSUIT_TABS_INFO: ITabNav[] = [
  {
    index: 0,
    label: 'LAWSUIT.HEAD_COLUMN_CASE_INFO',
    prefix: LAWSUIT_ROUTES.DETAIL,
    path: 'nav-tab-litigation-summary-info-tab',
    fullPath: LAWSUIT_DETAIL_ROUTES.LITIGATION_SUMMARY_INFO_TAB,
  },
  {
    index: 1,
    label: 'LAWSUIT.INFO_LABEL_TAB_LITIGATION_PROCESS_INFO',
    prefix: LAWSUIT_ROUTES.DETAIL,
    path: 'nav-tab-litigation-process-info-tab',
    fullPath: LAWSUIT_DETAIL_ROUTES.LITIGATION_PROCESS_INFO_TAB,
  },
  {
    index: 2,
    label: 'LAWSUIT.INFO_LABEL_TAB_CIVIL_CASE_INFO',
    prefix: LAWSUIT_ROUTES.DETAIL,
    path: 'nav-tab-civil-case-info-tab',
    fullPath: LAWSUIT_DETAIL_ROUTES.CIVIL_CASE_INFO_TAB,
  },
  {
    index: 3,
    label: 'LAWSUIT.INFO_LABEL_TAB_PREFERENCE_CASE_INFO',
    prefix: LAWSUIT_ROUTES.DETAIL,
    path: 'nav-tab-preference-case-info-tab',
    fullPath: LAWSUIT_DETAIL_ROUTES.PREFERENCE_CASE_INFO_TAB,
  },
  {
    index: 4,
    label: 'LAWSUIT.INVESTIGATES_PROPERTY_TITLE',
    prefix: LAWSUIT_ROUTES.DETAIL,
    path: 'nav-tab-investigate-property-info-tab',
    fullPath: LAWSUIT_DETAIL_ROUTES.INVESTIGATES_PROPERTY_INFO_TAB,
  },
  {
    index: 5,
    label: 'LAWSUIT.LITIGATION_MEMO',
    prefix: LAWSUIT_ROUTES.DETAIL,
    path: 'nav-tab-memo-info-tab',
    fullPath: LAWSUIT_DETAIL_ROUTES.MEMO_INFO_TAB,
  },
  {
    index: 6,
    label: 'LAWSUIT.INFO_LABE_TAB_AUDIT_LOG',
    prefix: LAWSUIT_ROUTES.DETAIL,
    path: 'nav-tab-audit-log-info-tab',
    fullPath: LAWSUIT_DETAIL_ROUTES.AUDIT_LOG_INFO_TAB,
  },
];

export const LITIGATION_PROCESS_INFO_TABS_INFO: ITabNav[] = [
  {
    index: 0,
    label: 'LAWSUIT.INFO_LABEL_TAB_DEBTOR_AND_RELATED_INFO',
    prefix: LAWSUIT_DETAIL_ROUTES.LITIGATION_PROCESS_INFO_TAB,
    path: 'nav-sub-tab-debt-related-info-tab',
    fullPath: LITIGATION_PROCESS_INFO_TAB_ROUTES.DEBT_RELATED_INFO_TAB,
  },
  {
    index: 1,
    label: 'LAWSUIT.INFO_LABEL_TAB_ACCOUNT_INFO_AND_DEBT',
    prefix: LAWSUIT_DETAIL_ROUTES.LITIGATION_PROCESS_INFO_TAB,
    path: 'nav-sub-tab-account-and-debt-info-tab',
    fullPath: LITIGATION_PROCESS_INFO_TAB_ROUTES.ACCOUNT_AND_DEBT_INFO_TAB,
  },
  {
    index: 2,
    label: 'LAWSUIT.INFO_LABEL_TAB_COLLATERAL_INFO',
    prefix: LAWSUIT_DETAIL_ROUTES.LITIGATION_PROCESS_INFO_TAB,
    path: 'nav-sub-tab-collateral-info-tab',
    fullPath: LITIGATION_PROCESS_INFO_TAB_ROUTES.COLLATERAL_INFO_TAB,
  },
];

export const CIVIL_CASE_TABS_INFO: ITabNav[] = [
  {
    index: 0,
    label: 'LAWSUIT.INFO_LABEL_TAB_PREPARE_TO_SUE',
    prefix: LAWSUIT_DETAIL_ROUTES.LITIGATION_PROCESS_INFO_TAB,
    path: 'nav-sub-tab-prepare-lawsuit-info-tab',
    fullPath: CIVIL_CASE_TAB_ROUTES.PREPARE_LAWSUIT_INFO_TAB,
  },
  {
    index: 1,
    label: 'LAWSUIT.INFO_LABEL_TAB_SUE',
    prefix: LAWSUIT_DETAIL_ROUTES.LITIGATION_PROCESS_INFO_TAB,
    path: 'nav-sub-tab-sue-info-tab',
    fullPath: CIVIL_CASE_TAB_ROUTES.SUE_INFO_TAB,
  },
  {
    index: 2,
    label: 'LAWSUIT.INFO_LABEL_TAB_TRIAL',
    prefix: LAWSUIT_DETAIL_ROUTES.LITIGATION_PROCESS_INFO_TAB,
    path: 'nav-sub-tab-trial-info-tab',
    fullPath: CIVIL_CASE_TAB_ROUTES.TRIAL_INFO_TAB,
  },
  {
    index: 3,
    label: 'LAWSUIT.INFO_LABEL_TAB_JUDGE',
    prefix: LAWSUIT_DETAIL_ROUTES.LITIGATION_PROCESS_INFO_TAB,
    path: 'nav-sub-tab-judge-info-tab',
    fullPath: CIVIL_CASE_TAB_ROUTES.JUDGE_INFO_TAB,
  },
  {
    index: 4,
    label: 'LAWSUIT.INFO_LABEL_TAB_EXECUTION',
    prefix: LAWSUIT_DETAIL_ROUTES.LITIGATION_PROCESS_INFO_TAB,
    path: 'nav-sub-tab-execution-info-tab',
    fullPath: CIVIL_CASE_TAB_ROUTES.EXECUTION_INFO_TAB,
  },
  {
    index: 5,
    label: 'LAWSUIT.INFO_LABEL_TAB_SEIZURE_PROPERTY',
    prefix: LAWSUIT_DETAIL_ROUTES.LITIGATION_PROCESS_INFO_TAB,
    path: 'nav-sub-tab-seizure-property-info-tab',
    fullPath: CIVIL_CASE_TAB_ROUTES.SEIZURE_PROPERTY_INFO_TAB,
  },
  {
    index: 6,
    label: 'LAWSUIT.INFO_LABEL_TAB_AUCTION_LED_CARD',
    prefix: LAWSUIT_DETAIL_ROUTES.LITIGATION_PROCESS_INFO_TAB,
    path: 'nav-sub-tab-auction-led-card-info-tab',
    fullPath: CIVIL_CASE_TAB_ROUTES.AUCTION_LED_CARD_INFO_TAB,
  },
];

export const PREFERENCE_CASE_TABS_INFO: ITabNav[] = [
  {
    index: 0,
    label: 'LAWSUIT.TAB_PREFERENCE_COMMAND',
    prefix: LAWSUIT_DETAIL_ROUTES.PREFERENCE_CASE_INFO_TAB,
    path: 'nav-sub-tab-preference-info-tab',
    fullPath: PREFERENCE_CASE_TAB_ROUTES.PREFERENCE_INFO_TAB,
  },
  {
    index: 1,
    label: 'LAWSUIT.TAB_PREFERENCE_COMPLAINT',
    prefix: LAWSUIT_DETAIL_ROUTES.PREFERENCE_CASE_INFO_TAB,
    path: 'nav-sub-tab-preference-complaint-tab',
    fullPath: PREFERENCE_CASE_TAB_ROUTES.PREFERENCE_COMPLAINT_TAB,
  },
  {
    index: 2,
    label: 'LAWSUIT.TAB_PREFERENCE_JUDGE',
    prefix: LAWSUIT_DETAIL_ROUTES.PREFERENCE_CASE_INFO_TAB,
    path: 'nav-sub-tab-preference-judge-tab',
    fullPath: PREFERENCE_CASE_TAB_ROUTES.PREFERENCE_JUDGE_TAB,
  },
  {
    index: 3,
    label: 'LAWSUIT.TAB_PREFERENCE_COURT_ORDER',
    prefix: LAWSUIT_DETAIL_ROUTES.PREFERENCE_CASE_INFO_TAB,
    path: 'nav-sub-tab-preference-court-order-tab',
    fullPath: PREFERENCE_CASE_TAB_ROUTES.PREFERENCE_COURT_ORDER_TAB,
  },
  {
    index: 4,
    label: 'LAWSUIT.TAB_PREFERENCE_AUCTION_LED_CARD',
    prefix: LAWSUIT_DETAIL_ROUTES.PREFERENCE_CASE_INFO_TAB,
    path: 'nav-sub-tab-preference-auction-led-card-tab',
    fullPath: PREFERENCE_CASE_TAB_ROUTES.PREFERENCE_AUCTION_LED_CARD_TAB,
  },
  {
    index: 5,
    label: 'LAWSUIT.TAB_PREFERENCE_DOCUMENT_LED',
    prefix: LAWSUIT_DETAIL_ROUTES.PREFERENCE_CASE_INFO_TAB,
    path: 'nav-sub-tab-preference-document-preparation-tab',
    fullPath: PREFERENCE_CASE_TAB_ROUTES.PREFERENCE_DOCUMENT_PREPARATION_TAB,
  },
];

export const EXECUTION_TABS_INFO: ITabNav[] = [
  {
    index: 0,
    label: 'เตรียมการ',
    prefix: CIVIL_CASE_TAB_ROUTES.EXECUTION_INFO_TAB,
    path: 'nav-under-sub-tab-prepare-info-tab',
    fullPath: EXECUTION_INFO_TAB_ROUTES.PREPARE_INFO_TAB,
  },
  {
    index: 1,
    label: 'ออกหมายบังคับคดี',
    prefix: CIVIL_CASE_TAB_ROUTES.EXECUTION_INFO_TAB,
    path: 'nav-under-sub-tab-warrant-info-tab',
    fullPath: EXECUTION_INFO_TAB_ROUTES.WARRANT_INFO_TAB,
  },
];

export const SEIZURE_PROPERTY_TABS_INFO: ITabNav[] = [
  {
    index: 0,
    label: 'สั่งการ',
    prefix: CIVIL_CASE_TAB_ROUTES.SEIZURE_PROPERTY_INFO_TAB,
    path: 'nav-under-sub-tab-order-info-tab',
    fullPath: SEIZURE_PROPERTY_INFO_TAB_ROUTES.ORDER_INFO_TAB,
  },
  {
    index: 1,
    label: 'ดำเนินการ',
    prefix: CIVIL_CASE_TAB_ROUTES.SEIZURE_PROPERTY_INFO_TAB,
    path: 'nav-under-sub-tab-processing-info-tab',
    fullPath: SEIZURE_PROPERTY_INFO_TAB_ROUTES.PROCESSING_INFO_TAB,
  },
];

export const EXTERNAL_DOC_TABS_INFO: ITabNav[] = [
  // {
  //   index: 0, label: 'หมายจากโจทก์นอก',
  //   prefix: '', path: '', fullPath: ''
  // },
  // {
  //   index: 1, label: 'ประกาศจากกรมบังคับคดี (โจทก์นอก)',
  //   prefix: '', path: '', fullPath: ''
  // },
  {
    index: 2,
    label: 'ประกาศขายทอดตลาดจากกรมบังคับคดี',
    prefix: EXTERNAL_DOC_ROUTES.MAIN,
    path: 'annoucement-ktb',
    fullPath: EXTERNAL_DOC_DETAIL_ROUTES.KTB_INFO_TAB,
  },
];
