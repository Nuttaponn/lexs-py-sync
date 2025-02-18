import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { CanComponentDeactivate } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { Observable } from 'rxjs';
import { ExternalDocumentsService } from './external-documents.service';
import { RouterService } from '@app/shared/services/router.service';

@Injectable({
  providedIn: 'root',
})
export class ExternalDocumentsGuard {
  constructor(
    private logger: LoggerService,
    private routerService: RouterService,
    private externalDocumentsService: ExternalDocumentsService
  ) {}

  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.logger.info('ExternalDocumentsGuard :: canDeactivate prepare for clear data');
    this.externalDocumentsService.announceKtbTab = 0;
    if (!!this.routerService.eventPopstate) {
      return true;
    } else {
      return component.canDeactivate ? component.canDeactivate() : true;
    }
  }
}
