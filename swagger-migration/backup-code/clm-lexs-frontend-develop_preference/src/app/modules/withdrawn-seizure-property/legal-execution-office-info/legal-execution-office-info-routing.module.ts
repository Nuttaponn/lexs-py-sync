import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalExecutionOfficeInfoComponent } from './legal-execution-office-info.component';
import { LegalExecutionOfficeInfoResolver } from './legal-execution-office-info.resolver';

const routes: Routes = [
  {
    path: '',
    component: LegalExecutionOfficeInfoComponent,
    resolve: {
      legalExecutionOfficeInfo: LegalExecutionOfficeInfoResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalExecutionOfficeInfoRoutingModule {}
