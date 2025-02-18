import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AuctionLedsAnnouncesResponse, LedInfoDto } from '@lexs/lexs-client';
import { AuctionLedCardService } from '../auction-led-card.service';

@Component({
  selector: 'app-auction-led-card-announcement',
  templateUrl: './auction-led-card-announcement.component.html',
  styleUrls: ['./auction-led-card-announcement.component.scss'],
})
export class AuctionLEDCardAnnouncementComponent implements OnInit {
  public tabIndex: number = 0;
  public dataSource: MatTableDataSource<AuctionLedsAnnouncesResponse> =
    new MatTableDataSource<AuctionLedsAnnouncesResponse>();

  @Input() initTab: number = 0;
  @Input() totalProcessAnnounces: number = 0;
  @Input() ledInfo!: LedInfoDto;

  constructor(private auctionLedCardService: AuctionLedCardService) {}

  async ngOnInit(): Promise<void> {
    this.tabIndex = this.initTab;
    await this.getAuctionAnnounceData();
  }

  async onTabChanged(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
    await this.getAuctionAnnounceData();
  }

  async getAuctionAnnounceData() {
    let response: AuctionLedsAnnouncesResponse[];
    if (this.tabIndex === 0) {
      response = await this.auctionLedCardService.getAuctionAnnounceProcess(
        this.ledInfo.ledId,
        this.ledInfo.litigationCaseId
      );
    } else if (this.tabIndex === 1) {
      response = await this.auctionLedCardService.getAuctionAnnounceComplete(
        this.ledInfo.ledId,
        this.ledInfo.litigationCaseId
      );
    } else {
      response = [];
    }
    this.dataSource.data = response;
    this.dataSource.filteredData = this.dataSource.data.slice(0, 10);
  }
}
