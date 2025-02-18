import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { UserFormComponent } from './user-form/user-form.component';
import { UserPopupComponent } from './user-popup/user-popup.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [UserComponent, UserFormComponent, UserPopupComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    UserRoutingModule,
    MatAutocompleteModule,
    SharedModule,
  ],
})
export class UserModule {}
