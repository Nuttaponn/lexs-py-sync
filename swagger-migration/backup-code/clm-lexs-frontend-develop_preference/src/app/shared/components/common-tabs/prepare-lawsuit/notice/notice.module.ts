import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { LetterComponent, LinkTooltipThaiPostPipe } from './letter/letter.component';
import { NewspaperComponent } from './newspaper/newspaper.component';
import { NoticeRoutingModule } from './notice-routing.module';
import { NoticeComponent } from './notice.component';

@NgModule({
  declarations: [NoticeComponent, LetterComponent, NewspaperComponent, LinkTooltipThaiPostPipe],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, NoticeRoutingModule],
  exports: [NoticeComponent],
})
export class NoticeModule {}
