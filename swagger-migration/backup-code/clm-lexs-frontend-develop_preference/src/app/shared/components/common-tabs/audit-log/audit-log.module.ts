import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AuditLogRoutingModule } from './audit-log-routing.module';
import { AuditLogComponent } from './audit-log.component';

@NgModule({
  declarations: [AuditLogComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, AuditLogRoutingModule],
  exports: [AuditLogComponent],
})
export class AuditLogModule {}
