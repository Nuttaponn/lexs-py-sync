import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionResultInfoComponent } from './auction-result-info.component';

const routes: Routes = [{ path: '', component: AuctionResultInfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuctionResultInfoRoutingModule {}
