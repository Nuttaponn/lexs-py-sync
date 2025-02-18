import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsContactsInfoComponent } from './assets-contacts-info.component';
import { AssetsContactsInfoResolver } from './assets-contacts-info.resolver';

const routes: Routes = [
  {
    path: '',
    component: AssetsContactsInfoComponent,
    resolve: {
      assetsContactsInfo: AssetsContactsInfoResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsContactsInfoRoutingModule {}
