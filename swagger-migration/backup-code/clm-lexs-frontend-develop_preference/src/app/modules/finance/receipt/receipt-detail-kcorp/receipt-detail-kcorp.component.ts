import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FINANCE_RECEIPT_ROUTES } from '@app/shared/constant/routes.constant';
import { RouterService } from '@app/shared/services/router.service';
import {
  PageOfReceiveKcorpInquiryInfoResponse,
  Pageable,
  ReceiveKcorpInquiryDetail,
  ReceiveKcorpInquiryInfoResponse,
} from '@lexs/lexs-client';
import { PaginatorActionConfig, PaginatorResultConfig } from '@spig/core';
import { ReceiptService } from '../../services/receipt.service';
@Component({
  selector: 'app-receipt-detail-kcorp',
  templateUrl: './receipt-detail-kcorp.component.html',
  styleUrls: ['./receipt-detail-kcorp.component.scss'],
})
export class ReceiptDetailKcorpComponent implements OnInit {
  // table and pagination
  refs: ReceiveKcorpInquiryDetail[] = [];
  tableColumns: string[] = [
    'no',
    'referenceNo',
    'suspenseAccountDate',
    'courtName',
    'transferAmount',
    'paidAmount',
    'ref',
    'assignId',
    'receiveStatus',
  ];
  public pageResultConfig!: PaginatorResultConfig;
  public pageActionConfig!: PaginatorActionConfig;

  public data: PageOfReceiveKcorpInquiryInfoResponse | undefined;
  public refundInfo: ReceiveKcorpInquiryInfoResponse | undefined;

  constructor(
    private routerService: RouterService,
    private receiptService: ReceiptService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.data = this.receiptService.receiveDetailKcorp || {};
    this.setUpPagination(
      this.data?.pageable,
      this.data?.numberOfElements,
      this.data?.totalPages,
      this.data?.totalElements
    );
    this.refundInfo = this.data?.content?.[0];
    this.refs = this.refundInfo?.paidDetails || [];

    this.receiptService.receiptLandingTab.next(2);
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
    const _createdDate = this.route.snapshot.queryParams['createdDate'];
    this.data = await this.receiptService.getRefundInfo(_createdDate, this.refundInfo?.washAccountNo || '', pageNumber);
    this.refundInfo = this.data?.content?.[0];
    this.refs = this.refundInfo?.paidDetails || [];
  }

  goToRefNo(element: ReceiveKcorpInquiryDetail) {
    this.routerService.navigateTo(FINANCE_RECEIPT_ROUTES.REFERENCE_NO, {
      kcorpView: 'REFERENCE_NO_DETAIL',
      referenceNo: element.referenceNo,
      receiveNo: element.receiveNo,
    });
  }

  onBack() {
    this.routerService.back();
  }
}
