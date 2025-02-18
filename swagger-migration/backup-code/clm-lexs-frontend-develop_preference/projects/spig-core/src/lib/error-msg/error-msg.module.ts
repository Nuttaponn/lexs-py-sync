import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SpigShareModule } from '../spig-share.module';
import { ErrorMsgComponent } from './error-msg.component';
import { FormControlInvalidMsgOptions, FORM_CONTROL_INVALID_MSG_OPTIONS } from './form-control-invalid-msg-options';

@NgModule({
    declarations: [ErrorMsgComponent],
    imports: [CommonModule, SpigShareModule, TranslateModule.forChild()],
    providers: [],
    exports: [ErrorMsgComponent]
})
export class ErrorMsgModule {
  static forRoot(options?: FormControlInvalidMsgOptions[]): ModuleWithProviders<ErrorMsgModule> {
    let returnOptions = !!options ? options : FormControlInvalidMsgOptions.applyDefault([]);
    return {
      ngModule: ErrorMsgModule,
      providers: [{ provide: FORM_CONTROL_INVALID_MSG_OPTIONS, useValue: returnOptions }],
    };
  }
}
