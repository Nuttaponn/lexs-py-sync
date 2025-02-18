import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { UntypedFormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant';
import { TMode, auctionActionCode, taskCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { RouterService } from '@app/shared/services/router.service';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import { AuctionService } from '../../../modules/auction/auction.service';
import { AuctionDetails } from '@lexs/lexs-client';
import { TaskService } from '@app/modules/task/services/task.service';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-auction-detail-led-collateral-table',
  templateUrl: './auction-detail-led-collateral-table.component.html',
  styleUrls: ['./auction-detail-led-collateral-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AuctionDetailLedCollateralTableComponent implements OnInit {
  @Input() data!: any;
  @Input() mode!: TMode;
  @Input() npaStatus!: any;
  @Input() actionCode!: auctionActionCode;
  @Input() collateralColumns!: any[];
  @Input() buttonType: 'MATCH' | 'EDIT' | 'RE_SELECT' | 'MAPPING' = 'MATCH';
  @Input() dataType: 'LED' | 'LEXS_VERIFY' | 'LEXS_MAPPING' = 'LED';
  @Input() config: any;
  @Input() pinData: any | undefined;
  @Input() selectCollateralId: any;
  @Output() onUpdateSelectItem = new EventEmitter<any>();
  @Output() onReSelectCollateral = new EventEmitter<any>();
  @Output() onAddCollateralLexs = new EventEmitter<string>();
  @Input() fsubbidNumDefault!: any;
  @Input() specificFlag!: 'EXECUTION';

  @ViewChild('paginator') paginator!: any;
  public allCurrentData: any[] = [];
  public piningTableColumns: any = [];
  public ACTION_TYPE = auctionActionCode;
  public typeFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public statusFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public landTypeFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public sortControl: UntypedFormControl = new UntypedFormControl('ASC');
  public dropdownFilterGroupConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'ชุดทรัพย์',
    defaultValue: 'All',
  };
  public dropdownFilterDocumentConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'เลขที่เอกสารสิทธิ์',
    defaultValue: 'All',
  };
  public dropdownDocNoSortConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Sorting',
    labelPlaceHolder: 'เลขที่เอกสารสิทธิ์: จากน้อยไปมาก',
  };
  public collateralGroupOption: SimpleSelectOption[] = [];
  public deedNoFilterOption: SimpleSelectOption[] = [];
  public docNoSortOption: SimpleSelectOption[] = [
    { text: 'เลขที่เอกสารสิทธิ์: จากน้อยไปมาก', value: 'ASC' },
    { text: 'เลขที่เอกสารสิทธิ์: จากมากไปน้อย', value: 'DESC' },
  ];
  public landTypeOption: SimpleSelectOption[] = [];
  public pageSize = 10;
  private startIndex: number = 1;
  public selection = new SelectionModel<string>(true, []);
  public collateralsSource = new MatTableDataSource<any>([]);
  private filterDictionary = new Map<string, string>();
  public totalAmount: number = 0;
  public totalCollateral: number = 0;
  private dataShow: any = {};
  private taskCode!: taskCode;

  get displayPropertDetail() {
    return [auctionActionCode.R2E09_16282].includes(this.actionCode);
  }

  get displayAuctionDetail() {
    return [auctionActionCode.R2E09_04_01_11].includes(this.actionCode);
  }

  get isItemPaymentResult() {
    return [taskCode.R2E09_05_01_12A].includes(this.taskCode);
  }

  public isDeedno!: Boolean;

  public TABLE_FILTER_KEY = {
    GROUP: 'fsubbidnum',
    DEEDNO: 'ledOriginalDeedno',
    LANDTYPE: 'landtype',
    COLLATERALDOCNO: 'collateralDocNo',
  };

  constructor(
    private logger: LoggerService,
    private routerService: RouterService,
    private auctionService: AuctionService,
    private taskService: TaskService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.logger.info('[AuctionDetailLedCollateralComponent][ngOnInit]', this.selectCollateralId);
    console.log('this.data end', this.data);
    console.log('actionCode AuctionDetailLedCollateralComponent', this.actionCode);
    this.taskCode = this.taskService.taskDetail?.taskCode as taskCode;
    this.initPropertyDetail();
  }

  initPropertyDetail() {
    console.log('collateralColumns', this.collateralColumns);
    console.log('is displayPropertDetail', this.displayPropertDetail);

    if (this.displayPropertDetail) {
      this.data.deedGroups.forEach((y: any) => {
        y.deeds.forEach((x: any) => {
          let tempExpand = [];
          tempExpand.push(x.initialDeedInfoValidation, x.finalDeedInfoValidation);
          x.deedInfoValidationList = tempExpand;
          x.fsubbidnum = y.fsubbidnum;
          x.totalDeeds = y.totalDeeds;
          x.deedGroupId = y.deedGroupId;
          console.log('ff');
        });
      });

      if (!this.fsubbidNumDefault || this.fsubbidNumDefault === 'All') {
        let tempDataGroupDeeds = this.data.deedGroups.flatMap((it: any) =>
          it.deeds.flatMap((c: any) => {
            return {
              ...c,
            };
          })
        );
        let countNumberTotaldeed = 0;
        tempDataGroupDeeds.forEach((v: any) => {
          countNumberTotaldeed = +v.totalDeeds + countNumberTotaldeed;
        });
        this.dataShow.deeds = tempDataGroupDeeds;
        this.dataShow.totalDeeds = countNumberTotaldeed;
        this.typeFilterControl = new UntypedFormControl('All');
        console.log('countNumberTotaldeed', countNumberTotaldeed);
        console.log('typeFilterControl 1', this.typeFilterControl);
      } else {
        if (this.npaStatus) {
          this.dataShow = this.data.deedGroups.find((x: any) => x.fsubbidnum === this.fsubbidNumDefault);
          this.typeFilterControl = new UntypedFormControl(this.fsubbidNumDefault);
        } else {
          this.dataShow = this.data.deedGroups.find((x: any) => x.fsubbidnum === this.fsubbidNumDefault);
          this.typeFilterControl = new UntypedFormControl(this.dataShow.fsubbidnum);
        }
        console.log('typeFilterControl 2', this.typeFilterControl);
        console.log('dataShow 1', this.dataShow);
      }
      this.collateralsSource.data = this.dataShow.deeds
        .sort((a: any, b: any) => {
          const result = a.fsubbidnum.toString().localeCompare(b.fsubbidnum.toString(), 'en', { numeric: true });
          return result;
        })
        .sort((a: any, b: any) => {
          const result = a.collateralDocNo
            .toString()
            .localeCompare(b.collateralDocNo.toString(), 'en', { numeric: true });
          return result;
        })
        .map((it: any, index: number) => {
          return <any>{
            orderNumber: '' + (index + 1),
            ...it,
          };
        });
      this.collateralsSource.filterPredicate = this.getPredicate();
      this.collateralsSource.filteredData = this.collateralsSource.data.slice(0, 10);

      this.collateralGroupOption = this.data.deedGroups
        .sort((a: any, b: any) => {
          const result = a.fsubbidnum.toString().localeCompare(b.fsubbidnum.toString(), 'en', { numeric: true });
          return result;
        })
        .map((it: any) => {
          return {
            text: it.fsubbidnum ? `ชุดทรัพย์ที่ ${it.fsubbidnum}` : '-',
            value: it.fsubbidnum ? it.fsubbidnum : '-',
          } as SimpleSelectOption;
        });
      this.collateralGroupOption = this.getUniqueListByValue(this.collateralGroupOption);
      this.collateralGroupOption = [{ text: 'ชุดทรัพย์', value: 'All' } as SimpleSelectOption].concat(
        this.collateralGroupOption
      );
      this.totalAmount = this.dataShow.totalDeeds;

      this.deedNoFilterOption = this.dataShow.deeds
        .sort((a: any, b: any) => {
          const result = a.collateralDocNo
            .toString()
            .localeCompare(b.collateralDocNo.toString(), 'en', { numeric: true });
          return result;
        })
        .map((it: any) => {
          return {
            text: it.collateralDocNo ? it.collateralDocNo : '-',
            value: it.collateralDocNo ? it.collateralDocNo : '-',
          } as SimpleSelectOption;
        });
      this.deedNoFilterOption = this.getUniqueListByValue(this.deedNoFilterOption);
      this.deedNoFilterOption = [{ text: 'เลขที่เอกสารสิทธิ์', value: 'All' } as SimpleSelectOption].concat(
        this.deedNoFilterOption
      );
    } else if (this.displayAuctionDetail && this.actionCode === auctionActionCode.R2E09_04_01_11) {
      this.data.deedGroups.deeds.forEach((x: any) => {
        let tempExpand = [];
        tempExpand.push(x.initialDeedInfoValidation, x.finalDeedInfoValidation);
        x.deedInfoValidationList = tempExpand;
        x.fsubbidnum = this.data.deedGroups.fsubbidnum;
      });
      console.log('this.data   gggg', this.data);
      this.dataShow = this.data.deedGroups;
      console.log('this.dataShow', this.dataShow);

      this.collateralsSource.data = this.dataShow.deeds
        .sort((a: any, b: any) => {
          const result = a.collateralDocNo
            .toString()
            .localeCompare(b.collateralDocNo.toString(), 'en', { numeric: true });
          return result;
        })
        .map((it: any, index: number) => {
          return <any>{
            orderNumber: '' + (index + 1),
            ...it,
          };
        });
      console.log('this.collateralsSource.data', this.collateralsSource.data);
      this.deedNoFilterOption = this.dataShow.deeds
        .sort((a: any, b: any) => {
          const result = a.collateralDocNo
            .toString()
            .localeCompare(b.collateralDocNo.toString(), 'en', { numeric: true });
          return result;
        })
        .map((it: any) => {
          return {
            text: it.collateralDocNo ? it.collateralDocNo : '-',
            value: it.collateralDocNo ? it.collateralDocNo : '-',
          } as SimpleSelectOption;
        });
      this.deedNoFilterOption = this.getUniqueListByValue(this.deedNoFilterOption);
      this.deedNoFilterOption = [{ text: 'เลขที่เอกสารสิทธิ์', value: 'All' } as SimpleSelectOption].concat(
        this.deedNoFilterOption
      );
      this.collateralsSource.filterPredicate = this.getPredicate();
      this.collateralsSource.filteredData = this.collateralsSource.data.slice(0, 10);
    } else {
      if (
        ['EDIT', 'MATCH', 'MAPPING'].includes(this.buttonType) ||
        [auctionActionCode.R2E09_2_A].includes(this.actionCode)
      ) {
        this.collateralsSource.data = this.data
          .sort((a: any, b: any) => {
            const result = a.ledOriginalDeedno
              .toString()
              .localeCompare(b.ledOriginalDeedno.toString(), 'en', { numeric: true });
            return result;
          })
          .map((it: any, index: number) => {
            return <any>{
              orderNumber: '' + (index + 1),
              ...it,
            };
          });

        this.deedNoFilterOption = this.data
          .sort((a: any, b: any) => {
            const result = a.ledOriginalDeedno
              .toString()
              .localeCompare(b.ledOriginalDeedno.toString(), 'en', { numeric: true });
            return result;
          })
          .map((it: any) => {
            return {
              text: it.ledOriginalDeedno ? it.ledOriginalDeedno : '-',
              value: it.ledOriginalDeedno ? it.ledOriginalDeedno : '-',
            } as SimpleSelectOption;
          });
      } else {
        this.collateralsSource.data = this.data
          .sort((a: any, b: any) => {
            const result = a.collateralDocNo
              .toString()
              .localeCompare(b.collateralDocNo.toString(), 'en', { numeric: true });
            return result;
          })
          .map((it: any, index: number) => {
            return <any>{
              orderNumber: this.buttonType === 'RE_SELECT' ? '2' : '' + (index + 1),
              ...it,
            };
          });
        this.deedNoFilterOption = this.data
          .sort((a: any, b: any) => {
            const result = a.collateralDocNo
              .toString()
              .localeCompare(b.collateralDocNo.toString(), 'en', { numeric: true });
            return result;
          })
          .map((it: any) => {
            return {
              text: it.collateralDocNo ? it.collateralDocNo : '-',
              value: it.collateralDocNo ? it.collateralDocNo : '-',
            } as SimpleSelectOption;
          });
      }

      this.collateralsSource.filterPredicate = this.getPredicate();
      this.collateralsSource.filteredData = this.collateralsSource.data.slice(0, 10);
      this.collateralGroupOption = this.data
        .sort((a: any, b: any) => {
          const result = a.fsubbidnum.toString().localeCompare(b.fsubbidnum.toString(), 'en', { numeric: true });
          return result;
        })
        .map((it: any) => {
          return {
            text: it.fsubbidnum ? `ชุดทรัพย์ที่ ${it.fsubbidnum}` : '-',
            value: it.fsubbidnum ? it.fsubbidnum : '-',
          } as SimpleSelectOption;
        });

      this.landTypeOption = this.data.map((it: any) => {
        return { text: it.landtype ? it.landtype : '-', value: it.landtype ? it.landtype : '-' } as SimpleSelectOption;
      });

      this.collateralGroupOption = this.getUniqueListByValue(this.collateralGroupOption);
      this.deedNoFilterOption = this.getUniqueListByValue(this.deedNoFilterOption);
      this.landTypeOption = this.getUniqueListByValue(this.landTypeOption);

      this.collateralGroupOption = [{ text: 'ชุดทรัพย์', value: 'All' } as SimpleSelectOption].concat(
        this.collateralGroupOption
      );
      this.deedNoFilterOption = [{ text: 'เลขที่เอกสารสิทธิ์', value: 'All' } as SimpleSelectOption].concat(
        this.deedNoFilterOption
      );
      this.landTypeOption = [{ text: 'ประเภทประกันหลักย่อย', value: 'All' } as SimpleSelectOption].concat(
        this.landTypeOption
      );
      this.totalCollateral = this.collateralsSource.data.length;
    }
    this.allCurrentData = [...this.collateralsSource.data];
    this.sliceDataTable(this.collateralsSource.data);
    this.piningTableColumns = this.collateralColumns.map(it => `pin_${it}`);
  }

  initPropertyDetailFilter() {
    console.log('collateralColumns', this.collateralColumns);
    console.log('is displayPropertDetail', this.displayPropertDetail);

    if (this.displayPropertDetail) {
      this.data.deedGroups.forEach((y: any) => {
        y.deeds.forEach((x: any) => {
          let tempExpand = [];
          tempExpand.push(x.initialDeedInfoValidation, x.finalDeedInfoValidation);
          x.deedInfoValidationList = tempExpand;
          x.fsubbidnum = y.fsubbidnum;
          x.totalDeeds = y.totalDeeds;
          x.deedGroupId = y.deedGroupId;
          console.log('ff');
        });
      });

      if (!this.fsubbidNumDefault || this.fsubbidNumDefault === 'All') {
        let tempDataGroupDeeds = this.data.deedGroups.flatMap((it: any) =>
          it.deeds.flatMap((c: any) => {
            return {
              ...c,
            };
          })
        );
        let countNumberTotaldeed = 0;
        tempDataGroupDeeds.forEach((v: any) => {
          countNumberTotaldeed = +v.totalDeeds + countNumberTotaldeed;
        });
        this.dataShow.deeds = tempDataGroupDeeds;
        this.dataShow.totalDeeds = countNumberTotaldeed;
        this.typeFilterControl = new UntypedFormControl('All');
        console.log('countNumberTotaldeed', countNumberTotaldeed);
        console.log('typeFilterControl 1', this.typeFilterControl);
      } else {
        if (this.npaStatus) {
          this.dataShow = this.data.deedGroups.find((x: any) => x.fsubbidnum === this.fsubbidNumDefault);
          this.typeFilterControl = new UntypedFormControl(this.fsubbidNumDefault);
        } else {
          this.dataShow = this.data.deedGroups.find((x: any) => x.fsubbidnum === this.fsubbidNumDefault);
          this.typeFilterControl = new UntypedFormControl(this.dataShow.fsubbidnum);
        }
        console.log('typeFilterControl 2', this.typeFilterControl);
        console.log('dataShow 1', this.dataShow);
      }
      this.collateralsSource.data = this.dataShow.deeds
        .sort((a: any, b: any) => {
          const result = a.fsubbidnum.toString().localeCompare(b.fsubbidnum.toString(), 'en', { numeric: true });
          return result;
        })
        .sort((a: any, b: any) => {
          const result = a.collateralDocNo
            .toString()
            .localeCompare(b.collateralDocNo.toString(), 'en', { numeric: true });
          return result;
        })
        .map((it: any, index: number) => {
          return <any>{
            orderNumber: '' + (index + 1),
            ...it,
          };
        });
      this.collateralsSource.filterPredicate = this.getPredicate();
      this.collateralsSource.filteredData = this.collateralsSource.data.slice(0, 10);

      // this.collateralGroupOption = this.data.deedGroups.sort((a: any, b: any) => {
      //   const result = a.fsubbidnum.localeCompare(b.fsubbidnum, 'en', { numeric: true });
      //   return result;
      // }).map((it: any) => {
      //   return { text: it.fsubbidnum ? `ชุดทรัพย์ที่ ${it.fsubbidnum}` : '-', value: it.fsubbidnum ? it.fsubbidnum : '-' } as SimpleSelectOption;
      // })
      // this.collateralGroupOption = this.getUniqueListByValue(this.collateralGroupOption);
      // this.collateralGroupOption = [{ text: 'ชุดทรัพย์', value: 'All' } as SimpleSelectOption].concat(
      //   this.collateralGroupOption
      // );
      this.totalAmount = this.dataShow.totalDeeds;

      this.deedNoFilterOption = this.dataShow.deeds
        .sort((a: any, b: any) => {
          const result = a.collateralDocNo
            .toString()
            .localeCompare(b.collateralDocNo.toString(), 'en', { numeric: true });
          return result;
        })
        .map((it: any) => {
          return {
            text: it.collateralDocNo ? it.collateralDocNo : '-',
            value: it.collateralDocNo ? it.collateralDocNo : '-',
          } as SimpleSelectOption;
        });
      this.deedNoFilterOption = this.getUniqueListByValue(this.deedNoFilterOption);
      this.deedNoFilterOption = [{ text: 'เลขที่เอกสารสิทธิ์', value: 'All' } as SimpleSelectOption].concat(
        this.deedNoFilterOption
      );
    } else if (this.displayAuctionDetail && this.actionCode === auctionActionCode.R2E09_04_01_11) {
      this.data.deedGroups.deeds.forEach((x: any) => {
        let tempExpand = [];
        tempExpand.push(x.initialDeedInfoValidation, x.finalDeedInfoValidation);
        x.deedInfoValidationList = tempExpand;
        x.fsubbidnum = this.data.deedGroups.fsubbidnum;
      });
      console.log('this.data   gggg', this.data);
      this.dataShow = this.data.deedGroups;
      console.log('this.dataShow', this.dataShow);

      this.collateralsSource.data = this.dataShow.deeds
        .sort((a: any, b: any) => {
          const result = a.collateralDocNo
            .toString()
            .localeCompare(b.collateralDocNo.toString(), 'en', { numeric: true });
          return result;
        })
        .map((it: any, index: number) => {
          return <any>{
            orderNumber: '' + (index + 1),
            ...it,
          };
        });
      console.log('this.collateralsSource.data', this.collateralsSource.data);
      this.deedNoFilterOption = this.dataShow.deeds
        .sort((a: any, b: any) => {
          const result = a.collateralDocNo
            .toString()
            .localeCompare(b.collateralDocNo.toString(), 'en', { numeric: true });
          return result;
        })
        .map((it: any) => {
          return {
            text: it.collateralDocNo ? it.collateralDocNo : '-',
            value: it.collateralDocNo ? it.collateralDocNo : '-',
          } as SimpleSelectOption;
        });
      this.deedNoFilterOption = this.getUniqueListByValue(this.deedNoFilterOption);
      this.deedNoFilterOption = [{ text: 'เลขที่เอกสารสิทธิ์', value: 'All' } as SimpleSelectOption].concat(
        this.deedNoFilterOption
      );
      this.collateralsSource.filterPredicate = this.getPredicate();
      this.collateralsSource.filteredData = this.collateralsSource.data.slice(0, 10);
    } else {
      if (
        ['EDIT', 'MATCH', 'MAPPING'].includes(this.buttonType) ||
        [auctionActionCode.R2E09_2_A].includes(this.actionCode)
      ) {
        this.collateralsSource.data = this.data
          .sort((a: any, b: any) => {
            const result = a.ledOriginalDeedno
              .toString()
              .localeCompare(b.ledOriginalDeedno.toString(), 'en', { numeric: true });
            return result;
          })
          .map((it: any, index: number) => {
            return <any>{
              orderNumber: '' + (index + 1),
              ...it,
            };
          });

        this.deedNoFilterOption = this.data
          .sort((a: any, b: any) => {
            const result = a.ledOriginalDeedno
              .toString()
              .localeCompare(b.ledOriginalDeedno.toString(), 'en', { numeric: true });
            return result;
          })
          .map((it: any) => {
            return {
              text: it.ledOriginalDeedno ? it.ledOriginalDeedno : '-',
              value: it.ledOriginalDeedno ? it.ledOriginalDeedno : '-',
            } as SimpleSelectOption;
          });
      } else {
        this.collateralsSource.data = this.data
          .sort((a: any, b: any) => {
            const result = a.collateralDocNo
              .toString()
              .localeCompare(b.collateralDocNo.toString(), 'en', { numeric: true });
            return result;
          })
          .map((it: any, index: number) => {
            return <any>{
              orderNumber: this.buttonType === 'RE_SELECT' ? '2' : '' + (index + 1),
              ...it,
            };
          });
        this.deedNoFilterOption = this.data
          .sort((a: any, b: any) => {
            const result = a.collateralDocNo
              .toString()
              .localeCompare(b.collateralDocNo.toString(), 'en', { numeric: true });
            return result;
          })
          .map((it: any) => {
            return {
              text: it.collateralDocNo ? it.collateralDocNo : '-',
              value: it.collateralDocNo ? it.collateralDocNo : '-',
            } as SimpleSelectOption;
          });
      }

      this.collateralsSource.filterPredicate = this.getPredicate();
      this.collateralsSource.filteredData = this.collateralsSource.data.slice(0, 10);
      this.collateralGroupOption = this.data
        .sort((a: any, b: any) => {
          const result = a.fsubbidnum.toString().localeCompare(b.fsubbidnum.toString(), 'en', { numeric: true });
          return result;
        })
        .map((it: any) => {
          return {
            text: it.fsubbidnum ? `ชุดทรัพย์ที่ ${it.fsubbidnum}` : '-',
            value: it.fsubbidnum ? it.fsubbidnum : '-',
          } as SimpleSelectOption;
        });

      this.landTypeOption = this.data.map((it: any) => {
        return { text: it.landtype ? it.landtype : '-', value: it.landtype ? it.landtype : '-' } as SimpleSelectOption;
      });

      this.collateralGroupOption = this.getUniqueListByValue(this.collateralGroupOption);
      this.deedNoFilterOption = this.getUniqueListByValue(this.deedNoFilterOption);
      this.landTypeOption = this.getUniqueListByValue(this.landTypeOption);

      this.collateralGroupOption = [{ text: 'ชุดทรัพย์', value: 'All' } as SimpleSelectOption].concat(
        this.collateralGroupOption
      );
      this.deedNoFilterOption = [{ text: 'เลขที่เอกสารสิทธิ์', value: 'All' } as SimpleSelectOption].concat(
        this.deedNoFilterOption
      );
      this.landTypeOption = [{ text: 'ประเภทประกันหลักย่อย', value: 'All' } as SimpleSelectOption].concat(
        this.landTypeOption
      );
      this.totalCollateral = this.collateralsSource.data.length;
    }
    this.allCurrentData = [...this.collateralsSource.data];
    this.sliceDataTable(this.collateralsSource.data);
    this.piningTableColumns = this.collateralColumns.map(it => `pin_${it}`);
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      const _selectedColaterals = this.collateralsSource.data.map(m => {
        return m.collateralId;
      }) as string[];
      this.selection.select(..._selectedColaterals);
    }
    this.onUpdateSelectItem.emit(this.selection);
  }

  isAllSelected() {
    return this.selection.selected.length === this.collateralsSource.data.length;
  }

  onCheckboxChange(row: any) {
    row.collateralId && this.selection.toggle(row.collateralId);
    this.onUpdateSelectItem.emit(this.selection);
  }

  viewAnnouncementDocument(data: any) {
    this.logger.info('[AuctionDetailLedCollateralComponent][viewAnnouncementDocument]', data);
    if (!data.url) {
      return;
    }
  }

  sliceDataTable(allData: any[], start?: number, end?: number) {
    const data = [...allData];
    this.collateralsSource.filteredData = data.slice(start ? start : 0, end ? end : 10);
  }

  private resetPageIndex() {
    if (this.paginator) {
      this.paginator['pageIndex'] = 1;
    }
    this.startIndex = 1;
  }

  indexTable(data: any, fsubbidnum: any) {
    return Number(data) + this.startIndex + Number(fsubbidnum);
  }

  onPaging(e: PageEvent) {
    this.startIndex = e.startLabel || 0;
    this.sliceDataTable(this.allCurrentData, e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);
  }

  onFilter(e: any, filter: any) {
    console.log('onFilter :: ', e);
    this.resetPageIndex();
    this.applyFilter(e, filter);
  }

  applyFilter(value: any, filter: any) {
    if (this.displayPropertDetail) {
      console.log('value', value);
      console.log('filter', filter);
      if (filter === 'fsubbidnum') {
        this.fsubbidNumDefault = value;
        console.log('this.fsubbidNumDefault ', this.fsubbidNumDefault);
        this.initPropertyDetailFilter();
      } else {
        if (filter === this.TABLE_FILTER_KEY.DEEDNO) {
          filter = this.TABLE_FILTER_KEY.COLLATERALDOCNO;
        }
        this.filterDictionary.set(filter, value);
        let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
        this.collateralsSource.filter = jsonString;
        this.allCurrentData = [...this.collateralsSource.filteredData];
        this.sliceDataTable(this.collateralsSource.filteredData);
      }
    } else {
      if (this.displayAuctionDetail && this.actionCode === auctionActionCode.R2E09_04_01_11) {
        filter = this.TABLE_FILTER_KEY.COLLATERALDOCNO;
      }
      this.filterDictionary.set(filter, value);
      let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
      this.collateralsSource.filter = jsonString;
      this.allCurrentData = [...this.collateralsSource.filteredData];
      this.sliceDataTable(this.collateralsSource.filteredData);
    }
  }

  async sortSelected(event: any) {
    console.log('event', event);
    let seizureListInfoObject;
    this.resetPageIndex();
    if (
      (['EDIT', 'MATCH', 'MAPPING'].includes(this.buttonType) ||
        [auctionActionCode.R2E09_2_A].includes(this.actionCode)) &&
      !this.displayPropertDetail &&
      !this.displayAuctionDetail
    ) {
      if (event == 'ASC') {
        seizureListInfoObject = this.allCurrentData.sort((a: any, b: any) => {
          const result = a.ledOriginalDeedno
            .toString()
            .localeCompare(b.ledOriginalDeedno.toString(), 'en', { numeric: true });
          return result;
        });
      } else {
        seizureListInfoObject = this.allCurrentData.sort((a: any, b: any) => {
          const result = a.ledOriginalDeedno
            .toString()
            .localeCompare(b.ledOriginalDeedno.toString(), 'en', { numeric: true });
          return -result;
        });
      }
    } else {
      if (event == 'ASC') {
        seizureListInfoObject = this.allCurrentData.sort((a: any, b: any) => {
          const result = a.collateralDocNo
            .toString()
            .localeCompare(b.collateralDocNo.toString(), 'en', { numeric: true });
          return result;
        });
      } else {
        seizureListInfoObject = this.allCurrentData.sort((a: any, b: any) => {
          const result = a.collateralDocNo
            .toString()
            .localeCompare(b.collateralDocNo.toString(), 'en', { numeric: true });
          return -result;
        });
      }
    }
    // this.collateralsSource = new MatTableDataSource(seizureListInfoObject);
    console.log(' this.collateralsSource', this.collateralsSource);
    console.log(' seizureListInfoObject', seizureListInfoObject);
    this.collateralsSource.filteredData = seizureListInfoObject;
    this.collateralsSource.filterPredicate = this.getPredicate();
    this.sliceDataTable(this.collateralsSource.filteredData);
  }

  getPredicate() {
    let fun = (record: any, filter: any) => {
      let map = new Map(JSON.parse(filter));
      let isMatch = false;
      for (let [key, value] of map) {
        isMatch = value == 'All' || record[key as keyof AuctionDetails] == value;
        if (!isMatch) return false;
      }
      return isMatch;
    };
    return fun;
  }

  getUniqueListByValue(arr: SimpleSelectOption[]) {
    return [...new Map(arr.map(item => [item['value'], item])).values()];
  }

  prependDefaultValue(text: string) {
    return { text: text, value: 'All' } as SimpleSelectOption;
  }
  isExpandedAllRows = false;
  toggleRow(element: { expanded: boolean }) {
    // console.log('element ::', element);
    // Uncommnet to open only single row at once
    // ELEMENT_DATA.forEach(row => {
    //   row.expanded = false;
    // })
    console.log('element', element);
    element.expanded = !element.expanded;
    this.isExpandedAllRows = false;
    console.log('element1', element);
  }

  verifyCollateral(data: AuctionDetails) {
    this.auctionService.auctionCollateralToVerify = data;
    const url = this.auctionService.routeCorrection('auction-verify-collateral');
    this.routerService.navigateTo(url, {
      mode: 'EDIT',
    });
  }

  mapCollateral(data: AuctionDetails) {
    this.auctionService.auctionCollateralToVerify = data;
    const url = this.auctionService.routeCorrection('auction-map-collateral');
    this.routerService.navigateTo(url, {
      mode: 'EDIT',
    });
  }

  viewVerifyCollateral(data: AuctionDetails) {
    this.auctionService.auctionCollateralToVerify = data;
    const url = this.auctionService.routeCorrection('auction-verify-collateral');
    this.routerService.navigateTo(url, {
      mode: 'VIEW',
    });
  }

  reSelectCollateral() {
    this.onReSelectCollateral.emit(this.pinData);
  }

  radioSelected = (event: MatRadioChange, row: any) => {
    if (event.value === true) {
      this.onUpdateSelectItem.emit(row);
    }
  };

  onAddCollateral() {
    this.onAddCollateralLexs.emit('ADD_COLLATERAL_LEXS')
  }

  async removeItem(element: any) {
    const _aucRef = element?.aucRef;
    const _deedId = element?.deedId;
    const result = await this.notificationService.confirmRemoveLeftAlignedDialog(`ยืนยันลบทรัพย์`, `ทรัพย์รายการนี้ จะถูกลบออกจากประกาศขายทอดตลาด\nคุณต้องการที่จะลบทรัพย์นี้หรือไม่`, { rightButtonLabel: 'ยืนยันลบทรัพย์', });
    if(result) {
      const response = await this.auctionService.deleteAuctionUnmatch(_aucRef, _deedId);
      if(response) {
        this.notificationService.openSnackbarSuccess(`ลบทรัพย์ชุดที่ ${element?.fsubbidnum}`)
      }
    }
  }
}
