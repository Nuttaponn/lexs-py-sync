import { Pipe, PipeTransform } from '@angular/core';
import { CourtAppealDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'appealPurpose',
})
export class AppealPurposePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: CourtAppealDto.AppealPurposeEnum | undefined): string {
    switch (value) {
      case 'REQUEST_APPEAL':
        return this.translate.instant('COURT.LABEL_REQUEST_APPEAL');
      case 'STOP_APPEAL':
        return this.translate.instant('COURT.LABEL_STOP_APPEAL');
      case 'KTB_LAW_STOP_APPEAL':
        return this.translate.instant('COURT.LABEL_KTB_LAW_STOP_APPEAL');
      case 'REQUEST_PETITION':
        return this.translate.instant('COURT.LABEL_REQUEST_PETITION');
      case 'STOP_PETITION':
        return this.translate.instant('COURT.LABEL_STOP_PETITION');
      case 'KTB_LAW_STOP_PETITION':
        return this.translate.instant('COURT.LABEL_KTB_LAW_STOP_PETITION');
      default:
        return '-';
    }
  }
}
