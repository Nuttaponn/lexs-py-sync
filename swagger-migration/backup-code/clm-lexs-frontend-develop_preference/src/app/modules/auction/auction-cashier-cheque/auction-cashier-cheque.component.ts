import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { UserService } from '@app/modules/user/user.service';
import { IUploadMultiFile, IUploadMultiInfo } from '@app/shared/models/upload-file.model';
import { NameValuePair } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';
import { AuctionService } from '../auction.service';
import { CashierChequeStatusPipe } from './cashier-cheque-status.pipe';
import { TaskService } from '@app/modules/task/services/task.service';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';

@Component({
  selector: 'app-auction-cashier-cheque',
  templateUrl: './auction-cashier-cheque.component.html',
  styleUrls: ['./auction-cashier-cheque.component.scss'],
})
export class AuctionCashierChequeComponent implements OnInit {
  @Input() title: string = '';
  @Input() sectionName: 'COLLATERAL' | 'STAMP' | 'ON_REQUEST' = 'COLLATERAL';
  @Input() hasEditMode: boolean = false;
  @Input() expanded: boolean = false;
  formGroup!: UntypedFormGroup;
  data: Array<any> = [];

  public isOpened: boolean = false;
  isOpenedList: boolean[] = [];

  statusGreenColor: Array<string> = ['FINISHED'];

  public lawyerConfig: DropDownConfig = {
    iconName: '',
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'AUCTION_DETAIL.CASHIER_CHEQUE_COLLATERAL.LAWYER',
  };
  public lawyerOptions: NameValuePair[] = [];

  public branchConfig: DropDownConfig = {
    iconName: '',
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'AUCTION_DETAIL.CASHIER_CHEQUE_COLLATERAL.BRANCH_ISSUED_CASHIER_CHEQUE',
  };
  public branchOptions: any = [];

  public currentDate: Date = new Date();
  public isOnRequest: boolean = false;
  public cashierColumns: string[] = ['no', 'total', 'orderPaymentDate'];
  public documentNameList: { name: string; documentTemplateId: string }[] = [];

  public uploadMultiInfo: IUploadMultiInfo = {
    cif:
      this.lawsuitServices.currentLitigation.customerId ||
      this.taskService.taskDetail?.customerId ||
      this.litigationCaseService.litigationCaseShortDetail?.cifNo ||
      '',
    litigationId: this.lawsuitServices.currentLitigation.litigationId || this.taskService.taskDetail.litigationId || '',
  };

  constructor(
    private userService: UserService,
    private auctionService: AuctionService,
    private cashierChequeStatus: CashierChequeStatusPipe,
    private lawsuitServices: LawsuitService,
    private taskService: TaskService,
    private litigationCaseService: LitigationCaseService
  ) {}

  ngOnInit(): void {
    this.isOnRequest = this.sectionName === 'ON_REQUEST';
    this.initData();
  }

  initData() {
    // formGroup
    switch (this.sectionName) {
      case 'COLLATERAL':
        this.formGroup = this.auctionService.collateralForm;
        break;
      case 'ON_REQUEST':
        this.formGroup = this.auctionService.cashCourtForm;
        break;
      case 'STAMP':
        this.formGroup = this.auctionService.stampDutyForm;
        break;
    }
    this.data = this.formGroup?.value;
    this.isOpened = this.expanded;
    this.isOpenedList = new Array(this.data?.length).fill(this.isOpened);
    this.prepareData();
  }

  prepareData() {
    if (this.cashierCheque?.length > 0) {
      // GET Lawyer
      this.lawyerOptions = this.auctionService.mapLawyer();
      if (this.hasEditMode) {
        // GET Branch name
        this.branchOptions = this.auctionService.branchList.ktbOrg;
      }
      this.setDefaultLawyer();
    }

    if (this.sectionName !== 'COLLATERAL' && this.sectionName !== 'STAMP') {
      const current = this.cashierCheque?.value?.find((f: any) => f.actionFlag);
      if (current) {
        this.documentNameList = current?.cashierAdditionalPaymentDocs?.map((d: any) => ({
          name: d.cashierDocTemplate?.documentTemplateName || '',
          documentTemplateId: d.cashierDocTemplate?.documentTemplateId || '',
        }));
      }
    }
  }

  get cashierCheque(): UntypedFormArray {
    return (this.formGroup?.get('cashierCheque') as UntypedFormArray) || null;
  }

  uploadFileEvent(list?: IUploadMultiFile[] | null, form?: any) {
    let isValid = list && list?.length > 0;
    form?.get('hasDocument')?.setValue(isValid);
    if (isValid) {
      form?.get('additionalPaymentDocs')?.setValue({
        uploadSessionId: list && list[0].imageId,
        name: list && list[0].documentTemplate?.documentName,
      });
    }
  }

  findLawyerName(code: string) {
    return this.lawyerOptions.find((data: any) => code === data.value)?.name;
  }

  findMobileNumber(lawyerCode: string) {
    return this.userService.kLawyerUserOptions.find((data: any) => lawyerCode === data.userId)?.mobileNumber || '';
  }

  setDefaultLawyer() {
    this.cashierCheque?.controls.forEach((ctrl: AbstractControl, index: number) => {
      this.isOpenedList[index] = ctrl.get('actionFlag')?.value;
      if (
        (['PENDING'].includes(this.cashierChequeStatus.transform(ctrl.get('status')?.value)) || this.isOnRequest) &&
        ctrl.get('actionFlag')?.value
      ) {
        if (ctrl.get('receivedByLawyerMobileNo')?.value) {
          this.auctionService.editCashierCheque = { ...ctrl.value };
        }

        if (ctrl.get('assignedLawyerId')?.value) {
          if (ctrl.get('assignedLawyerMobileNo')?.value === null) {
            ctrl.get('assignedLawyerMobileNo')?.setValue(this.findMobileNumber(ctrl.get('assignedLawyerId')?.value));
          }

          if (ctrl.get('receivedByLawyerId')?.value === null) {
            ctrl.get('receivedByLawyerId')?.setValue(ctrl.get('assignedLawyerId')?.value);
            ctrl.get('receivedByLawyerId')?.updateValueAndValidity();
          }
        }

        if (ctrl.get('receivedByLawyerId')?.value && ctrl.get('receivedByLawyerMobileNo')?.value === null) {
          ctrl.get('receivedByLawyerMobileNo')?.setValue(this.findMobileNumber(ctrl.get('receivedByLawyerId')?.value));
          ctrl.get('receivedByLawyerMobileNo')?.updateValueAndValidity();
        }
      }
    });
  }

  changeLawyer(value: string, formControl: any) {
    if (value === this.auctionService.editCashierCheque?.receivedByLawyerId) {
      formControl.setValue(this.auctionService.editCashierCheque?.receivedByLawyerMobileNo);
    } else {
      formControl.setValue(this.findMobileNumber(value));
    }
    formControl.updateValueAndValidity();
  }
}
