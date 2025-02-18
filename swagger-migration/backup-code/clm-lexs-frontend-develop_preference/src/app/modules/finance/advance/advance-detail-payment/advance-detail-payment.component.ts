import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { IUploadMultiFile, statusCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import {
  CreateAdvanceReceivePayTransferDetail,
  LitigationDocumentDto,
  LitigationTransactionDto,
  NameValuePair,
  TransferOrderRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { MasterDataService } from '@shared/services/master-data.service';
import { DropDownConfig } from '@spig/core';
import { RemarksPaymentDialogComponent } from '../../expense/remarks-payment-dialog/remarks-payment-dialog.component';
import { AddLgDialogComponent } from '../../receipt/receipt-detail/add-lg-dialog/add-lg-dialog.component';
import { AdvanceService } from '../../services/advance.service';

@Component({
  selector: 'app-advance-detail-payment',
  templateUrl: './advance-detail-payment.component.html',
  styleUrls: ['./advance-detail-payment.component.scss'],
})
export class AdvanceDetailPaymentComponent implements OnInit {
  @Input() dataForm!: UntypedFormGroup;
  @Input() isFromTask: boolean = false;
  @Input() statusCode!: statusCode;
  @Input() isCreate: boolean = false;
  @Input() isOwnTaskEdit: boolean = false;
  @Input() isSubmit: boolean = true;
  // accordion
  public isOpened1 = true; // เหตุผลการพิจารณา
  public isOpenedList: boolean[] = []; // โอนเงิน
  public isViewMode: boolean = true;
  public isApprove: boolean = false; // for LEX2-74 [LEX2 - 74] PENDING_APPROVE, RECORD_NO_SUCCESS การตรวจสอบการโอนเงินทดรองจ่ายเป็นค่าใช้จ่าย  &  [LEX2 - 74] การโอนเงินทดลองจ่ายเป็นค่าใช้จ่าย (System Error)
  // document
  public customerId = '';
  public litigationId = '';
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public document: LitigationDocumentDto[] = [];
  public documentUpload: IUploadMultiFile[] = [];
  public documentUploadList: Array<IUploadMultiFile[]> = [];
  public data: any = [];
  public advancePaymentGroup: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'โปรดเลือก',
    disableFloatLabel: true,
  };
  public advancePaymentGroupOptions: NameValuePair[] = [];
  public advancePaymentGroupOptionsList: Array<NameValuePair[]> = [];

  // table
  public advanceColumn: string[] = [
    'no',
    'accountNo',
    'expenseType',
    'preTransferAmount',
    'transferAmount',
    'expenseGroup',
    'advanceDate',
    'accountCode',
    'comment',
  ];
  public advanceWithStatusColumn: string[] = [
    'no',
    'accountNo',
    'expenseType',
    'preTransferAmount',
    'transferAmount',
    'expenseGroup',
    'advanceDate',
    'accountCode',
    'status',
    'comment',
  ];
  public displayColumn!: string[];
  public msgBannerMapper: { [key: string]: string } = {
    DRAFT:
      'กรุณาตรวจสอบข้อมูลการโอนเงินทดรองจ่ายเป็นค่าใช้จ่าย และกดปุ่ม “นำเสนอ” หรือ “ยกเลิกรายการ” เพื่อดำเนินการต่อไป',
    PENDING_EDIT:
      'กรุณาตรวจสอบข้อมูลการโอนเงินทดรองจ่ายเป็นค่าใช้จ่าย และกดปุ่ม “นำเสนอ” หรือ “ยกเลิกรายการ” เพื่อดำเนินการต่อไป',
    PENDING_NO_SUCCESS: 'กรุณาตรวจสอบข้อมูลการโอนเงินทดรองจ่ายเป็นค่าใช้จ่าย และกดปุ่ม “นำเสนอ” เพื่อดำเนินการต่อไป',
    PENDING_APPROVE:
      'กรุณาตรวจสอบข้อมูลการโอนเงินทดรองจ่ายเป็นค่าใช้จ่าย และกดปุ่ม “อนุมัติ” หรือ "ส่งกลับแก้ไข" เพื่อดำเนินการต่อไป',
    RECORD_NO_SUCCESS:
      'กรุณาตรวจสอบข้อมูลการโอนเงินทดรองจ่ายเป็นค่าใช้จ่าย และกดปุ่ม “นำส่งข้อมูล” หรือ “ส่งกลับแก้ไข” เพื่อดำเนินการต่อไป',
  };

  totalNetPayTransfer: number = 0;
  isAuto: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private masterDataService: MasterDataService,
    private advanceService: AdvanceService,
    private routerService: RouterService,
    private logger: LoggerService
  ) {}

  async ngOnInit() {
    this.isAuto = (this.dataForm.get('advanceReceiveNo')?.value as string).substring(0, 2) === 'RC';

    // init initial Data
    this.isApprove =
      this.dataForm.get('advanceReceivePaymentStatusCode')?.value === 'PENDING_APPROVE' ||
      this.dataForm.get('advanceReceivePaymentStatusCode')?.value === 'RECORD_NO_SUCCESS'
        ? true
        : false;
    this.displayColumn =
      this.dataForm.get('advanceReceivePaymentStatusCode')?.value === 'PENDING_NO_SUCCESS' ||
      this.dataForm.get('advanceReceivePaymentStatusCode')?.value === 'RECORD_NO_SUCCESS'
        ? this.advanceWithStatusColumn
        : this.advanceColumn;
    this.isOpenedList = this.dataForm
      ? new Array(this.dataForm.get('createAdvancePayTransferInfo')?.value.value.length).fill(true)
      : [];
    this.initDocumentList();
    await this.initAdvanceDropdown();
    this.data = this.dataForm.get('createAdvancePayTransferInfo')?.value.value;
    this.formatTypeDesc();

    this.totalNetPayTransfer = this.getTotalNetPayTransfer();
  }

  formatTypeDesc() {
    this.data.forEach((form: any) => {
      form?.createAdvancePayTransferDetail?.forEach((i: any) => {
        if (i.advanceReceiveTypeDesc.includes('/')) {
          const insert = i.advanceReceiveTypeDesc.indexOf('/') + 1;
          i.advanceReceiveTypeDesc =
            i.advanceReceiveTypeDesc.slice(0, insert) + '\n' + i.advanceReceiveTypeDesc.slice(insert);
        }
      });
    });
  }

  initDocumentList() {
    [this.dataForm.get('createAdvancePayTransferInfo')?.value?.value].forEach((element, index) => {
      for (let i = 0; i < element.length; i++) {
        this.document = this.dataForm
          ? this.dataForm.get('createAdvancePayTransferInfo')?.value?.value[i].documentCourtVerdicts
          : null;
        if (this.document !== undefined) {
          this.documentUpload = (this.document as any[]).map((m, index) => {
            m.uploadDate = this.document[index].documentDate;
            m.documentTemplateId = this.document[index].documentTemplateId;
            m.documentTemplate = this.document[index].documentTemplate;
            m.imageId = this.document[index].imageId;
            m.isUpload = false;
            m.removeDocument = true;
            m.uploadRequired = this.document[index].documentTemplate?.optional;
            m.viewOnly = this.isViewMode;
            m.active = true;
            return m;
          });
        }
        this.documentUploadList.push(this.documentUpload);
      }
    });
  }

  async initAdvanceDropdown() {
    let accountType = await this.masterDataService.financialAccountType('ADVANCE_RECEIVE');
    this.advancePaymentGroupOptions = accountType?.financialAccountTypeDto || [];
  }

  initDefaultDropdown() {
    [this.dataForm.get('createAdvancePayTransferInfo')?.value?.value].map((element: any) => {
      for (let i = 0; i < element.length; i++) {
        let list = element[i].createAdvancePayTransferDetail as CreateAdvanceReceivePayTransferDetail[];
        list?.map((el, index) => {
          element[i].createAdvancePayTransferDetail[index].groupPayTransferCode = 'G12';
          element[i].createAdvancePayTransferDetail[index].groupPayTransferDesc = 'เป็นพับ/ศาลสั่งให้น้อยกว่า';
        });
      }
    }) || [];
  }

  async onClickRemark(i: number, j: number, element: any) {
    const isView = element.payTransfer === 0.0 && element.payTransferBefore === 0.0 ? true : false;
    const context = {
      note: this.dataForm.get('createAdvancePayTransferInfo')?.value?.value[i].createAdvancePayTransferDetail[j]
        .commentDesc,
      financeType: 'ADVANCE',
      memoHistory:
        this.dataForm.get('createAdvancePayTransferInfo')?.value?.value[i].createAdvancePayTransferDetail[j]
          .memoHistory,
      isViewMode: isView,
    };
    const result = await this.notificationService.showCustomDialog({
      component: RemarksPaymentDialogComponent,
      type: 'xsmall',
      iconName: 'icon-Notepad',
      title: 'ความคิดเห็นผู้นำเสนอ/ผู้อนุมัติ',
      leftButtonLabel: isView ? '' : 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: isView ? 'EXECUTION_WARRANT.LIST_ACCOUNT_DOCUMENT.BUTTON_CLOSE' : 'ยืนยันบันทึกความคิดเห็น',
      buttonIconName: isView ? 'icon-Dismiss-Square' : 'icon-save-primary',
      disableRightButton: element.payTransfer === 0.0 && element.payTransferBefore === 0.0 ? true : false,
      context: context,
    });
    if (result) {
      [this.dataForm.get('createAdvancePayTransferInfo')?.value?.value].map((element, index) => {
        element[i].createAdvancePayTransferDetail[j].commentDesc = result.note;
      });
      !isView &&
        this.notificationService.openSnackbarSuccess(
          `${this.translateService.instant(
            'FINANCE.REMARKS_PAYMENT_DIALOG.LABEL_REMARKS_ADVANCE'
          )} ${this.translateService.instant('TASK.LABEL_SAVED')}`
        );
      this.advanceService.hasEdit = true;
    }
  }

  private getCurrentLgCaseList(): string[] {
    let currentLgCaseList: Array<string> = [];
    if (this.dataForm.get('createAdvancePayTransferInfo')?.value.value[0] !== undefined) {
      [this.dataForm.get('createAdvancePayTransferInfo')?.value.value].map((element: any, index: number) => {
        for (let i = 0; i < element.length; i++) {
          currentLgCaseList.push(element[i].litigationCaseId?.toString() || '');
        }
      }) || [];
    }
    return currentLgCaseList;
  }

  async addList() {
    let currentLgList = this.getCurrentLgCaseList();

    const selectList =
      this.dataForm.get('createAdvancePayTransferInfo')?.value?.value.length !== 0
        ? this.dataForm.get('createAdvancePayTransferInfo')?.value.value
        : [];
    // console.log({ currentLgList, selectList })
    const result = await this.notificationService.showCustomDialog({
      component: AddLgDialogComponent,
      type: 'xsmall',
      iconName: 'icon-Plus',
      title: 'FINANCE.ADD_PAYMENT_LIST_DIALOG.TITLE',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'COMMON.BUTTON_CONTINUE2',
      buttonIconName: 'icon-Arrow-Right',
      context: { isAdvance: true, selectOneRow: true, hideSearch: true, selectList, currentLgCaseList: currentLgList },
    });
    if (result) {
      let lgList: Array<string> = result.map((m: LitigationTransactionDto) => m.litigationCaseId?.toString()) || [];
      lgList = [...lgList, ...currentLgList];
      let request = {
        litigationCaseId: lgList, // array of litigationCaseId
        mode: TransferOrderRequest.ModeEnum.Normal, // mode
        objectId: this.dataForm.get('advanceReceiveNo')?.value || undefined, // objectId
      };
      const advance = await this.advanceService.advanceReceiveInfoDetail(request);
      advance.createAdvancePayTransferInfo = (advance?.createAdvancePayTransferInfo || []).filter(dto =>
        lgList.includes((dto?.litigationCaseId ?? '').toString())
      );
      this.advanceService.advance = { ...advance };

      this.advanceService.hasEdit = true;

      const tempDataForm = this.advanceService.generateAdvanceForm(this.advanceService.advance);
      this.dataForm
        .get('createAdvancePayTransferInfo')
        ?.setValue(tempDataForm.get('createAdvancePayTransferInfo')?.value);
      this.ngOnInit();
    }
  }

  onSelectAdvancePaymentGroup(event: any, i: number, j: number) {
    [this.dataForm.get('createAdvancePayTransferInfo')?.value?.value].map(element => {
      const groupPayTransferObj = this.advancePaymentGroupOptions.find(item => item.value === event);
      const groupPayTransferList = groupPayTransferObj?.name ? groupPayTransferObj?.name.split('-') : '';
      const groupPayTransferCode = groupPayTransferList.length > 0 ? groupPayTransferList[0] : '';
      const groupPayTransferDesc = groupPayTransferList.length > 0 ? groupPayTransferList[1] : '';
      element[i].createAdvancePayTransferDetail[j].groupPayTransferCode = groupPayTransferCode;
      element[i].createAdvancePayTransferDetail[j].groupPayTransferDesc = groupPayTransferDesc;
    });
    this.advanceService.hasEdit = true;
  }

  async onDeletePaymentRecord(element: any, index: number) {
    const msg =
      'ลบรายการโอนเงินของ LG ID ' +
      element.litigationId +
      '<br>' +
      'คดีหมายเลขดำ ผบ' +
      element.blackCaseNo +
      ',' +
      '<br>' +
      'คดีหมายเลขแดง ผบ' +
      element.redCaseNo;
    const isContinue = await this.notificationService.warningDialog(
      'ลบรายการโอนเงิน',
      msg,
      'ยืนยันลบรายการโอนเงิน',
      'icon-Bin',
      'mat-warn long-button'
    );
    if (isContinue) {
      (this.dataForm.controls['createAdvancePayTransferInfo'].value as UntypedFormArray).removeAt(index);

      this.ngOnInit();
      this.advanceService.hasEdit = true;
    }
  }

  onUpdatePayTransfer(event: any, i: number, j: number) {
    const inputValue = event.target.value;
    this.logger.info('inputValue', inputValue);
    [this.dataForm.get('createAdvancePayTransferInfo')?.value?.value].map(element => {
      element[i].createAdvancePayTransferDetail[j].payTransfer = parseFloat(inputValue);
    });

    this.getSumPayTransfer(i);
    this.advanceService.hasEdit = true;
  }

  getControl(name: string): any {
    return this.dataForm.get(name);
  }

  getSumPayTransferBefore(index: number) {
    if (
      this.dataForm.get('createAdvancePayTransferInfo')?.value &&
      this.dataForm.get('createAdvancePayTransferInfo')?.value?.value[index]
    ) {
      let data = this.dataForm.get('createAdvancePayTransferInfo')?.value?.value[index]
        .createAdvancePayTransferDetail as CreateAdvanceReceivePayTransferDetail[];
      let sumPayTransferBefore: number = 0;
      data?.map(element => {
        sumPayTransferBefore += element.payTransferBefore || 0;
      });
      return sumPayTransferBefore;
    }

    return 0;
  }

  getSumPayTransfer(index: number) {
    if (
      this.dataForm.get('createAdvancePayTransferInfo')?.value &&
      this.dataForm.get('createAdvancePayTransferInfo')?.value?.value[index]
    ) {
      let data = this.dataForm.get('createAdvancePayTransferInfo')?.value?.value[index]
        .createAdvancePayTransferDetail as CreateAdvanceReceivePayTransferDetail[];
      let sumPayTransfer: number = 0;
      data?.map(element => {
        sumPayTransfer += element.payTransfer || 0;
      });
      return sumPayTransfer;
    }
    return 0;
  }

  getTotalNetPayTransfer() {
    let totalNetPayTransfer: number = 0;
    [this.dataForm.get('createAdvancePayTransferInfo')?.value?.value].map((element: any) => {
      for (let i = 0; i < element.length; i++) {
        let list = element[i].createAdvancePayTransferDetail as CreateAdvanceReceivePayTransferDetail[];
        (list ?? []).map((el, index) => {
          totalNetPayTransfer += element[i].createAdvancePayTransferDetail[index].payTransfer || 0;
        });
      }
    }) || [];
    return totalNetPayTransfer;
  }

  getGroupPayTransfer(groupPayTransferCode: string) {
    const result = this.advancePaymentGroupOptions.filter(el => {
      if (el.name?.substring(0, 3) === groupPayTransferCode) {
        return el;
      }
      return null;
    });
    return result[0] ? result[0].name?.replace('-', ' ') : '';
  }

  async onClickLg(lgId: string) {
    this.routerService.navigateTo('/main/finance/expense/detail/reimbursement', {
      litigationId: lgId,
      isShowActionBar: true,
    });
  }

  getadvancePaymentGroup(el: CreateAdvanceReceivePayTransferDetail, i: number, j: number) {
    let isAuto = (this.dataForm.get('advanceReceiveNo')?.value as string).substring(0, 2) === 'RC';

    if (isAuto && this.isOwnTaskEdit) {
      this.advancePaymentGroup = {
        displayWith: 'name',
        valueField: 'value',
        searchPlaceHolder: '',
        labelPlaceHolder: 'G12-เป็นพับ/ศาลสั่งให้น้อยกว่า',
        disableFloatLabel: true,
      };
      this.initDefaultDropdown();
      return this.advancePaymentGroup;
    } else if (!isAuto && this.isOwnTaskEdit && this.advancePaymentGroupOptions.length > 0) {
      [this.dataForm.get('createAdvancePayTransferInfo')?.value?.value].map(element => {
        const groupPayTransferObj = this.advancePaymentGroupOptions.find(
          item => item.value === el.groupPayTransferCode
        );
        const groupPayTransferList = groupPayTransferObj?.name ? groupPayTransferObj?.name.split('-') : '';
        const groupPayTransferCode = groupPayTransferList.length > 0 ? groupPayTransferList[0] : '';
        const groupPayTransferDesc = groupPayTransferList.length > 0 ? groupPayTransferList[1] : '';
        element[i].createAdvancePayTransferDetail[j].groupPayTransferCode = groupPayTransferCode;
        element[i].createAdvancePayTransferDetail[j].groupPayTransferDesc = groupPayTransferDesc;
      });
      const groupPayTransferName: string =
        this.advancePaymentGroupOptions.find(e => e.value === el.groupPayTransferCode)?.name || '';
      return (this.advancePaymentGroup = {
        displayWith: 'name',
        valueField: 'value',
        searchPlaceHolder: '',
        labelPlaceHolder: groupPayTransferName ? groupPayTransferName : '',
        disableFloatLabel: true,
      });
    }

    return {
      displayWith: 'name',
      valueField: 'value',
      searchPlaceHolder: '',
      labelPlaceHolder: 'โปรดเลือก',
      disableFloatLabel: true,
    };
  }
}
