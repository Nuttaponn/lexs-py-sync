import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { DatepickerModule } from './datepicker/datepicker.module';
import { DialogsModule } from './dialogs/dialogs.module';
import { NumberOnlyDirective } from './directives/number-only/number-only.directive';
import { DropdownModule } from './dropdown/dropdown.module';
import { ErrorMsgModule } from './error-msg/error-msg.module';
import { FormsModule } from './forms/forms.module';
import { LoaderModule } from './loader/loader.module';
import { LoginModule } from './login/login.module';
import { SidenavModule } from './menu/menu.module';
import { PaginatorModule } from './paginator/paginator.module';
import { PipeModule } from './pipe/pipe.module';
import { SearchComboBoxModule } from './search-combo-box/search-combo-box.module';
import { TitleBarModule } from './title-bar/title-bar.module';
import { MonthPickerModule } from './month-picker/month-picker.module';
import { TwoDecimalDirective } from '@app/shared/directives';
import { RemoveSpacesDirective } from '@app/shared/directives/remove-spaces.directive';

@NgModule({
  declarations: [NumberOnlyDirective,TwoDecimalDirective, RemoveSpacesDirective],
  imports: [
    LoaderModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    DialogsModule,
    TitleBarModule,
    SidenavModule,
    SearchComboBoxModule,
    LoginModule,
    DropdownModule,
    DatepickerModule,
    MonthPickerModule,
    ErrorMsgModule.forRoot(),
    PaginatorModule,
  ],
  exports: [
    PipeModule,
    TitleBarModule,
    SidenavModule,
    FormsModule,
    SearchComboBoxModule,
    LoginModule,
    DropdownModule,
    DatepickerModule,
    MonthPickerModule,
    ErrorMsgModule,
    PaginatorModule,
    NumberOnlyDirective,
    TwoDecimalDirective,
    RemoveSpacesDirective,
  ],
  providers: [],
})
export class SpigCoreModule {
  static forRoot(): ModuleWithProviders<SpigCoreModule> {
    return {
      ngModule: SpigCoreModule,
      providers: [],
    };
  }
}
