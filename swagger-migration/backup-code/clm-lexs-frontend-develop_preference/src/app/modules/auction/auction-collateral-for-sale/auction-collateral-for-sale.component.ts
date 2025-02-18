import { Component, Input } from '@angular/core';
import { DocumentService } from '@shared/components/document-preparation/document.service';
import { DocumentDto, LatestResolutionInfoResponse } from '@lexs/lexs-client';
import { RESOLUTION_MAPPING } from '../auction.const';

@Component({
  selector: 'app-auction-collateral-for-sale',
  templateUrl: './auction-collateral-for-sale.component.html',
  styleUrls: ['./auction-collateral-for-sale.component.scss'],
})
export class AuctionCollateralForSaleComponent {
  @Input() data: LatestResolutionInfoResponse | undefined;
  @Input() isViewMode: boolean = true;
  public isOpened: boolean = true;
  public resolution = RESOLUTION_MAPPING;
  constructor(private documentService: DocumentService) {}

  async navigateTo() {
    const response: any = await this.documentService.getDocument(
      this.data?.chronicleId || '',
      DocumentDto.ImageSourceEnum.Imp
    );
    if (!response) return;
    const fileName = 'ประวัติมติ' ?? 'doc';
    this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
  }
}
