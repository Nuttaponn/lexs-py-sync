import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'refNo',
})
// Reference No. 0000-00-0000-0-0000
export class RefNoPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (!value) {
      return '-';
    }
    let result = '';
    if (value && value.indexOf('-') > -1) {
      value = value.replace(/-/g, '').substring(0, 15);
    }
    const segmentLengths = [4, 6, 10, 11];
    if (value) {
      for (let i = 0; i < value.length; i++) {
        if (segmentLengths.includes(i)) {
          result += '-';
        }
        result += value[i];
      }
    } else {
      result = '-';
    }
    return result;
  }
}
