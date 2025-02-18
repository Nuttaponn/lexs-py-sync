import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TaskService } from '@app/modules/task/services/task.service';
import { DEFAULT_DROPDOWN_CONFIG, DOC_TEMPLATE } from '@app/shared/constant';
import { IUploadMultiFile, IUploadMultiInfo } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import moment from 'moment';
import { AuctionResultSubmitStatus, SubmitAuctionResultAction } from '../auction.const';
import { AuctionService } from '../auction.service';

@Component({
  selector: 'app-auction-result',
  templateUrl: './auction-result.component.html',
  styleUrls: ['./auction-result.component.scss'],
})
export class AuctionResultComponent implements OnInit {
  @Input() defaultExpand = true;
  @Input() defaultExpandReturnDocument = false;
  @Input() formGroup!: UntypedFormGroup;
  @Input() isView: boolean = false;
  public isOpened = true;
  public isReturnDocumentOpened = true;

  public resultOptions: SimpleSelectOption[] = [
    { text: 'ขายทอดตลาดได้', value: AuctionResultSubmitStatus.SOLD },
    { text: 'ขายทอดตลาดทรัพย์ไม่ได้', value: AuctionResultSubmitStatus.UNSOLD },
    { text: 'งดการขาย', value: AuctionResultSubmitStatus.CANCEL },
  ];
  public resultConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    labelPlaceHolder: 'ผลการขายทอดตลาด',
  };

  public documentUpload: IUploadMultiFile[] = [];
  public returnDocumentUpload: IUploadMultiFile[] = [];
  public isUploadReadOnly: boolean = false;
  public uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  public formUploadControl: UntypedFormControl = new UntypedFormControl(false, Validators.requiredTrue);

  public onDownLoadForm = new EventEmitter();
  public onUploadFileEvent = new EventEmitter<any>();

  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public RESULT_SUBMIT_STATUS = AuctionResultSubmitStatus;
  public itemActionCode: SubmitAuctionResultAction = '' as SubmitAuctionResultAction;

  get canEditResturnDocument() {
    return ['UPLOAD', 'REUPLOAD'].includes(this.itemActionCode);
  }

  get isViewMode() {
    return this.isView || this.auctionService.submitResultStatus;
  }

  constructor(
    private logger: LoggerService,
    private auctionService: AuctionService,
    private taskService: TaskService,
    private litigationCaseService: LitigationCaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.logger.info('[AuctionResultComponent][ngOnInit]', this.formGroup.getRawValue());
    this.isOpened = this.defaultExpand;
    this.isReturnDocumentOpened = true;
    this.itemActionCode = this.auctionService.itemActionCode;
    this.uploadMultiInfo = {
      cif: this.taskService.taskDetail?.customerId
        ? this.taskService.taskDetail.customerId
        : this.litigationCaseService.litigationCaseShortDetail?.cifNo || '',
      litigationId: this.taskService.taskDetail.litigationId,
      auctionBiddingId: this.taskService.taskDetail.objectId,
      aucBiddingDeedGroupId: this.auctionService.auctionBidingInfoCollateralSelected?.aucBiddingDeedGroupId,
    };
    this.initDocumentData();
    this.initDynamicFormValidator();
    if (!this.isView) {
      this.dynamicFormValidator(this.formGroup?.get('aucResult')?.value);
    }
    if (this.formGroup?.get('aucResult')?.value) {
      this.auctionService.submitResultStatus = true;
    } else {
      this.auctionService.submitResultStatus = false;
    }
  }

  private initDocumentData() {
    const aucBiddingDeedGroupDocuments: any[] = this.formGroup?.get('aucBiddingDeedGroupDocuments')?.value;
    const requireReturnDocument: any[] = this.formGroup.get('requireReturnDocument')?.value;
    if (aucBiddingDeedGroupDocuments?.length > 0) {
      const contract: any[] = aucBiddingDeedGroupDocuments.filter(
        it => it.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF139
      );
      this.documentUpload = contract.map((it: any) => {
        return {
          documentTemplate: it?.documentTemplate,
          documentTemplateId: it?.documentTemplate?.documentTemplateId,
          imageId: it.imageId,
          removeDocument: true,
          uploadRequired: true,
          uploadDate: it.uploadTimestamp,
        } as IUploadMultiFile;
      });
      this.auctionService.auctionSubmitResultPerCollateralFiles =
        this.auctionService.getAuctionSubmitResultPerCollateralFiles(this.documentUpload);

      if (requireReturnDocument) {
        const returnDocs: any[] = aucBiddingDeedGroupDocuments.filter(
          it => it.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF140
        );
        this.returnDocumentUpload = returnDocs.map((it: any) => {
          return {
            documentTemplate: it?.documentTemplate,
            documentTemplateId: it?.documentTemplate?.documentTemplateId,
            imageId: it.imageId,
            removeDocument: true,
            uploadRequired: true,
            uploadDate: it.uploadTimestamp,
          } as IUploadMultiFile;
        });
      }
    }
  }

  private initDynamicFormValidator() {
    if (this.formGroup?.get('aucResult')?.value && this.formGroup.get('requireReturnDocument')?.value) {
      this.getControl('returnDocumentNo')?.setValidators([Validators.required]);
      this.getControl('returnDocumentNo')?.updateValueAndValidity();
    }
    this.formGroup?.get('aucResult')?.valueChanges.subscribe(it => {
      this.dynamicFormValidator(it);
    });
    this.formGroup?.get('buyerType')?.valueChanges.subscribe(it => {
      this.logger.info('[AuctionResultComponent][ngOnInit][buyerType]', it);
      if (it === 'KTB') {
        this.getControl('buyerName')?.clearValidators();
      } else {
        this.getControl('buyerName')?.setValidators([Validators.required]);
      }
      this.updateSoldPriceCondition(this.formGroup?.get('soldPrice')?.value);
      this.getControl('buyerName')?.updateValueAndValidity();
    });

    this.formGroup?.get('unsoldReasonType')?.valueChanges.subscribe(it => {
      this.logger.info('[AuctionResultComponent][ngOnInit][unsoldReasonType]', it);
      if (it === 'OBJECTION') {
        this.getControl('unsoldObjectBuyer')?.setValidators([Validators.required]);
        this.getControl('unsoldObjectHighestBidder')?.setValidators([Validators.required]);
        this.getControl('unsoldObjectDissident')?.setValidators([Validators.required]);
        this.getControl('unsoldObjectPrice')?.setValidators([Validators.required]);
        this.getControl('buyerName')?.clearValidators();
        this.getControl('unsoldObjectBuyer')?.updateValueAndValidity();
        this.getControl('unsoldObjectHighestBidder')?.updateValueAndValidity();
        this.getControl('unsoldObjectDissident')?.updateValueAndValidity();
        this.getControl('unsoldObjectPrice')?.updateValueAndValidity();
        this.getControl('buyerName')?.updateValueAndValidity();
      } else {
        this.getControl('buyerName')?.clearValidators();
        this.getControl('unsoldObjectBuyer')?.clearValidators();
        this.getControl('unsoldObjectHighestBidder')?.clearValidators();
        this.getControl('unsoldObjectDissident')?.clearValidators();
        this.getControl('unsoldObjectPrice')?.clearValidators();
        this.getControl('unsoldObjectBuyer')?.updateValueAndValidity();
        this.getControl('unsoldObjectHighestBidder')?.updateValueAndValidity();
        this.getControl('unsoldObjectDissident')?.updateValueAndValidity();
        this.getControl('unsoldObjectPrice')?.updateValueAndValidity();
        this.getControl('buyerName')?.updateValueAndValidity();
      }
      this.formGroup.updateValueAndValidity();
    });

    this.formGroup?.get('soldPrice')?.valueChanges.subscribe(it => {
      this.logger.info('[soldPrice]', it);
      this.logger.info('[soldPrice]', this.auctionService.auctionResultCollateral?.maxPrice);
      this.updateSoldPriceCondition(it);
    });
  }

  private updateSoldPriceCondition(price: number) {
    const maxPrice = this.auctionService.auctionResultCollateral?.maxPrice || 0;
    if (!price || price === 0) {
      this.getControl('remark')?.clearValidators();
      this.getControl('remark')?.updateValueAndValidity();
      return;
    }
    if (this.formGroup?.get('buyerType')?.value === 'KTB') {
      if (price > maxPrice) {
        this.getControl('remark')?.setValidators([Validators.required]);
        this.getControl('remark')?.updateValueAndValidity();
      } else {
        this.getControl('remark')?.clearValidators();
        this.getControl('remark')?.updateValueAndValidity();
      }
    } else {
      if (price < maxPrice) {
        this.getControl('remark')?.setValidators([Validators.required]);
        this.getControl('remark')?.updateValueAndValidity();
      } else {
        this.getControl('remark')?.clearValidators();
        this.getControl('remark')?.updateValueAndValidity();
      }
    }
  }

  private dynamicFormValidator(it: any) {
    this.logger.info('[AuctionResultComponent][ngOnInit][aucResult]', it);
    switch (it) {
      case AuctionResultSubmitStatus.SOLD:
        this.logger.info('[AuctionResultComponent][ngOnInit][aucResult]', 1);
        this.getControl('buyerType')?.setValidators([Validators.required]);
        this.getControl('buyerName')?.setValidators([Validators.required]);
        this.getControl('soldPrice')?.setValidators([Validators.required]);
        //remove validaget
        this.getControl('remark')?.clearValidators();
        this.getControl('unsoldReasonType')?.clearValidators();
        this.getControl('unsoldObjectHighestBidder')?.clearValidators();
        this.getControl('unsoldObjectDissident')?.clearValidators();
        this.getControl('cancelReasonType')?.clearValidators();
        this.getControl('unsoldObjectPrice')?.clearValidators();
        this.getControl('buyDate')?.clearValidators();
        this.updateControllValidity();
        this.formGroup?.get('buyerType')?.setValue('EXTERNAL');
        if (this.allowCancelOnly()) {
          this.formGroup?.get('aucResult')?.setErrors({ auction_cannot_only_cancel: true });
        }
        if (!this.canSelectSoldStatus()) {
          setTimeout(() => {
            this.formGroup?.get('aucResult')?.setErrors({ auction_cannot_sold: true });
          });
        }
        break;
      case AuctionResultSubmitStatus.UNSOLD:
        this.logger.info('[AuctionResultComponent][ngOnInit][aucResult]', 2);
        this.getControl('unsoldObjectBuyer')?.setValidators([Validators.required]);
        this.getControl('unsoldReasonType')?.setValidators([Validators.required]);
        this.getControl('unsoldObjectHighestBidder')?.setValidators([Validators.required]);
        this.getControl('unsoldObjectDissident')?.setValidators([Validators.required]);
        this.getControl('unsoldObjectPrice')?.setValidators([Validators.required]);
        //remove validaget
        this.getControl('buyerType')?.clearValidators();
        this.getControl('soldPrice')?.clearValidators();
        this.getControl('remark')?.clearValidators();
        this.getControl('cancelReasonType')?.clearValidators();
        this.getControl('buyDate')?.clearValidators();
        this.getControl('buyerName')?.clearValidators();
        this.updateControllValidity();
        if (this.allowCancelOnly()) {
          this.formGroup?.get('aucResult')?.setErrors({ auction_cannot_only_cancel: true });
        }
        if (!this.canSelectSoldStatus()) {
          this.formGroup?.get('aucResult')?.setErrors({ auction_cannot_unsold: true });
        }
        break;
      case AuctionResultSubmitStatus.CANCEL:
        this.logger.info('[AuctionResultComponent][ngOnInit][aucResult]', 3);
        this.getControl('cancelReasonType')?.setValidators([Validators.required]);
        //remove validaget
        this.getControl('unsoldReasonType')?.clearValidators();
        this.getControl('remark')?.clearValidators();
        this.getControl('buyerType')?.clearValidators();
        this.getControl('unsoldObjectBuyer')?.clearValidators();
        this.getControl('buyerName')?.clearValidators();
        this.getControl('soldPrice')?.clearValidators();
        this.getControl('unsoldObjectHighestBidder')?.clearValidators();
        this.getControl('unsoldObjectDissident')?.clearValidators();
        this.getControl('unsoldObjectPrice')?.clearValidators();
        this.getControl('buyDate')?.clearValidators();
        this.updateControllValidity();
        break;
      default:
        break;
    }
  }

  private updateControllValidity() {
    this.getControl('buyerType')?.updateValueAndValidity();
    this.getControl('buyerName')?.updateValueAndValidity();
    this.getControl('soldPrice')?.updateValueAndValidity();
    this.getControl('remark')?.updateValueAndValidity();
    this.getControl('unsoldReasonType')?.updateValueAndValidity();
    this.getControl('unsoldObjectHighestBidder')?.updateValueAndValidity();
    this.getControl('unsoldObjectDissident')?.updateValueAndValidity();
    this.getControl('cancelReasonType')?.updateValueAndValidity();
    this.getControl('unsoldObjectPrice')?.updateValueAndValidity();
    this.getControl('buyDate')?.updateValueAndValidity();
    this.getControl('unsoldObjectBuyer')?.updateValueAndValidity();

    this.getControl('buyerType')?.reset();
    this.getControl('buyerName')?.reset();
    this.getControl('soldPrice')?.reset();
    this.getControl('remark')?.reset();
    this.getControl('unsoldReasonType')?.reset();
    this.getControl('unsoldObjectHighestBidder')?.reset();
    this.getControl('unsoldObjectDissident')?.reset();
    this.getControl('cancelReasonType')?.reset();
    this.getControl('unsoldObjectPrice')?.reset();
    this.getControl('buyDate')?.reset();
    this.getControl('unsoldObjectBuyer')?.reset();
  }

  async uploadFileEvent($event: IUploadMultiFile[] | null) {
    this.logger.info('AuctionProcessingDocumentComponent -> uploadFileEvent');
    const aucBiddingDeedGroupDocuments: any[] = this.formGroup?.get('aucBiddingDeedGroupDocuments')?.value;
    const originalFile: any = aucBiddingDeedGroupDocuments.find(
      it => it.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF139
    );
    const newFile = $event?.find(it => it.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF139);
    if (originalFile?.imageId && !newFile?.imageId) {
      const auctionBiddingId = this.taskService.taskDetail.objectId || '';
      const aucBiddingDeedGroupId = this.auctionService.auctionBiddingDeedGroupResponse?.aucBiddingDeedGroupId || 0;

      await this.auctionService.postDeleteBiddingsDeedGroupsDocumentsUpload(
        aucBiddingDeedGroupId,
        auctionBiddingId,
        newFile?.documentTemplate?.documentGroup || '',
        newFile?.documentTemplate?.documentTemplateId || ''
      );
    }
    this.documentUpload = $event || [];
    this.auctionService.auctionSubmitResultPerCollateralFiles =
      this.auctionService.getAuctionSubmitResultPerCollateralFiles($event || []);
    this.cdr.detectChanges();
    if ((!originalFile?.imageId && newFile?.imageId) || originalFile?.imageId !== newFile?.imageId) {
      const aucBiddingId = this.taskService.taskDetail?.objectId || '';
      const latestResult = await this.auctionService.getAuctionBidingInfo(aucBiddingId);
      this.auctionService.auctionBidingInfoResponse = latestResult || {};
    }
  }

  async uploadReturnFileEvent($event: IUploadMultiFile[] | null) {
    this.logger.info('AuctionProcessingDocumentComponent -> uploadFileEvent');
    const aucBiddingDeedGroupDocuments: any[] = this.formGroup?.get('aucBiddingDeedGroupDocuments')?.value;
    const originalFile: any = aucBiddingDeedGroupDocuments.find(
      it => it.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF140
    );
    const newFile = $event?.find(it => it.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF140);
    if (originalFile?.imageId && !newFile?.imageId) {
      const auctionBiddingId = this.taskService.taskDetail.objectId || '';
      const aucBiddingDeedGroupId = this.auctionService.auctionBiddingDeedGroupResponse?.deedGroupId || 0;
      await this.auctionService.postDeleteBiddingsDeedGroupsDocumentsUpload(
        aucBiddingDeedGroupId,
        auctionBiddingId,
        newFile?.documentTemplate?.documentGroup || '',
        newFile?.documentTemplate?.documentTemplateId || ''
      );
    }
    this.returnDocumentUpload = $event || [];
    this.auctionService.auctionSubmitResultPerCollateralReturnFiles =
      this.auctionService.getAuctionSubmitResultPerCollateralReturnFiles($event || []);
    this.cdr.detectChanges();
  }

  getControl(controlName: string): AbstractControl | null {
    return this.formGroup.get(controlName);
  }

  canSelectSoldStatus() {
    const bidDate = moment(this.formGroup.get('bidDate')?.value);
    const currentDate = moment();
    const result = bidDate.isSameOrBefore(currentDate);
    return result;
  }

  allowCancelOnly() {
    return ['ADJUST'].includes(
      this.auctionService.auctionBidingInfoCollateralSelected?.npaResolutionSummary?.resolution || ''
    );
  }

  getResultText(value: string) {
    const matchedResult = this.resultOptions.find(it => it.value === value);
    return matchedResult?.text || '';
  }
}
