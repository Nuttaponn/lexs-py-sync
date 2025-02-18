import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { ResponsibleLawyerComponent } from './responsible-lawyer.component';

@NgModule({
  declarations: [ResponsibleLawyerComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule],
  exports: [ResponsibleLawyerComponent],
})
export class ResponsibleLawyerModule {}
