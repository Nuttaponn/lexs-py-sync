import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
})
export class PhonePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let result = '';
    if (value && value.indexOf('-') > -1) {
      value = value.replace(/-/g, '');
    }

    if (value) {
      if (value.length === 9) {
        if (value[1] === '2') {
          result = value.replace(/(\d{2})(\d{3})(\d{4})/g, '$1-$2-$3').trim();
        } else {
          result = value.replace(/(\d{3})(\d{3})(\d{3})/g, '$1-$2-$3').trim();
        }
      } else if (value.length === 10) {
        result = value.replace(/(\d{3})(\d{3})(\d{4})/g, '$1-$2-$3').trim();
      }
    } else {
      result = '';
    }
    return result;
  }
}
