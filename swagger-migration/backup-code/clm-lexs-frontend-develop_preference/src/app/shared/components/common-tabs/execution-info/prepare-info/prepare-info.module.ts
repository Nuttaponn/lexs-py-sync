import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { PrepareInfoRoutingModule } from './prepare-info-routing.module';
import { PrepareInfoComponent } from './prepare-info.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [PrepareInfoComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, PrepareInfoRoutingModule],
})
export class PrepareInfoModule {}
