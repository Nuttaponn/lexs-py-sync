import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { PaginatorActionConfig, PaginatorResultConfig } from './paginator.model';

@Component({
  selector: 'spig-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit {
  public resultTitle: string = 'PAGINATION.RESULT';
  public resultFromIndex: number = 1;
  public resultToIndex: number = 1;
  public resultFromLable: string = 'PAGINATION.FROM';
  public resultTotalItems: number = 1;

  public actionPreviousLabel: string = 'PAGINATION.PREVIOUS';
  public actionNextLabel: string = 'PAGINATION.NEXT';
  public actionFromPage: number = 1;
  public actionToPage: number = 1;
  public actionTotalPages: number = 1;
  public actionCurrentPage: number = 1;
  public actionPreviousPage: number = 1;

  public listPage: string[] = [];
  public limitDisplay: number = 6;

  public displayResult = false;
  @Input('result')
  set result(val: PaginatorResultConfig) {
    if (!!val) this.displayResult = true;
    this.resultTitle = val.title || 'PAGINATION.RESULT';
    this.resultFromLable = val.fromLabel || 'PAGINATION.FROM';
    if (val.totalElements === 0) {
      this.resultTotalItems = 0;
      this.resultFromIndex = 0;
      this.resultToIndex = 0;
    } else {
      this.resultTotalItems = val.totalElements || 1;
      this.resultFromIndex = val.fromIndex || 1;
      this.resultToIndex = val.toIndex || 1;
    }
  }

  @Input('action')
  set action(val: PaginatorActionConfig) {
    this.actionPreviousLabel = 'PAGINATION.PREVIOUS';
    this.actionNextLabel = val?.nextLabel || 'PAGINATION.NEXT';
    this.actionTotalPages = val?.totalPages || 1;
    this.actionFromPage = val?.fromPage || 1;
    this.actionToPage = val?.toPage || 1;
    this.actionCurrentPage = val?.currentPage || 1;
  }

  @Output() pageEvent = new EventEmitter<number>();

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const _currentValue = changes['action'].currentValue as PaginatorActionConfig;
    if (_currentValue?.currentPage) {
      if (_currentValue.currentPage === this.actionPreviousPage) {
        this.numberOfLabels();
      } else if (_currentValue.currentPage > this.actionPreviousPage) {
        this.updateOnNext();
      } else if (_currentValue.currentPage < this.actionPreviousPage) {
        this.updateOnPrevious();
      }
    }
  }

  numberOfLabels() {
    this.listPage = [];
    if (this.actionTotalPages <= this.limitDisplay) {
      for (let index = 1; index <= this.actionTotalPages; index++) {
        this.listPage.push(index.toString());
      }
    } else {
      for (let index = 1; index < this.limitDisplay; index++) {
        this.listPage.push(index.toString());
      }
      this.listPage.push('...');
      this.listPage.push(this.actionTotalPages.toString());
    }
  }

  updateOnNext() {
    if (this.actionCurrentPage <= 3) {
      this.numberOfLabels();
    } else if (
      this.actionCurrentPage >= this.actionTotalPages - 3 ||
      this.actionCurrentPage === this.actionTotalPages
    ) {
      if (this.actionTotalPages < this.limitDisplay) {
        this.numberOfLabels();
      } else {
        let first = ['1', '...'];
        let middle = [
          (this.actionTotalPages - 4).toString(),
          (this.actionTotalPages - 3).toString(),
          (this.actionTotalPages - 2).toString(),
        ];
        let last = [(this.actionTotalPages - 1).toString(), this.actionTotalPages.toString()];
        this.listPage = [...first.concat(middle).concat(last)];
      }
    } else {
      let first = ['1', '...'];
      let middle = [
        (this.actionCurrentPage - 1).toString(),
        this.actionCurrentPage.toString(),
        (this.actionCurrentPage + 1).toString(),
      ];
      let last = ['...', this.actionTotalPages.toString()];
      this.listPage = [...first.concat(middle).concat(last)];
    }
  }

  updateOnPrevious() {
    if (this.actionCurrentPage <= 3) {
      this.numberOfLabels();
    } else if (
      this.actionCurrentPage >= this.actionTotalPages - 3 ||
      this.actionCurrentPage === this.actionTotalPages
    ) {
      if (this.actionTotalPages < this.limitDisplay) {
        this.numberOfLabels();
      } else {
        let first = ['1', '...'];
        let middle = [
          (this.actionTotalPages - 4).toString(),
          (this.actionTotalPages - 3).toString(),
          (this.actionTotalPages - 2).toString(),
        ];
        let last = [(this.actionTotalPages - 1).toString(), this.actionTotalPages.toString()];
        this.listPage = [...first.concat(middle).concat(last)];
      }
    } else {
      let first = ['1', '...'];
      let middle = [
        (this.actionCurrentPage - 1).toString(),
        this.actionCurrentPage.toString(),
        (this.actionCurrentPage + 1).toString(),
      ];
      let last = ['...', this.actionTotalPages.toString()];
      this.listPage = [...first.concat(middle).concat(last)];
    }
  }

  onNext() {
    if (this.actionCurrentPage === this.actionTotalPages) {
      return;
    }
    this.actionPreviousPage = this.actionCurrentPage;
    this.pageEvent.emit(this.actionCurrentPage + 1);
  }

  onPrevious() {
    if (this.actionCurrentPage === 1) {
      return;
    }
    this.actionPreviousPage = this.actionCurrentPage;
    this.pageEvent.emit(this.actionCurrentPage - 1);
  }

  onPage(page: string) {
    if (page === '...') return;
    this.actionPreviousPage = this.actionCurrentPage;
    this.actionCurrentPage = Number(page);
    this.pageEvent.emit(this.actionCurrentPage);
  }
}
