import { Component, OnInit } from '@angular/core';
import { TaskService } from '@app/modules/task/services/task.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { CourtTrialDetailDto, CourtTrialDto } from '@lexs/lexs-client';
import { LawsuitService } from '@modules/lawsuit/lawsuit.service';
import { DialogOptions } from '@spig/core';
import { TrialDialogSaveDetailComponent } from './trial-dialog-save-detail/trial-dialog-save-detail.component';
import { TrialService } from './trial.service';
@Component({
  selector: 'app-trial',
  templateUrl: './trial.component.html',
  styleUrls: ['./trial.component.scss'],
})
export class TrialComponent implements OnInit {
  public taskId!: number | undefined;

  public trialColumn: string[] = ['no', 'hearingDate', 'hearingType', 'court', 'note', 'status', 'source', 'command'];
  public trialColumnNotActionable: string[] = ['no', 'hearingDate', 'hearingType', 'court', 'note', 'status', 'source'];
  public trialColumnDataNotFound!: string[];
  public isOpenedList: boolean[] = [];
  public groupByCaseList: string[] = [];
  public litigationCaseIdFromTask!: number;
  public saveStatus: CourtTrialDetailDto.SaveStatusEnum = CourtTrialDetailDto.SaveStatusEnum.Save;
  public courtLevelEnum = CourtTrialDto.CourtLevelEnum;
  constructor(
    private notificationService: NotificationService,
    private trialService: TrialService,
    private lawsuitService: LawsuitService,
    private taskService: TaskService
  ) {}

  public trialObj!: CourtTrialDto[];
  async ngOnInit(): Promise<void> {
    this.taskId = this.taskService.taskDetail.id || undefined;
    this.litigationCaseIdFromTask = Number(this.taskService.taskDetail.litigationCaseId);
    let litigationId = this.lawsuitService.currentLitigation.litigationId || '';
    this.trialObj = await this.trialService.getCourtTrial(litigationId, this.taskId);
    this.trialService.trial = this.trialObj;

    this.isOpenedList = new Array(this.trialObj.length).fill(true);
    this.trialService.hasEdit = false;
  }

  async onSaveTrialDetail(
    isViewMode: boolean,
    isEdit: boolean,
    isNewRecord: boolean,
    courtLevel: string | undefined,
    courtDetailObjtect: CourtTrialDetailDto | any,
    indexCourt: number,
    indexCourtDetail?: number | any,
    taskId?: number | undefined,
    lawyerName?: string | undefined,
    courtObject?: CourtTrialDto
  ) {
    let IndexCourtDetail = indexCourtDetail || 0;
    let CourtDetailObjtect = !isNewRecord ? courtDetailObjtect[IndexCourtDetail] : null;
    let litigationCaseId = courtObject?.litigationCaseId;
    let rowData = {
      isViewMode,
      isEdit,
      isNewRecord,
      courtLevel,
      indexCourt,
      indexCourtDetail,
      ...CourtDetailObjtect,
      taskId,
      lawyerName,
      litigationCaseId,
    };
    const trialDialog: DialogOptions = {
      component: TrialDialogSaveDetailComponent,
      title: 'บันทึกวันนัดพิจารณาคดี',
      iconName: 'icon-Note-Edit',
      rightButtonLabel: isViewMode ? 'COMMON.BUTTON_ACKNOWLEDGE' : 'COMMON.BUTTON_SAVE',
      buttonIconName: isViewMode ? 'icon-Selected' : 'icon-save-primary',
      leftButtonLabel: isViewMode ? undefined : 'COMMON.BUTTON_CANCEL',
      autoWidth: true,
      context: rowData,
    };
    await this.notificationService.showCustomDialog(trialDialog);
  }

  isActionable(litigationCaseId: number | undefined, taskCompleted: boolean | undefined) {
    if (this.taskId) {
      this.trialColumnDataNotFound =
        litigationCaseId === this.litigationCaseIdFromTask && taskCompleted !== true
          ? this.trialColumn
          : this.trialColumnNotActionable;
      return litigationCaseId === this.litigationCaseIdFromTask && taskCompleted !== true
        ? this.trialColumn
        : this.trialColumnNotActionable;
    } else {
      this.trialColumnDataNotFound = taskCompleted === true ? this.trialColumn : this.trialColumnNotActionable;
      return taskCompleted === true ? this.trialColumn : this.trialColumnNotActionable;
    }
  }

  splitSource(source: string, index: number) {
    let splitStr = source.split(' ');
    switch (index) {
      case 1:
        return splitStr[0] + ' ' + splitStr[1] || '-';
      case 2:
        return splitStr[2] || '-';
      default:
        return source;
    }
  }
}
