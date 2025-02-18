import { Component } from '@angular/core';
import { IExpandContext, CustomDialogContent } from '../dialog.model';

@Component({
  selector: 'spig-expand-dialog',
  templateUrl: './expand-dialog.component.html',
  styleUrls: ['./expand-dialog.component.scss'],
})
export class ExpandDialogComponent implements CustomDialogContent {
  constructor() {}
  public context!: IExpandContext;
  public showDetail = false;

  dataContext(data: object) {
    this.context = data as IExpandContext;
    if (this.context.isExpand) {
      this.showDetail = true;
    }
  }

  returnData!: object;

  expand(e: Event) {
    e.preventDefault();
    this.showDetail = true;
  }
}
