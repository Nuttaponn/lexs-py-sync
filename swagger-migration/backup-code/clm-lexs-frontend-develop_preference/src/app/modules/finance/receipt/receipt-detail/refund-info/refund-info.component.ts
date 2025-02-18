import { Component, Input, OnInit, Pipe, PipeTransform } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ReceiptService } from '@app/modules/finance/services/receipt.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { SessionService } from '@app/shared/services/session.service';
import { LitigationTransactionDto, MeLexsUserDto, ReceiveAccountCode, TransferOrderDto } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';
import memo from 'memo-decorator';

import { payerTypeOptions } from '../../receipt.content';
import { AddLgDialogComponent } from '../add-lg-dialog/add-lg-dialog.component';

@Pipe({
  name: 'payerTrans',
})
export class PayerTransPipe implements PipeTransform {
  @memo()
  transform(value: any): string {
    payerTypeOptions.find(i => i.code === value);
    return payerTypeOptions.find(i => i.code === value)?.name || '-';
  }
}

@Component({
  selector: 'app-refund-info',
  templateUrl: './refund-info.component.html',
  styleUrls: ['./refund-info.component.scss'],
})
export class RefundInfoComponent implements OnInit {
  @Input() refundInfoForm!: UntypedFormGroup;
  @Input() isViewMode!: boolean;
  @Input() isDownLoad!: boolean;
  @Input() isViewCreditNote!: boolean;
  public referenceNoConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'code',
    searchPlaceHolder: '',
    labelPlaceHolder: 'เลขที่อ้างอิงตามเอกสาร',
  };
  public referenceNoOptions: any[] = [];
  public payerTypeConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'code',
    searchPlaceHolder: '',
    labelPlaceHolder: 'ประเภทผู้จ่ายเงิน',
  };
  public payerTypeOptions: any[] = payerTypeOptions;
  public receiveTypeConfig: DropDownConfig = {
    displayWith: 'caption',
    valueField: 'code',
    searchPlaceHolder: '',
    labelPlaceHolder: 'วิธีการรับเงิน',
  };
  public receiveTypeOptions: any[] = [];
  public accountConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'code',
    searchPlaceHolder: '',
    labelPlaceHolder: 'วิธีการรับเงิน',
  };
  public accountOptions: any[] = [];
  public payAmountConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'code',
    searchPlaceHolder: '',
    labelPlaceHolder: 'จำนวนเงินที่นำมาชำระค่าใช้จ่ายดำเนินคดี (บาท)',
  };
  public payAmountOptions: any[] = [];
  public accountCodeConfig: DropDownConfig = {
    displayWith: 'caption',
    valueField: 'code',
    searchPlaceHolder: '',
    labelPlaceHolder: 'รหัสบัญชี',
  };
  public accountCodeOptions: Array<ReceiveAccountCode> = [];
  list: any = [];
  public currentUser: MeLexsUserDto | undefined = {};
  public tfoList: TransferOrderDto[] = [];
  public formArray!: UntypedFormArray;
  isOpened: boolean = true;
  public isFailed: boolean = false;
  public receiveStatus: string | null = null;
  @Input() isPendingNoSuccess!: boolean;
  public accessPermissions = this.sessionService.accessPermissions();
  textBanner: string = '';

  constructor(
    private notificationService: NotificationService,
    private sessionService: SessionService,
    public receiptService: ReceiptService,
    private masterData: MasterDataService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentUser = this.sessionService?.currentUser;
    this.receiveStatus = this.getControl('receiveStatus')?.value;
    await this.initData();
  }

  async initData() {
    let receiveAccountCode = await this.masterData.receiveAccountCode();
    this.receiveTypeOptions =
      receiveAccountCode.receiveAccountCode
        ?.filter(f => f.receiveType === 'INTER_OFFICE' || f.receiveType === 'SUSPENSE')
        .map((mm: any) => {
          return { ...mm, caption: mm.code + '-' + mm.caption };
        }) || [];
    let transferOrders = await this.receiptService.genFormTransferOrders(
      this.receiptService?.receiveOrders?.transferOrders || []
    );
    transferOrders?.forEach((control: UntypedFormControl) => {
      this.transferOrders.push(control);
    });
    this.isFailed =
      this.receiveStatus === 'PENDING_NO_SUCCESS' ||
      this.receiveStatus === 'PENDING_EDIT' ||
      this.receiveStatus === 'PENDING_NO_SUCCESS' ||
      (this.accessPermissions.subRoleCode === 'APPROVER' &&
        (this.receiveStatus === 'PENDING_APPROVE' || this.receiveStatus === 'RECORD_NO_SUCCESS'));
    this.textBanner =
      this.accessPermissions.subRoleCode === 'APPROVER' &&
      (this.receiveStatus === 'PENDING_APPROVE' || this.receiveStatus === 'RECORD_NO_SUCCESS')
        ? 'กรุณาตรวจสอบข้อมูลการรับเงิน และกดปุ่ม“อนุมัติ” หรือ “ส่งกลับแก้ไข” เพื่อดำเนินการต่อไป'
        : 'กรุณาแก้ไขรายการรับเงิน และกด “นำเสนอ” หรือ “ยกเลิกรายการ” เพื่อดำเนินการต่อไป';
  }

  get transferOrders(): UntypedFormArray {
    return this.refundInfoForm.get('transferOrders') as UntypedFormArray;
  }

  async addList() {
    const result = await this.notificationService.showCustomDialog({
      component: AddLgDialogComponent,
      type: 'xsmall',
      iconName: 'icon-Plus',
      title: 'FINANCE.ADD_PAYMENT_LIST_DIALOG.TITLE',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'COMMON.BUTTON_CONTINUE2',
      buttonIconName: 'icon-Arrow-Right',
    });
    const findDupLGID = this.transferOrders
      .getRawValue()
      .find(
        item => item.litigationCaseId === result[0].litigationCaseId && item.litigationId === result[0].litigationId
      );
    if (result && !findDupLGID) {
      let lgList = result.map((m: LitigationTransactionDto) => m?.litigationCaseId?.toString()) || [];
      let tfoList = (await this.receiptService.getTransferOrder({ litigationCaseId: lgList })) as TransferOrderDto[];
      tfoList = tfoList.map((f: TransferOrderDto) => {
        f.transferTransactions = [
          {
            sendAmount: 0,
            creditNoteReceiverOrgCode: '',
            creditNoteReceiverOrgName: '',
            creditNoteDescription: '',
            hitCreditNote: 0,
            litigationCaseId: tfoList[0].litigationCaseId,
            litigationId: tfoList[0].litigationId,
            id: 0,
          },
        ];
        return f;
      });
      let transferOrders = await this.receiptService.genFormTransferOrders(tfoList || []);
      transferOrders?.forEach((control: UntypedFormControl) => {
        this.transferOrders.push(control);
      });
    }
  }

  getReceiveType() {
    const value = this.refundInfoForm?.get('receiveType')?.value;
    return this.receiveTypeOptions.find(i => i.code === value)?.caption;
  }

  getControl(ctlName: string): any {
    return this.refundInfoForm?.get(ctlName);
  }

  async onRefNoChange(e: any) {
    let refNo = e.target.value;
    if (refNo) {
      let data = await this.receiptService.getPaidAmount(refNo);
      this.refundInfoForm?.get('paidAmount')?.setValue(data || '2000');
    }
  }
}
