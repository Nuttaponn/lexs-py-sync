import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface IDashboardTab {
  label: string;
  count: number;
  color: string;
  subTabs?: IDashboardTab[];
}

@Component({
  selector: 'app-dashboard-tab',
  templateUrl: './dashboard-tab.component.html',
  styleUrls: ['./dashboard-tab.component.scss'],
})
export class DashboardTabComponent {
  constructor() {}

  @Input() tabs: IDashboardTab[] = [];
  @Input() currentTab: number = 0;
  @Input() currentSubTab: number | null = null;

  @Output() tabChange = new EventEmitter<number>();
  @Output() subTabChange = new EventEmitter<number | null>();

  onTabChange(index: number) {
    this.tabChange.emit(index);
  }

  onSubTabChange(index: number | null) {
    this.subTabChange.emit(index);
  }
}
