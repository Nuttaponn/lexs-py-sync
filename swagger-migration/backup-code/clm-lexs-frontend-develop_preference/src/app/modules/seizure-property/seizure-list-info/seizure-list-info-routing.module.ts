import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeizureListInfoComponent } from './seizure-list-info.component';
import { SeizureListInfoResolver } from './seizure-list-info.resolver';

const routes: Routes = [
  {
    path: '',
    component: SeizureListInfoComponent,
    resolve: {
      seizureDocuments: SeizureListInfoResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeizureListInfoRoutingModule {}
