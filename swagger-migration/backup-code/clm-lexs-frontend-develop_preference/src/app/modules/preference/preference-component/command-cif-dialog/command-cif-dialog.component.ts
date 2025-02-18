import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup } from '@angular/forms';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import {PaginatorActionConfig, PaginatorResultConfig, SpigCoreModule, SpigShareModule} from '@spig/core';
import { PreferenceService } from '../../preference.service';
import {CustomerDto, InquiryCustomerResponse, PageInquiryCustomerResponse, PageOfTaskDto} from '@lexs/lexs-client';
import {Utils} from "@shared/utils";
import { RouterService } from '@app/shared/services/router.service';

@Component({
  selector: 'app-command-cif-dialog',
  standalone: true,
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
  ],
  templateUrl: './command-cif-dialog.component.html',
  styleUrl: './command-cif-dialog.component.scss'
})
export class CommandCifDialogComponent implements OnInit {
  public searchCtrl: FormGroup = this.initSearchControl();

  public placeholder: string = 'SEARCH_CONTROL.PLACEHOLDER_ADDITIONAL';
  public placeholderText: string = 'SEARCH_CONTROL.PLACEHOLDER_ADDITIONAL';

  public customerColumns = ['select','no', 'cifName', 'dpd', 'cFinalStage', 'responseUnit', 'responseAmdUnit', 'branch'];
  public customerTableDataSource: Array<InquiryCustomerResponse> = [];
  public selectedCustomer?: InquiryCustomerResponse={};

  public customerPageResultConfig!: PaginatorResultConfig;
  public customerPageActionConfig!: PaginatorActionConfig;
  private customerResp: PageInquiryCustomerResponse = {};
  constructor(
    private fb: FormBuilder,
    // private searchControllerService: SearchControllerService,
    // private masterDataService: MasterDataService,
    // private translate: TranslateService
    private preferenceService: PreferenceService,
     private routerService: RouterService,
  ) { }

  async ngOnInit() { }

  async dataContext(data: any) {
    this.initSearchControl();
    /* TODO: remove this code
    this.context = data as IExpandContext;
    if (this.context.isExpand) {
      this.showDetail = true;
    }
    */
    // use data.selectCustomer and find matched cifNo in customerTableDataSource, set to selectedCustomer
    if (!!data?.selectedCustomer?.cifNo) {
      this.customerTableDataSource = [ data.selectedCustomer ];
      this.selectedCustomer = this.customerTableDataSource[0];
      // this.selectedCustomer = this.customerTableDataSource.find((customer) => customer.cifNo === data.selectCustomer.cifNo);
    }

  }

  initSearchControl() {
    return this.fb.group({
      // expenseNo: (condition as ExpenseSearchConditionRequest)?.expenseNo || 'N/A',
      // expenseStatus: (condition as ExpenseSearchConditionRequest)?.expenseStatus || 'N/A',
      // assigneeId: (condition as ExpenseSearchConditionRequest)?.assigneeId || [],
      // searchString: [(condition as ExpenseSearchConditionRequest)?.searchString || null, Validators.minLength(3)],
      // successPaymentDate: (condition as any)?.successPaymentDate || null,
      cifNo: '',
      citizenId: '',
      fullName: '',
      size: 10,
      page: 0,
    });
  }

  onKeyup(event: KeyboardEvent) {
    (event.code === 'Enter' || event.code === 'NumpadEnter') && this.onSearch();
  }

  async onSearch() {
    const searchVal = {
      cifNo: this.searchCtrl.get('cifNo')?.getRawValue() || undefined,
      citizenId: this.searchCtrl.get('citizenId')?.getRawValue() || undefined,
      fullName: this.searchCtrl.get('fullName')?.getRawValue() || undefined,
      size: this.searchCtrl.get('size')?.getRawValue() || undefined,
      page: this.searchCtrl.get('page')?.getRawValue() || undefined,
    }
    let result = (await this.preferenceService.inquiryCustomer(searchVal));
    if(result?.content) {
      this.customerTableDataSource = result.content || [];
      this.customerResp = result
      const { resultConfig, actionConfig } = Utils.setPagination(
        this.customerResp.pageable,
        this.customerResp.numberOfElements,
        this.customerResp.totalPages,
        this.customerResp.totalElements
      );
      this.customerPageResultConfig = resultConfig;
      this.customerPageActionConfig = actionConfig;
      if (!!this.selectedCustomer) {
        const selectedCifNo = this.selectedCustomer.cifNo;
        this.selectedCustomer = this.customerTableDataSource?.find((customer) => customer.cifNo === selectedCifNo);
      }
    }

  }

  async pageEvent(event: any) {
    this.searchCtrl.get('page')?.setValue(event - 1)
    await this.onSearch();
  }

  public async onClose(): Promise<boolean> {
    return !!this.selectedCustomer;
  }

  get returnData() {
    return {
      selectedCustomer: this.selectedCustomer,
    }
  }

  onSelectionChange(element: any): void {
    this.selectedCustomer = element;
  }

  navigateToCustomer(customerId: string) {
    this.routerService.navigateTo('/main/customer/detail', {
      customerId: customerId,
    });
  }
}
