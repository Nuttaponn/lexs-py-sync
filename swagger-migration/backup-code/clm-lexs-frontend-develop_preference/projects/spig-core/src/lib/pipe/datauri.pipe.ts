import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'datauri',
})
export class DatauriPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, contentType: string) {
    if (!value) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustUrl(`data:${contentType};base64,${value}`);
  }
}
