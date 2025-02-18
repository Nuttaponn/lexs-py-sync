import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuctionService } from '@app/modules/auction/auction.service';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant';
import { TMode, auctionActionCode } from '@app/shared/models';
import { NameValuePair } from '@lexs/lexs-client';
import { DialogOptions, DropDownConfig, SimpleSelectOption } from '@spig/core';
import { NewAuctionService } from '../new-auction.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { DeedMatchDetailEtx } from '../../auction.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auction-detail-lexs-sys-table',
  // standalone: true,
  // imports: [],
  templateUrl: './auction-detail-lexs-sys-table.component.html',
  styleUrl: './auction-detail-lexs-sys-table.component.scss'
})
export class AuctionDetailLexsSysTableComponent implements OnInit, OnDestroy {
  @Input() mode!: TMode;
  // @Input() selectCollateralId: any;
  @Input() fsubbidNumDefault!: any;
  @Input() specificFlag!: 'EXECUTION';

  @ViewChild('paginator') paginator!: any;
  // public allCurrentData: any[] = [];
  public piningTableColumns: any = [];
  public ACTION_TYPE = auctionActionCode;
  public typeFilterControl: UntypedFormControl = new UntypedFormControl('ALL');
  public statusFilterControl: UntypedFormControl = new UntypedFormControl('ALL');
  public sortControl: UntypedFormControl = new UntypedFormControl('ASC');
  public dropdownFilterGroupConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'ชุดทรัพย์',
    defaultValue: 'ALL',
  };
  public dropdownFilterDocumentConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'เลขที่เอกสารสิทธิ์',
    defaultValue: 'ALL',
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
  public pageSize = 10;
  private startIndex: number = 1;
  public startIndexControl = new UntypedFormControl(this.startIndex);
  totalFilteredNumber = 0;

  successFillNumber(): number {
    return !this.dataDateListArray ? 0 : this.dataDateListArray?.controls.filter((group: AbstractControl) => group.valid).length ?? 0;
  }
  awaitingFillNumber(): number {
    return !this.dataDateListArray ? 0 : this.dataDateListArray?.controls.filter((group: AbstractControl) => !group.valid).length ?? 0;
  }
  isFilterAwaitingToFillData: UntypedFormControl = new UntypedFormControl(false);

  deedMatchDetailForm!: UntypedFormGroup;
  get dataDateListArray(): FormArray {
    return this.deedMatchDetailForm?.get('deedMatchDetails') as FormArray;
  }

  getFormValue(row: any, controlName: string): any {
    return row.get(controlName)?.value;
  }

  collateralColumns = [
    "orderNumber",
    "fsubbidnum",
    "assettypedesc",
    "collateralSubTypeDesc",
    "collateralDocNo",
    "assetDetail",
    "redCaseNo",
    "saletypedesc",
    "debtname",
    "ownername",
    "personName1",
    "personName2",
    "ledname",
    "remark",
    "occupant",
    "isExclude",
  ];

  collateralViewColumns = [
    "orderNumber",
    "fsubbidnum",
    "assettypedesc",
    "collateralSubTypeDesc",
    "collateralDocNo",
    "assetDetail",
    "redCaseNo",
    "saletypedesc",
    "debtname",
    "ownername",
    "personName1",
    "personName2",
    "occupant",
    "ledname",
    "remark",
    // "isExclude",
  ];

  public occupantConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'ประเภทกรรมสิทธิ์',
  };
  occupantOptions: NameValuePair[] = [];
  matchStatus!: string | undefined;
  auctionCaseTypeCode: string = '';
  public messageBanner = 'AUCTION.MSG_BANNER_AUC_DETAIL_LEXS';
  private destroy$ = new Subject<void>();

  formArrSubject = new BehaviorSubject<AbstractControl[]>([]);
  formArr$ = this.formArrSubject.asObservable();

  constructor(
    // private logger: LoggerService,
    // private routerService: RouterService,
    private auctionService: AuctionService,
    private newAuctionService: NewAuctionService,
    private notificationService: NotificationService,
    private masterDataService: MasterDataService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe((params) => {
      const fsubbidnum = params.get('fsubbidnum')
      if (fsubbidnum) {
        this.typeFilterControl.setValue(fsubbidnum);
      }
    });
  }

  async ngOnInit() {
    this.occupantOptions = await this.getOccupantOptions();
    this.occupantOptions = this.occupantOptions.filter((item) => item.value !== 'ALL');

    // Subscribe to matchStatus$
    this.newAuctionService.matchStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.matchStatus = status;

        if (status) {
          this.performActionOnMatchStatusChange();
        }
      })

    this.subscribeToFormChanges();
  }

  private subscribeToFormChanges() {
    combineLatest([
      this.typeFilterControl.valueChanges.pipe(startWith("ALL")),
      this.statusFilterControl.valueChanges.pipe(startWith("ALL")),
      this.sortControl.valueChanges.pipe(startWith("ASC")),
      this.isFilterAwaitingToFillData.valueChanges.pipe(startWith(false)),
      this.startIndexControl.valueChanges.pipe(startWith(1)),
    ])
    .pipe(
      debounceTime(1),
      distinctUntilChanged(),
      takeUntil(this.destroy$), // Unsubscribe when component is destroyed
      map(([type, status, sort, isFilterAwaitingToFillData, startIndexControl]) => {

        let res = (this.dataDateListArray.controls as AbstractControl[])
          .filter((group: AbstractControl) =>
            {
              return group.get('fsubbidnum')?.value === type || type === 'ALL'
            }
          )
          .filter((group: AbstractControl) =>
            {
              return group.get('collateralDocNo')?.value === status || status === 'ALL'
            }
          )
          .filter((group: AbstractControl) =>
            {
              return isFilterAwaitingToFillData ? !group?.valid : true
            }
          )
          this.totalFilteredNumber = res.length;
          res.sort((a: AbstractControl, b: AbstractControl) => {
            const valueA = a.get('collateralDocNo')?.value || '';
            const valueB = b.get('collateralDocNo')?.value || '';
            return sort === 'ASC' ?
              valueA.localeCompare(valueB, 'en', { numeric: true }):
              valueB.localeCompare(valueA, 'en', { numeric: true });
          });
          res = res.slice(startIndexControl - 1, startIndexControl + this.pageSize - 1);
          return res
        })
    )
    .subscribe((filtered) => {
      this.formArrSubject.next(filtered)
    });
  }

  ngOnDestroy(): void {
    // Emit a value to complete all observables using takeUntil
    this.destroy$.next();
    this.destroy$.complete();
  }

  performActionOnMatchStatusChange() {
    this.auctionCaseTypeCode  = this.auctionService.auctionCaseTypeCode ?? '';

    this.deedMatchDetailForm = this.newAuctionService.deedMatchDetailFormGroup;
    console.log('deedMatchDetailForm', this.dataDateListArray);
    // this.logger.info('[AuctionDetailLedCollateralComponent][ngOnInit]', this.selectCollateralId);
    // console.log('this.data end', this.data);

    this.collateralGroupOption = [ this.prependDefaultValue('ชุดทรัพย์') ].concat(this.generatecCollateralGroupFilterOption(this.dataDateListArray.value))
    this.deedNoFilterOption = [ this.prependDefaultValue('เลขที่เอกสารสิทธิ์') ].concat(this.generateDeedNoFilterOption(this.dataDateListArray.value))
  }

  private generatecCollateralGroupFilterOption(data: DeedMatchDetailEtx[]): SimpleSelectOption[] {
    const uniqueFsubbidnum = Array.from(new Set(data.map(item => item.fsubbidnum))); // Extract unique fsubbidnum values

    return uniqueFsubbidnum.map(fsubbidnum => ({
      text: `ชุดทรัพย์ที่ ${fsubbidnum}`,
      value: fsubbidnum
    } as SimpleSelectOption));
  }

  private generateDeedNoFilterOption(data: DeedMatchDetailEtx[]): SimpleSelectOption[] {
    let uniqueCollateralDocNo = Array.from(new Set(data.map(item => item.collateralDocNo))); // Extract unique collateralDocNo values
    return uniqueCollateralDocNo.map(collateralDocNo => ({
      text: collateralDocNo,
      value: collateralDocNo
    } as SimpleSelectOption))
    .sort((a, b) => {
      // Sort based on numeric comparison if values are numbers or strings with numbers
      return a.value.toString().localeCompare(b.value.toString(), 'en', { numeric: true });
    }
    );
  }

  async onCheckboxNotInAnnounceChange(row: AbstractControl) {
    const controlName: string = 'isExclude';

    // Check if only one row remains with isExclude === false
    const remainingNonExcluded = this.dataDateListArray.controls.filter(
      (group) => !group.get('isExclude')?.value
    );
    console.log('remainingNonExcluded', remainingNonExcluded);
    if (remainingNonExcluded.length === 0) {
      // Prevent action and notify the user
      await this.notificationService.alertDialog(
        'ไม่สามารถเปลี่ยนแปลงได้',
        'ต้องมีทรัพย์อย่างน้อยหนึ่งรายการที่ไม่ถูกระบุว่า “ไม่มีทรัพย์นี้อยู่ในประกาศ”'
      );

      // Revert checkbox to its previous state
      row.get(controlName)?.setValue(false, { emitEvent: false });
      return;
    }

    if (!this.getFormValue(row, controlName)) {
      row.get('fsubbidnum')?.addValidators(Validators.required);
      row.get('occupant')?.addValidators(Validators.required);
      row.get('fsubbidnum')?.updateValueAndValidity();
      row.get('occupant')?.updateValueAndValidity();
      return;
    };

    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'ยืนยัน',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonClass: 'primary',
      iconName: 'icon-Error',
      buttonIconName: 'icon-Check-Square',
    };
    const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
      'ยืนยันระบุ “ไม่มีทรัพย์นี้อยู่ในประกาศ”', 'หลังจากกดปุ่ม “ยืนยัน” ระบบจะนำข้อมูลทรัพย์ออกจากประกาศขายทอดตลาดนี้\n<br><br>', optionsDialog);

    if (!res) {
      row.get(controlName)?.setValue(false);
      return
    }

    row.get('fsubbidnum')?.setValue(null);
    row.get('occupant')?.setValue(null);
    row.get('remark')?.setValue(null);
    row.get('fsubbidnum')?.clearValidators();
    row.get('occupant')?.clearValidators();
    row.get('fsubbidnum')?.updateValueAndValidity();
    row.get('occupant')?.updateValueAndValidity();
  }

  private resetPageIndex() {
    if (this.paginator) {
      this.paginator['pageIndex'] = 1;
    }
    this.startIndex = 1;
    this.startIndexControl.setValue(this.startIndex);
  }

  indexTable(data: any, fsubbidnum: any) {
    return Number(data) + this.startIndex /*+ Number(fsubbidnum)*/;
  }

  onPaging(e: PageEvent) {
    this.startIndex = e.startLabel || 0;
    // Trigger the form control
    this.startIndexControl.setValue(this.startIndex);
  }

  onFilter(e: any) {
    this.resetPageIndex();
  }

  async sortSelected(event: any) {
    this.resetPageIndex();
  }

  prependDefaultValue(text: string) {
    return { text: text, value: 'ALL' } as SimpleSelectOption;
  }

  private async getOccupantOptions() {
    let res = await this.masterDataService.getOccupantOptions();
    res = res.filter((item) => item.value !== 'ALL');
    return res;
  }
}
