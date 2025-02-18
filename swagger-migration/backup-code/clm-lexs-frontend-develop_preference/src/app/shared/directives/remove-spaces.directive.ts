import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRemoveSpaces]',
})
export class RemoveSpacesDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;

    const noSpacesValue = input.value.replace(/\s+/g, ''); // Remove all spaces
    input.value = noSpacesValue; // Update input value directly
  }
}
