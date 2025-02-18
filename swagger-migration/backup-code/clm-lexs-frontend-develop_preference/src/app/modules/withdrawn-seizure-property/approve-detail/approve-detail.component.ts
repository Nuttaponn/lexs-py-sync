import { Component, Input } from '@angular/core';
import { WithdrawSeizureResponse } from '@lexs/lexs-client';

@Component({
  selector: 'app-approve-detail',
  templateUrl: './approve-detail.component.html',
  styleUrls: ['./approve-detail.component.scss'],
})
export class ApproveDetailComponent {
  @Input() data!: WithdrawSeizureResponse;
  public isOpened = true;
  constructor() {}
}
