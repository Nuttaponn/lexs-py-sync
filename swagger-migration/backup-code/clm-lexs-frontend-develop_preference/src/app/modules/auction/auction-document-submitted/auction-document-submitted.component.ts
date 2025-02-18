import { Component, Input, OnInit } from '@angular/core';
import { IUploadMultiFile, IUploadMultiInfo, TMode } from '@app/shared/models';

@Component({
  selector: 'app-auction-document-submitted',
  templateUrl: './auction-document-submitted.component.html',
  styleUrls: ['./auction-document-submitted.component.scss'],
})
export class AuctionDocumentSubmittedComponent implements OnInit {
  public isOpened: Boolean = false;
  public isViewMode: boolean = true;
  public customerId = '';
  public litigationId = '';
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  public uploadMultiInfo: IUploadMultiInfo = { cif: '', litigationId: '' };
  public documentUpload: IUploadMultiFile[] = [];
  @Input() data!: any;
  public mode!: TMode;

  constructor() {}

  ngOnInit(): void {
    console.log('hi');
    this.mode = 'VIEW';
    let dataDoc = this.data.aucBiddingDeedGroupDocuments;
    this.documentUpload =
      dataDoc && dataDoc.length > 0
        ? dataDoc.map((m: any) => {
            return {
              ...m,
              imageId: m.imageId,
              documentTemplate: m.documentTemplate,
              documentTemplateId: m.documentTemplate?.documentTemplateId,
              uploadDate: m.uploadTimestamp,
              indexOnly: true,
              active: true,
            } as IUploadMultiFile;
          })
        : [];
    console.log('this.documentUpload ', this.documentUpload);
    console.log('documentColumns', this.documentColumns);
  }
}
