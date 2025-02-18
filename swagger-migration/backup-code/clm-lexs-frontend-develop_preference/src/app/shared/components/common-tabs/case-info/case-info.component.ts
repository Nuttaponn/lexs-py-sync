import { AfterViewChecked, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { CustomerService } from '@app/modules/customer/customer.service';
import { RouterService } from '@app/shared/services/router.service';
import { CustomerLitigationCaseDto } from '@lexs/lexs-client';
import { CommonTabsService } from '../common-tabs.service';

@Component({
  selector: 'app-case-info',
  templateUrl: './case-info.component.html',
  styleUrls: ['./case-info.component.scss'],
})
export class CaseInfoComponent implements AfterViewChecked {
  @ViewChild(MatTable) table!: MatTable<any>;

  public customerLitigationCaseColumns: string[] = [
    'litigationId',
    'customerId',
    'caseNo',
    'expireDate',
    'dpd',
    'lawyer',
    'branch',
    'kbdAmd',
    'status',
    'flag',
  ];

  constructor(
    private routerService: RouterService,
    private customerService: CustomerService,
    private commonTabService: CommonTabsService
  ) {}

  @Input() customerLitigationCaseList: Array<CustomerLitigationCaseDto> =
    this.customerService.customerDetail.cases || [];
  @Output() tabIndexChanged = new EventEmitter<number>();

  ngAfterViewChecked(): void {
    if (this.table) {
      this.table.updateStickyColumnStyles();
    }
  }

  onNavToDefaultTab() {
    this.tabIndexChanged.emit(0);
    this.commonTabService.tabNavigateTo.next(0);
  }

  gotoLawsuitDetail(lgId: string) {
    this.routerService.navigateTo('/main/lawsuit/detail', {
      lgId: lgId,
    });
  }
}
