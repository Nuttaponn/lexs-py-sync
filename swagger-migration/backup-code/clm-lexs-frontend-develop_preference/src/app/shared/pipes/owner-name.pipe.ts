import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ownerName',
})
export class OwnerNamePipe implements PipeTransform {
  constructor() {}

  transform(value: any): any {
    if (!!!value) {
      return '-';
    }
    let name = '';
    if (typeof value === 'string') {
      name = value;
    } else if (typeof value === 'object') {
      const data = value as any[];
      if (data.length > 0) {
        name =
          data
            .map(d => d.ownerName)
            .join(',')
            .trim() || '-';
      } else {
        name = '-';
      }
    } else {
      name = '-';
    }
    return name;
  }
}
