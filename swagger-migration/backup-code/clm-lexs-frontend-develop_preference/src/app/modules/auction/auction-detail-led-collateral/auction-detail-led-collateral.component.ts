import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant';
import { TMode, auctionActionCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import { AucCollateralColType } from '../auction.model';
import { AuctionService } from '../auction.service';
import { AuctionDetails } from '@lexs/lexs-client';

@Component({
  selector: 'app-auction-detail-led-collateral',
  templateUrl: './auction-detail-led-collateral.component.html',
  styleUrls: ['./auction-detail-led-collateral.component.scss'],
})
export class AuctionDetailLedCollateralComponent implements OnInit {
  @Input() data: Array<AuctionDetails> = [];
  @Output() onUpdateSelectItem = new EventEmitter<any>();

  isOpened: boolean = true;
  mode: TMode = '' as TMode;
  public actionCode!: auctionActionCode;
  ACTION_TYPE = auctionActionCode;
  tableConfig = { hasTotal: true };

  public dataMatche: Array<AuctionDetails> = [];
  public dataUnMatche: Array<AuctionDetails> = [];

  public propertyContact: UntypedFormControl = new UntypedFormControl('N/A');
  public typeFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public statusFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public dropdownFilterGroupConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'ชุดทรัพย์',
  };
  public dropdownFilterDocumentConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'เลขที่เอกสารสิทธิ์',
  };

  public dropdownDocNoSortConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Sorting',
    labelPlaceHolder: 'เลขที่เอกสารสิทธิ์: จากน้อยไปมาก',
  };

  public collateralGroupOption: SimpleSelectOption[] = [
    { text: 'Group1', value: '1' },
    { text: 'Group2', value: '2' },
  ];
  public statusFilterOption: SimpleSelectOption[] = [
    { text: 'Doc1', value: '1' },
    { text: 'Doc2', value: '2' },
  ];
  public docNoSortOption: SimpleSelectOption[] = [
    { text: 'เลขที่เอกสารสิทธิ์: จากน้อยไปมาก', value: 'ASC' },
    { text: 'เลขที่เอกสารสิทธิ์: จากมากไปน้อย', value: 'DESC' },
  ];

  public TABLE_FILTER_KEY = {
    TYPE: 'collateralType',
    STATUS: 'status',
  };

  propertyConfig: any;

  LEXS_STATUS: any;
  isEditMode: any;

  public selection = new SelectionModel<string>(true, []);

  private defaultColumnConfig = [
    AucCollateralColType.orderNumber,
    AucCollateralColType.fsubbidnum,
    AucCollateralColType.assettypedesc,
    AucCollateralColType.landtype,
    AucCollateralColType.deedno,
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
  public collateralCheckColumns = [...this.defaultColumnConfig, AucCollateralColType.action];
  public collateralMatchedColumns = [
    ...this.defaultColumnConfig,
    AucCollateralColType.announceLink,
    AucCollateralColType.statusSuccess,
    AucCollateralColType.action,
  ];
  public collateralUnmatchedColumns: any = [];
  public pageSize = 10;
  public pageIndex: number = 1;
  tabIndex: number = 0;
  constructor(
    private logger: LoggerService,
    private auctionService: AuctionService
  ) {}

  ngOnInit(): void {
    this.logger.info('[AuctionDetailLedCollateralComponent][ngOnInit]', this.auctionService.auctionCollaterals);
    this.actionCode = this.auctionService.actionCode as auctionActionCode;
    this.mode = this.auctionService.mode as TMode;
    this.dataMatche = this.data.filter(it => it.collateralMatched === true);
    this.dataUnMatche = this.data.filter(it => it.collateralMatched !== true);
    if (this.mode === 'VIEW') {
      this.collateralUnmatchedColumns = [...this.defaultColumnConfig, AucCollateralColType.statusPending];
    } else {
      this.collateralUnmatchedColumns = [
        ...this.defaultColumnConfig,
        AucCollateralColType.announceLink,
        AucCollateralColType.statusPending,
        AucCollateralColType.action,
      ];
    }
    setTimeout(() => {
      this.tabIndex = this.auctionService.previousIndexCollateralDetail || 0;
    });
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.logger.info('[AuctionDetailLedCollateralComponent][viewAnnouncementDocument]', event.index);
    this.tabIndex = event.index;
    this.auctionService.previousIndexCollateralDetail = event.index;
  }
}
