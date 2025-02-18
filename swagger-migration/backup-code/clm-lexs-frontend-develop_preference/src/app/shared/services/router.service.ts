import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RoutesRecognized,
} from '@angular/router';
import { BehaviorSubject, Observable, merge, of, filter, first, mergeMap, pairwise } from 'rxjs';
import {
  CUSTOMER_DETAIL_ROUTES,
  EXCEPT_PATH,
  LAWSUIT_DETAIL_ROUTES,
  MAIN_ROUTES,
  MENU_ROUTE_PATH,
  ROOT_ROUTES,
} from '../constant';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private stateObj = { login: 1 };
  private stack: string[] = [];
  private exceptPath: string[] = [];
  private paramMapping = new Map<string, any>();
  private _previousUrl: string = '';
  private mainRouting = Object.values(MENU_ROUTE_PATH).map(val => {
    return val;
  });

  public onReloadUrl: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public fromNotiMenu = false;
  public eventPopstate!: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private logger: LoggerService
  ) {
    const ignorePath = [
      MAIN_ROUTES.MAIN,
      CUSTOMER_DETAIL_ROUTES.MAIN,
      CUSTOMER_DETAIL_ROUTES.ACCOUNT_DETAIL,
      LAWSUIT_DETAIL_ROUTES.ACCOUNT_DETAIL,
      LAWSUIT_DETAIL_ROUTES.ADD_RELATED_PERSON_LEGAL,
    ];
    Object.entries(EXCEPT_PATH).map(el => {
      return !ignorePath.includes(el[1]) && this.exceptPath.push(el[1]);
    });
    router.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        this.logger.navigation('Start :: ', val.id, val.url, val.restoredState);
        this.eventPopstate = val.navigationTrigger === 'popstate';
        this._nextUrl = val.url;
      }
      if (val instanceof NavigationError) {
        // If NavigationError or NavigationCancel will be pop next url out of stack
        this.logger.error('Error :: ', val.id, val.url, val);
        this.stack.pop();
      }
      if (val instanceof NavigationCancel) {
        this.logger.error('Cancel :: ', val.id, val.url, val);
        // if (val.reason === '') {
        //   // reason is empty as is NavigationCancel via event
        //   // should be reverse stack to currently
        //   const _current: string = this.currentRoute.split('?')[0] || '';
        //   const _findIndexCurrentRoute = this.stack.findIndex(i => i === _current);
        //   if (_findIndexCurrentRoute === -1) {
        //     this.pushStack(_current);
        //   } else {
        //     this.stack = this.stack.slice(0, _findIndexCurrentRoute + 1);
        //   }
        //   this.logger.info('NavigationCancel :: current stack :: ', this.stack);
        // }
      }
      if (val instanceof NavigationEnd) {
        this.logger.navigation('End :: ', val.id, val.url);
      }
      window.scrollTo(0, 0);
      if (this.stack.length > 0 && this.stack[0] === '/login') {
        this.stack = this.stack.filter(path => path !== '/login');
      }
    });
    router.events
      .pipe(
        filter((e: any) => e instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((e: any) => {
        this.previousUrl = e[0].urlAfterRedirects;
      });
  }

  get paramMapp(): Map<string, any> {
    return this.paramMapping;
  }

  get currentStack(): string[] {
    return this.stack;
  }

  get currentRoute(): string {
    return this.router.url;
  }

  private _nextUrl!: string;
  get nextUrl(): string {
    return this._nextUrl;
  }

  get previousUrl(): string {
    return this._previousUrl;
  }

  get activeRoute() {
    return this.activatedRoute;
  }

  set previousUrl(value: string) {
    this._previousUrl = value;
  }

  get navigateFormTaskMenu() {
    return this.previousUrl.startsWith(MENU_ROUTE_PATH.TASK);
  }

  get navigateFormFinanceMenu() {
    const isFormFinanceMenu =
      this.stack[0] === ROOT_ROUTES.MAIN &&
      [
        MENU_ROUTE_PATH.FINANCE_MAIN,
        MENU_ROUTE_PATH.FINANCE_EXPENSE,
        MENU_ROUTE_PATH.FINANCE_RECEIPT,
        MENU_ROUTE_PATH.FINANCE_RECEIPT,
      ].includes(this.stack[1]);
    return isFormFinanceMenu;
  }

  get navigateFrommExternalDocumentMenu() {
    const isExternalDocument =
      this.stack[0] === ROOT_ROUTES.MAIN && [MENU_ROUTE_PATH.EXTERNAL_DOCUMENTS].includes(this.stack[1]);
    return isExternalDocument;
  }

  resetRoutingPath(path: string) {
    // reset stack if path as is mainRouting
    this.stack = [];
    this.pushStack('/main');
    this.pushStack(path);
  }

  navigateTo(path: string, params?: any) {
    if (this.validatePath(path) && this.isNotTabPath(path)) {
      if (this.mainRouting.includes(!path.startsWith('/') ? '/' + path : path)) {
        this.resetRoutingPath(!path.startsWith('/') ? '/' + path : path);
      } else {
        this.pushStack(path.split('?')[0]);
      }
    } else {
      if (this.mainRouting.includes(!path.startsWith('/') ? '/' + path : path)) {
        this.resetRoutingPath(!path.startsWith('/') ? '/' + path : path);
      } else {
        this.stack = this.stack.length > 0 ? this.stack : [];
      }
    }
    if (params) {
      this.paramMapping.set(path, params);
      this.router.navigate([path], { queryParams: params, skipLocationChange: true });
    } else {
      this.router.navigate([path], { skipLocationChange: true });
    }
    this.fromNotiMenu = false;
    this.logger.info('navigateTo :: current stack :: ', this.stack);
  }

  back(_checkCrossMenu: boolean = true) {
    if (this.navigateFormFinanceMenu || this.navigateFrommExternalDocumentMenu) {
      this.popStack();
    } else if (this.currentStack[this.currentStack.length - 2].includes(MENU_ROUTE_PATH.DASHBOARD)) {
      this.popStack();
    } else {
      const stack1 = this.currentStack[this.currentStack.length - 1].split('/');
      const indexStack1 = stack1.findIndex(i => i === 'main');
      const stack2 = this.currentStack[this.currentStack.length - 2].split('/');
      const indexStack2 = stack2.findIndex(i => i === 'main');
      const isCross = stack1[indexStack1 + 1] !== stack2[indexStack2 + 1];
      if (_checkCrossMenu && isCross) {
        if (isCross && this.currentRoute.includes(MENU_ROUTE_PATH.LAWSUIT)) {
          // For support cross menu to LAWSUIT DETAIL, back to LAWSUIT menu
          this.navigateTo(MENU_ROUTE_PATH.LAWSUIT);
        } else if (this.currentRoute.includes(MENU_ROUTE_PATH.CUSTOMER)) {
          // For support cross menu to CUSTOMER DETAIL, back to CUSTOMER menu
          this.navigateTo(MENU_ROUTE_PATH.CUSTOMER);
        } else {
          // Else condition pop lasted path out of stack
          this.popStack();
        }
      } else {
        this.popStack();
      }
    }
    this.logger.info('back :: current stack :: ', this.stack);
  }

  findRootMenu(path: string) {
    return `${path.split('/')[1]}/${path.split('/')[2]}`;
  }

  pushStack(path?: string) {
    if (this.fromNotiMenu) {
      const rootMenu = this.findRootMenu(path || this.router.url);
      if (this.stack[this.stack.length - 1] !== rootMenu) {
        this.stack.push(rootMenu);
      }
    } else {
      if (path) {
        this.stack.push(path);
      } else {
        this.stack.push(this.router.url);
      }
    }
  }

  popStack() {
    if (this.stack.length === 0) return;
    if (
      this.currentRoute.split('?')[0] === this.stack.slice(-1)[0].split('?')[0] || // check current path as is back path stack
      this.exceptPath.includes(this.currentRoute.split('?')[0].replace(/[0-9]/g, '')) || // validate is exceptPath
      !this.isNotTabPath(this.currentRoute.split('?')[0].replace(/[0-9]/g, ''))
    ) {
      this.stack.pop(); // pop path exceptPath / current path
    }
    const url = this.stack.slice(-1)[0].split('?')[0];
    this.stack = this.stack.splice(0, this.stack.length);
    const params = this.paramMapping.get(url);
    params
      ? this.router.navigate([url], { queryParams: params, skipLocationChange: true })
      : this.router.navigate([url], { skipLocationChange: true });
    this.fromNotiMenu = false;
    this.logger.info('back :: current stack :: ', this.stack);
  }

  backOnIndex(stack: number) {
    if (this.stack.length === 0) return;

    if (
      this.currentRoute.split('?')[0] === this.stack.slice(-1)[0].split('?')[0] || // check current path as is back path stack
      this.exceptPath.includes(this.currentRoute.split('?')[0].replace(/[0-9]/g, '')) || // validate is exceptPath
      this.isNotTabPath(this.currentRoute.split('?')[0].replace(/[0-9]/g, ''))
    ) {
      for (let index = 0; index < stack; index++) {
        this.stack.pop();
      }
    }
    const url = this.stack.slice(-1)[0].split('?')[0];
    this.stack = this.stack.splice(0, this.stack.length);
    const params = this.paramMapping.get(url);
    params
      ? this.router.navigate([url], { queryParams: params, skipLocationChange: true })
      : this.router.navigate([url], { skipLocationChange: true });
    this.fromNotiMenu = false;
    this.logger.info('back :: current stack :: ', this.stack);
  }

  navigateByUrl(path: string) {
    this.validatePath(path) && this.isNotTabPath(path) ? this.pushStack() : (this.stack = []);
    this.fromNotiMenu = false;
    return this.router.navigateByUrl(path, { skipLocationChange: true });
  }

  parseUrl(path: string) {
    this.validatePath(path) && this.isNotTabPath(path) ? this.pushStack() : (this.stack = []);
    return this.router.parseUrl(path);
  }

  navigate(path: string) {
    this.validatePath(path) && this.isNotTabPath(path) ? this.pushStack() : (this.stack = []);
    this.fromNotiMenu = false;
    return this.router.navigate([path], { skipLocationChange: true });
  }

  isNotTabPath(path: string) {
    const _splitPath = path.split('/');
    const _lastIndex = _splitPath[_splitPath.length - 1];
    const _isNavTabPath = _lastIndex.startsWith('nav-tab') && _lastIndex.endsWith('info-tab');
    const _isNavSubTabPath = _lastIndex.startsWith('nav-sub-tab') && _lastIndex.endsWith('info-tab');
    const _isNavUnderSubTabPath = _lastIndex.startsWith('nav-under-sub-tab') && _lastIndex.endsWith('info-tab');
    return !(_isNavTabPath || _isNavSubTabPath || _isNavUnderSubTabPath);
  }

  validatePath(path: string) {
    const result = !this.exceptPath.includes(path.replace(/[0-9]/g, ''));
    if (this.currentRoute === path && !result) this.onReloadUrl.next(path);
    return result;
  }

  change(name: string) {
    const data = this.findFirstData(this.activatedRoute.snapshot, name);
    const obs = this.router.events.pipe(
      filter(it => it instanceof NavigationEnd),
      mergeMap(() => this.getFirstData(name))
    );
    if (data) {
      return merge(of(data), obs);
    } else {
      return obs;
    }
  }

  private findFirstData(route: ActivatedRouteSnapshot, name: string): any {
    if (route.children) {
      for (const child of route.children) {
        const result = this.findFirstData(child, name);
        if (result) {
          return result;
        }
      }
    }
    if (route.data && route.data[name]) {
      return route.data;
    }
    return null;
  }

  private getFirstData(name: string) {
    const items: Observable<any>[] = [];
    addData(this.activatedRoute);
    return merge(...items).pipe(
      filter(it => it[name]),
      first()
    );

    function addData(route: ActivatedRoute) {
      if (route.children) {
        for (const child of route.children) {
          addData(child);
        }
      }
      items.push(route.data);
    }
  }

  addHistory() {
    history.pushState({}, '', 'login');
  }
}
