import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberDecimal',
})
export class NumberDecimalPipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    if (typeof value === 'string') {
      if (value && value.indexOf('.') > -1 && value.indexOf(',')> -1 ) return value
      if (Number(value) === 0) return '0.00';
      if (value && value.indexOf('.') === -1) {
        return (value + '.00').replace(/\d(?=(\d{3})+\.)/g, '$&,');
      } else {
        const twoDecimalVal = parseFloat(value).toFixed(2)
        return twoDecimalVal.replace(/\d(?=(\d{3})+\.)/g, '$&,');
      }
    }
    if (typeof value === 'number') {
      if (value === 0) return '0.00';
      return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    return value;
  }
}
