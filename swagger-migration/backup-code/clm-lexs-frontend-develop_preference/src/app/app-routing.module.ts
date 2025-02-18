import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@environments/environment';
import { AppGuard } from './app.guard';
import { LoginComponent } from './modules/login/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule),
    canDeactivate: [AppGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { canceledNavigationResolution: 'computed', enableTracing: environment.production }),
  ], // enableTracing will be open on production and UAT
  exports: [RouterModule],
})
export class AppRoutingModule {}
