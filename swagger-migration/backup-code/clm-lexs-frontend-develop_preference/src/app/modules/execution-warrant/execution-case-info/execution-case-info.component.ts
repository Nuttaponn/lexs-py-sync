import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CourtService } from '@app/modules/court/court.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { TMode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { SessionService } from '@app/shared/services/session.service';
import { CourtResultDto, LitigationCaseShortDto } from '@lexs/lexs-client';
import { ExecutionWarrantService } from '../execution-warrant.service';

@Component({
  selector: 'app-execution-case-info',
  templateUrl: './execution-case-info.component.html',
  styleUrls: ['./execution-case-info.component.scss'],
})
export class ExecutionCaseInfoComponent implements OnInit {
  public litigationCaseShortDetail!: LitigationCaseShortDto;
  public courtResult!: CourtResultDto[];

  public litigationCaseId!: string;
  public taskCode!: taskCode;
  public fromMenu!: string;
  public mode!: TMode;

  public dataLawyerForm!: UntypedFormGroup;
  public hasSubmitPermission = false;

  constructor(
    private litigationCaseService: LitigationCaseService,
    private taskService: TaskService,
    private courtService: CourtService,
    private executionWarrantService: ExecutionWarrantService,
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'];
      if (this.mode === 'VIEW') this.litigationCaseId = params['litigationCaseId'];
    });
  }

  ngOnInit(): void {
    // Initail data
    if (this.mode !== 'VIEW') {
      this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
      this.hasSubmitPermission = this.sessionService.hasPermissionByTaskCode(this.taskCode);
      this.litigationCaseId = this.taskService.taskDetail.litigationCaseId || '';
    }
    this.dataLawyerForm = this.executionWarrantService.lawyerForm;
    this.litigationCaseShortDetail = this.litigationCaseService.litigationCaseShortDetail;
    this.courtResult = this.courtService.courtResult;
  }
}
