import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IUploadMultiFile, IUploadMultiInfo } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';

@Component({
  selector: 'app-auction-processing-document',
  templateUrl: './auction-processing-document.component.html',
  styleUrls: ['./auction-processing-document.component.scss'],
})
export class AuctionProcessingDocumentComponent implements OnInit {
  isOpened = true;
  @Input() documentUpload: IUploadMultiFile[] = [];
  @Input() isUploadReadOnly: boolean = false;
  @Input() uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  @Output() onUploadFileEvent = new EventEmitter<IUploadMultiFile[] | null>();
  public formUploadControl: UntypedFormControl = new UntypedFormControl(false, Validators.requiredTrue);

  public onDownLoadForm = new EventEmitter();

  public documentColumns: string[] = ['documentName', 'uploadDate'];

  @Input() auctionSubmitResultForm!: UntypedFormGroup;
  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.info('AuctionProcessingDocumentComponent -> ngOnInit');
    this.documentUpload =
      this.documentUpload && this.documentUpload.length > 0
        ? this.documentUpload.map((m: any) => {
            return {
              ...m,
            } as IUploadMultiFile;
          })
        : [];
    console.log(' this.documentUpload', this.documentUpload);
  }

  uploadFileEvent($event: IUploadMultiFile[] | null) {
    this.logger.info('AuctionProcessingDocumentComponent -> uploadFileEvent');
    this.onUploadFileEvent.emit($event);
  }
}
