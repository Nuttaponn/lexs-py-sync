import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { TaskService } from '@app/modules/task/services/task.service';
import { taskCode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import {
  AccountDocumentFollowUpTaskApprovalRequest,
  AuctionCashierApprovalRequest,
  AuctionCashierExpenseApprovalRequest,
  AuctionCashierTransferOwnershipApprovalRequest,
  PostApprovalRequest,
} from '@lexs/lexs-client';
import { AuctionService } from '../auction.service';
import { AuctionLedCardService } from '@app/shared/components/common-tabs/auction-led-card/auction-led-card.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reject-auction-cashier-cheque-dialog',
  templateUrl: './reject-auction-cashier-cheque-dialog.component.html',
  styleUrls: ['./reject-auction-cashier-cheque-dialog.component.scss'],
})
export class RejectAuctionCashierChequeDialogComponent {
  lawyer: string = '';
  maker: string = '';
  isShowLawyer: boolean = true;
  auctionCollateralId: number = 0;
  auctionExpenseId: number = 0;
  nonEFilingAuctionExpenseId: number = 0;
  maxlength: number = 500;
  public reason: UntypedFormControl = new UntypedFormControl('', [
    Validators.required,
    Validators.maxLength(this.maxlength),
  ]);
  taskCode!: taskCode;
  isSuccess = false;
  constructor(
    private notificationService: NotificationService,
    private taskService: TaskService,
    private auctionService: AuctionService,
    private auctionLedCardService: AuctionLedCardService,
    private translate: TranslateService
  ) {}

  dataContext(data: any) {
    this.isSuccess = false;
    this.lawyer = data.lawyer;
    this.auctionCollateralId = data.auctionCollateralId;
    this.taskCode = this.taskService.taskDetail?.taskCode as taskCode;
    this.maker = data.maker;
    this.isShowLawyer = !this.maker;
    this.auctionExpenseId = data.auctionExpenseId;
  }

  public async onClose() {
    if (this.reason.valid) {
      switch (this.taskCode) {
        case taskCode.R2E09_06_7C:
          const payload: AuctionCashierApprovalRequest = {
            headerFlag: 'REJECT',
            rejectReason: this.reason.value,
            taskId: this.taskService.taskDetail.id,
          };
          await this.auctionService.postAuctionCashierChequeApproval(this.auctionCollateralId, payload);
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('AUCTION_DETAIL.CASHIER_CHEQUE_COLLATERAL.SEND_BACK_EDITED_SUCCESSFULLY')
          );
          this.isSuccess = true;
          break;
        case taskCode.R2E09_06_12C:
          const dutyStampPayload: AuctionCashierApprovalRequest = {
            headerFlag: 'REJECT',
            rejectReason: this.reason.value,
            taskId: this.taskService.taskDetail.id,
          };
          await this.auctionService.postAuctionCashierChequeStampDutyApproval(
            this.auctionCollateralId,
            dutyStampPayload
          );
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('AUCTION_DETAIL.CASHIER_CHEQUE_STAMP_DUTY.SEND_BACK_EDITED_SUCCESSFULLY')
          );
          this.isSuccess = true;
          break;
        case taskCode.R2E09_09_03_14_1:
          const accountDocFollowUpId =
            this.auctionCollateralId; /* "auctionCollateralId" = "accountDocFollowUpId" in this taskCode's context. */
          const accountDocumentFollowUpTaskApprovalRequest: AccountDocumentFollowUpTaskApprovalRequest = {
            action: AccountDocumentFollowUpTaskApprovalRequest.ActionEnum.Return,
            reason: this.reason.value,
          };
          await this.auctionLedCardService.approveAccountDocumentFollowUpTask(
            accountDocFollowUpId,
            this.taskService.taskDetail.id || -1,
            accountDocumentFollowUpTaskApprovalRequest
          );

          this.notificationService.openSnackbarSuccess('ส่งกลับแก้ไข ผลติดตามและตรวจรับรองบัญชีรับจ่ายแล้ว');
          this.isSuccess = true;
          break;
        case taskCode.R2E09_06_03:
          try {
            await this.auctionService.auctionCashierChequeAdditionalApproval(this.auctionCollateralId, {
              headerFlag: 'REJECT',
              rejectReason: this.reason.value,
              taskId: this.taskService.taskDetail.id,
            });
            this.notificationService.openSnackbarSuccess('ส่งกลับแก้ไข แคชเชียร์เช็ควางเงินเพิ่มแล้ว');
            this.isSuccess = true;
          } catch (e) {}
          break;
        case taskCode.R2E09_10_02:
          try {
            await this.auctionService.approvalAuctionDebtSettlementAccount({
              auctionDebtSettlementAccountId: this.auctionService.debtForm.get('auctionDebtSettlementAccountId')?.value,
              action: 'RETURN',
              reason: this.reason.value,
            });
            this.notificationService.openSnackbarSuccess('ส่งกลับแก้ไข รายการตัดบัญชีแล้ว');
            this.isSuccess = true;
          } catch (e) {}
          break;
        case taskCode.R2E09_06_04_6:
          let lastestOrder = this.auctionService.transferOwershipList?.length - 1;
          const transfer = this.auctionService.transferOwershipList[lastestOrder];
          const req: AuctionCashierTransferOwnershipApprovalRequest = {
            headerFlag: 'REJECT',
            id: Number(this.taskService.taskDetail.objectId),
            rejectReason: this.reason.value,
            taskId: this.taskService.taskDetail.id,
          };
          await this.auctionService.auctionCashierChequeTransferOwnershipApproval(req);
          this.notificationService.openSnackbarSuccess(
            `ส่งกลับแก้ไข แคชเชียร์เช็คโอนกรรมสิทธิ์ชุด ทรัพย์ที่ ${transfer?.fsubbidnum || ''} แล้ว`
          );
          this.isSuccess = true;
          break;
        case taskCode.R2E09_14_3C:
          const request: AuctionCashierExpenseApprovalRequest = {
            headerFlag: 'REJECT',
            rejectReason: this.reason.value,
            taskId: this.taskService.taskDetail.id,
          };
          await this.auctionService.auctionCashierChequeExpenseApproval(this.auctionExpenseId, request);
          this.notificationService.openSnackbarSuccess('ส่งกลับแก้ไข แคชเชียร์เช็คค่าใช้จ่ายเพิ่มเติม แล้ว');
          this.isSuccess = true;
          break;
        case taskCode.R2E35_02_E09_02_7B:
          const uploadNonEFilingRequest: PostApprovalRequest = {
            action: 'RETURN',
            reason: this.reason.value,
          };
          await this.auctionService.approveReceiptAuctionExpenseNonEFilling(
            this.auctionExpenseId,
            this.taskService.taskDetail.id || 0,
            uploadNonEFilingRequest
          );
          this.notificationService.openSnackbarSuccess('ส่งกลับแก้ไข ใบเสร็จค่าใช้จ่ายเพิ่มเติมแล้ว');
          this.isSuccess = true;
          break;
      }
      return true;
    }
    this.reason.markAllAsTouched();
    return false;
  }

  get returnData() {
    return {
      isSuccess: this.isSuccess,
    };
  }
}
