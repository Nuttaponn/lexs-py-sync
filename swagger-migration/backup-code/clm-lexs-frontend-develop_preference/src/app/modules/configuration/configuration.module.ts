import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigIconModule, SpigShareModule } from '@spig/core';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration/configuration.component';
import { UserMatchComponent } from './user-match/user-match.component';

@NgModule({
  declarations: [ConfigurationComponent, UserMatchComponent],
  imports: [
    CommonModule,
    SpigShareModule,
    SpigIconModule,
    SpigCoreModule,
    SharedModule,
    TranslateModule,
    ConfigurationRoutingModule,
  ],
  exports: [],
})
export class ConfigurationModule {}
