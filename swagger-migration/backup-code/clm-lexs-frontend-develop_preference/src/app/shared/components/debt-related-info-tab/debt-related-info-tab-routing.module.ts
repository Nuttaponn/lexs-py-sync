import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebtRelatedInfoTabComponent } from './debt-related-info-tab/debt-related-info-tab.component';

const routes: Routes = [{ path: '', component: DebtRelatedInfoTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebtRelatedInfoTabRoutingModule {}
