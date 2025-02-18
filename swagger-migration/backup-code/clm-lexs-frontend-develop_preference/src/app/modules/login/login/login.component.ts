import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { UserService } from '@app/modules/user/user.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { environment } from '@environments/environment';
import { UserControllerService } from '@lexs/lexs-client';
import { ErrorHandlingService } from '@shared/services/error-handling.service';
import { RouterService } from '@shared/services/router.service';
import { SessionService } from '@shared/services/session.service';
import { Configuration, LoaderService, TokenService } from '@spig/core';
import { lastValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  alertMessage: string = '';
  appVersion: string = '';

  constructor(
    @Inject(TokenService) private tokenService: TokenService,
    @Inject(LoaderService) private loaderService: LoaderService,
    @Inject(Configuration) private configuration: Configuration,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private sessionService: SessionService,
    private errorHandlingService: ErrorHandlingService,
    private routerService: RouterService,
    private userControllerService: UserControllerService,
    // services to clear data
    private documentService: DocumentService,
    private lawsuitService: LawsuitService,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.clearServiceData();

    this.route.queryParams.subscribe((params: any) => {
      if (params.initMessage) {
        this.alertMessage = params.initMessage;
      }
    });
  }

  private async checkForUpdate(alert: boolean) {
    const current = localStorage.getItem('lexs_version') as string;
    if (current) {
      this.appVersion = current;
    }
    const v: any = await lastValueFrom(this.httpClient.get('/assets/version.json?t=' + Date.now()));
    const version = v && v['version'];
    if (!version) {
      return;
    }
    if (current === version) {
      return;
    }
    if (!current) {
      localStorage.setItem('lexs_version', version);
      this.appVersion = version;
      return;
    }
    if (alert) {
      await this.errorHandlingService.showAlertMessage({ code: 'NEW_VERSION' });
    }
    localStorage.clear();
  }

  clearServiceData() {
    // clear any data left after logout
    this.sessionService.clearCurrentUser();
    this.documentService.clearData();
    this.lawsuitService.clearData();
    this.taskService.clearData();
    this.userService.clearData();
  }

  async next() {
    this.checkForUpdate(true);
    await this.callServicesAndGoForth();
  }

  async callServicesAndGoForth() {
    this.tokenService.stop.pipe(take(1)).subscribe((type: string) => {
      console.log('subscribe Token service stop');
      this.dialog.closeAll();
      let xtras: NavigationExtras = {};
      if (type === 'FORCE_LOGOUT') {
        // Handle to aert message 'You are logged out as this account is being used on another device.'
        const errMap = this.errorHandlingService.getMessageMapByKey('FORCED_LOGOUT');
        if (errMap) {
          xtras = {
            queryParams: { initMessage: errMap.message || '' },
            skipLocationChange: true,
          };
        }
      }

      if (type === 'TIMEOUT') {
        const errMap = this.errorHandlingService.getMessageMapByKey('IDLE_TIMEOUT');
        if (errMap) {
          xtras = {
            queryParams: { initMessage: errMap.message || '' },
            skipLocationChange: true,
          };
        }
      }

      // Route back to Login screen and clear all data related to Authentication
      // this.sessionService.isLogout = true;
      this.sessionService.clearCurrentUser(true);
      this.router.navigate(['/login'], xtras);
      // this.configuration.credentials = {};
    });

    // Else, prepare to retrieve/init data for the session
    this.loaderService.enterLoad();
    // retrieve logged-in user profile
    try {
      const userMe = await this.errorHandlingService.invokeNoRetry(() =>
        lastValueFrom(this.userControllerService.getCurrentUser())
      );
      this.sessionService.currentUser = userMe;

      // For Development purpose only - Keep Access token and User profile into Local storage to prevent app broken when refresh page
      if (environment.exemptAccessTokenVerify) {
        localStorage.setItem('access-token', this.configuration.credentials['accessToken'].toString());
        // localStorage.setItem('current-user', JSON.stringify(xxx.currentUser));
      }

      // Initial flag in SessionService and then route to Main component (Note: Loader Service will be stopped in OnInit() of Main component)
      this.sessionService.isLogout = false;
      this.routerService.addHistory();
      this.routerService.navigate('/main');
    } catch (e) {
      // console.log('after get me ', e);
      await this.errorHandlingService.invokeNoRetry(() => this.tokenService.logout());
      this.sessionService.clearCurrentUser(true);
      // this.sessionService.isLogout = true;
      this.loaderService.exitLoad();
    }
  }
}
