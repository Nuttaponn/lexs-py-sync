import { Pipe, PipeTransform } from '@angular/core';
import { AuctionDetailsLexsDefendant } from '@lexs/lexs-client';

@Pipe({
  name: 'aucMainDefendant',
})
export class AucMainDefendantPipe implements PipeTransform {
  transform(value: AuctionDetailsLexsDefendant[]): string {
    let mainDefendant = '';
    if (value && value.length > 0) {
      const mainPerson = value.find(it => it.relation === 'MAIN_BORROWER');
      mainDefendant = mainPerson?.personName || '';
    }
    return mainDefendant;
  }
}
