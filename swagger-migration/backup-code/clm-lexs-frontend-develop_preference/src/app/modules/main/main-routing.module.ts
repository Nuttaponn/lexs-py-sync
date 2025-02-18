import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainGuard } from './main.guard';
import { MainResolver } from './main.resolver';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [MainGuard],
    component: MainComponent,
    children: [
      // REMARKS: expose after R1.3.2
      { path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'user', loadChildren: () => import('../user/user.module').then(m => m.UserModule) },
      {
        path: 'config',
        loadChildren: () => import('../configuration/configuration.module').then(m => m.ConfigurationModule),
      },
      { path: 'customer', loadChildren: () => import('../customer/customer.module').then(m => m.CustomerModule) },
      { path: 'lawsuit', loadChildren: () => import('../lawsuit/lawsuit.module').then(m => m.LawsuitModule) },
      { path: 'task', loadChildren: () => import('../task/task.module').then(m => m.TaskModule) },
      {
        path: 'finance/expense',
        loadChildren: () => import('../finance/expense/expense.module').then(m => m.ExpenseModule),
      },
      {
        path: 'finance/receipt',
        loadChildren: () => import('../finance/receipt/receipt.module').then(m => m.ReceiptModule),
      },
      {
        path: 'finance/advance',
        loadChildren: () => import('../finance/advance/advance.module').then(m => m.AdvanceModule),
      },
      {
        path: 'external-documents',
        loadChildren: () =>
          import('../external-documents/external-documents.module').then(m => m.ExternalDocumentsModule),
      },
      { path: 'preference', loadChildren: () => import('../preference/preference.module').then(m => m.PreferenceModule) },
      { path: 'report', loadChildren: () => import('../report/report.module').then(m => m.ReportModule) },
      { path: 'dopa', loadChildren: () => import('../dopa/dopa.module').then(m => m.DopaModule) },
      {
        path: 'notification-landing',
        loadChildren: () =>
          import('../main/notification-landing/notification-landing.module').then(m => m.NotificationLandingModule),
      },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
    resolve: { mainResolver: MainResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
