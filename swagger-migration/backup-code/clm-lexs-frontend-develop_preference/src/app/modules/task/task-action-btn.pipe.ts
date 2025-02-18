import { taskCode } from '@app/shared/models';
import { Pipe, PipeTransform } from '@angular/core';
import {
  ExpenseStatusConsiderBtn,
  ExpenseStatusEditBtn,
  ExpenseStatusUploadBtn,
  ExpenseStatusVerifyBtn,
} from '@app/shared/pipes/finance-status-button.pipe';
import { TranslateService } from '@ngx-translate/core';
import memo from 'memo-decorator';

@Pipe({
  name: 'taskActionBtn',
})
export class TaskActionBtnPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  // finance task should not display on task menu
  private expenseStatusVerifyBtn = ExpenseStatusVerifyBtn;
  private expenseStatusConsiderBtn = ExpenseStatusConsiderBtn;
  private expenseStatusUploadBtn = ExpenseStatusUploadBtn;
  private expenseStatusEditBtn = ExpenseStatusEditBtn;

  // normal task
  private statusTasksVerifyBtn = [
    'FAILED_EXPENSE_CLAIM_SYSTEM_PAYMENT',
    'IN_PROGRESS_RECEIVE_COURT_PAYMENT',
    'IN_PROGRESS_RECEIVE_NORMAL_PAYMENT',
    'PENDING_APPROVAL_DECREE_OF_APPEAL',
    'PENDING_APPROVAL_DECREE_OF_FIRST_INSTANCE',
    'PENDING_APPROVAL_DECREE_OF_SUPREME_COURT',
    'PENDING_APPROVAL_EXPENSE_CLAIM_RECEIPT_UPLOAD',
    'PENDING_APPROVAL_INDICTMENT_RECORD',
    'PENDING_APPROVAL_RECEIVE_COURT_PAYMENT',
    'PENDING_APPROVAL_RECEIVE_NORMAL_PAYMENT',
    'PENDING_APPROVAL_UPLOAD_E_FILING',
    'PENDING_APPROVAL_VERIFY_INFO_AND_DOCUMENT',
    'PENDING_EXPENSE_CLAIM_AUTO_PAYMENT_APPROVAL',
    'PENDING_RECEIVE_COURT_PAYMENT',
    'PENDING_RECEIVE_NORMAL_PAYMENT',
    'PENDING_RECEVE_COURT_PAYMENT',
    'PENDING_VERIFY_INFO_AND_DOCUMENT',
    'PENDING_R2E04-02-2A',
    'PENDING_R2E06-03-C',
    'PENDING_R2E05-02-3C',
    'PENDING_R2E06-13-C',
    'PENDING_REVIEW_R2E09-06-7C',
    'PENDING_R2E09-13-13A',
    'PENDING_REVIEW_R2E09-06-12C',
    'PENDING_R2E05-08-3A',
  ];
  private statusTasksConsiderBtn = [
    'IN_PROGRESS_CONDITIONAL_APPEAL',
    'IN_PROGRESS_CONDITIONAL_SUPREME_COURT',
    'PENDING_APPROVAL_CHANGE_RELATED_PERSON_BLACK_CASE',
    'PENDING_APPROVAL_CHANGE_RELATED_PERSON_LITIGATION_CASE',
    'PENDING_APPROVAL_CLOSED_LG_EXPENSE_CLAIM_CONSIDERATION',
    'PENDING_APPROVAL_CONSIDER_APPEAL',
    'PENDING_APPROVAL_CONSIDER_APPROVE_CLOSE_LG',
    'PENDING_APPROVAL_CONSIDER_SUPREME_COURT',
    'PENDING_APPROVAL_DECREASE_RELATED_PERSON_LITIGATION_CASE',
    'PENDING_APPROVAL_EXPENSE_CLAIM_PAYMENT_APPROVAL',
    'PENDING_APPROVAL_EXTEND_DEFERMENT',
    'PENDING_APPROVAL_MEMORANDUM_COURT_FIRST_INSTANCE',
    'PENDING_APPROVAL_MEMORANDUM_COURT_APPEAL',
    'PENDING_APPROVAL_MEMORANDUM_SUPREME_COURT',
    'PENDING_APPROVAL_RECEIVE_ADVANCE_PAYMENT',
    'PENDING_APPROVAL_REQUEST_CESSATION',
    'PENDING_APPROVAL_REQUEST_DEFERMENT',
    'PENDING_APPROVAL_REQUEST_REViSE_DEFERMENT', // df LEX2-22737
    'PENDING_CONSIDER_APPEAL',
    'PENDING_CONSIDER_REMAINING_COSTS',
    'PENDING_CONSIDER_SUPREME_COURT',
    'PENDING_EXPENSE_CLAIM_PAYMENT_APPROVAL',
    'PENDING_EXTEND_DEFERMENT',
    'PENDING_REQUEST_CESSATION',
    'PENDING_REQUEST_DEFERMENT',
    'PENDING_APPROVAL_INVESTIGATE_HEIR_OR_TRUSTEE',
    'PENDING_APPROVAL_PROCESS_NOT_PROSECUTE_1',
    'PENDING_PROCESS_NOT_PROSECUTE_2',
    'PENDING_APPROVAL_PROCESS_NOT_PROSECUTE_2',
    'PENDING_APPROVAL_R2E06-02-B',
    'PENDING_APPROVAL_R2E06-12-B',
    'PENDING_APPROVAL_R2E07-02-B',
    'PENDING_R2E09-07-9A',
    'PENDING_R2E09-14-14A',
    'PENDING_APPROVAL_R2E09-06-12C',
    'PENDING_APPROVAL_R2E09-06-7C',
    'PENDING_R2E10-06-04-2A',
    'PENDING_R2E09-09-03-14.1',
    'PENDING_APPROVAL_R2E09-14-3C',
    'PENDING_APPROVAL_EXECUTE_PREFERENCE',
  ];
  private statusTasksUpload2Btn = ['PENDING_EXPENSE_CLAIM_NEWS_RECEIPT_UPLOAD', 'PENDING_EXPENSE_CLAIM_RECEIPT_UPLOAD'];
  private statusTasksEditBtn = [
    'FAILED_EXPENSE_CLAIM_CORRECTION',
    'IN_PROGRESS_CONSIDER_APPEAL',
    'IN_PROGRESS_CONSIDER_SUPREME_COURT',
    'IN_PROGRESS_RECEIVE_ADVANCE_PAYMENT',
    'IN_PROGRESS_UPLOAD_E_FILING',
    'FAILED_RECEIVE_ADVANCE_PAYMENT',
    'PENDING_REQUEST_REVISE_DEFERMENT',
    'PENDING_REQUEST_REVISE_CESSATION',
    'PENDING_R2E07-04-D',
    'CORRECT_PENDING_R2E06-01-A',
    'CORRECT_PENDING_R2E06-11-A',
    'CORRECT_PENDING_R2E09-06-12C',
    'PENDING_R2E05_5369_B_MOCK',
    'CORRECT_PENDING_R2E09-12-12C',
    'PENDING_R2E09-10-03',
    'CORRECT_PENDING_R2E09-06-04-1A',
    'CORRECT_PENDING_R2E09-14-3C',
    // 'CORRECT_PENDING_R2E09-09-01-13.1'
    'PENDING_CORRECTION_MEMORANDUM_COURT_FIRST_INSTANCE',
    'PENDING_CORRECTION_MEMORANDUM_COURT_APPEAL',
    'PENDING_CORRECTION_MEMORANDUM_SUPREME_COURT',
    'PENDING_MEMORANDUM_COURT_FIRST_INSTANCE',
    'PENDING_MEMORANDUM_COURT_APPEAL',
    'PENDING_MEMORANDUM_SUPREME_COURT',
    "CORRECT_PENDING_EXECUTE_PREFERENCE",
  ];
  private statusTasksSaveBtn = [
    'AWAITING_DECREE_OF_APPEAL',
    'AWAITING_DECREE_OF_FIRST_INSTANCE',
    'AWAITING_DECREE_OF_SUPREME_COURT',
    'AWAITING_RECORD_OF_SUPREME_COURT',
    'IN_PROGRESS_MEMORANDUM_COURT_APPEAL',
    'IN_PROGRESS_RECORD_DIAGNOSIS_DATE',
    'IN_PROGRESS_RECORD_OF_APPEAL',
    'IN_PROGRESS_RECORD_OF_SUPREME_COURT',
    'PENDING_RECEIVE_ADVANCE_PAYMENT',
    'PENDING_RECORD_DIAGNOSIS_DATE',
    'PENDING_RECORD_OF_APPEAL',
    'PENDING_RECORD_OF_SUPREME_COURT',
    'PENDING_R2E04-03-3A',
    'PENDING_POWER_OF_ATTORNEY_DATE_R2E04-03-3A',
    'PENDING_WRIT_OF_EXECUTION_R2E04-03-3A',
    'PENDING_WRIT_OF_EXECUTION_DATE_R2E04-03-3A',
    'PENDING_R2E06-05-E',
    'IN_PROGRESS_MEMORANDUM_COURT_FIRST_INSTANCE',
    'PENDING_R2E05-04-4',
    'PENDING_RECORD_R2E05-04-4',
    'PENDING_SAVE_DRAFT_DEFERMENT',
    'PENDING_SAVE_DRAFT_CESSATION',
    'PENDING_R2E09-02-3B',
    'PENDING_R2E09-06-7C',
    'PENDING_R2E09-06-12C',
    'CORRECT_PENDING_R2E09-06-7C',
    'PENDING_R2E09-10-01',
    'PENDING_R2E07-01-A',
    'PENDING_R2E07-05-E',
    'PENDING_R2E09-06-04-1A',
    'PENDING_R2E09-05-01-12A',
    'PENDING_2_R2E09-05-01-12A',
    'PENDING_3_R2E09-05-01-12A',
    'PENDING_R2E05-10-5',
    'PENDING_RECORD_R2E05-10-5',
    'PENDING_R2E09-14-3C',
    'PENDING_รอบันทึกยื่นคำร้องขอรับชำระหนี้บุริมสิทธิ',
    'PENDING_รอบันทึกผลคำสั่งศาล',
  ];
  private statusTasksSaveResultBtn = [
    'IN_PROGRESS_MEMORANDUM_SUPREME_COURT',
    'PENDING_R2E09-04-01-11',
    'PENDING_2_R2E09-04-01-11',
    'PENDING_3_R2E09-04-01-11',
    'PENDING_4_R2E09-04-01-11',
    'PENDING_5_R2E09-04-01-11',
    'PENDING_6_R2E09-04-01-11',
    // 'PENDING_R2E09-09-01-13.1',
  ];
  private statusTasksVerifyInfoBtn = [
    'PENDING_ADD_SUB_ACCOUNT',
    'PENDING_APPROVAL_ADD_SUB_ACCOUNT',
    'PENDING_APPROVAL_CHANGE_RELATED_PERSON',
    'PENDING_APPROVAL_COLLECT_LG_ID',
    'PENDING_APPROVAL_EDIT_MORTGAGE_ASSETS',
    'PENDING_CHANGE_RELATED_PERSON',
    'PENDING_EDIT_MORTGAGE_ASSETS',
  ];
  private statusTasksContinueBtn = ['PENDING_TRY_CONFIRM_COURT_FEES_PAYMENT'];

  private statusTasksViewDetail = ['AWAITING_R2E06-01-A', 'AWAITING_R2E06-11-A'];

  private statusCashierCheck = ['PENDING_R2E09-06-03'];

  private exceptionTasksBtn = [taskCode.R2E09_09_01_13_1];

  private statusTaskAcknowledgeBtn = [
    'AWAITING_MEMORANDUM_COURT_FIRST_INSTANCE',
    'AWAITING_MEMORANDUM_COURT_APPEAL',
    'AWAITING_MEMORANDUM_SUPREME_COURT',
  ];

  @memo()
  transform(value: string): string {
    // value is "STATUS_CODE" + "_" + "TASK_CODE"
    const exceptionalTask = this.findExceptionalTask(value);
    if (!!exceptionalTask) {
      return this.getExceptionalTaskBtnText(value, exceptionalTask);
    } else if (this.expenseStatusVerifyBtn.includes(value) || this.statusTasksVerifyBtn.includes(value)) {
      // for ตรวจสอบ
      return this.translate.instant('TASK_CODE_BUTTON.VERIFY');
    } else if (this.expenseStatusConsiderBtn.includes(value) || this.statusTasksConsiderBtn.includes(value)) {
      // for พิจารณา
      return this.translate.instant('TASK_CODE_BUTTON.CONSIDER');
    } else if (this.expenseStatusUploadBtn.includes(value)) {
      // for อัปโหลด
      return this.translate.instant('TASK_CODE_BUTTON.UPLOAD');
    } else if (this.statusTasksUpload2Btn.includes(value)) {
      // for อัพโหลด
      return this.translate.instant('TASK_CODE_BUTTON.UPLOAD_2');
    } else if (this.expenseStatusEditBtn.includes(value) || this.statusTasksEditBtn.includes(value)) {
      // for แก้ไข
      return this.translate.instant('TASK_CODE_BUTTON.PENDING_EDIT');
    } else if (this.statusTasksSaveBtn.includes(value)) {
      // for บันทึก
      return this.translate.instant('TASK_CODE_BUTTON.SAVE');
    } else if (this.statusTasksSaveResultBtn.includes(value)) {
      // for บันทึกผล
      return this.translate.instant('TASK_CODE_BUTTON.SAVE_RESULT');
    } else if (this.statusTasksVerifyInfoBtn.includes(value)) {
      // for ตรวจสอบข้อมูล
      return this.translate.instant('TASK_CODE_BUTTON.VERIFY_INFO');
    } else if (this.statusTaskAcknowledgeBtn.includes(value)) {
      // for รับทราบ
      return this.translate.instant('TASK_CODE_BUTTON.ACKNOWLEDGE');
    } else if (this.statusTasksContinueBtn.includes(value)) {
      // for ทำรายการต่อ
      return this.translate.instant('COMMON.BUTTON_CONTINUE');
    } else if (this.statusTasksViewDetail.includes(value)) {
      // for ดูรายละเอียด
      return this.translate.instant('COMMON.BUTTON_VIEW_DETAIL');
    } else if (this.statusCashierCheck.includes(value)) {
      // for ออกแคชเชียร์เช็ค
      return this.translate.instant('TASK_CODE_BUTTON.SAVE');
    } else {
      const result: string = this.translate.instant(`TASK_CODE_BUTTON.${value}`);
      if (result.search('TASK_CODE_BUTTON') !== 0) {
        // for spacific text
        return result;
      } else {
        // for NO_STATUS text
        return this.translate.instant(`TASK_CODE_BUTTON.NO_STATUS`);
      }
    }
  }

  private findExceptionalTask(value: string): taskCode | null {
    for (let exceptionTask of this.exceptionTasksBtn) {
      if (value.includes(exceptionTask)) {
        return exceptionTask;
      }
    }
    return null;
  }

  private getExceptionalTaskBtnText(value: string, exceptionalTask: taskCode): string {
    let text = this.translate.instant(`TASK_CODE_BUTTON.NO_STATUS`);
    switch (exceptionalTask) {
      case taskCode.R2E09_09_01_13_1:
        if (value.includes('PENDING_CORRECT')) {
          text = this.translate.instant('TASK_CODE_BUTTON.PENDING_EDIT');
        } else if (value.includes('PENDING')) {
          text = this.translate.instant('TASK_CODE_BUTTON.SAVE_RESULT');
        }
        break;
    }
    return text;
  }
}
