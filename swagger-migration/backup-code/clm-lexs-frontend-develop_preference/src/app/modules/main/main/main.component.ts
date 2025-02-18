import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Event, NavigationEnd, Router } from '@angular/router';
import { InboxNotificationComponent } from '@app/modules/main/inbox-notification/inbox-notification.component';
import { MESSAGE_STATUS } from '@app/modules/main/inbox-notification/inbox-notification.model';
import { TaskService } from '@app/modules/task/services/task.service';
import { MAIN_ROUTES, MENU_ROUTE_PATH } from '@app/shared/constant';
import { environment } from '@environments/environment';
import { MeLexsUserDto } from '@lexs/lexs-client';
import { UserService } from '@modules/user/user.service';
import { LexsUserPermissionCodes } from '@shared/models/permission';
import { RouterService } from '@shared/services/router.service';
import { SessionService } from '@shared/services/session.service';
import { DropDownConfig, LoaderService } from '@spig/core';
import { Subject, interval, startWith, switchMap, takeUntil } from 'rxjs';
import { SubSink } from 'subsink';
import { InboxNotificationService } from '../inbox-notification/inbox-notification.service';

export interface MenuInfo {
  topMenu: string;
  routePath: string;
  show?: boolean;
}
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  // Variables for Title bar and Menu
  notificationCount: number = 0;
  menuDisplayMode: MatDrawerMode = 'side';
  notificationMode: MatDrawerMode = 'side';
  menuState: boolean = true;
  notificationState: boolean = false;
  selectedMenu: string = '';
  selectedSubMenu: string = '';
  dropDownHeaderConfig: DropDownConfig = {
    disableFloatLabel: true,
    searchWith: 'text',
  };
  optionValues: any = [];
  currentUser?: MeLexsUserDto;
  isUserExpand?: boolean;

  taskPoolCount: number = 0;

  public menuMap?: Map<string, MenuInfo>;
  public viewAsCtrl: UntypedFormControl = new UntypedFormControl('ADMIN');
  public env = environment;

  private subs = new SubSink();
  private stopTaskPolling = new Subject();

  constructor(
    @Inject(LoaderService) private loaderService: LoaderService,
    private sessionService: SessionService,
    private inboxNotificationService: InboxNotificationService,
    private taskService: TaskService,
    private userService: UserService,
    private routerService: RouterService,
    private router: Router
  ) {
    this.initialNotificationCount();
  }

  async ngOnInit(): Promise<any> {
    this.currentUser = this.sessionService.currentUser;
    this.menuMap = this.setMenuMap();
    this.landByPermission();
    this.loaderService.exitLoad();
    this.initOption();

    const POLLING_INTERVAL = 3 * 60 * 1000;
    this.subs.add(
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          this.setSelectedMenu(event.url);
        }
      }),
      interval(POLLING_INTERVAL)
        .pipe(
          startWith(0),
          switchMap(() => this.taskService.countUnassignedTasks()),
          takeUntil(this.stopTaskPolling)
        )
        .subscribe(res => {
          if (res) {
            this.taskService.taskPoolCountSubject.next(res);
            this.taskPoolCount = res;
          }
        }),
      this.taskService.taskPoolCountSubject.subscribe(res => {
        this.taskPoolCount = res;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  async initOption() {
    if (this.currentUser?.roleCode === 'ADMIN') {
      const userOption = await this.userService.inquiryUserOptions();
      if (userOption) {
        const viewAsList = userOption
          .filter(
            f => f.subRoleCode !== 'ADMIN' && f.subRoleCode !== 'USER_ADMIN' && f.userId !== this.currentUser?.userId
          )
          .map((m: any) => {
            return {
              text: `${m.userId} -   ${m.title} ${m.name}  ${m.surname}`,
              value: m.userId,
            };
          });
        viewAsList.unshift({
          text: `BU Owner`,
          value: 'ADMIN',
        });
        this.optionValues = viewAsList;
      } else {
        this.optionValues = [];
      }
    }
  }

  private setMenuMap(): Map<string, MenuInfo> {
    /**** TODO: expose dashboard after R1.3 drop 2 ****/
    return new Map<string, MenuInfo>([
      [
        'dashboard',
        {
          topMenu: 'dashboard',
          routePath: MENU_ROUTE_PATH.DASHBOARD,
          show: this.showMenu('dashboard'),
        },
      ],
      [
        'taskPool',
        {
          topMenu: 'taskPool',
          routePath: MENU_ROUTE_PATH.TASK_POOL,
          show: this.showMenu('taskPool'),
        },
      ],
      [
        'task',
        {
          topMenu: 'task',
          routePath: MENU_ROUTE_PATH.TASK,
          show: this.showMenu('task'),
        },
      ],
      [
        'lawsuit',
        {
          topMenu: 'lawsuit',
          routePath: MENU_ROUTE_PATH.LAWSUIT,
          show: this.showMenu('lawsuit'),
        },
      ],
      [
        'customer',
        {
          topMenu: 'customer',
          routePath: MENU_ROUTE_PATH.CUSTOMER,
          show: this.showMenu('customer'),
        },
      ],
      [
        'expense',
        {
          topMenu: 'finance',
          routePath: MENU_ROUTE_PATH.FINANCE_EXPENSE,
          show: this.showMenu('expense'),
        },
      ],
      [
        'receipt',
        {
          topMenu: 'finance',
          routePath: MENU_ROUTE_PATH.FINANCE_RECEIPT,
          show: this.showMenu('receipt'),
        },
      ],
      [
        'advance',
        {
          topMenu: 'finance',
          routePath: MENU_ROUTE_PATH.FINANCE_ADVANCE,
          show: this.showMenu('advance'),
        },
      ],
      [
        'reports',
        {
          topMenu: 'reports',
          routePath: MENU_ROUTE_PATH.REPORT,
          show: this.showMenu('reports'),
        },
      ],
      [
        'dopa',
        {
          topMenu: 'dopa',
          routePath: MENU_ROUTE_PATH.DOPA,
          show: this.showMenu('dopa'),
        },
      ],
      [
        'external-documents',
        {
          topMenu: 'external-documents',
          routePath: MENU_ROUTE_PATH.EXTERNAL_DOCUMENTS,
          show: this.showMenu('external-documents'),
        },
      ],
      [
        'preference',
        {
          topMenu: 'preference',
          routePath: MENU_ROUTE_PATH.PREFERENCE,
          show: this.showMenu('preference'),
        },
      ],
      [
        'user',
        {
          topMenu: 'user',
          routePath: MENU_ROUTE_PATH.USER,
          show: this.showMenu('user'),
        },
      ],
      [
        'config',
        {
          topMenu: 'config',
          routePath: MENU_ROUTE_PATH.CONFIG,
          show: this.showMenu('config'),
        },
      ],
    ]);
  }

  setSelectedMenu(menuItem: string) {
    if (menuItem.includes(MENU_ROUTE_PATH.DASHBOARD)) {
      this.selectedMenu = 'dashboard';
    } else if (menuItem.includes(MENU_ROUTE_PATH.USER)) {
      this.selectedMenu = 'user';
    } else if (menuItem.includes(MENU_ROUTE_PATH.TASK_POOL)) {
      this.selectedMenu = 'taskPool';
    } else if (menuItem.includes(MENU_ROUTE_PATH.TASK)) {
      this.selectedMenu = 'task';
    } else if (menuItem.includes(MENU_ROUTE_PATH.LAWSUIT)) {
      this.selectedMenu = 'lawsuit';
    } else if (menuItem.includes(MENU_ROUTE_PATH.CUSTOMER)) {
      this.selectedMenu = 'customer';
    } else if (menuItem.includes(MENU_ROUTE_PATH.FINANCE_MAIN)) {
      this.selectedMenu = 'finance';
      if (menuItem.includes(MENU_ROUTE_PATH.FINANCE_EXPENSE)) {
        this.selectedSubMenu = 'expense';
      } else if (menuItem.includes(MENU_ROUTE_PATH.FINANCE_RECEIPT)) {
        this.selectedSubMenu = 'receipt';
      } else if (menuItem.includes(MENU_ROUTE_PATH.FINANCE_ADVANCE)) {
        this.selectedSubMenu = 'advance';
      } else {
        this.selectedSubMenu = '';
      }
    } else if (menuItem.includes(MENU_ROUTE_PATH.EXTERNAL_DOCUMENTS)) {
      this.selectedMenu = 'external-documents';
    }
  }

  private showMenu(menuItem: string): boolean {
    if (this.currentUser) {
      switch (menuItem) {
        case 'dashboard': {
          const requiredPerms = [
            LexsUserPermissionCodes.DASHBOARD_CUSTOMERS_DPD_DOC_STATUS,
            LexsUserPermissionCodes.DASHBOARD_CUSTOMERS_LIGITATION_STATUS,
            // LexsUserPermissionCodes.DASHBOARD_NOTICES_RECIPIENT_TYPE,
            // LexsUserPermissionCodes.DASHBOARD_LAWSUIT_COURT_PROCEEDING,
            LexsUserPermissionCodes.DASHBOARD_HOLDING_LITIGATION_CASE,
            LexsUserPermissionCodes.DASHBOARD_KLAW_FINANCIAL,
            // LexsUserPermissionCodes.DASHBOARD_COURT_RECEIVABLES,
            // LexsUserPermissionCodes.DASHBOARD_CUSTOMERS_DOC_UPLOAD,
          ];
          return this.foundSomePermission(requiredPerms);
        }
        case 'taskPool': {
          const requiredPerms = [LexsUserPermissionCodes.ALL_TASK_POOL_ASSIGNMENT];
          return this.foundSomePermission(requiredPerms);
        }
        case 'task': {
          // For MVP1 R1.1, always allow to access Tasks menu
          // MVP1 R1.2, hide Tasks from menu if roleCode = 'USER_ADMIN'
          const requiredPerms = [LexsUserPermissionCodes.ALL_TASK_ACTION];
          return !(this.currentUser?.subRoleCode === 'USER_ADMIN') && this.foundSomePermission(requiredPerms);
        }

        case 'lawsuit': {
          const requiredPerms = [LexsUserPermissionCodes.ALL_LEGAL_ACTION];
          return this.foundSomePermission(requiredPerms);
        }

        case 'customer': {
          const requiredPerms = [LexsUserPermissionCodes.ALL_CUSTOMER_ACTION];
          return this.foundSomePermission(requiredPerms);
        }

        case 'expense': {
          return this.foundEveryPermission([LexsUserPermissionCodes.ALL_EXPENSE]);
        }

        case 'receipt': {
          return this.foundEveryPermission([LexsUserPermissionCodes.ALL_RECEIVE]);
        }

        case 'advance': {
          return this.foundEveryPermission([LexsUserPermissionCodes.ALL_ADVANCE_RECEIVE]);
        }

        case 'reports': {
          const requiredPerms = [LexsUserPermissionCodes.ALL_REPORT];
          return this.foundSomePermission(requiredPerms);
        }

        case 'dopa': {
          const requiredPerms = [LexsUserPermissionCodes.UPDATE_DOPA];
          return this.foundSomePermission(requiredPerms);
        }

        case 'external-documents': {
          const requiredPerms = [LexsUserPermissionCodes.ALL_AUCTION_ONLY_MATCH];
          return this.foundSomePermission(requiredPerms);
        }

        case 'preferance': {
          const requiredPerms = [LexsUserPermissionCodes.ALL_PREFERENCE];
          return this.foundSomePermission(requiredPerms);
        }

        case 'user': {
          return this.currentUser?.subRoleCode === 'USER_ADMIN' || this.currentUser?.roleCode === 'ADMIN';
        }

        case 'config': {
          const requiredPerms = [LexsUserPermissionCodes.ALL_CONFIG];
          return this.foundSomePermission(requiredPerms);
        }

        default:
          return false;
      }
    }
    return false;
  }

  private foundEveryPermission(permsList: string[]): boolean {
    if (!!!permsList) {
      return false;
    }
    return permsList.every(x => {
      return this.currentUser?.permissions?.includes(x);
    });
  }

  private foundSomePermission(permsList: string[]): boolean {
    if (!!!permsList) {
      return false;
    }
    return permsList.some(x => {
      return this.currentUser?.permissions?.includes(x);
    });
  }

  @ViewChild('financeMenuItem') financeMenuItem: any;
  onExpandMenu() {
    this.menuDisplayMode = this.menuDisplayMode === 'side' ? 'over' : 'side';
    if (this.financeMenuItem?.isSubMenuOpened) {
      this.financeMenuItem.toggleSubMenuOpen();
    }
  }

  async onNotificationClick(): Promise<void> {
    if (this.notificationState) {
      await this.onPanelClose();
    } else {
      this.notificationState = !this.notificationState;
    }
  }

  onCloseNotification(): void {
    this.notificationState = false;
  }

  @ViewChild('notificationComponent')
  notificationComponent!: InboxNotificationComponent;
  async onPanelClose(): Promise<void> {
    if (this.notificationComponent.readMessages.length > 0) {
      await this.notificationComponent.submitMarkReadRequest(this.notificationComponent.readMessages).then(async () => {
        this.notificationComponent.onUpdateNotificationCount();
        await this.notificationComponent.fetchMessages(MESSAGE_STATUS.UNREAD);
      });
      this.notificationComponent.readMessages = [];
    }
    this.notificationState = false;
  }

  onExpandFinanceMenu() {
    this.menuDisplayMode = this.menuDisplayMode === 'side' ? 'over' : 'side';
    if (!this.financeMenuItem?.isSubMenuOpened) {
      this.financeMenuItem.isSubMenuOpened = true;
    } else {
      this.financeMenuItem.isSubMenuOpened = false;
    }
  }

  onSelectMenu(e: string) {
    const menuInfo = this.menuMap?.get(e);

    this.selectedMenu = menuInfo?.topMenu || e || '';
    if (!!menuInfo?.routePath) {
      this.routerService.navigateTo(menuInfo.routePath);
      if (e === 'expense' || e === 'receipt' || e === 'advance') {
        this.onExpandFinanceMenu();
      } else {
        if (this.menuDisplayMode === 'over') this.menuDisplayMode = 'side';
        if (!!this.financeMenuItem.isSubMenuOpened) this.financeMenuItem.isSubMenuOpened = false;
      }
    }
  }

  landByPermission() {
    if (this.showMenu('dopa')) {
      this.selectedMenu = 'dopa';
      this.routerService.navigateTo(MENU_ROUTE_PATH.DOPA);
    } else {
      /******* For MVP1 until R1.3 drop 1 , Dashboard is not covered in scope then always go to 'Tasks' ******/
      // TODO: Open this block in R1.3 drop 2 (replace below block)
      // Default is landing to Dashboard, following is to verify if no permission
      if (!this.showMenu('dashboard')) {
        if (this.showMenu('task')) {
          this.selectedMenu = 'task';
          // always land to 'Tasks' because always show Task menu item, no need to verify other permission unless story LEXS-33 includes change sequence of landing screen to be displayed
          this.routerService.navigateTo(MENU_ROUTE_PATH.TASK);
        } else if (this.showMenu('user')) {
          // Only for role 'USER_ADMIN'
          this.selectedMenu = 'user';
          this.routerService.navigateTo(MENU_ROUTE_PATH.USER);
        }
      } else {
        this.selectedMenu = 'dashboard';
        this.routerService.navigateTo(MENU_ROUTE_PATH.DASHBOARD);
      }
      // // END: Block for R1.3 drop 2

      // if (this.showMenu('task')) {
      //   this.selectedMenu = 'task';
      //   // always land to 'Tasks' because always show Task menu item, no need to verify other permission unless story LEXS-33 includes change sequence of landing screen to be displayed
      //   this.routerService.navigateTo(MENU_ROUTE_PATH.TASK);
      // } else if (this.showMenu('user')) {
      //   // Only for role 'USER_ADMIN'
      //   this.selectedMenu = 'user';
      //   this.routerService.navigateTo(MENU_ROUTE_PATH.USER);
      // }
    }
  }

  async onClickLogout() {
    this.isUserExpand = false;
    return await this.sessionService.logout();
  }

  onSelectViewAs(val: any) {
    this.sessionService.viewAs = !!val ? val : undefined;
    // If have switch view as user, will be navigate to main menu
    if (this.routerService.currentStack.length > 0) {
      const mainMenu =
        this.routerService.currentStack[0] === MAIN_ROUTES.MAIN
          ? this.routerService.currentStack[1]
          : this.routerService.currentStack[0];
      this.routerService.navigateTo(mainMenu);
    } else {
      const curPathItems = this.routerService.currentRoute.split('/');
      const routingTo = this.menuMap?.get(curPathItems[2])?.routePath || '/';
      this.routerService.navigateTo(routingTo);
      this.sessionService.viewAsFetchData.getValue() !== val && this.sessionService.viewAsFetchData.next(val);
    }
  }

  initialNotificationCount(): void {
    this.inboxNotificationService.notificationCount$.subscribe({
      next: count => {
        this.notificationCount = count;
      },
    });
  }

  async onSubmitReadMessages(): Promise<void> {
    this.notificationState = false;
  }
}
