import { Component, OnInit } from '@angular/core';
import { ExecutionWarrantService } from '@app/modules/execution-warrant/execution-warrant.service';
import { WithdrawnWritExecutionService } from '@app/modules/withdrawn-writ-execution/withdrawn-writ-execution.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  LitigationWritOfExecDto,
  WithdrawExecutionValidateRequest,
  WithdrawWritOfExecByLitigationResponse,
  WithdrawWritOfExecResponse,
} from '@lexs/lexs-client';

@Component({
  selector: 'app-warrant-info',
  templateUrl: './warrant-info.component.html',
  styleUrls: ['./warrant-info.component.scss'],
})
export class WarrantInfoComponent implements OnInit {
  columnsDetail: string[] = ['no', 'detail', 'writOfExecDebtTotalDebt', 'writOfExecDebtAccountsDateTime'];
  isOpened1 = true;
  isOpened2 = true;

  public columnsRequestWithdrawnExecution: string[] = [
    'no',
    'withdrawWritOfExecDatetime',
    'withdrawWritOfExecReason',
    'initBy',
    'approval',
    'publicAuctionLawyerName',
    'withdrawWritOfExecResult',
  ];

  public writOfExecs: LitigationWritOfExecDto[] = this.executionWarrantService.litigationWritOfExec.writOfExecs || [];
  public writOfExecDataSoure: LitigationWritOfExecDto[] = [];
  public withdrawWritOfExecByLitigationResponse: WithdrawWritOfExecByLitigationResponse =
    this.executionWarrantService.withdrawWritOfExecByLitigationResponse || {};

  constructor(
    private routerService: RouterService,
    private executionWarrantService: ExecutionWarrantService,
    private sessionService: SessionService,
    private withdrawnWritExecutionService: WithdrawnWritExecutionService
  ) {}

  getStatusCompltedRecord(index: number) {
    const powerOfAttorney = !!this.writOfExecs[index].powerOfAttorneyDocumentId ? 1 : 0;
    const warrantExecution =
      this.writOfExecs[index].writOfExecSubmissions?.filter(item => !!item.submissionId).length || 0;
    return powerOfAttorney + warrantExecution || 0;
  }

  ngOnInit(): void {
    console.log('ngOnInit WarrantInfoComponent ', this.writOfExecs);
    if (this.writOfExecs && this.writOfExecs.length > 0) {
      this.writOfExecDataSoure = JSON.parse(JSON.stringify(this.writOfExecs));
      this.writOfExecs.forEach((item, index) => {
        if (item.writOfExecSubmissions?.length && item.writOfExecSubmissions.length === 0) {
          if (item.writOfExecStatus?.includes('R2E04-03') || item.writOfExecStatus?.includes('COMPLETE')) {
            this.writOfExecDataSoure[index] = {
              ...item,
              writOfExecSubmissions: [
                {
                  documentId: item.powerOfAttorneyDocumentId,
                  submitDate: item.powerOfAttorneySubmitDate,
                  respondDate: item.powerOfAttorneyRespondDate,
                },
                { documentId: 0 },
              ],
            };
          }
        } else if (item.writOfExecSubmissions?.length && item.writOfExecSubmissions.length >= 1) {
          if (item.writOfExecStatus?.includes('R2E04-03') || item.writOfExecStatus?.includes('COMPLETE')) {
            let pendingArr;
            if (item.writOfExecSubmissions.every(i => i.documentId !== 0 && i.respondCode === 'R')) {
              pendingArr = { documentId: 0 };
            }
            const dataArry = [
              ...[
                {
                  documentId: item.powerOfAttorneyDocumentId,
                  submitDate: item.powerOfAttorneySubmitDate,
                  respondDate: item.powerOfAttorneyRespondDate,
                },
              ],
              ...item.writOfExecSubmissions,
            ];

            !!pendingArr && dataArry.push(pendingArr);
            this.writOfExecDataSoure[index] = {
              ...item,
              writOfExecSubmissions: dataArry,
            };
          }
        }
      });
    }
  }

  getWithdrawWritOfExecList(litigationCaseId: number): WithdrawWritOfExecResponse[] {
    return (
      this.withdrawWritOfExecByLitigationResponse?.litigationCases?.find(
        obj => obj.litigationCaseId == String(litigationCaseId)
      )?.withdrawWritOfExec || []
    );
  }

  onViewDetail(element: any) {
    this.routerService.navigateTo('/main/lawsuit/execution-warrant', {
      litigationCaseId: element.litigationCaseId,
      writOfExecDebtType: element.writOfExecDebtType,
      isWarrantTab: true,
    });
  }

  async onWithdrawWritExecution(litigationWritOfExecDto: LitigationWritOfExecDto) {
    const withdrawExecutionValidateRequest: WithdrawExecutionValidateRequest = {
      litigationId: litigationWritOfExecDto.litigationId,
    };

    await this.withdrawnWritExecutionService.postValidateWithdrawWritOfExecInit(
      litigationWritOfExecDto?.litigationCaseId || 0,
      withdrawExecutionValidateRequest
    );
    this.routerService.navigateTo('/main/lawsuit/withdrawn-writ-execution', {
      isOnRequest: true,
      litigationCaseId: litigationWritOfExecDto?.litigationCaseId,
      litigationId: this.withdrawWritOfExecByLitigationResponse.litigationId,
    });
  }

  get showButtonWithdrawWritExecution() {
    const isCategoryKTB = ['KTB'].includes(this.sessionService.currentUser?.category || '');
    const userRoleCode = ['AMD_RESTRUCTURE', 'BC', 'CBC', 'ADMIN'].includes(
      this.sessionService.currentUser?.roleCode || ''
    );
    const userSubRole = ['MAKER', 'ADMIN'].includes(this.sessionService.currentUser?.subRoleCode || '');
    const userPermission = 'no-check-permission';

    return isCategoryKTB && userRoleCode && userSubRole && userPermission;
  }

  navigateToWithdrawnWritWxecution(withdrawWritOfExecId: string, litigationCaseId: number) {
    this.routerService.navigateTo('/main/lawsuit/withdrawn-writ-execution', {
      withdrawWritOfExecId: withdrawWritOfExecId,
      litigationCaseId: litigationCaseId,
      litigationId: this.withdrawWritOfExecByLitigationResponse.litigationId,
    });
  }

  statusShowWithdrawWritOfExecResult(status: string) {
    return ['R2E06-13-C_COMPLETE', 'R2E06-14-D_CREATE', 'R2E06-14-D_COMPLETE', 'R2E06-15-E_CREATE'].includes(status);
  }

  statusNotShowLawyer(status: string) {
    return ['R2E06-13-C_COMPLETE', 'R2E06-14-D_CREATE'].includes(status);
  }
}
