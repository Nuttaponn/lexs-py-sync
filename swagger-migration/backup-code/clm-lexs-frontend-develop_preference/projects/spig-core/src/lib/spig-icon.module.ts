import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export function addSvgIconSet(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
  return () => {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icons/symbol-defs.svg'));
  };
}

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
})
export class SpigIconModule {
  static forRoot(): ModuleWithProviders<SpigIconModule> {
    return {
      ngModule: SpigIconModule,
      providers: [
        { provide: APP_INITIALIZER, useFactory: addSvgIconSet, deps: [MatIconRegistry, DomSanitizer], multi: true },
      ],
    };
  }
}
