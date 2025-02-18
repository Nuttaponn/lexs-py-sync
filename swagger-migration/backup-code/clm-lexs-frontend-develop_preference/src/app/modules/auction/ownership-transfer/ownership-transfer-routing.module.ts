import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnershipTransferComponent } from './ownership-transfer.component';
import { OwnershipTransferResolver } from './ownership-transfer.resolver';
import { OwnershipTransferGuard } from './ownership-transfer.guard';

const routes: Routes = [
  {
    path: '',
    component: OwnershipTransferComponent,
    resolve: { ownerTransfer: OwnershipTransferResolver },
    canDeactivate: [OwnershipTransferGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnershipTransferRoutingModule {}
