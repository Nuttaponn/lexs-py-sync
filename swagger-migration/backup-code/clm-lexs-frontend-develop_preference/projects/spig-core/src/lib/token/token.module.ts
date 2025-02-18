import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogsModule } from '../dialogs/dialogs.module';
import { PipeModule } from '../pipe/pipe.module';
import { IdleOptions, IDLE_OPTIONS } from './idle-options';
import { TimeoutWarningComponent } from './timeout-warning/timeout-warning.component';
import { TokenService } from './token.service';

@NgModule({
    declarations: [TimeoutWarningComponent],
    imports: [CommonModule, DialogsModule, PipeModule, TranslateModule.forChild()],
    providers: []
})
export class TokenModule {
  static forRoot(options: IdleOptions): ModuleWithProviders<TokenModule> {
    return {
      ngModule: TokenModule,
      providers: [TokenService, { provide: IDLE_OPTIONS, useValue: options }],
    };
  }
}
