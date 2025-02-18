import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { CaseDetailsModule } from '@shared/components/case-details/case-details.module';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { WithdrawnReasonModule } from '../withdrawn-reason/withdrawn-reason.module';
import { WithdrawnSeizurePropertyReasonRoutingModule } from './withdrawn-seizure-property-reason-routing.module';
import { WithdrawnSeizurePropertyReasonComponent } from './withdrawn-seizure-property-reason.component';

@NgModule({
  declarations: [WithdrawnSeizurePropertyReasonComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    WithdrawnSeizurePropertyReasonRoutingModule,
    CaseDetailsModule,
    WithdrawnReasonModule,
  ],
})
export class WithdrawnSeizurePropertyReasonModule {}
