import {
  AfterViewChecked,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
} from '@angular/core';

/*
Usage:
<div class="table-scroll" table-scroll> <-- Add table-scroll directive
  <table mat-table ...>
    <ng-container matColumnDef="myDef" sticky>
      <th mat-header-cell *matHeaderCellDef columnElevationLeft>...</th> <-- Add columnElevationLeft directive
      <td mat-cell *matCellDef="let element" columnElevationLeft>...</td> <-- Add columnElevationLeft directive
    </ng-container>
    ...
    <ng-container matColumnDef="myDef" stickyEnd>
      <th mat-header-cell *matHeaderCellDef columnElevationRight>...</th> <-- Add columnElevationRight directive
      <td mat-cell *matCellDef="let element" columnElevationRight>...</td> <-- Add columnElevationRight directive
    </ng-container>
  </table>
</div>
*/
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[table-scroll]',
})
export class TableScrollDirective implements AfterViewChecked, OnInit {
  isScrollLeftEnd: boolean = false;
  isScrollRightEnd: boolean = false;
  currentScroll: number = 0;
  disableElevation: boolean = true;
  isEnableShadow: boolean = false;

  table: Element | undefined = undefined;

  constructor(
    private tableScroll: ElementRef,
    private cdref: ChangeDetectorRef
  ) {}

  @HostBinding('class.has-elevation-left') get hasElevationLeft() {
    return this.isEnableShadow && !this.isScrollRightEnd;
  }
  @HostBinding('class.has-elevation-right') get hasElevationRight() {
    return this.isEnableShadow && (!this.isScrollLeftEnd || this.currentScroll === 0);
  }

  ngOnInit(): void {
    this.isScrollRightEnd = true;
    this.table = this.tableScroll.nativeElement.children?.[0];
  }

  ngAfterViewChecked(): void {
    if (this.table && this.table.clientWidth > this.tableScroll.nativeElement.clientWidth) {
      if (!this.isEnableShadow) {
        this.isEnableShadow = true;
        this.cdref.detectChanges();
      }
    }
  }

  @HostListener('scroll') onScroll() {
    if (!this.table) return;
    const scrollAmount = this.tableScroll.nativeElement.scrollLeft;
    if (
      this.table &&
      this.tableScroll &&
      Math.abs(this.table?.clientWidth - this.tableScroll.nativeElement.clientWidth - scrollAmount) < 1
    ) {
      this.isScrollLeftEnd = true;
    } else {
      this.isScrollLeftEnd = false;
    }
    if (scrollAmount === 0) this.isScrollRightEnd = true;
    else this.isScrollRightEnd = false;

    this.currentScroll = scrollAmount;
  }
}
