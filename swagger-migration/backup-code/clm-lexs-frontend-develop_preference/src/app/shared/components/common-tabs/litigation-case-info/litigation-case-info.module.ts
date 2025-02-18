import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LitigationSummaryModule } from '@app/shared/components/common-tabs/litigation-summary/litigation-summary.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { LitigationCaseInfoRoutingModule } from './litigation-case-info-routing.module';
import { LitigationCaseInfoComponent } from './litigation-case-info.component';

@NgModule({
  declarations: [LitigationCaseInfoComponent],
  imports: [
    LitigationCaseInfoRoutingModule,
    LitigationSummaryModule,
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
  ],
  exports: [LitigationCaseInfoComponent],
})
export class LitigationCaseInfoModule {}
