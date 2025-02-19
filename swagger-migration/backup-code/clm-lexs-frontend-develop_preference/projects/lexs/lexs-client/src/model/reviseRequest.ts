/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ExpenseClaimDto } from './expenseClaimDto';


export interface ReviseRequest { 
    rejectReason?: string;
    note?: string;
    expenseStatus?: ReviseRequest.ExpenseStatusEnum;
    expenseClaimDto?: Array<ExpenseClaimDto>;
}
export namespace ReviseRequest {
    export type ExpenseStatusEnum = 'DRAFT' | 'PENDING_EXPENSE_CLAIM_VERIFICATION' | 'PENDING_EXPENSE_CLAIM_CORRECTION' | 'PENDING_CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION' | 'PENDING_PAYMENT_CONSIDERATION' | 'PENDING_PAYMENT_APPROVAL_CONSIDERATION' | 'PENDING_PAYMENT_APPROVAL' | 'PENDING_PAYMENT_CONFIRMATION' | 'PENDING_PAYMENT_RECEIPT_UPLOAD' | 'PENDING_PAYMENT_RECEIPT_UPDATE' | 'PENDING_NEWS_RECEIPT_UPLOAD' | 'PENDING_AUTO_PAYMENT_RECEIPT_UPLOAD' | 'PENDING_PAYMENT_RECEIPT_UPDATE_AUTO' | 'PENDING_AUTO_PAYMENT_VERIFICATION' | 'PENDING_AUTO_PAYMENT_APPROVAL' | 'PENDING_CONSIDER_REFUND' | 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION' | 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL' | 'SUCCESS_EXPENSE_CLAIM' | 'SUCCESS_AUTO_EXPENSE_CLAIM' | 'SUCCESS_AUTO_PAYMENT' | 'CANCELLED' | 'PAYMENT_FAILED' | 'PENDING_PAYMENT_RECEIPT_APPROVAL' | 'PENDING_PAYMENT_RECEIPT_APPROVAL_AUTO' | 'PENDING_ACCEPT_ORIGINAL_DOCUMENT' | 'PENDING_AUTO_REVERSE_EXPENSE_CLAIM' | 'PENDING_DECIDE_REVERSE_EXPENSE_CLAIM' | 'CANCELLED_EXPENSE_CLAIM';
    export const ExpenseStatusEnum = {
        Draft: 'DRAFT' as ExpenseStatusEnum,
        PendingExpenseClaimVerification: 'PENDING_EXPENSE_CLAIM_VERIFICATION' as ExpenseStatusEnum,
        PendingExpenseClaimCorrection: 'PENDING_EXPENSE_CLAIM_CORRECTION' as ExpenseStatusEnum,
        PendingClosedLgExpenseClaimConsideration: 'PENDING_CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION' as ExpenseStatusEnum,
        PendingPaymentConsideration: 'PENDING_PAYMENT_CONSIDERATION' as ExpenseStatusEnum,
        PendingPaymentApprovalConsideration: 'PENDING_PAYMENT_APPROVAL_CONSIDERATION' as ExpenseStatusEnum,
        PendingPaymentApproval: 'PENDING_PAYMENT_APPROVAL' as ExpenseStatusEnum,
        PendingPaymentConfirmation: 'PENDING_PAYMENT_CONFIRMATION' as ExpenseStatusEnum,
        PendingPaymentReceiptUpload: 'PENDING_PAYMENT_RECEIPT_UPLOAD' as ExpenseStatusEnum,
        PendingPaymentReceiptUpdate: 'PENDING_PAYMENT_RECEIPT_UPDATE' as ExpenseStatusEnum,
        PendingNewsReceiptUpload: 'PENDING_NEWS_RECEIPT_UPLOAD' as ExpenseStatusEnum,
        PendingAutoPaymentReceiptUpload: 'PENDING_AUTO_PAYMENT_RECEIPT_UPLOAD' as ExpenseStatusEnum,
        PendingPaymentReceiptUpdateAuto: 'PENDING_PAYMENT_RECEIPT_UPDATE_AUTO' as ExpenseStatusEnum,
        PendingAutoPaymentVerification: 'PENDING_AUTO_PAYMENT_VERIFICATION' as ExpenseStatusEnum,
        PendingAutoPaymentApproval: 'PENDING_AUTO_PAYMENT_APPROVAL' as ExpenseStatusEnum,
        PendingConsiderRefund: 'PENDING_CONSIDER_REFUND' as ExpenseStatusEnum,
        PendingAutoExpenseClaimCorrection: 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION' as ExpenseStatusEnum,
        PendingAutoExpenseClaimCorrectionApproval: 'PENDING_AUTO_EXPENSE_CLAIM_CORRECTION_APPROVAL' as ExpenseStatusEnum,
        SuccessExpenseClaim: 'SUCCESS_EXPENSE_CLAIM' as ExpenseStatusEnum,
        SuccessAutoExpenseClaim: 'SUCCESS_AUTO_EXPENSE_CLAIM' as ExpenseStatusEnum,
        SuccessAutoPayment: 'SUCCESS_AUTO_PAYMENT' as ExpenseStatusEnum,
        Cancelled: 'CANCELLED' as ExpenseStatusEnum,
        PaymentFailed: 'PAYMENT_FAILED' as ExpenseStatusEnum,
        PendingPaymentReceiptApproval: 'PENDING_PAYMENT_RECEIPT_APPROVAL' as ExpenseStatusEnum,
        PendingPaymentReceiptApprovalAuto: 'PENDING_PAYMENT_RECEIPT_APPROVAL_AUTO' as ExpenseStatusEnum,
        PendingAcceptOriginalDocument: 'PENDING_ACCEPT_ORIGINAL_DOCUMENT' as ExpenseStatusEnum,
        PendingAutoReverseExpenseClaim: 'PENDING_AUTO_REVERSE_EXPENSE_CLAIM' as ExpenseStatusEnum,
        PendingDecideReverseExpenseClaim: 'PENDING_DECIDE_REVERSE_EXPENSE_CLAIM' as ExpenseStatusEnum,
        CancelledExpenseClaim: 'CANCELLED_EXPENSE_CLAIM' as ExpenseStatusEnum
    };
}


