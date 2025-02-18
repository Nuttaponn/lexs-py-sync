import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CaseDetailsModule } from '@app/shared/components/case-details/case-details.module';
import { ResponsibleLawyerModule } from '@app/shared/components/responsible-lawyer/responsible-lawyer.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { ApproveDetailComponent } from '../approve-detail/approve-detail.component';
import { WithdrawnReasonModule } from '../withdrawn-reason/withdrawn-reason.module';
import { WithdrawnDetailInfoRoutingModule } from './withdrawn-detail-info-routing.module';
import { WithdrawnDetailInfoComponent } from './withdrawn-detail-info.component';

@NgModule({
  declarations: [WithdrawnDetailInfoComponent, ApproveDetailComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    CaseDetailsModule,
    ResponsibleLawyerModule,
    WithdrawnDetailInfoRoutingModule,
    WithdrawnReasonModule,
  ],
})
export class WithdrawnDetailInfoModule {}
