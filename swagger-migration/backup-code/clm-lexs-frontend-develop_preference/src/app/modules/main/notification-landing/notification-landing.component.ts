import { Component, OnInit } from '@angular/core';
import { RouterService } from '@app/shared/services/router.service';

@Component({
  selector: 'app-notification-landing',
  template: ``,
})
export class NotificationLandingComponent implements OnInit {
  constructor(private routerService: RouterService) {}

  ngOnInit(): void {
    const mainPath = `/main/notification-landing`;
    const params = this.routerService.paramMapp.get(mainPath);
    const path = params.nextPath;
    delete params.nextPath;
    this.routerService.navigateTo(path, params);
  }
}
