import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coerceString',
})
export class CoerceStringPipe implements PipeTransform {
  transform(value: string | null | undefined, fallback: string = '-'): string {
    if (value == undefined || value == null || value === '') return fallback;
    else return value;
  }
}
