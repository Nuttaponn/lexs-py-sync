import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourtDetailComponent } from './court-detail/court-detail.component';
import { CourtResolver } from './court.resolver';
import { CourtComponent } from './court/court.component';
import { DecreeDetailComponent } from './decree-detail/decree-detail.component';
import { ExecutionDetailComponent } from './execution-detail/execution-detail.component';
import { ExecutionReceiptUploadComponent } from './execution-receipt-upload/execution-receipt-upload.component';

const routes: Routes = [
  { path: '', component: CourtComponent },
  {
    path: 'court-detail',
    component: CourtDetailComponent,
    resolve: { courtResolve: CourtResolver },
  },
  {
    path: 'execution-receipt-upload',
    component: ExecutionReceiptUploadComponent,
    resolve: { courtResolve: CourtResolver },
  },
  { path: 'decree-detail', component: DecreeDetailComponent, resolve: { courtResolve: CourtResolver } },
  { path: 'execution-detail', component: ExecutionDetailComponent, resolve: { courtResolve: CourtResolver } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourtRoutingModule {}
