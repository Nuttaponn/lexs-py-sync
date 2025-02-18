import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'listOption',
})
export class ListOptionPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, ...args: any[]) {
    const _displayWith = args[0];
    const _filterValue = args[1];
    return this.sanitizer.bypassSecurityTrustHtml(
      _filterValue !== ''
        ? String(value[_displayWith]).replace(_filterValue, '<u>' + _filterValue + '</u>')
        : value[_displayWith]
    );
  }
}
