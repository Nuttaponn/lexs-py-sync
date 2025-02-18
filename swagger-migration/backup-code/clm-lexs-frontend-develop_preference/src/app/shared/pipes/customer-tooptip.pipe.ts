import { Pipe, PipeTransform } from '@angular/core';
import { ITooltip } from '@app/shared/models';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'customerTooptip',
})
export class CustomerTooptipPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: string, type?: string): Array<ITooltip> {
    if (!!value) {
      const result = value.split('|');
      const mapResult = result.map((item, index) => {
        if (index !== 0) {
          return { content: item };
        } else {
          return { title: this.translate.instant(`CUSTOMER.TOOLTIP.TITLE_${type}`), content: item };
        }
      });
      return mapResult;
    }
    return [];
  }
}
