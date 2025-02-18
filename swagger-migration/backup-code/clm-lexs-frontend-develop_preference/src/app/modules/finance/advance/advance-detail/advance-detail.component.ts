import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RejectDialogComponent } from '@app/shared/components/common-dialogs/reject-dialog/reject-dialog.component';
import { ActionBar, statusCode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { CreateAdvanceReceivePayTransferDetail, CreateAdvanceReceivePayTransferRequest } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { AdvanceService } from '../../services/advance.service';

@Component({
  selector: 'app-advance-detail',
  templateUrl: './advance-detail.component.html',
  styleUrls: ['./advance-detail.component.scss'],
})
export class AdvanceDetailComponent implements OnInit {
  public actionBar!: ActionBar;
  public taskId!: number;
  public dataForm!: UntypedFormGroup;
  public isApproved = true;
  public statusCode!: statusCode;
  public isCreate: boolean = false;
  public isOwnTask: boolean = false;
  public currentAssigneeId!: string;
  public isOwnTaskEdit: boolean = false;
  public isSubmit: boolean = false;

  isChildComponentVisible = true;
  oldLitigationCaseIds!: string[];

  constructor(
    private routerService: RouterService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private advanceService: AdvanceService,
    private sessionService: SessionService,
    private translate: TranslateService
  ) {
    this.route.queryParams.subscribe(value => {
      this.taskId = value['taskId'];
      this.statusCode = value['statusCode'];
      this.isCreate = ['true', 'false'].includes(value['isCreate']) ? JSON.parse(value['isCreate']) : value['isCreate'];
      this.currentAssigneeId = value['currentAssigneeId'];
    });
  }

  ngOnInit() {
    this.dataForm = this.advanceService.generateAdvanceForm(this.advanceService.advance);
    this.isOwnTask = this.sessionService.isOwnerTask(this.currentAssigneeId);
    this.isOwnTaskEdit =
      this.isOwnTask &&
      (this.dataForm.get('advanceReceivePaymentStatusCode')?.value === 'DRAFT' ||
        this.dataForm.get('advanceReceivePaymentStatusCode')?.value === 'PENDING_EDIT' ||
        this.dataForm.get('advanceReceivePaymentStatusCode')?.value === 'PENDING_NO_SUCCESS');
    this.initActionBar();
    this.advanceService.hasEdit = false;
    this.oldLitigationCaseIds = this.getCurrentLgCaseList();
  }

  recreateChildComponent(): void {
    this.isChildComponentVisible = false;
    setTimeout(() => {
      this.isChildComponentVisible = true;
    }, 0);
  }

  initActionBar() {
    if (this.isCreate || this.isOwnTaskEdit) {
      this.actionBar = {
        hasCancel: false,
        hasSave: true,
        saveText: 'COMMON.BUTTON_SAVE_DARFT',
        hasReject: this.dataForm.get('advanceReceiveNo')?.value ? true : false,
        hasPrimary: true,
        rejectText: 'ยกเลิกรายการ',
        primaryText: 'FINANCE.BUTTON_SUBMIT',
        primaryIcon: 'icon-Selected',
      };
    } else {
      this.actionBar = {
        hasCancel: false,
        hasSave: false,
        hasReject: false,
        hasPrimary: false,
      };
    }
  }

  async onBack() {
    if (!this.advanceService.hasEdit) {
      this.routerService.back();
    } else {
      const _confirm = await this.sessionService.confirmExitWithoutSave();
      _confirm && this.routerService.back();
    }
  }

  onCancel() {
    this.onBack();
  }

  private processDataSetUpdateFlag() {
    if (this.dataForm.valid) {
      [this.dataForm.get('createAdvancePayTransferInfo')?.value?.value].map((element, index) => {
        for (let i = 0; i < element.length; i++) {
          if (this.dataForm.get('advanceReceiveNo')?.value) {
            if (!this.oldLitigationCaseIds.includes((element[i].litigationCaseId || '').toString())) {
              element[i].updateFlag = 'A';
            } else {
              element[i].updateFlag = 'U';
            }
          } else {
            element[i].updateFlag = 'A';
          }
        }
      });
    }
  }

  async onSave() {
    this.dataForm.markAllAsTouched();
    this.dataForm.updateValueAndValidity();

    if (this.dataForm.valid) {
      this.processDataSetUpdateFlag();

      let data = {
        ...this.dataForm.getRawValue(),
        createAdvancePayTransferInfo: (this.dataForm.get('createAdvancePayTransferInfo') as UntypedFormArray).value
          .value,
      };
      let request: CreateAdvanceReceivePayTransferRequest = Object.assign({ headerFlag: 'DRAFT' }, data);
      let res = await this.advanceService.createAdvanceReceive(this.taskId, request);
      if (res.success) {
        let advanceReceiveNo = this.dataForm.get('advanceReceiveNo')?.value
          ? this.dataForm.get('advanceReceiveNo')?.value
          : res.receiveNo || '';
        this.notificationService.openSnackbarSuccess(
          `รายการโอนเงินทดรองจ่ายเป็นค่าใช้จ่าย ${advanceReceiveNo} บันทึกร่างสำเร็จแล้ว`
        );
        let currentLgList: Array<string> = [];
        if (this.dataForm.get('createAdvancePayTransferInfo')?.value.value[0] !== undefined) {
          [this.dataForm.get('createAdvancePayTransferInfo')?.value.value].map((element: any, index: number) => {
            for (let i = 0; i < element.length; i++) {
              currentLgList.push(element[i].litigationCaseId?.toString() || '');
            }
          }) || [];
        }
        let data = await this.advanceService.getAdvanceReceiveOrder(advanceReceiveNo);
        if (data) {
          this.advanceService.advance = data;

          Object.assign(this.dataForm, this.advanceService.generateAdvanceForm(this.advanceService.advance));
          this.actionBar.hasReject = true;

          this.recreateChildComponent();
          this.oldLitigationCaseIds = this.getCurrentLgCaseList();
        }
        this.advanceService.hasEdit = false;
      }
    }
  }

  async onSubmit() {
    this.dataForm.markAllAsTouched();
    this.dataForm.updateValueAndValidity();

    this.isSubmit = true;
    const isContinue = await this.notificationService.warningDialog(
      'ยืนยันนำส่งข้อมูล',
      'กรุณาตรวจสอบความถูกต้องของข้อมูลและกดปุ่ม “ยืนยัน“เพื่อดำเนินงานต่อไป'
    );

    if (isContinue) {
      if (this.dataForm.valid && this.isPaymentTransferFilled() && this.isGroupPayTransferFilled()) {
        this.processDataSetUpdateFlag();

        let data = {
          ...this.dataForm.getRawValue(),
          createAdvancePayTransferInfo: (this.dataForm.get('createAdvancePayTransferInfo') as UntypedFormArray).value
            .value,
        };
        let request: CreateAdvanceReceivePayTransferRequest = Object.assign({ headerFlag: 'SUBMIT' }, data);
        let res = await this.advanceService.createAdvanceReceive(this.taskId, request);
        if (res.success) {
          this.notificationService.openSnackbarSuccess(
            `รายการโอนเงินทดรองจ่ายเป็นค่าใช้จ่าย ${res.receiveNo} นำเสนอสำเร็จแล้ว`
          );
          this.routerService.back();
        } else {
          this.notificationService.openSnackbarError(
            this.translate.instant(`FINANCE.EXPENSE_WITHDRAWAL_INFO_DIALOG.TRANSACTION_AMOUNT_GREATER_THAN_ZERO`)
          );
        }
      }
    }
  }

  async onReject() {
    let data = {
      ...this.dataForm.getRawValue(),
      createAdvancePayTransferInfo: (this.dataForm.get('createAdvancePayTransferInfo') as UntypedFormArray).value.value,
    };
    let request: CreateAdvanceReceivePayTransferRequest = Object.assign({ headerFlag: 'REJECT' }, data);
    const context = {
      mode: 'FINANCE_ADVANCE',
      advanceReceiveNo: this.dataForm.get('advanceReceiveNo')?.value,
      cancelReason: null,
      cancelReasonOther: null,
      taskId: this.taskId,
      advanceRequestObj: request,
      action: 'CANCEL',
      maxTextArea: 500,
    };
    await this.notificationService.showCustomDialog({
      component: RejectDialogComponent,
      iconName: 'icon-Dismiss-Square',
      title: 'ยกเลิกรายการ',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'ยืนยันยกเลิกรายการ',
      buttonIconName: 'icon-Dismiss-Square',
      rightButtonClass: 'long-button mat-warn',
      context: context,
    });

    console.log('onReject');
  }

  isPaymentTransferFilled() {
    return (
      [this.dataForm.get('createAdvancePayTransferInfo')?.value.value].map((element: any, index: number) => {
        let acc = [];
        for (let i = 0; i < element.length; i++) {
          let list = element[i].createAdvancePayTransferDetail as CreateAdvanceReceivePayTransferDetail[];
          acc.push(
            list.every(item => {
              return item.payTransfer !== null && item.payTransfer !== undefined;
            })
          );
        }
        return acc.every(acc => acc);
      }) || []
    ).every(isValid => isValid);
  }

  isGroupPayTransferFilled() {
    return (
      [this.dataForm.get('createAdvancePayTransferInfo')?.value.value].map((element: any, index: number) => {
        let acc = [];
        for (let i = 0; i < element.length; i++) {
          let list = element[i].createAdvancePayTransferDetail as CreateAdvanceReceivePayTransferDetail[];
          acc.push(
            list.every(item => {
              return !!item.groupPayTransferCode;
            })
          );
        }
        return acc.every(acc => acc);
      }) || []
    ).every(isValid => isValid);
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
}
