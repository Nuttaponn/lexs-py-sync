import { Component, OnInit } from '@angular/core';
import { ExecutionWarrantService } from '@app/modules/execution-warrant/execution-warrant.service';
import { RouterService } from '@app/shared/services/router.service';
import { LitigationWritOfExecDto } from '@lexs/lexs-client';

interface LitigationWritOfExecDtoMeta extends LitigationWritOfExecDto {
  dataSource?: any[];
}

@Component({
  selector: 'app-prepare-info',
  templateUrl: './prepare-info.component.html',
  styleUrls: ['./prepare-info.component.scss'],
})
export class PrepareInfoComponent implements OnInit {
  columnsWritOfExecDetail: string[] = ['no', 'detail', 'writOfExecDebtTotalDebt', 'writOfExecDebtAccountsDateTime'];
  columnsDetail: string[] = ['no', 'detail'];
  isOpened1 = true;
  isOpened2 = true;

  public writOfExecs: LitigationWritOfExecDtoMeta[] = [];

  constructor(
    private routerService: RouterService,
    private executionWarrantService: ExecutionWarrantService
  ) {}

  ngOnInit(): void {
    this.writOfExecs =
      this.executionWarrantService.litigationWritOfExec.writOfExecs?.map((item: LitigationWritOfExecDtoMeta) => {
        item.dataSource = [
          {
            writOfExecDebtDocumentId: item.writOfExecDebtDocumentId,
            writOfExecDebtTotalDebt: item.writOfExecDebtTotalDebt,
            writOfExecDebtType: item.writOfExecDebtType,
            writOfExecDebtAccountsDateTime: item.writOfExecDebtAccountsDateTime,
            writOfExecStatus: item.writOfExecStatus,
          },
        ];
        return item;
      }) || [];
  }

  onViewDetail(element: any) {
    this.routerService.navigateTo('/main/lawsuit/execution-warrant', {
      litigationCaseId: element.litigationCaseId,
      writOfExecDebtType: element.writOfExecDebtType,
      isPreparingTab: true,
    });
  }
}
