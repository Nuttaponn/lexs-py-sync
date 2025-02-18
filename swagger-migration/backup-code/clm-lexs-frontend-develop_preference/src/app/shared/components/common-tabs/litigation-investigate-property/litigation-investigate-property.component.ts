import { Component, OnInit } from '@angular/core';
import { AssetInvestigationLitigationCase, LitigationCaseGroupDto, TaskDetailDto } from '@lexs/lexs-client';
import { LexsUserPermissionCodes, TMode } from '@shared/models';
import { TaskService } from '@modules/task/services/task.service';
import { RouterService } from '@shared/services/router.service';
import { SuitService } from '@modules/lawsuit/lawsuit-detail/suit/suit.service';
import { LawsuitService } from '@modules/lawsuit/lawsuit.service';
import { COURT_FEE_STATUS, LAWSUIT_ROUTES } from '../../../constant';
import { LitigationInvestigatePropertyService } from './litigation-investigate-property.service';
import { InvestigatePropertyService } from '@app/modules/investigate-property/investigate-property.service';
import { SessionService } from '@app/shared/services/session.service';

@Component({
  selector: 'app-litigation-investigate-property',
  templateUrl: './litigation-investigate-property.component.html',
  styleUrls: ['./litigation-investigate-property.component.scss'],
})
export class LitigationInvestigatePropertyComponent implements OnInit {
  public isViewMode: boolean = true;
  public taskDetail: TaskDetailDto = {};
  public caseList: Array<AssetInvestigationLitigationCase> = [];
  public isOpenedList: boolean[] = [];
  public displayedColumns: string[] = [
    'referenceNo',
    'investigate',
    'orderDate',
    'revDate',
    'reason',
    'defAmount',
    'found',
    'status',
  ];
  public caseGroupDto!: LitigationCaseGroupDto[];
  public mode!: TMode | null;
  public suitLitigationCaseId!: number | null;
  public AssetInvetigationStatus = {
    PENDING: 'PENDING',
    IN_PROCESS: 'IN_PROCESS',
    COMPLETE: 'COMPLETE',
    CANCEL: 'CANCEL',
  };
  private litigationId =
    this.lawsuitService.currentLitigation.litigationId || this.taskService.taskDetail.litigationId || '';

  get canOrderInvestigate() {
    return !this.isViewMode && this.sessionService.hasPermission(LexsUserPermissionCodes.ORDER_INVESTIGATION_ASSET);
  }
  constructor(
    private taskService: TaskService,
    private routerService: RouterService,
    private suitService: SuitService,
    private lawsuitService: LawsuitService,
    private litigationInvestigatePropertyService: LitigationInvestigatePropertyService,
    private investigatePropertyService: InvestigatePropertyService,
    private sessionService: SessionService
  ) {}

  async ngOnInit(): Promise<void> {
    this.taskDetail = this.taskService?.taskDetail;
    this.isViewMode = !this.suitService.taskCodeFromTask;
    if (this.sessionService.hasPermission(LexsUserPermissionCodes.ALL_INVESTIGATION_ASSET)) {
      const apiData = await this.litigationInvestigatePropertyService.getAssetInvestigationLitigationCase(
        this.litigationId
      );
      if (apiData.viewMode) {
        this.isViewMode = apiData.viewMode;
      } else {
        this.isViewMode = false;
      }

      this.caseList = apiData?.litigationCases || [];
      this.isOpenedList = new Array(this.caseList.length ?? 0).fill(true);
    } else {
      this.caseList = [];
    }
  }

  async onClickInvestigateProperty(element: any) {
    const validateResponse = await this.litigationInvestigatePropertyService.getAssetInvestigationCreateInfo(
      Number(element.litigationCaseId)
    );
    this.investigatePropertyService.assetInvestigationCreateInfo = validateResponse;
    this.routerService.navigateTo(LAWSUIT_ROUTES.INVESTIGATES_PROPERTY, {
      litigationId: this.litigationId,
      litigationCaseId: element.litigationCaseId,
      mode: 'ADD',
      isOnRequest: true,
      litigationCaseSeqNo: element.litigationCaseSeqNo,
    });
  }

  viewAssetInvestigationRound(element: any, litigationCaseSeqNo?: number, litigationCaseId?: number) {
    this.routerService.navigateTo(LAWSUIT_ROUTES.INVESTIGATES_PROPERTY, {
      litigationId: this.litigationId,
      litigationCaseId: litigationCaseId,
      mode: 'VIEW',
      assetInvestigationId: element.assetInvestigationId,
      litigationCaseSeqNo: litigationCaseSeqNo,
    });
  }

  protected readonly COURT_FEE_STATUS = COURT_FEE_STATUS;
}
