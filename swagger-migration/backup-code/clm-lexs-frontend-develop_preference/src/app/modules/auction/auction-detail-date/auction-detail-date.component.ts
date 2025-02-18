import { Component, Input, OnInit } from '@angular/core';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { DocumentDto } from '@lexs/lexs-client';
import { RESOLUTION_MAPPING } from '../auction.const';

@Component({
  selector: 'app-auction-detail-date',
  templateUrl: './auction-detail-date.component.html',
  styleUrls: ['./auction-detail-date.component.scss'],
})
export class AuctionDetailDateComponent implements OnInit {
  public isOpened: Boolean = true;
  @Input() data!: any;
  public resolution = RESOLUTION_MAPPING;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    console.log('data AuctionDetailDateComponent', this.data);
  }

  async onViewDocument(dataId: any) {
    const response: any = await this.documentService.getDocument(dataId || '', DocumentDto.ImageSourceEnum.Imp);
    if (!response) return;
    const fileName = 'มติ' ?? 'doc';
    this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
  }
}
