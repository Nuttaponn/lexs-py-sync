import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigIconModule, SpigShareModule } from '@spig/core';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report/report.component';

// TODO: prepare for translate lazy loading
// AoT requires an exported function for factories.
// export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
//   return new TranslateHttpLoader(http, '../../../assets/i18n/report/', '.json');
// }

@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SpigIconModule,
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
    //   isolate: false
    // }),
    SpigShareModule,
    SpigCoreModule,
    SharedModule,
  ],
})
export class ReportModule {}
