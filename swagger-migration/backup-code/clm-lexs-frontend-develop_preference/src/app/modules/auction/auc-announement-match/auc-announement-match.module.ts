import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AucAnnounementMatchRoutingModule } from './auc-announement-match-routing.module';
import { AucAnnounementMatchComponent } from './auc-announement-match.component';
import { AucAnnouncementLexsPendingComponent } from '../auc-announcement-lexs-pending/auc-announcement-lexs-pending.component';

@NgModule({
  declarations: [AucAnnounementMatchComponent, AucAnnouncementLexsPendingComponent],
  imports: [
    CommonModule,
    AucAnnounementMatchRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
  ],
})
export class AucAnnounementMatchModule {}
