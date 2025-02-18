import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrepareLawsuitService {
  private _currentTab = 0;
  public get currentTab(): number {
    return this._currentTab;
  }
  public set currentTab(value: number) {
    this._currentTab = value;
  }

  public refreshInquiryNotices = new BehaviorSubject<boolean>(false);

  constructor() {}
}
