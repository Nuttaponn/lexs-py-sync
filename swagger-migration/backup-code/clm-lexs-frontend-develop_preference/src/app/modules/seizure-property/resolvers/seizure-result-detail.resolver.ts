import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from '@app/shared/services/notification.service';
import {
  LexsUserOption,
  LitigationCaseLedsDto,
  SeizureCollateralInfo,
  SeizureLedsInfo,
  SeizureLedsInfoResponse,
  SeizureNonEFillingInvoiceDto,
} from '@lexs/lexs-client';
import { CollateralTypeDTO } from '../models';
import { SeizurePropertyService } from '../seizure-property.service';

@Injectable({
  providedIn: 'root',
})
export class SeizureResultDetailResolver {
  constructor(
    private service: SeizurePropertyService,
    private toasService: NotificationService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const featureAuction = 'auction';
    const seizureId = route.paramMap.get('seizureId') || route.queryParamMap.get('seizureId') || '';
    const seizureLedId = route.paramMap.get('seizureLedId') || route.queryParamMap.get('seizureLedId') || '';
    const featureRequest = route.paramMap.get('featureRequest') || route.queryParamMap.get('featureRequest') || '';
    let seizureLedsInfo: SeizureLedsInfoResponse = {};
    let targetRequest: any = null;
    if (featureRequest === featureAuction) {
      targetRequest = this.service.getSeizureLedsCollateralsLedsInfoBySeizureLedId(seizureLedId);
    } else {
      targetRequest = this.service.getCollateralLEDById(seizureId);
    }

    return Promise.all([
      targetRequest,
      this.service.getCollateralTypes(),
      this.service.getLawyerOptions(),
      this.service.getExecutionOffices(seizureId),
      this.service.getReceiptInfo(seizureLedId),
    ]).then(result => {
      if (featureRequest === featureAuction) {
        const response = result[0];
        seizureLedsInfo = {
          civilCourtName: response.civilCourtName,
          civilCourtNo: response.civilCourtNo,
          seizureLedsInfoList: [response],
        };
      }

      const collateralDetail = featureRequest === featureAuction ? seizureLedsInfo : result[0];
      const collateralTypes = result[1];
      const lawyerList = result[2];
      const executionOffices = result[3];
      const seizureLedsDTO = collateralDetail.seizureLedsInfoList?.find((it: any) => it.id?.toString() == seizureLedId);
      const civilCourtName = collateralDetail.civilCourtName;
      const civilCourtNo = collateralDetail.civilCourtNo;
      const unMappedCollaterals = collateralDetail.unMappedCollaterals || [];
      const receipt = result[4] || null;

      if (!seizureLedsDTO) {
        this.toasService.openSuccessBanner("Can't find selected seizureLedId", {
          buttonText: 'COMMON.BUTTON_ACKNOWLEDGE',
          type: 'error',
        });

        throw new Error("Can't find seizureLedId");
      }

      return <ISeizureResultDetailSnapshot>{
        lawyerList,
        seizureLedsDTO,
        executionOffices,
        collateralTypes,
        civilCourtName,
        civilCourtNo,
        unMappedCollaterals,
        receipt,
      };
    });
  }
}

export type ISeizureResultDetailSnapshot = {
  civilCourtNo: string;
  civilCourtName: string;
  seizureLedsDTO: SeizureLedsInfo;
  unMappedCollaterals: SeizureCollateralInfo[];
  lawyerList: LexsUserOption[];
  collateralTypes: CollateralTypeDTO[];
  executionOffices: LitigationCaseLedsDto[];
  receipt?: SeizureNonEFillingInvoiceDto;
};
