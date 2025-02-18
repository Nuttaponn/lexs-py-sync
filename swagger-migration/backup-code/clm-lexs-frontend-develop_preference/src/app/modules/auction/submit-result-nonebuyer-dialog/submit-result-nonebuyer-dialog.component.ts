import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { LoggerService } from '@app/shared/services/logger.service';
import { AuctionBiddingResult, AuctionBiddingResultsRequest } from '@lexs/lexs-client';
import { AuctionService } from '../auction.service';
import { AuctionResultSubmitStatus } from '../auction.const';

@Component({
  selector: 'app-submit-result-nonebuyer-dialog',
  templateUrl: './submit-result-nonebuyer-dialog.component.html',
  styleUrls: ['./submit-result-nonebuyer-dialog.component.scss'],
})
export class SubmitResultNonebuyerDialogComponent implements OnInit {
  public remark: UntypedFormControl = new UntypedFormControl('');
  selectItems: any[] = [];
  auctionBiddingId = '';
  isSuccess = false;

  constructor(
    private logger: LoggerService,
    private auctionService: AuctionService
  ) {}

  ngOnInit(): void {
    this.logger.info('ngOnInit SubmitResultNonebuyerDialogComponent');
  }

  dataContext(data: any) {
    console.log('dataContext SubmitResultNonebuyerDialogComponent', data);
    this.selectItems = data.selectItem;
    this.auctionBiddingId = data.auctionBiddingId;
  }

  public async onClose(): Promise<boolean> {
    this.logger.info('onClose SubmitResultNonebuyerDialogComponent');
    this.remark.markAllAsTouched();
    if (this.remark.valid) {
      const payload: AuctionBiddingResultsRequest = {
        aucBiddingResults: this.selectItems.map(it => {
          return {
            deedGroupId: it.deedGroupId,
            aucResult: AuctionResultSubmitStatus.UNSOLD,
            unsoldReasonType: 'NO_BIDDER',
            unsoldObjectBuyer: '',
            unsoldObjectHighestBidder: '',
            unsoldObjectPrice: it?.npaResolutionSummary?.totalAppraisalValue,
            unsoldObjectDissident: '',
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
}
