import { Pipe, PipeTransform } from '@angular/core';
import memo from 'memo-decorator';

@Pipe({
  name: 'classesOption',
})
export class ClassesOptionPipe implements PipeTransform {

  transform(value: any) {
    return this.getNameClasses(value?.nameClasses);
  }

  @memo()
  private getNameClasses(_nameClasses: any) {
    return _nameClasses
  }
}
