import { SelectionModel } from '@angular/cdk/collections';
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
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { RouterService } from '@app/shared/services/router.service';
import {
  CollateralAuctionInfo,
  DefermentLitigationInfo,
  LitigationCollateralDeedGroupDto,
  LitigationsCollateralsDto,
} from '@lexs/lexs-client';
import { CheckboxDialogTableComponent } from '../checkbox-dialog-table/checkbox-dialog-table.component';
import { NotificationService } from '@app/shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { AuctionService } from '@app/modules/auction/auction.service';
import { ConfirmDialogComponent } from '@app/shared/components/common-dialogs/confirm-dialog/confirm-dialog.component';
import { firstValueFrom } from 'rxjs';
import { Utils } from '@app/shared/utils';
import { AucAnnounementCollateralSetDialogComponent } from '../auc-announement-collateral-set-dialog/auc-announement-collateral-set-dialog.component';

interface ICollateral extends LitigationsCollateralsDto {
  disabled: boolean;
}

@Component({
  selector: 'app-seizure-property-list',
  templateUrl: './seizure-property-list.component.html',
  styleUrls: ['./seizure-property-list.component.scss'],
})
export class SeizurePropertyListComponent implements OnInit, AfterViewChecked {
  @ViewChild('paginator') paginator!: any;
  @ViewChildren(MatTable) table!: QueryList<any>;
  @Input()
  set list(val: any) {
    this.dataSource = new MatTableDataSource<any>(val);
    this.setPageIndex();
    this.pagedData = this.dataSource.data.slice(0, this.hasAnnounceAuction ? this.pageSizeAnnounce : this.pageSize);
    this.currentPageSelection.clear();
    this.syncPageSelection();
  }
  @Input()
  set initSelection(val: Array<ICollateral | LitigationCollateralDeedGroupDto>) {
    this.initSelections = val;
    this.selection.clear();
    if (val.length > 0) {
      val.forEach((c: any) => {
        if (this.hasAnnounceAuction) {
          this.selection.select(c.deedGroupId);
        } else {
          this.selection.select(c.collateralId);
        }
      });
      this.onSelectionChange.emit(val);
      if (this.hasAnnounceAuction) {
        val.forEach((e: LitigationCollateralDeedGroupDto) => {
          const idx = this.dataSource.data.findIndex(
            (f: LitigationCollateralDeedGroupDto) => f.deedGroupId === e.deedGroupId
          );
          (e as LitigationCollateralDeedGroupDto).auctionInfos?.forEach(g => {
            const idx2 = (this.dataSource.data[idx] as LitigationCollateralDeedGroupDto).auctionInfos?.findIndex(
              h => h.aucRound === g.aucRound
            ) as number;
            if (idx2 > -1) {
              (this.dataSource.data[idx] as LitigationCollateralDeedGroupDto).auctionInfos![idx2].checked = g.checked;
            }
          });
        });
      }
    }
    this.syncPageSelection();
    if (this.initSelections.length === 0 && !this.viewOnly && !this.hasAnnounceAuction) {
      this.selectAll();
    }
  }
  @Input() viewOnly: boolean = false;
  @Input() set showHeader(val: boolean) {
    this.isShowHeader = val;
    if (val) {
      this.pageSize = 10;
    } else {
      this.pageSize = 20;
    }
  }
  @Input() headerText: string = '';

  @Input() showSelectAll = false;
  @Input() hasAnnounceAuction = false;
  @Input() showSelectCount = false;
  @Input() showTotal = false;
  @Input() canEdit = false;

  @Input() disableSelection: boolean = false;
  @Input() hasUpload: boolean = false;
  @Input() tableColumns: Array<string> = [
    'selection',
    'order',
    'collateralId',
    'collateralType',
    'collateralSubType',
    'collateralDetails',
    'totalAppraisalValue',
    'appraisalDate',
    'ownerName',
    'insurancePolicyNumber',
    'litigationId',
    'collateralCaseLexStatus',
  ];
  public tableColumnssale: Array<string> = [
    'selection',
    'order',
    'lawnaumber',
    'casenumber',
    'officeexecution',
    'assets',
    'amountproperty',
    'sell',
    'delayed',
  ];

  @Output()
  onSelectionChange = new EventEmitter<Array<ICollateral | LitigationCollateralDeedGroupDto>>(true);
  @Output()
  onClick = new EventEmitter<boolean>(true);

  /** Selection */
  public selection = new SelectionModel<ICollateral | LitigationCollateralDeedGroupDto>(true);
  public currentPageSelection = new SelectionModel<ICollateral | LitigationCollateralDeedGroupDto>(true);
  public dataSource!: MatTableDataSource<ICollateral | LitigationCollateralDeedGroupDto>;
  public pagedData: Array<ICollateral | LitigationCollateralDeedGroupDto> = [];

  public pageSize = 20;
  public pageSizeAnnounce = 10;
  public pageIndex: number = 1;
  public seizureListInfoObject = new MatTableDataSource();
  public headerExpanded: boolean = false;
  public isSelectAll: boolean = false;
  public initSelections: Array<any> = [];
  public isShowHeader: boolean = false;

  public totalAppraisal: number = 0;
  public columns: string[] = [];
  @Output() onEditTable = new EventEmitter<any>();
  constructor(
    private routerService: RouterService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private auctionService: AuctionService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.columns = this.tableColumns;
    if (this.viewOnly) this.columns = this.columns.slice(1, this.columns.length);
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
      });
    }
  }

  selectAll(fromBtn = false) {
    this.dataSource.data.forEach((c: any) => {
      if (c.enabled) {
        this.selection.select(c?.collateralId);
      }
    });
    this.pagedData.forEach((c: any) => {
      if (c.enabled) {
        this.currentPageSelection.select(c?.collateralId);
      }
    });
    this.onSelectionChange.emit(this.selectionValue);
    this.isSelectAll = true;
    this.calculateAppraisal();
    if (fromBtn) {
      this.onClick.emit(true);
    }
  }

  get selectionValue() {
    let data = this.dataSource?.data;
    let list = [];
    for (let index = 0; index < data.length; index++) {
      const element: any = data[index];
      let filedCheck = element.collateralId;
      if (this.hasAnnounceAuction) {
        filedCheck = element.deedGroupId;
      }
      if (this.selection.selected.includes(filedCheck)) {
        list.push(element);
      }
    }
    return list;
  }

  unSelectAll() {
    this.selection.clear();
    this.currentPageSelection.clear();
    this.onSelectionChange.emit(this.selectionValue);
    this.isSelectAll = false;
    this.calculateAppraisal();
    this.onClick.emit(true);
  }

  selectAllInPage() {
    if (this.currentPageSelection.selected.length !== this.pagedData.length) {
      for (let index = 0; index < this.pagedData.length; index++) {
        const element: any = this.pagedData[index];
        if (!element.disabled && element.enabled) {
          this.selection.select(element.collateralId);
          this.currentPageSelection.select(element.collateralId);
        }
      }
      this.onSelectionChange.emit(this.selectionValue);
    } else {
      this.pagedData.forEach((c: any) => {
        this.selection.deselect(c.collateralId);
      });
      this.currentPageSelection.clear();
      this.onSelectionChange.emit(this.selectionValue);
    }
    this.calculateAppraisal();
  }

  isAllSelected() {
    return (
      this.currentPageSelection.selected.length === this.pagedData.length ||
      this.selection.selected.length === this.dataSource.data.length
    );
  }
  isIndeterminate() {
    return this.currentPageSelection.selected.length > 0 && !this.isAllSelected();
  }

  onPaging(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pagedData = this.dataSource.data.slice(e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);

    this.syncPageSelection();
  }

  private setPageIndex() {
    if (this.paginator) {
      this.paginator['pageIndex'] = 1;
    }
    this.pageIndex = 1;
  }

  async onCheck(e: any) {
    this.selection.toggle(e?.collateralId);
    this.currentPageSelection.toggle(e?.collateralId);
    if (
      e?.lexsCollateralStatus === LitigationsCollateralsDto.LexsCollateralStatusEnum.Seizured &&
      !this.selection.isSelected(e?.collateralId)
    ) {
      let confirm;
      if (this.hasUpload) {
        confirm = await this.confirmDialog();
        if (!confirm) {
          this.selection.toggle(e?.collateralId);
          this.currentPageSelection.toggle(e?.collateralId);
        }
      }
    }
    this.onSelectionChange.emit(this.selectionValue);
    this.calculateAppraisal();
    this.onClick.emit(true);
  }

  goToLitigation(litigationId: string) {
    this.routerService.navigateTo('/main/lawsuit/detail', {
      lgId: litigationId,
    });
  }

  calculateAppraisal() {
    let list: Array<any> = this.selectionValue;
    this.totalAppraisal = list.reduce((total, currentValue) => {
      let totalAppraisalValue = 0;
      if (this.hasAnnounceAuction) {
        totalAppraisalValue = currentValue.totalDeeds
          ? typeof currentValue.totalDeeds === 'string'
            ? Number(currentValue.totalDeeds)
            : currentValue.totalDeeds
          : 0;
      } else {
        totalAppraisalValue = currentValue.totalAppraisalValue
          ? typeof currentValue.totalAppraisalValue === 'string'
            ? Number(currentValue.totalAppraisalValue)
            : currentValue.totalAppraisalValue
          : 0;
      }
      total = total + totalAppraisalValue;
      return total;
    }, 0);
  }

  syncPageSelection() {
    let pagedDataList = this.pagedData.map((m: any) => m.collateralId);
    this.selection.selected.filter((c: any) => {
      if (pagedDataList.includes(c)) {
        this.currentPageSelection.select(c);
      } else {
        this.currentPageSelection.deselect(c);
      }
    });
  }

  onEdit() {
    this.onEditTable.emit(true);
  }

  async onCheckAnnounceAuction(
    row: any,
    collateralDeed: LitigationCollateralDeedGroupDto,
    action: 'CHECKBOX' | 'DETAIL'
  ) {
    this.selection.toggle(row?.deedGroupId);
    this.currentPageSelection.toggle(row?.deedGroupId);
    this.onClick.emit(true);
    if (this.selection.isSelected(row?.deedGroupId)) {
      this.openAddNoteDialog(row, collateralDeed, action);
    } else {
      let res;
      if (this.hasUpload) {
        res = await this.confirmDialog();
      } else {
        res = await this.notificationService.confirm(
          this.translate.instant('LAWSUIT.DEFERMENT.CONFIRM_TITLE_DESELECT_COLLATERAL'),
          this.translate.instant('LAWSUIT.DEFERMENT.CONFIRM_MSG_DESELECT_COLLATERAL'),
          {
            rightButtonLabel: this.translate.instant('LAWSUIT.DEFERMENT.CONFIRM_TITLE_DESELECT_COLLATERAL'),
            buttonIconName: 'icon-Bin',
            rightButtonClass: 'mat-warn',
          }
        );
      }
      if (res) {
        const index = (this.dataSource.data as LitigationCollateralDeedGroupDto[]).findIndex(
          e => e.deedGroupId === collateralDeed.deedGroupId
        );
        const auctionInfos = collateralDeed.auctionInfos;
        auctionInfos?.forEach(e => {
          if (e.enabled) {
            e.checked = false;
          }
        });
        this.dataSource.data[index] = { ...collateralDeed, auctionInfos: auctionInfos };
        this.selection.deselect(row?.deedGroupId);
        this.currentPageSelection.deselect(row?.deedGroupId);
        this.onClick.emit(true);
      } else {
        this.selection.select(row?.deedGroupId);
        this.currentPageSelection.select(row?.deedGroupId);
        this.onClick.emit(true);
      }
    }
    this.onSelectionChange.emit(this.selectionValue);
    this.calculateAppraisal();
  }

  async openAddNoteDialog(row: any, collateralDeed: LitigationCollateralDeedGroupDto, action: 'CHECKBOX' | 'DETAIL') {
    const oldAuctionInfos =
      (Utils.deepClone(collateralDeed.auctionInfos) as CollateralAuctionInfo[]).filter(
        (e: CollateralAuctionInfo) => e.checked
      ) || [];
    const data = {
      // data context
      context: {
        auctionInfos: collateralDeed.enabled ? collateralDeed.auctionInfos : oldAuctionInfos,
        blackCaseNo: collateralDeed.blackCaseNo,
        redCaseNo: collateralDeed.redCaseNo,
        isViewMode: !collateralDeed.enabled,
      },
    };
    let dialogRef = this.dialog.open(CheckboxDialogTableComponent, {
      data: data,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === false) {
        if (action === 'CHECKBOX') {
          this.selection.deselect(row?.deedGroupId);
          this.currentPageSelection.deselect(row?.deedGroupId);
          this.onClick.emit(true);
          this.onSelectionChange.emit(this.selectionValue);
          this.calculateAppraisal();
        }
      } else {
        const auctionInfosEnable = (res.auctionInfos as CollateralAuctionInfo[])?.filter(e => {
          return e?.enabled && new Date(e?.bidDate as string) > new Date();
        }) as CollateralAuctionInfo[];
        if (!auctionInfosEnable.some(f => f?.checked)) {
          this.selection.deselect(row?.deedGroupId);
          this.currentPageSelection.deselect(row?.deedGroupId);
          this.onClick.emit(true);
          this.onSelectionChange.emit(this.selectionValue);
          this.calculateAppraisal();
          return;
        }
        const index = (this.dataSource.data as LitigationCollateralDeedGroupDto[]).findIndex(
          e => e.deedGroupId === collateralDeed.deedGroupId
        );
        (this.dataSource.data[index] as LitigationCollateralDeedGroupDto).auctionInfos = res.auctionInfos;
        const startLabel = (this.pageIndex - 1) * this.pageSizeAnnounce + 1;
        const fromLabel = Math.min(
          (this.pageIndex - 1) * this.pageSizeAnnounce + this.pageSizeAnnounce,
          this.dataSource.data.length
        );
        this.pagedData = this.dataSource.data.slice(startLabel ? startLabel - 1 : 0, fromLabel);
        this.selection.select(row?.deedGroupId);
        this.currentPageSelection.select(row?.deedGroupId);
        this.onClick.emit(true);
        this.onSelectionChange.emit(this.selectionValue);
        this.calculateAppraisal();
      }
    });
  }

  async confirmDialog() {
    const data = {
      title: 'LAWSUIT.DEFERMENT.CONFIRM_TITLE_DESELECT_COLLATERAL',
      iconName: 'icon-Error',
      message: this.hasAnnounceAuction
        ? 'LAWSUIT.DEFERMENT.CONFIRM_MSG_DESELECT_COLLATERAL'
        : 'LAWSUIT.DEFERMENT.CONFIRM_CONTINUE_MSG_DESELECT_COLLATERAL',
      messageBanner: 'LAWSUIT.DEFERMENT.CONFIRM_TITLE_BANNER_DESELECT_COLLATERAL',
      subMessageBanner: 'LAWSUIT.DEFERMENT.CONFIRM_MSG_BANNER_DESELECT_COLLATERAL',
      typeBanner: 'warn-normal',
      iconBanner: 'icon-Error',
      buttonIconName: 'icon-Bin',
      rightButtonClass: 'mat-warn',
      rightButtonLabel: 'LAWSUIT.DEFERMENT.CONFIRM_TITLE_DESELECT_COLLATERAL',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
    };
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: data,
      panelClass: 'custom-dialog-xsmall',
      id: 'custom-dialog-xsmall',
      disableClose: true,
      autoFocus: false,
    });
    return await firstValueFrom(dialogRef.afterClosed());
  }

  checkboxLabel(row?: DefermentLitigationInfo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${row.checked ? 'deselect' : 'select'} row ${row.litigationId ?? '' + 1}`;
  }

  getAucRound(element: CollateralAuctionInfo[]) {
    const res = element.filter(e => e.checked).map(f => f.aucRound);
    if (res.length > 0) return res.join(',');
    return false;
  }

  async collateralAuctionDetail(collateralDeed: LitigationCollateralDeedGroupDto) {
    const data = await this.auctionService.getInquiryBiddingCollaterals(Number(collateralDeed.aucRef));
    const context = {
      data: data,
      fsubbidnum: collateralDeed.fsubbidnum,
    };
    await this.notificationService.showCustomDialog({
      component: AucAnnounementCollateralSetDialogComponent,
      type: 'xlarge',
      iconName: 'icon-List-Property',
      title: this.translate.instant('LAWSUIT.DEFERMENT.ASSETS_NUMBER') + ' ' + collateralDeed.fsubbidnum,
      rightButtonLabel: 'COMMON.BUTTON_ACKNOWLEDGE',
      buttonIconName: 'icon-Selected',
      context: context,
    });
  }
}
