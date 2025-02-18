import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  AuctionControllerService,
  AuctionExpenseControllerService,
  AuctionExpenseInfo,
  AuctionExpenseNonEFilingInvoiceDto,
  AuctionExpenseNonEFilingReceiptRequest,
  AuctionExpenseReceiptRequest,
  AuctionExpenseRequest,
  AuctionExpenseResponse,
  AuctionInvoiceDto,
  AuctionReceiptDto,
  DocumentDto,
  FinancialControllerService,
} from '@lexs/lexs-client';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { AuctionService } from '../../auction.service';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class AuctionPaymentService {
  successMsg = 'Success message';
  invalidMsg = 'Invalid message';

  public formGroupUpdated = new BehaviorSubject<UntypedFormGroup | null>(null);

  private documentDtoSource = new BehaviorSubject<DocumentDto | null>(null);
  public currentDocumentDto = this.documentDtoSource.asObservable();

  public onTest: UntypedFormControl = new UntypedFormControl(null, Validators.required);

  public efilingError = {};

  constructor(
    private auctionControllerService: AuctionControllerService,
    private financialControllerService: FinancialControllerService,
    private formBuilder: UntypedFormBuilder,
    private auctionService: AuctionService,
    private auctionExpenseController: AuctionExpenseControllerService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  private _auctionInvoiceDto!: AuctionInvoiceDto;
  public get auctionInvoiceDto(): AuctionInvoiceDto {
    return this._auctionInvoiceDto;
  }

  public set auctionInvoiceDto(value: AuctionInvoiceDto) {
    this._auctionInvoiceDto = value;
  }

  private _auctionReceiptDto!: AuctionReceiptDto;
  public get auctionReceiptDto(): AuctionReceiptDto {
    return this._auctionReceiptDto;
  }

  public set auctionReceiptDto(value: AuctionReceiptDto) {
    this._auctionReceiptDto = value;
  }

  private _auctionExpenseNonEFilingInvoice!: AuctionExpenseNonEFilingInvoiceDto;
  public get auctionExpenseNonEFilingInvoice(): AuctionExpenseNonEFilingInvoiceDto {
    return this._auctionExpenseNonEFilingInvoice;
  }

  public set auctionExpenseNonEFilingInvoice(value: AuctionExpenseNonEFilingInvoiceDto) {
    this._auctionExpenseNonEFilingInvoice = value;
  }

  changeImageId(documentDto: DocumentDto | null): void {
    this.documentDtoSource.next(documentDto);
  }

  async submitAuctionExpense(request: AuctionExpenseRequest): Promise<AuctionExpenseResponse> {
    return await lastValueFrom(this.auctionControllerService.submitAuctionExpense(request));
  }

  async inquiryAuctionExpenseInfo(auctionExpenseId: number): Promise<AuctionExpenseInfo> {
    return await lastValueFrom(this.auctionControllerService.inquiryAuctionExpenseInfo(auctionExpenseId));
  }

  async payment(auctionExpenseId: number): Promise<any> {
    return await lastValueFrom(this.financialControllerService.payment(auctionExpenseId));
  }

  async uploadAuctionExpenseInvoice(auctionExpenseId: number, file: Blob): Promise<AuctionInvoiceDto> {
    return await lastValueFrom(this.financialControllerService.uploadAuctionExpenseInvoice(auctionExpenseId, file));
  }

  async uploadAuctionExpenseReceipt(auctionExpenseId: number, file: Blob): Promise<AuctionReceiptDto> {
    return await lastValueFrom(this.financialControllerService.uploadAuctionExpenseReceipt(auctionExpenseId, file));
  }

  async submitReceiptAuctionExpenseNonEFilling(
    auctionExpenseId: number,
    taskId: number,
    request: AuctionExpenseNonEFilingReceiptRequest
  ): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.auctionExpenseController.submitReceiptAuctionExpenseNonEFilling(auctionExpenseId, taskId, request)
      )
    );
  }

  async saveAuctionExpenseReceipt(
    auctionExpenseId: number,
    auctionExpenseReceiptRequest: AuctionExpenseReceiptRequest
  ): Promise<any> {
    return await lastValueFrom(
      this.financialControllerService.saveAuctionExpenseReceipt(auctionExpenseId, auctionExpenseReceiptRequest)
    );
  }

  isPaymentOrderFormTouched: boolean = false;

  public paymentOrderFormGroup!: UntypedFormGroup;
  getPaymentDetailFormGroup(auctionPaymentType: string | null, litigationId: string | number): UntypedFormGroup {
    return this.formBuilder.group({
      auctionExpenseDoc: this.formBuilder.group({
        uploadSessionId: [null, [Validators.required]],
      }),
      auctionExpenseId: [this.auctionService.auctionExpenseId],
      auctionExpenseType: [auctionPaymentType],
      citationCaseAssignedDate: [null],
      citationCaseCreatedDate: [null],
      citationCaseNo: [null],
      commandTimestamp: [null],
      ledId: [this.auctionService.ledId],
      litigationCaseId: [this.auctionService.litigationCaseId],
      paymentMethodId: [1], // * E-FILING NUMBER FOR SUBMIT (NON-EFILING USE 2)
      litigationId: [litigationId],
      reason: [null],
      status: [''],
      isFeePaid: [false],
    });
  }
  getPaymentDetailFormGroupWithApi(data?: AuctionExpenseInfo, litigationId?: string): UntypedFormGroup {
    return this.formBuilder.group({
      auctionExpenseDoc: this.formBuilder.group({
        uploadSessionId: [null],
      }),
      auctionExpenseId: [data?.id],
      auctionExpenseType: [data?.auctionExpenseType],
      citationCaseAssignedDate: [data?.citationCaseAssignedTimestamp],
      citationCaseCreatedDate: [data?.citationCaseCreatedTimestamp],
      citationCaseNo: [data?.citationCaseNo],
      commandTimestamp: [data?.commandTimestamp],
      ledId: [data?.ledId],
      litigationCaseId: [data?.litigationCaseId],
      litigationId: [litigationId],
      reason: [data?.reason || ''],
      status: [data?.status],
      paymentMethodId: [data?.paymentMethodId],
      isFeePaid: [data?.isFeePaid],
    });
  }

  getPaymentDetailNonEFilingFormGroupWithApi(data?: AuctionExpenseInfo, litigationId?: string): UntypedFormGroup {
    return this.formBuilder.group({
      auctionExpenseDoc: this.formBuilder.group({
        uploadSessionId: [null],
      }),
      // headerFlag: [data?.headerFlag],
      auctionExpenseId: [data?.id],
      auctionExpenseType: [data?.auctionExpenseType],
      citationCaseAssignedDate: [data?.citationCaseAssignedTimestamp],
      citationCaseCreatedDate: [data?.citationCaseCreatedTimestamp],
      citationCaseNo: [data?.citationCaseNo],
      commandTimestamp: [data?.commandTimestamp],
      ledId: [data?.ledId],
      litigationCaseId: [data?.litigationCaseId],
      litigationId: [litigationId],
      paymentMethodId: [2],
      reason: [data?.reason],
      totalAmountPaid: [data?.totalAmountPaid], // จำนวนเงินสั่งจ่าย
      ledName: [data?.ledName], //สั่งจ่าย
      // lawyerName: [null],
      // assignedLawyerId: [data?.assignedLawyerId], // ทนายความผู้รับผิดชอบ
      assignedLawyerMobileNo: [data?.assignedLawyerMobileNo], // เบอร์โทรศัพท์ ทนายความผู้รับผิดชอบ
      receivedByLawyerId: [data?.receivedByLawyerId], // ทนายความไปรับ แคชเชียร์เช็ค
      receivedByLawyerMobileNo: [data?.receivedByLawyerMobileNo], // เบอร์โทรศัพท์ ทนายความไปรับ แคชเชียร์เช็ค
      branchCode: [data?.branchCode], // รายการแคชเชียร์เช็ค
      receiveCashierDate: [data?.receiveCashierDate], // วันที่ไปรับแคชเชียร์เช็ค
      status: [data?.status],
    });
  }

  public paymentNonEFilingFormGroup!: UntypedFormGroup;
  getPaymentDetailNonEFilingFormGroup(
    auctionPaymentType: string | null,
    litigationId: string | number
  ): UntypedFormGroup {
    return this.formBuilder.group({
      auctionExpenseDoc: this.formBuilder.group({
        uploadSessionId: [null],
      }),
      headerFlag: [null],
      auctionExpenseId: [this.auctionService.auctionExpenseId],
      auctionExpenseType: [auctionPaymentType],
      citationCaseAssignedDate: [null, [Validators.required]],
      citationCaseCreatedDate: [null, [Validators.required]],
      citationCaseNo: [null, [Validators.required]],
      commandTimestamp: [null, [Validators.required]],
      ledId: [this.auctionService.ledId],
      litigationCaseId: [this.auctionService.litigationCaseId],
      litigationId: [litigationId],
      paymentMethodId: [2],
      reason: [null],
      totalAmountPaid: [null, [Validators.required]], // จำนวนเงินสั่งจ่าย
      ledName: [null], //สั่งจ่าย
      // assignedLawyerId: [null], // ทนายความผู้รับผิดชอบ
      assignedLawyerMobileNo: [null, [Validators.required]], // เบอร์โทรศัพท์ ทนายความผู้รับผิดชอบ
      receivedByLawyerId: [null, [Validators.required]], // ทนายความไปรับ แคชเชียร์เช็ค
      receivedByLawyerMobileNo: [null, [Validators.required]], // เบอร์โทรศัพท์ ทนายความไปรับ แคชเชียร์เช็ค
      branchCode: [null, [Validators.required]], // รายการแคชเชียร์เช็ค
      receiveCashierDate: [null, [Validators.required]], // วันที่ไปรับแคชเชียร์เช็ค
      status: [''],
      payeeName: [null],
    });
  }

  async getInvoice(auctionExpenseId: number) {
    return await lastValueFrom(this.financialControllerService.getInvoice(auctionExpenseId));
  }

  retrieveEFilingError() {
    const efilingCode: { [e: string]: any } = { ...this.efilingError };
    this.efilingError = {};
    return efilingCode;
  }

  async getUploadReceiptAuctionExpenseNonEFilling(
    auctionExpenseId: number
  ): Promise<AuctionExpenseNonEFilingInvoiceDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionExpenseController.getUploadReceiptAuctionExpenseNonEFilling(auctionExpenseId))
    );
  }
}
