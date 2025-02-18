import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { LoggerService } from '@app/shared/services/logger.service';
import { AuctionBiddingResult, AuctionBiddingResultsRequest, BidDate } from '@lexs/lexs-client';
import { AuctionService } from '../auction.service';
import { AuctionResultSubmitStatus } from '../auction.const';

@Component({
  selector: 'app-submit-result-suspend-sale-dialog',
  templateUrl: './submit-result-suspend-sale-dialog.component.html',
  styleUrls: ['./submit-result-suspend-sale-dialog.component.scss'],
})
export class SubmitResultSuspendSaleDialogComponent implements OnInit {
  public reason: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  public remark: UntypedFormControl = new UntypedFormControl('');
  public selectedItem: UntypedFormControl = new UntypedFormControl([], [Validators.required]);
  selectItems: any[] = [];
  bidDates: Array<BidDate> = [];
  aucBiddingStatus: string = '';
  aucRound: number = 0;
  auctionBiddingId = '';
  isSuccess = false;
  constructor(
    private logger: LoggerService,
    private auctionService: AuctionService
  ) {}

  ngOnInit(): void {
    this.logger.info('ngOnInit SubmitResultSuspendSaleDialogComponent');
    this.bidDates = this.auctionService.auctionBidingInfoResponse?.bidDates || [];
    this.aucBiddingStatus = this.auctionService.auctionBidingInfoResponse?.aucBiddingStatus || '';
    this.aucRound = this.auctionService.auctionBidingInfoResponse?.aucRound || 0;
  }

  dataContext(data: any) {
    console.log('dataContext SubmitResultSuspendSaleDialogComponent', data);
    this.selectItems = data.selectItem;
    this.auctionBiddingId = data.auctionBiddingId;
  }

  public async onClose(): Promise<boolean> {
    this.logger.info('onClose SubmitResultSuspendSaleDialogComponent');
    this.reason.markAllAsTouched();
    this.selectedItem.markAllAsTouched();
    if (this.reason.valid && this.selectedItem.valid) {
      const selectValues = this.selectedItem.value;
      const selectItems = this.bidDates.filter((it: any) => {
        const matched = selectValues.includes(it.number || 0);
        return matched;
      });
      const payload: AuctionBiddingResultsRequest = {
        aucBiddingResults: this.selectItems.map(it => {
          return {
            deedGroupId: it.deedGroupId,
            aucResult: AuctionResultSubmitStatus.CANCEL,
            cancelReasonType: this.reason.value,
            cancelBidDates: selectItems.map(it => it.bidDate),
            remark: this.remark.value,
          } as AuctionBiddingResult;
        }),
      };
      await this.auctionService.postAuctionBiddingResult(this.auctionBiddingId, payload);
      this.isSuccess = true;
      return true;
    } else {
      this.isSuccess = false;
      return false;
    }
  }

  get returnData() {
    return {
      isSuccess: this.isSuccess,
    };
  }

  onRadioChange(e: any) {
    this.logger.info('onRadioChange SubmitResultSuspendSaleDialogComponent', e);
  }

  updateSelectItem($event: any) {
    this.selectedItem.setValue($event.selected);
  }
}
