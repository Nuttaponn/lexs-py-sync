import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaiCitizenID',
})
export class ThaiCitizenIDPipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    let result = '';
    if (value && value.length === 13) {
      result = value.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/g, '$1-$2-$3-$4-$5').trim();
    } else {
      result = '-';
    }
    return result;
  }
}
