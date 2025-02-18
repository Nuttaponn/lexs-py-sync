import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { WarrantInfoRoutingModule } from './warrant-info-routing.module';
import { WarrantInfoComponent } from './warrant-info.component';

@NgModule({
  declarations: [WarrantInfoComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, WarrantInfoRoutingModule],
})
export class WarrantInfoModule {}
