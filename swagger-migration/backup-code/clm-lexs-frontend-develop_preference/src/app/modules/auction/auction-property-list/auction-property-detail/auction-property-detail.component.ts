import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mode, auctionActionCode } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { AucCollateralColType } from '../../auction.model';
import { AuctionService } from '../../auction.service';

@Component({
  selector: 'app-auction-property-detail',
  templateUrl: './auction-property-detail.component.html',
  styleUrls: ['./auction-property-detail.component.scss'],
})
export class AuctionPropertyDetailComponent implements OnInit {
  public isOpened: boolean = true;

  public MODE = Mode;
  isViewMode = this.route.snapshot.queryParams['mode'] === this.MODE.VIEW;
  public fsubbidnum!: any;
  public aucRef!: any;
  public npaStatus!: any;
  public actionCode = auctionActionCode.R2E09_16282;
  public data!: any;
  private defaultColumnConfig = [
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
  ];

  public collateralUnmatchedColumns = [
    ...this.defaultColumnConfig,
    AucCollateralColType.col15,
    AucCollateralColType.col16,
    AucCollateralColType.action,
  ];
  //****
  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,
    private auctionService: AuctionService
  ) {}

  ngOnInit() {
    this.npaStatus = this.auctionService.npaStatus;
    this.aucRef = this.auctionService.aucRef;
    this.fsubbidnum = this.auctionService.fsubbidnum;

    console.log('this.fsubbidnum', this.fsubbidnum);
    console.log('this.aucRef', this.aucRef);
    console.log('this.npaStatus', this.npaStatus);
    //open this for API
    this.data = this.auctionService.auctionInquiryBiddingCollaterals;
  }

  onBack() {
    this.routerService.back();
  }
}
