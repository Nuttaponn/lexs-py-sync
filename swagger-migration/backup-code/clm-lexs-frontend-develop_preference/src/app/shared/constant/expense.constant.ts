import { taskCode } from '../models/task.model';

export const ExpenseEditApproveTaskCode: taskCode[] = [
  'EXPENSE_CLAIM_PAYMENT_APPROVAL',
  'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL',
  'EXPENSE_CLAIM_RECEIPT_UPLOAD',
  'EXPENSE_CLAIM_VERIFICATION',
  'EXPENSE_CLAIM_CORRECTION',
  'EXPENSE_CLAIM_RECIEVE_ORIGINAL_DOCUMENT',
  'CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION',
  'EXPENSE_CLAIM_SYSTEM_PAYMENT',
  'REVERSE_EXPENSE_CLAIM_INVALID_RECEIPT',
  'REVERSE_EXPENSE_CLAIM_OTHER',
  'DECIDE_REVERSE_EXPENSE_CLAIM',
  'AUTO_CREATE_EXPENSE_CLAIM',
];

export const TaskCodeExpensePaymentDetail: taskCode[] = [
  'CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION',
  'EXPENSE_CLAIM_PAYMENT_APPROVAL',
  'EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL',
  'EXPENSE_CLAIM_RECEIPT_UPLOAD',
  'EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD',
];
