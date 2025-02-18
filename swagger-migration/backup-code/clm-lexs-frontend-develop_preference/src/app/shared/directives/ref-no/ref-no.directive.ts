import { Directive, ElementRef, HostListener, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appRefNoInput]',
})
export class RefNoInputDirective {
  constructor(
    private el: ElementRef,
    @Self() private control: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').substring(0, 15);
    const segmentLengths = [4, 6, 10, 11];

    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
      if (segmentLengths.includes(i)) {
        formattedValue += '-';
      }
      formattedValue += value[i];
    }

    // Update the input's value.
    input.value = formattedValue;

    // Update the FormControl's value.
    this.control?.control?.setValue(formattedValue);
  }
}
