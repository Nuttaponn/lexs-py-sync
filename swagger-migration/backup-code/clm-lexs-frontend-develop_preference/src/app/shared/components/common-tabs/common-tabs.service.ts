import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonTabsService {
  public tabNavigateTo: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public subTabNavigateTo: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public accountDebtBanner: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public underTabNavigateTo: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() {}
}
