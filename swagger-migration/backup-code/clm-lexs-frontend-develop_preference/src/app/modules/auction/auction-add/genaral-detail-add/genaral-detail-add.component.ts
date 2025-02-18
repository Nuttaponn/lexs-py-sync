import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, UntypedFormGroup } from '@angular/forms';
import { AuctionStatus } from '@app/shared/constant';
import { IUploadMultiInfo, IUploadMultiFile, acceptFile_PDF_JPG } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { AuctionService } from '../../auction.service';
import { NewAuctionService } from '../new-auction.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DocumentDto } from '@lexs/lexs-client';

@Component({
  selector: 'app-genaral-detail-add',
  // standalone: true,
  // imports: [],
  templateUrl: './genaral-detail-add.component.html',
  styleUrl: './genaral-detail-add.component.scss'
})
export class GenaralDetailAddComponent implements OnInit, OnDestroy {
  acceptFile: Array<string> = acceptFile_PDF_JPG;

  // public dataList: any[] = []; //change later

  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public isViewMode: boolean = false;
  @Input() isOpened: boolean = true;
  public customerId = '';
  public litigationId = '';
  public uploadMultiInfo: IUploadMultiInfo = { cif: '', litigationId: '' };
  public documentUpload: IUploadMultiFile[] = [];
  public dataColumns: string[] = ['INDEX', 'DATE_SELLING'];

  dataForm!: FormGroup; // generalDetailFormGroup
  matchStatus!: string | undefined;

  @Input() mode!: boolean;
  @Input() isAnnouncement!: boolean;
  // @Output() onOpenExpansion = new EventEmitter();
  private destroy$ = new Subject<void>();

  constructor(
    private routerService: RouterService,
    private auctionService: AuctionService,
    private newAuctionService: NewAuctionService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    // Subscribe to matchStatus$
    this.newAuctionService.matchStatus$
    .pipe(takeUntil(this.destroy$))
    .subscribe((status) => {
      this.matchStatus = status;

      if (status) {
        this.performActionOnMatchStatusChange();
      }
    });
  }

  ngOnDestroy(): void {
    // Emit a value to complete all observables using takeUntil
    this.destroy$.next();
    this.destroy$.complete();
  }

  performActionOnMatchStatusChange() {
    this.dataForm = this.newAuctionService.generalDetailFormGroup

    if (this.mode) {
      this.isViewMode = true;
    } else {
      this.isViewMode = false;
    }

    this.documentUpload = this.dataForm.get('aucBiddingDocuments')?.value;

    this.uploadMultiInfo = {
      ...this.uploadMultiInfo,
      aucRef: this.newAuctionService.aucRef ?? 0,
    }
    this.documentUpload =
      this.documentUpload && this.documentUpload.length > 0
        ? this.documentUpload.map((m: any, index: any) => {
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
    // console.log('documentUpload', this.documentUpload);
    // console.log('this.dataForm ', this.dataForm);
  }

  getControl(name: string): AbstractControl | null {
    return this.dataForm?.get(name);
  }

  get dataDateListArray(): FormArray {
    return this.dataForm.get('dataDateList') as FormArray;
  }

  openExpansionPanel() {
    // this.onOpenExpansion.emit();
  }

  async unableSelectEAuctionDialog(event: MouseEvent) {
    // event?.preventDefault();

    await this.notificationService.alertDialog(
      'AUCTION_MANUAL_ANNOUNCEMENT.UNABLE_TO_CHOOSE_E_AUCTION_TITLE',
      'AUCTION_MANUAL_ANNOUNCEMENT.UNABLE_TO_CHOOSE_E_AUCTION_MESSAGE');
  }

  onUploadFileContent(event: any): void {
    this.documentUpload = event as IUploadMultiFile[];
    // can handle only 1 document
    this.documentUpload.map(data => {
      const obj: DocumentDto = this.dataForm.get('aucBiddingDocuments')?.value[0];
      obj.imageId = data.imageId ?? '';
      this.dataForm.get('aucBiddingDocuments')?.setValue([
        {
          ...obj,
          isSubmitted: false,
        }
      ]);
    });
  }
}
