import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sec2min',
})
export class Sec2minPipe implements PipeTransform {
  transform(value: number): string {
    if (typeof value !== 'number') {
      return '';
    }
    const sec = value % 60;
    const min = (value - sec) / 60;
    return min + ':' + (sec < 10 ? '0' : '') + sec;
  }
}
