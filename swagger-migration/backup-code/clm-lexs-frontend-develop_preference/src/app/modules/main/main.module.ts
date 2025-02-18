import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main/main.component';
import { InboxNotificationComponent } from './inbox-notification/inbox-notification.component';

// TODO: prepare for translate lazy loading
// AoT requires an exported function for factories.
// export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
//   return new TranslateHttpLoader(http, '../../../assets/i18n/main/', '.json');
// }

registerLocaleData(localeTh, 'th-TH');

@NgModule({
  declarations: [MainComponent, InboxNotificationComponent],
  imports: [
    CommonModule,
    TranslateModule,
    // TODO: prepare for translate lazy loading
    // Use the TranslateModule's config param "extend: true" to extend the parent or root module's
    // loaded translations.
    // TranslateModule.forChild({
    //   defaultLanguage: 'th',
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   },
    //   isolate: true
    // }),
    SpigCoreModule,
    SpigShareModule,
    MainRoutingModule,
    SharedModule,
  ],
  providers: [DatePipe],
})
export class MainModule {}
