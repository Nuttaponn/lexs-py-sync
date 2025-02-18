import { Pipe, PipeTransform } from '@angular/core';
import { ForceStatusNormal, ForceStatusPending, ForceStatusPendingPair, StatusStyle } from '../models';

@Pipe({
  name: 'taskStatus',
})
export class TaskStatusPipe implements PipeTransform {
  private pendingStatusCode = [
    'PENDING_POWER_OF_ATTORNEY_DATE',
    'PENDING_WRIT_OF_EXECUTION',
    'PENDING_WRIT_OF_EXECUTION_DATE',
    'PENDING_TRY_CONFIRM_COURT_FEES_PAYMENT',
    'R2E06-01-A_02',
    'R2E06-01-A_CREATE',
    'R2E06-02-B_CREATE',
  ];

  transform(value: any, ...args: any[]): string {
    const flowType = args[0];
    const taskCode = args[1];

    if (ForceStatusPending.includes(taskCode)) {
      return StatusStyle.PENDING;
    } else if (ForceStatusNormal.includes(taskCode)) {
      return StatusStyle.NORMAL;
    } else {
      if (ForceStatusPendingPair.map(p => p.taskCode).includes(taskCode)) {
        if (ForceStatusPendingPair.findIndex(p => p.taskCode === taskCode && p.statusCode === value) >= 0) {
          return StatusStyle.PENDING;
        }
      }

      if (['FAILED', 'CANCEL'].includes(value)) {
        return StatusStyle.FAILED;
      } else if (
        (['IN_PROGRESS', 'PENDING_APPROVAL', 'AWAITING', 'PENDING_REVIEW'].includes(value) &&
          ['EDIT_APPROVAL', 'REQUIRED_APPROVAL', 'APPROVAL'].includes(flowType)) ||
        flowType === 'VIEWPENDING'
      ) {
        return StatusStyle.NORMAL;
      } else if (
        this.pendingStatusCode.includes(value) ||
        (value === 'IN_PROGRESS' && flowType !== 'EDIT_APPROVAL' && flowType !== 'REQUIRED_APPROVAL') ||
        value === 'PENDING' ||
        value === 'PENDING_RECORD' ||
        value === 'CORRECT_PENDING' ||
        ['PENDING_2', 'PENDING_3', 'PENDING_4', 'PENDING_5', 'PENDING_6', 'IN_PROCESS', 'PENDING_REVISE'].includes(
          value
        )
      ) {
        return StatusStyle.PENDING;
      } else if (value === 'COMPLETE') {
        return StatusStyle.SUCCESS;
      } else {
        return StatusStyle.NORMAL;
      }
    }
  }

  // [class.status-normal]="((element.statusCode === 'IN_PROGRESS' || element.statusCode === 'PENDING_APPROVAL' || element.statusCode === 'AWAITING') && (element.flowType === 'EDIT_APPROVAL' || element.flowType === 'REQUIRED_APPROVAL' || element.flowType === 'APPROVAL'))"
  // [class.status-pending]="forceStatusPending.includes(element.taskCode) ||
  //             (element.statusCode === 'IN_PROGRESS' && (element.flowType !== 'EDIT_APPROVAL' && element.flowType !== 'REQUIRED_APPROVAL') || element.statusCode === 'PENDING')"
  // [class.status-failed]="element.statusCode === 'FAILED'"
  // [class.status-normal-force]="forceStatusNormal.includes(element.taskCode)"
  // [class.status-pending-force]="forceStatusPending.includes(element.taskCode)"
}
