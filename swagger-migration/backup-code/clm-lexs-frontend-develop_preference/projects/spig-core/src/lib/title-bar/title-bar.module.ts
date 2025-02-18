import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpigShareModule } from '../spig-share.module';
import { TitleBarComponent } from './title-bar.component';

@NgModule({
  declarations: [TitleBarComponent],
  imports: [CommonModule, SpigShareModule],
  exports: [TitleBarComponent],
})
export class TitleBarModule {}
