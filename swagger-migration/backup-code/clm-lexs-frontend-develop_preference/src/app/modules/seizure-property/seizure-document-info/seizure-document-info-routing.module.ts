import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeizureDocumentInfoComponent } from './seizure-document-info.component';
import { SeizureDocumentInfoResolver } from './seizure-document-info.resolver';

const routes: Routes = [
  {
    path: '',
    component: SeizureDocumentInfoComponent,
    resolve: {
      seizureDocuments: SeizureDocumentInfoResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeizureDocumentInfoRoutingModule {}
