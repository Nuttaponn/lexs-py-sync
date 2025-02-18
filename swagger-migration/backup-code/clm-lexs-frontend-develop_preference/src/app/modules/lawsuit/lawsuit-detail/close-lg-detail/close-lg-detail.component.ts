import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import {
  CloseLitigationRequest,
  LitigationCaseDebtInfo,
  LitigationCaseDto,
  LitigationDetailDto,
} from '@lexs/lexs-client';
import { BuddhistEraPipe, DropDownConfig } from '@spig/core';
import { LawsuitService } from '../../lawsuit.service';
import { DisplayCloseLgAccount, DisplayCloseLgExpense } from '../interface/close-lg';

interface CloseConditionDropdownOption {
  name: string;
  value: CloseLitigationRequest.CloseConditionEnum;
}
@Component({
  selector: 'app-close-lg-detail',
  templateUrl: './close-lg-detail.component.html',
  styleUrls: ['./close-lg-detail.component.scss'],
  providers: [BuddhistEraPipe],
})
export class CloseLgDetailComponent implements OnInit {
  public nextRouting: string = '';

  constructor(
    private fb: UntypedFormBuilder,
    private lawsuitService: LawsuitService,
    private router: Router,
    private taskService: TaskService
  ) {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationStart) this.nextRouting = val.url;
    });
  }

  litigationDetail: LitigationDetailDto = {};

  lgCloseForm!: UntypedFormGroup;
  closeCondition = CloseLitigationRequest.CloseConditionEnum;

  accountsDisplayedColumns = [
    'order',
    'accountNo',
    'billNo',
    'dpd',
    'cFinal',
    'debtType',
    'totalDebt',
    'prescriptionDate',
    'bookingCenter',
    'responseUnit',
    'tdrTrackingResult',
    'lgidBlackRedCaseNo',
    'litigationStatus',
  ];
  expensesDisplayedColumns = ['order', 'accountNo', 'space', 'balance', 'expense', 'writeOffFlag'];
  casesDisplayedColumns = ['order', 'caseType', 'blackCaseNo', 'redCaseNo', 'courtVerdictType'];
  debtInfosColumns = ['no', 'blackCaseNo', 'redCaseNo', 'debtAmount'];

  accountsDataSource: Array<DisplayCloseLgAccount> = this.litigationDetail.accountInfo?.accounts || [];
  expensesDataSource: Array<DisplayCloseLgExpense> = this.litigationDetail.expenseInfo?.expenseDtos || [];
  casesDataSource: Array<LitigationCaseDto> = this.litigationDetail.cases || [];
  litigationCaseDebtInfos: LitigationCaseDebtInfo[] = [];

  isViewMode: boolean = true;
  isWaitingForVerification: boolean = false;
  isWaitingForApproval: boolean = false;

  isFormEditable: boolean = false;

  verificationMessage = '';
  approvalMessage = '';

  closeLgConditionMap: { [key: string]: string } = {
    '': '-',
  };
  closeLgConditions: Array<CloseConditionDropdownOption> = [
    {
      name: 'โอนลูกหนี้ไป TAMC/SAM',
      value: this.closeCondition.Transfer,
    },
    {
      name: 'ยุติการดำเนินคดี',
      value: this.closeCondition.Cessation,
    },
    {
      name: 'ตัดเป็นหนี้สูญ',
      value: this.closeCondition.WriteOff,
    },
    {
      name: 'ชำระหนี้เสร็จ',
      value: this.closeCondition.DeptClosed,
    },
    {
      name: 'ปรับปรุงโครงสร้างหนี้ ยุติการดำเนินคดี',
      value: this.closeCondition.Refinance,
    },
  ];

  ngOnInit(): void {
    this.initData();
    this.initForm();
    this.initDisplayMode();
  }

  initDisplayMode() {
    // coming from the litigation list page
    if (!this.litigationDetail.litigationCloseInfo?.litigationId) {
      // enable to start closure
      this.isViewMode = false;
      this.lawsuitService.hasEdit = true;
    } else {
      this.isViewMode = true;
    }
    this.isFormEditable = !this.isViewMode && !this.isWaitingForApproval && !this.isWaitingForVerification;
  }

  //** DATA */
  initData() {
    this.litigationDetail = this.lawsuitService.currentLitigation || this.taskService.litigationDetail;
    this.accountsDataSource = this.litigationDetail.accountInfo?.accounts || [];
    this.expensesDataSource = this.litigationDetail.expenseInfo?.expenseDtos || [];
    this.casesDataSource = this.litigationDetail.cases || [];

    if (this.accountsDataSource.length > 0) {
      this.accountsDataSource.push({
        isSum: true,
        summaryDebt: this.litigationDetail.accountInfo?.summaryDebt || 0,
      });
    }
    if (this.expensesDataSource.length > 0) {
      this.expensesDataSource.push({
        isSum: true,
        totalBalance: this.litigationDetail.expenseInfo?.totalBalance || 0,
        totalExpense: this.litigationDetail.expenseInfo?.totalExpense || 0,
      });
    }

    this.closeLgConditions.forEach(con => {
      this.closeLgConditionMap[con.value] = con.name;
    });

    this.litigationCaseDebtInfos =
      this.litigationDetail?.litigationCloseInfo?.litigationCaseDebtInfos || this.initLitigationCaseDebtInfos();
  }

  sumDebt(acc: any /* AccountDto */): number {
    const debt =
      parseFloat(acc.outstandingBalance || '0') +
      parseFloat(acc.outstandingAccruedInterest || '0') +
      parseFloat(acc.interestNonBook || '0') +
      parseFloat(acc.lateChargeAmount || '0');
    return debt;
  }

  //** FORM */

  initForm() {
    this.lgCloseForm = this.fb.group({
      closeCondition: [null, Validators.required],
      closeReason: ['', Validators.required],
      checklist1: [false, Validators.requiredTrue],
      checklist2: [false, Validators.requiredTrue],
    });
    this.lawsuitService.lgCloseForm = this.lgCloseForm;
  }

  getControl(name: string) {
    return this.lgCloseForm.controls[name];
  }

  dropdownHasErrors() {
    const dropdown = this.getControl('closeCondition');
    return dropdown.errors && dropdown.touched;
  }
  checkboxHasErrors() {
    const checkbox1Errors = this.getControl('checklist1').errors && this.getControl('checklist1').touched;
    const checkbox2Errors = this.getControl('checklist2').errors && this.getControl('checklist2').touched;
    return checkbox1Errors || checkbox2Errors ? true : false;
  }

  public closeLgConditionConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'LAWSUIT.CLOSE.LABEL_CLOSE_CONDITION',
  };

  initLitigationCaseDebtInfos() {
    const debtInfos: LitigationCaseDebtInfo[] = [
      {
        blackCaseNo: undefined,
        debtAmount: 0,
        litigationCaseId: undefined,
        litigationId: this.litigationDetail.litigationId,
        redCaseNo: undefined,
      },
    ];
    return debtInfos;
  }
}
