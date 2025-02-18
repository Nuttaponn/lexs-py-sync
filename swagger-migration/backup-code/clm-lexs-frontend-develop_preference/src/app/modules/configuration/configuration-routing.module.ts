import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainGuard } from '../main/main.guard';
import { ConfigurationGuard } from './configuration.guard';
import { ConfigurationResolver } from './configuration.resolver';
import { ConfigurationComponent } from './configuration/configuration.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [MainGuard],
    canDeactivate: [ConfigurationGuard],
    component: ConfigurationComponent,
    resolve: { configResolver: ConfigurationResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule {}
