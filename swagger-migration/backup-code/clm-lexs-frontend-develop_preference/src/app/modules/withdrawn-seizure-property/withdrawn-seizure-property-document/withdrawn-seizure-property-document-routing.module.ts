import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WithdrawnSeizurePropertyDocumentComponent } from './withdrawn-seizure-property-document.component';
import { WithdrawnSeizurePropertyDocumentResolver } from './withdrawn-seizure-property-document.resolver';

const routes: Routes = [
  {
    path: '',
    component: WithdrawnSeizurePropertyDocumentComponent,
    resolve: {
      withdrawnSeizureProperty: WithdrawnSeizurePropertyDocumentResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WithdrawnSeizurePropertyDocumentRoutingModule {}
