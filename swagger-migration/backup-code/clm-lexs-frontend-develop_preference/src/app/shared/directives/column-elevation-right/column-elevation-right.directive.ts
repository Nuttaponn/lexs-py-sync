import { Directive, HostBinding, Input } from '@angular/core';
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[columnElevationRight]',
})
export class ColumnElevationRightDirective {
  constructor() {}

  @Input() columnElevationRight: boolean | string = true;

  @HostBinding('class') get elementClass() {
    return this.columnElevationRight || this.columnElevationRight === '' ? 'elevation-right-staking' : '';
  }
}
