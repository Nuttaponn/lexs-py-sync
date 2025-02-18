import { Component, OnInit } from '@angular/core';
import { auctionActionCode } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { CollateralTableGroupConfig, TableAuctionModel, columnNameType } from '../auction.model';
import { AuctionService } from '../auction.service';

@Component({
  selector: 'app-auction-conclusion-history',
  templateUrl: './auction-conclusion-history.component.html',
  styleUrls: ['./auction-conclusion-history.component.scss'],
})
export class AuctionConclusionHistoryComponent implements OnInit {
  public collaterals!: any;
  public title = 'AUCTION_DETAIL.NPA.HISTORY_TITLE_NPA';
  public actionCode = auctionActionCode.R2E09_3_16757;
  public tableConfig: CollateralTableGroupConfig = {
    hasExpand: true,
    hasAction: true,
  };
  public aucRef!: any;
  public tableColumns: TableAuctionModel[] = [
    {
      colName: columnNameType.orderNumber,
      hideCol: false,
    },
    {
      colName: columnNameType.fsubbidnum,
      hideCol: false,
      isHyperlink: true,
      hyperlinkKey: 'view_group',
    },
    {
      colName: columnNameType.col2,
      hideCol: false,
    },
    {
      colName: columnNameType.saleTypeDesc,
      hideCol: false,
    },
    {
      colName: columnNameType.col4,
      hideCol: false,
      isNumber: true,
    },
    {
      colName: columnNameType.col5,
      hideCol: false,
      isNumber: true,
    },
    {
      colName: columnNameType.col6,
      hideCol: false,
      isNumber: true,
    },
    {
      colName: columnNameType.col7,
      hideCol: false,
      isDate: true,
    },
    {
      colName: columnNameType.col8,
      hideCol: false,
      isHyperlink: true,
      hyperlinkKey: 'view_doc',
    },
    {
      colName: columnNameType.action,
      hideCol: false,
    },
  ];

  constructor(
    private auctionService: AuctionService,
    private routerService: RouterService
  ) {}

  ngOnInit() {
    this.tableConfig = {
      hasExpand: true,
      hasAction: true,
    };
    this.aucRef = this.auctionService.aucRef;
    this.collaterals = this.auctionService.auctionResolutionsHistory;
  }

  onBack() {
    this.routerService.back();
  }

  onCancel() {
    this.onBack();
  }
}
