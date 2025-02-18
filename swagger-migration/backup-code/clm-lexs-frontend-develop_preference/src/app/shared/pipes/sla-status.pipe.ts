import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slaStatus',
})
export class SlaStatusPipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    const usingFor = args[0];
    const tabType = args[1];
    let daysSla = Number(value.slaDays);
    switch (usingFor) {
      case 'STYLE':
        let isCloseTab = tabType && tabType === 'CLOSED';
        if (!isCloseTab && !!daysSla && !!value.sla && daysSla > value.sla) {
          return 'fil-red';
        }
        if (!isCloseTab && daysSla >= value.sla / 2 && daysSla < value.sla) {
          return 'fil-orange';
        }
        return '';
      case 'DISPLAY':
        let prefix = !!daysSla ? daysSla || 0 : value.sla ? 0 : '-';
        let suffix = !!value.sla ? value.sla || 0 : '-';
        let displaySla = !!daysSla?.toString() && !!value.sla?.toString() ? prefix + '/' + suffix : '';

        return displaySla;

      default:
        return '';
    }
  }
}
