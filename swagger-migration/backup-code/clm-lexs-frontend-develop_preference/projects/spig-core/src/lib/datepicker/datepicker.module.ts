import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpigShareModule } from '../spig-share.module';
import { DatepickerComponent } from './datepicker.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [CommonModule, SpigShareModule, TranslateModule],
  exports: [DatepickerComponent],
})
export class DatepickerModule {}
