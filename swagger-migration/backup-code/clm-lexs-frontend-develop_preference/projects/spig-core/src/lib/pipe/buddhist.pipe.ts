import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

interface IValueArgs {
  value: any;
  format?: any;
}

@Pipe({
  name: 'buddhistEra',
})
export class BuddhistEraPipe extends DatePipe implements PipeTransform {
  override transform(value: any, format?: any): any {
    const result = this.transformDateTime({ value: value, format: format } as IValueArgs);
    return result;
  }

  transformDateTime(object: IValueArgs) {
    if (object.value) {
      let _date = moment(object.value).format(object.format);
      const christianYear = moment(object.value).format('YYYY');
      const buddhistYear = (Number(christianYear) + 543). toString();
      return _date.replace(christianYear, buddhistYear);
    }


    // if (object.value) {
    //   if(object.value === '-') return '';
    //   let _date = new Date(object.value);
    //   const isFullMonth = object.format.toString().search('MMM') || object.format.toString().search('MMMM');
    //   let result = isFullMonth ? super.transform(_date, object.format, undefined, 'th') : super.transform(_date, object.format);
    //   return result?.replace(_date.getFullYear().toString(), (_date.getFullYear() + 543).toString());
    // }
    return '';
  }
}

/**
 *
 How to use it
    {{ datetime | buddhistEra: formatdate }}

    Ex. formatdate
      - dd/MM/yyyy > 01/01/2565
      - dd-MM-yyyy > 01-01-2565
      - dd MMM yyyy > 01 Jan 2565
      - dd MMMM yyyy > 01 January 2565
*/
