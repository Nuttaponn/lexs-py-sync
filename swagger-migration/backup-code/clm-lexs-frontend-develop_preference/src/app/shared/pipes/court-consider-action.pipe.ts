import { Pipe, PipeTransform } from '@angular/core';
import { TaskCodeAppeal, TaskCodeSupreme } from '../models';

@Pipe({
  name: 'courtConsiderAction',
})
export class CourtConsiderActionPipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    const courtAppeal = args[0];
    if (TaskCodeSupreme.includes(value)) {
      const reusult =
        (value === 'CONSIDER_SUPREME_COURT' && !!!courtAppeal?.finishedAppeal && !!!courtAppeal?.appealPurpose) ||
        (value === 'APPROVE_SUPREME_COURT' && !!!courtAppeal?.approverDecision) ||
        (value === 'CONDITIONAL_SUPREME_COURT' && !!!courtAppeal?.conditionalAppeal)
          ? 'ADD'
          : 'EDIT';
      return reusult;
    } else if (TaskCodeAppeal.includes(value)) {
      const reusult =
        (value === 'CONSIDER_APPEAL' && !!!courtAppeal?.finishedAppeal && !!!courtAppeal?.appealPurpose) ||
        (value === 'APPROVE_APPEAL' && !!!courtAppeal?.approverDecision) ||
        (value === 'CONDITIONAL_APPEAL' && !!!courtAppeal?.conditionalAppeal)
          ? 'ADD'
          : 'EDIT';
      return reusult;
    } else {
      return '';
    }
  }
}
