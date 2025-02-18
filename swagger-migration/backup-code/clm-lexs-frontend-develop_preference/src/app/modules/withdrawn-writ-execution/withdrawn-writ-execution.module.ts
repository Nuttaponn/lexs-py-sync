import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { CaseDetailsModule } from '@app/shared/components/case-details/case-details.module';
import { ResponsibleLawyerModule } from '@app/shared/components/responsible-lawyer/responsible-lawyer.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { WithdrawnWritExecutionRoutingModule } from './withdrawn-writ-execution-routing.module';
import { WithdrawnWritExecutionComponent } from './withdrawn-writ-execution.component';
import { WithdrawExcutionDetailComponent } from '@app/shared/components/common-tabs/withdraw-excution-detail/withdraw-excution-detail.component';
import { WithdrawExcutionResultComponent } from '@app/shared/components/common-tabs/withdraw-excution-result/withdraw-excution-result.component';

@NgModule({
  declarations: [WithdrawnWritExecutionComponent, WithdrawExcutionDetailComponent, WithdrawExcutionResultComponent],
  imports: [
    CommonModule,
    WithdrawnWritExecutionRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    CaseDetailsModule,
    PipesModule,
    ResponsibleLawyerModule,
  ],
})
export class WithdrawnWritExecutionModule {}
