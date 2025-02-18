import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AucAnnounementMatchComponent } from './auc-announement-match.component';
import { AucAnnounementMatchResolver } from './auc-announement-match.resolver';

const routes: Routes = [
  {
    path: '',
    component: AucAnnounementMatchComponent,
    resolve: {
      aucAnnounceMath: AucAnnounementMatchResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AucAnnounementMatchRoutingModule {}
