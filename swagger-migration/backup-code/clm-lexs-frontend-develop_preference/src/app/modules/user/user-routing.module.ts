import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDataResolver } from '@app/shared/resolvers/user-data.resolver';
import { MainGuard } from '../main/main.guard';
import { UserFormComponent } from './user-form/user-form.component';
import { UserGuard } from './user.guard';
import { UserResolver } from './user.resolver';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [MainGuard],
    canDeactivate: [UserGuard],
    component: UserComponent,
    resolve: {
      userDto: UserDataResolver,
    },
  },
  {
    path: 'add',
    canActivate: [MainGuard],
    canDeactivate: [UserGuard],
    component: UserFormComponent,
  },
  {
    path: 'edit',
    canActivate: [MainGuard],
    canDeactivate: [UserGuard],
    component: UserFormComponent,
    resolve: {
      userDto: UserResolver,
    },
  },
  {
    path: 'view',
    canActivate: [MainGuard],
    component: UserFormComponent,
    resolve: {
      userDto: UserResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
