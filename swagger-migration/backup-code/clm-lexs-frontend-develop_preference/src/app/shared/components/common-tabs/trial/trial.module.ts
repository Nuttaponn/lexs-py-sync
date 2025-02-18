import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { TrialDialogSaveDetailComponent } from './trial-dialog-save-detail/trial-dialog-save-detail.component';
import { TrialRoutingModule } from './trial-routing.module';
import { TrialComponent } from './trial.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [TrialComponent, TrialDialogSaveDetailComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    TrialRoutingModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  exports: [TrialComponent],
  providers: [provideNgxMask()],
})
export class TrialModule {}
