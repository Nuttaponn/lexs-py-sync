import { Component, Input, OnInit } from '@angular/core';
import { InquiryAnnouncesResponse } from '@lexs/lexs-client';

@Component({
  selector: 'app-auction-detail-summary',
  templateUrl: './auction-detail-summary.component.html',
  styleUrls: ['./auction-detail-summary.component.scss'],
})
export class AuctionDetailSummaryComponent implements OnInit {
  @Input() data: InquiryAnnouncesResponse | undefined;
  @Input() defaultExpand: boolean = false;
  isOpened: boolean = false;
  @Input() auctionCaseTypeCode: string = '';

  constructor() {}

  ngOnInit(): void {
    if (this.defaultExpand) {
      this.isOpened = true;
    }
  }
}
