import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-seize-more-assets-dialog',
  templateUrl: './seize-more-assets-dialog.component.html',
  styleUrls: ['./seize-more-assets-dialog.component.scss'],
})
export class SeizeMoreAssetsDialogComponent {
  public assetType: UntypedFormControl = new UntypedFormControl('PLEDGE');
  isClosed = false;

  constructor() {}

  public async onClose(): Promise<boolean> {
    this.isClosed = true;
    return true;
  }

  get returnData(): string | undefined {
    return this.isClosed ? this.assetType.value : undefined;
  }
}
