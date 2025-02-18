import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

import { PipesModule } from '@app/shared/pipes/pipes.module';
import { OrderInfoRoutingModule } from './order-info-routing.module';
import { OrderInfoComponent } from './order-info.component';
import { SeizeMoreAssetsDialogComponent } from './seize-more-assets-dialog/seize-more-assets-dialog.component';
import { SeizurePropertyItemComponent } from '../seizure-property-item/seizure-property-item.component';

@NgModule({
  declarations: [OrderInfoComponent, SeizeMoreAssetsDialogComponent, SeizurePropertyItemComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    OrderInfoRoutingModule,
    PipesModule,
  ],
})
export class OrderInfoModule {}
