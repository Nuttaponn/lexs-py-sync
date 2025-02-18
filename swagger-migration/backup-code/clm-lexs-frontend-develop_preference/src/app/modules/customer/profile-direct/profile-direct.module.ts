import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { ProfileDirectRealTimeComponent } from './profile-direct-real-time/profile-direct-real-time.component';
import { ProfileDirectRoutingModule } from './profile-direct-routing.module';
import { ProfileDirectComponent } from './profile-direct.component';

@NgModule({
  declarations: [ProfileDirectComponent, ProfileDirectRealTimeComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    ProfileDirectRoutingModule,
    PipesModule,
  ],
})
export class ProfileDirectModule {}
