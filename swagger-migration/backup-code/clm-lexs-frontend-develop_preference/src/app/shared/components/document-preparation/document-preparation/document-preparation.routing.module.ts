import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentPreparationComponent } from './document-preparation.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentPreparationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentPreparationRoutingModule {}
