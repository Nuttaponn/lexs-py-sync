import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { UserService } from '@app/modules/user/user.service';
import { AuctionStatus } from '@app/shared/constant';
import { TMode, taskCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { SubmitAuctionResultAction } from '../auction.const';
import { AuctionMenu } from '../auction.model';
import { AuctionService } from '../auction.service';

@Injectable({
  providedIn: 'root',
})
export class AuctionDetailResolver {
  private taskCode!: taskCode;
  private auctionMenu!: AuctionMenu;
  private isInquiryUserOptionsV2 = [
    taskCode.R2E09_00_1A,
    taskCode.R2E09_00_01_1A,
    taskCode.R2E09_06_7C,
    taskCode.R2E09_06_12C,
    taskCode.R2E09_06_03,
    taskCode.R2E09_06_04_6,
  ];
  constructor(
    private logger: LoggerService,
    private taskService: TaskService,
    private userService: UserService,
    private auctionService: AuctionService
  ) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.auctionService.hideContentHeader = route.queryParams['hideContentHeader'] === 'true' ? true : false;

    this.auctionMenu = this.auctionService.auctionMenu || ('' as AuctionMenu);

    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;

    if (this.taskCode === taskCode.R2E09_04_01_11) {
      this.logger.info('AuctionDetailResolver');
      const auctionBiddingId = this.taskService.taskDetail.objectId || '';
      const mode: TMode = route.queryParams['mode'] as TMode;
      this.auctionService.mode = mode;
      this.auctionService.itemActionCode = route.queryParams['itemActionCode'] as SubmitAuctionResultAction;
      const aucRef = Number(route.queryParams['aucRef']) || 0;
      const deedGroupId = Number(route.queryParams['deedGroupId']) || 0;
      this.auctionService.auctionResultCollateral =
        await this.auctionService.getInquiryLatestResolutionInfo(deedGroupId);

      const biddingCollaterals = await this.auctionService.getBiddingCollateralsByDeedGroupId(aucRef, deedGroupId);
      this.auctionService.inquiryDeedGroupResponse = {
        deedGroups: biddingCollaterals.deedGroups,
      };
      const auctionBiddingDeedGroup = await this.auctionService.getAuctionBiddingDeedGroup(
        auctionBiddingId,
        deedGroupId
      );
      this.auctionService.auctionBiddingDeedGroupResponse = auctionBiddingDeedGroup;
      if (auctionBiddingDeedGroup?.aucBiddingResult?.requireReturnDocument) {
        const chequeInfoRespons = await this.auctionService.getChequeInfo(deedGroupId, 'collaterals');
        this.auctionService.auctionBidingChequeInfoItem = chequeInfoRespons[0] || null;
      }
    }
    if (
      [AuctionMenu.VIEW_CASHIER, AuctionMenu.UPLOAD_DOC, AuctionMenu.ACCOUNT_DOCUMENT].includes(this.auctionMenu) &&
      [AuctionStatus.NPA_RECEIVE, AuctionStatus.AUCTION, AuctionStatus.COMPLETE].includes(
        this.auctionService.aucStatus as AuctionStatus
      )
    ) {
      this.userService.kLawyerUserOptions = this.isInquiryUserOptionsV2.includes(this.taskCode)
        ? await this.userService.inquiryUserOptionsAndRoleCodeV2('KLAW', ['LAW006'], ['KLAW_USER'])
        : [];
      const aucRef = this.auctionService.aucRef;
      this.auctionService.auctionBiddingsAnnouncesResponse =
        await this.auctionService.getAuctionBiddingAnnounceResult(aucRef);
      this.auctionService.auctionBiddingCollateralsSummaryResponse =
        await this.auctionService.getAuctionBiddingCollateralsSummary(aucRef);
      this.auctionService.auctionResolutionsLatest = await this.auctionService.getAuctionResolutionsLatest(aucRef);
      const collateral = await this.auctionService.getInquiryAuctionCashierChequeCollateralsInfo(aucRef);
      const stampDuty = await this.auctionService.getAuctionCashierStampDuty(aucRef);
      this.auctionService.collateralForm = this.auctionService.getCashierChequeForm(false, {
        cashierCheque: collateral,
      });
      this.auctionService.stampDutyForm = this.auctionService.getCashierChequeForm(false, { cashierCheque: stampDuty });
    }
    return true;
  }
}
