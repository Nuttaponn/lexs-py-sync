import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpigShareModule } from '../spig-share.module';
import { MonthPickerComponent } from './month-picker.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MonthPickerComponent],
  imports: [CommonModule, SpigShareModule, TranslateModule],
  exports: [MonthPickerComponent],
})
export class MonthPickerModule {}
