import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BidDate } from '@lexs/lexs-client';

@Component({
  selector: 'app-suspend-detail-table',
  templateUrl: './suspend-detail-table.component.html',
  styleUrls: ['./suspend-detail-table.component.scss'],
})
export class SuspendDetailTableComponent implements OnInit {
  @Input() data: Array<BidDate> = [];
  @Input() aucBiddingStatus: string = '';
  @Input() aucRound: number = 0;
  @Output() onUpdateSelectItem = new EventEmitter<any>();

  public selection = new SelectionModel<number>(true, []);
  public tableDagtaSource = new MatTableDataSource<BidDate>([]);
  public tableColumns = ['selection', 'orderNo', 'bidDate', 'status', 'remark'];
  constructor() {}

  ngOnInit(): void {
    this.tableDagtaSource.data = this.data;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      const _selectedColaterals = this.tableDagtaSource.data
        .filter((it: BidDate) => this.canSuspend(it || ''))
        .map(m => {
          return m.number;
        }) as number[];
      this.selection.select(..._selectedColaterals);
    }
    this.onUpdateSelectItem.emit(this.selection);
  }

  isAllSelected() {
    return (
      this.selection.selected.length ===
      this.tableDagtaSource.data.filter((it: BidDate) => this.canSuspend(it || '')).length
    );
  }

  onCheckboxChange(row: any) {
    row.number && this.selection.toggle(row.number);
    this.onUpdateSelectItem.emit(this.selection);
  }

  canSuspend(item: BidDate) {
    const _itemNumber = Number(item.number);
    return (_itemNumber === this.aucRound && this.aucBiddingStatus === 'PENDING') || _itemNumber > this.aucRound;
  }
}
