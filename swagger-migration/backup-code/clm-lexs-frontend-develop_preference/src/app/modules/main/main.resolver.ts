import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { SearchControllerService } from '@app/shared/components/search-controller/search-controller.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { AdvanceSearchOption } from '@shared/components/search-controller/search-controller.model';
import { MasterDataService } from '@shared/services/master-data.service';

@Injectable({
  providedIn: 'root',
})
export class MainResolver {
  constructor(
    private masterDataService: MasterDataService,
    private searchControllerService: SearchControllerService,
    private logger: LoggerService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<boolean> {
    this.logger.logResolverStart('MainResolver');
    await this.getAdvanceSearchOptions();
    this.searchControllerService.initOptionsList();
    this.logger.logResolverEnd('MainResolver');
    return true;
  }

  async getAdvanceSearchOptions() {
    const response = await Promise.all([
      this.masterDataService.ktbOrg(),
      this.masterDataService.amdOrg(),
      this.masterDataService.customerStatus(),
      this.masterDataService.scope(),
      this.masterDataService.loanType(),
      this.masterDataService.debtor(),
      this.masterDataService.samFlag(),
      this.masterDataService.tamcFlag(),
      this.masterDataService.writeOffStatus(),
      this.masterDataService.debtTransferTo(),
      this.masterDataService.caseCreator(),
      this.masterDataService.court(),
      this.masterDataService.legalStatus(),
      this.masterDataService.litigationCloseStatus(),
      this.masterDataService.doneBy(),
      this.masterDataService.taskType(),
      this.masterDataService.taskStatus(),
      this.masterDataService.bcOrg(),
    ]);
    const result: AdvanceSearchOption = {
      ktbOrg: response[0],
      amdOrg: response[1],
      customerStatus: response[2],
      scope: response[3],
      loanType: response[4],
      debtor: response[5],
      samFlag: response[6],
      tamcFlag: response[7],
      writeOffStatus: response[8],
      debtTransferTo: response[9],
      caseCreator: response[10],
      court: response[11],
      legalStatus: response[12],
      litigationCloseStatus: response[13],
      doneBy: response[14],
      taskType: response[15],
      taskStatus: response[16],
      bcOrg: response[17],
    };
    this.masterDataService.advanceOptions = { ...result };
  }
}
