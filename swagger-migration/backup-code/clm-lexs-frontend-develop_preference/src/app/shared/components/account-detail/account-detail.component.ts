import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '@app/modules/customer/customer.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { AccountDto, LitigationDetailDto } from '@lexs/lexs-client';
import { LawsuitService } from '@modules/lawsuit/lawsuit.service';
import { RouterService } from '@shared/services/router.service';
import { SearchConditionRequest } from '../search-controller/search-controller.model';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
})
export class AccountDetailComponent implements OnInit {
  public litigationDetailDto: LitigationDetailDto = {};
  public account: AccountDto = {};
  public actionBar = {
    disabledBackButton: false,
    hasCancelButton: false,
    disabledCancelButton: false,
    cancelButtonText: '',
    showNavBarInformation: true,
    hasPrimaryButton: false,
    primaryButtonText: '',
    primaryButtonIcon: 'icon-save-primary',
    hasEditButton: false,
    editButtonText: '',
    hasDeleteButton: false,
    deleteButtonText: '',
  };
  public sectionTitles = ['GENERAL_INFO', 'DEBT_AND_INTEREST_INFO', 'ETC_INFO'];
  public firstSectionLabels = [
    'ACC_NO',
    'BILL_NO',
    'DEBT_TYPE',
    'AUTHORIZED_LIMIT',
    'CONTRACT_DATE',
    'EXPIRED_DATE',
    'LAST_TRAN_DATE',
    'DUE_DATE',
  ];
  public secondSectionLabels = [
    'OVERDUE_BALANCE',
    'OVERDUE_INTEREST',
    'FREEZE_INTEREST',
    'DEFAULT_INTEREST',
    'FINAL_C',
    'FINAL_STAGE',
    'DEBT_PAYLOAD_DATE',
    'BAD_DEBT_DATE',
  ];
  public thirdSectionLabels = [
    'STATUS',
    'TASK_ACC_INTERFACE',
    'ACC_STATUS',
    'CLOSE_DATE',
    'WRITE_OFF_STATUS',
    'TDR_TRACKING_RESULT',
    'LATEST_INTERFACE_UPLOAD_DATA_DATE',
    'LATEST_INTERFACE_TDR_DATE',
    'DPD',
    'ADDED_ACCOUNT_NAME',
    'ADDED_ACCOUNT_DATE',
    'PRESENT_LITIGATE_STATUS',
    'TDR_INFO',
  ];

  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,
    private lawsuitService: LawsuitService,
    private customerService: CustomerService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.taskService.isNotClearCurrentTab = false;
    this.customerService.isNotClearCurrentTab = false;

    const typeEnum: SearchConditionRequest.TypeEnum = this.route?.snapshot?.queryParams['typeEnum'];
    switch (typeEnum) {
      case 'BY_LAWSUIT':
        this.account = this.lawsuitService.currentAccountDetail ?? {};
        break;
      case 'BY_CUSTOMER':
        this.account = this.customerService.currentAccountDetail ?? {};
        break;
      default:
        break;
    }
    this.litigationDetailDto = this.lawsuitService.currentLitigation;
  }

  back() {
    this.routerService.back();
  }
}
