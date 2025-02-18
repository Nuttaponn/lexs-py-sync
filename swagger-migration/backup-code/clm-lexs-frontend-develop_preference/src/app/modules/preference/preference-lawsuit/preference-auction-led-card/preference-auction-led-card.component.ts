import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AuctionService } from '@app/modules/auction/auction.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { AuctionLedCardModule } from '@app/shared/components/common-tabs/auction-led-card/auction-led-card.module';
import { IActiveLed, AuctionLedCardService } from '@app/shared/components/common-tabs/auction-led-card/auction-led-card.service';
import { SharedModule } from '@app/shared/shared.module';
import { AuctionLitigationConveyanceProcessDto } from '@lexs/lexs-client';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

@Component({
  selector: 'app-preference-auction-led-card',
  standalone: true,
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, AuctionLedCardModule],
  templateUrl: './preference-auction-led-card.component.html',
  styleUrl: './preference-auction-led-card.component.scss'
})
export class PreferenceAuctionLedCardComponent {
  public auctionLEDCard: any[] = [];
  public isOpenedList: boolean[] = [];
  public tabIndex: number[] = [];
  public litigationId: string | undefined;
  public announcementInfo = new MatTableDataSource<AuctionLitigationConveyanceProcessDto>([]);

  public currentActiveLed: IActiveLed | undefined;
  public auctionCaseTypeCode: string = '';

  constructor(
    private auctionLedCardService: AuctionLedCardService,
    private lawsuitService: LawsuitService,
    private auctionService: AuctionService
  ) {}

  async ngOnInit(): Promise<void> {
    const litigationId = this.lawsuitService.currentLitigation.litigationId;
    this.litigationId = litigationId || '';
    this.auctionCaseTypeCode = this.auctionService.auctionCaseTypeCode;
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
    const response = await this.auctionService.inquiryLedInfoPreferential(litigationId);
    this.auctionLEDCard = response.ledInfo || [];
    if (this.currentActiveLed) {
      this.auctionLedCardService.activeLedSubject.next(this.currentActiveLed);
    }
  }

  onTabChanged(event: MatTabChangeEvent, index: number) {
    this.tabIndex[index] = event.index;
  }
}
