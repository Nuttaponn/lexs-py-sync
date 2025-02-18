import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { SimplePaginatorComponent } from '../components/simple-paginator/simple-paginator.component';
import { AppComponent } from './app.component';

export function addSvgIconSet(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
  return () => {
    matIconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/symbol-defs.svg')
    );
  };
}

@NgModule({ declarations: [
        AppComponent,
        SimplePaginatorComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        MatIconModule,
        MatButtonModule], providers: [
        { provide: APP_INITIALIZER, useFactory: addSvgIconSet, deps: [MatIconRegistry, DomSanitizer], multi: true },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
