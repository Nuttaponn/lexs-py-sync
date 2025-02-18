import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AucAnnouncementDetailComponent } from './auc-announcement-detail.component';
import { AucAnnouncementDetailResolver } from './auc-announcement-detail.resolver';

const routes: Routes = [
  {
    path: '',
    component: AucAnnouncementDetailComponent,
    resolve: {
      aucAnnouncementDetail: AucAnnouncementDetailResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AucAnnouncementDetailRoutingModule {}
