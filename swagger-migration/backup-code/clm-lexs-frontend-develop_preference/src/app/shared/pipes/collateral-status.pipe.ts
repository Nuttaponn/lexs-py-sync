import { Pipe, PipeTransform } from '@angular/core';
import { LitigationsCollateralsDto } from '@lexs/lexs-client';

@Pipe({
  name: 'collateralStatus',
})
export class CollateralStatusPipe implements PipeTransform {
  transform(value: LitigationsCollateralsDto.LexsCollateralStatusEnum): string {
    if (value) {
      switch (value) {
        case 'PLEDGE':
          return 'ไม่ถูกอายัด/ยึด/ขาย';
        case 'SEIZURED':
          return 'ยึดทรัพย์';
        case 'ON_SALE':
          return 'อยู่ระหว่างขายทอดตลาด';
        case 'PENDING_SALE':
          return 'รอประกาศขายทอดตลาดใหม่';
        case 'SOLD':
          return 'ขายทอดตลาดแล้ว';
        default:
          return '';
      }
    }
    return '';
  }
}
