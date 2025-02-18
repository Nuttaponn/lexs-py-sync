import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecutionDocumentInfoComponent } from './execution-document-info.component';
import { ExecutionDocumentInfoResolver } from './execution-document-info.resolver';

const routes: Routes = [
  {
    path: '',
    component: ExecutionDocumentInfoComponent,
    resolve: {
      executionDocuments: ExecutionDocumentInfoResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecutionDocumentInfoRoutingModule {}
