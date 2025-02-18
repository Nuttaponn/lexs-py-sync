import { Pipe, PipeTransform } from '@angular/core';
import { SeizureLedTypes } from '@app/shared/constant';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'aucLedType',
})
export class AucLedTypePipe implements PipeTransform {
  /**
   *
   */
  constructor(private translate: TranslateService) {}

  transform(value: unknown): unknown {
    switch (value) {
      case SeizureLedTypes.MAIN:
        return this.translate.instant('AUCTION_DETAIL.SEIZURE_LED_TYPE.MAIN');
      case SeizureLedTypes.MAIN_ADDITIONAL:
        return this.translate.instant('AUCTION_DETAIL.SEIZURE_LED_TYPE.MAIN_ADDITIONAL');
      case SeizureLedTypes.INTER_REGION:
        return this.translate.instant('AUCTION_DETAIL.SEIZURE_LED_TYPE.INTER_REGION');
      case SeizureLedTypes.INTER_REGION_ADDITIONAL:
        return this.translate.instant('AUCTION_DETAIL.SEIZURE_LED_TYPE.INTER_REGION_ADDITIONAL');
      default:
        return '-';
    }
  }
}
