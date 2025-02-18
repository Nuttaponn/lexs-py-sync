import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { WITHDRAWN_REASON_OPTION } from '@app/shared/constant/withdraw-reasons.constant';
import { Mode } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { coerceString } from '@app/shared/utils';
import { getOption } from '@app/shared/utils/get-option';
import { SeizureInfo, SeizureLedsInfo, WithdrawSeizureLedAllResponse, WithdrawSeizureLedDto } from '@lexs/lexs-client';
import { SeizurePropertyInfoService } from '../seizure-property-info.service';
import { SEIZURE_LED_TYPE } from '@app/shared/constant';
import { SeizureSupportTypeEnum } from '@app/modules/seizure-property/models';

@Component({
  selector: 'app-processing-info',
  templateUrl: './processing-info.component.html',
  styleUrls: ['./processing-info.component.scss'],
})
export class ProcessingInfoComponent implements OnInit {
  public isOpened1 = true;
  public isOpened2 = true;
  public allCases: ISeizureCase[] = [];
  public litigationId = '';
  public columns: string[] = ['order', 'text01', 'text11', 'text02', 'text03', 'text04', 'text05', 'text06'];

  constructor(
    private routerService: RouterService,
    private seizureProp: SeizurePropertyInfoService,
    private lawsuiteService: LawsuitService
  ) {}

  async ngOnInit() {
    await this.getSeizureExecutionCases();
  }

  async getSeizureExecution() {
    const litigationId = coerceString(this.lawsuiteService.currentLitigation.litigationId);
    const resp = await this.seizureProp.getSeizureExecution(litigationId);
    const litigationCases = resp.litigationCases || [];

    /** logic for sorting Legal Execution */
    let dataSort: SeizureLedsInfo[] = [];
    resp.litigationCases = litigationCases.map(item => {
      item.seizures = item.seizures?.map(i => {
        if (i.seizureLeds && i.seizureLeds.length > 0) {
          const _seizureLedTypes = SEIZURE_LED_TYPE as string[];
          const sortOfDepartment = i.seizureLeds.sort((a, b) => {
            return a.seizureLedType && b.seizureLedType
              ? _seizureLedTypes.indexOf(a.seizureLedType) - _seizureLedTypes.indexOf(b.seizureLedType)
              : 0;
          });
          let sortMain = sortOfDepartment
            .filter(item => item.seizureLedType === _seizureLedTypes[0] || item.seizureLedType === _seizureLedTypes[1])
            .sort((a, b) => {
              return this.sortLocalByLedName(a, b);
            });
          let sortInter = sortOfDepartment
            .filter(item => item.seizureLedType === _seizureLedTypes[2] || item.seizureLedType === _seizureLedTypes[3])
            .sort((a, b) => {
              return this.sortLocalByLedName(a, b);
            });
          dataSort = [...sortMain, ...sortInter];
        }
        i.seizureLeds = dataSort;
        return i;
      });
      return item;
    });

    return resp;
  }

  sortLocalByLedName(_a: SeizureLedsInfo, _b: SeizureLedsInfo) {
    if (_a.ledName && _b.ledName) {
      const namea = _a.ledName.replace('สำนักงานบังคับคดีแพ่ง', '');
      const nameb = _b.ledName.replace('สำนักงานบังคับคดีแพ่ง', '');
      return namea.localeCompare(nameb, 'th');
    } else {
      return 0;
    }
  }

  getWithdrawalExecution() {
    const litigationId = coerceString(this.lawsuiteService.currentLitigation.litigationId);
    return this.seizureProp.getWithdrawalExecution(litigationId);
  }

  onViewDetail(caseInfo: ISeizureCase, seizure: any) {
    const litigationId = coerceString(this.litigationId, '');
    const seizureId = coerceString(seizure.seizureId, '');
    const litigationCaseId = coerceString(caseInfo.litigationCaseId, '');
    const mode = Mode.VIEW;
    const index = caseInfo.caseIndex;

    const destination =
      seizure.seizureType === 'NCOL' ? '/main/lawsuit/seizure-property' : '/main/lawsuit/seizure-property';

    return this.routerService.navigateTo(destination, {
      litigationId,
      litigationCaseId,
      seizureId,
      mode,
      index,
      supportType: seizure.seizureType === 'NCOL' ? SeizureSupportTypeEnum.NON_MORTGAGE : '',
    });
  }

  onViewNonPledge(caseInfo: ISeizureCase, seizure: SeizureInfo) {
    // TODO: pallop https://ktbinnovation.atlassian.net/browse/LEX2-27592
    // this.setDataSeizure(details);
    return this.routerService.navigateTo(`/main/lawsuit/seizure-property/non-pledge`, {
      litigationId: this.litigationId,
      litigationCaseId: caseInfo.litigationCaseId,
      seizureId: seizure.seizureId || '',
      createdTimestamp: seizure.createdTimestamp,
      hidelawyer: true,
      mode: 'VIEW',
    });
  }

  async getSeizureExecutionCases() {
    // Get both Current execution and widthdraw execution
    const resp = await Promise.all([this.getSeizureExecution(), this.getWithdrawalExecution()]);
    // Reset old cases
    this.allCases = [];
    const [active, deactive] = resp;
    // Update litigation Id
    this.litigationId = active.litigationId || deactive.litigationId || '';
    const count = active.litigationCases?.length || deactive.litigationCases?.length || 0;
    const litigationCases = active?.litigationCases || [];
    const withdrawLitigationCase = deactive?.litigationCases || [];
    // Combind active and cancalled cases in same litigation case id
    for (let i = 0; i < count; i++) {
      let activeRow = null;
      let deactiveRow = null;
      let row: ISeizureCase = {
        caseIndex: i + 1,
        expanded: i === 0,
        litigationCaseId: 0,
        courtBlackCaseNo: '',
        courtRedCaseNo: '',
        litigationCaseCollateralsCount: 0,
        seizures: [],
        withdrawSeizure: [],
      };

      if (litigationCases.length) {
        let litigationCaseId = coerceNumberProperty(litigationCases[i].litigationCaseId);
        activeRow = litigationCases.find(it => it.litigationCaseId === litigationCaseId);
      }

      if (withdrawLitigationCase.length) {
        let litigationCaseId_1 = withdrawLitigationCase[i].litigationCaseId || 0;
        deactiveRow = withdrawLitigationCase.find(it_1 => it_1.litigationCaseId === litigationCaseId_1);
      }

      if (activeRow || deactiveRow) {
        row.litigationCaseId = activeRow?.litigationCaseId || deactiveRow?.litigationCaseId || 0;
      }

      if (activeRow) {
        row.seizures = activeRow.seizures || [];
        row.courtBlackCaseNo = coerceString(activeRow.courtBlackCaseNo);
        row.courtRedCaseNo = coerceString(activeRow.courtRedCaseNo);
      }

      if (deactiveRow) {
        row.withdrawSeizure = (deactiveRow.withdrawSeizure || []).map((it_2, index) =>
          this._mapWithdrawSeizure(index, it_2)
        );
        row.courtBlackCaseNo = coerceString(deactiveRow.courtBlackCaseNo);
        row.courtRedCaseNo = coerceString(deactiveRow.courtRedCaseNo);
      }

      this.allCases.push(row);
    }
    this.allCases.forEach(it => {
      it.withdrawSeizure = it.withdrawSeizure.sort((a: any, b: any) => b.index - a.index);
    });
  }

  private _mapWithdrawSeizure(index: number, item: WithdrawSeizureLedAllResponse): WithdrawSeizure {
    const row: WithdrawSeizure = {
      index: index + 1,
      totalCollateral: 0,
      totalContacts: 0,
      withdrawTimeStamp: '',
      withdrawReason: [],
      withdrawSeizureLeds: [],
    };

    // Map Reason Table
    const reasonText = getOption(coerceString(item.reasonWithdrawSeizures), WITHDRAWN_REASON_OPTION)?.text;
    row.withdrawReason = [
      {
        reason: coerceString(reasonText),
        debtPaidAmount: coerceNumberProperty(item.debtPaidAmount),
        contact: coerceString(item.actorId) + '-' + coerceString(item.actorName),
      },
    ];

    // Count Total Contact and Collateral of each record
    if (item.reasonWithdrawSeizures?.length) {
      row.withdrawSeizureLeds = (item.withdrawSeizureLeds || []).map(row => {
        const collaterals = row.withdrawSeizureLedGroups
          ? row.withdrawSeizureLedGroups.flatMap(s => s.collaterals)
          : [];
        const contacts = row.withdrawSeizureLedGroups ? row.withdrawSeizureLedGroups.flatMap(t => t.contacts) : [];
        const status = row.status?.endsWith('COMPLETE') ? row.status : 'PENDING';
        const fullLawyerName = row.publicAuctionLawyerId
          ? row.publicAuctionLawyerId + '-' + row.publicAuctionLawyerName
          : '-';
        const withdrawSeizureId = coerceNumberProperty(item.withdrawSeizureId);

        return {
          ...row,
          withdrawSeizureId: withdrawSeizureId,
          publicAuctionLawyerName: fullLawyerName,
          totalCollaterals: collaterals.length,
          totalContacts: contacts.length,
          status: status,
          taskCode: row.status?.split('_')[0] || '',
        };
      });
    }

    // Map Timestamp
    if (item.createdTimestamp) {
      row.withdrawTimeStamp = coerceString(item.createdTimestamp, '');
    }

    // Count Total Contact and Collateral
    if (item.withdrawSeizureLeds?.length) {
      let totalContacts = 0;
      let totalCollaterals = 0;

      for (let i of item.withdrawSeizureLeds) {
        for (let j of i.withdrawSeizureLedGroups || []) {
          totalCollaterals += j.collaterals?.length || 0;
          totalContacts += j.contacts?.length || 0;
        }
      }

      row.totalCollateral = totalCollaterals;
      row.totalContacts = totalContacts;
    }

    return row;
  }

  onViewWidthdrawSeizureLed(caseInfo: ISeizureCase, element: IWithdrawSeizureLedDto) {
    const litigationId = coerceString(this.litigationId, '');
    const litigationCaseId = coerceString(caseInfo.litigationCaseId, '');
    const withdrawSeizuresLedId = coerceString(element.withdrawSeizureLedId, '');
    const withdrawSeizureId = coerceString(element.withdrawSeizureId, '');
    const mode = Mode.VIEW;

    this.routerService.navigateTo('/main/lawsuit/withdrawn-seizure-property', {
      mode,
      litigationId,
      litigationCaseId,
      withdrawSeizureId,
      withdrawSeizuresLedId,
    });
  }

  filterSeizure(items: any[], type: 'COL' | 'NCOL') {
    return items.filter((it: any) => it.seizureType === type);
  }
}

interface ISeizureCase {
  caseIndex: number;
  courtBlackCaseNo: string;
  courtRedCaseNo: string;
  litigationCaseCollateralsCount: number;
  litigationCaseId: number;
  expanded: boolean;
  seizures: Array<SeizureInfo>;
  withdrawSeizure: Array<WithdrawSeizure>;
}

interface WithdrawSeizure {
  index: number;
  totalCollateral: number;
  totalContacts: number;
  withdrawTimeStamp: string;
  withdrawReason: Array<IWithdrawReason>;
  withdrawSeizureLeds: Array<IWithdrawSeizureLedDto>;
}

interface IWithdrawReason {
  reason: string;
  debtPaidAmount: number;
  contact: string;
}

interface IWithdrawSeizureLedDto extends WithdrawSeizureLedDto {
  totalContacts: number;
  totalCollaterals: number;
  withdrawSeizureId: number;
}
