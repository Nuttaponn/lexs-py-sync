import { Pipe, PipeTransform } from '@angular/core';
import memo from 'memo-decorator';

@Pipe({
  name: 'emptyFormat',
})
export class EmptyFormatPipe implements PipeTransform {
  @memo()
  transform(value: any): string {
    return value ? value : '';
  }
}
