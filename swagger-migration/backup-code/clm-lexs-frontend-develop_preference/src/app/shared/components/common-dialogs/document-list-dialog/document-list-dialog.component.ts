import { Component } from '@angular/core';
import { IUploadMultiFile } from '@app/shared/models';

@Component({
  selector: 'app-document-list-dialog',
  templateUrl: './document-list-dialog.component.html',
  styleUrls: ['./document-list-dialog.component.scss'],
})
export class DocumentListDialogComponent {
  public isViewMode = true;
  public documentList: IUploadMultiFile[] = [];
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  constructor() {}

  dataContext(data: any) {
    this.documentList = data.documentList;
  }
}
