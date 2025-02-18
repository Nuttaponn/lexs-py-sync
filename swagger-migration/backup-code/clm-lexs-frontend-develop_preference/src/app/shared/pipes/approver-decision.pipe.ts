import { Pipe, PipeTransform } from '@angular/core';
import { CourtAppealDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'approverDecision',
})
export class ApproverDecisionPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: CourtAppealDto.ApproverDecisionEnum | undefined): string {
    switch (value) {
      case 'TO_APPEAL':
        return this.translate.instant('COURT.OPTION_APPEAL');
      case 'TO_STOP_APPEAL':
        return this.translate.instant('COURT.OPTION_STOP_APPEAL');
      case 'CONDITIONAL_APPEAL':
        return this.translate.instant('COURT.OPTION_CONDITIONAL_APPEAL');
      case 'TO_PETITION':
        return this.translate.instant('COURT.OPTION_PETITION');
      case 'TO_STOP_PETITION':
        return this.translate.instant('COURT.OPTION_STOP_PETITION');
      case 'CONDITIONAL_PETITION':
        return this.translate.instant('COURT.OPTION_CONDITIONAL_PETITION');
      default:
        return '-';
    }
  }
}
