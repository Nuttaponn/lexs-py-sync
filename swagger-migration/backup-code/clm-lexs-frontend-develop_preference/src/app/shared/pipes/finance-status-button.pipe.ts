import { Pipe, PipeTransform } from '@angular/core';
import { StatusStyle } from '@app/shared/models';

export type financeStatusType =
  | 'EXPENSE_STATUS'
  | 'EXPENSE_BUTTON'
  | 'RECEIPT_STATUS'
  | 'RECEIPT_BUTTON'
  | 'ADVANCE_STATUS';
export const ExpenseStatusVerifyBtn = [
  'PENDING_EXPENSE_CLAIM_VERIFICATION',
  'PENDING_PAYMENT_RECEIPT_APPROVAL',
  'PENDING_PAYMENT_RECEIPT_APPROVAL_AUTO',
  'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL',
  'PAYMENT_FAILED',
  'PENDING_AUTO_PAYMENT_VERIFICATION',
];
export const ExpenseStatusConsiderBtn = [
  'PENDING_CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION',
  'PENDING_PAYMENT_CONSIDERATION',
  'PENDING_PAYMENT_APPROVAL_CONSIDERATION',
  'PENDING_PAYMENT_APPROVAL',
  'PENDING_PAYMENT_CONFIRMATION',
  'PENDING_AUTO_PAYMENT_APPROVAL',
  'PENDING_AUTO_REVERSE_EXPENSE_CLAIM',
  'PENDING_DECIDE_REVERSE_EXPENSE_CLAIM',
  'PENDING_APPROVAL_R2E09-10-02',
  'PENDING_CONSIDER_REFUND',
];
export const ExpenseStatusUploadBtn = [
  'PENDING_PAYMENT_RECEIPT_UPLOAD',
  'PENDING_PAYMENT_RECEIPT_UPDATE',
  'PENDING_AUTO_PAYMENT_RECEIPT_UPLOAD',
  'PENDING_PAYMENT_RECEIPT_UPDATE_AUTO',
  'PENDING_NEWS_RECEIPT_UPLOAD',
];
export const ExpenseStatusEditBtn = ['PENDING_EXPENSE_CLAIM_CORRECTION', 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION'];

@Pipe({
  name: 'financeStatusBtn',
})
export class FinanceStatusButtonPipe implements PipeTransform {
  // Forcing status color display
  private expenseInfoStatus = ['DRAFT', 'CANCELLED'];
  private expenseFailedStatus = ['PENDING_PAYMENT_RECEIPT_UPDATE_AUTO'];
  private expensePendingStatus = ['PENDING_PAYMENT_CONSIDERATION'];

  // Transform text btn by expenseStatus
  private expenseStatusVerifyBtn = ExpenseStatusVerifyBtn;
  private expenseStatusConsiderBtn = ExpenseStatusConsiderBtn;
  private expenseStatusUploadBtn = ExpenseStatusUploadBtn;
  private expenseStatusEditBtn = ExpenseStatusEditBtn;

  transform(value: string, ...args: any[]): string {
    const financeType = args[0] as financeStatusType;
    const paramStatus: string = args[1] || ''; // for expenseInfoStatus
    if (!!!value) {
      return '';
    } else if (financeType === 'EXPENSE_STATUS') {
      if (this.expenseInfoStatus.includes(paramStatus)) {
        return StatusStyle.INFO;
      } else if (this.expenseFailedStatus.includes(paramStatus)) {
        return StatusStyle.FAILED;
      } else if (this.expensePendingStatus.includes(paramStatus)) {
        return StatusStyle.PENDING;
      } else if (paramStatus.startsWith('SUCCESS') || paramStatus.startsWith('CANCELLED')) {
        return StatusStyle.SUCCESS;
      } else {
        switch (value) {
          case 'IN_PROGRESS':
            return StatusStyle.INFO;
          case 'FAILED':
            return StatusStyle.FAILED;
          case 'PENDING_APPROVAL':
            return StatusStyle.NORMAL;
          case 'PENDING':
            return StatusStyle.PENDING;
          case 'FINISHED':
            return StatusStyle.SUCCESS;
          default:
            return StatusStyle.INFO;
        }
      }
    } else if (financeType === 'EXPENSE_BUTTON') {
      if (paramStatus === 'DRAFT') {
        return 'TASK_CODE_BUTTON.DRAFT';
      } else if (paramStatus === 'PENDING_ACCEPT_ORIGINAL_DOCUMENT') {
        return 'TASK_CODE_BUTTON.SAVE';
      } else if (this.expenseStatusVerifyBtn.includes(paramStatus)) {
        return 'TASK_CODE_BUTTON.VERIFY';
      } else if (this.expenseStatusConsiderBtn.includes(paramStatus)) {
        return 'TASK_CODE_BUTTON.CONSIDER';
      } else if (this.expenseStatusUploadBtn.includes(paramStatus)) {
        return 'TASK_CODE_BUTTON.UPLOAD';
      } else if (this.expenseStatusEditBtn.includes(paramStatus)) {
        return 'TASK_CODE_BUTTON.PENDING_EDIT';
      } else {
        return 'COMMON.BUTTON_VIEW_DETAIL';
      }
    } else if (financeType === 'RECEIPT_STATUS' || financeType === 'RECEIPT_BUTTON') {
      switch (value) {
        case 'DRAFT': // ร่าง
          return financeType === 'RECEIPT_BUTTON' ? 'TASK_CODE_BUTTON.SAVEORDER' : StatusStyle.INFO;
        case 'PENDING_APPROVE': // รอตรวจสอบ
          return financeType === 'RECEIPT_BUTTON' ? 'TASK_CODE_BUTTON.PENDING_APPROVE' : StatusStyle.NORMAL;
        case 'PENDING_EDIT': // รอแก้ไข
          return financeType === 'RECEIPT_BUTTON' ? 'TASK_CODE_BUTTON.PENDING_EDIT' : StatusStyle.FAILED;
        case 'PENDING_DOWNLOAD': // รอดาวน์โหลด Credit Note
          return financeType === 'RECEIPT_BUTTON' ? 'TASK_CODE_BUTTON.PENDING_DOWNLOAD' : StatusStyle.PENDING;
        case 'RECORD_NO_SUCCESS': // มีรายการทำไม่สำเร็จ
          return financeType === 'RECEIPT_BUTTON' ? 'TASK_CODE_BUTTON.PENDING_APPROVE' : StatusStyle.FAILED;
        case 'COMPLETED': // เสร็จสิ้น
          return financeType === 'RECEIPT_BUTTON' ? 'TASK_CODE_BUTTON.COMPLETED' : StatusStyle.SUCCESS;
        case 'COMPLETED_SYSTEM': // เสร็จสิ้นโดยระบบ
          return financeType === 'RECEIPT_BUTTON' ? 'COMMON.BUTTON_VIEW_DETAIL' : StatusStyle.SUCCESS;
        case 'CANCEL_RECORD': // ยกเลิกรายการ
          return financeType === 'RECEIPT_BUTTON' ? 'COMMON.BUTTON_VIEW_DETAIL' : StatusStyle.INFO;
        case 'PENDING_NO_SUCCESS': // รอแก้ไข (มีรายการทำไม่สำเร็จ)
          return financeType === 'RECEIPT_BUTTON' ? 'TASK_CODE_BUTTON.PENDING_EDIT' : StatusStyle.FAILED;
        default:
          return financeType === 'RECEIPT_BUTTON'
            ? 'COMMON.BUTTON_VIEW_DETAIL'
            : paramStatus.startsWith('SUCCESS')
              ? StatusStyle.SUCCESS
              : StatusStyle.INFO;
      }
    } else if (financeType === 'ADVANCE_STATUS') {
      switch (value) {
        case 'DRAFT':
          return StatusStyle.INFO;
        case 'PENDING_EDIT':
        case 'PENDING_NO_SUCCESS':
        case 'RECORD_NO_SUCCESS':
          return StatusStyle.FAILED;
        case 'PENDING_APPROVE':
          return StatusStyle.NORMAL;
        case 'COMPLETED':
          return StatusStyle.SUCCESS;
        default:
          return paramStatus.startsWith('SUCCESS') ? StatusStyle.SUCCESS : StatusStyle.INFO;
      }
    } else {
      return '';
    }
  }
}
