import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitTxt',
})
export class SplitTxtPipe implements PipeTransform {
  transform(value?: string, ...args: string[]): string[] {
    const splitWith = args[0] || '|';
    return value ? value.split(splitWith) : [];
  }
}
