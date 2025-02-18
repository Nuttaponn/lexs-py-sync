import { TranslateLoader } from '@ngx-translate/core';
import { Observable, from, of } from 'rxjs';

export class AsyncTranslationLoader implements TranslateLoader {
  constructor(private langs: Record<string, () => Promise<any>>) {}

  getTranslation(lang: string): Observable<any> {
    const fn = this.langs[lang];
    return fn ? from(fn()) : of();
  }
}
