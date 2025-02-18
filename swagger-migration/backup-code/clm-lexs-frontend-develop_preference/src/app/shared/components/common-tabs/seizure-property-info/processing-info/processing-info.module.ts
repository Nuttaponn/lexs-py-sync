import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

import { ProcessingInfoRoutingModule } from './processing-info-routing.module';
import { ProcessingInfoComponent } from './processing-info.component';
import { ProcessingInfoSeizureListComponent } from './processing-info-seizure-list/processing-info-seizure-list.component';

@NgModule({
  declarations: [ProcessingInfoComponent, ProcessingInfoSeizureListComponent],
  imports: [CommonModule, SharedModule, SpigCoreModule, SpigShareModule, TranslateModule, ProcessingInfoRoutingModule],
})
export class ProcessingInfoModule {}
