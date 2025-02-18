import { Pipe, PipeTransform } from '@angular/core';
import { CourtAppealDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'conditionalAppeal',
})
export class ConditionalAppealPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: CourtAppealDto.ConditionalAppealEnum | undefined): unknown {
    switch (value) {
      case 'APPEAL':
        return this.translate.instant('COURT.OPTION_APPEAL');
      case 'STOP_APPEAL':
        return this.translate.instant('COURT.OPTION_STOP_APPEAL');
      default:
        return '-';
    }
  }
}
