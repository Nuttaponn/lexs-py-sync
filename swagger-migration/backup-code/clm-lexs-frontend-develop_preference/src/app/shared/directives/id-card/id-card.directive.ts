import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Utils } from '@app/shared/utils';

@Directive({
  selector: '[appIdCard]',
})
export class IdCardDirective {
  private _type!: string;

  @Input()
  set appIdCard(value: string) {
    this._type = value;
  }

  constructor(private _control: NgControl) {}

  @HostListener('input', ['$event']) onKey(event: any) {
    let newVal = event.target.value;
    if (this._type === 'idcard') {
      newVal = Utils.formatThaiIdCard(newVal);
      this._control.control?.setValue(newVal);
    } else {
      this._control.control?.setValue(newVal);
    }
  }
}
