import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { SuitEfilingCivilComponent } from './suit-efiling-civil/suit-efiling-civil.component';
import { SuitEfilingRoutingModule } from './suit-efiling-routing.module';
import { SuitEfilingComponent } from './suit-efiling.component';

@NgModule({
  declarations: [SuitEfilingComponent, SuitEfilingCivilComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, SuitEfilingRoutingModule],
  exports: [SuitEfilingComponent],
})
export class SuitEfilingModule {}
