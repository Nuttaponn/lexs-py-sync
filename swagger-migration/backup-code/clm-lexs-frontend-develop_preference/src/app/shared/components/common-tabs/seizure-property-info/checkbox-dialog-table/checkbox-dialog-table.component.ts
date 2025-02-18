import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { DefermentService } from '@app/modules/deferment/deferment.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils';
import { CollateralAuctionInfo } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-checkbox-dialog-table',
  templateUrl: './checkbox-dialog-table.component.html',
  styleUrls: ['./checkbox-dialog-table.component.scss'],
})
export class CheckboxDialogTableComponent implements OnInit {
  public tableColumnssale: Array<string> = ['selection', 'aucRound', 'bidDate', 'aucResult'];
  public auctionInfos: CollateralAuctionInfo[] = [];
  public auctionInfosTemp: CollateralAuctionInfo[] = [];
  blackCaseNo!: string;
  redCaseNo!: string;
  isViewMode: boolean = false;
  hasExtendDeferment: boolean = false;
  hasCheckbox: boolean = true;
  messageBanner: string = '';
  submitClicked: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<CheckboxDialogTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private defermentService: DefermentService
  ) {}

  ngOnInit(): void {
    this.auctionInfos = Utils.deepClone(this.data?.context?.auctionInfos || []);
    this.auctionInfosTemp = Utils.deepClone(this.data?.context?.auctionInfos || []);
    this.blackCaseNo = this.data?.context?.blackCaseNo;
    this.redCaseNo = this.data?.context?.redCaseNo;
    this.isViewMode = this.data?.context?.isViewMode || false;
    this.hasExtendDeferment = this.data?.context?.hasExtendDeferment || false;
    this.checkNoAppoint();
    if (this.isViewMode) {
      this.tableColumnssale.splice(0, 1);
    }
    this.getMessageBanner();
  }

  backButtonClicked() {
    this.auctionInfos = this.auctionInfosTemp;
    const returnData = {
      auctionInfos: this.auctionInfos,
    };
    this.dialogRef.close(returnData);
  }

  onSubmit() {
    this.submitClicked = true;
    if (!this.isCheckbox) {
      return;
    }
    const returnData = {
      auctionInfos: this.auctionInfos,
    };
    this.dialogRef.close(returnData);
    if (this.auctionInfosEnable.some(e => e.checked)) {
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('LAWSUIT.DEFERMENT.CHOOSE_APPOINTMENT_SUCCESS')
      );
    }
  }

  getMessageBanner() {
    if (this.hasCheckbox) {
      this.messageBanner = `1. ${this.translate.instant(
        'LAWSUIT.DEFERMENT.APPOINTMENT_DIALOG_INFO_1'
      )}<br>2. ${this.translate.instant('LAWSUIT.DEFERMENT.APPOINTMENT_DIALOG_INFO_2')}`;
    } else {
      this.messageBanner = 'LAWSUIT.DEFERMENT.TOOLTIP_NO_APPOINTMENT';
    }
  }

  isGreaterCurrentDate(bidDate: string) {
    return this.defermentService.isGreaterCurrentDate(bidDate);
  }

  isNotAucResult(aucResult: CollateralAuctionInfo.AucResultEnum) {
    return this.defermentService.isNotAucResult(aucResult);
  }

  get auctionInfosEnable() {
    return this.auctionInfos.filter(e => this.defermentService.canSelectAppointment(e));
  }

  get isCheckbox() {
    return this.auctionInfosEnable.some(e => e.checked);
  }

  checkNoAppoint() {
    this.hasCheckbox = this.auctionInfos.some(e => {
      return this.defermentService.canSelectAppointment(e);
    });
  }

  isAllSelected() {
    return this.auctionInfosEnable.every(e => e.checked);
  }

  isIndeterminate() {
    return this.auctionInfosEnable.some(e => e.checked) && !this.isAllSelected();
  }

  selectAll() {
    if (this.isAllSelected()) {
      this.auctionInfosEnable.forEach(e => (e.checked = false));
    } else {
      this.auctionInfosEnable.forEach(e => (e.checked = true));
    }
  }

  onCheck(element: CollateralAuctionInfo, index: number) {
    this.submitClicked = false;
    this.auctionInfos[index].checked = !element.checked;
  }

  checkDisable(index: number) {
    if (this.auctionInfosEnable.every(e => !e.checked) || this.hasExtendDeferment) {
      return false;
    } else {
      if (this.auctionInfos[index - 1]?.checked || this.auctionInfos[index + 1]?.checked) {
        if (this.auctionInfos[index - 1]?.checked && this.auctionInfos[index + 1]?.checked) return true;
        return false;
      }
      if (this.auctionInfos[index]?.checked && this.auctionInfosEnable.filter(e => e.checked).length === 1) {
        return false;
      }
      return true;
    }
  }
}
