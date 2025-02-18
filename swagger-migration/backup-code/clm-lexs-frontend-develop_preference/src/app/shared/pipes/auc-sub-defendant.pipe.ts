import { Pipe, PipeTransform } from '@angular/core';
import { AuctionDetailsLexsDefendant } from '@lexs/lexs-client';

@Pipe({
  name: 'aucSubDefendant',
})
export class AucSubDefendantPipe implements PipeTransform {
  transform(value: AuctionDetailsLexsDefendant[]): string {
    let mainDefendant = '';
    if (value && value.length > 0) {
      const mainPerson = value.filter(it => it.relation !== 'MAIN_BORROWER');
      mainDefendant += mainPerson?.map(it => it.personName).join('<br>') || '';
    }
    return mainDefendant;
  }
}
