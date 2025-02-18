import { Component } from '@angular/core';

@Component({
  selector: 'app-suit-confirm-before-dialog-confirm-upload',
  templateUrl: './suit-confirm-before-dialog-confirm-upload.component.html',
  styleUrls: ['./suit-confirm-before-dialog-confirm-upload.component.scss'],
})
export class SuitConfirmBeforeDialogConfirmUploadComponent {
  constructor() {}

  async onClose(): Promise<boolean> {
    return true;
  }

  get returnData() {
    return true;
  }
}
