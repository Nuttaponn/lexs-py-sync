import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acctNumber',
})
export class AcctNumberFormatterPipe implements PipeTransform {
  transform(value: string, s = '-') {
    if (value && value.length <= 10) {
      value = value.length < 10 ? value.padStart(10, '0') : value;
      return value.slice(0, 3) + s + value.slice(3, 4) + s + value.slice(4, 9) + s + value.slice(9, 10);
    } else if (value && value.length > 10 && value.length <= 12) {
      return value.slice(0, 3) + s + value.slice(3, 4) + s + value.slice(4, 9) + s + value.slice(9);
    } else if (value && value.indexOf(',') > 0) {
      const split = value.split(',');
      const formattedAcc: string[] = [];
      split.forEach(eachAcc => {
        formattedAcc.push(this.transform(eachAcc, s));
      });
      return formattedAcc.join(', ');
    } else {
      return value;
    }
  }
}
