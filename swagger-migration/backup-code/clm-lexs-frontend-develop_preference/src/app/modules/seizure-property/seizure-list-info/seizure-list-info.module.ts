import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

import { SeizurePropertyInfoModule } from '@app/shared/components/common-tabs/seizure-property-info/seizure-property-info.module';
import { SharedModule } from '@app/shared/shared.module';
import { SeizureListInfoRoutingModule } from './seizure-list-info-routing.module';
import { SeizureListInfoComponent } from './seizure-list-info.component';

@NgModule({
  declarations: [SeizureListInfoComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    SeizureListInfoRoutingModule,
    TranslateModule,
    SharedModule,
    SeizurePropertyInfoModule,
  ],
  exports: [SeizureListInfoComponent],
})
export class SeizureListInfoModule {}
