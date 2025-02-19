// For map with value of each permsision at the Back-end system
// TODO: Change value to be the correct value
export const LexsUserPermissionCodes = {
  DASHBOARD_CUSTOMERS_DPD_DOC_STATUS: 'VIEW_CUSTOMER',
  DASHBOARD_CUSTOMERS_LIGITATION_STATUS: 'VIEW_LITIGATION_CUSTOMER',
  DASHBOARD_NOTICES_RECIPIENT_TYPE: 'VIEW_NOTICE_RECEIVER',
  DASHBOARD_LAWSUIT_COURT_PROCEEDING: 'VIEW_LITIGATION_CASE',
  DASHBOARD_HOLDING_LITIGATION_CASE: 'VIEW_HOLDING_LITIGATION_CASE',
  DASHBOARD_KLAW_FINANCIAL: 'VIEW_KLAW_FINANCIAL',
  DASHBOARD_COURT_RECEIVABLES: 'VIEW_COURT_FEE',
  DASHBOARD_CUSTOMERS_DOC_UPLOAD: 'DASHBOARD_CUSTOMERS_DOC_UPLOAD',
  VIEW_DEFERMENT_EXECUTION: 'VIEW_DEFERMENT_EXECUTION',
  VIEW_COLLATERAL_LEXS_STATUS: 'VIEW_COLLATERAL_LEXS_STATUS',
  VIEW_ACCOUNT_DOCUMENT_STATUS: 'VIEW_ACCOUNT_DOCUMENT_STATUS',
  TASK_TRANSFER: 'TRANSFER_TASK',
  UPDATE_DOPA: 'UPDATE_DOPA',
  ALL_PREFERENCE: 'ALL_PREFERENCE',
  CUSTOMERS_VIEW: 'CUSTOMERS_VIEW',
  CUSTOMERS_ADD_STAKEHOLDER: 'CREATE_LITIGATION_CUSTOMER',
  CUSTOMERS_VERIFY_ORIGINAL_DOCS: 'VERIFY_DOCUMENT',
  CUSTOMERS_UPLOAD_DOCS: 'UPLOAD_CUSTOMER_DOCUMENT',
  CUSTOMERS_INFORM_NAME_CHANGE: 'CREATE_NAME_CHANGE_NOTICE',
  CUSTOMERS_START_LITIGATION_PROCESS: 'START_LITIGATION_CASE',
  LAWSUIT_VIEW: 'LAWSUIT_VIEW',
  LAWSUIT_ASSIGN_CASE: 'CREATE_LEGAL_ASSIGNMENT',
  LAWSUIT_MERGE_ID: 'CREATE_LAWSUIT',
  LAWSUIT_CREATE_CASE: 'CREATE_LITIGATION_CASE',
  LAWSUIT_CREATE_NOTICE: 'CREATE_NOTICE_EVENT',
  LAWSUIT_ADD_STAKEHOLDER: 'ADD_LEGAL_RELATED_PERSON',
  LAWSUIT_ADD_SUB_ACCOUNT: 'ADD_SUB_ACCOUNT',
  LAWSUIT_VERIFY_ORIGINAL_DOCS: 'VERIFY_LEGAL_DOCUMENT',
  LAWSUIT_UPLOAD_DOCS: 'UPLOAD_LEGAL_DOCUMENT',
  LAWSUIT_RECORD_INDICTMENT: 'CREATE_INDICTMENT_RECORD',
  LAWSUIT_CREATE_DRAFT_INDICTMENT: 'LAWSUIT_CREATE_DRAFT_INDICTMENT',
  LAWSUIT_GIVE_OPINION_TO_LAWYER: 'CREATE_LEGAL_COMMENT',
  LAWSUIT_APPROVE_APPEAL: 'APPEAL_APPROVAL',
  LAWSUIT_ISSUE_DECREE: 'CREATE_DECREE',
  CUSTOMERS_ADD_SUB_ACCOUNT_SENTENCE: 'ADD_SUB_ACCOUNT_SENTENCE',
  LAWSUIT_CLOSE_LEGAL_ID: 'CLOSE_LEGAL_ID',
  LAWSUIT_SAVE_FOLLOW_STATUS: 'SAVE_FOLLOW_STATUS',
  FINANCE_VIEW: 'FINANCE_VIEW',
  FINANCE_EXPENSE_CREATE_PAYMENT_BOOK: 'CREATE_PAYMENT_DOCUMENT',
  FINANCE_EXPENSE_VERIFY_WITHDRAWAL: 'VERIFY_EXPENSE',
  FINANCE_EXPENSE_RECORD_RECEIPT_PAYMENT_DOC: 'CREATE_PAYMENT_RECORD',
  FINANCE_EXPENSE_CONSIDER_PAY: 'VERIFY_PAYMENT',
  FINANCE_EXPENSE_APPROVE_PAY: 'PAYMENT_APPROVAL',
  FINANCE_EXPENSE_VERIFY_RECEIPT: 'VERIFY_FINANCIAL_DOCUMENT',
  FINANCE_EXPENSE_UPLOAD_RECEIPT: 'UPLOAD_FINANCIAL_DOCUMENT',
  FINANCE_EXPENSE_DOWNLOAD_WHT: 'DOWNLOAD_TAX_DOCUMENT',
  FINANCE_EXPENSE_TRANSFER_TASK: 'FINANCIAL_TRANSFER',
  FINANCE_RECEIPT_CREATE_RECEIPT: 'CREATE_RECEIPT',
  FINANCE_RECEIPT_VERIFY_RECEIPT: 'VERIFY_RECEIPT',
  FINANCE_ADVANCE_CREATE_TRANSACTION: 'FINANCIAL_ADVANCE_TRANSFER',
  FINANCE_ADVANCE_VERIFY_TRANSACTION: 'VERIFY_ADVANCE_TRANSFER',
  VIEW_SLA_REPORT: 'VIEW_SLA_REPORT',
  ALL_CUSTOMER_ACTION: 'ALL_CUSTOMER_ACTION',
  ALL_LEGAL_ACTION: 'ALL_LEGAL_ACTION',
  ALL_EXPENSE: 'ALL_EXPENSE',
  ALL_RECEIVE: 'ALL_RECEIVE',
  ALL_ADVANCE_RECEIVE: 'ALL_ADVANCE_RECEIVE',
  ALL_REPORT: 'ALL_REPORT',
  ALL_UAM: 'ALL_UAM',
  ALL_CONFIG: 'ALL_CONFIG',
  ALL_TASK_ACTION: 'ALL_TASK_ACTION',
  MANAGE_CONFIG: 'MANAGE_CONFIG',
  MANAGE_USER: 'MANAGE_USER',
  LAWSUIT_ADD_RELATED_PERSON_AFTER_UNDICIDED_CASE: 'ADD_RELATED_PERSON_AFTER_UNDICIDED_CASE',
  LAWSUIT_UPDATE_LITIGATION_INFO: 'UPDATE_LITIGATION_INFO',
  LAWSUIT_ADD_COURT_PROCESSDINGS_APPOINTMENT: 'ADD_COURT_PROCESSDINGS_APPOINTMENT',
  LAWSUIT_DELETE_LITIGATION_ACCOUNT: 'DELETE_LITIGATION_ACCOUNT',
  LAWSUIT_UPLOAD_DOCUMENT_NOTICE_CLOSED_JURISTIC: 'UPLOAD_DOCUMENT_NOTICE_CLOSED_JURISTIC',
  LAWSUIT_VIEW_DOCUMENT_FROM_PROFILE_DIRECT_AND_STATEMENT: 'VIEW_DOCUMENT_FROM_PROFILE_DIRECT_AND_STATEMENT',
  FINANCE_EXPENSE_DELETE_UPLOAD_DOCUMENT: 'DELETE_UPLOAD_DOCUMENT',
  ALL_COMMON_ACTION: 'ALL_COMMON_ACTION',
  COMMON_CALENDAR_ACTIVITIES: 'ALL_CALENDAR_ACTIVITIES',
  CUSTOMERS_UPDATE_CUSTOMER_REALTIME: 'UPDATE_CUSTOMER_REALTIME',
  CUSTOMERS_UPDATE_COLLATERAL_REALTIME: 'UPDATE_COLLATERAL_REALTIME',
  DOWNLOAD_CREDIT_NOTE: 'DOWNLOAD_CREDIT_NOTE',
  WITHHOLDING_TAX_REPORT: 'WITHHOLDING_TAX_REPORT',
  SUBMIT_DEBT_LEGAL_ENFORCEMENT: 'SUBMIT_DEBT_LEGAL_ENFORCEMENT',
  DEBT_ENFORCEMENT_ASSIGNMENT: 'DEBT_ENFORCEMENT_ASSIGNMENT',
  SUBMIT_ENFORCEMENT_RESULT: 'SUBMIT_ENFORCEMENT_RESULT',
  ALL_WARRANT: 'ALL_WARRANT',
  ASSET_SEIZURE_PREP: 'ASSET_SEIZURE_PREP',
  ASSIGN_LAWYER_ASSET_SEIZURE: 'ASSIGN_LAWYER_ASSET_SEIZURE',
  DOCUMENT_INSPECTION_ASSET_SEIZURE: 'DOCUMENT_INSPECTION_ASSET_SEIZURE',
  RECORD_SEIZURE_RESULT: 'RECORD_SEIZURE_RESULT',
  ALL_ASSET_SEIZURE: 'ALL_ASSET_SEIZURE',
  CANCEL_ASSET_SEIZURE: 'CANCEL_ASSET_SEIZURE',
  CONFIRM_CANCEL_ASSET_SEIZURE: 'CONFIRM_CANCEL_ASSET_SEIZURE',
  RETURN_ORIGINAL_DOCUMENTS: 'RETURN_ORIGINAL_DOCUMENTS',
  ALL_CANCEL_ASSET_SEIZURE: 'ALL_CANCEL_ASSET_SEIZURE',
  WITHDRAW_ASSET_SEIZURE: 'WITHDRAW_ASSET_SEIZURE',
  EDIT_WITHDRAW_ASSET_SEIZURE: 'EDIT_WITHDRAW_ASSET_SEIZURE',
  APPROVE_WITHDRAW_ASSET_SEIZURE: 'APPROVE_WITHDRAW_ASSET_SEIZURE',
  VERIFY_DOC_WITHDRAW_SEIZURE: 'VERIFY_DOC_WITHDRAW_SEIZURE',
  ASSIGN_WITHDRAW_SEIZURE: 'ASSIGN_WITHDRAW_SEIZURE',
  SAVE_RESULT_WITHDRAW_SEIZURE: 'SAVE_RESULT_WITHDRAW_SEIZURE',
  ALL_WITHDRAW_ASSET_SEIZURE: 'ALL_WITHDRAW_ASSET_SEIZURE',
  WITHDRAW_EXECUTION: 'WITHDRAW_EXECUTION',
  EDIT_WITHDRAW_EXECUTION: 'EDIT_WITHDRAW_EXECUTION',
  APPROVE_WITHDRAW_EXECUTION: 'APPROVE_WITHDRAW_EXECUTION',
  VERIFY_DOC_WITHDRAW_EXECUTION: 'VERIFY_DOC_WITHDRAW_EXECUTION',
  ASSIGN_WITHDRAW_EXECUTION: 'ASSIGN_WITHDRAW_EXECUTION',
  SAVE_WITHDRAW_EXECUTION: 'SAVE_WITHDRAW_EXECUTION',
  ALL_WITHDRAW_EXECUTION: 'ALL_WITHDRAW_EXECUTION',
  SUBMIT_DELAY_EXECUTION: 'SUBMIT_DELAY_EXECUTION',
  APPROVE_DELAY_EXECUTION: 'APPROVE_DELAY_EXECUTION',
  EXTEND_DELAY_EXECUTION: 'EXTEND_DELAY_EXECUTION',
  EDIT_DELAY_EXECUTION: 'EDIT_DELAY_EXECUTION',
  CANCEL_DELAY_EXECUTION: 'CANCEL_DELAY_EXECUTION',
  ALL_DELAY_EXECUTION: 'ALL_DELAY_EXECUTION',
  ASSIGN_TASK_POOL: 'ASSIGN_TASK_POOL',
  ALL_TASK_POOL_ASSIGNMENT: 'ALL_TASK_POOL_ASSIGNMENT',
  ALL_EXTERNAL_DOCUMENTS: 'ALL_EXTERNAL_DOCUMENTS',
  ASSIGN_AUCTION: 'ASSIGN_AUCTION',
  SUBMIT_AUCTION_EXPENSE: 'SUBMIT_AUCTION_EXPENSE',
  MATCH_ASSET_AUCTION: 'MATCH_ASSET_AUCTION',
  AUCTION_ANNOUNCE_INACTIVE: 'AUCTION_ANNOUNCE_INACTIVE',
  SUBMIT_AUCTION_CHECK_INFO: 'SUBMIT_AUCTION_CHECK_INFO',
  VERIFY_AUCTION_CHECK_INFO: 'VERIFY_AUCTION_CHECK_INFO',
  APPROVE_AUCTION_CHECK_INFO: 'APPROVE_AUCTION_CHECK_INFO',
  SUBMIT_AUCTION_DAY_RESULT: 'SUBMIT_AUCTION_DAY_RESULT',
  SUBMIT_AUCTION_CHECK_STAMP_DUTY: 'SUBMIT_AUCTION_CHECK_STAMP_DUTY',
  VERIFY_AUCTION_CHECK_STAMP_DUTY: 'VERIFY_AUCTION_CHECK_STAMP_DUTY',
  APPROVE_AUCTION_CHECK_STAMP_DUTY: 'APPROVE_AUCTION_CHECK_STAMP_DUTY',
  TRACK_PAYMENT_RECORD: 'TRACK_PAYMENT_RECORD',
  ALL_AUCTION_EXCEPT_MATCH: 'ALL_AUCTION_EXCEPT_MATCH',
  ALL_AUCTION_ONLY_MATCH: 'ALL_AUCTION_ONLY_MATCH',
  SUBMIT_ADDITION_DEPOSIT_CHECK: 'SUBMIT_ADDITION_DEPOSIT_CHECK',
  VERIFY_ADDITION_DEPOSIT_CHECK: 'VERIFY_ADDITION_DEPOSIT_CHECK',
  APPROVE_ADDITION_DEPOSIT_CHECK: 'APPROVE_ADDITION_DEPOSIT_CHECK',
  ACQUIRED_ASSET_DOCUMENT_UPLOAD: 'ACQUIRED_ASSET_DOCUMENT_UPLOAD',
  ASSET_TRANSFER_APPOINTMENT: 'ASSET_TRANSFER_APPOINTMENT',
  SUBMIT_CHECK_ASSET_TRANSFER: 'SUBMIT_CHECK_ASSET_TRANSFER',
  APPROVE_CHECK_ASSET_TRANSFER: 'APPROVE_CHECK_ASSET_TRANSFER',
  SUBMIT_DEBT_PAYMENT_REDUCTION: 'SUBMIT_DEBT_PAYMENT_REDUCTION',
  APPROVE_DEBT_PAYMENT_REDUCTION: 'APPROVE_DEBT_PAYMENT_REDUCTION',
  SUBMIT_ACCOUNT_AUDIT_CERTIFICATION: 'SUBMIT_ACCOUNT_AUDIT_CERTIFICATION',
  APPROVE_ACCOUNT_AUDIT_CERTIFICATION: 'APPROVE_ACCOUNT_AUDIT_CERTIFICATION',
  ALL_TRANSFER_ASSSET: 'ALL_TRANSFER_ASSSET',
  ORDER_INVESTIGATION_ASSET: 'ORDER_INVESTIGATION_ASSET',
  ALL_INVESTIGATION_ASSET: 'ALL_INVESTIGATION_ASSET',
  APPROVE_AUCTION_CASHIER_CHEQUE_EXPENSE: 'APPROVE_AUCTION_CASHIER_CHEQUE_EXPENSE',
  VERIFY_AUCTION_CASHIER_CHEQUE_EXPENSE: 'VERIFY_AUCTION_CASHIER_CHEQUE_EXPENSE',
  SUBMIT_AUCTION_CASHIER_CHEQUE_EXPENSE: 'SUBMIT_AUCTION_CASHIER_CHEQUE_EXPENSE',
  DOWNLOAD_EXPENSE_DOCUMENT: 'DOWNLOAD_EXPENSE_DOCUMENT',
};
