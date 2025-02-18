import { Inject, Injectable } from '@angular/core';
import { BlobType, FileType } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { Utils } from '@app/shared/utils';
import { AuctionAnnounceSearchConditionRequest, AuctionControllerService } from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExternalDocumentsService {
  private _currentTab: number | null = null;
  get currentTab(): number {
    return this._currentTab || 0;
  }

  set currentTab(currentTab: number) {
    this._currentTab = currentTab;
  }

  public announceKtbTab = 0;

  constructor(
    @Inject(AuctionControllerService) private auctionControllerService: AuctionControllerService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  getAuctionAnnounces(aucStatus: Array<string>, matchStatus?: Array<string>, aucRef?: number, auctionAnnounceSource?: Array<string>) {
    return this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.inquiryAnnounces(aucStatus, matchStatus, aucRef, auctionAnnounceSource))
    );
  }

  async getAuctionAnnounceExcel(
    aucStatus: Array<string>,
    request: AuctionAnnounceSearchConditionRequest,
    filename: string,
    sortOrder?: string,
    matchStatus?: Array<string>,
    auctionAnnounceSource?: Array<string>,
    sortBy?: Array<string>
  ) {
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.announcesExcel(aucStatus, request, sortOrder, matchStatus, auctionAnnounceSource, sortBy))
    );
    Utils.saveAsStrToBlobFile(
      response,
      filename || 'ใบประกาศที่ดำเนินการ' + FileType.EXCEL_SHEET,
      BlobType.EXCEL_SHEET
    );
  }
}
