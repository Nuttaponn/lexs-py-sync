import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSubTabComponent } from './dashboard-sub-tab.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigShareModule, SpigCoreModule } from '@spig/core';

@NgModule({
  declarations: [DashboardSubTabComponent],
  imports: [CommonModule, SpigShareModule, SpigCoreModule, SharedModule, TranslateModule],
  exports: [DashboardSubTabComponent],
})
export class DashboardSubTabModule {}
