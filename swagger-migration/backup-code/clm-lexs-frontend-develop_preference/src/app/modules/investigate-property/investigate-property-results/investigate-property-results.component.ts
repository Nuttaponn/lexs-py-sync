import { Component, Input, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-investigate-property-results',
  templateUrl: './investigate-property-results.component.html',
  styleUrls: ['./investigate-property-results.component.scss'],
})
export class InvestigatePropertyResultsComponent implements OnInit {
  @Input() data: any = undefined;
  public tabIndex = 0;

  public assetList: any[] = [];
  public venhicleList: any[] = [];
  currentTabIndex: Subject<number> = new Subject();

  constructor() {}

  ngOnInit(): void {
    const _inspectionAssets = this.data?.inspectionAssets || [];
    this.assetList = _inspectionAssets?.filter((it: any) => !['19'].includes(it.collTypeCode || ''));
    this.venhicleList = _inspectionAssets?.filter((it: any) => ['19'].includes(it.collTypeCode || ''));
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.tabIndex = Number(event.tab.textLabel);
    this.currentTabIndex.next(this.tabIndex);
  }
}
