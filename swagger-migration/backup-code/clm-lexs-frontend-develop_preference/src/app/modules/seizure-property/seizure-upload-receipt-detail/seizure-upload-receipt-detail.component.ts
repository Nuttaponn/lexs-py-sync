import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReceiptColumn } from '../models';
import { ActionBar, BlobType, accept_PDF } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { SeizurePropertyService } from '../seizure-property.service';
import { BuddhistEraPipe } from '@spig/core';
import { ActivatedRoute } from '@angular/router';
import { coerceString, getFileSizeMB } from '@app/shared/utils';
import { NotificationService } from '@app/shared/services/notification.service';
import {
  DocumentControllerService,
  DocumentDto,
  PostApprovalRequest,
  SeizureFeeControllerService,
  SeizureNonEFillingInvoiceDto,
  SeizureReceiptRequest,
} from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { SessionService } from '@app/shared/services/session.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { TaskState } from '../seizure-upload-receipt/seizure-upload-receipt.component';
import { TaskService } from '@app/modules/task/services/task.service';
import { RejectDialogComponent } from '@app/shared/components/common-dialogs/reject-dialog/reject-dialog.component';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';

interface IReceipt {
  orderNumber: number;
  documentName: string;
  receiveDate: string;
  document: DocumentDto;
  action: IAction;
}

interface IAction {
  uploaded: boolean;
  deletable: boolean;
  hidden: boolean;
  disabled: boolean;
}

@Component({
  selector: 'app-seizure-upload-receipt-detail',
  templateUrl: './seizure-upload-receipt-detail.component.html',
  styleUrls: ['./seizure-upload-receipt-detail.component.scss'],
})
export class SeizureUploadReceiptDetailComponent implements OnInit {
  public receiptSource = new MatTableDataSource<IReceipt>([]);
  public acceptFileList: string[] = accept_PDF;
  public title: string = 'อัปโหลดใบเสร็จค่าใช้จ่ายบังคับคดีตั้งเรื่องยึดทรัพย์';
  public statusName: string = '';
  public receiptColumn: Array<string> = [...ReceiptColumn];
  public messageBanner: string = 'กรุณาอัปโหลด “ใบเสร็จค่าใช้จ่ายบังคับคดีตั้งเรื่องยึดทรัพย์” เพื่อดำเนินการต่อไป';
  private currentDocument!: DocumentDto;
  public uploadError: boolean = false;
  public actionBar: ActionBar = {
    hasSave: false,
    hasPrimary: false,
    hasCancel: false,
    hasReject: false,
  };

  public form = this.fb.group({
    blackCaseNo: [''],
    redCaseNo: [''],
    courtName: [''],
    plaintiffName: [''],
    amount: ['', Validators.required],
    receiptId: ['', Validators.required],
  });

  public receiptData!: SeizureNonEFillingInvoiceDto;

  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private datePipe: BuddhistEraPipe,
    private pdfService: DocumentService,
    private routerService: RouterService,
    private sessionService: SessionService,
    private seizureService: SeizurePropertyService,
    private notification: NotificationService,
    private documentService: DocumentControllerService,
    private litigationCaseService: LitigationCaseService,
    private seizureFeeService: SeizureFeeControllerService
  ) {}

  public isViewMode: boolean = false;

  get seizureLedId() {
    return (
      this.route.snapshot.paramMap.get('seizureLedId') || this.route.snapshot.queryParamMap.get('seizureLedId') || '0'
    );
  }

  get litigationId() {
    return (
      this.route.snapshot.paramMap.get('litigationId') || this.route.snapshot.queryParamMap.get('litigationId') || '0'
    );
  }

  get cif() {
    return this.route.snapshot.paramMap.get('cif') || this.route.snapshot.queryParamMap.get('cif') || '0';
  }

  get taskId() {
    return this.route.snapshot.paramMap.get('taskId') || this.route.snapshot.queryParamMap.get('taskId') || '0';
  }

  get state(): TaskState {
    const state =
      this.route.snapshot.paramMap.get('state') ||
      this.route.snapshot.queryParamMap.get('state') ||
      TaskState.Waiting_Upload_Receipt;

    return state ? <TaskState>state : TaskState.Waiting_Upload_Receipt;
  }

  get caseDetail() {
    return this.litigationCaseService.litigationCaseShortDetail;
  }

  get TaskState() {
    return TaskState;
  }

  get val() {
    return this.form.getRawValue();
  }

  get controls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.loadTaskState();
    this.loadReceiptTable();
  }

  loadTaskState() {
    const taskState = <TaskState>this.state;
    switch (taskState) {
      case TaskState.Waiting_Upload_Receipt:
        this.enableUploadReceipt();
        break;

      case TaskState.Waiting_Approval:
        this.enableApproval();
        break;
    }
  }

  enableUploadReceipt() {
    this.title = 'อัปโหลดใบเสร็จค่าใช้จ่ายบังคับคดีตั้งเรื่องยึดทรัพย์';
    this.messageBanner = `กรุณาอัปโหลด “ใบเสร็จค่าใช้จ่ายบังคับคดีตั้งเรื่องยึดทรัพย์” เพื่อดำเนินการต่อไป`;
    this.actionBar.hasPrimary = true;
    this.actionBar.primaryText = 'ยืนยันอัปโหลดใบเสร็จ';
  }

  enableApproval() {
    const isOwner = this.sessionService.currentUser?.userId === this.taskService.taskOwner;
    this.title = 'ตรวจสอบใบเสร็จค่าใช้จ่ายบังคับคดีตั้งเรื่องยึดทรัพย์';
    this.statusName = 'รอตรวจสอบใบเสร็จค่าใช้จ่ายบังคับคดีตั้งเรื่องยึดทรัพย์';
    this.messageBanner = isOwner
      ? 'กรุณาตรวจสอบใบเสร็จค่าใช้จ่าย และกด “อนุมัติ” หรือ “ส่งกลับแก้ไข” เพื่อดำเนินการต่อ'
      : '';
    this.receiptColumn = this.receiptColumn.filter(it => it !== 'action');
    this.isViewMode = true;
    this.actionBar = {
      primaryText: 'อนุมัติ',
      hasCancel: false,
      hasSave: false,
      hasReject: isOwner,
      hasPrimary: isOwner,
    };
  }

  updateBannerMessageRejectMode() {
    if (this.taskService.taskDetail.statusCode === 'AWAITING') {
      this.messageBanner = `กรุณาอัปโหลด “ใบเสร็จค่าใช้จ่ายบังคับคดีตั้งเรื่องยึดทรัพย์” และกดปุ่ม "เสร็จสิ้น" เพื่อดำเนินการต่อไป\nเหตุผลในการขอแก้ไข: ${
        this.receiptData?.reviseReason || '-'
      }`;
    }
  }

  async canDeactivate() {
    if (this.form.dirty || this.form.invalid) {
      return await this.sessionService.confirmExitWithoutSave();
    }

    return true;
  }

  loadReceiptTable() {
    this.seizureService.getReceiptInfo(this.seizureLedId).then(resp => {
      this.receiptData = resp;
      const today = new Date();
      const document = resp.receiptDocumentDto || {};
      const imageId = this.val.receiptId || document.imageId || null;
      const amount = this.val.amount || resp.amount;
      const uploaded = imageId ? true : false;
      const uploadedDate = this.val.receiptId ? today : document.documentDate;
      const receiveDate = uploadedDate ? this.datePipe.transform(uploadedDate, 'DD/MM/yyyy') : '-';

      // Update document DTO
      this.currentDocument = document;

      // Update raw data
      this.form.patchValue({
        blackCaseNo: resp.blackCaseNo,
        redCaseNo: resp.redCaseNo,
        courtName: resp.courtName,
        plaintiffName: resp.plaintiffName,
        amount: amount,
        receiptId: imageId,
      });

      // Update table
      this.receiptSource.data = [
        {
          orderNumber: 1,
          receiveDate: receiveDate,
          document: resp.receiptDocumentDto || {},
          documentName: document?.documentTemplate?.documentName || '',
          action: {
            uploaded: uploaded,
            deletable: uploaded,
            hidden: false,
            disabled: false,
          },
        },
      ];

      this.updateBannerMessageRejectMode();
    });
  }

  onSubmitOrApprove() {
    switch (this.state) {
      case TaskState.Waiting_Approval:
        this.onApprove();
        break;

      case TaskState.Waiting_Upload_Receipt:
        this.onSubmitReceipt();
        break;
    }
  }

  onApprove() {
    const taskId = coerceNumberProperty(this.taskService.taskDetail.id);
    const seizureLedId = coerceNumberProperty(this.seizureLedId);
    const litigationId = coerceString(this.litigationId, '0');
    const litigationCaseId = coerceNumberProperty(this.taskService.taskDetail.litigationCaseId);
    const request: PostApprovalRequest = {
      action: PostApprovalRequest.ActionEnum.Approve,
      litigationCaseId: litigationCaseId,
      litigationId: litigationId,
    };

    return lastValueFrom(this.seizureFeeService.approveReceiptNonEFilling(seizureLedId, taskId, request))
      .then(() =>
        this.toast(`อนุมัติใบเสร็จค่าใช้จ่ายบังคับคดีตั้งเรื่องยึดทรัพย์ในเลขที่กฎหมาย\n${litigationId} แล้ว`)
      )
      .then(() => this.form.markAsPristine())
      .then(() => this.onBack());
  }

  onReject() {
    const taskId = coerceNumberProperty(this.taskService.taskDetail.id);
    const seizureLedId = coerceNumberProperty(this.seizureLedId);
    const litigationId = coerceString(this.caseDetail.litigationId, '0');
    const litigationCaseId = coerceNumberProperty(this.taskService.taskDetail.litigationCaseId);
    const customerId = coerceString(this.receiptData?.makerId, 'ไม่ระบุ');
    const customerName = coerceString(this.receiptData?.makerName, 'ไม่ระบุ');

    return this.notification
      .showCustomDialog({
        component: RejectDialogComponent,
        iconName: 'icon-Arrow-Revert',
        title: 'COMMON.LABEL_SEND_BACK_EDIT',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        rightButtonLabel: 'COMMON.CONFIRM_SEND_BACK_EDIT',
        buttonIconName: 'icon-Arrow-Revert',
        rightButtonClass: 'long-button mat-warn',
        context: {
          mode: 'DEFAULT',
          action: 'RETURN',
          showFieldContent: true,
          showMsgContent: true,
          fieldContentText: 'ผู้ทำรายการ',
          fieldContentValue: `${customerId} - ${customerName}`,
          titleFieldContent: 'งานจะถูกส่งกลับให้',
        },
      })
      .then(resp => {
        if (!!resp) return resp;
        else return Promise.reject('User has cancelled');
      })
      .then(({ reason }) => {
        return lastValueFrom(
          this.seizureFeeService.approveReceiptNonEFilling(seizureLedId, taskId, {
            action: PostApprovalRequest.ActionEnum.Return,
            litigationCaseId: litigationCaseId,
            litigationId: litigationId,
            reason: reason,
          })
        );
      })
      .then(() =>
        this.toast(`ส่งกลับแก้ไขใบเสร็จรับเงินค่าธรรมเนียม\nศาลเพิกถอนการขายแล้วในเลขที่กฎหมาย\n${litigationId} แล้ว`)
      )
      .then(() => this.form.markAsPristine())
      .then(() => this.onBack());
  }

  onSubmitReceipt() {
    if (this.form.valid) {
      const taskId = coerceNumberProperty(this.taskId);
      const seizureLedId = coerceNumberProperty(this.seizureLedId);
      const documentDTO: DocumentDto = { ...this.currentDocument, imageId: this.val.receiptId };
      const request: SeizureReceiptRequest = {
        amount: coerceNumberProperty(this.val.amount),
        receiptDocumentDto: documentDTO,
      };

      return lastValueFrom(this.seizureFeeService.submitReceiptNonEFilling(seizureLedId, taskId, request))
        .then(() =>
          this.toast(`เลขที่กฎหมาย: ${this.litigationId} อัปโหลด\nใบเสร็จค่าใช้จ่ายบังคับคดีตั้งเรื่องยึดทรัพย์\nแล้ว`)
        )
        .then(() => this.form.markAsPristine())
        .then(() => this.onBack());
    }

    this.form.markAllAsTouched();
    return this.form.updateValueAndValidity();
  }

  async onUploadFile(event: Event) {
    const element = event.target as HTMLInputElement;
    const fileList = element?.files || null;

    if (fileList) {
      const rowData = <IReceipt>(<any>element)['rowData'];
      const file = fileList[0];
      const fileSizeMb = getFileSizeMB(file.size);
      const documentTemplateId = coerceString(rowData.document.documentTemplateId);
      const maxFileSize = 30;
      const exceedSizeLimit = fileSizeMb >= maxFileSize;
      const isNotPDF = file.type !== BlobType.PDF;

      // Check file size is maximum size or correct file extension
      if (exceedSizeLimit || isNotPDF) {
        element.value = '';
        this.uploadError = true;
        this.toast('ไม่สามารถอัปโหลดเอกสารได้ โปรดตรวจสอบประเภทไฟล์ที่อัปโหลด', 'error');
        throw new TypeError(`ไม่สามารถอัปโหลดเอกสารได้ โปรดตรวจสอบประเภทไฟล์ที่อัปโหลด`);
      }

      // Upload image and update document object
      await lastValueFrom(this.documentService.uploadDocument(this.cif, documentTemplateId, file, this.litigationId))
        .then(resp => this.controls['receiptId'].setValue(resp.uploadSessionId))
        .then(() => this.toast('อัปโหลดเอกสารสำเร็จ'))
        .then(() => this.form.markAllAsTouched())
        .then(() => this.loadReceiptTable())
        .then(() => (element.value = ''))
        .then(() => (this.uploadError = false));
    }
  }

  toast(msg: string, type: 'success' | 'error' = 'success') {
    return type == 'success' ? this.notification.openSnackbarSuccess(msg) : this.notification.openSnackbarError(msg);
  }

  onUploadReceipt(element: IReceipt) {
    const uploaderElement = this.fileUpload.nativeElement;
    uploaderElement.rowData = element;
    return uploaderElement.click();
  }

  onDeleteReceipt(element: IReceipt) {
    this.controls['receiptId'].setValue('');
    element.document.imageId = '';
    element.receiveDate = '-';
    element.action.uploaded = false;
    element.action.deletable = false;
  }

  onBack() {
    return this.routerService.back();
  }

  async onDownload(ele: IReceipt) {
    if (ele.action.uploaded) {
      const imageId = this.val.receiptId;
      const response = await this.pdfService.getDocument(imageId, DocumentDto.ImageSourceEnum.Lexs);
      this.pdfService.openPdf(response, ele.documentName);
    }
  }
}
