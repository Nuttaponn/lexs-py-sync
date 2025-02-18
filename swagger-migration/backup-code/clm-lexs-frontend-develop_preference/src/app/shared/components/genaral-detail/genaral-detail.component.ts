import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuctionService } from '@app/modules/auction/auction.service';
import { AuctionStatus, MatchingEventCodeStatus } from '@app/shared/constant';
import { IUploadMultiFile, IUploadMultiInfo } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';

@Component({
  selector: 'app-genaral-detail',
  templateUrl: './genaral-detail.component.html',
  styleUrls: ['./genaral-detail.component.scss'],
})
export class GenaralDetailComponent implements OnInit {
  public dataList: any[] = []; //change later

  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public isViewMode: boolean = false;
  @Input() isOpened: boolean = true;
  public customerId = '';
  public litigationId = '';
  public uploadMultiInfo: IUploadMultiInfo = { cif: '', litigationId: '' };
  public documentUpload: IUploadMultiFile[] = [];
  public dataColumns: string[] = ['INDEX', 'DATE_SELLING'];
  public AUCTION_STATUS = AuctionStatus;
  public reason: any = {};
  public isReason: boolean = false;

  public reasonLabel = new Map<string, string>([
    ['UNPROCEED', 'ไม่ดำเนินการ'],
    ['UNMAP_CASE', 'ยกเลิกประกาศที่จับคู่'],
    ['ADJUST_SUBMIT', 'แถลงแก้ไขประกาศ'],
    ['REPROCEED', 'ดำเนินการใหม่อีกครั้ง'],
  ]);

  public MATCHING_STATUS = MatchingEventCodeStatus;
  // public dataColumns: string[] = ['INDEX', 'DATE_SELLING', 'RESULT_AUCTION', 'REMARK'];
  @Input() dataForm!: UntypedFormGroup;
  @Input() mode!: boolean;
  @Input() isAnnouncement!: boolean;
  @Output() onOpenExpansion = new EventEmitter();
  constructor(
    private routerService: RouterService,
    private auctionService: AuctionService
  ) {}

  get uploadAucBiddingDocuments() {
    return this.auctionService.uploadAucBiddingDocuments;
  }

  ngOnInit(): void {
    console.log('ngOnInit :: GenaralDetailComponent :: dataForm ', this.dataForm);
    console.log('ngOnInit :: GenaralDetailComponent :: mode ', this.mode);
    if (this.mode) {
      this.isViewMode = true;
    } else {
      this.isViewMode = false;
    }
    this.dataList = this.dataForm.get('dataDateList')?.value;
    console.log('dataList 1', this.dataList);

    if (this.isAnnouncement) {
      this.documentColumns = ['INDEX', 'DATE_SELLING'];
      this.dataColumns = ['INDEX', 'DATE_SELLING'];
    } else {
      this.documentUpload = this.dataForm.get('aucBiddingDocuments')?.value;
      console.log('this.documentUpload', this.documentUpload);
      this.dataColumns = ['INDEX', 'DATE_SELLING', 'RESULT_AUCTION', 'REMARK'];
    }

    if (this.dataForm.get('auctionMatchingLogs')?.value) {
      this.isReason = true;
      const dataReason = this.dataForm.get('auctionMatchingLogs')?.value;
      console.log('this.isReason', this.isReason);
      const result = Array.isArray(dataReason);
      if (result) {
        this.reason = dataReason;
      } else {
        this.reason = [];
        this.reason.push(dataReason);
      }
    }

    this.documentUpload =
      this.documentUpload && this.documentUpload.length > 0
        ? this.documentUpload.map((m: any) => {
            return {
              ...m,
              imageId: m.imageId,
              documentTemplate: m.documentTemplate,
              documentTemplateId: m.documentTemplate?.documentTemplateId,
              uploadDate: m.uploadDate || m.uploadTimestamp,
              indexOnly: true,
              active: true,
            } as IUploadMultiFile;
          })
        : [];

    this.uploadMultiInfo = {
      ...this.uploadMultiInfo,
      aucRef: this.auctionService.aucRef ?? 0,
    }

    console.log('this.dataForm ', this.dataForm);
    console.log('this.isReason', this.isReason);
    console.log('this.reason', this.reason);
  }

  clickBinDate(data: any) {
    const destination = this.auctionService.routeCorrection('auction-appointment-date');
    this.routerService.navigateTo(destination, { aucBiddingId: data });
  }

  openExpansionPanel() {
    this.onOpenExpansion.emit();
  }

  onUploadFileContent(event: IUploadMultiFile[] | null) {
    if(event && event?.length > 0) {
      this.documentUpload = event.map((m: any) => {
        return {
          ...m,
          documentId: m.imageId || '',
          imageId: m.imageId || '',
          documentTemplate: m.documentTemplate,
          documentTemplateId: m.documentTemplate?.documentTemplateId,
          uploadDate: m.uploadDate || m.uploadTimestamp,
          indexOnly: true,
          active: true,
        } as IUploadMultiFile;
      });
      this.dataForm.get('aucBiddingDocuments')?.setValue(this.documentUpload);
      this.dataForm.get('aucBiddingDocuments')?.updateValueAndValidity();
    }
  }
}
