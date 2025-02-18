import { Pipe, PipeTransform } from '@angular/core';
import memo from 'memo-decorator';

@Pipe({
  name: 'iconOption',
})
export class IconOptionPipe implements PipeTransform {

  transform(value: any) {
    return this.getIcon(value?.icon);
  }

  @memo()
  private getIcon(_icon: any) {
    return _icon
  }
}
