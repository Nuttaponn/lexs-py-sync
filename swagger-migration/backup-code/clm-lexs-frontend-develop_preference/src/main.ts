import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

fetch('/assets/data/ui-app-config.json?t=' + new Date().getTime())
  .then(response => {
    return response.json();
  })
  .then(data => {
    Object.assign(environment, data);
    if (environment.production) {
      enableProdMode();
      window.console.log = () => {};
    }
    if (!environment.inspect) {
      window.console.log = () => {};
    }
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(err => console.error(err));
  });
