import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, merge, of, filter, first, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutingDataService {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  change(name: string) {
    const data = this.findFirstData(this.activatedRoute.snapshot, name);
    const obs = this.router.events.pipe(
      filter(it => it instanceof NavigationEnd),
      mergeMap(_ => this.getFirstData(name))
    );
    if (data) {
      return merge(of(data), obs);
    } else {
      return obs;
    }
  }

  private findFirstData(route: ActivatedRouteSnapshot, name: string) {
    if (route.children) {
      for (const child of route.children) {
        const result: any = this.findFirstData(child, name);
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
}
