import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WithdrawnSeizurePropertyCreateGroupComponent } from './withdrawn-seizure-property-create-group.component';

const routes: Routes = [{ path: '', component: WithdrawnSeizurePropertyCreateGroupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WithdrawnSeizurePropertyCreateGroupRoutingModule {}
