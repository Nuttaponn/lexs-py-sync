import { Component, OnInit } from '@angular/core';
import { ILegalExecution, LEGAL_EXECUTION_COLUMN } from '../models';
import { ActionBar, taskCode as TaskCode } from '@app/shared/models';
import { MatTableDataSource } from '@angular/material/table';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { RouterService } from '@app/shared/services/router.service';
import {
  PostApprovalRequest,
  SeizureControllerService,
  SeizureFeeControllerService,
  SeizureLedsInfo,
  SeizureNonEFillingInvoiceDto,
} from '@lexs/lexs-client';
import { coerceString } from '@app/shared/utils';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { lastValueFrom } from 'rxjs';
import { TaskService } from '@app/modules/task/services/task.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RejectDialogComponent } from '@app/shared/components/common-dialogs/reject-dialog/reject-dialog.component';
import { SessionService } from '@app/shared/services/session.service';
import { SeizurePropertyService } from '../seizure-property.service';

export enum TaskState {
  Waiting_Upload_Receipt = 'UPLOAD_RECEIPT',
  Waiting_Approval = 'APPROVAL',
  View_Only = 'VIEW_ONLY',
}
@Component({
  selector: 'app-seizure-upload-receipt',
  templateUrl: './seizure-upload-receipt.component.html',
  styleUrls: ['./seizure-upload-receipt.component.scss'],
})
export class SeizureUploadReceiptComponent implements OnInit {
  public legalColumn = LEGAL_EXECUTION_COLUMN;
  public messageBanner: string | undefined = '';
  public statusName: string = '';
  public title: string = '';
  private taskCode!: TaskCode;
  public state: TaskState = TaskState.Waiting_Upload_Receipt;
  public legalExecutionSource = new MatTableDataSource<ILegalExecution>([]);
  public actionBar: ActionBar = {
    hasSave: false,
    hasPrimary: false,
    hasCancel: false,
    hasReject: false,
  };

  public localStates = {
    legalExecutionSection: true,
    noneLegalExecutionSection: true,
    taskCode: '',
    taskStatus: '',
    showBanner: true,
  };

  public receiptData!: SeizureNonEFillingInvoiceDto;

  get TaskState() {
    return TaskState;
  }

  get caseDetailHidelawyer() {
    return this.taskCode === TaskCode.R2E05_01_2D || this.taskCode === TaskCode.R2E05_02_3C;
  }

  get seizureLedId() {
    const { objectId = 0 } = this.taskService.taskDetail;
    return coerceNumberProperty(objectId);
  }

  get caseDetail() {
    return this.litigationCaseService.litigationCaseShortDetail;
  }

  get markIcons() {
    return [
      'PENDING_RECEIPT_UPDATE',
      'PENDING_RECEIPT_VERIFICATION',
      'PENDING_RECEIPT_UPDATE',
      'PENDING_RECEIPT_UPLOAD',
    ];
  }

  constructor(
    private taskService: TaskService,
    private routerService: RouterService,
    private notification: NotificationService,
    private sessionService: SessionService,
    private seizureService: SeizureControllerService,
    private litigationCaseService: LitigationCaseService,
    private seizureFeeService: SeizureFeeControllerService,
    private seizurePropertyService: SeizurePropertyService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadTable();
    await this.loadReceiptDetail();
    this.loadTaskState();
  }

  loadTaskState() {
    const { taskCode, statusCode } = this.taskService.taskDetail;
    const code = `${taskCode}_${statusCode}`;
    switch (code) {
      case 'R2E35-01-E05-01-6A_PENDING':
        this.enableUploadReceipt();
        break;
      case 'R2E35-01-E05-02-6B_AWAITING':
        this.enableRejectMode();
        break;
      case 'R2E35-01-E05-02-6B_PENDING':
        this.enableApproval();
        break;
    }
  }

  enableUploadReceipt() {
    this.state = TaskState.Waiting_Upload_Receipt;
    this.title = 'รายละเอียดการยึดทรัพท์จำนอง ครั้งที่ 1';
    // this.messageBanner = `กรุณาอัปโหลด “ใบเสร็จค่าใช้จ่ายบังคับคดีตั้งเรื่องยึดทรัพย์” และกดปุ่ม "เสร็จสิ้น" เพื่อดำเนินการต่อไป\nเหตุผลในการขอแก้ไข: ใส่ข้อมูลไม่ครบถ้วน`;
  }

  enableRejectMode() {
    this.state = TaskState.Waiting_Upload_Receipt;
    this.title = 'รายละเอียดการยึดทรัพท์จำนอง ครั้งที่ 1';
    this.messageBanner = `กรุณาอัปโหลด “ใบเสร็จค่าใช้จ่ายบังคับคดีตั้งเรื่องยึดทรัพย์” และกดปุ่ม "เสร็จสิ้น" เพื่อดำเนินการต่อไป\nเหตุผลในการขอแก้ไข: ${
      this.receiptData?.reviseReason || '-'
    }`;
  }

  enableApproval() {
    const isOwner = this.sessionService.currentUser?.userId === this.taskService.taskOwner;
    this.state = TaskState.Waiting_Approval;
    this.title = 'ตรวจสอบใบเสร็จค่าใช้จ่ายบังคับคดีตั้งเรื่องยึดทรัพย์';
    this.statusName = 'รอตรวจสอบใบเสร็จค่าใช้จ่ายบังคับคดีตั้งเรื่องยึดทรัพย์';
    this.messageBanner = isOwner
      ? 'กรุณาตรวจสอบใบเสร็จค่าใช้จ่าย และกด “อนุมัติ” หรือ “ส่งกลับแก้ไข” เพื่อดำเนินการต่อ'
      : '';
    this.actionBar = {
      hasCancel: false,
      hasSave: false,
      hasReject: isOwner,
      hasPrimary: isOwner,
    };
  }

  onBack() {
    return this.routerService.back();
  }

  loadTable() {
    return lastValueFrom(this.seizureService.getSeizureLedsCollateralsLedsInfoBySeizureLedId(this.seizureLedId)).then(
      resp => this.loadExecutionTable([resp])
    );
  }

  async loadReceiptDetail() {
    const resp = await this.seizurePropertyService.getReceiptInfo(this.seizureLedId.toString());
    this.receiptData = resp;
  }

  loadExecutionTable(seizureLedsInfoList: SeizureLedsInfo[] = []) {
    this.legalExecutionSource.data = seizureLedsInfoList.map((row, index) => {
      return <ILegalExecution>{
        seizureId: coerceString(row.seizureId),
        seizureLedId: coerceString(row.id),
        orderNo: index + 1,
        SLAClasses:
          !!row.daysSpent && (!!row.daysSla || row.daysSla === 0) && row.daysSpent > row.daysSla ? 'fill-red' : '',
        SLA: `${row.daysSpent ? row.daysSpent || 0 : row.daysSla ? 0 : '-'}/${row.daysSla ? row.daysSla || 0 : '-'}`,
        legalExecutionName: row.ledName || '',
        legalDepartment: 'SEIZURE_OFFICE_TYPE.' + row.seizureLedType,
        seizureLedType: row.seizureLedType,
        totalAsset: coerceNumberProperty(row.collaterals?.length, 0),
        keepDate: row.ledRefNoDate,
        seizureDate: row.seizureTimestamp,
        collectionNumber: coerceString(row.ledRefNo),
        reportStatus: row.status,
        paymentMethod: coerceString(row.paymentMethod, 'UNKNOWN'),
        isFeePaid: row.isFeePaid,
        markIcon: this.markIcons.includes(coerceString(row.status, '')),
        action: {
          deletable: false,
          actionable: false,
          view: false,
        },
        documents: row.documents,
        collaterals: row.collaterals,
        createdTimestamp: row.createdTimestamp,
      };
    });
  }

  onApprove() {
    const taskId = coerceNumberProperty(this.taskService.taskDetail.id);
    const seizureLedId = coerceNumberProperty(this.seizureLedId);
    const litigationId = coerceString(this.caseDetail.litigationId, '0');
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
      .then(() => this.onBack());
  }

  onReject() {
    const taskId = coerceNumberProperty(this.taskService.taskDetail.id);
    const seizureLedId = coerceNumberProperty(this.seizureLedId);
    const litigationId = coerceString(this.caseDetail.litigationId, '0');
    const litigationCaseId = coerceNumberProperty(this.taskService.taskDetail.litigationCaseId);
    const customerId = coerceString(this.receiptData.makerId, 'ไม่ระบุ');
    const customerName = coerceString(this.receiptData.makerName, 'ไม่ระบุ');

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
          mode: 'SEIZURE',
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
      .then(() => this.onBack());
  }

  toast(msg: string, type: 'success' | 'error' = 'success') {
    return type == 'success' ? this.notification.openSnackbarSuccess(msg) : this.notification.openSnackbarError(msg);
  }

  onNavigateUploadReceipt(element: ILegalExecution) {
    return this.routerService.navigateTo('/main/task/seizure-property/upload-receipt-detail', {
      state: TaskState.Waiting_Upload_Receipt,
      seizureId: element.seizureId,
      seizureLedId: element.seizureLedId,
      litigationId: this.taskService.taskDetail.litigationId,
      cif: this.caseDetail.cifNo,
      taskId: this.taskService.taskDetail.id || 0,
    });
  }

  onNavigateApproval(element: ILegalExecution) {
    return this.routerService.navigateTo('/main/task/seizure-property/upload-receipt-detail', {
      state: TaskState.Waiting_Approval,
      seizureId: element.seizureId,
      seizureLedId: element.seizureLedId,
      litigationId: this.taskService.taskDetail.litigationId,
      cif: this.caseDetail.cifNo,
      taskId: this.taskService.taskDetail.id || 0,
    });
  }
}
