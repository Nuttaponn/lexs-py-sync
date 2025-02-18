import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTwoDecimal]',
})
export class TwoDecimalDirective {
  // private el: HTMLInputElement;

  constructor(
    private ngControl: NgControl,
    private elementRef: ElementRef
  ) {
    // this.el = this.elementRef.nativeElement;
  }

  // ngOnInit(): void {
  //   this.el.value = this.formatNumber(this.el.value);
  // }

  // @HostListener('focus', ['$event.target.value'])
  // onFocus(value: string) {
  //   this.el.value = this.parseNumber(value);
  // }

  // @HostListener('blur', ['$event.target.value'])
  // onBlur(value: string) {
  //   this.ngControl.valueAccessor?.writeValue(this.formatNumber(value));
  // }
  @HostListener('keypress', ['$event'])
  restrictDecimal(event: KeyboardEvent): void {
    const input = this.ngControl.value || '';

    const regex = new RegExp(/^[0-9]*(?:\.\d{0,2})?$/);
    const specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-']; // Provide another specialKeys here.

    if (specialKeys.includes(event.key)) {
      return;
    }

    const current: string = input;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }

  // private formatNumber(value: string): string {
  //   const num = parseFloat(value);
  //   return isNaN(num) ? '' : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  // }

  // private parseNumber(value: string): string {
  //   return value.replace(/,/g, '');
  // }
}
