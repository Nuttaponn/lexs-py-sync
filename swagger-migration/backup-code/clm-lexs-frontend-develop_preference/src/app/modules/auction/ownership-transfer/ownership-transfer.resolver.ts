import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { TMode, taskCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { RouterService } from '@app/shared/services/router.service';
import { AuctionService } from '../auction.service';
import { AuctionMenu } from '../auction.model';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { ConveyanceStatus } from '@app/shared/constant/auction-matching-status.constant';

@Injectable({
  providedIn: 'root',
})
export class OwnershipTransferResolver {
  private taskCode!: taskCode;

  /**
   * litigationCaseId and litigationId of execution case info resolver
   *  task menu get from this.taskService.taskDetail
   *  itigation menu get from routing params
   */
  private litigationCaseId!: string;
  private objectId!: number;
  private deedGroupId!: string;

  constructor(
    private logger: LoggerService,
    private taskService: TaskService,
    private auctionService: AuctionService,
    private routerService: RouterService,
    private litigationCaseService: LitigationCaseService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('OwnershipTransferResolver');

    const mode: TMode = route.queryParams['mode'];
    this.auctionService.actionCode = route.queryParams['actionCode'] || '';
    this.auctionService.mode = mode || '';
    this.auctionService.actionType = (route.queryParams['actionType'] as taskCode) || '';
    this.auctionService.auctionMenu = route.queryParams['auctionMenu'] || '';
    this.deedGroupId = route.queryParams['deedGroupId'];
    this.objectId = Number(this.taskService.taskDetail?.objectId || 0);
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    this.litigationCaseId =
      this.taskService?.taskDetail?.litigationCaseId || route.queryParams['litigationCaseId'] || '';
    if (!this.auctionService.conveyanceStatus) {
      this.auctionService.conveyanceStatus = route.queryParams['transferStatus'] || '';
    }

    try {
      this.litigationCaseService.litigationCaseShortDetail =
        await this.litigationCaseService.getLitigationCaseShortDetail(Number(this.litigationCaseId));
    } catch (error) {}

    if (
      this.taskCode === taskCode.R2E09_11_01 ||
      this.auctionService.auctionMenu === AuctionMenu.VIEW_OWNERSHIP_TRNASFER_DATE_TIME
    ) {
      let id = Number(this.taskService?.taskDetail?.objectId) || Number(this.deedGroupId);
      this.auctionService.appointmentInfo = await this.auctionService.getMasAppointmentInfo(id);
      if (this.auctionService.appointmentInfo && this.auctionService.appointmentInfo.length > 0) {
        this.auctionService.conveyanceStatus = this.auctionService.appointmentInfo[0]
          .conveyanceStatus as ConveyanceStatus;
      }
      await this.getConveyanceAnnouncesDocuments();
    }
    if (
      this.auctionService.auctionMenu === AuctionMenu.VIEW_OWNERSHIP_TRNASFER ||
      this.auctionService.auctionMenu === AuctionMenu.VIEW_OWNERSHIP_TRNASFER_MAS ||
      this.auctionService.auctionMenu === AuctionMenu.OWNERSHIP_TRNASFER ||
      this.taskCode === taskCode.R2E09_06_04_6
    ) {
      const cashierTransferOwnershipId =
        this.taskCode === taskCode.R2E09_06_04_6
          ? this.objectId || 0
          : this.auctionService.auctionMenu === AuctionMenu.VIEW_OWNERSHIP_TRNASFER ||
              this.auctionService.auctionMenu === AuctionMenu.VIEW_OWNERSHIP_TRNASFER_MAS
            ? undefined
            : 0;
      //on-request cashierTransferOwnershipId, deedId
      // task cashierTransferOwnershipId
      let deedGroupId =
        this.taskCode !== taskCode.R2E09_06_04_6 ? (this.deedGroupId ? Number(this.deedGroupId) : 0) : undefined;
      const chequeTransfer = await this.auctionService.getCashierChequeTransferOwnership(
        cashierTransferOwnershipId,
        deedGroupId
      );

      let deedGroupIdAp = this.deedGroupId || (chequeTransfer.length > 0 ? chequeTransfer[0]?.deedGroupId : '');
      this.auctionService.appointmentInfo = await this.auctionService.getMasAppointmentInfo(Number(deedGroupIdAp));

      await this.getConveyanceAnnouncesDocuments(deedGroupIdAp as string);
      this.auctionService.transferOwershipList = chequeTransfer;
    }

    if (
      this.auctionService.auctionMenu === AuctionMenu.VIEW_OWNERSHIP_TRNASFER_MAS ||
      this.auctionService.auctionMenu === AuctionMenu.VIEW_OWNERSHIP_TRNASFER
    ) {
      try {
        const transferPropertyList = await this.auctionService.getMasTransferProperty(
          Number(this.deedGroupId) || this.objectId
        );
        this.auctionService.transferPropertyList = transferPropertyList.transferPropertyList || [];
      } catch (error) {}
    }
    return true;
  }

  async getConveyanceAnnouncesDocuments(deedGroupId?: string) {
    const response = await this.auctionService.getConveyanceAnnouncesDocuments(
      Number(this.deedGroupId) || Number(deedGroupId) || this.objectId
    );
    this.auctionService.conveyanceDocument = response;
  }
}
