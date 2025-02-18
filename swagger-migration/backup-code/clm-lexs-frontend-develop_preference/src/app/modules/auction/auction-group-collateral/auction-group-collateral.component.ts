import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { auctionActionCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { CollateralTableGroupConfig, TableAuctionModel, columnNameType } from '../auction.model';

@Component({
  selector: 'app-auction-group-collateral',
  templateUrl: './auction-group-collateral.component.html',
  styleUrls: ['./auction-group-collateral.component.scss'],
})
export class AuctionGroupCollateralComponent implements OnInit {
  @Input() mode: any = 'EDIT';
  @Input() data!: any;
  @Output() clickSubmitResult = new EventEmitter();
  @Output() onUpdateData = new EventEmitter();

  @Input() title: string = 'PROPERTY.PROPERTY_LIST';
  @Input() actionCode!: auctionActionCode;
  @Input() tableConfig: CollateralTableGroupConfig = {
    hasAction: true,
    hasExpand: false,
    hasFilter: true,
  };

  @Input() tableColumnsList!: TableAuctionModel[];
  @Input() isOpened = true;
  @Input() aucRef!: any;
  @Input() bidDate!: string | undefined;

  public tableColumns!: TableAuctionModel[];
  public selection = new SelectionModel<string>(true, []);

  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.info('AuctionGroupCollateralComponent -> ngOnInit');

    this.tableColumns = this.tableColumnsList;
    this.logger.info('AuctionGroupCollateralComponent => data ', this.data);
    this.logger.info('AuctionGroupCollateralComponent => tableColumns ', this.tableColumns);
  }

  async hyperlinkClick($event: any) {
    this.logger.info('AuctionGroupCollateralComponent => hyperlinkClick', $event);
  }

  updateSelectItem($event: any) {
    this.logger.info('AuctionGroupCollateralComponent => updateSelectItem', $event);
    this.selection = $event;
  }

  submitResult($event: any) {
    this.logger.info('AuctionGroupCollateralComponent => submitResult', $event);
    this.clickSubmitResult.emit($event);
  }

  updateDate(e: any) {
    this.onUpdateData.emit();
  }
}
