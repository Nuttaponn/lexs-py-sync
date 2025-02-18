import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FINANCE_RECEIPT_ROUTES } from '@app/shared/constant/routes.constant';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { MeLexsUserDto, Pageable, ReceiveKcorpPaymentDetail, ReceiveKcorpPaymentInfoResponse } from '@lexs/lexs-client';
import { PaginatorActionConfig, PaginatorResultConfig } from '@spig/core';
import { ReceiptService } from '../../services/receipt.service';

interface IReceiveKcorpPaymentDetail extends ReceiveKcorpPaymentDetail {
  branches?: { branchCode: string; branchName: string }[];
}

@Component({
  selector: 'app-reference-no-detail',
  templateUrl: './reference-no-detail.component.html',
  styleUrls: ['./reference-no-detail.component.scss'],
})
export class ReferenceNoDetailComponent implements OnInit {
  // table and pagination
  bookings: IReceiveKcorpPaymentDetail[] = [];
  tableColumns: string[] = [
    'no',
    'receiveNo',
    'createDate',
    'payer',
    'branch',
    'paidType',
    'paidAmount',
    'refundAmount',
    'daysSla',
    'user',
    'receiveStatus',
    'action',
    'auditLog',
  ];
  public pageResultConfig!: PaginatorResultConfig;
  public pageActionConfig!: PaginatorActionConfig;

  public data: any | undefined;
  public refInfo: ReceiveKcorpPaymentInfoResponse | undefined;
  public washAccountNo: string | undefined;
  public branchExpanded: Array<boolean> = [];

  public currentUser!: MeLexsUserDto;

  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,
    private receiptService: ReceiptService,
    private notificationService: NotificationService,
    private sessionService: SessionService
  ) {}

  async ngOnInit() {
    this.currentUser = this.sessionService.currentUser || {};
    this.data = this.receiptService.referenceNoDetail || {};
    this.setUpPagination(this.data.pageable, this.data.numberOfElements, this.data.totalPages, this.data.totalElements);

    this.refInfo = this.data?.content?.[0];
    this.bookings = this.setUpBranches(this.refInfo?.receiveDetails || []);
    this.washAccountNo = this.route.snapshot.queryParams['washAccountNo'];
    this.branchExpanded.fill(false, 0, this.bookings.length);

    this.receiptService.receiptLandingTab.next(2);
  }

  setUpBranches(bookings: any[]) {
    return bookings.map(booking => {
      const branchCodes = Object.keys(booking?.branch || {});
      let branches: { branchCode: string; branchName: string }[] = [];
      branchCodes.forEach(bc => {
        branches.push({
          branchCode: bc,
          branchName: booking?.branch?.[bc] || '',
        });
      });
      return {
        ...booking,
        branches,
      };
    });
  }

  setUpPagination(
    _pageable?: Pageable,
    _numberOfElements: number = 1,
    _totalPages: number = 1,
    _totalElements: number = 0
  ) {
    let _pageNumberOffer = 0;
    if (_pageable && _pageable.pageSize && _pageable.pageNumber) {
      _pageNumberOffer = _pageable.pageSize * _pageable.pageNumber;
    }
    this.pageResultConfig = {
      fromIndex: _pageNumberOffer + 1,
      toIndex: _pageNumberOffer + _numberOfElements,
      totalElements: _totalElements,
    };
    this.pageActionConfig = {
      totalPages: _totalPages,
      currentPage: (_pageable?.pageNumber || 0) + 1,
      fromPage: 1,
      toPage: _totalPages,
    };
  }

  async pageEvent(pageNumber: number) {
    const _receiveNo = this.route.snapshot.queryParams['receiveNo'];
    this.data = await this.receiptService.getRefundInfoDetails(_receiveNo, this.refInfo?.referenceNo || '', pageNumber);
    this.refInfo = this.data?.content?.[0];
    this.bookings = this.setUpBranches(this.refInfo?.receiveDetails || []);
  }

  onNewTask() {
    if (this.refInfo?.payAmount === this.refInfo?.paidAmount || !this.refInfo?.referenceNo) {
      let msg = `เนื่องจาก จำนวนเงินตามรายการโอน เท่ากับ จำนวนเงินที่ชำระแล้ว (รวมฉบับร่าง)`;
      this.notificationService.alertDialog('ไม่สามารถสร้างหนังสือรับเงินได้', msg);
    } else {
      this.routerService.navigateTo(FINANCE_RECEIPT_ROUTES.DETAIL, {
        kcorpView: 'REFUND_ADD',
        type: 'KCORP',
      });
    }
  }

  onStartTask(element: IReceiveKcorpPaymentDetail) {
    this.routerService.navigateTo(FINANCE_RECEIPT_ROUTES.DETAIL, {
      kcorpView: 'REFUND_INFO',
      type: 'KCORP',
      taskId: element.taskId,
      receiveNo: element.receiveNo,
      currentAssigneeId: element.updatedBy,
      receiptStatus: element.receiveStatus,
      payer: element.payer,
      receiveSource: element.receiveSource,
    });
  }

  onBranchExpand(index: number) {
    this.branchExpanded[index] = !this.branchExpanded[index];
  }

  goToAuditLog(element: any) {
    this.routerService.navigateTo('/main/finance/receipt/audit-log', {
      financeMode: 'RECEIPT_KCORP',
      financeId: element.receiveNo,
      statusName: element.receiveStatusDesc,
    });
  }

  onBack() {
    this.routerService.back();
  }
}
