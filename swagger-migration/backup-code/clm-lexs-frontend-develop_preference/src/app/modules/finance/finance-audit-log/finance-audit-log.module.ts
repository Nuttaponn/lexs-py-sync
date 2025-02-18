import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuditLogModule } from '@app/shared/components/common-tabs/audit-log/audit-log.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { FinanceAuditLogRoutingModule } from './finance-audit-log-routing.module';
import { FinanceAuditLogComponent } from './finance-audit-log.component';

@NgModule({
  declarations: [FinanceAuditLogComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    TranslateModule,
    FinanceAuditLogRoutingModule,
    AuditLogModule,
    PipesModule,
  ],
})
export class FinanceAuditLogModule {}
