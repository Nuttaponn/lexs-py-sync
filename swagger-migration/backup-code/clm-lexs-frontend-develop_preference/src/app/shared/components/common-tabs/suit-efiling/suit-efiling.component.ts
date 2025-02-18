import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  LitigationCaseDto,
  LitigationCaseGroupDto,
  LitigationCaseSubCaseDto,
  NameValuePair,
  TaskDetailDto,
} from '@lexs/lexs-client';
import { CourtCaseDto, ExtendedLitigationCaseGroupDto } from '@app/modules/lawsuit/lawsuit-detail/suit/suit.model';
import { SuitService } from '@app/modules/lawsuit/lawsuit-detail/suit/suit.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { COURT_FEE_STATUS, MENU_ROUTE_PATH, eFiling3_COJ } from '@app/shared/constant';
import { TMode, statusCode, taskCode } from '@app/shared/models';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { RouterService } from '@shared/services/router.service';

@Component({
  selector: 'app-suit-efiling',
  templateUrl: './suit-efiling.component.html',
  styleUrls: ['./suit-efiling.component.scss'],
})
export class SuitEfilingComponent implements OnInit {
  @ViewChild('aEFilling') aEFilling!: ElementRef;
  private taskId!: number | undefined;
  private courtList: Array<NameValuePair> = [];
  private disputeAppealId!: number; // (Defect -> LEX2-7431): ใช้หา LitigationSubCase เพียงหนึ่งเดียวที่สามารถแก้ไขได้

  public isViewMode: boolean = false;
  public taskDetail: TaskDetailDto = {};
  public groupByCaseList: Array<ExtendedLitigationCaseGroupDto> = [];
  public isShowButtonColumn: boolean[] = [];
  public isOpenedList: boolean[] = [];
  public doc2Column = ['documentName'];
  public COURT_FEE_STATUS = COURT_FEE_STATUS;
  public viewDisplayedColumns: string[] = [
    'no',
    'referenceNo',
    'caseDate',
    'blackCaseNo',
    'capitalAmount',
    'court',
    'sla',
    'paymentAuditingStatus',
  ];
  public displayedColumns: string[] = [...this.viewDisplayedColumns, 'button'];
  public isShowLinkEdit: boolean = false;
  public isShowUploadCourtFeeMockBtn: boolean = false;
  public isShowUploadCourtFeeBtn: boolean = false;
  public isPrimaryColorUploadCourtFeeBtn: boolean = true;

  @Input() caseGroupDto!: LitigationCaseGroupDto[];
  @Input() mode!: TMode | null;
  @Input() editCourtLevel!: LitigationCaseDto.CourtLevelEnum | null;
  @Input() suitLitigationCaseId!: number | null;
  @Input() litigationId: string = '';
  @Output() checkBannerUploadEFiling = new EventEmitter<void>();
  @Output() refreshTaskDetailWithoutRefresh = new EventEmitter<string>();
  @Output() checkBannerUploadCourtFeesReceipt = new EventEmitter<void>();

  constructor(
    private taskService: TaskService,
    private routerService: RouterService,
    private suitService: SuitService,
    private masterDataService: MasterDataService,
    private lawsuitService: LawsuitService
  ) {
    if (this.routerService.previousUrl.startsWith(MENU_ROUTE_PATH.LAWSUIT)) {
      this.mode = 'VIEW';
    }
  }

  public passEmitCheckBannerUploadCourtFeesReceipt() {
    this.checkBannerUploadEFiling.emit();
  }
  public passEmitRefreshTaskDetail(taskId: any) {
    this.taskId = taskId;
    this.refreshTaskDetailWithoutRefresh.emit(taskId);
  }

  async triggerSetNewCaseGroups() {
    await this.setupPageData();
  }

  async ngOnInit() {
    this.courtList = (await this.masterDataService.court()).court || [];
    this.taskDetail = this.taskService?.taskDetail;
    this.disputeAppealId = this.suitService.getDisputeAppealIdFromTask(this.taskDetail);
    this.isViewMode = !this.suitService.taskCodeFromTask;
    this.taskId = this.taskDetail?.id || undefined;

    if (this.mode === 'VIEW') {
      this.litigationId = this.lawsuitService.currentLitigation.litigationId || '';
    } else {
      this.litigationId = this.taskDetail.litigationId || '';
    }
    // ################ manupulate main data ###################
    await this.setupPageData();

    this.setConditionBtns();
    this.checkBannerUploadEFiling.emit();
  }

  getCourtName(value: string): string {
    const res = this.courtList.find(dto => dto.value === value);
    return !!res ? (res.name ?? '') : '';
  }

  setConditionBtns() {
    if (!this.suitService.taskCodeFromTask || !this.suitService.statusCodeFromTask) return;
    const taskCode: taskCode = this.suitService.taskCodeFromTask;
    const statusCode: statusCode | string = this.suitService.statusCodeFromTask;

    this.isShowLinkEdit = ['RECORD_OF_APPEAL', 'RECORD_OF_SUPREME_COURT'].includes(taskCode);
    this.isShowUploadCourtFeeMockBtn =
      ['RECORD_OF_APPEAL', 'RECORD_OF_SUPREME_COURT'].includes(taskCode) && statusCode === 'PENDING';
    this.isShowUploadCourtFeeBtn = taskCode === 'UPLOAD_E_FILING';
    this.isPrimaryColorUploadCourtFeeBtn = !this.suitService.updateLitigationCaseDetail;
  }

  async setupPageData() {
    const isCurrentLitigationCase = this.suitService.litigationCase.every((i: LitigationCaseGroupDto) =>
      i.cases?.every(item => item.litigationId === this.litigationId)
    );
    if (!isCurrentLitigationCase) {
      this.suitService.litigationCase =
        (await this.suitService.getLitigationCase(this.litigationId, Number(this.taskId))) || [];
    }

    this.groupByCaseList = this.suitService.litigationCase;
    /* วน grouping ข้อมูล */

    if (!this.suitService.taskCodeFromTask || !this.suitService.statusCodeFromTask) {
      for (let index in this.groupByCaseList) {
        this.groupByCaseList[index] = this.suitService.getExtendedLitigationCaseGroupDto(
          { ...this.groupByCaseList[index] },
          this.suitLitigationCaseId ?? -1
        );
      }
    } else {
      // process add updateLitigationCaseDetail to this.groupByCaseList
      if (this.suitService.updateLitigationCaseDetail) this.addUpdatedSubCaseToGroupCaseList();

      for (let index in this.groupByCaseList) {
        this.groupByCaseList[index] = this.suitService.getExtendedLitigationCaseGroupDto(
          { ...this.groupByCaseList[index] },
          this.suitLitigationCaseId ?? -1,
          this.suitService.statusCodeFromTask as statusCode,
          this.suitService.taskCodeFromTask,
          this.disputeAppealId
        );
      }
    }

    console.log(' -- groupByCaseList :: from litigationId :: ', this.litigationId, ' :: taskId :: ', this.taskId);
    console.log(' -- groupByCaseList (Extended) :: ', this.groupByCaseList);
    this.isOpenedList = new Array(this.groupByCaseList.length ?? 0).fill(true);
  }

  private addUpdatedSubCaseToGroupCaseList() {
    if (!this.suitService.updateLitigationCaseDetail) return;

    const updateSubCase = (this.suitService.updateLitigationCaseDetail.litigationCaseSubCase ?? [])[0];
    const updatedSubCaseId = updateSubCase.id;
    for (let index in this.groupByCaseList) {
      const foundCaseIndex = (this.groupByCaseList[index].cases ?? []).findIndex(
        dto => dto.id === this.suitLitigationCaseId
      );
      if (foundCaseIndex >= 0) {
        const foundSubCaseIndex = (
          (this.groupByCaseList[index].cases ?? [])[foundCaseIndex].litigationCaseSubCase ?? []
        ).findIndex(dto => dto.id === updatedSubCaseId);
        if (foundSubCaseIndex >= 0) {
          (((this.groupByCaseList ?? [])[index].cases ?? [])[foundCaseIndex].litigationCaseSubCase ?? [])[
            foundSubCaseIndex
          ] = updateSubCase;
        } else {
          ((this.groupByCaseList ?? [])[index].cases ?? [])[foundCaseIndex].litigationCaseSubCase = [
            ...(((this.groupByCaseList ?? [])[index].cases ?? [])[foundCaseIndex].litigationCaseSubCase || []),
            updateSubCase,
          ];
        }
      }
    }
  }

  async onClickEfiling(courtCaseDto: CourtCaseDto) {
    const mainCaseId = courtCaseDto?.case?.id ?? -1;
    /* get brand new subCase */
    const newCaseWithSubCase = await this.getCaseWithSubCase(mainCaseId);
    if (!newCaseWithSubCase || !this.mode || !courtCaseDto.courtLevel) return;

    // LEX2-168-169 2/17/2023 ต้อง handle appealSide เพิ่มจากการ hard-code by P'Oudy
    const hardCodeAppealSide = this.suitService.initAppealSideByTaskCode();
    newCaseWithSubCase.appealSide = hardCodeAppealSide;

    this.suitService.litigationCaseDetail = newCaseWithSubCase ?? {};

    this.navigateToEfilingForm();
  }

  private async getCaseWithSubCase(parentLgCaseId: number): Promise<LitigationCaseDto | null> {
    const isPlaintiff = this.mode === 'ADD'; /* true เป็นยื่น, false เป็นแก้*/
    if (!this.editCourtLevel) return null;

    return await this.suitService.getLitigationSubmitCourt(
      this.editCourtLevel,
      parentLgCaseId,
      isPlaintiff,
      this.taskId
    );
  }

  async processToNavigateEFilingForm(
    groupIndex: number,
    mainCaseIndex: number,
    subCaseIndex: number,
    subCase: LitigationCaseSubCaseDto,
    isFromRefLink = false
  ) {
    console.log('processToNavigateEFilingForm ::', { groupIndex, mainCaseIndex, subCaseIndex, subCase });
    console.log('groupByCaseList by groupIndex :: ', this.groupByCaseList[groupIndex]);
    const parentCase = (this.groupByCaseList[groupIndex]?.courtCaseList ?? [])[mainCaseIndex].case;
    console.log('parentCase ::', parentCase);
    const subCaseId = subCase?.id;
    if (!parentCase) return;

    if (!this.suitService.updateLitigationCaseDetail) {
      this.suitService.litigationCaseDetail = await this.suitService.getEditLitigationSubmitCourt(
        parentCase.id ?? -1,
        subCaseId ?? -1,
        this.taskId
      );
      this.suitService.litigationCaseDetail.appealSide = (this.groupByCaseList[groupIndex]?.courtCaseList ?? [])[
        mainCaseIndex
      ].appealSide; /* need this line of code. Since control case[x].appealSide from FE */
    } else {
      this.suitService.litigationCaseDetail = this.suitService.updateLitigationCaseDetail;
    }
    this.navigateToEfilingForm(isFromRefLink);
  }

  navigateToEfilingForm(isFromRefLink: boolean = false) {
    this.routerService.navigateTo('/main/task/detail/efiling-form', { isFromRefLink });
  }

  /* LEX2-182 pay-court-fee-receipt */
  navigateToReceiptForm() {
    this.routerService.navigateTo('/main/task/detail/court-fee-form');
  }

  async onClickId(
    litigationCaseDto: LitigationCaseDto | LitigationCaseSubCaseDto,
    groupIndex?: number,
    mainCaseIndex?: number,
    subCaseIndex?: number
  ) {
    if (litigationCaseDto.courtLevel === 'CIVIL') {
      console.log('onClickId modeView ::', litigationCaseDto);
      this.routerService.navigateTo('/main/task/detail/suit-indictment', {
        caseId: litigationCaseDto.id,
        litigationId: this.litigationId,
        taskId: this.taskId,
      });
    } else {
      console.log('onClickId ::', { groupIndex, mainCaseIndex, subCaseIndex, litigationCaseDto });
      if (typeof groupIndex === 'number' && typeof mainCaseIndex === 'number' && typeof subCaseIndex === 'number') {
        console.log('onClickId APPEAL OR SUPRME ::', { groupIndex, mainCaseIndex, subCaseIndex, litigationCaseDto });

        await this.processToNavigateEFilingForm(
          groupIndex,
          mainCaseIndex,
          subCaseIndex,
          litigationCaseDto as LitigationCaseSubCaseDto,
          true
        );
      }
    }
  }

  openNewTabEFillWebsite() {
    window.open(eFiling3_COJ, '_blank');
  }

  async callUploadReceipt(
    groupIndex: number,
    mainCaseIndex: number,
    subCaseIndex: number,
    subCase: LitigationCaseSubCaseDto
  ) {
    console.log('processToNavigateEFilingForm ::', { groupIndex, mainCaseIndex, subCaseIndex, subCase });
    console.log(this.groupByCaseList[groupIndex]);
    const parentCase = (this.groupByCaseList[groupIndex]?.courtCaseList ?? [])[mainCaseIndex].case;
    console.log('parentCase ::', parentCase);
    const subCaseId = subCase?.id;
    if (!parentCase) return;

    if (!this.suitService.updateLitigationCaseDetail) {
      this.suitService.litigationCaseDetail = await this.suitService.getEditLitigationSubmitCourt(
        parentCase.id ?? -1,
        subCaseId ?? -1,
        this.taskId
      );
    } else {
      this.suitService.litigationCaseDetail = this.suitService.updateLitigationCaseDetail;
    }

    this.navigateToReceiptForm();
  }

  isSubCasesContainEditable(caseDto: LitigationCaseDto | undefined) {
    if (!caseDto) return false;
    return !!this.suitService.findEditableSubCase(caseDto);
  }

  isEditableSubCase(subCase: LitigationCaseSubCaseDto, courtLevel: LitigationCaseDto.CourtLevelEnum) {
    return this.suitService.isEditableSubCaseContained(
      [subCase],
      subCase.isPlaintiff ?? false,
      courtLevel,
      this.disputeAppealId
    );
  }
}
