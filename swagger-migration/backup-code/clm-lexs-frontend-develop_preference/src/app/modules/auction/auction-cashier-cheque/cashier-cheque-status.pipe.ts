import { Pipe, PipeTransform } from '@angular/core';
import memo from 'memo-decorator';

@Pipe({
  name: 'cashierChequeStatus',
})
export class CashierChequeStatusPipe implements PipeTransform {
  transform(value: string): string {
    const code = value?.split('_');
    return this.getCashierChequeStatus(code);
  }

  @memo()
  getCashierChequeStatus(code: any) {
    if (code && code.length > 1) {
      switch (code[1]) {
        case 'CREATE':
          return 'PENDING';
        case '01':
          return 'CORRECT_PENDING';
        case '02':
          return 'PENDING_REVIEW';
        case '03':
          return 'PENDING_APPROVAL';
        case 'COMPLETE':
          return 'FINISHED';
        default:
          return '';
      }
    }
    return '';
  }
}
