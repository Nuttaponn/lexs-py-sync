import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionManualAnnouncementComponent } from './auction-manual-announcement.component';
import { AuctionManualAnnouncementResolver } from './auction-manual-announcement.resolver';

const routes: Routes = [
  {
    path: '',
    component: AuctionManualAnnouncementComponent,
    resolve: {
      auctionManualAnnouncement: AuctionManualAnnouncementResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuctionManualAnnouncementRoutingModule { }
