import { NgModule, ModuleWithProviders, APP_INITIALIZER, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderComponent } from './loader.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './loader.interceptor';
import { appendRootComponent } from '../append-root-component';

export function appendLoaderComponent(injector: Injector) {
  return appendRootComponent(injector, LoaderComponent);
}

@NgModule({
    declarations: [LoaderComponent],
    imports: [CommonModule, MatProgressSpinnerModule],
    exports: []
})
export class LoaderModule {
  static forRoot(): ModuleWithProviders<LoaderModule> {
    return {
      ngModule: LoaderModule,
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
        { provide: APP_INITIALIZER, useFactory: appendLoaderComponent, deps: [Injector], multi: true },
      ],
    };
  }
}
