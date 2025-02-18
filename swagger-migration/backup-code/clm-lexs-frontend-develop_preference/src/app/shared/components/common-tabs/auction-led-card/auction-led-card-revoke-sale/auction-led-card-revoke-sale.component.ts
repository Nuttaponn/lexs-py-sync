import { Component } from '@angular/core';
import { AuctionMenu } from '@app/modules/auction/auction.model';
import { AuctionService } from '@app/modules/auction/auction.service';
import { MAIN_ROUTES } from '@app/shared/constant';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { mockCollaterals } from 'mock/data/auction/auction.mock';
import { AuctionLedCardRevokeSaleDialogComponent } from '../auction-led-card-revoke-sale-dialog/auction-led-card-revoke-sale-dialog.component';

// TODO: Remark due to not implement in current project plan

@Component({
  selector: 'app-auction-led-card-revoke-sale',
  templateUrl: './auction-led-card-revoke-sale.component.html',
  styleUrls: ['./auction-led-card-revoke-sale.component.scss'],
})
export class AuctionLedCardRevokeSaleComponent {
  constructor(
    private notificationService: NotificationService,
    private routerService: RouterService,
    private auctionService: AuctionService
  ) {}

  /**
   * เพิกถอนการขาย
   */
  async onRevoke() {
    return this.notificationService
      .showCustomDialog({
        component: AuctionLedCardRevokeSaleDialogComponent,
        title: 'เพิกถอนการขาย: สำนักงานบังคับคดีจังหวัดสมุทรสาคร',
        iconName: 'icon-Money-Cancel',
        rightButtonLabel: 'ยืนยันเลือกชุดทรัพย์',
        buttonIconName: 'icon-Checkmark-Circle-Regular',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        type: 'normal',
        autoWidth: false,
        context: {
          collaterals: mockCollaterals,
        },
      })
      .then(res => {
        if (res && res.close) {
          this.auctionService.auctionMenu = AuctionMenu.REVOKE;
          this.auctionService.selectedCollateralsForRevocation = res.selected;
          this.routerService.navigateTo(`${MAIN_ROUTES.LAWSUIT}/auction/auction-detail`);
        }
      });
  }

  /**
   * คัดค้านเพิกถอนการขาย
   */
  async onRejectReInvoke() {
    return this.notificationService
      .showCustomDialog({
        component: AuctionLedCardRevokeSaleDialogComponent,
        title: 'เพิกถอนการขาย: สำนักงานบังคับคดีจังหวัดสมุทรสาคร',
        iconName: 'icon-Money-Cancel',
        rightButtonLabel: 'ยืนยันเลือกชุดทรัพย์',
        buttonIconName: 'icon-Checkmark-Circle-Regular',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        type: 'normal',
        autoWidth: false,
        context: {
          collaterals: mockCollaterals,
        },
      })
      .then(res => {
        if (res && res.close) {
          this.auctionService.auctionMenu = AuctionMenu.REVOKE;
          this.auctionService.selectedCollateralsForRevocation = res.selected;
          this.routerService.navigateTo(`${MAIN_ROUTES.LAWSUIT}/auction/auction-detail`);
        }
      });
  }
}
