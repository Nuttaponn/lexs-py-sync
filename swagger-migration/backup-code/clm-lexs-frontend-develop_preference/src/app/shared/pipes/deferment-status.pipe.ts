import { Pipe, PipeTransform } from '@angular/core';
import { StatusStyle } from '@app/shared/models';
import { DefermentItem } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'defermentStatus',
})
export class DefermentStatusPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: string, ...args: any[]): string {
    const status = args[0] as DefermentItem.DefermentTaskStatusEnum;
    if (status) {
      switch (value) {
        case 'DRAFT':
          return this.translate.instant('บันทึกร่าง');
        case 'REVISE':
          return this.translate.instant('ส่งกลับแก้ไข');
        case 'WAITING_APPROVE_DEFERMENT':
          return this.translate.instant('รออนุมัติชะลอดำเนินคดี');
        case 'WAITING_APPROVE_DEFERMENT_EXEC':
          return this.translate.instant('รออนุมัติชะลอบังคับคดี');
        case 'WAITING_APPROVE_CESSATION':
          return this.translate.instant('รออนุมัติยุติดำเนินคดี');
        case 'APPROVED':
          return this.translate.instant('อนุมัติ');
        case 'REJECTED':
          return this.translate.instant('ไม่อนุมัติ');
        default:
          return '';
      }
    } else {
      switch (value) {
        case 'DRAFT':
        case 'REVISE':
          return StatusStyle.PENDING;
        case 'WAITING_APPROVE_DEFERMENT':
        case 'WAITING_APPROVE_CESSATION':
        case 'WAITING_APPROVE_DEFERMENT_EXEC':
          return StatusStyle.NORMAL;
        case 'APPROVED':
          return StatusStyle.SUCCESS;
        case 'REJECTED':
          return StatusStyle.FAILED;
        default:
          return '';
      }
    }
  }
}
