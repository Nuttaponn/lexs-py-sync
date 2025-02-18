import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { Pageable } from '@lexs/lexs-client';
import { PaginatorActionConfig, PaginatorResultConfig } from '@spig/core';

// TODO: Remark due to not implement in current project plan

@Component({
  selector: 'app-auction-led-card-order-table',
  templateUrl: './auction-led-card-order-table.component.html',
  styleUrls: ['./auction-led-card-order-table.component.scss'],
})
export class AuctionLedCardOrderTableComponent implements OnInit {
  public pageResultConfig!: PaginatorResultConfig;
  public pageActionConfig!: PaginatorActionConfig;
  public pageSize: number = 10;
  public columnNames: string[] = ['order', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6'];
  public columns: { value: string; name: string }[] = [
    {
      value: this.columnNames[0],
      name: 'ลำดับ',
    },
    {
      value: this.columnNames[1],
      name: 'วันที่ออกคำสั่ง',
    },
    {
      value: this.columnNames[2],
      name: 'ประเภทคำร้อง',
    },
    {
      value: this.columnNames[3],
      name: 'วันยื่นคำร้อง',
    },
    {
      value: this.columnNames[4],
      name: 'คดีสาขาหมายเลขดำชั้นต้น',
    },
    {
      value: this.columnNames[5],
      name: 'ศาล',
    },
    {
      value: this.columnNames[6],
      name: 'สถานะ',
    },
  ];

  public pageable: Pageable = {
    offset: 0,
    pageNumber: 0,
    pageSize: this.pageSize,
    paged: true,
    sort: {
      empty: false,
      sorted: false,
      unsorted: true,
    },
    unpaged: false,
  };

  public dataSource = new MatTableDataSource([
    {
      x1: '2023-12-31',
      x2: 'เพิกถอนการขาย',
      x3: '-',
      x4: '-',
      x5: 'ศาลชั้นต้น',
      x6: 'อยู่ระหว่างการสั่งการ',
    },
  ]);

  ngOnInit(): void {
    this.dataSource.data = this.dataSource.data.slice(0, this.pageSize);
  }

  onPaging(event: PageEvent) {
    this.dataSource.filteredData = this.dataSource.data.slice(
      event.startLabel ? event.startLabel - 1 : 0,
      event.fromLabel
    );
  }
}
