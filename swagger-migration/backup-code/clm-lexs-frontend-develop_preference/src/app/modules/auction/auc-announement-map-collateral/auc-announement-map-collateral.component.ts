import { Component, OnInit } from '@angular/core';
import { ActionBar, auctionActionCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import {
  AuctionCollateralMatchRequest,
  AuctionDetails,
  AuctionDetailsAssetOwner,
  AuctionLexsCollateralDto,
  AuctionLexsCollateralResponse,
  AuctionLexsNonPledgeAssestDto,
} from '@lexs/lexs-client';
import { DialogOptions } from '@spig/core';
import { AucCollateralColType } from '../auction.model';
import { AuctionService } from '../auction.service';
import { TranslateService } from '@ngx-translate/core';

export interface AuctionLexsCollateralDtoWithAsset extends AuctionLexsCollateralDto {
  isNotPledgeAsset?: boolean;
}
@Component({
  selector: 'app-auc-announement-map-collateral',
  templateUrl: './auc-announement-map-collateral.component.html',
  styleUrls: ['./auc-announement-map-collateral.component.scss'],
})
export class AucAnnounementMapCollateralComponent implements OnInit {
  public actionBar: ActionBar = {
    hasSave: false,
    hasPrimary: true,
    primaryText: 'AUC_ANNOUNEMENT_MAP_COLLATERAL.MAP_BTN',
    primaryIcon: 'icon-Match',
    hasCancel: false,
    hasReject: false,
    hasEdit: false,
  };
  public dataToVerify: AuctionDetails | undefined;
  public selectCollateral: any;
  public tableColumnConfig = [
    AucCollateralColType.selection,
    AucCollateralColType.orderNumber,
    AucCollateralColType.fsubbidnum,
    AucCollateralColType.assettypedesc,
    AucCollateralColType.landtype,
    AucCollateralColType.deedno,
    AucCollateralColType.assetDetail,
    AucCollateralColType.redCaseNo,
    AucCollateralColType.saletypedesc,
    AucCollateralColType.debtname,
    AucCollateralColType.ownername,
    AucCollateralColType.personName1,
    AucCollateralColType.personName2,
    AucCollateralColType.occupant,
    AucCollateralColType.ledname,
    AucCollateralColType.remark,
    AucCollateralColType.action,
  ];

  public tableDataSource: AuctionLexsCollateralDto[] | AuctionLexsCollateralDtoWithAsset[] = [];
  constructor(
    private logger: LoggerService,
    private auctionService: AuctionService,
    private notificationService: NotificationService,
    private routerService: RouterService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    //TODO init data
    this.logger.info('[AucAnnounementMapCollateralComponent][ngOnInit]');
    // this.tableDataSource = this.auctionService.auctionLexsCollateralResponse?.lexsCollaterals || [];
    let auctionResponse = this.auctionService.auctionLexsCollateralResponse as AuctionLexsCollateralResponse;
    this.tableDataSource =
      auctionResponse.nonPledgeAssets && auctionResponse.nonPledgeAssets.length > 0
        ? this.getAuctionResponseWithAsset(auctionResponse)
        : this.auctionService.auctionLexsCollateralResponse?.lexsCollaterals || [];
    this.auctionService.verifyCollateralForm = this.auctionService.getVerifyCollateralForm();
    this.dataToVerify = this.auctionService.auctionCollateralToVerify;
    this.selectCollateral = this.auctionService.sourceCollaralId || '';
  }

  async onBack() {
    if (this.auctionService.isReselectCollateral) {
      this.routerService.backOnIndex(2);
      return;
    }
    if (this.selectCollateral) {
      await this.auctionService.openConfirmBackToEdit();
    } else {
      this.routerService.back();
    }
  }

  async onSubmit() {
    try {
      if (!this.selectCollateral) {
        const res = await this.notificationService.alertDialog(
          'AUC_ANNOUNEMENT_MAP_COLLATERAL.CANT_MAP_PROPERTY',
          'AUC_ANNOUNEMENT_MAP_COLLATERAL.SELECT_DESIRE_PROPERTY'
        );
        this.logger.info('onSubmit alertDialog response :: ', res);
        return;
      }
      const optionsDialog: DialogOptions = {
        rightButtonLabel: 'AUC_ANNOUNEMENT_MAP_COLLATERAL.CONFIRM_MAP',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        leftButtonClass: 'long-button',
        buttonIconName: 'icon-Selected',
        rightButtonClass: 'primary',
      };

      const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
        'AUC_ANNOUNEMENT_MAP_COLLATERAL.CONFIRM_MAP_PROPERTY',
        'AUC_ANNOUNEMENT_MAP_COLLATERAL.CONFIRM_MAP_DETAILS',
        optionsDialog
      );

      if (!res) return;
      let request: AuctionCollateralMatchRequest;
      if (this.selectCollateral.isNotPledgeAsset) {
        request = {
          deedGroupId: Number(this.dataToVerify?.deedGroupId),
          deedId: Number(this.dataToVerify?.deedId),
          assetId: this.selectCollateral.collateralId,
          assetCollateralTypeCode: this.selectCollateral.lexsCollateralTypeCode,
          assetCollateralSubTypeCode: this.selectCollateral.lexsCollateralSubTypeCode,
          assetDocumentNo: this.selectCollateral.lexsDocumentNo,
        };
      } else {
        request = {
          deedGroupId: Number(this.dataToVerify?.deedGroupId),
          deedId: Number(this.dataToVerify?.deedId),
          collateralId: this.selectCollateral.collateralId,
          lexsCollateralTypeCode: this.selectCollateral.lexsCollateralTypeCode,
          lexsCollateralSubTypeCode: this.selectCollateral.lexsCollateralSubTypeCode,
          lexsDocumentNo: this.selectCollateral.lexsDocumentNo,
        };
      }
      const response = await this.auctionService.postCollateralMatch(request);
      this.logger.info('onSubmit postCollateralMatch response :: ', response);
      this.notificationService.openSnackbarSuccess(
        this.translateService.instant('AUC_ANNOUNEMENT_MAP_COLLATERAL.MAP_PROPERTY_SUCCESS')
      );
      this.backToPreviousPageWithFlag();
    } catch (error) {
      await this.auctionService.handleErrorForAuction(error);
    }
  }

  private backToPreviousPageWithFlag() {
    if (this.auctionService.isReselectCollateral) {
      this.routerService.backOnIndex(2);
    } else {
      this.auctionService.actionCode = auctionActionCode.R2E09_4;
      this.routerService.back();
    }
  }

  updateSelectedItem(event: any) {
    this.logger.info('[AucAnnounementMapCollateralComponent][updateSelectedItem]', event);
    this.selectCollateral = event;
  }

  getAuctionResponseWithAsset(auctionResponse: AuctionLexsCollateralResponse) {
    let auctionData: AuctionLexsCollateralDtoWithAsset[];
    let collateralData = auctionResponse?.lexsCollaterals?.map(obj => ({
      ...obj,
      isNotPledgeAsset: false,
    })) as AuctionLexsCollateralDtoWithAsset[];

    // Concatenating nonPledgeAssets into lexsCollaterals

    auctionData =
      (auctionResponse.nonPledgeAssets &&
        (collateralData.concat(
          auctionResponse.nonPledgeAssets.map((asset: AuctionLexsNonPledgeAssestDto) => {
            return {
              collateralId: asset.assetId,
              lexsRedCaseNo: asset.assetRedCaseNo,
              ledId: asset.ledId?.toString() || '',
              ledName: asset.ledName,
              lexsCollateralTypeCode: asset.assetCollateralTypeCode?.toString() || '',
              lexsCollateralTypeDesc: asset.assetCollateralTypeDesc,
              lexsCollateralSubTypeCode: asset.assetCollateralSubTypeCode?.toString() || '',
              lexsCollateralSubTypeDesc: asset.assetCollateralSubTypeDesc,
              lexsDocumentNo: asset.assetDocumentNo,
              lexsCollateralsDescription: asset.assetDescription,
              lexsDefendant: asset.assetDefendant,
              lexsPlaintiffName: asset.assetPlaintiffname,
              lexsOwnerFullName: asset.assetOwners ? this.getLexsOwnerFullNameAsset(asset.assetOwners) : '',
              assetObligationBy: asset.assetObligationBy || '',
              isNotPledgeAsset: true,
              assetId: asset.assetId,
            };
          })
        ) as AuctionLexsCollateralDtoWithAsset[])) ||
      [];
    return auctionData;
  }

  getLexsOwnerFullNameAsset(assetOwners: Array<AuctionDetailsAssetOwner>) {
    let result: string = '';

    assetOwners.forEach(assetOwner => {
      if (assetOwner.firstName && assetOwner.lastName) {
        if (assetOwner.custTypeConst === 'P') {
          result += `${assetOwner.identificationNo} - ${assetOwner.firstName} ${assetOwner.lastName}, `;
        } else if (assetOwner.custTypeConst === 'C') {
          result += `${assetOwner.identificationNo} - ${assetOwner.firstName}, `;
        } else result += '-, ';
      }
    });

    // Check if there's a non-empty result before slicing
    if (result.length > 0) {
      result = result.slice(0, -2); // Removing the last ', ' from the concatenated string
    }

    return result;
  }
}
