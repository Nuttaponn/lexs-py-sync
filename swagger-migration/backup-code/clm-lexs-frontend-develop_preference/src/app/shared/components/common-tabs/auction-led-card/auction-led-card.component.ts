import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { AuctionLedCardService, IActiveLed } from './auction-led-card.service';
import { MatTableDataSource } from '@angular/material/table';
import { AuctionLitigationConveyanceProcessDto } from '@lexs/lexs-client';

@Component({
  selector: 'app-auction-led-card',
  templateUrl: './auction-led-card.component.html',
  styleUrls: ['./auction-led-card.component.scss'],
})
export class AuctionLEDCardComponent implements OnInit {
  public auctionLEDCard: any[] = [];
  public isOpenedList: boolean[] = [];
  public tabIndex: number[] = [];
  public litigationId: string | undefined;
  public announcementInfo = new MatTableDataSource<AuctionLitigationConveyanceProcessDto>([]);

  public currentActiveLed: IActiveLed | undefined;

  constructor(
    private auctionLedCardService: AuctionLedCardService,
    private lawsuitService: LawsuitService
  ) {}

  async ngOnInit(): Promise<void> {
    const litigationId = this.lawsuitService.currentLitigation.litigationId;
    this.litigationId = litigationId || '';
    await this.getInquiryLedInfo(litigationId || '');
    this.isOpenedList = new Array(this.auctionLEDCard.length).fill(true);
    this.tabIndex = new Array(this.auctionLEDCard.length).fill(0);

    this.auctionLedCardService.activeLedSubject.subscribe(value => {
      this.currentActiveLed = value;
      // find card with id
      if (this.auctionLEDCard.length > 0) {
        const index = this.auctionLEDCard.findIndex(led => led.ledId === value.activeLedId);
        if (index >= 0) this.tabIndex[index] = value.activeLedTab || 0;
      }
    });
  }

  async getInquiryLedInfo(litigationId: string) {
    const resp = await this.auctionLedCardService.getInquiryLedInfo(litigationId);
    this.auctionLEDCard = resp.ledInfo || [];
    if (this.currentActiveLed) {
      this.auctionLedCardService.activeLedSubject.next(this.currentActiveLed);
    }
  }

  onTabChanged(event: MatTabChangeEvent, index: number) {
    this.tabIndex[index] = event.index;
  }
}
