import { Injectable } from '@angular/core';
import { SeizureLitigationControllerService, WithdrawSeizureControllerService } from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeizurePropertyInfoService {
  private _currentTab = 0;
  public get currentTab(): number {
    return this._currentTab;
  }
  public set currentTab(value: number) {
    this._currentTab = value;
  }

  constructor(
    private seizureLitigationControllerService: SeizureLitigationControllerService,
    private withdrawakService: WithdrawSeizureControllerService
  ) {}

  getSeizureExecution(litigationId: string) {
    return lastValueFrom(this.seizureLitigationControllerService.getSeizureExecution(litigationId));
  }

  getWithdrawalExecution(litigationId: string) {
    return lastValueFrom(this.withdrawakService.getLegalExecutionsExecution(litigationId));
  }
}
