import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefermentSeizurePropertyRoutingModule } from './deferment-seizure-property-routing.module';
import { DefermentSeizurePropertyComponent } from './deferment-seizure-property.component';
import { SeizurePropertyInfoModule } from '@app/shared/components/common-tabs/seizure-property-info/seizure-property-info.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
@NgModule({
  declarations: [DefermentSeizurePropertyComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    DefermentSeizurePropertyRoutingModule,
    SeizurePropertyInfoModule,
  ],
})
export class DefermentSeizurePropertyModule {}
