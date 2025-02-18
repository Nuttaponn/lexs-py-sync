import { DecimalPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberOnly]',
  providers: [DecimalPipe],
})
export class NumberOnlyDirective {
  private _type!: string;

  constructor(
    private _el: ElementRef,
    private _control: NgControl,
    private decimal: DecimalPipe
  ) {}

  @Input()
  set appNumberOnly(value: string) {
    this._type = value;
  }
  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initalValue = this._el.nativeElement.value;
    if (this._type === 'integer') {
      this._el.nativeElement.value = initalValue.replace(/^0[0-9]+|[^0-9]*/g, '');
    } else if (this._type === 'qualitative') {
      this._el.nativeElement.value = initalValue.replace(/[^0-9\,\.]*/g, '');
    } else {
      this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    }
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
    if (this._control && this._control.value) {
      this._type !== 'integer' && this._type !== 'qualitative' && this.formatHandler();
    }
  }
  @HostListener('blur', ['$event']) onBlur(event: any) {
    if (this._control && this._control.value) {
      (this._type === 'integer' || this._type === 'qualitative') && this.formatHandler(event);
    }
  }

  formatHandler(event?: any) {
    let newVal = this._control.value;
    let inputValue = this._control.value;
    if (this._type === 'integer') {
      newVal = newVal.replace(/^0[0-9]+|[^0-9]/g, '').replace(/(\..*)\./g, '$1');
      this._control?.control?.setValue(newVal);
    } else if (this._type === 'qualitative') {
      let target = event.target || event.srcElement;
      const parts = inputValue
        .toString()
        .replace(/[^0-9\,\.]*/g, '')
        .replace(/,/g, '')
        .split('.');
      const decimalValue = `${parts[0]}.${parts[1] ? parts[1] : ''}`;
      inputValue = this.decimal.transform(decimalValue, '1.2-2');
      const ctr = inputValue;
      this._control?.control?.setValue(Number(ctr.toString().replace(/,/g, '')));
      target.value = inputValue;
    } else {
      newVal = newVal.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
      this._control?.control?.setValue(newVal);
    }
  }
}
