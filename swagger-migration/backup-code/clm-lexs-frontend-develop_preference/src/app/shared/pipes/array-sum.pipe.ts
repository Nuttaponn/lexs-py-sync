import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arraySum',
})
export class ArraySumPipe implements PipeTransform {
  transform(value: any[], ...args: any[]): unknown {
    const param = args[0];
    const summary = value.map(i => i[param]).reduce((x?: number, y?: number) => Number(x || 0) + Number(y || 0), 0);
    return summary;
  }
}
