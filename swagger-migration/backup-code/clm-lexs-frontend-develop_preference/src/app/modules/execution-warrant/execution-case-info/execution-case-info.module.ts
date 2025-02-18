import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CaseDetailsModule } from '@app/shared/components/case-details/case-details.module';
import { ResponsibleLawyerModule } from '@app/shared/components/responsible-lawyer/responsible-lawyer.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { DecisionDetailComponent } from './decision-detail/decision-detail.component';
import { ExecutionCaseInfoRoutingModule } from './execution-case-info-routing.module';
import { ExecutionCaseInfoComponent } from './execution-case-info.component';
@NgModule({
  declarations: [ExecutionCaseInfoComponent, DecisionDetailComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    ExecutionCaseInfoRoutingModule,
    CaseDetailsModule,
    ResponsibleLawyerModule,
  ],
})
export class ExecutionCaseInfoModule {}
