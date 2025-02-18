import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { DopaRoutingModule } from './dopa-routing.module';
import { DopaComponent } from './dopa/dopa.component';

@NgModule({
  declarations: [DopaComponent],
  imports: [CommonModule, DopaRoutingModule, TranslateModule, SpigCoreModule, SpigShareModule, SharedModule],
})
export class DopaModule {}
