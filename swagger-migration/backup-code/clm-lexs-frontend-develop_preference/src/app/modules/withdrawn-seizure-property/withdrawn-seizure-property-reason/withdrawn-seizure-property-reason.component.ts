import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { taskCode } from '@app/shared/models';
import { SessionService } from '@app/shared/services/session.service';
import { LitigationCaseShortDto } from '@lexs/lexs-client';
import { TaskService } from '@modules/task/services/task.service';
import { WithdrawnSeizurePropertyService } from '@modules/withdrawn-seizure-property/withdrawn-seizure-property.service';
import { MENU_ROUTE_PATH } from '@shared/constant';
import { LitigationCaseService } from '@shared/services/litigation-case.service';
import { RouterService } from '@shared/services/router.service';

@Component({
  selector: 'app-withdrawn-seizure-property-reason',
  templateUrl: './withdrawn-seizure-property-reason.component.html',
  styleUrls: ['./withdrawn-seizure-property-reason.component.scss'],
})
export class WithdrawnSeizurePropertyReasonComponent implements OnInit {
  public WITHDRAWN_SEIZURE_PROPERTY = 'TITLE_MSG.TITLE_WITHDRAWN';
  public caseDetailTitle = 'TITLE_MSG.LAWSUIT_DETAIL';
  public messageBanner = 'ระบุเหตุผลที่ต้องการถอนการยึดทรัพย์ แล้วกดดำเนินการต่อไป';
  public litigationCaseShortDetail!: LitigationCaseShortDto;
  public taskCode!: taskCode | string;
  public detailForm!: UntypedFormGroup;
  public messageReturnBaner = `กรุณาตรวจสอบและอัปเดตข้อมูลการถอนยึดทรัพย์ และกด “เสร็จสิ้น” เพื่อดำเนินการต่อ<br>เหตุผลในการขอแก้ไข: `;
  public returnReason = '';

  public accessPermissions = this.sessionService.accessPermissions();
  public hasSubmitPermission = false;
  public isEditor = false;

  constructor(
    private litigationCaseService: LitigationCaseService,
    private taskService: TaskService,
    private routerService: RouterService,
    public withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.litigationCaseShortDetail = this.litigationCaseService.litigationCaseShortDetail;
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    const data = this.withdrawnSeizurePropertyService.withdrawSeizureResponse;
    this.returnReason = this.withdrawnSeizurePropertyService?.withdrawSeizureResponse?.rejectReason || '';
    this.detailForm = this.withdrawnSeizurePropertyService.getWithdrawnSeizureDetailForm(data);
  }

  initPermission() {
    this.accessPermissions = this.sessionService.accessPermissions();
    this.isEditor = ['APPROVER', 'MAKER'].includes(this.accessPermissions.subRoleCode);
    this.hasSubmitPermission = this.sessionService.hasPermissionByTaskCode(this.taskCode as taskCode);
  }

  get mode() {
    // set mode VIEW / EDIT with condition routing from which menu
    if (
      this.routerService.previousUrl.startsWith(MENU_ROUTE_PATH.TASK) ||
      this.routerService.previousUrl.startsWith(MENU_ROUTE_PATH.LAWSUIT)
    ) {
      // form task menu
      return 'EDIT';
    } else {
      // form litigation menu or other conditions
      return 'VIEW';
    }
  }
}
