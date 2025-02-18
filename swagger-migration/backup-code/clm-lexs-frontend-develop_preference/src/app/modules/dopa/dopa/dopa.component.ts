import { Component, OnDestroy, OnInit } from '@angular/core';
import { MAIN_ROUTES } from '@app/shared/constant';
import { LoggerService } from '@app/shared/services/logger.service';
import { RouterService } from '@app/shared/services/router.service';
import { DopaPostRequest, DopaPostResponse, DopaTaskDto, MeLexsUserDto, Pageable } from '@lexs/lexs-client';
import { AgentResponse } from '@modules/dopa/dopa.model';
import { DopaService } from '@modules/dopa/dopa.service';
import { TranslateService } from '@ngx-translate/core';
import { LexsUserPermissionCodes } from '@shared/models/permission';
import { CommonService } from '@shared/services/common.service';
import { NotificationService } from '@shared/services/notification.service';
import { SessionService } from '@shared/services/session.service';
import { PaginatorActionConfig, PaginatorResultConfig } from '@spig/core';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-dopa',
  templateUrl: './dopa.component.html',
  styleUrls: ['./dopa.component.scss'],
})
export class DopaComponent implements OnInit, OnDestroy {
  public dopaTaskColumns: string[] = ['identificationNo', 'name', 'createdBy', 'createdDate'];
  public dopaTaskList: Array<DopaTaskDto> = [];
  public pageResultConfig: PaginatorResultConfig = { fromIndex: 0, toIndex: 0, totalElements: 0 };
  public pageActionConfig: PaginatorActionConfig = { totalPages: 0, currentPage: 1, fromPage: 1, toPage: 1 };
  public requestTime: any;
  public userId: any;
  public loading$ = this.commonService.dapaLoading$;

  private pageSize = 10;
  private currentUser: MeLexsUserDto = {};
  private subs = new SubSink();

  constructor(
    private dopaService: DopaService,
    private notificationService: NotificationService,
    private sessionService: SessionService,
    private translateService: TranslateService,
    private commonService: CommonService,
    private routerService: RouterService,
    private logger: LoggerService
  ) {
    this.subs.add(
      this.sessionService.viewAsFetchData.subscribe(value => {
        value && this.getDopaTask();
      }),
      this.routerService.onReloadUrl.subscribe(value => {
        if (value === MAIN_ROUTES.DOPA) this.ngOnInit();
      })
    );
  }

  ngOnInit(): void {
    this.getDopaTask();
    this.currentUser = this.sessionService.currentUser as MeLexsUserDto;
    this.userId = this.currentUser?.userId;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  async getDopaTask(currentPage = 1) {
    const pageConfig: Pageable = {
      pageNumber: currentPage,
      pageSize: this.pageSize,
    };
    const res = await this.dopaService.getDopaTask(pageConfig);
    this.requestTime = res?.requestTime;
    if (res) {
      this.dopaTaskList = res.data?.content ? res.data?.content : [];
      this.pageActionConfig = {
        totalPages: res.data?.totalPages,
        currentPage: currentPage,
      };
      this.pageResultConfig = {
        fromIndex: (currentPage - 1) * this.pageSize + 1,
        toIndex: currentPage === res.data?.totalPages ? res.data?.totalElements : currentPage * this.pageSize,
        totalElements: res.data?.totalElements,
      };
    } else {
      this.dopaTaskList = [];
    }
  }

  pageEvent(pageNumber: number) {
    this.getDopaTask(pageNumber);
  }

  async updateDOPA() {
    let agentResponse: AgentResponse;
    try {
      agentResponse = await this.dopaService.getAgentResponse(this.userId);
    } catch (error) {
      agentResponse = {};
      this.logger.catchError('DOPA GET Agent Response :: ', error);
    }

    if (agentResponse.responseCode === '00000') {
      let dopaRequest: DopaPostRequest = {
        cid: agentResponse.ktbCID,
        pid: agentResponse.ktbPID,
        requestTime: this.requestTime,
        token: agentResponse.ktbKeyT,
      };
      let dopaReponse: DopaPostResponse = await this.dopaService.updateDopaTask(dopaRequest);
      if (dopaReponse.successCount || dopaReponse.successCount === 0) {
        this.notificationService.openSnackbarSuccess(
          this.translateService.instant('DOPA.UPDATE_MESSAGE_COMPLETED', { COUNT_NUMBER: dopaReponse.successCount })
        );
      }
    } else {
      this.notificationService.openSnackbarError(this.translateService.instant('DOPA.UPDATE_MESSAGE_FAIL'));
    }
    if (!this.dopaTaskList || this.dopaTaskList.length === 0) {
      this.notificationService.alertDialog('DOPA.UPDATE_TITLE_TASK_NOTFOUND', 'DOPA.UPDATE_MESSAGE_TASK_NOTFOUND');
    }
  }

  get canUpdateDOPA(): boolean {
    if (this.currentUser?.subRoleCode === 'VIEWER') {
      return false;
    }

    return this.currentUser?.permissions?.includes(LexsUserPermissionCodes.UPDATE_DOPA) || false;
  }
}
