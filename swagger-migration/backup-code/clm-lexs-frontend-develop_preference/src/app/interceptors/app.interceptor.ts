import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionService } from '../shared/services/session.service';
import { Utils } from '../shared/utils/util';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  private apiWithViewAsRegEx = [
    /\/v1\/customer$/g,
    /\/v1\/customer\/dopa-task$/g,
    /\/v1\/customer\/[^\/]*$/g,
    /\/v1\/customer\/[^\/]*\/audit-log$/g,
    /\/v1\/litigation$/g,
    /\/v1\/litigation\/[^\/]*$/g,
    /\/v1\/litigation\/[^\/]*\/audit-log$/g,
    /\/v1\/task$/g,
  ];

  constructor(private sessionService: SessionService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let customHeader = req.headers.set('X-Request-Id', Utils.uuidv4()).set('x-original-source-system', 'LEXS');

    // Role BU Owner has display text as 'BU Owner' but value is 'ADMIN'
    if (
      req.method === 'GET' &&
      this.sessionService.isBUOwner() &&
      !!this.sessionService.viewAs &&
      this.sessionService.viewAs !== 'ADMIN'
    ) {
      if (this.allowViewAs(req.url)) {
        customHeader = customHeader.set('view-as', this.sessionService.viewAs);
      }
    }

    const verReq = req.clone({ headers: customHeader });
    return next.handle(verReq);
  }

  allowViewAs(url: string): boolean {
    for (const regEx of this.apiWithViewAsRegEx) {
      if (url.match(regEx)) {
        return true;
      }
    }
    return false;
  }
}
