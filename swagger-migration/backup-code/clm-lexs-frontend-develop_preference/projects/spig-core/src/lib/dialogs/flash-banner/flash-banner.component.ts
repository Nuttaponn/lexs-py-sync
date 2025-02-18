import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'spig-flash-banner',
  templateUrl: './flash-banner.component.html',
  styleUrls: ['./flash-banner.component.scss'],
})
export class FlashBannerComponent implements OnInit {
  contentCssClasses: Array<string> = [];

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public opts: any,
    private matSnackBarRef: MatSnackBarRef<FlashBannerComponent>
  ) {}

  ngOnInit(): void {
    if (this.opts && this.opts.contentCssClasses && Array.isArray(this.opts.contentCssClasses)) {
      this.contentCssClasses = this.opts.contentCssClasses;
    }
  }

  dismiss() {
    this.matSnackBarRef.dismiss();
  }
}
