import { Component, Input, OnInit } from '@angular/core';
import { LitigationDetailDto } from '@lexs/lexs-client';

@Component({
  selector: 'app-lawsuit-detail-head',
  templateUrl: './lawsuit-detail-head.component.html',
  styleUrls: ['./lawsuit-detail-head.component.scss'],
})
export class LawsuitDetailHeadComponent implements OnInit {
  constructor() {}

  @Input() litigationDetail!: LitigationDetailDto;

  public defermentStatus: string | undefined;

  ngOnInit(): void {
    this.defermentStatus = this.litigationDetail?.defermentStatus;
  }
}
