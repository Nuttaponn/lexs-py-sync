import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AccountAndDebtRoutingModule } from './account-and-debt-routing.module';
import { AccountAndDebtComponent } from './account-and-debt.component';
import { AddSubAccountComponent } from './add-sub-account/add-sub-account.component';

@NgModule({
  declarations: [AccountAndDebtComponent, AddSubAccountComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, AccountAndDebtRoutingModule],
  exports: [AccountAndDebtComponent, AddSubAccountComponent],
})
export class AccountAndDebtModule {}
