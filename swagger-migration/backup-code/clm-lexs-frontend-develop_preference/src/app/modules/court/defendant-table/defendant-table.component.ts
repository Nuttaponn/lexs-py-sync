import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DefendantDto } from '@lexs/lexs-client';

@Component({
  selector: 'app-defendant-table',
  templateUrl: './defendant-table.component.html',
  styleUrls: ['./defendant-table.component.scss'],
})
export class DefendantTableComponent implements OnInit {
  constructor() {}

  @Input() defendants: DefendantDto[] = [];
  @Input() showId: boolean = false;
  @Input() showOrder: boolean = true;
  @Input() isSelectable: boolean = false;

  selection = new SelectionModel<DefendantDto>(true);
  @Output()
  onSelectionChange = new EventEmitter<Array<DefendantDto>>();

  tableColumns: string[] = ['selection', 'order', 'name', 'relation', 'id'];

  ngOnInit(): void {
    if (!this.isSelectable) this.removeColumn('selection');
    if (!this.showId) this.removeColumn('id');
    if (!this.showOrder) this.removeColumn('order');
  }

  removeColumn(columnName: string) {
    const index = this.tableColumns.findIndex(column => column === columnName);
    this.tableColumns.splice(index, 1);
  }

  onSelectAll() {
    if (this.selection.hasValue()) {
      this.selection.clear();
    } else {
      this.defendants.forEach((d: DefendantDto) => {
        this.selection.select(d);
      });
    }
    this.onSelectionChange.emit(this.selection.selected);
  }
  isAllSelected() {
    return this.selection.selected.length === this.defendants.length;
  }
  onDefendantToggle(defendant: DefendantDto) {
    this.selection.toggle(defendant);
    this.onSelectionChange.emit(this.selection.selected);
  }
}
