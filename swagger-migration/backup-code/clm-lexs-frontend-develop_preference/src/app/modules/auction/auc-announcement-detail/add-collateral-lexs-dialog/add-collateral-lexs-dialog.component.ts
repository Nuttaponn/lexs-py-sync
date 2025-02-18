import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DropDownConfig, PaginatorActionConfig, PaginatorResultConfig, SimpleSelectOption } from '@spig/core';
import { CollateralTypes, DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant';

@Component({
  selector: 'app-add-collateral-lexs-dialog',
  templateUrl: './add-collateral-lexs-dialog.component.html',
  styleUrl: './add-collateral-lexs-dialog.component.scss'
})
export class AddCollateralLexsDialogComponent implements OnInit {

  public messageBanner = 'AUCTION.MSG_BANNER_AUC_COLLATERAL_LEXS_CHOOSE';
  public collateralTypeConfig: DropDownConfig = { ...DEFAULT_DROPDOWN_CONFIG, iconName: 'icon-Filter', labelPlaceHolder: 'ประเภททรัพย์' };
  public collateralTypeOptionsCtrl: UntypedFormControl = new UntypedFormControl('ALL');
  public collateralTypeOptions: SimpleSelectOption[] = [{ text: 'ประเภททรัพย์', value: 'ALL' }];

  public dropdownDocNoSortConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Sorting',
    labelPlaceHolder: 'เลขที่เอกสารสิทธิ์: จากน้อยไปมาก',
  };
  public docNoSortOption: SimpleSelectOption[] = [
    { text: 'เลขที่เอกสารสิทธิ์: จากน้อยไปมาก', value: 'ASC' },
    { text: 'เลขที่เอกสารสิทธิ์: จากมากไปน้อย', value: 'DESC' },
  ];
  public sortControl: UntypedFormControl = new UntypedFormControl('ASC');

  public isSubmited: boolean = false;
  public dataOriginalSource: Array<any> = [];
  public dataSource: Array<any> = [];
  public displayedColumns: string[] = ['selection', 'index', 'collateralType', 'subCollateralType', 'documentNumber', 'collateralDetails', 'redCase', 'mortgagee', 'ownerName', 'accuser', 'defendant', 'ledName'];

  /** Selection */
  public selection = new SelectionModel<number>(true, []);

  public pageResultConfig!: PaginatorResultConfig;
  public pageActionConfig!: PaginatorActionConfig;

  constructor() {}

  dataContext(data: any) {
    this.dataOriginalSource = data.data;
    this.dataSource = this.dataOriginalSource;
    const _options = CollateralTypes.map(it => {
      return { text: it.collateralTypeDesc, value: it.collateralTypeCode, } as SimpleSelectOption;
    })
    this.collateralTypeOptions = [...this.collateralTypeOptions, ..._options] || this.collateralTypeOptions
  }

  ngOnInit() {}

  // Selection
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      const _mapperData = this.dataSource.map(m => {
        return m;
      })
      this.selection.select(..._mapperData);
    }
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.length;
  }

  onCheckboxChange(row: any) {
    row && this.selection.toggle(row);
  }

  filterByCollateralType(event: any) {
    if (event === 'ALL') {
      this.dataSource = this.dataOriginalSource;
    } else {
      this.dataSource = this.dataOriginalSource.filter(item => item.lexsCollateralTypeCode === event);
    }
  }

  sortByDocumentNo(event: any) {
    console.log("🚀 ~ event:", event)
  }

  async pageEvent(event: number) {
    console.log("🚀 ~ event:", event)
  }

  async onClose() {
    if(this.selection.selected.length === 0) {
      this.isSubmited = true
      return false
    }
    return true
  }

  get returnData() {
    return {
      dataSelected: this.selection.selected
    };
  }

}
