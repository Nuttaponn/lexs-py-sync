import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { LoggerService } from '@app/shared/services/logger.service';
import { AdjustSubmitRequest } from '@lexs/lexs-client';
import { AuctionService } from '../auction.service';

@Component({
  selector: 'app-submit-release-announcement-dialog',
  templateUrl: './submit-release-announcement-dialog.component.html',
  styleUrls: ['./submit-release-announcement-dialog.component.scss'],
})
export class SubmitReleaseAnnouncementDialogComponent {
  public reason: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  public isSuccess = false;
  public aucRef: number = 0;
  constructor(
    private logger: LoggerService,
    private auctionService: AuctionService
  ) {}

  dataContext(data: any) {
    this.logger.info('dataContext SubmitReleaseAnnouncementDialogComponent', data);
    this.aucRef = Number(data.aucRef);
  }

  public async onClose(): Promise<boolean> {
    this.logger.info('onClose SubmitReleaseAnnouncementDialogComponent');
    this.reason.markAllAsTouched();
    if (this.reason.valid) {
      try {
        const request: AdjustSubmitRequest = {
          reason: this.reason.value,
        };
        await this.auctionService.postUnmatchAuctionLitigationCase(this.aucRef, request);
        this.isSuccess = true;
        return true;
      } catch (error) {
        return false;
      }
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
