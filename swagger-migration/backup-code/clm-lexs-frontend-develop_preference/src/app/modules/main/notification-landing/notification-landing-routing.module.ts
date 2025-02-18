import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationLandingComponent } from './notification-landing.component';

const routes: Routes = [{ path: '', component: NotificationLandingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationLandingRoutingModule {}
