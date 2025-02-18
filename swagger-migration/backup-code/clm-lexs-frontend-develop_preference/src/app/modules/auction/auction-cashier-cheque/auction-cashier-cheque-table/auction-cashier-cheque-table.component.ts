import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { RouterService } from '@app/shared/services/router.service';
import { AuctionService } from '../../auction.service';

@Component({
  selector: 'app-auction-cashier-cheque-table',
  templateUrl: './auction-cashier-cheque-table.component.html',
  styleUrls: ['./auction-cashier-cheque-table.component.scss'],
})
export class AuctionCashierChequeTableComponent implements OnInit {
  @Input() dataTable: any[] = [];
  @Input() sectionName: 'COLLATERAL' | 'STAMP' | 'ON_REQUEST' = 'COLLATERAL';
  @Input() hasEditMode: boolean = false;
  @Input() dataInfo: any;

  dataTableSource = new MatTableDataSource<any>([]);

  public pageSize = 10;
  public pageIndex: number = 1;

  displayCollateralColumns: string[] = ['no', 'fsubbidnum', 'amount', 'orderPaymentDate'];

  displayStampColumns: string[] = ['no', 'fsubbidnum', 'buyerType', 'soldPrice', 'amount', 'orderPaymentDate'];

  constructor(
    private routerService: RouterService,
    private auctionService: AuctionService
  ) {}

  ngOnInit(): void {
    this.getDataTable();
  }

  getDataTable() {
    this.dataTableSource.data = this.dataTable || [];
    this.dataTableSource.filteredData = this.dataTableSource.data.slice(0, 10);
  }

  navigateToPropertyDetail(fsubbidnum: string) {
    const destination = this.auctionService.routeCorrection('property-detail');
    this.routerService.navigateTo(destination, { fsubbidnum: fsubbidnum, aucRef: this.dataInfo.get('aucRef').value });
  }

  onPaging(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.dataTableSource.filteredData = this.dataTableSource.data.slice(
      event.startLabel ? event.startLabel - 1 : 0,
      event.fromLabel
    );
  }
}
