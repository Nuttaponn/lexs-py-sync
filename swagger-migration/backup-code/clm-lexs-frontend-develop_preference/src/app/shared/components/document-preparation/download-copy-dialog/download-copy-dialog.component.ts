import { Component } from '@angular/core';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-download-copy-dialog',
  templateUrl: './download-copy-dialog.component.html',
  styleUrls: ['./download-copy-dialog.component.scss'],
})
export class DownloadCopyDialogComponent {
  public displayColumns: string[] = ['no', 'documentName'];

  isSubmited: boolean = false;
  data: string[] = [];
  litigationId: string = '';
  isClicked: boolean = false;
  showWarning: boolean = false;

  dataContext(data: any) {
    this.data = data?.data;
    this.litigationId = data?.litigationId;
  }
  constructor(private documentService: DocumentService) {}

  public async onClose(): Promise<boolean> {
    if (!this.isClicked) {
      this.showWarning = true;
      return false;
    }
    return true;
  }

  get returnData() {
    /*
    return ''
    */
    return 'DONE';
  }

  async downloadReturnOriginalCover() {
    this.isClicked = true;
    await this.documentService.downloadKtbLogisticDoc(this.litigationId);
  }
}
