import { AfterViewInit, Component, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DocumentAccountService } from '@app/shared/components/document-preparation/document-account.service';
import { AccountDto, LitigationDto } from '@lexs/lexs-client';
import { Subscription, take } from 'rxjs';
@Component({
  selector: 'app-confirm-merge-lg',
  templateUrl: './confirm-merge-lg.component.html',
  styleUrls: ['./confirm-merge-lg.component.scss'],
})
export class ConfirmMergeLgComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatTable) table!: MatTable<any>;
  icontents!: LitigationDto[];
  selectedLgId!: string[];

  private ngZoneSubscription!: Subscription;

  displayedColumns: string[] = ['lgId', 'cifNo', 'duedate', 'dpd', 'lawyer', 'responseId', 'ao', 'escort', 'flag'];

  displayedColumnsdoc: string[] = ['accountNo', 'billNo', 'accountName', 'accountType'];

  dataSource: Array<LitigationDto> = [];
  dataSourcedoc: any[] = [];
  resMergedAccounts!: AccountDto[];
  expectedLgId: string = '';

  constructor(
    private ngZone: NgZone,
    private documentAccountService: DocumentAccountService
  ) {}

  ngAfterViewInit() {
    /* monitoring table on zome-in & zoom-out for updating style */
    this.ngZoneSubscription = this.ngZone.onMicrotaskEmpty
      .pipe(take(3))
      .subscribe(() => this.table.updateStickyColumnStyles());
  }

  ngOnDestroy(): void {
    this.ngZoneSubscription.unsubscribe();
  }

  dataContext(data: any) {
    this.dataSource = data.icontents;
    this.expectedLgId = data.expectedLgId;
    this.dataSourcedoc = data.resMergedAccounts;
  }

  get returnData() {
    return true;
  }

  acctypeDesc(acctype: string) {
    return this.documentAccountService.getAccountTypeName(acctype) || '';
  }
}
