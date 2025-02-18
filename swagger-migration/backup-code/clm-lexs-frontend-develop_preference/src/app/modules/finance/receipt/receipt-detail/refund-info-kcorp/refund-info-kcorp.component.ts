import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ReceiptService } from '@app/modules/finance/services/receipt.service';
import { MENU_ROUTE_PATH } from '@app/shared/constant/routes.constant';
import { ITooltip } from '@app/shared/models';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  LitigationTransactionDto,
  NameValuePair,
  ReceiveOrderDto,
  TransferOrderDto,
  TransferTransactionDto,
} from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';
import { AddLgDialogComponent } from '../add-lg-dialog/add-lg-dialog.component';

@Component({
  selector: 'app-refund-info-kcorp',
  templateUrl: './refund-info-kcorp.component.html',
  styleUrls: ['./refund-info-kcorp.component.scss'],
})
export class RefundInfoKcorpComponent implements OnInit {
  @Input() refundInfoFormKcorp!: UntypedFormGroup;
  @Input() isViewMode!: boolean;
  @Input() isDownLoad!: boolean;
  @Input() isViewCreditNote!: boolean;
  public tfoList: TransferOrderDto[] = [];
  public receiveTypeOptions: any[] = [];
  public isOpened = true;
  public ktbOrgConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'หน่วยงานที่รับ Credit Note',
  };
  public ktbOrgOptions: NameValuePair[] = [];
  public creditNoteColums: string[] = ['creditNoteReceiverOrgCode', 'sendAmount', 'creditNoteDescription'];
  public outboundTransferT: Array<TransferTransactionDto> = [];
  public receiveStatus!: ReceiveOrderDto.ReceiveStatusEnum;
  public addMode: boolean = false;
  hided = true;
  bannerMessage: string = '';
  public taskUnprocess: boolean = false;
  public isEditReason: boolean = false;
  public tooltipParams: Array<ITooltip> = [
    {
      title: 'หมายเหตุ',
      content: 'ระบบจะแสดงเลขที่หนังสือหลังจากกด “บันทึกร่าง” หรือ “นำเสนอ”',
    },
  ];

  constructor(
    private notificationService: NotificationService,
    private fb: UntypedFormBuilder,
    private masterData: MasterDataService,
    private routerService: RouterService,
    private sessionService: SessionService,
    public receiptService: ReceiptService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initData();
    this.initBanner();
    this.receiveStatus = this.receiptService.receiveStatus
      ? this.receiptService.receiveStatus
      : this.receiptService.referenceNoDetail?.content?.[0].receiveDetails?.[0].receiveStatus || null;
    this.receiptService.receiptLandingTab.next(this.receiptService.currentTabIndex);
  }

  initBanner() {
    if (this.isDownLoad) {
      this.bannerMessage = 'กรุณาดาวน์โหลด Credit Note และกดปุ่ม “เสร็จสิ้น” เพื่อดำเนินการต่อไป';
    } else {
      if (this.sessionService.currentUser?.subRoleCode === 'APPROVER') {
        this.bannerMessage = 'กรุณาตรวจสอบข้อมูลการรับเงิน และกดปุ่ม “อนุมัติ” หรือ “ส่งกลับแก้ไข” เพื่อดำเนินการต่อไป';
      } else if (this.addMode) {
        this.bannerMessage =
          'กรุณาสร้างรายการคืนเงินนอกธนาคาร หรือ เพิ่มรายการรับเงิน และกด “นำเสนอ” เพื่อดำเนินการต่อไป';
      } else {
        this.bannerMessage = 'กรุณาระบุรายการรับเงิน และกด “นำเสนอ” หรือ “ยกเลิกรายการ” เพื่อดำเนินการต่อ';
      }
    }
  }

  async initData() {
    this.taskUnprocess = this.receiptService?.receiveOrdersKcorp?.taskUnprocess || false;
    this.outboundTransferT = this.receiptService?.receiveOrdersKcorp?.outboundTransferTransaction || [];
    let transferOrders = await this.receiptService.genFormTransferOrders(
      this.receiptService?.receiveOrdersKcorp?.transferOrders || []
    );
    this.addTransferOrder(transferOrders);
    let receiveAccountCode = await this.masterData.receiveAccountCode();
    this.receiveTypeOptions =
      receiveAccountCode.receiveAccountCode
        ?.filter(f => f.receiveType === 'INTER_OFFICE' || f.receiveType === 'SUSPENSE')
        .map((mm: any) => {
          return { ...mm, caption: mm.code + '-' + mm.caption };
        }) || [];
    this.ktbOrgOptions = (await this.masterData.ktbOrg()).ktbOrg || [];

    if (!this.getControl('receiveNo')?.value) {
      this.addMode = true;
    }
    if (
      transferOrders &&
      transferOrders.value?.length === 0 &&
      this.outboundTransferT &&
      this.outboundTransferT.length === 0
    ) {
      this.transferOrders.addValidators(Validators.required);
      this.transferOrders.updateValueAndValidity();
    }
    this.isEditReason =
      this.receiptService?.receiveOrdersKcorp?.editReason === null ||
      this.receiptService?.receiveOrdersKcorp?.editReason === '' ||
      this.receiptService?.receiveOrdersKcorp?.editReason === undefined
        ? false
        : true;
    if (this.refundInfoFormKcorp?.get('receiveType')?.value === 'SUSPENSE_COURT') {
      this.refundInfoFormKcorp?.get('transferOrders')?.clearValidators();
      this.refundInfoFormKcorp?.get('transferOrders')?.updateValueAndValidity();
      console.log('this.refundInfoFormKcorp', this.refundInfoFormKcorp);
    }
  }

  addTransferOrder(transferOrders: Array<any>) {
    this.transferOrders &&
      transferOrders?.forEach((control: UntypedFormControl) => {
        this.transferOrders.push(control);
      });
  }

  async navigate() {
    const _confirm = await this.sessionService.confirmExitWithoutSave();
    _confirm && this.routerService.navigateTo(`${MENU_ROUTE_PATH.FINANCE_RECEIPT}/kcorp-detail`);
  }

  getControl(ctrName: string): any {
    return this.refundInfoFormKcorp?.get(ctrName);
  }

  get transferOrders(): UntypedFormArray {
    return this.refundInfoFormKcorp?.get('transferOrders') as UntypedFormArray;
  }

  get outboundTransferTransaction(): UntypedFormArray {
    return this.refundInfoFormKcorp?.get('outboundTransferTransaction') as UntypedFormArray;
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
    if (result) {
      let lgList = result.map((m: LitigationTransactionDto) => m.litigationCaseId?.toString()) || [];
      let list = (await this.receiptService.getTransferOrder({ litigationCaseId: lgList })) as TransferOrderDto[];
      list = list.map((f: TransferOrderDto) => {
        f.transferTransactions = [
          {
            sendAmount: 0,
            creditNoteReceiverOrgCode: '',
            creditNoteReceiverOrgName: '',
            creditNoteDescription: '',
            hitCreditNote: 0,
            litigationCaseId: list[0].litigationCaseId,
            litigationId: list[0].litigationId,
            id: 0,
          },
        ];
        return f;
      });
      let transferOrdersData = this.transferOrders.value || [];
      this.transferOrders.clear();
      this.receiptService.receiveOrdersKcorp.transferOrders = transferOrdersData?.concat(list);
      let transferOrders = await this.receiptService.genFormTransferOrders(
        this.receiptService?.receiveOrdersKcorp?.transferOrders || []
      );
      this.addTransferOrder(transferOrders);
      this.refundInfoFormKcorp.markAsDirty();
    }
  }
  onClickOutbound() {
    let data: TransferTransactionDto = {
      creditNoteDescription: ' ',
      creditNoteReceiverOrgCode: ' ',
      creditNoteReceiverOrgName: '',
      sendAmount: 0,
    };
    this.outboundTransferTransaction.push(
      this.fb.group({
        creditNoteDescription: ['', Validators.required],
        creditNoteReceiverOrgCode: ['', Validators.required],
        creditNoteReceiverOrgName: '',
        sendAmount: ['', Validators.required],
      })
    );
    this.outboundTransferT.push(data);
    this.transferOrders.removeValidators(Validators.required);
    this.transferOrders.updateValueAndValidity();
  }

  getContractToolTip(title: string, contents: any): Array<ITooltip> {
    return contents.map((item: any, index: any) => {
      if (index !== 0) {
        return { content: item };
      } else {
        return {
          title: title,
          content: item,
        };
      }
    });
  }

  getArray(ctrName: string): any {
    return this.outboundTransferTransaction?.at(0)?.get(ctrName) as UntypedFormArray;
  }

  async deleleOutbound() {
    let msg = `คุณต้องการลบ "รายการคืนเงินนอกธนาคาร" ?`;
    const isContinue = await this.notificationService.warningDialog(
      'ลบรายการคืนเงินนอกธนาคาร',
      msg,
      'ยืนยันลบรายการ',
      'icon-Bin',
      'mat-warn'
    );
    if (isContinue) {
      this.outboundTransferTransaction.removeAt(0);
      this.outboundTransferT = [];
      this.receiptService.receiveOrdersKcorp.transferOrders = this.transferOrders?.value || [];
      this.transferOrders.addValidators(Validators.required);
      this.transferOrders.updateValueAndValidity();
    }
  }

  expandPanel() {
    this.hided = !this.hided;
  }
}
