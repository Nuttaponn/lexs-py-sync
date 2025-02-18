import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HasInitialized, mixinDisabled, mixinInitialized } from '@angular/material/core';

export interface PageEvent {
  /** The current page index. */
  pageIndex: number;

  /**
   * Index of the page that was selected previously.
   * @breaking-change 8.0.0 To be made into a required property.
   */
  previousPageIndex?: number;

  /** The current page size */
  pageSize: number;

  /** The current total number of items being paged */
  length: number;

  numberOfPages: number;
}

export class Page {
  public pageNumber: number;
  public label: string;
  public disabled: boolean;

  constructor(index: number, label: string, disabled: boolean = false) {
    this.pageNumber = index;
    this.label = label;
    this.disabled = disabled;
  }
}

const _MatPaginatorMixinBase = mixinDisabled(mixinInitialized(class { }));

@Component({
  selector: 'paginator',
  templateUrl: './simple-paginator.component.html',
  styleUrls: ['./simple-paginator.component.scss']
})
export class SimplePaginatorComponent extends _MatPaginatorMixinBase implements OnInit, HasInitialized {
  public pageIndex: number = 1;
  public paginationSize = 7;
  public pages: Array<Page> = [];

  /** The length of the total number of items that are being paginated. Defaulted to 0. */
  @Input()
  get length(): number {
    return this._length;
  }

  set length(value: number) {
    this._length = coerceNumberProperty(value);
    this._updatePageLabels();
  }

  private _length = 0;

  /** Number of items to display on a page. By default set to 50. */
  @Input()
  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(value: number) {
    this._pageSize = Math.max(coerceNumberProperty(value), 0);
  }

  public _pageSize: number = 10;


  /** Number of the first row in the page */
  get startLabel() {
    if (this.length == 0) return 0
    return (this.pageIndex - 1) * this.pageSize + 1
  }

  /** Number of last row in the page */
  get fromLabel() {
    return Math.min(((this.pageIndex - 1) * this.pageSize) + this.pageSize, this.length)
  }

  /** Event emitted when the paginator changes the page size or page index. */
  @Output() page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  constructor() {
    super();
  }

  ngOnInit() {
    this._markInitialized();
  }

  gotoPage(page: number) {
    const maxPageIndex = this.getNumberOfPages();
    const outOfRange = page > maxPageIndex || page < 1;

    if (outOfRange) {
      return;
    }

    this.pageIndex = page;
    this._emitPageEvent();
    this._isLabelNeedUpdated();
  }

  nextPage() {
    if (!this.hasNextPage()) {
      return;
    }

    this.pageIndex++;
    this._emitPageEvent();
    this._isLabelNeedUpdated();
  }

  previousPage() {
    if (!this.hasPreviousPage()) {
      return;
    }

    this.pageIndex--;
    this._emitPageEvent();
    this._isLabelNeedUpdated();
  }

  firstPage() {
    this.gotoPage(1);
    this._updatePageLabels();
  }

  lastPage() {
    const maxPageIndex = this.getNumberOfPages();
    this.gotoPage(maxPageIndex);
    this._isLabelNeedUpdated();
  }

  _isLabelNeedUpdated() {
    this._updatePageLabels();
  }

  hasNextPage(): boolean {
    const maxPageIndex = this.getNumberOfPages();
    return this.pageIndex < maxPageIndex && this.pageSize != 0;
  }

  hasPreviousPage(): boolean {
    return this.pageIndex > 1 && this.pageSize != 0;
  }

  getNumberOfPages(): number {
    if (!this.pageSize) {
      return 0;
    }

    return Math.ceil(this.length / this.pageSize);
  }

  onPageSize(pageSize: string) {
    this.pageIndex = 1;
    this.pageSize = coerceNumberProperty(pageSize);
    this._updatePageLabels();
    this._emitPageEvent();
  }

  private _updatePageLabels(start: number = 1, end: number = 7) {
    if (!this._length || !this._pageSize) {
      return;
    }

    const page = this.pageIndex;
    const numberOfPages = this.getNumberOfPages();
    const labels = this.generatePageLabels(numberOfPages, 1, page);
    this.pages = labels.map((label, i) => {
      const index = coerceNumberProperty(label, -1);
      return new Page(index, label);
    })
  }

  /**
   * Generate pagination label alike Google
   * Reference: https://stackoverflow.com/questions/11272108/logic-behind-pagination-like-google
   * @param total_page
   * @param each_side
   * @param curr_page
   * @returns string[]
   */
  generatePageLabels = (total_page: number, each_side: number, curr_page: number) => {
    let start_page = 1;
    let end_page = total_page;
    let pages = []

    if (total_page <= (2 * each_side) + 5) {
      // in this case, too few pages, so display them all
      start_page = 1
      end_page = total_page
    } else if (curr_page <= each_side + 2) {
      // in this case, curr_page is too close to the beginning
      start_page = 1
      end_page = (2 * each_side) + 3
    } else if (curr_page >= total_page - (each_side + 2)) {
      // in this case, curr_page is too close to the end
      start_page = total_page - (2 * each_side) - 2
      end_page = total_page
    } else {
      // regular case
      start_page = curr_page - each_side
      end_page = curr_page + each_side
    }

    if (start_page > 1)
      pages.push("1")

    if (start_page > 2)
      pages.push("...")

    for (let x = start_page; x <= end_page; x++)
      pages.push("" + x)

    if (end_page < total_page - 1)
      pages.push("...")

    if (end_page < total_page)
      pages.push("" + total_page)

    return pages
  }

  private _emitPageEvent() {
    this.page.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length,
      numberOfPages: this.getNumberOfPages(),
    });
  }
}
