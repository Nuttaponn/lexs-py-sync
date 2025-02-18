export const ROOT_ROUTES = {
  LOGIN: '/login',
  MAIN: '/main',
};

export const MENU_ROUTE_PATH = {
  DASHBOARD: '/main/dashboard',
  LANDING: '/main/landing',
  TASK_POOL: '/main/task/pool',
  TASK: '/main/task',
  LAWSUIT: '/main/lawsuit',
  CUSTOMER: '/main/customer',
  FINANCE_MAIN: '/main/finance',
  FINANCE_EXPENSE: '/main/finance/expense',
  FINANCE_RECEIPT: '/main/finance/receipt',
  FINANCE_ADVANCE: '/main/finance/advance',
  REPORT: '/main/report',
  DOPA: '/main/dopa',
  USER: '/main/user',
  CONFIG: '/main/config',
  EXTERNAL_DOCUMENTS: '/main/external-documents/annoucement-ktb',
  PREFERENCE: '/main/preference',
};

export const MAIN_ROUTES = {
  MAIN: `${ROOT_ROUTES.MAIN}`,
  LANDING: `${ROOT_ROUTES.MAIN}/landing`,
  USER: `${ROOT_ROUTES.MAIN}/user`,
  CONFIG: `${ROOT_ROUTES.MAIN}/config`,
  CUSTOMER: `${ROOT_ROUTES.MAIN}/customer`,
  LAWSUIT: `${ROOT_ROUTES.MAIN}/lawsuit`,
  TASK: `${ROOT_ROUTES.MAIN}/task`,
  TASK_POOL: `${ROOT_ROUTES.MAIN}/task/pool`,
  FINANCE: `${ROOT_ROUTES.MAIN}/finance`,
  REPORT: `${ROOT_ROUTES.MAIN}/report`,
  DOPA: `${ROOT_ROUTES.MAIN}/dopa`,
  EXTERNAL_DOCUMENTS: `${ROOT_ROUTES.MAIN}/external-documents`,
  PREFERENCE: `${ROOT_ROUTES.MAIN}/preference`,
};

export const CUSTOMER_ROUTES = {
  MAIN: `${MAIN_ROUTES.CUSTOMER}`,
  DETAIL: `${MAIN_ROUTES.CUSTOMER}/detail`,
};

export const LAWSUIT_ROUTES = {
  MAIN: `${MAIN_ROUTES.LAWSUIT}`,
  DETAIL: `${MAIN_ROUTES.LAWSUIT}/detail`,
  EXECUTION_WARRANT: `${MAIN_ROUTES.LAWSUIT}/execution-warrant`,
  SEIZURE_PROPERTY: `${MAIN_ROUTES.LAWSUIT}/seizure-property`,
  COMMAND: `${MAIN_ROUTES.LAWSUIT}/seizure-property/command`,
  NON_PLEDGE: `${MAIN_ROUTES.LAWSUIT}/seizure-property/non-pledge`,
  WITHDRAWN_SEIZURE_PROPERTY: `${MAIN_ROUTES.LAWSUIT}/withdrawn-seizure-property`,
  INVESTIGATES_PROPERTY: `${MAIN_ROUTES.LAWSUIT}/investigate-property`,
};

export const FINANCE_ROUTES = {
  MAIN: `${MAIN_ROUTES.FINANCE}`,
  EXPENSE: `${MAIN_ROUTES.FINANCE}/expense`,
  EXPENSE_DETAIL: `${MAIN_ROUTES.FINANCE}/expense/detail`,
  RECEIPT: `${MAIN_ROUTES.FINANCE}/receipt`,
  RECEIPT_DETAIL: `${MAIN_ROUTES.FINANCE}/receipt/detail`,
};

export const FINANCE_EXPENSE_ROUTES = {
  MAIN: `${MENU_ROUTE_PATH.FINANCE_EXPENSE}`,
  DETAIL: `${MENU_ROUTE_PATH.FINANCE_EXPENSE}/detail`,
};

export const FINANCE_RECEIPT_ROUTES = {
  MAIN: `${MENU_ROUTE_PATH.FINANCE_RECEIPT}`,
  DETAIL: `${MENU_ROUTE_PATH.FINANCE_RECEIPT}/detail`,
  KCORP_DETAIL: `${MENU_ROUTE_PATH.FINANCE_RECEIPT}/kcorp-detail`,
  REFERENCE_NO: `${MENU_ROUTE_PATH.FINANCE_RECEIPT}/reference-no`,
};

export const TASK_ROUTES = {
  MAIN: `${MAIN_ROUTES.TASK}`,
  DETAIL: `${MAIN_ROUTES.TASK}/detail`,
  EXECUTION_WARRANT: `${MAIN_ROUTES.TASK}/execution-warrant`,
  SEIZURE_PROPERTY: `${MAIN_ROUTES.TASK}/seizure-property`,
  WITHDRAWN_SEIZURE_PROPERTY: `${MAIN_ROUTES.TASK}/withdrawn-seizure-property`,
  WITHDRAWN_WRIT_OF_EXECUTION: `${MAIN_ROUTES.TASK}/withdrawn-writ-execution`,
  COMMAND: `${MAIN_ROUTES.TASK}/seizure-property/command`,
  NON_PLEDGE: `${MAIN_ROUTES.TASK}/seizure-property/non-pledge`,
  PUBLIC_AUCTION: `${MAIN_ROUTES.TASK}/auction`,
  PUBLIC_AUCTION_OWNER_TRNASFER: `${MAIN_ROUTES.TASK}/auction/owner-transfer`,
  INVESTIGATES_PROPERTY: `${MAIN_ROUTES.TASK}/investigate-property`,
  PUBLIC_AUCTION_ADVANCE_PAYMENT: `${MAIN_ROUTES.TASK}/auction/auction-advance-payment`,
  SEIZURE_UPLOAD_RECEIPT: `${MAIN_ROUTES.TASK}/seizure-property/upload-receipt`,
  PREFERENCE: `${MAIN_ROUTES.TASK}/preference-detail`,
};

export const CUSTOMER_DETAIL_ROUTES = {
  MAIN: `${CUSTOMER_ROUTES.DETAIL}`,
  ACCOUNT_DETAIL: `${CUSTOMER_ROUTES.DETAIL}/account-detail`,
  /**
   * CUSTOMER_TAB_ROUTES
   **/
  DEBT_RELATED_INFO_TAB: `${CUSTOMER_ROUTES.DETAIL}/nav-tab-debt-related-info-tab`,
  ACCOUNT_INFO_TAB: `${CUSTOMER_ROUTES.DETAIL}/nav-tab-account-info-tab`,
  COLLATERAL_INFO_TAB: `${CUSTOMER_ROUTES.DETAIL}/nav-tab-collateral-info-tab`,
  DOCUMENT_CHECKLIST_INFO_TAB: `${CUSTOMER_ROUTES.DETAIL}/nav-tab-document-checklist-info-tab`,
  CASE_INFO_TAB: `${CUSTOMER_ROUTES.DETAIL}/nav-tab-case-info-tab`,
  AUDIT_LOG_INFO_TAB: `${CUSTOMER_ROUTES.DETAIL}/nav-tab-audit-log-info-tab`,
};

export const LAWSUIT_DETAIL_ROUTES = {
  MAIN: `${LAWSUIT_ROUTES.DETAIL}`,
  ACCOUNT_DETAIL: `${LAWSUIT_ROUTES.DETAIL}/account-detail`,
  ADD_RELATED_PERSON_LEGAL: `${LAWSUIT_ROUTES.DETAIL}/add-related-person-legal`,
  /**
   * LAWSUIT_TAB_ROUTES
   **/
  LITIGATION_SUMMARY_INFO_TAB: `${LAWSUIT_ROUTES.DETAIL}/nav-tab-litigation-summary-info-tab`,
  LITIGATION_PROCESS_INFO_TAB: `${LAWSUIT_ROUTES.DETAIL}/nav-tab-litigation-process-info-tab`,
  CIVIL_CASE_INFO_TAB: `${LAWSUIT_ROUTES.DETAIL}/nav-tab-civil-case-info-tab`,
  PREFERENCE_CASE_INFO_TAB: `${LAWSUIT_ROUTES.DETAIL}/nav-tab-preference-case-info-tab`,
  MEMO_INFO_TAB: `${LAWSUIT_ROUTES.DETAIL}/nav-tab-memo-info-tab`,
  AUDIT_LOG_INFO_TAB: `${LAWSUIT_ROUTES.DETAIL}/nav-tab-audit-log-info-tab`,
  INVESTIGATES_PROPERTY_INFO_TAB: `${LAWSUIT_ROUTES.DETAIL}/nav-tab-investigate-property-info-tab`,
};

/** ROUTES For ข้อมูลสำหรับดำเนินคดี tab **/
export const LITIGATION_PROCESS_INFO_TAB_ROUTES = {
  DEBT_RELATED_INFO_TAB: `${LAWSUIT_DETAIL_ROUTES.LITIGATION_PROCESS_INFO_TAB}/nav-sub-tab-debt-related-info-tab`,
  ACCOUNT_AND_DEBT_INFO_TAB: `${LAWSUIT_DETAIL_ROUTES.LITIGATION_PROCESS_INFO_TAB}/nav-sub-tab-account-and-debt-info-tab`,
  COLLATERAL_INFO_TAB: `${LAWSUIT_DETAIL_ROUTES.LITIGATION_PROCESS_INFO_TAB}/nav-sub-tab-collateral-info-tab`,
};

/** ROUTES For คดีแพ่ง tab **/
export const CIVIL_CASE_TAB_ROUTES = {
  PREPARE_LAWSUIT_INFO_TAB: `${LAWSUIT_DETAIL_ROUTES.CIVIL_CASE_INFO_TAB}/nav-sub-tab-prepare-lawsuit-info-tab`,
  SUE_INFO_TAB: `${LAWSUIT_DETAIL_ROUTES.CIVIL_CASE_INFO_TAB}/nav-sub-tab-sue-info-tab`,
  TRIAL_INFO_TAB: `${LAWSUIT_DETAIL_ROUTES.CIVIL_CASE_INFO_TAB}/nav-sub-tab-trial-info-tab`,
  JUDGE_INFO_TAB: `${LAWSUIT_DETAIL_ROUTES.CIVIL_CASE_INFO_TAB}/nav-sub-tab-judge-info-tab`,
  EXECUTION_INFO_TAB: `${LAWSUIT_DETAIL_ROUTES.CIVIL_CASE_INFO_TAB}/nav-sub-tab-execution-info-tab`,
  SEIZURE_PROPERTY_INFO_TAB: `${LAWSUIT_DETAIL_ROUTES.CIVIL_CASE_INFO_TAB}/nav-sub-tab-seizure-property-info-tab`,
  AUCTION_LED_CARD_INFO_TAB: `${LAWSUIT_DETAIL_ROUTES.CIVIL_CASE_INFO_TAB}/nav-sub-tab-auction-led-card-info-tab`,
};

/** ROUTES For คดีบุริมสิทธิ tab **/
export const PREFERENCE_CASE_TAB_ROUTES = {
  PREFERENCE_INFO_TAB: `${LAWSUIT_DETAIL_ROUTES.PREFERENCE_CASE_INFO_TAB}/nav-sub-tab-preference-info-tab`,
  PREFERENCE_COMPLAINT_TAB: `${LAWSUIT_DETAIL_ROUTES.PREFERENCE_CASE_INFO_TAB}/nav-sub-tab-preference-complaint-tab`,
  PREFERENCE_JUDGE_TAB: `${LAWSUIT_DETAIL_ROUTES.PREFERENCE_CASE_INFO_TAB}/nav-sub-tab-preference-judge-tab`,
  PREFERENCE_COURT_ORDER_TAB: `${LAWSUIT_DETAIL_ROUTES.PREFERENCE_CASE_INFO_TAB}/nav-sub-tab-preference-court-order-tab`,
  PREFERENCE_AUCTION_LED_CARD_TAB: `${LAWSUIT_DETAIL_ROUTES.PREFERENCE_CASE_INFO_TAB}/nav-sub-tab-preference-auction-led-card-tab`,
  PREFERENCE_DOCUMENT_PREPARATION_TAB: `${LAWSUIT_DETAIL_ROUTES.PREFERENCE_CASE_INFO_TAB}/nav-sub-tab-preference-document-preparation-tab`,
};

export const PREPARE_LAWSUIT_INFO_TAB_ROUTES = {
  DOCUMENT_PREPARATION_INFO_TAB: `${CIVIL_CASE_TAB_ROUTES.PREPARE_LAWSUIT_INFO_TAB}/nav-under-sub-tab-document-preparation-info-tab`,
  NOTICE_INFO_TAB: `${CIVIL_CASE_TAB_ROUTES.PREPARE_LAWSUIT_INFO_TAB}/nav-under-sub-tab-notice-info-tab`,
};

/** ROUTES For หมายบังคับคดี tab **/
export const EXECUTION_INFO_TAB_ROUTES = {
  PREPARE_INFO_TAB: `${CIVIL_CASE_TAB_ROUTES.EXECUTION_INFO_TAB}/nav-under-sub-tab-prepare-info-tab`,
  WARRANT_INFO_TAB: `${CIVIL_CASE_TAB_ROUTES.EXECUTION_INFO_TAB}/nav-under-sub-tab-warrant-info-tab`,
};

/** ROUTES For ยึดทรัพย์ tab **/
export const SEIZURE_PROPERTY_INFO_TAB_ROUTES = {
  ORDER_INFO_TAB: `${CIVIL_CASE_TAB_ROUTES.SEIZURE_PROPERTY_INFO_TAB}/nav-under-sub-tab-order-info-tab`,
  PROCESSING_INFO_TAB: `${CIVIL_CASE_TAB_ROUTES.SEIZURE_PROPERTY_INFO_TAB}/nav-under-sub-tab-processing-info-tab`,
};

/** ROUTES tab For Screen
 *  คำนวนภาระหนี้ /
 *  รายละเอียดคำนวนภาระหนี้ /
 *  งานมอบหมายทนายเพื่อออกหมายบังคับคดี /
 *  ดำเนินการออกหมายบังคับคดี
 **/
export const EXECUTION_WARRANT_LITIGATION_INFO_TAB_ROUTES = {
  CASE_INFO_TAB: `${LAWSUIT_ROUTES.EXECUTION_WARRANT}/case-info-tab`,
  DOCUMENT_INFO_TAB: `${LAWSUIT_ROUTES.EXECUTION_WARRANT}/document-info-tab`,
};
export const EXECUTION_WARRANT_TASK_INFO_TAB_ROUTES = {
  CASE_INFO_TAB: `${TASK_ROUTES.EXECUTION_WARRANT}/case-info-tab`,
  DOCUMENT_INFO_TAB: `${TASK_ROUTES.EXECUTION_WARRANT}/document-info-tab`,
};

export const EXTERNAL_DOC_ROUTES = {
  MAIN: `${MAIN_ROUTES.EXTERNAL_DOCUMENTS}`,
};

export const EXTERNAL_DOC_DETAIL_ROUTES = {
  KTB_INFO_TAB: `${EXTERNAL_DOC_ROUTES.MAIN}/annoucement-ktb`,
};

/**
 * level 1 : nav-tab-xxx-info-tab
 * level 2 : nav-sub-tab-xxx-info-tab
 * level 3 : nav-under-sub-tab-xxx-info-tab
 */
export const EXCEPT_PATH = [
  // MAIN
  MAIN_ROUTES.MAIN,
  MAIN_ROUTES.LANDING,
  MAIN_ROUTES.USER,
  MAIN_ROUTES.CONFIG,
  MAIN_ROUTES.CUSTOMER,
  MAIN_ROUTES.LAWSUIT,
  MAIN_ROUTES.TASK,
  MAIN_ROUTES.FINANCE,
  MAIN_ROUTES.REPORT,
  MAIN_ROUTES.DOPA,
  // CUSTOMER DETAIL
  `${CUSTOMER_ROUTES.DETAIL}`,
  // CUSTOMER DETAIL > XXX
  `${CUSTOMER_ROUTES.DETAIL}/account-detail`,
  // LAWSUIT DETAIL > XXX
  `${LAWSUIT_ROUTES.DETAIL}/account-detail`,
  `${LAWSUIT_ROUTES.DETAIL}/add-related-person-legal`,
  `${LAWSUIT_ROUTES.DETAIL}/nav-tab-litigation-summary-info-tab`,
  `${LAWSUIT_ROUTES.DETAIL}/nav-tab-civil-case-info-tab/seizure-property-info-tab/order-info-tab`,
  // LAWSUIT > WITHDRAWN SEIZURE_PROPERTY
  `${LAWSUIT_ROUTES.WITHDRAWN_SEIZURE_PROPERTY}/withdrawn-info-step`,
  `${LAWSUIT_ROUTES.WITHDRAWN_SEIZURE_PROPERTY}/assets-contacts-info-step`,
  `${LAWSUIT_ROUTES.WITHDRAWN_SEIZURE_PROPERTY}/create-property-group`,
  `${LAWSUIT_ROUTES.WITHDRAWN_SEIZURE_PROPERTY}/legal-execution-office-info-step`,
  // TASK > WITHDRAWN SEIZURE_PROPERTY
  `${TASK_ROUTES.WITHDRAWN_SEIZURE_PROPERTY}/withdrawn-info-step`,
  `${TASK_ROUTES.WITHDRAWN_SEIZURE_PROPERTY}/assets-contacts-info-step`,
  `${TASK_ROUTES.WITHDRAWN_SEIZURE_PROPERTY}/create-property-group`,
  `${TASK_ROUTES.WITHDRAWN_SEIZURE_PROPERTY}/legal-execution-office-info-step`,
  // PUBLIC AUCTION
  `${TASK_ROUTES.MAIN}/auction`,
  `${TASK_ROUTES.MAIN}/external-documents/auction/auction-annoucement-detail`,
  `${TASK_ROUTES.MAIN}/lawsuit/auction/auction-advance-payment`,
  `${TASK_ROUTES.MAIN}/external-documents/auction/auction-map-collateral`,
  `${TASK_ROUTES.MAIN}/external-documents/auction`,
  `/main/external-documents/auction/auction-annoucement-detail`,
  `/main/lawsuit/auction`,
  `/main/notification-landing`,
  `/main/task/seizure-property/non-pledge/nav-tab-seizure-list-info-tab`,
  `/main/task/investigate-property/investigate-property-command`,
  `/main/task/seizure-property/non-pledge/non-pledge-properties-document-tab`,
  `/main/task/investigate-property/investigate-property-detail`,
  `/main/lawsuit/seizure-property/non-pledge/non-pledge-properties-document-tab`,
  `/main/lawsuit/investigate-property/investigate-property-detail`,
  `/main/external-documents/auction/auction-manual-announcement`,
  // LAWSUIT DETAIL > PREFERENCE
  `${LAWSUIT_ROUTES.DETAIL}/nav-tab-preference-case-info-tab/nav-sub-tab-preference-auction-led-card-tab`
];
