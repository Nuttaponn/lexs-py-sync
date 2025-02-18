import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuctionManualAnnouncementRoutingModule } from './auction-manual-announcement-routing.module';
import { AuctionManualAnnouncementComponent } from './auction-manual-announcement.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { MatStepperModule } from '@angular/material/stepper';
import { AuctionDetailLexsSysTableComponent } from '../auction-add/auction-detail-lexs-sys-table/auction-detail-lexs-sys-table.component';
import { AuctionDetailPanelComponent } from '../auction-add/auction-detail-panel/auction-detail-panel.component';
import { GenaralDetailAddComponent } from '../auction-add/genaral-detail-add/genaral-detail-add.component';
import { LexsPendingAnnouncementListComponent } from '../auction-add/new-auction-case-selection/lexs-pending-announcement-list/lexs-pending-announcement-list.component';
import { SelectExpenseDialogComponent } from '../auction-add/select-expense-dialog/select-expense-dialog.component';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { CaseDetailsModule } from '@app/shared/components/case-details/case-details.module';
import { InformationAssetSetComponent } from './information-asset-set/information-asset-set.component';
import { AucManualAnnouncementStepperComponent } from './auc-manual-announcement-stepper/auc-manual-announcement-stepper.component';
import { AucAnnouncementDetailModule } from '../auc-announcement-detail/auc-announcement-detail.module';
import { AuctionDetailLexsSysMainComponent } from './auction-detail-lexs-sys-main/auction-detail-lexs-sys-main.component';

@NgModule({
  declarations: [
    AuctionManualAnnouncementComponent,
    SelectExpenseDialogComponent,
    AuctionDetailPanelComponent,
    LexsPendingAnnouncementListComponent,
    GenaralDetailAddComponent,
    AuctionDetailLexsSysTableComponent,
    InformationAssetSetComponent,
    AucManualAnnouncementStepperComponent,
    AuctionDetailLexsSysMainComponent,
  ],
  imports: [
    CommonModule,
    AuctionManualAnnouncementRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    MatStepperModule,
    PipesModule,
    CaseDetailsModule,
    AucAnnouncementDetailModule,
  ],
  exports: [
    AucManualAnnouncementStepperComponent,
  ]
})
export class AuctionManualAnnouncementModule { }
