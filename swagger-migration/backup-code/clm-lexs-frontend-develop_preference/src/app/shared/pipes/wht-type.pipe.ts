import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'whtType',
})
export class WhtTypePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: number | any, ...args: any[]): any {
    const isTranslate = !!args[0];
    if (!!!value) {
      return '-';
    }
    return !isTranslate
      ? Number(value)
      : this.translate.instant(Number(value) === 0 ? 'COMMON.NO_WITHHOLDING_TAX' : 'COMMON.WITHHOLDING_TAX');
  }
}
