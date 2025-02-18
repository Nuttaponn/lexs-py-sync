import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NewAuctionService } from '../../auction-add/new-auction.service';
import { RouterService } from '@app/shared/services/router.service';
import { AbstractControl, FormArray, FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { TMode } from '@app/shared/models';
import { NameValuePair, AuctionCreateAnnounceSubmitRequest } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';
import { saleTypeDescOptions } from '../../auction.const';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuctionService } from '../../auction.service';
import { SessionService } from '@app/shared/services/session.service';

@Component({
  selector: 'app-information-asset-set',
  templateUrl: './information-asset-set.component.html',
  styleUrl: './information-asset-set.component.scss'
})
export class InformationAssetSetComponent implements OnInit, OnDestroy {
  // TODO: use these params
  @Input() config: any;
  public allCurrentData: any[] = [];
  public pageSize = 10;
  private startIndex: number = 1;
  // ############################################
  @Input() mode!: TMode;
  @ViewChild('paginator') paginator!: any;
  totalFilteredNumber = 0;
  // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/4035904180/LEX2-42460+-
  deedGroupMatchDetailFormGroup!: UntypedFormGroup;
  filteredDeedGroupMatchDetailFormGroup!: UntypedFormGroup;

  collateralColumns = [
    "orderNumber",
    "fsubbidnum",
    "totalDeeds",
    "saleTypeDesc",
    "reservefund",
    "reservefund1",
    "assetPrice2",
    "assetPrice3",
    "assetPrice4",
    "assetPrice5",
  ]

  get dataDateListArray(): FormArray {
    return this.deedGroupMatchDetailFormGroup?.get('deedGroupMatchDetails') as FormArray;
  }
  get filteredDataDateListArray(): FormArray {
    return this.filteredDeedGroupMatchDetailFormGroup?.get('deedGroupMatchDetails') as FormArray;
  }

  isFilterAwaitingToFillData: UntypedFormControl = new UntypedFormControl(false);
  successFillNumber(): number {
    return !this.dataDateListArray ? 0 : this.dataDateListArray?.controls.filter((group: AbstractControl) => group.valid).length ?? 0;
  }
  awaitingFillNumber(): number {
    return !this.dataDateListArray ? 0 : this.dataDateListArray?.controls.filter((group: AbstractControl) => !group.valid).length ?? 0;
  }

  public saleTypeDescConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'วิธีการขาย',
  };
  saleTypeDescOptions: NameValuePair[] = saleTypeDescOptions;
  matchStatus!: string | undefined;
  private destroy$ = new Subject<void>();

  constructor(
    private newAuctionService: NewAuctionService,
    private routerService: RouterService,
    private auctionService: AuctionService,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    // Subscribe to matchStatus$
    this.newAuctionService.matchStatus$
    .pipe(takeUntil(this.destroy$))
    .subscribe((status) => {
      this.matchStatus = status;
      if (status) {
        this.deedGroupMatchDetailFormGroup = this.newAuctionService.deedGroupMatchDetailFormGroup;
        this.filteredDeedGroupMatchDetailFormGroup = this.newAuctionService.generateDeedGroupMatchDetailForm([]);
        this.allCurrentData = [...this.dataDateListArray.controls];
        this.sliceDataTable(this.allCurrentData);
      }
    })
  }

  ngOnDestroy(): void {
    // Emit a value to complete all observables using takeUntil
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFormValue(row: any, controlName: string): any {
    return row.get(controlName)?.value;
  }

  indexTable(data: any, fsubbidnum: any) {
    return Number(data) + this.startIndex /*+ Number(fsubbidnum)*/;
  }

  onFilter(e: any) {
    this.resetPageIndex();
    this.sliceDataTable(this.allCurrentData);
  }

  private resetPageIndex() {
    if (this.paginator) {
      this.paginator['pageIndex'] = 1;
    }
    this.startIndex = 1;
  }

  onPaging(e: PageEvent) {
    this.startIndex = e.startLabel || 0;
    this.sliceDataTable(this.allCurrentData, e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);
  }

  sliceDataTable(dataLists: any[], start?: number, end?: number) {
    let data = [...dataLists];
    if (this.isFilterAwaitingToFillData.value) {
      data = data.filter((group: AbstractControl) => !group.valid);
    }
    this.totalFilteredNumber = data.length;
    this.filteredDataDateListArray.controls = data.slice(start ? start : 0, end ? end : 10);
  }

  async viewFsubbidnum(element: FormGroup) {
    if (this.newAuctionService.isFormsDirty(AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewDeedgroup)) {
      const isOut = await this.sessionService.confirmExitWithoutSave();
      if (!isOut) return;
    }

    const destination = this.auctionService.routeCorrection('auction-detail-lexs-sys-main');
    this.routerService.navigateTo(
      destination,
      { fsubbidnum: element.get('fsubbidnum')?.value }
    );
  }
}
