import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { RouterService } from '@app/shared/services/router.service';
import { AuctionLedCardService } from '../auction-led-card.service';
import { SeizureSupportTypeEnum } from '@app/modules/seizure-property/models';
import { SeizureInfoDto } from '@lexs/lexs-client';
import { MAIN_ROUTES } from '@app/shared/constant';

@Component({
  selector: 'app-auction-led-card-seized-callaterals',
  templateUrl: './auction-led-card-seized-callaterals.component.html',
  styleUrls: ['./auction-led-card-seized-callaterals.component.scss'],
})
export class AuctionLEDCardSeizedCallateralsComponent implements OnInit {
  @Input() auctionCaseTypeCode: string = '';
  @Input() ledId!: number | undefined;
  @Input() litigationCaseId!: number | undefined;
  /** displayColumns */
  public displayedColumns: string[] = ['col0', 'col1', 'col2', 'col3'];
  public seizureInfo = new MatTableDataSource<SeizureInfoDto>([]);
  public preferentialOrderInfo = new MatTableDataSource<any>([]);

  public pageSize = 10;
  public pageIndex: number = 1;
  public isPreferential: boolean = false;

  constructor(
    private auctionLedCardService: AuctionLedCardService,
    private routerService: RouterService,
    private lawsuitService: LawsuitService
  ) {}

  get isEmptyInfo() {
    return this.isPreferential
      ? !this.preferentialOrderInfo || this.preferentialOrderInfo.data.length === 0
      : !this.seizureInfo || this.seizureInfo.data.length === 0;
  }

  async ngOnInit() {
    this.isPreferential = this.auctionCaseTypeCode === '0002';
    if (this.isPreferential) {
      await this.getInquiryPreferentialOrderInfo();
    } else {
      await this.getInquirySeizureInfo();
    }
  }

  async getInquirySeizureInfo() {
    if (this.ledId && this.litigationCaseId) {
      const resp = await this.auctionLedCardService.getInquirySeizureInfo(this.ledId, this.litigationCaseId);
      this.seizureInfo.data = resp.seizureInfos || [];
      this.seizureInfo.filteredData = this.seizureInfo.data.slice(0, 10);
    }
  }

  async getInquiryPreferentialOrderInfo() {
    if (this.ledId && this.litigationCaseId) {
      const resp = await this.auctionLedCardService.getInquiryPreferentialOrderInfo(this.litigationCaseId, this.ledId.toString()) ;
      this.preferentialOrderInfo.data = resp.preferentialOrderInfo || [];
      this.preferentialOrderInfo.filteredData = this.preferentialOrderInfo.data.slice(0, 10);
    }
  }

  onPaging(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    if(this.isPreferential) {
      this.preferentialOrderInfo.filteredData = this.preferentialOrderInfo.data.slice(
        event.startLabel ? event.startLabel - 1 : 0,
        event.fromLabel
      );
    } else {
      this.seizureInfo.filteredData = this.seizureInfo.data.slice(
        event.startLabel ? event.startLabel - 1 : 0,
        event.fromLabel
      );
    }
  }

  navigateToSeizureProperty(data?: any) {
    this.routerService.navigateTo(`/main/lawsuit/seizure-property/execution-detail`, {
      litigationId: this.lawsuitService.currentLitigation.litigationId,
      litigationCaseId: this.litigationCaseId,
      seizureId: data?.seizureId || '0',
      seizureLedId: data?.seizureLedsId,
      createdTimestamp: null,
      hidelawyer: true,
      mode: 'VIEW',
      featureRequest: 'auction',
      supportType: data?.seizureType === 'NCOL' ? SeizureSupportTypeEnum.NON_MORTGAGE : '',
    });
  }

  navigateToPreferentialOrder(data?: any) {
    this.routerService.navigateTo(`${MAIN_ROUTES.PREFERENCE}/detail`, { preferenceGroupNo: data?.preferenceGroupNo || '0' });
  }
}
