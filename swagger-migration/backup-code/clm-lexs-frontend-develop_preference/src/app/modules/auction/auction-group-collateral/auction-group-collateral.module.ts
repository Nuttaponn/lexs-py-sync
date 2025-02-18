import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuctionGroupCollateralComponent } from './auction-group-collateral.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { GroupCollateralTableComponent } from '../group-collateral-table/group-collateral-table.component';

@NgModule({
  declarations: [AuctionGroupCollateralComponent, GroupCollateralTableComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule],
  exports: [AuctionGroupCollateralComponent],
})
export class AuctionGroupCollateralModule {}
