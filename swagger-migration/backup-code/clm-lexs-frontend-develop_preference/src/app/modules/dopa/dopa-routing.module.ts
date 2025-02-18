import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DopaComponent } from './dopa/dopa.component';

const routes: Routes = [{ path: '', component: DopaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DopaRoutingModule {}
