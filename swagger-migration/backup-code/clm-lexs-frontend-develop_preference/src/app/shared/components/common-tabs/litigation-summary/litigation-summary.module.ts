import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { LitigationSummaryRoutingModule } from './litigation-summary-routing.module';
import { LitigationSummaryComponent } from './litigation-summary.component';

@NgModule({
  declarations: [LitigationSummaryComponent],
  imports: [
    CommonModule,
    LitigationSummaryRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
  ],
  exports: [LitigationSummaryComponent],
})
export class LitigationSummaryModule {}
