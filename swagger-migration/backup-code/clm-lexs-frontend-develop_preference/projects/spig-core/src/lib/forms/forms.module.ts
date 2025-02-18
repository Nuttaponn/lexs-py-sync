import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomValidatorDirective } from './custom-validator.directive';
import { CustomAsyncValidatorDirective } from './custom-async-validator.directive';

@NgModule({
  declarations: [CustomValidatorDirective, CustomAsyncValidatorDirective],
  imports: [CommonModule],
  exports: [CustomValidatorDirective, CustomAsyncValidatorDirective],
})
export class FormsModule {}
