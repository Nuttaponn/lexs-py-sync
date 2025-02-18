import { Component, Input, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { LitigationCaseInfoService } from './litigation-case-info.service';

@Component({
  selector: 'app-litigation-case-info',
  templateUrl: './litigation-case-info.component.html',
  styleUrls: ['./litigation-case-info.component.scss'],
})
export class LitigationCaseInfoComponent implements OnInit {
  public _tabIndex: number = 0;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('tabIndex')
  set tabIndex(val: number) {
    this._tabIndex = val || this._tabIndex;
  }

  public blackCaseNo!: string;
  public litigationId: string = '';

  constructor(
    private lawsuitService: LawsuitService,
    private litigationCaseInfoService: LitigationCaseInfoService,
    private route: ActivatedRoute
  ) {
    this.litigationId = this.lawsuitService.currentLitigation.litigationId || '';
    if (this.route?.snapshot?.queryParams['blackCaseNo']) {
      this.blackCaseNo = this.route?.snapshot?.queryParams['blackCaseNo'];
    }
  }

  ngOnInit(): void {
    this.tabIndex = this.litigationCaseInfoService.currentTab;
    if (this.tabIndex !== 0) this.onTabChanged(this.tabIndex);
  }

  onTabChanged(event: MatTabChangeEvent | number) {
    if (event) {
      this._tabIndex = typeof event === 'number' ? event : event.index;
    } else {
      this._tabIndex = 0;
    }
    this.litigationCaseInfoService.currentTab = this._tabIndex;
  }
}
