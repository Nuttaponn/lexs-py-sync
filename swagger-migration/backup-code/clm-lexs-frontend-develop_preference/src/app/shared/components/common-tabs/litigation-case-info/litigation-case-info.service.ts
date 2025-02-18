import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LitigationCaseInfoService {
  private _currentTab = 0;
  public get currentTab(): number {
    return this._currentTab;
  }
  public set currentTab(value: number) {
    this._currentTab = value;
  }

  constructor() {}
}
