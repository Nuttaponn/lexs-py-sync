import { Component } from '@angular/core';
import { AucCollateralColType } from '@app/modules/auction/auction.model';
import { auctionActionCode } from '@app/shared/models';
import { InquiryBiddingCollateralResponse } from '@lexs/lexs-client';

@Component({
  selector: 'app-auc-announement-collateral-set-dialog',
  templateUrl: './auc-announement-collateral-set-dialog.component.html',
  styleUrls: ['./auc-announement-collateral-set-dialog.component.scss'],
})
export class AucAnnounementCollateralSetDialogComponent {
  public collateralColumns = [
    AucCollateralColType.orderNumber,
    AucCollateralColType.fsubbidnum,
    AucCollateralColType.assettypedesc,
    AucCollateralColType.landtype,
    AucCollateralColType.collateralDocNo,
    AucCollateralColType.assetDetail,
    AucCollateralColType.redCaseNo,
    AucCollateralColType.saletypedesc,
    AucCollateralColType.debtname,
    AucCollateralColType.ownername,
    AucCollateralColType.personName1,
    AucCollateralColType.personName2,
    AucCollateralColType.occupant,
    AucCollateralColType.ledname,
    AucCollateralColType.remark,
    AucCollateralColType.col15,
    AucCollateralColType.col16,
    AucCollateralColType.action,
  ];
  dataAuctionCollaterals!: InquiryBiddingCollateralResponse;
  actionCode: auctionActionCode = 'R2E09-16282';
  fsubbidnum!: number;

  constructor() {}

  async dataContext(data: any) {
    this.dataAuctionCollaterals = data.data;
    this.fsubbidnum = data.fsubbidnum;
  }

  get returnData() {
    return;
  }

  public async onClose(): Promise<boolean> {
    return true;
  }
}
