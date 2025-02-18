import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AccountDetailRoutingModule } from './account-detail-routing.module';
import { AccountDetailComponent } from './account-detail.component';

@NgModule({
  declarations: [AccountDetailComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, AccountDetailRoutingModule],
  exports: [AccountDetailComponent],
})
export class AccountDetailModule {}
