import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoggerService } from '@app/shared/services/logger.service';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule],
  providers: [LoggerService],
})
export class LoginModule {}
