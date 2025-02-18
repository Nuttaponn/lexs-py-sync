import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { TransferOrderRequest } from '@lexs/lexs-client';
import { AdvanceService } from './../../services/advance.service';

@Injectable({
  providedIn: 'root',
})
export class AdvanceDetailResolver {
  constructor(
    private advanceService: AdvanceService,
    private taskService: TaskService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<boolean> {
    const advanceReceiveNo = route.queryParams['advancePaymentNo'];
    const fromAdvancePaymentNo = route.queryParams['fromAdvancePaymentNo'];
    const isCreate = route.queryParams['isCreate'];
    let request!: TransferOrderRequest;
    let litigationCaseIdList = JSON.parse(this.taskService.taskDetail.attributes || 'false');
    if (!isCreate) {
      if (this.taskService.taskDetail && this.taskService.taskDetail.attributes && litigationCaseIdList) {
        request = {
          litigationCaseId: litigationCaseIdList.litigationCaseId, // array of litigationCaseId
          mode: TransferOrderRequest.ModeEnum.Auto, // mode,
          objectId: this.advanceService.objectId, // objectId
        };
      }
      this.advanceService.advance = fromAdvancePaymentNo
        ? await this.advanceService.getAdvanceReceiveOrder(advanceReceiveNo)
        : await this.advanceService.advanceReceiveInfoDetail(request);
    }

    return true;
  }
}
