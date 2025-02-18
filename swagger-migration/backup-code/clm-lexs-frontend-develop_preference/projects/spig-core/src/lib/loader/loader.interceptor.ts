import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  // handle DOPA flow
  private exceptLoaderUrl: any = [
    'v1/readcard',
    'customer/dopa-task',
    '/v1/notifications/messagesByRecipient',
    '/v1/notifications/unreadCountByRecipient',
    '/v1/notifications/markReadByRecipient',
    '/v1/task/count-unassigned-task',
  ];
  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get('Ignore-Loading') === 'true' || this.exceptLoaderUrl.some((s: any) => req.url.includes(s))) {
      req.headers.delete('Ignore-Loading');
      return next.handle(req);
    }

    this.loaderService.enterLoad();
    return next.handle(req).pipe(finalize(() => this.loaderService.exitLoad()));
  }
}
