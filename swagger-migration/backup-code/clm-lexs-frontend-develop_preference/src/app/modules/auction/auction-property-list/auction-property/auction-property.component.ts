import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mode, auctionActionCode } from '@app/shared/models';
import { AucCollateralColType } from '../../auction.model';

@Component({
  selector: 'app-auction-property',
  templateUrl: './auction-property.component.html',
  styleUrls: ['./auction-property.component.scss'],
})
export class AuctionPropertyComponent implements OnInit {
  public MODE = Mode;
  isViewMode = this.route.snapshot.queryParams['mode'] === this.MODE.VIEW;

  @Input() data!: any;
  @Input() isOpened!: any;
  @Input() npaStatus!: any;
  @Input() collateralColumns!: any[];
  @Input() fsubbidNumDefault!: any;
  @Input() actionCode!: auctionActionCode;
  @Input() config: any;
  public dataDetail!: any;
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
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (!this.fsubbidNumDefault) {
      this.route.queryParams.subscribe(params => {
        this.fsubbidNumDefault = params['fsubbidnum'];
      });
    }
  }
}
