import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, FormBuilder } from '@angular/forms';
import { RouterService } from '@app/shared/services/router.service';
import { AuctionBiddingsAnnouncesResponse, InquiryAnnouncesResponse, LitigationCaseShortDto, CreateAnnounceResponse } from '@lexs/lexs-client';
import { NewAuctionService } from '../auction-add/new-auction.service';
import { AuctionService } from '../auction.service';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { TMode } from '@app/shared/models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoggerService } from '@app/shared/services/logger.service';

@Component({
  selector: 'app-auction-manual-announcement',
  templateUrl: './auction-manual-announcement.component.html',
  styleUrl: './auction-manual-announcement.component.scss'
})
export class AuctionManualAnnouncementComponent implements OnInit, OnDestroy {
  public caseDetailTitle = 'TITLE_MSG.CASE_DETAIL';
  public litigationCaseShortDetail!: LitigationCaseShortDto;

  public dataGeneralForm!: UntypedFormGroup;
  public genaralDetail!: AuctionBiddingsAnnouncesResponse | undefined;
  initialStepIndex = 0;

  constructor(
    private fb: FormBuilder,
    private routerService: RouterService,
    private auctionService: AuctionService,
    private newAuctionService: NewAuctionService,
    private litigationCaseService: LitigationCaseService,
    private logger: LoggerService,
  ) { }

  columns: string[] = [
    'no',                    // ลำดับ
    'assetSet',              // ชุดทรัพย์
    'assetType',             // ประเภททรัพย์
    'subType',               // ประเภทย่อย
    'documentNo',            // เลขที่เอกสารสิทธิ์
    'assetDetails',          // รายละเอียดทรัพย์
    'redCaseNo',             // คดีหมายเลขแดง
    'saleMethod',            // วิธีการขาย
    'mortgagee',             // ผู้รับจำนอง
    'ownerName',             // ชื่อผู้ถือกรรมสิทธิ์
    'plaintiff',             // โจทก์
    'defendant',             // จำเลย
    'ownershipType',         // ประเภทกรรมสิทธิ์
    'legalExecutionOffice',  // สำนักงานบังคับคดี
    'remarks',               // หมายเหตุ
    'noAssetInAnnouncement', // ไม่มีทรัพย์นี้อยู่ในประกาศ
  ];
  // "ชุดทรัพย์"

  // "ไม่มีทรัพย์นี้อยู่ในประกาศ"
  // checkbox

  createAnnounceResponse!: CreateAnnounceResponse | undefined;
  matchStatus!: string | undefined;
  // TODO: ViewChild -> validate(): boolean, getValue(): Dto. for Children components

    // 1st step form
    // generalDetailForm!: FormGroup;

  mode: TMode = 'VIEW';
  isOpenGenaralDetailAdd: boolean = false;
  isOpenedLexsSysTable: boolean = false;

  isOpenedInformationAssetSet: boolean = false;
  public anouncementDetail: InquiryAnnouncesResponse | undefined;
  auctionCaseTypeCode: string = '';
  private destroy$ = new Subject<void>();

  generalDetailAddMode: TMode = 'VIEW';
  lexsSysTableMode: TMode = 'VIEW';
  informationAssetSetMode: TMode = 'VIEW';

  async ngOnInit() {
    // Subscribe to matchStatus$
    this.newAuctionService.matchStatus$
    .pipe(takeUntil(this.destroy$))
    .subscribe((status) => {
      this.matchStatus = status;
      if (status) {
        this.performActionOnMatchStatusChange();
      }
    })
  }

  ngOnDestroy(): void {
    // Emit a value to complete all observables using takeUntil
    this.destroy$.next();
    this.destroy$.complete();
  }

  performActionOnMatchStatusChange() {
    this.auctionCaseTypeCode  = this.auctionService.auctionCaseTypeCode ?? '';
    this.anouncementDetail = this.auctionService.selectAnouncementDetail;

    // this.createAnnounceResponse = this.newAuctionService.createAnnounceResponse;

    // this.matchStatus = this.newAuctionService.matchStatus;
    this.logger.info('AuctionManualAnnouncementComponent matchStatus', this.matchStatus);
    this.mode = this.auctionService.mode === 'VIEW' ? 'VIEW' : 'EDIT';
    // alert(this.mode);
    switch (this.matchStatus) {
      case 'PENDING_NEW_ANNOUNCE':
        this.isOpenGenaralDetailAdd = true;
        this.isOpenedLexsSysTable = true;
        this.initialStepIndex = 0;
        // this.generalDetailForm = this.newAuctionService.generalDetailFormGroup
        this.generalDetailAddMode = this.mode;
        this.lexsSysTableMode = this.mode
        break;
      case 'PENDING_NEW_DEEDGROUP':
        this.isOpenedInformationAssetSet = true;
        this.initialStepIndex = 1;
        this.informationAssetSetMode = this.mode;
        break;
      case 'PENDING_NEW_VALIDATE':
        this.initialStepIndex = 2;
        this.isOpenGenaralDetailAdd = false;
        this.isOpenedLexsSysTable = true;
        this.isOpenedInformationAssetSet = true;
        this.generalDetailAddMode = 'VIEW';
        this.lexsSysTableMode = 'VIEW';
        this.informationAssetSetMode = 'VIEW';
        // TODO: viewMode โชว์ dropdown ชุดทรัพย์
        break;
    }

    // this.initCaseDetailsData(); // TODO: remove if not needed
    /*
    this.auctionService.auctionBiddingsAnnouncesResponse = await this.auctionService.getAuctionBiddingAnnounceResult(
      this.auctionService.aucRef
    );
    this.genaralDetail = this.auctionService.auctionBiddingsAnnouncesResponse;
    this.dataGeneralForm = this.auctionService.getGenaralForm(this.genaralDetail);
    */
  }

  initCaseDetailsData() {
    this.litigationCaseShortDetail = this.litigationCaseService.litigationCaseShortDetail;
  }

  // Handle step change event
  onStepChange(event: any): void {
    console.log('Step changed to index:', event.selectedIndex);
  }

  // Handle form submission
  submit(): void {
    console.log('Form submitted successfully!');
    alert('Form submitted successfully!');
  }

  // isOpened: boolean = true;

  // รายการประกาศบน LEXS ที่รอจับคู่
  // TODO: DDLs
  // TODO: table
  //  TODO: dto
  //  TODO: use dto to generate data-table with paging

  // ตัวอย่าง app-external-documents-search-controller
  // คดีหมายเลขแดง

  handleExpansion() {
    console.log('Expansion panel opened!');
  }
}
