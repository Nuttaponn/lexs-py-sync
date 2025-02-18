import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ReceiptService } from '@app/modules/finance/services/receipt.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { LitigationTransactionDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-lg-dialog',
  templateUrl: './add-lg-dialog.component.html',
  styleUrls: ['./add-lg-dialog.component.scss'],
})
export class AddLgDialogComponent implements OnInit {
  isSearch: boolean = false;
  isContinueClicked: boolean = false;
  placeholder: string = this.translate.instant('FINANCE.ADD_PAYMENT_LIST_DIALOG.SEARCH_PLACEHOLDER');
  tableList: LitigationTransactionDto[] = [];
  tableColumns: string[] = [
    'litigationId',
    'blackCaseNo',
    'court',
    'customerName',
    'payAmount',
    'courtRefundAmount',
    'customerStatusName',
  ];

  advanceTableColumns: string[] = ['litigationId', 'blackCaseNo', 'customerName', 'customerId', 'customerStatusName'];

  objRefund: any = {
    totalAdded: 0,
    totalList: 0,
  };
  selectOneRow: boolean = false;
  selectedLg: boolean = false;
  form!: UntypedFormGroup;
  isDeletedRecord: boolean = false;
  isAdvance!: boolean;
  hideSearch: boolean = false;
  selectList: any[] = [];
  currentLgCaseList: Array<string> = [];
  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private receiptService: ReceiptService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  async initData() {
    this.form = this.fb.group({
      searchString: ['', [Validators.required, this.conditionalSearchStringValidator()]],
      data: this.fb.array([], Validators.required),
    });
    if (this.hideSearch && this.selectList) {
      this.autoSearchUsingCurrentLGID();
    }
  }

  get data() {
    return this.form.get('data') as UntypedFormArray;
  }

  async search(searchString?: string) {
    const res: LitigationTransactionDto[] = await this.receiptService.search(searchString);
    this.tableList =
      this.currentLgCaseList?.length > 0
        ? res?.filter(dto => !this.currentLgCaseList.includes((dto?.litigationCaseId ?? '').toString()))
        : res || [];
  }

  conditionalSearchStringValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!this.isSearch || control.value.length < 3) {
        return { minLength: true };
      }
      return null;
    };
  }

  async dataContext(data: any) {
    this.isAdvance = data.isAdvance;
    if (data.selectOneRow) {
      this.selectOneRow = data.selectOneRow;
    }
    if (data.hideSearch && data.selectList.length > 0) {
      this.hideSearch = data.hideSearch;
      this.selectList = data.selectList;
      this.currentLgCaseList = data?.currentLgCaseList || [];
    }
  }

  onSearch() {
    this.form.get('searchString')?.markAsTouched();
    this.form.get('searchString')?.updateValueAndValidity();
    let search = this.form.get('searchString');

    if (search?.valid || search?.value.length >= 3) {
      this.search(this.form.get('searchString')?.value);
      this.setIsSearched();
    }
  }

  private setIsSearched() {
    this.isSearch = true;
    this.form.get('searchString')?.markAsTouched();
    this.form.get('searchString')?.updateValueAndValidity();
  }

  get returnData() {
    return this.data.value;
  }

  getControl(ctrName: string) {
    return this.form.get(ctrName);
  }

  public async onClose(): Promise<boolean> {
    this.isContinueClicked = true;
    this.form.get('searchString')?.markAsTouched();
    this.form.get('searchString')?.updateValueAndValidity();
    this.form.get('data')?.markAsTouched();
    this.form.get('data')?.updateValueAndValidity();
    let search = this.form.get('searchString');

    if ((search?.invalid || this.data?.length === 0) && ((this.tableList.length || 0) > 0 || !this.isSearch)) {
      return false;
    }
    return true;
  }

  addList(ele: any) {
    this.objRefund.totalAdded++;
    ele.added = true;
    let element = this.fb.control({ ...ele });
    this.data.push(element);
    this.notificationService.openSnackbarSuccess('เพิ่มรายการ สำเร็จแล้ว');
    if (this.selectOneRow) {
      this.selectedLg = ele.litigationId;
    }
  }

  deleteList(ele: any) {
    this.isDeletedRecord = true;
    ele.added = false;
    this.objRefund.totalAdded--;
    let idx = this.data?.value?.find((f: LitigationTransactionDto) => f?.litigationId === ele?.litigationId);
    if (idx) this.data.removeAt(idx);
    this.notificationService.openSnackbarSuccess('ลบรายการโอนเงินสำเร็จแล้ว');
  }

  autoSearchUsingCurrentLGID() {
    this.isSearch = this.hideSearch;
    this.search(this.selectList[0].litigationId);
    this.form.get('searchString')?.clearValidators();
  }
}
