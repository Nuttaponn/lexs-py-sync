import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { AuctionService } from '@app/modules/auction/auction.service';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { NotificationService } from '@app/shared/services/notification.service';
import { CollateralAuctionInfo, LitigationCollateralDeedGroupDto, LitigationsCollateralsDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { CheckboxDialogTableComponent } from '../checkbox-dialog-table/checkbox-dialog-table.component';
import { DefermentService } from '@app/modules/deferment/deferment.service';
import { Utils } from '@app/shared/utils';
import { AucAnnounementCollateralSetDialogComponent } from '../auc-announement-collateral-set-dialog/auc-announement-collateral-set-dialog.component';

interface ICollateral extends LitigationsCollateralsDto {
  disabled: boolean;
}

@Component({
  selector: 'app-announce-property-list',
  templateUrl: './announce-property-list.component.html',
  styleUrls: ['./announce-property-list.component.scss'],
})
export class AnnouncePropertyListComponent implements OnInit, AfterViewChecked {
  @ViewChild('paginator') paginator!: any;
  @ViewChildren(MatTable) table!: QueryList<any>;
  @Input()
  set list(val: any) {
    this.dataSource = new MatTableDataSource<any>(val);
    this.setPageIndex();
    this.pagedData = this.dataSource.data.slice(0, this.pageSize);
  }
  @Input() viewOnly: boolean = false;
  @Input() showHeader: boolean = false;
  @Input() headerText: string = '';

  @Input() showSelectAll = false;
  @Input() showSelectCount = false;
  @Input() showTotal = false;
  @Input() canEdit = false;
  @Input() hasExtendDeferment = false;

  @Input() tableColumns: Array<string> = ['no', 'fsubbidnum', 'totalDeeds', 'blackCaseNo', 'saletypedesc', 'appoint'];
  @Output()
  onSelectionChange = new EventEmitter<Array<ICollateral>>(true);
  @Output()
  onClick = new EventEmitter<boolean>(true);

  public dataSource!: MatTableDataSource<ICollateral>;
  public pagedData: Array<ICollateral> = [];

  public pageSize = 10;
  public pageIndex: number = 1;
  public seizureListInfoObject = new MatTableDataSource();
  public headerExpanded: boolean = false;
  public isSelectAll: boolean = false;
  public initSelections: Array<any> = [];

  public totalAppraisal: number = 0;
  public columns: string[] = [];
  @Output() onEditTable = new EventEmitter<any>();
  @Output() onChangeAppointment = new EventEmitter<any>();
  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private auctionService: AuctionService,
    private defermentService: DefermentService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.columns = this.tableColumns;
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
      });
    }
  }

  onPaging(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pagedData = this.dataSource.data.slice(e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);
  }

  private setPageIndex() {
    if (this.paginator) {
      this.paginator['pageIndex'] = 1;
    }
    this.pageIndex = 1;
  }

  onEdit() {
    this.onEditTable.emit(true);
  }

  getAucRound(element: CollateralAuctionInfo[]) {
    const res = element
      .filter(e => e.checked && this.defermentService.canSelectAppointment(e, true))
      .map(f => f.aucRound);
    if (res.length > 0) return res.join(',');
    return '-';
  }

  async collateralAuctionDetail(collateralDeed: LitigationCollateralDeedGroupDto) {
    const data = await this.auctionService.getInquiryBiddingCollaterals(Number(collateralDeed.aucRef));
    const context = {
      data: data,
      fsubbidnum: collateralDeed.fsubbidnum,
    };
    const result = await this.notificationService.showCustomDialog({
      component: AucAnnounementCollateralSetDialogComponent,
      type: 'xlarge',
      iconName: 'icon-List-Property',
      title: this.translate.instant('LAWSUIT.DEFERMENT.ASSETS_NUMBER') + ' ' + collateralDeed.fsubbidnum,
      rightButtonLabel: 'COMMON.BUTTON_ACKNOWLEDGE',
      buttonIconName: 'icon-Selected',
      context: context,
    });
  }

  async openAddNoteDialog(collateralDeed: LitigationCollateralDeedGroupDto, index: number) {
    const auctionInfos = Utils.deepClone(collateralDeed.auctionInfos);
    const data = {
      // data context
      context: {
        auctionInfos: !this.hasExtendDeferment
          ? auctionInfos.filter((e: CollateralAuctionInfo) => e.checked) || []
          : auctionInfos,
        blackCaseNo: collateralDeed.blackCaseNo,
        redCaseNo: collateralDeed.redCaseNo,
        isViewMode: !this.hasExtendDeferment,
        hasExtendDeferment: this.hasExtendDeferment,
      },
    };
    let dialogRef = this.dialog.open(CheckboxDialogTableComponent, {
      data: data,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!this.hasExtendDeferment) return;
      (this.pagedData[index] as LitigationCollateralDeedGroupDto).auctionInfos = res.auctionInfos;
      const findIdx = (this.defermentService.selectedCollateralSets as LitigationCollateralDeedGroupDto[]).findIndex(
        e => e.ledId === collateralDeed.ledId && e?.deedGroupId === collateralDeed?.deedGroupId
      );
      if (findIdx > -1) {
        this.defermentService.selectedCollateralSets![findIdx].auctionInfos = res.auctionInfos;
      }
      this.onChangeAppointment.emit(true);
    });
  }

  hasCheckbox(collateralDeed: LitigationCollateralDeedGroupDto) {
    return collateralDeed.auctionInfos?.some(e => {
      return this.defermentService.canSelectAppointment(e);
    });
  }
}
