import { Directive, HostBinding, Input } from '@angular/core';
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[columnElevationLeft]',
})
export class ColumnElevationLeftDirective {
  constructor() {}

  @Input() columnElevationLeft: boolean | string = true;

  @HostBinding('class') get elementClass() {
    return this.columnElevationLeft || this.columnElevationLeft === '' ? 'elevation-left-staking' : '';
  }
}
