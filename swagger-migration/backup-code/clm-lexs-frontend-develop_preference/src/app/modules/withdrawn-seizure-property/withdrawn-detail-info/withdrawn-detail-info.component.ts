import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { TMode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LitigationCaseShortDto, WithdrawSeizureLedAllResponse, WithdrawSeizureResponse } from '@lexs/lexs-client';
import { WithdrawnSeizurePropertyService } from '../withdrawn-seizure-property.service';

@Component({
  selector: 'app-withdrawn-detail-info',
  templateUrl: './withdrawn-detail-info.component.html',
  styleUrls: ['./withdrawn-detail-info.component.scss'],
})
export class WithdrawnDetailInfoComponent implements OnInit {
  public litigationCaseShortDetail!: LitigationCaseShortDto;
  public taskCode!: taskCode;
  public mode!: TMode;
  public dataLawyerForm!: UntypedFormGroup;
  public detailForm!: UntypedFormGroup;
  public withdrawSeizureResponse!: WithdrawSeizureResponse;
  public withdrawSeizureLedAllResponse!: WithdrawSeizureLedAllResponse;

  public isMakerAwaitingTask: boolean = false;
  public isApproveOrReject: boolean = false;
  public isShowResponsibleLawyerInfo: boolean = false;

  constructor(
    private litigationCaseService: LitigationCaseService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService
  ) {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'];
    });
  }

  ngOnInit(): void {
    this.litigationCaseShortDetail = this.litigationCaseService.litigationCaseShortDetail;
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    if (this.taskCode === taskCode.R2E06_05_E) {
      this.mode = 'VIEW';
    }
    this.dataLawyerForm = this.withdrawnSeizurePropertyService.lawyerForm;
    const data = this.withdrawnSeizurePropertyService.withdrawSeizureResponse;
    this.withdrawSeizureResponse = this.withdrawnSeizurePropertyService.withdrawSeizureResponse;
    this.withdrawSeizureLedAllResponse = this.withdrawnSeizurePropertyService.withdrawSeizureLedAllResponse;
    this.initPermission();
    this.detailForm = this.withdrawnSeizurePropertyService.getWithdrawnSeizureDetailForm(data);
  }

  initPermission() {
    this.isMakerAwaitingTask =
      this.taskCode === taskCode.R2E06_01_A && this.taskService?.taskDetail?.statusCode === 'AWAITING';
    this.isApproveOrReject = !!(
      (this.withdrawSeizureResponse.isApproved && this.mode === 'VIEW_PENDING') ||
      (!this.withdrawSeizureResponse.isApproved &&
        this.withdrawSeizureResponse?.rejectReason &&
        this.mode === 'VIEW_PENDING')
    );
    this.isShowResponsibleLawyerInfo = [taskCode.R2E06_05_E].includes(
      this.withdrawSeizureLedAllResponse?.withdrawSeizureLed?.status?.split('_')[0] as taskCode
    );
  }
}
