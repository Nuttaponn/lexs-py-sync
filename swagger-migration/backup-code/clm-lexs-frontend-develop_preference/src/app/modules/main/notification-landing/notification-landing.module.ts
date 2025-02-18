import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationLandingRoutingModule } from './notification-landing-routing.module';
import { NotificationLandingComponent } from './notification-landing.component';

@NgModule({
  declarations: [NotificationLandingComponent],
  imports: [CommonModule, NotificationLandingRoutingModule],
})
export class NotificationLandingModule {}
