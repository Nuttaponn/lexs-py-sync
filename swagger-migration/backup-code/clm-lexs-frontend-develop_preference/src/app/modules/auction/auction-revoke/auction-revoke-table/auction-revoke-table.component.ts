import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-auction-revoke-table',
  templateUrl: './auction-revoke-table.component.html',
  styleUrls: ['./auction-revoke-table.component.scss'],
})
export class AuctionRevokeTableComponent implements OnInit, OnChanges {
  constructor() {}

  @Input() editMode: boolean = false;
  @Input() data: any[] = [];
  @Output() dataChange: EventEmitter<any[]> = new EventEmitter<any[]>();

  showOnlyIncomplete: boolean = false;
  tableColumns: string[] = ['order', 'fsubbidnum', 'revokeReason', 'action'];
  allCollaterals: any[] = [];
  collaterals: any[] = [];

  ngOnInit(): void {
    this.allCollaterals = this.data;
    this.collaterals = this.allCollaterals;
    if (!this.editMode) this.tableColumns = this.tableColumns.slice(0, 3);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.allCollaterals = this.data;
      this.collaterals = this.allCollaterals;
    }
  }

  onCheckShowOnlyIncomplete() {
    this.showOnlyIncomplete = !this.showOnlyIncomplete;
    if (this.showOnlyIncomplete) {
      this.collaterals = this.data.filter(c => !c.revokeReason || c.revokeReason === '');
    } else {
      this.collaterals = [...this.allCollaterals];
    }
  }

  onReasonChange(index: number, event: any) {
    this.collaterals[index].revokeReason = event.target.value;
    this.allCollaterals[index].revokeReason = event.target.value;
    this.dataChange.emit(this.allCollaterals);
  }

  onDelete(collateralId: number) {
    this.collaterals = this.collaterals.filter(c => c.collateralId !== collateralId);
    this.allCollaterals = this.allCollaterals.filter(c => c.collateralId !== collateralId);
    this.dataChange.emit(this.allCollaterals);
  }
}
