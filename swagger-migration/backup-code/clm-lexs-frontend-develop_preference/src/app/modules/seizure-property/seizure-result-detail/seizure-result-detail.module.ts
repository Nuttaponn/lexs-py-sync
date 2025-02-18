import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeizureResultDetailRoutingModule } from './seizure-result-detail-routing.module';
import { SeizureResultDetailComponent } from './seizure-result-detail.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';

@NgModule({
  declarations: [SeizureResultDetailComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
    SeizureResultDetailRoutingModule,
  ],
})
export class SeizureResultDetailModule {}
